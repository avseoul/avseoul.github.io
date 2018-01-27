var Glitch = function(_renderer, _analyzer, _is_retina, _is_mobile){
	this.is_init = false;

    this.renderer = _renderer;
    this.audio_analyzer = _analyzer;

    this.is_retina = _is_retina;
    this.is_mobile = _is_mobile;

    this.image_fit_horizontal = false;

    this.is_monochrome = false;
    this.is_glitch = false;

    this.w = _is_retina ? _renderer.w / 2. : _renderer.w / 1.;
    this.h = _is_retina ? _renderer.h / 2. : _renderer.h / 1.;

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

    this.w = this.is_retina ? this.renderer.w / 2. : this.renderer.w / 1.;
    this.h = this.is_retina ? this.renderer.h / 2. : this.renderer.h / 1.;
    this.shdr_pass.uniforms.u_screen_res.value = new THREE.Vector2(this.w, this.h);

    this.shdr_pass.uniforms.u_tex_src.value = this.tex_src;
    this.shdr_pass.uniforms.u_tex_blend.value = this.tex_blend;
    this.frame ^= 1;
    this.renderer.renderer.render( this.scene_pass, _cam, this.frame_buffer[this.frame]);

    if(this.is_glitch){
        this.shdr_glitch.uniforms.u_tex_src.value = this.frame_buffer[this.frame].texture;
        this.frame ^= 1;
        this.renderer.renderer.render( this.scene_glitch, _cam, this.frame_buffer[this.frame]);
    }
    
    this.shdr_VHS.uniforms.u_tex_src.value = this.frame_buffer[this.frame].texture;
    this.frame ^= 1;
    this.renderer.renderer.render( this.scene_VHS, _cam, this.frame_buffer[this.frame]);

    this.shuffle();

    if(this.is_monochrome){
        this.shdr_monochrome_intense.uniforms.u_tex_src.value = this.frame_buffer[this.frame].texture;
        this.frame ^= 1;
        this.renderer.renderer.render( this.scene_monochrome_intense, _cam, this.frame_buffer[this.frame]);
    }

    this.shdr_master.uniforms.u_tex_src.value = this.frame_buffer[this.frame].texture;
    this.frame ^= 1;
    this.renderer.renderer.render( this.scene_master, _cam);

    if(!this.is_init){ 
        this.is_init = true;

        console.log("Glitch : is initiated");
    }

    this.timer = this.renderer.get_timer();
};

Glitch.prototype.shuffle = function(){
    var _seed = Math.floor(this.renderer.get_timer()*1000.) % 40 == (Math.floor(Math.random()*40.));
    
    if(_seed){
        this.is_monochrome = Math.random() > .5 ? true : false;
        this.is_glitch = Math.random() > .5 ? true : false;

        var _tex_index = Math.floor(Math.random()*this.tex_batch.length);
        this.swap_texture(this.tex_batch[_tex_index]);
    }
};

Glitch.prototype.swap_texture = function(_selected){
    var _tex_res = new THREE.Vector2(
        _selected.image.naturalWidth,
        _selected.image.naturalHeight);
    
    this.shdr_pass.uniforms.u_src_res.value = _tex_res;
    this.tex_src = _selected;
}

Glitch.prototype.init_scene = function(){
    var _geom = new THREE.PlaneBufferGeometry(1., 1., this.w, this.h);

    this.scene_monochrome_intense = new THREE.Scene();
    this.scene_monochrome_intense.add(new THREE.Mesh(_geom, this.shdr_monochrome_intense));

    this.scene_glitch = new THREE.Scene();
    this.scene_glitch.add(new THREE.Mesh(_geom, this.shdr_glitch));

    this.scene_VHS = new THREE.Scene();
    this.scene_VHS.add(new THREE.Mesh(_geom, this.shdr_VHS));

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
	this.tex_src_01 = new THREE.TextureLoader().load( 
        // "../common/assets/test_01.jpg", 
        "../common/assets/test_pattern_ntsc.png", 
		_set_main_tex.bind(this),
		undefined,
		function ( err ) {
			console.error( 'errr texture not loaded' );
		}
	);
    this.tex_src_01.wrapS = THREE.ClampToEdgeWrapping;
    this.tex_src_01.wrapT = THREE.ClampToEdgeWrapping;
    this.tex_src_01.magFilter = THREE.LinearFilter;
    this.tex_src_01.minFilter = THREE.LinearFilter;

    this.tex_src_02 = new THREE.TextureLoader().load( 
        "../common/assets/test_pattern_black.jpg", 
        undefined,
        undefined,
        function ( err ) {
            console.error( 'errr texture not loaded' );
        }
    );
    this.tex_src_02.wrapS = THREE.ClampToEdgeWrapping;
    this.tex_src_02.wrapT = THREE.ClampToEdgeWrapping;
    this.tex_src_02.magFilter = THREE.LinearFilter;
    this.tex_src_02.minFilter = THREE.LinearFilter;

    this.tex_batch = [
        this.tex_src_01,
        this.tex_src_02
    ];

	function _set_main_tex(){
	    // update shader with the ratio 
	    var _tex_res = new THREE.Vector2(
	    	this.tex_src_01.image.naturalWidth,
	    	this.tex_src_01.image.naturalHeight);
	    
        this.shdr_pass.uniforms.u_src_res.value = _tex_res;
        this.tex_src = this.tex_src_01;
	}
};

Glitch.prototype.init_video_texture = function(_video){
    this.tex_blend = new THREE.VideoTexture( _video );

    this.tex_blend.wrapS = THREE.ClampToEdgeWrapping;
    this.tex_blend.wrapT = THREE.ClampToEdgeWrapping;
    this.tex_blend.minFilter = THREE.LinearFilter;
    this.tex_blend.magFilter = THREE.LinearFilter;
    this.tex_blend.format = THREE.RGBFormat;


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
    this.shdr_VHS = load(shared_vert, VHS_frag);
    this.shdr_monochrome_intense = load(shared_vert, monochrome_intense_frag);
    this.shdr_glitch = load(shared_vert, glitch_frag);
    this.shdr_master = load(shared_vert, master_frag);

    this.shdr_pass = load(ratio_correct_vert, feed_frag);
    this.shdr_pass.uniforms.u_src_res = {value: new THREE.Vector2(1.,1.)};
    this.shdr_pass.uniforms.u_screen_res = {value: new THREE.Vector2(this.w, this.h)};
    this.shdr_pass.uniforms.is_fit_horizontal = {value: this.image_fit_horizontal};
    this.shdr_pass.uniforms.u_tex_blend = {value: this.tex_blend};

    this.shdr_batch = [
    	this.shdr_monochrome_intense,
        this.shdr_VHS,
        this.shdr_glitch,
        this.shdr_pass,
        this.shdr_master
    ];
};

Glitch.prototype.update_triggers = function(){
    this.shdr_pass.uniforms.is_fit_horizontal.value = this.image_fit_horizontal;
};



