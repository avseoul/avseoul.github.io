var NoiseBlob = function(_renderer, _mouse_handler, _analyzer, _light){ 
    this.is_init = false;

    this.renderer = _renderer;
    this.mouse_handler = _mouse_handler;
    this.audio_analyzer = _analyzer;
    this.light = _light;

    this.w = _renderer.w;
    this.h = _renderer.h;

    this.init_texture();
    this.init_shader();
    this.init_scene();
};

NoiseBlob.prototype.update = function(){ 
    this.mouse_norm_x = this.mouse_handler.get_norm_x(); 
    this.mouse_norm_y = this.mouse_handler.get_norm_y();
    this.mouse_delta_x = this.mouse_handler.get_delta_x();
    this.mouse_delta_y = this.mouse_handler.get_delta_y();

    var _shdrs = [this.shdr_mesh, this.shdr_wire, this.shdr_points, this.shdr_shadow];
    var _shdrs_size = _shdrs.length;
    for(var i = 0; i < _shdrs_size; i++){
        _shdrs[i].uniforms.u_mouse.value = new THREE.Vector2(this.mouse_norm_x, this.mouse_norm_y);
        _shdrs[i].uniforms.u_mouse_delta = new THREE.Vector2(this.mouse_delta_x, this.mouse_delta_y);
        _shdrs[i].uniforms.u_is_init.value = this.is_init;
        _shdrs[i].uniforms.u_t.value = this.timer;
        
        _shdrs[i].uniforms.u_audio_high.value = this.audio_analyzer.get_high();
        _shdrs[i].uniforms.u_audio_mid.value = this.audio_analyzer.get_mid();
        _shdrs[i].uniforms.u_audio_bass.value = this.audio_analyzer.get_bass();
        _shdrs[i].uniforms.u_audio_level.value = this.audio_analyzer.get_level();
        _shdrs[i].uniforms.u_audio_history.value = this.audio_analyzer.get_history();
    }

    this.update_shadow_map();

    var _cam = this.renderer.get_camera();
    this.renderer.renderer.render( this.scene, _cam);

    if(!this.is_init){ 
        this.is_init = true;

        console.log("NoiseBlob : is initiated");
    }

    this.timer = this.renderer.get_timer();
};

NoiseBlob.prototype.update_shadow_map = function(){
    var _shadow_cam = this.light.get_light();
    var _shdow_fbo = this.light.get_shadow_frame_buffer();

    this.renderer.renderer.render(this.shadow_scene, _shadow_cam, _shdow_fbo);

    var _light_pos = this.light.get_light_pos();
    _light_pos.applyMatrix4(this.renderer.matrix.modelViewMatrix);
    
    var _shadow_matrix = new THREE.Matrix4();
    _shadow_matrix.identity();
    _shadow_matrix.multiplyMatrices ( 
        this.light.get_light().projectionMatrix, 
        this.light.get_light().modelViewMatrix );

    this.shdr_mesh.uniforms.u_light_pos.value = _light_pos;
    this.shdr_mesh.uniforms.u_shadow_matrix.value = _shadow_matrix;
    this.shdr_mesh.uniforms.u_shadow_map.value = this.light.get_shadow_map();
};

NoiseBlob.prototype.init_shader = function(){
    var screen_res = 'vec2( ' + this.w.toFixed( 1 ) +', ' + this.h.toFixed( 1 ) + ')';
    
    function load(_vert, _frag){
        return new THREE.ShaderMaterial( 
        { 
            defines: {
                SCREEN_RES: screen_res
            },
            uniforms: {
                u_mouse: {value: new THREE.Vector2(this.mouse_norm_x, this.mouse_norm_y)},
                u_mouse_delta: {value: new THREE.Vector2(this.mouse_delta_x, this.mouse_delta_y)},
                u_t: {value: 0},
                u_is_init: {value: false},
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
    this.shdr_wire = load(blob_vert, blob_frag);
    this.shdr_points =load(blob_vert, blob_frag);
    this.shdr_shadow = load(blob_vert, blob_frag);

    this.shdr_mesh.extensions.derivatives = true;

    this.shdr_mesh.defines.IS_MESH = 'true';
    this.shdr_mesh.defines.HAS_SHADOW = 'true';
    this.shdr_wire.defines.IS_WIRE = 'true';
    this.shdr_points.defines.IS_POINTS = 'true';
    this.shdr_shadow.defines.IS_SHADOW = 'true';

    var _light_pos = this.light.get_light_pos();
    _light_pos.applyMatrix4(this.renderer.matrix.modelViewMatrix);
    
    var _shadow_matrix = new THREE.Matrix4();
    _shadow_matrix.identity();
    _shadow_matrix.multiplyMatrices ( 
        this.light.get_light().projectionMatrix, 
        this.light.get_light().modelViewMatrix );

    this.shdr_mesh.uniforms.u_light_pos = {value: _light_pos};
    this.shdr_mesh.uniforms.u_shadow_matrix = {value: _shadow_matrix};
    this.shdr_mesh.uniforms.u_shadow_map = {value: this.light.get_shadow_map()};
    this.shdr_mesh.uniforms.u_debug_shadow = {value: false};
    this.shdr_points.uniforms.tex_sprite = {value: this.tex_sprite};
    
    this.shdr_points.blending = THREE.AdditiveBlending;
    this.shdr_wire.blending = THREE.AdditiveBlending;
    
    this.shdr_wire.transparent = true;
    this.shdr_points.transparent = true;

    this.shdr_wire.depthTest = false;
    this.shdr_points.depthTest = false;
};

NoiseBlob.prototype.init_texture = function(){
    this.tex_sprite = new THREE.TextureLoader().load( "../common/assets/sprite_additive_rect.png" );
    this.tex_sprite.wrapS = THREE.ClampToEdgeWrapping;
    this.tex_sprite.wrapT = THREE.ClampToEdgeWrapping;
    this.tex_sprite.magFilter = THREE.LinearFilter;
    this.tex_sprite.minFilter = THREE.LinearFilter;
};

NoiseBlob.prototype.init_scene = function(){
    var _sphere_size = .7;
    var _geom = new THREE.SphereBufferGeometry(_sphere_size, 128, 128);
    var _geom_lowres = new THREE.SphereBufferGeometry(_sphere_size, 64, 64);

    this.scene = new THREE.Scene();
    this.shadow_scene = new THREE.Scene();

    var _mesh = new THREE.Mesh(_geom, this.shdr_mesh);
    var _wire = new THREE.Line(_geom_lowres, this.shdr_wire);
    var _points = new THREE.Points(_geom, this.shdr_points);
    var _shadow_mesh = new THREE.Mesh(_geom, this.shdr_shadow);
    
    this.scene.add(_mesh);
    this.scene.add(_wire);
    this.scene.add(_points);

    this.shadow_scene.add(_shadow_mesh);
};

NoiseBlob.prototype.set_retina = function(){
    this.w *= .5;
    this.h *= .5;
};

NoiseBlob.prototype.set_hdr_bg = function(_show){
    this.scene.background = _show ? this.cubemap.get_cubemap() : new THREE.Vector3(0., 0., 0.);
};

NoiseBlob.prototype.set_cubemap = function(_cube){
    this.cubemap = _cube;
    this.shdr_mesh.uniforms.cubemap = {value: this.cubemap.get_cubemap()};
    this.shdr_mesh.defines.HAS_CUBEMAP = 'true';
};

NoiseBlob.prototype.set_PBR = function(_pbr){
    this.pbr = _pbr;

    this.shdr_mesh.uniforms.tex_normal = {value: this.pbr.get_normal_map()};
    this.shdr_mesh.uniforms.tex_roughness = {value: this.pbr.get_roughness_map()};
    this.shdr_mesh.uniforms.tex_metallic = {value: this.pbr.get_metallic_map()};
    
    this.shdr_mesh.uniforms.u_normal = {value: this.pbr.get_normal()};
    this.shdr_mesh.uniforms.u_roughness = {value: this.pbr.get_roughness()};
    this.shdr_mesh.uniforms.u_metallic = {value: this.pbr.get_metallic()};
    
    this.shdr_mesh.uniforms.u_exposure = {value: this.pbr.get_exposure()};
    this.shdr_mesh.uniforms.u_gamma = {value: this.pbr.get_gamma()};

    this.shdr_mesh.uniforms.u_view_matrix_inverse = {value: this.renderer.get_inversed_matrix()};

    this.shdr_mesh.defines.IS_PBR = 'true';
};

NoiseBlob.prototype.update_PBR = function(){
    this.shdr_mesh.uniforms.u_normal.value = this.pbr.get_normal();
    this.shdr_mesh.uniforms.u_roughness.value = this.pbr.get_roughness();
    this.shdr_mesh.uniforms.u_metallic.value = this.pbr.get_metallic();
    
    this.shdr_mesh.uniforms.u_exposure.value = this.pbr.get_exposure();
    this.shdr_mesh.uniforms.u_gamma.value = this.pbr.get_gamma();

    this.shdr_mesh.uniforms.u_view_matrix_inverse.value = this.renderer.get_inversed_matrix();
};

NoiseBlob.prototype.debug_shadow_map = function(_show){
    this.shdr_mesh.uniforms.u_debug_shadow.value = _show;
};