/*
 *  'particle equalizer' author av(Sehyun Kim)
 *  computer graphics 2015 @itp
 *
 *  av.seoul@gmail.com
 *  http://kimsehyun.kr
 */

/* threejs scene setting */
var width, height, ratio, group_01, group_02, group_03, group_04, scene, camera, renderer, container, 
    mouseX, mouseY, clock, mBKG_mat, mBKG_mesh, mPS_05, mPS_04, mPS_03, mPS_02, mPS_01, PS_01_size, mDS_01_mat, mDS_01_mesh, life, lifeTarget, tick, tick_pre, treble;
var cL=0,tL=0,nL=0,oL=0, nR_b=1, nR_t=0;

/* setting window resize */
var windowResize = function(){
    var c = document.getElementsByTagName('canvas');
    var w = window.innerWidth;
    var h = window.innerHeight;
    c[0].width = w*2;//-keep retina point size       
    c[0].height = h*2;      
    c[0].style.width = w;   
    c[0].style.height = h;  
    renderer.setViewport(0,0,w*2,h*2);
    camera.aspect = w/h;
    camera.updateProjectionMatrix();
};

/* set getmousepos */
var getMousePos = function(event) {
    mouseX = ( event.clientX - window.innerWidth/2 );
    mouseY = ( event.clientY - window.innerHeight/2 );
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
    treble = .001;
    //-for convinient
    width = window.innerWidth;
    height = window.innerHeight;
    ratio = width/height;
    //-set threejs objects
    scene = new THREE.Scene();
    //scene.fog = new THREE.FogExp2( 0x000000, .25 );
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
    //ps05
    var PS_05_vert = document.getElementById('PS_05_vert').textContent;
    var PS_05_frag = document.getElementById('PS_05_frag').textContent;
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
            'slice': 200,
            'segment': 200,
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
    //-set PS_04
    mPS_04 = new THREE.PS_04({
        'slice': 50,
        'segment': 50,
        'ps03vert': PS_04_vert,
        'ps03frag': PS_04_frag,
        'radius': 200
    });
    //-set PS_05
    mPS_05 = new THREE.PS_05({
        'size': 3200,
        'ps05vert': PS_05_vert,
        'ps05frag': PS_05_frag
    });

    //-set displaced sphere
    mDS_01_mat = new THREE.ShaderMaterial({
        uniforms:{
            'uTime': { type: 'f', value: 0.0 },
            'uIn_01': { type: 'f', value: 0.0 },
            'uTreble': { type: 'f', value: 0.0 }
        },
        vertexShader: DS_01_vert,
        fragmentShader: DS_01_frag,
        blending: THREE.NormalBlending,
        depthWrite : true,
        transparent: false,
    });
    var mDS_01_geo = new THREE.SphereGeometry( 160, 128, 128 );
    mDS_01_mesh = new THREE.Mesh( mDS_01_geo, mDS_01_mat );
    //-set background quad
    mBKG_mat = new THREE.ShaderMaterial({
        uniforms:{
            'uTime': { type: 'f', value: 0.0 },
            'uIn_01': {type: 'f', value: 0.0 },
            'uTreble': { type: 'f', value: 0.0 }
        },
        vertexShader: BKG_vert,
        fragmentShader: BKG_frag,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true
    });
    var mBKG_geo = new THREE.PlaneGeometry(width, height);
    mBKG_mesh = new THREE.Mesh( mBKG_geo, mBKG_mat );
    mBKG_mesh.position.z = -2000;
    mBKG_mesh.scale.set( 5., 5., 1 );

    //-set group
    for(var i = 0; i < PS_01_size; i++){
        group_01.add( mPS_01[i] );
    }
    group_04.add( mDS_01_mesh );
    group_01.add( mPS_02 );
    group_02.add( mPS_03 );
    group_02.add( mPS_04 );
    group_03.add( group_04 );
    group_03.add( group_01 );
    group_03.add( group_02 );
    
    //-set camera's default distance
    camera.position.z = 2000;

    //-add scene objects
    scene.add( group_03 );
    scene.add( mBKG_mesh );
    scene.add( mPS_05 );
    
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.right = '0px';
    //container.appendChild( stats.domElement );

    //-add canvas(renderer) dom to body
    var retina = renderer.domElement;
    retina.width = width * 2; //-get retina point size regardless any screen
    retina.height = height * 2;
    retina.style.width = width; 
    retina.style.height = height;
    //console.log(retina);
    renderer.setViewport(0,0,retina.width,retina.height);
    camera.aspect = retina.width/retina.height;
    camera.updateProjectionMatrix();
    container.appendChild(retina); 
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
    var in_bass;
    if(isPlaying){
        in_bass = micInput[2]*.8;
    }else{
        in_bass = micInput[2]*1.7;
    }
    var in_treble = micInput[200]*.63;
    var in_mid_01 = micInput[100]*.63;
    var in_treble_02 = micInput[300]*.34;

    /* normalize treble */
    if(in_treble > 120. || in_mid_01 > 120. || in_treble_02 > 60.){
        treble = 1.;
    } else {
        if(treble > .001){
            treble *= .96;
        } else {
            treble = 0;
        }
    }
    //console.log('treble : ', treble);
    if(mouseX){
        //camera.position.x += ( mouseX - camera.position.x ) * .01;
        //camera.position.y += ( -mouseY - camera.position.y ) * .01;    
    }
    
    group_01.rotation.y += .003 * nR_b + nR_t;
    group_01.rotation.x += .001 * nR_b;
    group_02.rotation.y -= .003 * nR_b;
    group_04.rotation.y += .003 * nR_b + nR_t;
    group_04.rotation.x += .001 * nR_b;
    
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
    if(treble == 1){
        var r = Math.floor(Math.random() * 84);
        if(tL > 100.){
            if(r%21 == 0 || r%7 == 0 || r%3 == 0){  
                tL = Math.random()*1500-2000;
                //tL = tL * .99;
            }
        }
    }
    if(in_bass > 1. && tL < 1800.){
        tL += in_bass*10.3; //-get intensity by level of input
    } else {
        tL = tL * .99; //-get back when out of input event
    }
    oL = (tL-cL)*.0023; //-normalize
    if(oL < 2.5 && oL > -2.5){
        nL = nL * .99;
    } else {
        nL = cL+oL;
    }
    nR_b = 1.+nL*.005; //-get new rotation
    if(in_treble > 200.){
        nR_t+=.001;
    } else {
        if(nR_t > .001){
            nR_t *= .96;
        } else {
            nR_t = 0;
        }
    }
    group_03.position.z = nL;
    //console.log('cl : ', cL, ', tl : ', tL, ', nl : ', nL, ', ol : ', oL);
    //console.log('input_b : ', in_01, ', input_t : ', in_02);

    /* update objects */
    for(var i = 0; i < PS_01_size; i++){
        mPS_01[i].update( tick_pre[i], i, PS_01_size, in_bass, treble );
    }
    mPS_02.update( tick, in_bass );
    mPS_03.update( tick, life, in_bass, treble );
    mPS_04.update( tick, life, in_bass, treble );
    mPS_05.update( tick, in_bass, treble );
    mDS_01_mat.uniforms['uTime'].value = tick;
    mDS_01_mat.uniforms['uIn_01'].value = in_bass;
    mDS_01_mat.uniforms['uTreble'].value = treble;
    mBKG_mat.uniforms['uTime'].value = tick;
    mBKG_mat.uniforms['uIn_01'].value = in_bass;
    mBKG_mat.uniforms['uTreble'].value = treble;

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



