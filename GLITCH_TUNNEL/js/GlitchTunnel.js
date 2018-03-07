/* 
    *ACKNOWLEDGEMENT

    this sketches (mostly shader part) is inspired by and modified from 
    - 'Neon World(https://www.shadertoy.com/view/MlscDj)' 
    - 'Alien Corridor(https://www.shadertoy.com/view/4slyRs)' 
    by zguerrero(https://www.shadertoy.com/user/zguerrero/sort=popular&from=8&num=8) 

    author - Sehyun Av Kim

    av.seoul@gmail.com
    avseoul.net

    2018.02.05
*/ 

var GlitchTunnel = function(_renderer, _mouse, _analyzer, _is_retina){ 
    this.is_init = false;
    this.show_hdr = true;

    this.renderer = _renderer;
    this.audio_analyzer = _analyzer;
    this.mouse = _mouse;

    this.is_retina = _is_retina;

    this.w = _renderer.w;
    this.h = _renderer.h;

    this.frame = 1;

    this.z_target = 0.;
    
    this.init_texture();
    this.init_buffer();
    this.init_shader();
    this.init_scene();

    window.addEventListener('resize', this.resize.bind(this), false );
};

GlitchTunnel.prototype.update = function(){ 
    
    var _shdrs_size = this.shdr_batch.length;
    for(var i = 0; i < _shdrs_size; i++){
        this.shdr_batch[i].uniforms.u_is_init.value = this.is_init;
        this.shdr_batch[i].uniforms.u_t.value = this.timer;
        this.shdr_batch[i].uniforms.u_res.value = new THREE.Vector2(this.w, this.h);
        
        this.shdr_batch[i].uniforms.u_audio_high.value = this.audio_analyzer.get_high();
        this.shdr_batch[i].uniforms.u_audio_mid.value = this.audio_analyzer.get_mid();
        this.shdr_batch[i].uniforms.u_audio_bass.value = this.audio_analyzer.get_bass();
        this.shdr_batch[i].uniforms.u_audio_level.value = this.audio_analyzer.get_level();
        this.shdr_batch[i].uniforms.u_audio_history.value = this.audio_analyzer.get_history();
    }

    var _cam = this.renderer.get_ortho();

    this.renderer.renderer.render( this.scene_scene, _cam, this.fbo_scene );
    
    this.shdr_post.uniforms.u_tex_input.value = this.fbo_scene.texture;
    this.renderer.renderer.render( this.scene_post, _cam );

    this.frame ^= 1;

    if(!this.is_init){ 
        this.is_init = true;

        console.log("GlitchTunnel : is initiated");
    }

    this.timer = this.renderer.get_timer();
};

GlitchTunnel.prototype.init_shader = function(){
    var screen_res = 'vec2( ' + this.w.toFixed( 1 ) +', ' + this.h.toFixed( 1 ) + ')';
    
    function load(_vert, _frag){
        return new THREE.ShaderMaterial( 
        { 
            uniforms: {
                u_t: {value: 0},
                u_is_init: {value: false},
                u_res: {value: new THREE.Vector2(this.w, this.h)},
                u_audio_high: {value: 0.},
                u_audio_mid: {value: 0.},
                u_audio_bass: {value: 0.},
                u_audio_level: {value: 0.},
                u_audio_history: {value: 0.}
            },
            vertexShader:   _vert,
            fragmentShader: _frag
        });
    };

    this.shdr_scene = load(shared_vert, scene_frag);
    
    this.shdr_post = load(shared_vert, post_frag);
    this.shdr_post.uniforms.u_tex_input = {value: null};
    this.shdr_post.uniforms.u_tex_noise = {value: this.tex_noise};

    this.shdr_batch = [
        this.shdr_scene,
        this.shdr_post
    ];
};

GlitchTunnel.prototype.init_texture = function(){
    this.tex_noise = new THREE.TextureLoader().load( "../common/assets/noise.jpg" );
    this.tex_noise.wrapS = THREE.ClampToEdgeWrapping;
    this.tex_noise.wrapT = THREE.ClampToEdgeWrapping;
    this.tex_noise.magFilter = THREE.LinearFilter;
    this.tex_noise.minFilter = THREE.LinearFilter;
};

GlitchTunnel.prototype.init_buffer = function(){
    // frame buffers 
    var _format = {
        wrapS: THREE.ClampToEdgeWrapping,
        wrapT: THREE.ClampToEdgeWrapping,
        minFilter:THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        type: this.is_mobile ? THREE.HalfFloatTye : THREE.FloatType,
        format: THREE.RGBAFormat,
        stencilBuffer:false,
        depthBuffer:false
    };

    this.fbo_scene = new THREE.WebGLRenderTarget(this.w, this.h, _format);
    this.fbo_motion_blur = [2];

    for(var i = 0; i < 2; i++){
        this.fbo_motion_blur[i] = new THREE.WebGLRenderTarget(this.w, this.h, _format);
    }
};

GlitchTunnel.prototype.init_scene = function(){
    var _geom = new THREE.PlaneBufferGeometry(1., 1., this.w, this.h);

    this.scene_scene = new THREE.Scene();
    this.scene_scene.add(new THREE.Mesh(_geom, this.shdr_scene));

    this.scene_post = new THREE.Scene();
    this.scene_post.add(new THREE.Mesh(_geom, this.shdr_post));
};

GlitchTunnel.prototype.resize = function(){
    this.w = this.renderer.w;
    this.h = this.renderer.h;

    this.init_buffer();
};
