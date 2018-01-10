// this classs rely on threejs lib & shared_renderer
// threejs & shared_renderer must be loaded before this object is loaded

var ps_03 = function(_renderer){ 
    this.SQRT_NUM_PARTICLES = 256;

    // webgl only supports static size arrays
    this.target_aperture_sizes = [0, 0, 0, 0];
    this.current_aperture_sizes = [0, 0, 0, 0];
    this.is_apertures = [false, false, false, false];
    this.aperture_locs = [new THREE.Vector2(1,1), new THREE.Vector2(1,1), new THREE.Vector2(1,1), new THREE.Vector2(1,1)];
    this.aperture_size_magnifiers = [1, 1, 1, 1];
    this.aperture_sizes = [0, 0, 0, 0];
    this.aperture_id = 0;

    this.is_attract = false;
    this.current_attract_transition_frame = 0;
    this.target_attract_transition_frame = 0;

    this.is_unidirection = false;

    this.is_init = false;

    this.renderer = _renderer.renderer;

    this.w = _renderer.w;
    this.h = _renderer.h;

    this.matrix = _renderer.matrix;

    this.init_texture();
    this.init_shader();
    this.init_scene();
};





ps_03.prototype.trigger_attract_mode = function(){
    this.is_attract = !this.is_attract;

    this.shdr_vel.uniforms.is_attract.value = this.is_attract;
    this.shdr_master.uniforms.is_attract.value = this.is_attract;
    this.shdr_standard.uniforms.is_attract.value = this.is_attract;

    this.target_attract_transition_frame = this.is_attract ? 1. : 0.;

    console.log("ps_03 : is attract", this.is_attract);
};





ps_03.prototype.update_attract_mode = function(){
    var _dist = this.target_attract_transition_frame - this.current_attract_transition_frame;

    if(_dist != 0){
        if(Math.abs(_dist) > .00001){
            this.current_attract_transition_frame += _dist * .05;
        } else {
            this.current_attract_transition_frame = this.target_attract_transition_frame;
        }

        this.shdr_vel.uniforms.attract_transition_frame.value = this.current_attract_transition_frame;
        this.shdr_master.uniforms.attract_transition_frame.value = this.current_attract_transition_frame;
        this.shdr_standard.uniforms.attract_transition_frame.value = this.current_attract_transition_frame;

    } else {
        return;
    }
};





// func(target_dom, x, y, size_multiplier)
// target_dom : trigger dom where touch event listner is registered
// x : pixel screen coord x from left
// y : pixel screen coord y from top
// size_magnifier : magnification ratio based on screen size
ps_03.prototype.register_aperture_open_crtl = function(_id, _dom, _x, _y, _s){
    this.aperture_id = _id;

    if(this.aperture_id > 3){
        var _css = "background-color:yellow; color:red;";

        console.log("%c.---------------------------$ WARNNING $---------------------------.", _css);
        console.log("%c|                                                                  |", _css);
        console.log("%c|  ps_03 : exceeded the maximun number of apertures -> contact av  |", _css);
        console.log("%c|          * webgl only allows static arrays                       |", _css);
        console.log("%c|                                                                  |", _css);
        console.log("%c.---------------------------$ WARNNING $---------------------------.", _css);

        return;
    }

    function screen_to_object(_x, _y){
        return new THREE.Vector2(_x/this.w-.5, (1.-_y/this.h)-.5);
    };
    this.aperture_locs[this.aperture_id] = screen_to_object.bind(this)(_x, _y);
    this.aperture_size_magnifiers[this.aperture_id] = _s;

    this.shdr_master.uniforms.aperture_size_magnifiers.value = this.aperture_size_magnifiers;
    this.shdr_standard.uniforms.aperture_size_magnifiers.value = this.aperture_size_magnifiers;

    _dom.addEventListener("touchend", this.trigger_aperture.bind(this, this.aperture_id, true), false);
    _dom.addEventListener("mouseup", this.trigger_aperture.bind(this, this.aperture_id, true), false);

    console.log("ps_03 : trigger_aperture(open) is registered with", this.aperture_id ,"to TOUCHEND & MOUSEUP event listener to ", _dom.nodeName);
};





ps_03.prototype.register_aperture_close_crtl = function(_id, _dom){
    this.aperture_id = _id;

    _dom.addEventListener("touchend", this.trigger_aperture.bind(this, this.aperture_id, false), false);
    _dom.addEventListener("mouseup", this.trigger_aperture.bind(this, this.aperture_id, false), false);

    console.log("ps_03 : trigger_aperture(close) is registered with", this.aperture_id ,"to TOUCHEND & MOUSEUP event listener to ", _dom.nodeName);
};





ps_03.prototype.trigger_aperture = function(_id, _cmd){
    this.is_apertures[_id] = _cmd;

    var _t = this.is_apertures[_id] ? "open" : "close";
    var _size = this.is_apertures[_id] ? 1 : 0;

    this.target_aperture_sizes[_id] = _size;
    
    console.log("ps_03 : aperture[" + _id + "] -", _t);
};





ps_03.prototype.open_aperture = function(_id){
    if(_id){
        this.trigger_aperture(_id, true);
    } else {
        var _size = this.is_apertures.length;
        for(var i = 0; i < _size; i++){
            this.trigger_aperture(i, true);
        }
    }
}





ps_03.prototype.close_aperture = function(_id){
    if(_id){
        this.trigger_aperture(_id, false);
    } else {
        var _size = this.is_apertures.length;
        for(var i = 0; i < _size; i++){
            this.trigger_aperture(i, false);
        }
    }
}





ps_03.prototype.toggle_unidirection = function(){
    this.is_unidirection = !this.is_unidirection;

    this.shdr_master.uniforms.is_unidirection.value = this.is_unidirection;
    this.shdr_standard.uniforms.is_unidirection.value = this.is_unidirection;
};





ps_03.prototype.update_aperture = function(){
    var _num_aperture = this.is_apertures.length;

    for(var i = 0; i < _num_aperture; i++){
        var _dist = this.target_aperture_sizes[i] - this.current_aperture_sizes[i];

        if(_dist != 0){
            if(Math.abs(_dist) > .0001){
                this.current_aperture_sizes[i] += _dist * .2;
            } else {
                this.current_aperture_sizes[i] = this.target_aperture_sizes[i];
            }
        } else {
            continue;
        }
    }

    this.shdr_master.uniforms.aperture_sizes.value = this.current_aperture_sizes;
    this.shdr_standard.uniforms.aperture_sizes.value = this.current_aperture_sizes;
};





ps_03.prototype.set_theme = function(_theme){
    var _t = {
        0: "DEFAULT",
        1: "YELLOW",
        2: "BLUE",
        3: "GREEN",
    };

    var _theme_cols = [];

    switch(_theme){
        case 0:
            _theme_cols = [new THREE.Vector3(1,1,1), new THREE.Vector3(1,1,1)];
        break;
        case 1:
            _theme_cols = [new THREE.Vector3(1,1,1), new THREE.Vector3(10,3,1)];
        break;
        case 2:
            _theme_cols = [new THREE.Vector3(1,1,1), new THREE.Vector3(1,3,6)];
        break;
        case 3:
            _theme_cols = [new THREE.Vector3(1,1,1), new THREE.Vector3(1,6,3)];
        break;
        default:
            _theme_cols = [new THREE.Vector3(1,1,1), new THREE.Vector3(1,1,1)];
        break;

    };

    this.shdr_master.uniforms.theme_cols.value = _theme_cols;
    this.shdr_standard.uniforms.theme_cols.value = _theme_cols;

    console.log("ps_03 : current theme -", _t[_theme]);
};





ps_03.prototype.init_scene = function(){
    var plane_geom = new THREE.PlaneBufferGeometry(1., 1., this.SQRT_NUM_PARTICLES, this.SQRT_NUM_PARTICLES);
    var quad_geom = new THREE.PlaneGeometry(1., 1.); 

    this.fbo_scene_vel = new THREE.Scene();
    this.fbo_scene_vel.add( new THREE.Mesh( quad_geom, this.shdr_vel ));
    this.fbo_scene_feedback = new THREE.Scene();
    this.fbo_scene_feedback.add( new THREE.Mesh( quad_geom, this.shdr_feedback ));

    this.scene = new THREE.Scene();

    var plane = new THREE.Line(plane_geom, this.shdr_standard);
    this.scene.add(plane);

    var particles = new THREE.Points(plane_geom, this.shdr_master);
    this.scene.add(particles);    
};





ps_03.prototype.init_texture = function(){
    this.tex_sprite = new THREE.TextureLoader().load( "assets/sprite_additive.png" );
    this.tex_sprite.wrapS = THREE.ClampToEdgeWrapping;
    this.tex_sprite.wrapT = THREE.ClampToEdgeWrapping;
    this.tex_sprite.magFilter = THREE.LinearFilter;
    this.tex_sprite.minFilter = THREE.LinearFilter;

    this.tex_noise = new THREE.TextureLoader().load( "assets/noise.jpg" );
    this.tex_noise.wrapS = THREE.ClampToEdgeWrapping;
    this.tex_noise.wrapT = THREE.ClampToEdgeWrapping;
    this.tex_noise.magFilter = THREE.LinearFilter;
    this.tex_noise.minFilter = THREE.LinearFilter;

    // frame buffers 
    var _format = {
          wrapS: THREE.ClampToEdgeWrapping,
          wrapT: THREE.ClampToEdgeWrapping,
          minFilter:THREE.LinearFilter,
          magFilter: THREE.LinearFilter,
          type: THREE.FloatType,
          format: THREE.RGBAFormat,
          stencilBuffer:false,
          depthBuffer:false
        };

    this.fbo_vel_src = new THREE.WebGLRenderTarget(this.SQRT_NUM_PARTICLES, this.SQRT_NUM_PARTICLES, _format);
    this.fbo_vel_dst = new THREE.WebGLRenderTarget(this.SQRT_NUM_PARTICLES, this.SQRT_NUM_PARTICLES, _format);
    this.fbo_feedback_src = new THREE.WebGLRenderTarget(this.SQRT_NUM_PARTICLES, this.SQRT_NUM_PARTICLES, _format);
    this.fbo_feedback_dst = new THREE.WebGLRenderTarget(this.SQRT_NUM_PARTICLES, this.SQRT_NUM_PARTICLES, _format);
};





ps_03.prototype.init_shader = function(){
    var buffer_res = 'vec2( ' + this.SQRT_NUM_PARTICLES.toFixed( 1 ) + ', ' + this.SQRT_NUM_PARTICLES.toFixed( 1 ) + ')';
    var screen_res = 'vec2( ' + this.w.toFixed( 1 ) +', ' + this.h.toFixed( 1 ) + ')';
    
    function load(_vert, _frag){
        return new THREE.ShaderMaterial( 
        { 
            defines: {
                buffer_res: buffer_res,
                screen_res: screen_res
            },
            uniforms: {
                mouse: {value: new THREE.Vector2(this.mouse_norm_x, this.mouse_norm_y)},
                mouse_delta: {value: new THREE.Vector2(this.mouse_delta_x, this.mouse_delta_y)},
                t: {value: 0},
                is_init: {value: false}
            },
            depthTest: {value: false},
            vertexShader:   _vert,
            fragmentShader: _frag
        });
    };

    this.shdr_vel = load(shared_vert, vel_frag);
    this.shdr_vel.uniforms.tex_p_vel = {value: this.fbo_vel_src.texture};
    this.shdr_vel.uniforms.tex_noise = {value: this.tex_noise };
    this.shdr_vel.uniforms.is_attract = {value: this.is_attract};
    this.shdr_vel.uniforms.attract_transition_frame = {value: this.current_attract_transition_frame};

    this.shdr_feedback = load(shared_vert, feedback_frag);
    this.shdr_feedback.uniforms.tex_vel =  {value: this.fbo_vel_dst.texture};
    this.shdr_feedback.uniforms.tex_p_feedback = {value: this.fbo_feedback_src.texture};
    this.shdr_feedback.uniforms.tex_noise = {value: this.tex_noise };


    this.shdr_master = load(master_vert, master_frag);
    this.shdr_master.uniforms.tex_sprite = {value: this.tex_sprite};
    this.shdr_master.uniforms.tex_feedback = {value: this.fbo_feedback_dst.texture};
    this.shdr_master.uniforms.theme_cols = {value: [new THREE.Vector3(1,1,1), new THREE.Vector3(1,1,1)]};
    this.shdr_master.uniforms.aperture_locs = {value: this.aperture_locs};
    this.shdr_master.uniforms.aperture_sizes = {value: this.aperture_sizes};
    this.shdr_master.uniforms.aperture_size_magnifiers = {value: this.aperture_size_magnifiers};
    this.shdr_master.uniforms.is_attract = {value: this.is_attract};
    this.shdr_master.uniforms.attract_transition_frame = {value: this.current_attract_transition_frame};
    this.shdr_master.uniforms.is_unidirection = {value: this.is_unidirection};

    this.shdr_master.blending = THREE.AdditiveBlending;
    this.shdr_master.transparent = true;
    this.shdr_master.alphaTest = 1.;

    this.shdr_standard = load(master_vert, standard_frag);
    this.shdr_standard.uniforms.tex_feedback = {value: this.fbo_feedback_dst.texture};
    this.shdr_standard.uniforms.theme_cols = {value: [new THREE.Vector3(1,1,1), new THREE.Vector3(1,1,1)]};
    this.shdr_standard.uniforms.aperture_locs = {value: this.aperture_locs};
    this.shdr_standard.uniforms.aperture_sizes = {value: this.aperture_sizes};
    this.shdr_standard.uniforms.aperture_size_magnifiers = {value: this.aperture_size_magnifiers};
    this.shdr_standard.uniforms.is_attract = {value: this.is_attract};
    this.shdr_standard.uniforms.attract_transition_frame = {value: this.current_attract_transition_frame};
    this.shdr_standard.uniforms.is_unidirection = {value: this.is_unidirection};

    this.shdr_standard.blending = THREE.AdditiveBlending;
    this.shdr_standard.transparent = true;
};





ps_03.prototype.update = function(_renderer){ 
    this.mouse_norm_x = _renderer.mouse_norm_x; 
    this.mouse_norm_y = _renderer.mouse_norm_y;
    this.mouse_delta_x = _renderer.mouse_delta_x;
    this.mouse_delta_y = _renderer.mouse_delta_y;

    this.shdr_vel.uniforms.mouse.value = new THREE.Vector2(this.mouse_norm_x, this.mouse_norm_y);
    this.shdr_vel.uniforms.mouse_delta.value = new THREE.Vector2(this.mouse_delta_x, this.mouse_delta_y);
    this.shdr_vel.uniforms.tex_p_vel.value = this.fbo_vel_src.texture;
    this.shdr_vel.uniforms.t.value = this.timer;
    this.renderer.render(this.fbo_scene_vel, this.matrix, this.fbo_vel_dst);

    this.shdr_feedback.uniforms.mouse.value = new THREE.Vector2(this.mouse_norm_x, this.mouse_norm_y);
    this.shdr_feedback.uniforms.mouse_delta.value = new THREE.Vector2(this.mouse_delta_x, this.mouse_delta_y);
    this.shdr_feedback.uniforms.tex_vel.value = this.fbo_vel_dst.texture;
    this.shdr_feedback.uniforms.tex_p_feedback.value = this.fbo_feedback_src.texture;
    this.shdr_feedback.uniforms.t.value = this.timer;
    this.renderer.render(this.fbo_scene_feedback, this.matrix, this.fbo_feedback_dst);

    var _temp;
    _temp = this.fbo_vel_src;   this.fbo_vel_src = this.fbo_vel_dst;   this.fbo_vel_dst = _temp;
    _temp = this.fbo_feedback_src;   this.fbo_feedback_src = this.fbo_feedback_dst;   this.fbo_feedback_dst = _temp;

    this.shdr_standard.uniforms.tex_feedback.value = this.fbo_feedback_dst.texture;
    this.shdr_standard.uniforms.mouse.value = new THREE.Vector2(this.mouse_norm_x, this.mouse_norm_y);
    this.shdr_standard.uniforms.is_init.value = this.is_init;
    this.shdr_standard.uniforms.t.value = this.timer;

    this.shdr_master.uniforms.tex_feedback.value = this.fbo_feedback_dst.texture;
    this.shdr_master.uniforms.mouse.value = new THREE.Vector2(this.mouse_norm_x, this.mouse_norm_y);
    this.shdr_master.uniforms.is_init.value = this.is_init;
    this.shdr_master.uniforms.t.value = this.timer;

    this.renderer.render( this.scene, this.matrix );


    if(!this.is_init){ 
        this.is_init = true;

        console.log("ps_03 : is initiated");
    }

    this.update_aperture();
    this.update_attract_mode();

    this.timer = _renderer.timer;
};