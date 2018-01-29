var ThreeSharedRenderer = function(_perspective){
	this.w = document.documentElement.clientWidth;
    this.h = document.documentElement.clientHeight;

	this.matrix = _perspective ? 
        new THREE.PerspectiveCamera( 45, this.w / this.h, .1, 100 ) :
        new THREE.OrthographicCamera( -.5, .5, .5, -.5, 1, 10 );
    this.matrix.position.z = 5;

    this.is_ortho = false;

    this.matrix.aspect = this.w / this.h;
    this.matrix.updateProjectionMatrix();

    this.timer = 0;

    this.init_renderer();

    window.addEventListener('resize', this.resize.bind(this), false );
};

ThreeSharedRenderer.prototype.init_ortho_matrix = function(){
    this.ortho_matrix = new THREE.OrthographicCamera( -.5, .5, .5, -.5, 1, 10 );
    this.ortho_matrix.position.z = 5;

    this.ortho_matrix.aspect = this.w / this.h;
    this.ortho_matrix.updateProjectionMatrix();

    this.is_ortho = true;
};

ThreeSharedRenderer.prototype.resize = function(){
    this.w = document.documentElement.clientWidth;
    this.h = document.documentElement.clientHeight;

    this.matrix.aspect = this.w / this.h;
    this.matrix.updateProjectionMatrix();

    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( this.w, this.h );

    if(this.is_ortho){
        this.ortho_matrix.aspect = this.w / this.h;
        this.ortho_matrix.updateProjectionMatrix();
    }
}

ThreeSharedRenderer.prototype.init_renderer = function(){
    this.renderer = new THREE.WebGLRenderer();

    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( this.w, this.h );
    
    this.renderer.autoClear = false;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;

    if (!this.renderer.extensions.get("OES_texture_float")) {
        return "No OES_texture_float support for float textures.";
    }

    console.log("ThreeSharedRenderer : renderer is set with", this.w, "by", this.h);
};

ThreeSharedRenderer.prototype.disable_depth = function(){
    this.renderer.context.disable(this.renderer.context.DEPTH_TEST);
};

ThreeSharedRenderer.prototype.render = function(_queue){
    var _size = _queue.length;
    
    for(var i = 0; i < _size; i++){
    	this.renderer.clearDepth(false);
    	_queue[i]();
    }

    this.timer += .001;

    if(this.timer > 999999.){
        this.timer = 0.;
    }
};

ThreeSharedRenderer.prototype.ziggle_cam = function(_frame){
    var _e = _frame;
    var _n_loc = new THREE.Vector3(
        Math.sin(_e),
        Math.cos(_e*.9)*Math.sin(_e*.7),
        Math.cos(_e)).normalize();
    _n_loc.multiplyScalar( 8. + 2. * Math.sin(2.*_e) );

    var _n_center = new THREE.Vector3(
        Math.sin(.6*_e),
        0.,
        Math.cos(.4*_e)).normalize();
    _n_center.multiplyScalar(.3);
    
    this.matrix.position.copy(_n_loc);
    this.matrix.lookAt( _n_center, new THREE.Vector3(0., 1., 0.) );  

    this.matrix.updateProjectionMatrix();    
};

ThreeSharedRenderer.prototype.get_inversed_matrix = function(){
    return this.matrix.matrixWorldInverse;
};

ThreeSharedRenderer.prototype.get_timer = function(){
    return this.timer == undefined ? 0. : this.timer;
};

ThreeSharedRenderer.prototype.get_camera = function(){
    return this.matrix;
};

ThreeSharedRenderer.prototype.get_ortho = function(){
    return this.is_ortho ? this.ortho_matrix : undefined;
};

ThreeSharedRenderer.prototype.get_matrix = function(){
    return this.matrix.matrix;
};

ThreeSharedRenderer.prototype.append_renderer_to_dom = function(_target){
    _target.appendChild(this.renderer.domElement);

    console.log("ThreeSharedRenderer : renderer is appended to", _target.nodeName);
};