var NoiseBlob = function(_renderer, _mouse_handler, _m_analyzer){ 
    this.is_init = false;

    this.renderer = _renderer;
    this.mouse_handler = _mouse_handler;
    this.audio_analyzer = _m_analyzer;

    this.w = _renderer.w;
    this.h = _renderer.h;

    this.matrix = _renderer.matrix;

    this.init_shader();
    this.init_scene();
};

NoiseBlob.prototype.update = function(){ 
    this.mouse_norm_x = this.mouse_handler.get_norm_x(); 
    this.mouse_norm_y = this.mouse_handler.get_norm_y();
    this.mouse_delta_x = this.mouse_handler.get_delta_x();
    this.mouse_delta_y = this.mouse_handler.get_delta_y();

    this.shdr.uniforms.u_mouse.value = new THREE.Vector2(this.mouse_norm_x, this.mouse_norm_y);
    this.shdr.uniforms.u_mouse_delta = new THREE.Vector2(this.mouse_delta_x, this.mouse_delta_y);
    this.shdr.uniforms.u_is_init.value = this.is_init;
    this.shdr.uniforms.u_t.value = this.timer;

    this.renderer.renderer.render( this.scene, this.matrix );

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

    this.shdr = load(blob_vert, blob_frag);
};

NoiseBlob.prototype.init_scene = function(){
    var _geom = new THREE.SphereBufferGeometry(.7, 128, 128);

    this.scene = new THREE.Scene();

    var _mesh = new THREE.Mesh(_geom, this.shdr);
    this.scene.add(_mesh);    
};

NoiseBlob.prototype.set_retina = function(){
    this.w *= .5;
    this.h *= .5;
};