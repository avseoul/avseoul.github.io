var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var container, stats;
var camera, scene, canvasRenderer, webglRenderer;
var loader;
var mesh, light_sphere_mesh;
var directionalLight, pointLight;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var render_canvas = 1, render_gl = 1;
var has_gl = 0;

document.addEventListener( 'mousemove', on_mouse_move, false );

init();
animate();

render_canvas = !has_gl;
bwebgl.style.display = has_gl ? "inline" : "none";
bcanvas.className = render_canvas ? "button" : "button inactive";

var add_mesh  = function( geometry, scale, x, y, z, rx, ry, rz, material ) {
	mesh = new THREE.Mesh( geometry, material );

	mesh.scale.set( scale, scale, scale );
	mesh.position.set( x, y, z );
	mesh.rotation.set( rx, ry, rz );

	scene.add( mesh );
}

function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 50, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 100000 );
	camera.position.z = 1500;

	scene = new THREE.Scene();

	// LIGHTS
	directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
	directionalLight.position.set( 1, 1, 2 ).normalize();
	scene.add( directionalLight );

	pointLight = new THREE.PointLight( 0xffffff, 3, 1000 );
	scene.add( pointLight );

	// light representation
	sphere = new THREE.SphereGeometry( 10, 16, 8, 1 );

	light_sphere_mesh = new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffffff } ) );
	scene.add( light_sphere_mesh );

	if ( render_gl ) {
		try {
			webglRenderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
			webglRenderer.setPixelRatio( window.devicePixelRatio );
			webglRenderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
			webglRenderer.domElement.style.position = "relative";
			container.appendChild( webglRenderer.domElement );
			has_gl = 1;
		} catch (e) {}
	}

	// STATS
	stats = new Stats();
	container.appendChild( stats.dom );

	loader = new THREE.BinaryLoader();

	var start = Date.now();

	loader.load( 'obj/lucy/Lucy100k_bin.js', function ( geometry, materials ) {
		addMesh( geometry, 0.75, 300, 0, 0,  0,0,0, new THREE.MultiMaterial( materials ) );

		log( "geometry.vertices: " + geometry.vertices.length );
		log( "geometry.faces: " + geometry.faces.length );
	});

	window.addEventListener( 'resize', on_window_resize, false );
}

function on_window_resize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	if ( render_gl && has_gl ) webglRenderer.setSize( window.innerWidth, window.innerHeight );
}

function on_mouse_move( event ) {
	mouseX = ( event.clientX - windowHalfX );
	mouseY = ( event.clientY - windowHalfY );
}

//
function animate() {
	requestAnimationFrame( animate );

	render();
	stats.update();
}

function render() {
	var time = Date.now() * 0.001;

	camera.position.x += ( mouseX - camera.position.x ) * 0.05;
	camera.position.y += ( - mouseY - camera.position.y ) * 0.05;

	camera.lookAt( scene.position );

	pointLight.position.x = 600 * Math.cos( time );
	pointLight.position.y = 400 * Math.cos( time * 1.25 );
	pointLight.position.z = 300 * Math.sin( time );

	light_sphere_mesh.position.copy( pointLight.position );

	webglRenderer.render( scene, camera );
}
