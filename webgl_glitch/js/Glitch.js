var Glitch = function(_renderer, _analyzer, _is_retina, _is_mobile){
	this.is_init = false;

    this.renderer = _renderer;
    this.audio_analyzer = _analyzer;

    this.is_retina = _is_retina;
    this.is_mobile = _is_mobile;

    this.master_ziggle = true;
    this.monochrome = true;
    this.low_wave = true;
    this.high_wave = true;
    this.bad_signals = true;
    this.VHS = true;

    this.w = _renderer.w;
    this.h = _renderer.h;

    this.matrix = _renderer.matrix;

    this.frame = 1;

    this.init_buffer();
    this.init_shader();
    this.init_texture();
    this.init_scene();
};

Glitch.prototype.update = function(){ 
    var _shdrs_size = this.shdr_batch.length;
    for(var i = 0; i < _shdrs_size; i++){
        this.shdr_batch[i].uniforms.u_is_init.value = this.is_init;
        this.shdr_batch[i].uniforms.u_t.value = this.timer;
        
        this.shdr_batch[i].uniforms.u_audio_high.value = this.audio_analyzer.get_high();
        this.shdr_batch[i].uniforms.u_audio_mid.value = this.audio_analyzer.get_mid();
        this.shdr_batch[i].uniforms.u_audio_bass.value = this.audio_analyzer.get_bass();
        this.shdr_batch[i].uniforms.u_audio_level.value = this.audio_analyzer.get_level();
        this.shdr_batch[i].uniforms.u_audio_history.value = this.audio_analyzer.get_history();
    }

    var _cam = this.renderer.get_camera();

    this.w = this.renderer.w;
    this.h = this.renderer.h;
    this.shdr_pass.uniforms.u_screen_res.value = new THREE.Vector2(this.w, this.h);

    this.shdr_pass.uniforms.u_tex_src.value = this.tex_test_pattern_original;
    this.frame ^= 1;
    this.renderer.renderer.render( this.scene_pass, _cam, this.frame_buffer[this.frame]);
    
    this.shdr_glitch.uniforms.u_tex_src.value = this.frame_buffer[this.frame].texture;
    this.renderer.renderer.render( this.scene_glitch, _cam);

    if(!this.is_init){ 
        this.is_init = true;

        console.log("Glitch : is initiated");
    }

    this.timer = this.renderer.get_timer();
};

Glitch.prototype.init_scene = function(){
    var _geom = new THREE.PlaneBufferGeometry(1., 1., this.w, this.h);

    this.scene_glitch = new THREE.Scene();
    this.scene_glitch.add(new THREE.Mesh(_geom, this.shdr_glitch));

    this.scene_pass = new THREE.Scene();
    this.scene_pass.add(new THREE.Mesh(_geom, this.shdr_pass));
};

Glitch.prototype.init_buffer = function(){
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

    this.frame_buffer = [2];
    for(var i = 0; i < 2; i++){
        this.frame_buffer[i] = new THREE.WebGLRenderTarget(this.w, this.h, _format);
    }
};

Glitch.prototype.init_texture = function(){
	this.tex_test_pattern_original = new THREE.TextureLoader().load( 
		"../common/assets/test_pattern_original.jpg", 
        // "../common/assets/test_01.jpg", 
		_callback.bind(this),
		undefined,
		function ( err ) {
			console.error( 'errr texture not loaded' );
		}
	);

	function _callback(){
		this.tex_test_pattern_original.wrapS = THREE.ClampToEdgeWrapping;
	    this.tex_test_pattern_original.wrapT = THREE.ClampToEdgeWrapping;
	    this.tex_test_pattern_original.magFilter = THREE.LinearFilter;
	    this.tex_test_pattern_original.minFilter = THREE.LinearFilter;

	    // update shader with the ratio 
	    var _tex_res = new THREE.Vector2(
	    	this.tex_test_pattern_original.image.naturalWidth,
	    	this.tex_test_pattern_original.image.naturalHeight);
	    
        this.shdr_pass.uniforms.u_src_res.value = _tex_res;
	}
};

Glitch.prototype.init_shader = function(){
    var _screen_res = 'vec2( ' + this.w.toFixed( 1 ) +', ' + this.h.toFixed( 1 ) + ')';
    
    function load(_vert, _frag){
        return new THREE.ShaderMaterial( 
        { 
            defines: {
                SCREEN_RES: _screen_res
            },
            uniforms: {
                u_t: {value: 0},
                u_is_init: {value: false},
                u_audio_high: {value: 0.},
                u_audio_mid: {value: 0.},
                u_audio_bass: {value: 0.},
                u_audio_level: {value: 0.},
                u_audio_history: {value: 0.},
                u_tex_src: {value: null}
            },
            depthTest: {value: false},
            vertexShader:   _vert,
            fragmentShader: _frag
        });
    };
    this.shdr_glitch = load(shared_vert, glitch_frag);
    this.shdr_glitch.uniforms.is_master_ziggle = {value: this.master_ziggle};
    this.shdr_glitch.uniforms.is_monochrome = {value: this.monochrome};
    this.shdr_glitch.uniforms.is_low_wave = {value: this.low_wave};
    this.shdr_glitch.uniforms.is_high_wave = {value: this.high_wave};
    this.shdr_glitch.uniforms.is_bad_signals = {value: this.bad_signals};
    this.shdr_glitch.uniforms.is_VHS = {value: this.VHS};

    this.shdr_pass = new THREE.ShaderMaterial( 
        { 
            uniforms: {
            	u_tex_src: {value: null},
                u_src_res: {value: new THREE.Vector2(1.,1.)},
                u_screen_res: {value: new THREE.Vector2(this.w, this.h)}
            },
            depthTest: {value: false},
            vertexShader:   ratio_correct_vert,
            fragmentShader: master_frag
        });

    this.shdr_batch = [
    	this.shdr_glitch
    ];
};

Glitch.prototype.update_triggers = function(){
    this.shdr_glitch.uniforms.is_master_ziggle.value = this.master_ziggle;
    this.shdr_glitch.uniforms.is_monochrome.value = this.monochrome;
    this.shdr_glitch.uniforms.is_low_wave.value = this.low_wave;
    this.shdr_glitch.uniforms.is_high_wave.value = this.high_wave;
    this.shdr_glitch.uniforms.is_bad_signals.value = this.bad_signals;
    this.shdr_glitch.uniforms.is_VHS.value = this.VHS;
};



