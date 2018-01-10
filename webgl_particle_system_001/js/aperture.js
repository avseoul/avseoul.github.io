// this classs rely on threejs lib & shared_renderer
// threejs & shared_renderer must be loaded before this object is loaded

var aperture = function(_renderer, _x, _y, _size){
	this.renderer = _renderer.renderer;

	this.x = _x;
	this.y = _y;

	this.size = _size;

	this.num_dots = 16;
	this.num_layers = 5;

    this.current_transition_frames = [this.num_layers];
    this.random_transition_speeds = [this.num_layers];
    for(var i = 0; i < this.num_layers; i++){
        this.current_transition_frames[i] = 0;
        this.random_transition_speeds[i] = 0;
    }
    this.target_transition_frame = 0;

    this.w = _renderer.w;
    this.h = _renderer.h;

    this.renderer = _renderer.renderer;

    this.matrix = _renderer.matrix;

    this.mouse_norm_x = _renderer.mouse_norm_x; 
    this.mouse_norm_y = _renderer.mouse_norm_y;
    this.mouse_delta_x = _renderer.mouse_delta_x;
    this.mouse_delta_y = _renderer.mouse_delta_x;

    this.tex_sprite = new THREE.TextureLoader().load( "assets/sprite_additive.png" );
    this.tex_sprite.wrapS = THREE.ClampToEdgeWrapping;
    this.tex_sprite.wrapT = THREE.ClampToEdgeWrapping;
    this.tex_sprite.magFilter = THREE.LinearFilter;
    this.tex_sprite.minFilter = THREE.LinearFilter;

    this.init_shader();
    this.init_scene();
};





aperture.prototype.update = function(_renderer){
	this.mouse_norm_x = _renderer.mouse_norm_x; 
    this.mouse_norm_y = _renderer.mouse_norm_y;
    this.mouse_delta_x = _renderer.mouse_delta_x;
    this.mouse_delta_y = _renderer.mouse_delta_y;

    this.update_transition();

    for(var i = 0; i < this.num_layers; i++){
        this.shdrs[i].uniforms.t.value = this.timer;
        this.shdrs_point[i].uniforms.t.value = this.timer;
    }
    this.renderer.render( this.scene_circle, this.matrix );
    this.renderer.render( this.scene_point, this.matrix );

    this.timer = _renderer.timer;
};





aperture.prototype.open = function(){
    for(var i = 0; i < this.num_layers; i++){
        this.random_transition_speeds[i] = (Math.random() * .2) + .05;
    }

    this.target_transition_frame = 1;
};





aperture.prototype.close = function(){
    for(var i = 0; i < this.num_layers; i++){
        this.random_transition_speeds[i] = .2;
    }

    this.target_transition_frame = 0;
};





aperture.prototype.update_transition = function(){
    for(var i = 0; i < this.num_layers; i++){
        var _dist = this.target_transition_frame - this.current_transition_frames[i];

        if(_dist != 0){
            if(Math.abs(_dist) > .00001){
                this.current_transition_frames[i] += _dist * this.random_transition_speeds[i];
            } else {
                this.current_transition_frames[i] = this.target_transition_frame;
            }

            this.shdrs[i].uniforms.transition_frame.value = this.current_transition_frames[i];
            this.shdrs_point[i].uniforms.transition_frame.value = this.current_transition_frames[i]; 
        } else {
            continue;
        }
    }
};





aperture.prototype.init_shader = function(){
    var screen_res = 'vec2( ' + this.w.toFixed( 1 ) +', ' + this.h.toFixed( 1 ) + ')';
    
    function load(_vert, _frag){
        return new THREE.ShaderMaterial( 
        { 
            defines: {
                screen_res: screen_res
            },
            uniforms: {
                mouse: {value: new THREE.Vector2(this.mouse_norm_x, this.mouse_norm_y)},
                mouse_delta: {value: new THREE.Vector2(this.mouse_delta_x, this.mouse_delta_y)},
                t: {value: 0}
            },
            depthTest: {value: false},
            vertexShader:   _vert,
            fragmentShader: _frag
        });
    };

    function screen_to_object(_x, _y){
        return new THREE.Vector2(_x/this.w-.5, (1.-_y/this.h)-.5);
    };

    this.shdrs = [this.num_layers];
    this.shdrs_point = [this.num_layers];

    for(var i = 0; i < this.num_layers; i++){
        var rand_seed = Math.random();

	    this.shdrs[i] = load(aperture_master_vert, aperture_master_frag);
        this.shdrs[i].uniforms.loc = {value: screen_to_object.bind(this)(this.x, this.y)}
	    this.shdrs[i].uniforms.seed = {value: rand_seed};
        this.shdrs[i].uniforms.transition_frame = {value: 0};

	    this.shdrs[i].blending = THREE.AdditiveBlending;
	    this.shdrs[i].transparent = true;

        this.shdrs_point[i] = load(aperture_master_vert, aperture_master_points_frag);
        this.shdrs_point[i].uniforms.loc = {value: screen_to_object.bind(this)(this.x, this.y)}
        this.shdrs_point[i].uniforms.seed = {value: rand_seed};
        this.shdrs_point[i].uniforms.transition_frame = {value: 0};
        this.shdrs_point[i].uniforms.tex_sprite = {value: this.tex_sprite};

        this.shdrs_point[i].blending = THREE.AdditiveBlending;
        this.shdrs_point[i].transparent = true;
	}
};





aperture.prototype.init_scene = function(){
    var circle_geom = new THREE.CircleGeometry(this.size, this.num_dots);
    this.scene_circle = new THREE.Scene();
    this.scene_point = new THREE.Scene();

    for(var i = 0; i < this.num_layers; i++){
    	var circle = new THREE.Mesh(circle_geom, this.shdrs[i]);
    	var point = new THREE.Points(circle_geom, this.shdrs_point[i]);
    	
        this.scene_circle.add(circle);   
    	this.scene_point.add(point); 
	}
};