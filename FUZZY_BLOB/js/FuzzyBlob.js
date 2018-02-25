var FuzzyBlob = function(_renderer, _analyzer, _mouse, _is_retina, _is_mobile){
	this.is_init = false;

    this.renderer = _renderer;
    this.audio_analyzer = _analyzer;
    this.mouse = _mouse;

    this.is_retina = _is_retina;
    this.is_mobile = _is_mobile;

    this.w = _renderer.w / 2.;
    this.h = _renderer.h / 2.;

    this.matrix = _renderer.matrix;

    this.frame = 1;

    this.init_buffer();
    this.init_shader();
    this.init_texture();
    this.init_scene();

    window.addEventListener('resize', this.resize.bind(this));
};

FuzzyBlob.prototype.update = function(){ 
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

        this.shdr_batch[i].uniforms.u_mouse.value = new THREE.Vector2(this.mouse.get_norm_x(), this.mouse.get_norm_y());
        this.shdr_batch[i].uniforms.u_mouse_dir.value = new THREE.Vector2(this.mouse.get_dir_x(), this.mouse.get_dir_y());
    }

    var _cam = this.renderer.get_camera();

    this.shdr_input.uniforms.u_tex_src.value = this.fbo_input[this.frame^1].texture;
    this.renderer.renderer.render( this.scene_input, _cam, this.fbo_input[this.frame]);

    this.shdr_chan_rgb.uniforms.u_tex_input.value = this.fbo_input[this.frame].texture;
    this.shdr_chan_rgb.uniforms.u_tex_src.value = this.fbo_chan_rgb[this.frame^1].texture;
    this.renderer.renderer.render( this.scene_chan_rgb, _cam, this.fbo_chan_rgb[this.frame]);

    this.shdr_chan_mixer.uniforms.u_tex_src.value = this.fbo_chan_rgb[this.frame].texture;
    this.renderer.renderer.render( this.scene_chan_mixer, _cam, this.fbo_chan_mixer);

    this.shdr_master.uniforms.u_tex_src.value = this.fbo_chan_mixer.texture;
    this.renderer.renderer.render( this.scene_master, _cam);

    this.frame ^= 1;

    if(!this.is_init){ 
        this.is_init = true;

        console.log("FuzzyBlob : is initiated");
        this.init_buffer();
    }

    this.timer = this.renderer.get_timer();
};

FuzzyBlob.prototype.init_scene = function(){
    var _geom = new THREE.PlaneBufferGeometry(1., 1., this.w, this.h);

    this.scene_input = new THREE.Scene();
    this.scene_input.add(new THREE.Mesh(_geom, this.shdr_input));

    this.scene_chan_rgb = new THREE.Scene();
    this.scene_chan_rgb.add(new THREE.Mesh(_geom, this.shdr_chan_rgb));
    
    this.scene_chan_mixer = new THREE.Scene();
    this.scene_chan_mixer.add(new THREE.Mesh(_geom, this.shdr_chan_mixer));
    
    this.scene_master = new THREE.Scene();
    this.scene_master.add(new THREE.Mesh(_geom, this.shdr_master));
};

FuzzyBlob.prototype.init_buffer = function(){
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

    this.fbo_input = [2];
    this.fbo_chan_rgb = [2];

    for(var i = 0; i < 2; i++){
        this.fbo_input[i] = new THREE.WebGLRenderTarget(this.w, this.h, _format);
        this.fbo_chan_rgb[i] = new THREE.WebGLRenderTarget(this.w, this.h, _format);
    }
    this.fbo_chan_mixer = new THREE.WebGLRenderTarget(this.w, this.h, _format);
};

FuzzyBlob.prototype.init_texture = function(){
    this.tex_noise = new THREE.TextureLoader().load( 
        "../common/assets/noise.jpg", 
        function(){
            this.shdr_input.uniforms.u_tex_noise = {value: this.tex_noise};
        }.bind(this),
        undefined,
        function ( err ) {
            console.error( 'errr texture not loaded' );
        }
    );
    this.tex_noise.wrapS = THREE.ClampToEdgeWrapping;
    this.tex_noise.wrapT = THREE.ClampToEdgeWrapping;
    this.tex_noise.magFilter = THREE.LinearFilter;
    this.tex_noise.minFilter = THREE.LinearFilter;
};

FuzzyBlob.prototype.init_shader = function(){
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
                u_audio_history: {value: 0.},
                u_mouse: {value: new THREE.Vector2( .5, .5 )},
                u_mouse_dir: {value: new THREE.Vector2( 0., 0. )}
            },
            depthTest: {value: false},
            vertexShader:   _vert,
            fragmentShader: _frag
        });
    };
    this.shdr_input = load(shared_vert, input_frag);
    this.shdr_chan_rgb = load(shared_vert, shaping_frag);
    this.shdr_chan_mixer = load(shared_vert, chan_mixer_frag);
    this.shdr_master = load(shared_vert, master_frag);

    this.shdr_batch = [
        this.shdr_input,
        this.shdr_chan_rgb,
        this.shdr_chan_mixer,
        this.shdr_master
    ];

    // init uniforms 
    this.shdr_input.uniforms.u_tex_src = {value: null};

    this.shdr_chan_rgb.uniforms.u_tex_src = {value: null};
    this.shdr_chan_rgb.uniforms.u_tex_input = {value: null};

    this.shdr_chan_mixer.uniforms.u_tex_src = {value: null};

    this.shdr_master.uniforms.u_tex_src = {value: null};
};

FuzzyBlob.prototype.resize = function(){
    this.w = this.renderer.w / 2.;
    this.h = this.renderer.h / 2.;

    this.init_buffer();
};



