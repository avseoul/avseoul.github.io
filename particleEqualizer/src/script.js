/*
 *  'particle equalizer' author av(Sehyun Kim)
 *  computer graphics 2015 @itp
 *
 *  av.seoul@gmail.com
 *  http://kimsehyun.kr
 */

/* threejs scene setting */
var width, height, ratio, scene, camera, renderer, container, 
    mouseX, mouseY, clock, mDS_01_mat, mDS_01_mesh, tick;

/* setting window resize */
var windowResize = function(){
    camera.aspect = width/height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
};

var getMousePos = function(event) {
    mouseX = ( event.clientX - width/2 );
    mouseY = ( event.clientY - height/2 );
};

/* setting init */
var init = function(){
    /* initialize global variable */
    tick = 0;
    //-for convinient
    width = window.innerWidth;
    height = window.innerHeight;
    ratio = window.devicePixelRatio;
    //-set threejs objects
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 35, width/height, 0.1, 10000);
    renderer = new THREE.WebGLRenderer();
    clock = new THREE.Clock(true);
    container = document.createElement('div');
    //-get shaders from index.html
    var PS_01_vert = document.getElementById('PS_01_vert').textContent;
    var PS_01_frag = document.getElementById('PS_01_frag').textContent;
    var DS_01_vert = document.getElementById('DS_01_vert').textContent;
    var DS_01_frag = document.getElementById('DS_01_frag').textContent;
    //-declare PS_01
    mPS_01 = new THREE.PS_01({
        'slice': 200,
        'segment': 200,
        'ps01vert': PS_01_vert,
        'ps01frag': PS_01_frag,
        'radius': 300
    });
    //-set displaced sphere
    mDS_01_mat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: true,
        uniforms:{
            'uTex': { type: 't', value: THREE.TextureLoader( './img/tex_01.png' )},
            'uTime': { type: 'f', value: 0.0 }
        },
        //blending: THREE.AdditiveBlending,
        vertexShader: DS_01_vert,
        fragmentShader: DS_01_frag
    });
    var mDS_01_geo = new THREE.SphereGeometry( 160, 128, 128 );
    mDS_01_mesh = new THREE.Mesh( mDS_01_geo, mDS_01_mat );

    //-set camera's default distance
    renderer.setPixelRatio(ratio);
    renderer.setSize(width, height);
    camera.position.z = 1500;

    //-add scene objects
    //scene.add(camera);
    scene.add( mDS_01_mesh );
    scene.add( mPS_01 );

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild( stats.domElement );

    //-add canvas(renderer) dom to body
    container.appendChild(renderer.domElement); 
    document.body.appendChild(container); 
    //-get resized window when browser is modified 
    window.addEventListener('resize', windowResize, false);
    //-get mouse position
    document.addEventListener( 'mousemove', getMousePos, false );
};

/* setting render */
var render = function(){
    //camera.position.x += ( mouseX - camera.position.x ) * .05;
    //camera.position.y += ( - ( mouseY - 200) - camera.position.y ) * .05;
    
    scene.rotation.y += 0.003;
    scene.rotation.x += 0.001;

    var delta = clock.getDelta();
    tick += delta;

    if(tick < 0) tick = 0;
    if(tick > 0){   
    }

    mPS_01.update(tick * 0.25);
    mDS_01_mat.uniforms['uTime'].value = tick;

    camera.lookAt( scene.position );
    renderer.render( scene, camera );
};

/* setting animate */
var animate = function(){
    requestAnimationFrame( animate );
    stats.update();
    render();
};

/* excute app */
document.addEventListener('DOMContentLoaded', function(){
    init();
    animate();
});



