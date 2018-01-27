var GlitchSkull = function(_renderer, _analyzer, _is_retina){ 
    this.is_init = false;
    this.show_hdr = true;

    this.renderer = _renderer;
    this.audio_analyzer = _analyzer;

    this.is_retina = _is_retina;

    this.w = this.is_retina ? this.renderer.w * .5 : this.renderer.w;
    this.h = this.is_retina ? this.renderer.h * .5 : this.renderer.h;

    this.init_texture();
    this.init_shader();
    this.init_scene();
    this.init_cubemap();

    window.addEventListener('resize', this.resize.bind(this), false );
};

GlitchSkull.prototype.update = function(){ 
    
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

    // this.update_shadow_map();
    this.update_cubemap();

    var _cam = this.renderer.get_camera();
    this.renderer.renderer.render( this.scene, _cam);

    if(!this.is_init){ 
        this.is_init = true;

        console.log("GlitchSkull : is initiated");
    }

    this.timer = this.renderer.get_timer();
};


GlitchSkull.prototype.init_shader = function(){
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

    // scene shdr
    this.shdr_mesh = load(blob_vert, blob_frag);

    this.shdr_batch = [
        this.shdr_mesh
    ];
};

GlitchSkull.prototype.init_texture = function(){
    this.tex_sprite = new THREE.TextureLoader().load( "../common/assets/sprite_additive_rect.png" );
    this.tex_sprite.wrapS = THREE.ClampToEdgeWrapping;
    this.tex_sprite.wrapT = THREE.ClampToEdgeWrapping;
    this.tex_sprite.magFilter = THREE.LinearFilter;
    this.tex_sprite.minFilter = THREE.LinearFilter;
};

GlitchSkull.prototype.init_scene = function(){
    var _sphere_size = .7;
    var _geom = new THREE.SphereBufferGeometry(_sphere_size, 128, 128);
    var _geom_lowres = new THREE.SphereBufferGeometry(_sphere_size, 64, 64);

    this.scene = new THREE.Scene();
    this.shadow_scene = new THREE.Scene();

    var _mesh = new THREE.Mesh(_geom, this.shdr_mesh);
    var _wire = new THREE.Line(_geom_lowres, this.shdr_wire);
    var _points = new THREE.Points(_geom, this.shdr_points);
    var _shadow_mesh = new THREE.Mesh(_geom, this.shdr_shadow);

    var _pop_points = new THREE.Points(_geom_lowres, this.shdr_pop_points);
    var _pop_wire = new THREE.Line(_geom_lowres, this.shdr_pop_wire);

    var _pop_points_out = new THREE.Points(_geom_lowres, this.shdr_pop_points_out);
    var _pop_wire_out = new THREE.Line(_geom_lowres, this.shdr_pop_wire_out);
    
    this.scene.add(_mesh);
    this.scene.add(_wire);
    this.scene.add(_points);

    this.scene.add(_pop_points);
    this.scene.add(_pop_wire);
    this.scene.add(_pop_points_out);
    this.scene.add(_pop_wire_out);

    this.shadow_scene.add(_shadow_mesh);

    var _geom_cube = new THREE.BoxBufferGeometry(100, 100, 100);
    var _mesh_cube = new THREE.Mesh(_geom_cube, this.shdr_cubemap);

    var mS = (new THREE.Matrix4()).identity();
    mS.elements[0] = -1;
    mS.elements[5] = -1;
    mS.elements[10] = -1;

    _geom_cube.applyMatrix(mS);

    this.scene.add(_mesh_cube);
};

GlitchSkull.prototype.init_cubemap = function(){
    var _path = "../common/assets/";
    var _format = '.jpg';
    var _urls = [
        _path + 'px_3js' + _format, _path + 'nx_3js' + _format,
        _path + 'py_3js' + _format, _path + 'ny_3js' + _format,
        _path + 'pz_3js' + _format, _path + 'nz_3js' + _format
    ];
    
    this.cubemap = new THREE.CubeTextureLoader().load( _urls );
    this.cubemap.format = THREE.RGBFormat;

    this.shdr_mesh.uniforms.cubemap = {value: this.cubemap};
    this.shdr_cubemap.uniforms.u_cubemap.value = this.cubemap;
    this.shdr_cubemap.uniforms.u_show_cubemap = {value:this.show_hdr};
    this.shdr_mesh.defines.HAS_CUBEMAP = 'true';
};

GlitchSkull.prototype.resize = function(){
    this.w = this.is_retina ? this.renderer.w * .5 : this.renderer.w;
    this.h = this.is_retina ? this.renderer.h * .5 : this.renderer.h;
};
