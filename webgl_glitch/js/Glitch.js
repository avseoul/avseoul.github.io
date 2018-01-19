var Glitch = function(_renderer, _analyzer, _is_retina, _is_mobile){
	this.is_init = false;

    this.renderer = _renderer;
    this.audio_analyzer = _analyzer;

    this.is_retina = _is_retina;
    this.is_mobile = _is_mobile;

    this.is_hor_move = false;
    this.is_vhs = false;
    this.is_subtle = false;
    this.is_intense = false;
    this.is_bad_signals = false;

    this.w = _is_retina ? _renderer.w * 1. : _renderer.w;
    this.h = _is_retina ? _renderer.h * 1. : _renderer.h;

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

    if(this.is_hor_move){
	    this.shdr_hor_move.uniforms.u_tex_src.value = this.frame_buffer[this.frame];
	    this.frame ^= 1;
	    this.renderer.renderer.render( this.scene_hor_move, _cam, this.frame_buffer[this.frame]);
	}

    if(this.is_vhs){
        this.shdr_vhs.uniforms.u_tex_src.value = this.frame_buffer[this.frame].texture;
        this.frame ^= 1;
        this.renderer.renderer.render( this.scene_vhs, _cam, this.frame_buffer[this.frame]);
    }

    if(this.is_intense){
        this.shdr_intense.uniforms.u_tex_src.value = this.frame_buffer[this.frame].texture;
        this.frame ^= 1;
        this.renderer.renderer.render( this.scene_intense, _cam, this.frame_buffer[this.frame]);
    }
    
    if(this.is_subtle){
        this.shdr_subtle.uniforms.u_tex_src.value = this.frame_buffer[this.frame].texture;
        this.frame ^= 1;
        this.renderer.renderer.render( this.scene_subtle, _cam, this.frame_buffer[this.frame]);
    }

    if(this.is_bad_signals){
    	this.shdr_bad_signals.uniforms.u_tex_src.value = this.frame_buffer[this.frame].texture;
        this.frame ^= 1;
        this.renderer.renderer.render( this.scene_bad_signals, _cam, this.frame_buffer[this.frame]);
    }

    this.shdr_master.uniforms.u_tex_src.value = this.frame_buffer[this.frame].texture;
    this.renderer.renderer.render( this.scene_master, _cam);

    if(!this.is_init){ 
        this.is_init = true;

        console.log("Glitch : is initiated");
    }

    this.timer = this.renderer.get_timer();
};

Glitch.prototype.init_scene = function(){
    var _geom = new THREE.PlaneBufferGeometry(1., 1., this.w, this.h);

    this.scene_bad_signals = new THREE.Scene();
    this.scene_bad_signals.add(new THREE.Mesh(_geom, this.shdr_bad_signals));

    this.scene_hor_move = new THREE.Scene();
    this.scene_hor_move.add(new THREE.Mesh(_geom, this.shdr_hor_move));

    this.scene_intense = new THREE.Scene();
    this.scene_intense.add(new THREE.Mesh(_geom, this.shdr_intense));

    this.scene_subtle = new THREE.Scene();
    this.scene_subtle.add(new THREE.Mesh(_geom, this.shdr_subtle));

    this.scene_vhs = new THREE.Scene();
    this.scene_vhs.add(new THREE.Mesh(_geom, this.shdr_vhs));

    this.scene_master = new THREE.Scene();
    this.scene_master.add(new THREE.Mesh(_geom, this.shdr_master));

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
		// "../common/assets/test_pattern_original.jpg", 
        "../common/assets/test_01.jpg", 
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

    this.shdr_bad_signals = load(shared_vert, bad_signals_frag);
    this.shdr_hor_move = load(shared_vert, hor_move_frag);
    this.shdr_intense = load(shared_vert, intense_frag);
    this.shdr_subtle = load(shared_vert, subtle_frag);
    this.shdr_vhs = load(shared_vert, vhs_frag);
    this.shdr_master = load(shared_vert, master_frag);

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
    	this.shdr_bad_signals, 
    	this.shdr_hor_move,
    	this.shdr_intense,
    	this.shdr_subtle,
    	this.shdr_vhs,
    	this.shdr_master
    ];
};



