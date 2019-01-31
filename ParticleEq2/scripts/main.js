let BUFFER_X = 64, BUFFER_Y = BUFFER_X, BUFFER_SIZE = BUFFER_X * BUFFER_Y;

let SHADER = {

    BEHAVIOURS: {VERT: null, FRAG: null},
    UNIFORM_GRID: {VERT: null, FRAG: null},
    DEBUG_TEXTURE: {VERT: null, FRAG: null},
    RENDER: {VERT: null, FRAG: null}
}

let gl;

let renderer;
let camera;

let particleBehaviours; 
let particleRender;

let stats;

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
        GLHelpers.loadShader( "shaders/render.frag" )

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
        }
    ).then(
        () => {

            // init app
            renderer = new Renderer();
            gl = renderer.ctx;

            const gridTexSize = 64;
            const gridWidth = Math.cbrt(Math.pow(gridTexSize, 2));
            const gridHalfWidth = gridWidth / 2;
            const numGridSliceInGridTexWidth = gridTexSize / gridWidth;

            console.log(gridTexSize, gridWidth, gridHalfWidth, numGridSliceInGridTexWidth);

            camera = new THREE.PerspectiveCamera( 50, renderer.canvas.width / renderer.canvas.height, 1, 500 );
            // camera.position.x = gridWidth;
            // camera.position.y = gridWidth;
            camera.position.z = gridWidth * 2.;
            camera.up = new THREE.Vector3( 0, 1, 0 );
            camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

            let params = {

                camera: camera,
                renderer: renderer,
                bufferWidth: BUFFER_X,
                bufferHeight: BUFFER_Y,
                gridTexSize: gridTexSize,
                gridWidth: gridWidth,
                gridHalfWidth: gridHalfWidth,
                numGridSliceInGridTexWidth: numGridSliceInGridTexWidth
            }

            particleRender = new ParticleRender( params );

            stats = new Stats();
            document.body.appendChild(stats.dom);

            Update();

            isInit = true;
        }
    );
}

let Update = function () {

    // if there's any changes on the threejs camera then call
    // particleRender.updateMatrixUniforms()
    particleRender.update();
    particleRender.render();
    particleRender.debug();

    stats.update();

    requestAnimationFrame(Update);
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