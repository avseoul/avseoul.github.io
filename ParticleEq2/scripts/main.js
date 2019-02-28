let bufferWidth, bufferHeight = bufferWidth, bufferSize = bufferWidth * bufferHeight;

let gridTexSize = 512;
let gridWidth = Math.cbrt(Math.pow(gridTexSize, 2));
let gridHalfWidth = gridWidth / 2;
let numGridSliceInGridTexWidth = gridTexSize / gridWidth;

let SHADER = {

    OPTICAL_FLOW: { VERT: null, FRAG: null },
    BEHAVIOURS: { VERT: null, FRAG: null },
    UNIFORM_GRID: { VERT: null, FRAG: null },
    DEBUG_TEXTURE: { VERT: null, FRAG: null },
    RENDER: { VERT: null, FRAG: null },
    BLUR_PASS: { VERT: null, FRAG: null }
}

let TEXTURE = {
    NORMAL_MAP: { IMAGE: null, TEXTURE: null },
    WEBCAM: { IMAGE: null, TEXTURE: null, PREV_TEXTURE: null },
    CUBEMAP: { IMAGES: { PX: null, NX: null, PY: null, NY: null, PZ: null, NZ: null }, TEXTURE: null }
}

let gl;

let renderer;
let camera;

let particleRender;
let opticalFlow;
let blurPass;
let mainLight;

let audioAnalyzer;

let stats;
let ctrl;
let ctrlParams = {

    // debug
    ShowStats: true,
    ShowDebug: true,
    DebugThumbnailSize: 50,

    // particle
    ParticleDensity: 32,
    SphereResolution: 24,

    // force
    AudioGain: 7000,
    GlobalGravity: .057,
    LocalGravity: .45,
    OrbitAcc: .47,
    RandomAcc: 7.,
    
    RandomScalePop: 0.6,
    
    KeepInSphere: false,
    SphereRadius: 18,
    
    ScaleDamping: .93,
    
    TimeDelta: .016,
    MaxVel: 12.,

    ParticleScaleFactor: 1.,
    Ambient: .0,
    Diffuse: .23,
    Fill: 0., 
    Back: .1, 
    Fresnel: .2,
    Gamma: 4.2,
    isBW: true
}

let frame = 0;

let Init = function () {

    Redirect2HTTPS();

    // load resources
    Promise.all([

        GLHelpers.loadShader("shaders/behaviours.vert"), // 0 
        GLHelpers.loadShader("shaders/behaviours.frag"), // 1
        GLHelpers.loadShader("shaders/uniformGrid.vert"), // 2
        GLHelpers.loadShader("shaders/uniformGrid.frag"), // 3
        GLHelpers.loadShader("shaders/unitQuadPass.vert"), // 4
        GLHelpers.loadShader("shaders/debugTexture.frag"), // 5
        GLHelpers.loadShader("shaders/opticalFlow.frag"), // 6
        GLHelpers.loadShader("shaders/frostyBlur.frag"), // 7
        GLHelpers.loadShader("shaders/render.vert"), // 8
        GLHelpers.loadShader("shaders/render.frag"), // 9
        GLHelpers.loadTexture("../common/assets/normal.jpg"), // 10
        GLHelpers.loadTexture("../common/assets/xn.png"), // 11
        GLHelpers.loadTexture("../common/assets/xp.png"), // 12
        GLHelpers.loadTexture("../common/assets/yn.png"), // 13
        GLHelpers.loadTexture("../common/assets/yp.png"), // 14
        GLHelpers.loadTexture("../common/assets/zn.png"), // 15
        GLHelpers.loadTexture("../common/assets/zp.png"), // 16
        GLHelpers.initWebcam() // 17
    ])
        .then(
            (res) => {

                SHADER.BEHAVIOURS.VERT = res[0].target.response;
                SHADER.BEHAVIOURS.FRAG = res[1].target.response;

                SHADER.UNIFORM_GRID.VERT = res[2].target.response;
                SHADER.UNIFORM_GRID.FRAG = res[3].target.response;

                SHADER.DEBUG_TEXTURE.VERT = res[4].target.response;
                SHADER.DEBUG_TEXTURE.FRAG = res[5].target.response;

                SHADER.OPTICAL_FLOW.VERT = res[4].target.response;
                SHADER.OPTICAL_FLOW.FRAG = res[6].target.response;

                SHADER.BLUR_PASS.VERT = res[4].target.response;
                SHADER.BLUR_PASS.FRAG = res[7].target.response;

                SHADER.RENDER.VERT = res[8].target.response;
                SHADER.RENDER.FRAG = res[9].target.response;

                TEXTURE.NORMAL_MAP.IMAGE = res[10].path[0];

                TEXTURE.CUBEMAP.IMAGES.PX = res[11].path[0];
                TEXTURE.CUBEMAP.IMAGES.NX = res[12].path[0];
                TEXTURE.CUBEMAP.IMAGES.PY = res[13].path[0];
                TEXTURE.CUBEMAP.IMAGES.NY = res[14].path[0];
                TEXTURE.CUBEMAP.IMAGES.PZ = res[15].path[0];
                TEXTURE.CUBEMAP.IMAGES.NZ = res[16].path[0];

                TEXTURE.WEBCAM.IMAGE = res[17];
            }
        ).then(
            () => {

                SetBufferSize(ctrlParams.ParticleDensity);

                // init app
                renderer = new Renderer();
                gl = renderer.ctx;

                camera = new THREE.PerspectiveCamera(50, renderer.canvas.width / renderer.canvas.height, 1, 500);
                camera.position.x = 18;
                camera.position.y = 18;
                camera.position.z = 18;
                camera.up = new THREE.Vector3(0, 1, 0);
                camera.lookAt(new THREE.Vector3(0, 0, 0));

                mainLight = new MainLight({

                    renderer: renderer,
                    shadowMapSize: 2048,
                    near: 5,
                    far: 500
                });
                mainLight.position.x = 40;
                mainLight.position.y = 30;
                mainLight.position.z = 50;
                mainLight.up = new THREE.Vector3(0, 1, 0);
                mainLight.lookAt(new THREE.Vector3(0, 0, 0));

                // create textures
                TEXTURE.NORMAL_MAP.TEXTURE = GLHelpers.createImageTexture(gl, TEXTURE.NORMAL_MAP.IMAGE);

                // create cubemap
                TEXTURE.CUBEMAP.TEXTURE = GLHelpers.createCubemapTexture(gl, TEXTURE.CUBEMAP.IMAGES);

                // webcam
                TEXTURE.WEBCAM.TEXTURE = GLHelpers.createImageTexture(gl, TEXTURE.WEBCAM.IMAGE);
                TEXTURE.WEBCAM.PREV_TEXTURE = GLHelpers.createImageTexture(gl, TEXTURE.WEBCAM.IMAGE);

                // audio input
                audioAnalyzer = new AudioAnalyzer(ctrlParams.AudioGain);

                console.log(gridTexSize, gridWidth, gridHalfWidth, numGridSliceInGridTexWidth);

                let params = {

                    camera: camera,
                    light: mainLight,
                    renderer: renderer,
                    bufferWidth: bufferWidth,
                    bufferHeight: bufferHeight,
                    gridTexSize: gridTexSize,
                    gridWidth: gridWidth,
                    gridHalfWidth: gridHalfWidth,
                    numGridSliceInGridTexWidth: numGridSliceInGridTexWidth,
                    audioAnalyzer: audioAnalyzer
                }

                opticalFlow = new OpticalFlow({

                    renderer: renderer,
                    camWidth: TEXTURE.WEBCAM.IMAGE.videoWidth,
                    camHeight: TEXTURE.WEBCAM.IMAGE.videoHeight,
                    bufferWidth: bufferWidth,
                    bufferHeight: bufferHeight,
                    webcamTexture: TEXTURE.WEBCAM.TEXTURE,
                    prevWebcamTexture: TEXTURE.WEBCAM.PREV_TEXTURE
                });

                particleRender = new ParticleRender(params);
                particleRender.webcamTexture = TEXTURE.WEBCAM.TEXTURE;
                particleRender.opticalFlowTexture = opticalFlow.renderTexture;

                blurPass = new BlurPassRender({

                    renderer: renderer,
                    particleRenderTexture: particleRender.renderTexture,
                    webcamTexture: TEXTURE.WEBCAM.TEXTURE,
                    opticalFlowTexture: opticalFlow.renderTexture
                });

                // stat
                stats = new Stats();
                document.body.appendChild(stats.dom);

                // dat gui
                {
                    ctrl = new dat.GUI();

                    ctrl.add(ctrlParams, 'AudioGain', 0, 10000).onChange(

                        (val) => {
                            
                            audioAnalyzer.set_gain(val);
                        }
                    );

                    let ctrlDebug = ctrl.addFolder('Debug');

                    ctrlDebug.add(ctrlParams, 'ShowStats').onFinishChange(

                        (val) => {

                            stats.dom.style.display = val ? 'block' : 'none'
                        }
                    );

                    ctrlDebug.add(ctrlParams, 'ShowDebug').onFinishChange(

                        (val) => ctrlParams.ShowDebug = val
                    );

                    ctrlDebug.add(ctrlParams, 'DebugThumbnailSize', 50, 200).onChange(

                        (val) => particleRender.thumbnailSize = val
                    );

                    let ctrlGlobal = ctrl.addFolder('Particle Global');

                    ctrlGlobal.add(ctrlParams, 'ParticleDensity', [16, 32, 64, 128, 256, 512, 1024]).onChange(

                        (val) => {

                            SetBufferSize(val);
                            Reset();
                        }
                    );

                    ctrlGlobal.add(ctrlParams, 'SphereResolution', [4, 8, 16, 24, 32]).onChange(

                        (val) => {

                            particleRender.particleSystem._buildUnitSphere(val);
                            Reset();
                        }
                    );

                    ctrlGlobal.add(ctrlParams, 'ParticleScaleFactor', .1, 2).onChange(

                        (val) => {
                            
                            particleRender.particleSystem.particleScaleFactor = val;
                            particleRender.particleSystem.updateCtrlParams();
                        }
                    );

                    let ctrlForce = ctrl.addFolder('Particle Forces');

                    ctrlForce.add(ctrlParams, 'GlobalGravity', 0, .5).onChange(

                        (val) => {
                            
                            particleRender.particleBehaviours.globalGravity = val;
                            particleRender.particleBehaviours.updateCtrlParams();
                        }
                    );

                    ctrlForce.add(ctrlParams, 'LocalGravity', 0, 1).onChange(

                        (val) => {
                            
                            particleRender.particleBehaviours.localGravity = val;
                            particleRender.particleBehaviours.updateCtrlParams();
                        }
                    );

                    ctrlForce.add(ctrlParams, 'OrbitAcc', 0, 1).onChange(

                        (val) => {
                            
                            particleRender.particleBehaviours.orbitAcc = val;
                            particleRender.particleBehaviours.updateCtrlParams();
                        }
                    );

                    ctrlForce.add(ctrlParams, 'RandomAcc', 0, 10).onChange(

                        (val) => {
                            
                            particleRender.particleBehaviours.randomAcc = val;
                            particleRender.particleBehaviours.updateCtrlParams();
                        }
                    );

                    ctrlForce.add(ctrlParams, 'RandomScalePop', 0., 10.).onChange(

                        (val) => {
                            
                            particleRender.particleBehaviours.randomScalePop = val;
                            particleRender.particleBehaviours.updateCtrlParams();
                        }
                    );

                    ctrlForce.add(ctrlParams, 'KeepInSphere').onFinishChange(

                        (val) => {
                            
                            particleRender.particleBehaviours.keepInSphere = val ? 1 : 0;
                            particleRender.particleBehaviours.updateCtrlParams();
                        }
                    );

                    ctrlForce.add(ctrlParams, 'SphereRadius', 0., 64.).onChange(

                        (val) => {
                            
                            particleRender.particleBehaviours.sphereRadius = val;
                            particleRender.particleBehaviours.updateCtrlParams();
                        }
                    );

                    ctrlForce.add(ctrlParams, 'ScaleDamping', .9, 1.).onChange(

                        (val) => {
                            
                            particleRender.particleBehaviours.scaleDamping = val;
                            particleRender.particleBehaviours.updateCtrlParams();
                        }
                    );

                    ctrlForce.add(ctrlParams, 'TimeDelta', 0., .1).onChange(

                        (val) => {
                            
                            particleRender.particleBehaviours.timeDelta = val;
                            particleRender.particleBehaviours.updateCtrlParams();
                        }
                    );

                    ctrlForce.add(ctrlParams, 'MaxVel', 0., 50).onChange(

                        (val) => {
                            
                            particleRender.particleBehaviours.maxVel = val;
                            particleRender.particleBehaviours.updateCtrlParams();
                        }
                    );

                    let ctrlLighting = ctrl.addFolder('Particle Shading and Lighting');

                    ctrlLighting.add(ctrlParams, 'Ambient', .0, 2).onChange(

                        (val) => {
                            
                            particleRender.particleSystem.ambient = val;
                            particleRender.particleSystem.updateCtrlParams();
                        }
                    );

                    ctrlLighting.add(ctrlParams, 'Diffuse', 0, 2).onChange(

                        (val) => {
                            
                            particleRender.particleSystem.diffuse = val;
                            particleRender.particleSystem.updateCtrlParams();
                        }
                    );

                    ctrlLighting.add(ctrlParams, 'Fill', 0, 2).onChange(

                        (val) => {
                            
                            particleRender.particleSystem.fill = val;
                            particleRender.particleSystem.updateCtrlParams();
                        }
                    );

                    ctrlLighting.add(ctrlParams, 'Back', 0, 2).onChange(

                        (val) => {
                            
                            particleRender.particleSystem.back = val;
                            particleRender.particleSystem.updateCtrlParams();
                        }
                    );

                    ctrlLighting.add(ctrlParams, 'Fresnel', 0, 2).onChange(

                        (val) => {
                            
                            particleRender.particleSystem.fresnel = val;
                            particleRender.particleSystem.updateCtrlParams();
                        }
                    );

                    ctrlLighting.add(ctrlParams, 'Gamma', .45, 4.22).onChange(

                        (val) => {
                            
                            particleRender.particleSystem.gamma = val;
                            particleRender.particleSystem.updateCtrlParams();
                        }
                    );

                    ctrlLighting.add(ctrlParams, 'isBW').onFinishChange(

                        (val) => {
                            
                            particleRender.particleSystem.isBW = val ? 1 : 0;
                            particleRender.particleSystem.updateCtrlParams();
                        }
                    );
                } 

                Update();

                isInit = true;
            }
        );
}

let Update = function () {

    audioAnalyzer.update();
    // console.log(audioAnalyzer.get_level(), audioAnalyzer.get_high(), audioAnalyzer.get_mid(), audioAnalyzer.get_bass());

    // update camera 
    // const camSpeed = frame * .006;
    // 
    // var n_loc = new THREE.Vector3(
    //     Math.sin(camSpeed), Math.cos(camSpeed * .9) * Math.sin(camSpeed * .7), Math.cos(camSpeed))
    //     .normalize()
    //     .multiplyScalar( gridWidth + gridWidth * 2. * Math.sin(2. * camSpeed) );

    // camera.position.copy(n_loc);
    // camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
    // camera.updateProjectionMatrix();
    // camera.updateMatrixWorld(true);

    GLHelpers.updateWebCamTexture(gl, TEXTURE.WEBCAM.IMAGE, TEXTURE.WEBCAM.TEXTURE);
    opticalFlow.update();
    GLHelpers.updateWebCamTexture(gl, TEXTURE.WEBCAM.IMAGE, TEXTURE.WEBCAM.PREV_TEXTURE);

    particleRender.update();
    particleRender.render();

    if (ctrlParams.ShowDebug) particleRender.debug();

    blurPass.render();

    stats.update();

    frame++;

    requestAnimationFrame(Update);
}

let SetBufferSize = function (val) {

    bufferWidth = val, bufferHeight = bufferWidth, bufferSize = bufferWidth * bufferHeight;
}

let Reset = function () {

    const params = {

        bufferWidth: bufferWidth,
        bufferHeight: bufferHeight,
        bufferSize: bufferSize
    }

    particleRender.reset(params);
}

let OnWindowResize = function () {

    renderer.resize();

    camera.aspect = renderer.canvas.width / renderer.canvas.height;
    camera.updateProjectionMatrix();
}

let OnKeyDown = function (evt) {

    if (evt.code === 'Space') {

    }
}

let Redirect2HTTPS = function () {

    if (window.location.protocol == 'http:' && window.location.hostname != "localhost") {

        window.open("https://" + window.location.hostname + window.location.pathname, '_top');
    }
}

let OnDestroy = function () {

    particleRender.destroy();
}

window.addEventListener("beforeunload", OnDestroy, false);
window.addEventListener('resize', OnWindowResize, false);
document.addEventListener('DOMContentLoaded', Init, false);
document.addEventListener('keydown', OnKeyDown, false);