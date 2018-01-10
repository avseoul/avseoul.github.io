var ps_03 = function(_renderer, _is_retina){ 
    this.SQRT_NUM_PARTICLES = _is_retina ? 256 : 256;

    this.is_attract = false;
    this.current_attract_transition_frame = 0;
    this.target_attract_transition_frame = 0;

    this.is_init = false;

    this.renderer = _renderer.renderer;

    this.is_retina = _is_retina;

    this.w = _is_retina ? _renderer.w * .5 : _renderer.w;
    this.h = _is_retina ? _renderer.h * .5 : _renderer.h;

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
                BUFFER_RES: buffer_res,
                SCREEN_RES: screen_res
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

    this.shdr_vel = load(master_vert, vel_frag);
    this.shdr_vel.uniforms.tex_p_vel = {value: this.fbo_vel_src.texture};
    this.shdr_vel.uniforms.tex_noise = {value: this.tex_noise };
    this.shdr_vel.uniforms.is_attract = {value: this.is_attract};
    this.shdr_vel.uniforms.attract_transition_frame = {value: this.current_attract_transition_frame};
    this.shdr_vel.defines.IS_BUFFER = 'true';

    this.shdr_feedback = load(master_vert, feedback_frag);
    this.shdr_feedback.uniforms.tex_vel =  {value: this.fbo_vel_dst.texture};
    this.shdr_feedback.uniforms.tex_p_feedback = {value: this.fbo_feedback_src.texture};
    this.shdr_feedback.uniforms.tex_noise = {value: this.tex_noise };
    this.shdr_feedback.defines.IS_BUFFER = 'true';

    this.shdr_master = load(master_vert, master_frag);
    this.shdr_master.uniforms.tex_sprite = {value: this.tex_sprite};
    this.shdr_master.uniforms.tex_feedback = {value: this.fbo_feedback_dst.texture};
    this.shdr_master.uniforms.theme_cols = {value: [new THREE.Vector3(1,1,1), new THREE.Vector3(1,1,1)]};
    this.shdr_master.uniforms.is_attract = {value: this.is_attract};
    this.shdr_master.uniforms.attract_transition_frame = {value: this.current_attract_transition_frame};
    this.shdr_master.uniforms.is_retina = {value: this.is_retina};

    this.shdr_master.blending = THREE.AdditiveBlending;
    this.shdr_master.transparent = true;

    this.shdr_standard = load(master_vert, master_frag);
    this.shdr_standard.uniforms.tex_feedback = {value: this.fbo_feedback_dst.texture};
    this.shdr_standard.uniforms.theme_cols = {value: [new THREE.Vector3(1,1,1), new THREE.Vector3(1,1,1)]};
    this.shdr_standard.uniforms.is_attract = {value: this.is_attract};
    this.shdr_standard.uniforms.attract_transition_frame = {value: this.current_attract_transition_frame};
    this.shdr_standard.uniforms.is_retina = {value: this.is_retina};
    this.shdr_standard.defines.IS_LINE = 'true';

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

    this.update_attract_mode();

    this.timer = _renderer.timer;
};