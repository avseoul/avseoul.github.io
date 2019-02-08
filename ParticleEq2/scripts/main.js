let bufferWidth , bufferHeight = bufferWidth, bufferSize = bufferWidth * bufferHeight;

let gridTexSize = 512;
let gridWidth = Math.cbrt(Math.pow(gridTexSize, 2));
let gridHalfWidth = gridWidth / 2;
let numGridSliceInGridTexWidth = gridTexSize / gridWidth;

let SHADER = {

    BEHAVIOURS: {VERT: null, FRAG: null},
    UNIFORM_GRID: {VERT: null, FRAG: null},
    DEBUG_TEXTURE: {VERT: null, FRAG: null},
    RENDER: {VERT: null, FRAG: null}
}

let TEXTURE = {
    NORMAL_MAP: {IMAGE: null, TEXTURE: null}
}

let gl;

let renderer;
let camera;

let particleBehaviours; 
let particleRender;

let stats;
let ctrl;
let ctrlParams;

let frame = 0;

let Init = function () {

    Redirect2HTTPS();

    // load resources
    Promise.all([

        GLHelpers.loadShader( "shaders/behaviours.vert" ), 
        GLHelpers.loadShader( "shaders/behaviours.frag" ),
        GLHelpers.loadShader( "shaders/uniformGrid.vert" ), 
        GLHelpers.loadShader( "shaders/uniformGrid.frag" ),
        GLHelpers.loadShader( "shaders/debugTexture.vert" ),
        GLHelpers.loadShader( "shaders/debugTexture.frag" ),
        GLHelpers.loadShader( "shaders/render.vert" ), 
        GLHelpers.loadShader( "shaders/render.frag" ),
        GLHelpers.loadTexture( "../common/assets/normal_map_rough_surface.jpg" )

    ])
    .then(
        (res) => {

            SHADER.BEHAVIOURS.VERT = res[0].target.response;
            SHADER.BEHAVIOURS.FRAG = res[1].target.response;

            SHADER.UNIFORM_GRID.VERT = res[2].target.response;
            SHADER.UNIFORM_GRID.FRAG = res[3].target.response;

            SHADER.DEBUG_TEXTURE.VERT = res[4].target.response;
            SHADER.DEBUG_TEXTURE.FRAG = res[5].target.response;

            SHADER.RENDER.VERT = res[6].target.response;
            SHADER.RENDER.FRAG = res[7].target.response;

            TEXTURE.NORMAL_MAP.IMAGE = res[8].target;
        }
    ).then(
        () => {

            SetBufferSize(64);

            // init app
            renderer = new Renderer();
            gl = renderer.ctx;

            // create textures
            TEXTURE.NORMAL_MAP.TEXTURE = GLHelpers.createImageTexture(gl, TEXTURE.NORMAL_MAP.IMAGE);

            console.log(gridTexSize, gridWidth, gridHalfWidth, numGridSliceInGridTexWidth);

            camera = new THREE.PerspectiveCamera( 50, renderer.canvas.width / renderer.canvas.height, 1, 500 );
            camera.position.x = gridWidth;
            camera.position.y = gridWidth;
            camera.position.z = gridWidth;
            camera.up = new THREE.Vector3( 0, 1, 0 );
            camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

            let params = {

                camera: camera,
                renderer: renderer,
                bufferWidth: bufferWidth,
                bufferHeight: bufferHeight,
                gridTexSize: gridTexSize,
                gridWidth: gridWidth,
                gridHalfWidth: gridHalfWidth,
                numGridSliceInGridTexWidth: numGridSliceInGridTexWidth
            }

            particleRender = new ParticleRender( params );

            // stat
            stats = new Stats();
            document.body.appendChild(stats.dom);

            // dat gui
            {
                ctrl = new dat.GUI();

                ctrlParams = {

                    // debug
                    ShowStats: true,
                    ShowDebug: false,
                    DebugThumbnailSize: 50,

                    // particle
                    numParticlesFactor: 64 
                }

                ctrl.add(ctrlParams, 'ShowStats').onFinishChange(
                    
                    (val) => {
                        
                        stats.dom.style.display = val ? 'block' : 'none' 
                    }
                );

                ctrl.add(ctrlParams, 'ShowDebug').onFinishChange(
                    
                    (val) => ctrlParams.showDebug = val
                );

                ctrl.add(ctrlParams, 'DebugThumbnailSize', 50, 200).onChange(

                    (val) => particleRender.thumbnailSize = val
                );

                ctrl.add(ctrlParams, 'numParticlesFactor', [16, 32, 64, 128, 256, 512, 1024]).onChange(

                    (val) => {
                        
                        SetBufferSize(val);
                        Reset();
                    }
                );
            }

            Update();

            isInit = true;
        }
    );
}

let Update = function () {

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
    // if there's any changes on the threejs camera then call
    // particleRender.updateMatrixUniforms();

    particleRender.update();
    particleRender.render();
    
    if(ctrlParams.showDebug) particleRender.debug();

    stats.update();

    frame++;

    requestAnimationFrame(Update);
}

let SetBufferSize = function(val) {

    bufferWidth = val, bufferHeight = bufferWidth, bufferSize = bufferWidth * bufferHeight;
}

let Reset = function() {

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