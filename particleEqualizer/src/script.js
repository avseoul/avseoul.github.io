/*
 *  'particle equalizer' author av(Sehyun Kim)
 *  computer graphics 2015 @itp
 *
 *  av.seoul@gmail.com
 *  http://kimsehyun.kr
 */

/* threejs scene setting */
var width, height, ratio, group_01, group_02, group_03, group_04, scene, camera, renderer, container, 
    mouseX, mouseY, clock, mBKG_mat, mBKG_mesh, mPS_04, mPS_03, mPS_02, mPS_01, PS_01_size, mDS_01_mat, mDS_01_mesh, life, lifeTarget, tick, tick_pre, treble;
var cL=0,tL=0,nL=0,oL=0, nR=1;

/* setting window resize */
var windowResize = function(){
    camera.aspect = width/height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
};

/* set getmousepos */
var getMousePos = function(event) {
    mouseX = ( event.clientX - width/2 );
    mouseY = ( event.clientY - height/2 );
};

/* set init */
var init = function(){
    /* initialize global variable */
    life = 0;
    lifeTarget = 30;
    tick = 0;
    tick_pre_01 = 0;
    tick_pre_02 = 0;
    tick_pre_03 = 0;
    treble = 0;
    //-for convinient
    width = window.innerWidth;
    height = window.innerHeight;
    ratio = window.devicePixelRatio;
    //-set threejs objects
    scene = new THREE.Scene();
    group_01 = new THREE.Object3D();
    group_02 = new THREE.Object3D();
    group_03 = new THREE.Object3D();
    group_04 = new THREE.Object3D();
    camera = new THREE.PerspectiveCamera( 35, width/height, 0.1, 10000);
    renderer = new THREE.WebGLRenderer();
    clock = new THREE.Clock(true);
    container = document.createElement('div');
    //-get shaders from index.html
    //ps01
    var PS_01_vert = document.getElementById('PS_01_vert').textContent;
    var PS_01_frag = document.getElementById('PS_01_frag').textContent;
    //ps02
    var PS_02_vert = document.getElementById('PS_02_vert').textContent;
    var PS_02_frag = document.getElementById('PS_02_frag').textContent;
    //ps03
    var PS_03_vert = document.getElementById('PS_03_vert').textContent;
    var PS_03_frag = document.getElementById('PS_03_frag').textContent;
    //ps04
    var PS_04_vert = document.getElementById('PS_04_vert').textContent;
    var PS_04_frag = document.getElementById('PS_04_frag').textContent;
    //ds01
    var DS_01_vert = document.getElementById('DS_01_vert').textContent;
    var DS_01_frag = document.getElementById('DS_01_frag').textContent;
    //bkg
    var BKG_vert = document.getElementById('BKG_vert').textContent;
    var BKG_frag = document.getElementById('BKG_frag').textContent;
    //-set PS_01 trails
    PS_01_size = 5;
    mPS_01 = [PS_01_size];
    tick_pre = [PS_01_size];
    for(var i = 0; i < PS_01_size; i++){
        mPS_01[i] = new THREE.PS_01({
            'slice': 150,
            'segment': 150,
            'ps01vert': PS_01_vert,
            'ps01frag': PS_01_frag,
            'radius': 180
        });

        tick_pre[i] = 0;
    }
    //-set PS_02
    mPS_02 = new THREE.PS_02({
        'slice': 100,
        'segment': 100,
        'ps02vert': PS_02_vert,
        'ps02frag': PS_02_frag,
        'radius': 200
    });
    //-set PS_03
    mPS_03 = new THREE.PS_03({
        'slice': 8,
        'segment': 8,
        'ps03vert': PS_03_vert,
        'ps03frag': PS_03_frag,
        'radius': 200
    });
    //-set PS_03
    mPS_04 = new THREE.PS_04({
        'slice': 50,
        'segment': 50,
        'ps03vert': PS_04_vert,
        'ps03frag': PS_04_frag,
        'radius': 200
    });
    //-set displaced sphere
    mDS_01_mat = new THREE.ShaderMaterial({
        transparent: true,
        blending: 'THREE.AddictiveBlending',
        depthWrite: true,
        uniforms:{
            'uTex': { type: 't', value: THREE.TextureLoader( './img/tex_01.png' )},
            'uTime': { type: 'f', value: 0.0 },
            'uIn_01': { type: 'f', value: 0.0 }
        },
        //blending: THREE.AdditiveBlending,
        vertexShader: DS_01_vert,
        fragmentShader: DS_01_frag
    });
    var mDS_01_geo = new THREE.SphereGeometry( 160, 128, 128 );
    mDS_01_mesh = new THREE.Mesh( mDS_01_geo, mDS_01_mat );
    //-set background quad
    mBKG_mat = new THREE.ShaderMaterial({
        transparent: false,
        depthWrite: false,
        uniforms:{
            'uTime': { type: 'f', value: 0.0 },
            'uIn_01': {type: 'f', value: 0.0 }
        },
        vertexShader: BKG_vert,
        fragmentShader: BKG_frag
    });
    var mBKG_geo = new THREE.PlaneGeometry(width, height);
    mBKG_mesh = new THREE.Mesh( mBKG_geo, mBKG_mat );
    mBKG_mesh.position.z = -2000;
    mBKG_mesh.scale.set( 2.9, 2.9, 1 );

    //-set group
    group_04.add( mDS_01_mesh );
    for(var i = 0; i < PS_01_size; i++){
        group_01.add( mPS_01[i] );
    }
    group_01.add( mPS_02 );
    group_02.add( mPS_03 );
    group_02.add( mPS_04 );
    group_03.add( group_04 );
    group_03.add( group_01 );
    group_03.add( group_02 );

    
    //-set camera's default distance
    renderer.setPixelRatio(ratio);
    renderer.setSize(width, height);
    camera.position.z = 1500;

    //-add scene objects
    scene.add( group_03 );
    scene.add( mBKG_mesh );

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
    var delta = clock.getDelta();
    tick += delta;
    if(tick < 0){ tick = 0; }
    
    /* update tick for trails object */
    for(var i = PS_01_size -1; i >= 0; i--){
        if(i != 0 ){
            tick_pre[i] = tick_pre[i-1];
        } else if (i == 0){
            tick_pre[i] = tick;
        }
    }
    /* ger random number for particle's life span */
    if(life > lifeTarget) {
        life = 0;
        lifeTarget = Math.random() * 30 + 10;
    } else {
        life += .2;
    }
    /* get mic input */
    var in_01 = micInput[2];
    var in_02 = micInput[200];

    /* normalize treble */
    if(in_02 > 200.){
        treble = 1.;
    } else {
        if(treble > .001){
            treble *= .96;
        } else {
            treble = 0.;
        }
    }
    //console.log('treble : ', treble);

    //camera.position.x += ( mouseX - camera.position.x ) * .05;
    //camera.position.y += ( - ( mouseY - 200) - camera.position.y ) * .05;
    
    group_01.rotation.y += .003 * nR;
    group_01.rotation.x += .001 * nR;
    group_02.rotation.y -= .003 * nR;
    group_04.rotation.y += .003 * nR;
    group_04.rotation.x += .001 * nR;
    
    /*  loc&rot event
     *  
     *  cL - current location
     *  tL - target location
     *  oL - offset location
     *  nL - new location
     *  nR - new rotation
     *
     */
    cL = group_03.position.z;
    if(in_01 > 1. && tL < 800.){
        tL += in_01*.05; //-get intensity by level of input
    } else {
        tL = tL * .99; //-get back when out of input event
    }
    oL = (tL-cL)*.5; //-normalize
    if(oL < 2.5 && oL > -2.5){
        nL = nL * .96;
    } else {
        nL = cL+oL;
    }
    nR = 1.+nL*.02; //-get new rotation
    group_03.position.z = nL;
    //console.log('cl : ', cL, ', tl : ', tL, ', nl : ', nL, ', ol : ', oL);
    //console.log('input_b : ', in_01, ', input_t : ', in_02);

    /* update objects */
    for(var i = 0; i < PS_01_size; i++){
        mPS_01[i].update( tick_pre[i], i, PS_01_size, in_01, treble );
    }
    mPS_02.update( tick, in_01 );
    mPS_03.update( tick, life );
    mPS_04.update( tick, life, in_01 );
    mDS_01_mat.uniforms['uTime'].value = tick;
    mDS_01_mat.uniforms['uIn_01'].value = in_01;
    mBKG_mat.uniforms['uTime'].value = tick;
    mBKG_mat.uniforms['uIn_01'].value = in_01;

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



