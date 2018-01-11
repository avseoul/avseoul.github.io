var shared_renderer = function(){
	this.w = document.documentElement.clientWidth;
    this.h = document.documentElement.clientHeight;

	this.matrix = new THREE.OrthographicCamera( -.5, .5, .5, -.5, 1, 10 );
    this.matrix.position.z = 5;

    this.timer = 0;

    this.init_renderer();
};





shared_renderer.prototype.init_renderer = function(){
    this.renderer = new THREE.WebGLRenderer();

    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( this.w, this.h );
    this.renderer.context.disable(this.renderer.context.DEPTH_TEST);
    this.renderer.autoClear = false;

    if (!this.renderer.extensions.get("OES_texture_float")) {
        return "No OES_texture_float support for float textures.";
    }

    console.log("shared_renderer : renderer is set with", this.w, "by", this.h);
};





shared_renderer.prototype.render = function(_queue){
    requestAnimationFrame( this.render.bind(this, _queue) );

    var _size = _queue.length;
    for(var i = 0; i < _size; i++){
    	this.renderer.clearDepth(false);
    	_queue[i]();
    }

    this.timer+= .001;

    if(this.timer > 999999.){
        this.timer = 0.;
    }

    this.mouse_delta_x = 0;
    this.mouse_delta_y = 0;
};





shared_renderer.prototype.mouse_handler = function(_evt){
    if (_evt.targetTouches) {
        var touch = _evt.targetTouches[0];

        this.mouse_x = touch.pageX;
        this.mouse_y = touch.pageY;
    } else {
        this.mouse_x = _evt.clientX;
        this.mouse_y = _evt.clientY;
    }

    this.mouse_norm_x = this.mouse_x / this.w;
    this.mouse_norm_y = 1. - this.mouse_y / this.h;

    this.mouse_delta_x = this.mouse_norm_x - this.p_mouse_norm_x;
    this.mouse_delta_y = this.mouse_norm_y - this.p_mouse_norm_y;

    this.p_mouse_norm_x = this.mouse_norm_x;
    this.p_mouse_norm_y = this.mouse_norm_y;
};





shared_renderer.prototype.append_renderer_to_dom = function(_target){
    _target.appendChild(this.renderer.domElement);

    console.log("shared_renderer : renderer is appended to", _target.nodeName);
};





shared_renderer.prototype.register_dom_events = function(_target){
    _target.addEventListener("mousemove", this.mouse_handler.bind(this), false);
    _target.addEventListener("touchmove", this.mouse_handler.bind(this), false);

    console.log("shared_renderer : mouse_handler() is registered mousemove event listener");

    _target.addEventListener('touchstart', function (event) {
        event.preventDefault();
    }, {passive: false});

    console.log("shared_renderer : preventDefault is enabled");
};