let BUFFER_X = 64, BUFFER_Y = 64, BUFFER_SIZE = BUFFER_X * BUFFER_Y;

let gl;

let renderer;
let camera;

let particleBehaviours; 
let particleRender;

let stats;

let Init = function () {

    Redirect2HTTPS();

    renderer = new Renderer();
    gl = renderer.ctx;

    camera = new THREE.PerspectiveCamera( 50, renderer.canvas.width / renderer.canvas.height, 1, 500 );
    camera.position.z = 20;
    camera.position.y = 20;
    camera.position.x = 20;
    camera.up = new THREE.Vector3( 0, 1, 0 );
    camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

    let params = {
        camera: camera,
        renderer: renderer,
        bufferWidth: BUFFER_X,
        bufferHeight: BUFFER_Y
    }

    particleRender = new ParticleRender( params );

    stats = new Stats();
    document.body.appendChild(stats.dom);

    Update();

    isInit = true;
}

let Update = function () {

    // if there's any changes on the threejs camera then call
    // particleRender.updateMatrixUniforms()
    particleRender.update();
    particleRender.render();

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