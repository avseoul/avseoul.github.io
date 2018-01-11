var ThreeSharedRenderer = function(_perspective){
	this.w = document.documentElement.clientWidth;
    this.h = document.documentElement.clientHeight;

	this.matrix = _perspective ? 
        new THREE.PerspectiveCamera( 45, this.w / this.h, .1, 100 ) :
        new THREE.OrthographicCamera( -.5, .5, .5, -.5, 1, 10 );
    this.matrix.position.z = 5;

    this.timer = 0;

    this.init_renderer();
};

ThreeSharedRenderer.prototype.init_renderer = function(){
    this.renderer = new THREE.WebGLRenderer();

    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( this.w, this.h );
    this.renderer.autoClear = false;

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

    this.timer+= .001;

    if(this.timer > 999999.){
        this.timer = 0.;
    }
};

ThreeSharedRenderer.prototype.get_timer = function(){
    return this.timer;
};

ThreeSharedRenderer.prototype.append_renderer_to_dom = function(_target){
    _target.appendChild(this.renderer.domElement);

    console.log("ThreeSharedRenderer : renderer is appended to", _target.nodeName);
};