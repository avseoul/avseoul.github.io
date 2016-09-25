navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var audioCtx = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext)();
var analyserNode = audioCtx.createAnalyser();
var bufferLength = analyserNode.frequencyBinCount;
var micInput = new Uint8Array(bufferLength);

var scene, buffer_scene, camera, buffer_cam, renderer, container;
var video, buffer, pre_video_tex, video_tex, video_mat, video_mesh, video_geo, buffer_mat, buffer_geo, buffer_mesh;
var ortho_width = 640, ortho_height = 480, ortho_near = -1, ortho_far = 1;
var timer = 0, zero_to_one = 0;

var window_resize = function(){  
    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
};

var setupAudioNodes = function(stream) {
    var sampleSize = 1024;
    var sourceNode = audioCtx.createMediaStreamSource(stream);
    var filter_low = audioCtx.createBiquadFilter();
    var filter_high = audioCtx.createBiquadFilter(); 
    filter_low.frequency.value = 60.0;
    filter_high.frequency.value = 1280.0; 
    filter_low.type = 'lowpass';
    filter_high.type = 'highpass';
    filter_low.Q = 10.0;
    filter_high.Q = 1.0;
    analyserNode.smoothingTimeConstant = 0.0;
    analyserNode.fftSize = 1024;

    sourceNode.connect(filter_low);
    sourceNode.connect(filter_high);
    filter_low.connect(analyserNode);
    filter_high.connect(analyserNode);

    micInput = new Uint8Array(analyserNode.frequencyBinCount);
};

var getMICInput = function(){
    analyserNode.getByteFrequencyData(micInput);
    //for(var i = 0; i < micInput.length; i++){
    //if(micInput[i] > 100)
    //console.log(i, "' ",micInput[i]);
    //}
};

var get_webcam = function(){
	video = document.createElement('video');
	video.width = ortho_width;
	video.height = ortho_height;
	video.autoplay = true;
	video.muted = true; //- to prevent create feedback from mic input ***

	if(navigator.getUserMedia){
		navigator.getUserMedia({ audio: true, video:{ width: ortho_width, height: ortho_height } }, function(stream){
			video.src = window.URL.createObjectURL(stream);
			video.play();
			setupAudioNodes(stream);
		}, function(err){
			console.log('failed to get a steram : ', err );
		});
	} else {
		console.log('user media is not supported');
	}
};

var init = function(){
	scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera( ortho_width/-2, ortho_width/2, ortho_height/2, ortho_height/-2, ortho_near, ortho_far );
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	// renderer.setSize( ortho_width, ortho_height );
    container = document.createElement('div');

    video_tex = new THREE.Texture( video );
    video_tex.minFilter = THREE.LinearFilter //- to use non powers of two image

    video_mat = new THREE.ShaderMaterial({
        uniforms:{
        	'u_sampler_2d': { type: 't', value: video_tex },
        	'u_buffer_2d' : { type: 't', value: null },
        	'u_time': { type: 'f', value: 0},
        	'u_bass': { type: 'f', value: 0 },
        	'u_mid': { type: 'f', value: 0 },
        	'u_treble': { type: 'f', value: 0 },
        	'u_0to1': { type: 'f', value: 0 },
        	'u_random': {type: 'f', value: 0}
        },
        vertexShader: document.getElementById('video_vert').textContent,
        fragmentShader: document.getElementById('video_frag').textContent,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true
    });
    video_geo = new THREE.PlaneGeometry( ortho_width, ortho_height );
    video_mesh = new THREE.Mesh( video_geo, video_mat );

    scene.add(camera);
    scene.add(video_mesh);
    container.appendChild(renderer.domElement);
    document.body.appendChild(container); 
	
	animate();
};

var render = function(){
	camera.lookAt( scene.position );

	if(video.readyState === video.HAVE_ENOUGH_DATA) { video_tex.needsUpdate = true; } //- live input has to be updated to refresh frames

	var tre  = micInput[200] / 255.;
	var mid  = micInput[100] / 255.;
	var bass = micInput[2] / 255.;

	// console.log('tre : ', tre, ', mid : , ', mid, ', bass : ', bass);

	video_mat.uniforms['u_sampler_2d'].value = video_tex;
	video_mat.uniforms['u_time'].value = timer;	
	video_mat.uniforms['u_bass'].value = bass;	
	video_mat.uniforms['u_mid'].value = mid;	
	video_mat.uniforms['u_treble'].value = tre;	
	video_mat.uniforms['u_0to1'].value = zero_to_one;
	video_mat.uniforms['u_random'].value = Math.random();	

	renderer.clear();
	renderer.render( scene, camera );

	timer++;

	if(zero_to_one > 1.){ zero_to_one = 0.; }
	zero_to_one += 0.001;
};

var animate = function(){
    requestAnimationFrame( animate );
    getMICInput();
    render();
};



document.addEventListener('DOMContentLoaded', function(){
	get_webcam();
	init();
});
window.addEventListener('resize', window_resize, false);


