var NoiseBlob = function(_renderer, _mouse_handler, _m_analyzer){ 
    this.is_init = false;

    this.renderer = _renderer;
    this.mouse_handler = _mouse_handler;
    this.audio_analyzer = _m_analyzer;

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

    var _shdrs = [this.shdr_mesh, this.shdr_wire, this.shdr_points];
    var _shdrs_size = _shdrs.length;
    for(var i = 0; i < _shdrs_size; i++){
        _shdrs[i].uniforms.u_mouse.value = new THREE.Vector2(this.mouse_norm_x, this.mouse_norm_y);
        _shdrs[i].uniforms.u_mouse_delta = new THREE.Vector2(this.mouse_delta_x, this.mouse_delta_y);
        _shdrs[i].uniforms.u_is_init.value = this.is_init;
        _shdrs[i].uniforms.u_t.value = this.timer;
    }

    var _matrix = this.renderer.get_matrix();
    this.renderer.renderer.render( this.scene, _matrix );

    if(!this.is_init){ 
        this.is_init = true;

        console.log("NoiseBlob : is initiated");
    }

    this.timer = this.renderer.get_timer();
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
                u_is_init: {value: false}
            },
            vertexShader:   _vert,
            fragmentShader: _frag
        });
    };

    this.shdr_mesh = load(blob_vert, blob_frag);
    this.shdr_wire = load(blob_vert, blob_frag);
    this.shdr_points =load(blob_vert, blob_frag);

    this.shdr_mesh.defines.IS_MESH = 'true';
    this.shdr_wire.defines.IS_WIRE = 'true';
    this.shdr_points.defines.IS_POINTS = 'true';

    this.shdr_points.uniforms.tex_sprite = {value: this.tex_sprite};
    
    this.shdr_points.blending = THREE.AdditiveBlending;
    this.shdr_wire.blending = THREE.AdditiveBlending;
    
    this.shdr_wire.transparent = true;
    this.shdr_points.transparent = true;
};

NoiseBlob.prototype.init_texture = function(){
    this.tex_sprite = new THREE.TextureLoader().load( "../common/assets/sprite_additive.png" );
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

    var _mesh = new THREE.Mesh(_geom, this.shdr_mesh);
    var _wire = new THREE.Line(_geom_lowres, this.shdr_wire);
    var _points = new THREE.Points(_geom_lowres, this.shdr_points);
    
    this.scene.add(_mesh);
    this.scene.add(_wire);
    this.scene.add(_points);   
};

NoiseBlob.prototype.set_retina = function(){
    this.w *= .5;
    this.h *= .5;
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

    this.shdr_mesh.defines.IS_PBR = 'true';
};