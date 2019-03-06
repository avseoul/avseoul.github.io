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
    BLUR_PASS: { VERT: null, FRAG: null },
    FROSTY_PASS: { VERT: null, FRAG: null }
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
let frostyPass;
let particleDebug;
let mainLight;

let audioAnalyzer;

let stats;

let parameters;

let frame = 0;

let Init = function () 
{
    Redirect2HTTPS();

    // load resources
    Promise.all([

        GLHelpers.loadShader("shaders/unitQuadPass.vert"), // 0 
        GLHelpers.loadShader("shaders/behaviours.frag"), // 1
        GLHelpers.loadShader("shaders/uniformGrid.vert"), // 2
        GLHelpers.loadShader("shaders/uniformGrid.frag"), // 3
        GLHelpers.loadShader("shaders/debugTexture.frag"), // 4
        GLHelpers.loadShader("shaders/frostyBlur.frag"), // 5
        GLHelpers.loadShader("shaders/gaussianBlur.frag"), // 6
        GLHelpers.loadShader("shaders/render.vert"), // 7
        GLHelpers.loadShader("shaders/render.frag"), // 8
        GLHelpers.loadTexture("../common/assets/normal.jpg"), // 9
        GLHelpers.loadTexture("../common/assets/xn.png"), // 10
        GLHelpers.loadTexture("../common/assets/xp.png"), // 11
        GLHelpers.loadTexture("../common/assets/yn.png"), // 12
        GLHelpers.loadTexture("../common/assets/yp.png"), // 13
        GLHelpers.loadTexture("../common/assets/zn.png"), // 14
        GLHelpers.loadTexture("../common/assets/zp.png"), // 15
    ])
        .then(
            (res) => {

                SHADER.BEHAVIOURS.VERT = res[0].target.response;
                SHADER.BEHAVIOURS.FRAG = res[1].target.response;

                SHADER.UNIFORM_GRID.VERT = res[2].target.response;
                SHADER.UNIFORM_GRID.FRAG = res[3].target.response;

                SHADER.DEBUG_TEXTURE.VERT = res[0].target.response;
                SHADER.DEBUG_TEXTURE.FRAG = res[4].target.response;

                SHADER.OPTICAL_FLOW.VERT = res[0].target.response;
                SHADER.OPTICAL_FLOW.FRAG = res[5].target.response;

                SHADER.FROSTY_PASS.VERT = res[0].target.response;
                SHADER.FROSTY_PASS.FRAG = res[5].target.response;

                SHADER.BLUR_PASS.VERT = res[0].target.response;
                SHADER.BLUR_PASS.FRAG = res[6].target.response;

                SHADER.RENDER.VERT = res[7].target.response;
                SHADER.RENDER.FRAG = res[8].target.response;

                TEXTURE.NORMAL_MAP.IMAGE = res[9].path[0];

                TEXTURE.CUBEMAP.IMAGES.PX = res[10].path[0];
                TEXTURE.CUBEMAP.IMAGES.NX = res[11].path[0];
                TEXTURE.CUBEMAP.IMAGES.PY = res[12].path[0];
                TEXTURE.CUBEMAP.IMAGES.NY = res[13].path[0];
                TEXTURE.CUBEMAP.IMAGES.PZ = res[14].path[0];
                TEXTURE.CUBEMAP.IMAGES.NZ = res[15].path[0];
            }
        ).then(
            () => {

                // parameters
                parameters = new Parameters();
                console.log(parameters);

                SetBufferSize(parameters.ctrlParams.ParticleDensity);

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

                // audio input
                audioAnalyzer = new AudioAnalyzer(parameters.ctrlParams.AudioGain);

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
                    audioAnalyzer: audioAnalyzer,
                    parameters: parameters.ctrlParams
                }

                particleRender = new ParticleRender(params);

                blurPass = new GaussianBlurPassRender({

                    renderer: renderer,
                    particleRenderTexture: particleRender.renderTexture,
                });

                frostyPass = new FrostyLayerPassRender({

                    renderer: renderer,
                    blurTexture: blurPass.renderTexture,
                    particleRenderTexture: particleRender.renderTexture,
                    audioAnalyzer: audioAnalyzer
                });

                particleDebug = new ParticleDebug(renderer.ctx);

                // stat
                stats = new Stats();
                document.body.appendChild(stats.dom);
                
                Update();

                isInit = true;
            }
        );
}

let Update = function () {

    audioAnalyzer.update();
    audioAnalyzer.debug();
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

    particleRender.update();
    particleRender.render();

    blurPass.render();

    frostyPass.render();

    if (parameters.ctrlParams.ShowDebug)
    {
        particleDebug.debugTextures([

            particleRender.particleBehaviours.positionBuffer,
            particleRender.particleBehaviours.velocityBuffer,
            particleRender.particleUniformGrid.gridTexture,
            TEXTURE.NORMAL_MAP.TEXTURE,
            particleRender.light.shadowMap,
            particleRender.renderTexture,
            blurPass.renderTexture

        ], parameters.ctrlParams.DebugThumbnailSize);
    } 

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

let OnKeyDown = function (evt) 
{
    if (evt.code === 'h') 
    {
        parameters.toggleVisible();
    }
}

let Redirect2HTTPS = function () 
{
    if (window.location.protocol == 'http:' && window.location.hostname != "localhost") 
    {
        window.open("https://" + window.location.hostname + window.location.pathname, '_top');
    }
}

let OnDestroy = function () 
{
    particleRender.destroy();
}

window.addEventListener("beforeunload", OnDestroy, false);
window.addEventListener('resize', OnWindowResize, false);
document.addEventListener('DOMContentLoaded', Init, false);
document.addEventListener('keydown', OnKeyDown, false);