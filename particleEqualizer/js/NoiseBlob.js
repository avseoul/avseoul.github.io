let NoiseBlob = function(_renderer, _analyzer, _light){ 
    this.renderer = _renderer;
    this.audio_analyzer = _analyzer;
    this.light = _light;
    this.shaderBatch;

    this.init_shader();
    this.init_scene();
};

NoiseBlob.prototype.update = function(){ 
    const high = this.audio_analyzer.get_high();
    const level = this.audio_analyzer.get_level();
    const audioHistory = this.audio_analyzer.get_history();

    const time = this.renderer.get_timer();
    
    for(const shader of this.shaderBatch){
        shader.uniforms.u_t.value = time;
        
        shader.uniforms.u_audio_high.value = high;
        shader.uniforms.u_audio_level.value = level;
        shader.uniforms.u_audio_history.value = audioHistory;
    }

    this.renderer.renderer.render( this.scene, this.renderer.get_camera());
};

NoiseBlob.prototype.init_shader = function(){
    const screen_res = 'vec2( ' + this.renderer.w.toFixed( 1 ) +', ' + this.renderer.h.toFixed( 1 ) + ')';
    const load = (_vert, _frag) => {
        return new THREE.ShaderMaterial({ 
            defines: {
                SCREEN_RES: screen_res
            },
            uniforms: {
                u_t: {value: 0},
                u_is_init: {value: false},
                u_audio_high: {value: 0.},
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
    this.shdr_points = load(blob_vert, blob_frag);
    this.shdr_pop_points = load(blob_vert, blob_frag);
    this.shdr_pop_wire = load(blob_vert, blob_frag);
    this.shdr_pop_points_out = load(blob_vert, blob_frag);
    this.shdr_pop_wire_out = load(blob_vert, blob_frag);

    this.shdr_mesh.extensions.derivatives = true;

    this.shdr_mesh.defines.IS_MESH = 'true';
    this.shdr_mesh.defines.HAS_SHADOW = 'true';
    this.shdr_wire.defines.IS_WIRE = 'true';
    this.shdr_points.defines.IS_POINTS = 'true';
    this.shdr_pop_points.defines.IS_POINTS = 'true';
    this.shdr_pop_points.defines.IS_POP = 'true';
    this.shdr_pop_wire.defines.IS_WIRE = 'true';
    this.shdr_pop_wire.defines.IS_POP = 'true';
    this.shdr_pop_points_out.defines.IS_POINTS = 'true';
    this.shdr_pop_points_out.defines.IS_POP_OUT = 'true';
    this.shdr_pop_wire_out.defines.IS_WIRE = 'true';
    this.shdr_pop_wire_out.defines.IS_POP_OUT = 'true';

    const spriteTex  = new THREE.TextureLoader().load( "../common/assets/sprite_additive_rect.png" );
    spriteTex .wrapS = THREE.ClampToEdgeWrapping;
    spriteTex .wrapT = THREE.ClampToEdgeWrapping;
    spriteTex .magFilter = THREE.LinearFilter;
    spriteTex .minFilter = THREE.LinearFilter;

    this.shdr_points.uniforms.spriteTex  = {value: spriteTex };
    this.shdr_pop_points.uniforms.spriteTex  = {value: spriteTex };
    this.shdr_pop_wire.uniforms.spriteTex  = {value: spriteTex };
    this.shdr_pop_points_out.uniforms.spriteTex  = {value: spriteTex };
    this.shdr_pop_wire_out.uniforms.spriteTex  = {value: spriteTex };
    
    this.shdr_points.blending = THREE.AdditiveBlending;
    this.shdr_wire.blending = THREE.AdditiveBlending;
    this.shdr_pop_points.blending = THREE.AdditiveBlending;
    this.shdr_pop_wire.blending = THREE.AdditiveBlending;
    this.shdr_pop_points_out.blending = THREE.AdditiveBlending;
    this.shdr_pop_wire_out.blending = THREE.AdditiveBlending;
    
    this.shdr_wire.transparent = true;
    this.shdr_points.transparent = true;
    this.shdr_pop_points.transparent = true;
    this.shdr_pop_wire.transparent = true;
    this.shdr_pop_points_out.transparent = true;
    this.shdr_pop_wire_out.transparent = true;


    this.shdr_wire.depthTest = false;
    this.shdr_points.depthTest = false;
    this.shdr_pop_points.depthTest = false;
    this.shdr_pop_wire.depthTest = false;
    this.shdr_pop_points_out.depthTest = false;
    this.shdr_pop_wire_out.depthTest = false;

    this.shaderBatch = [
        this.shdr_mesh, 
        this.shdr_wire, 
        this.shdr_points, 
        this.shdr_pop_points, 
        this.shdr_pop_wire, 
        this.shdr_pop_points_out, 
        this.shdr_pop_wire_out,
    ];
};

NoiseBlob.prototype.init_scene = function(){
    const _sphere_size = .7;
    const _geom = new THREE.SphereBufferGeometry(_sphere_size, 128, 128);
    const _geom_lowres = new THREE.SphereBufferGeometry(_sphere_size, 64, 64);

    this.scene = new THREE.Scene();

    const _mesh = new THREE.Mesh(_geom, this.shdr_mesh);
    const _wire = new THREE.Line(_geom_lowres, this.shdr_wire);
    const _points = new THREE.Points(_geom, this.shdr_points);

    const _pop_points = new THREE.Points(_geom_lowres, this.shdr_pop_points);
    const _pop_wire = new THREE.Line(_geom_lowres, this.shdr_pop_wire);

    const _pop_points_out = new THREE.Points(_geom_lowres, this.shdr_pop_points_out);
    const _pop_wire_out = new THREE.Line(_geom_lowres, this.shdr_pop_wire_out);
    
    this.scene.add(_mesh);
    this.scene.add(_wire);
    this.scene.add(_points);

    this.scene.add(_pop_points);
    this.scene.add(_pop_wire);
    this.scene.add(_pop_points_out);
    this.scene.add(_pop_wire_out);
}

NoiseBlob.prototype.debug_shadow_map = function(_show){
    this.shdr_mesh.uniforms.u_debug_shadow.value = _show;
};