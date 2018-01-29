var GlitchSkull = function(_renderer, _mouse, _analyzer, _is_retina){ 
    this.is_init = false;
    this.show_hdr = true;

    this.renderer = _renderer;
    this.audio_analyzer = _analyzer;
    this.mouse = _mouse;

    this.is_retina = _is_retina;

    this.w = _is_retina ? _renderer.w / 1. : _renderer.w / 1.;
    this.h = _is_retina ? _renderer.h / 1. : _renderer.h / 1.;

    this.frame = 1;
    
    this.init_buffer();
    this.init_texture();
    this.init_shader();
    this.init_scene();
    this.load_obj();

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

    var _cam = this.renderer.get_camera();
    var _ortho = this.renderer.get_ortho();

    this.renderer.renderer.render( this.scene_obj_illum, _ortho, this.fbo_obj_illum );

    this.shdr_feedback.uniforms.u_tex_src.value = this.fbo_feedback[this.frame^1];
    this.shdr_feedback.uniforms.u_tex_input.value = this.fbo_obj_illum.texture;
    this.shdr_feedback.uniforms.u_mouse.value = new THREE.Vector2(this.mouse.get_norm_x(), this.mouse.get_norm_y());
    this.shdr_feedback.uniforms.u_mouse_dir.value = new THREE.Vector2(this.mouse.get_dir_x(), this.mouse.get_dir_y());
    this.renderer.renderer.render( this.scene_feedback, _ortho, this.fbo_feedback[this.frame] );

    this.shdr_bg.uniforms.u_tex_src.value = this.fbo_obj_illum.texture;
    this.renderer.renderer.render( this.scene_bg, _ortho, this.fbo_master);

    this.renderer.renderer.clearDepth();
    
    if(this.scene.children[3] && this.scene.children[4] && this.scene.children[5] && this.scene.children[6]){
        this.scene.children[3].children[0].material.emissiveMap = this.fbo_feedback[this.frame].texture;
        this.scene.children[4].children[0].material.emissiveMap = this.fbo_feedback[this.frame].texture;
        this.scene.children[5].children[0].material.emissiveMap = this.fbo_feedback[this.frame].texture;
        this.scene.children[6].children[0].material.emissiveMap = this.fbo_feedback[this.frame].texture;

        this.scene.children[0].rotation.x = _cam.rotation.z;
        this.scene.children[0].rotation.y = _cam.rotation.y;
        this.scene.children[0].rotation.z = _cam.rotation.x;

        this.scene.children[1].rotation.x = _cam.rotation.y;
        this.scene.children[1].rotation.y = _cam.rotation.x;
        this.scene.children[1].rotation.z = _cam.rotation.z;

        // console.log(this.scene.children[1]);
    }

    this.renderer.renderer.render( this.scene, _cam, this.fbo_master);

    this.shdr_master.uniforms.u_tex_src.value = this.fbo_master.texture;
    this.renderer.renderer.render( this.scene_master, _ortho);

    this.frame ^= 1;

    if(!this.is_init){ 
        this.is_init = true;

        console.log("GlitchSkull : is initiated");
    }

    this.timer = this.renderer.get_timer();
};

GlitchSkull.prototype.load_obj = function(){
    var manager = new THREE.LoadingManager();
    manager.onProgress = function ( item, loaded, total ) {
        console.log( item, loaded, total );
    };

    var textureLoader = new THREE.TextureLoader( manager );
    var tex_normal_up = textureLoader.load( '../common/assets/NormalmapSkull_B_up.jpg' );
    var tex_normal_down = textureLoader.load( '../common/assets/NormalmapSkull_B_down.jpg' );
    var tex_up = textureLoader.load( '../common/assets/DisplacementSkull_B_up.jpg' );
    var tex_down = textureLoader.load( '../common/assets/DisplacementSkull_B_down.jpg' );
    
    // model
    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round(percentComplete, 2) + '% downloaded' );
        }
    };

    var _obj_callback = function ( _is_wire, object ) {
        object.traverse( function ( child ) {
            if ( child instanceof THREE.Mesh ) {
                child.material.color = _is_wire ? new THREE.Color(.3, .3, .3) : new THREE.Color(0, 0, 0);
                child.material.bumpMap = tex_normal_up;
                child.material.displacementMap = tex_up;
                child.material.normalMap = tex_normal_up;

                child.material.emissive = new THREE.Color(1.,1.,1.);
                child.material.emissiveIntensity = _is_wire ? 30. : 1.;
                child.material.emissiveMap = this.fbo_feedback[this.frame].texture;

                child.material.relectivity = 1.;
                child.material.shininess = _is_wire ? 300. : 50.;
                child.material.specular = new THREE.Color(.6, .6, .6);
                
                child.material.wireframe = _is_wire;
                child.material.autoUpdate = true;

                child.material.transparent = true;
                child.material.premultipliedAlpha = true;
                child.material.blending = THREE.NormalBlending;
                
                console.log(child.material);
            }
        }.bind(this) );
        object.position.y = -1.7;
        object.position.z = 1.;
        object.scale.x = .9;
        object.scale.y = .9;
        object.scale.z = .9;

        object.castShadow = true;
        object.receiveShadow = true;

        console.log(object);

        this.scene.add( object );
    }

    var _custom_shader_obj_callback = function ( _scene, _is_wire, object ) {
        object.traverse( function ( child ) {
            if ( child instanceof THREE.Mesh ) {
                child.geometry = new THREE.Geometry().fromBufferGeometry( child.geometry );  
                child.geometry.mergeVertices(); 

                child.verticesNeedUpdate = true;
                child.normalsNeedUpdate = true;
                child.uvsNeedUpdate = true;

                child.geometry.computeVertexNormals(); 

                child.material = this.mesh; // <- for custom material
            }
        }.bind(this) );
        object.position.y = -1.;
        object.position.z = 3.;
        object.scale.x = .6;
        object.scale.y = .6;
        object.scale.z = .6;

        // console.log(object);

        _scene.add( object );
    }
    
    var loader = new THREE.OBJLoader( manager );
    loader.load( '../common/assets/Skull_B_up_low.obj', _obj_callback.bind(this, false), onProgress, undefined );   
    loader.load( '../common/assets/Skull_B_down_low.obj', _obj_callback.bind(this, false), onProgress, undefined );   

    loader.load( '../common/assets/Skull_B_up_low.obj', _obj_callback.bind(this, true), onProgress, undefined );   
    loader.load( '../common/assets/Skull_B_down_low.obj', _obj_callback.bind(this, true), onProgress, undefined );   

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
    this.shdr_obj_illum = load(shared_vert, obj_illum_frag);
    this.shdr_obj_illum.uniforms.u_tex_noise = {value: this.tex_noise};

    this.shdr_bg = load(shared_vert, bg_frag);
    this.shdr_bg.uniforms.u_tex_src = {value: null};

    this.shdr_feedback = load(shared_vert, feedback_frag);
    this.shdr_feedback.uniforms.u_tex_src = {value: null};
    this.shdr_feedback.uniforms.u_tex_input = {value: null};
    this.shdr_feedback.uniforms.u_tex_noise = {value: this.tex_noise};
    this.shdr_feedback.uniforms.u_mouse = {value: null};
    this.shdr_feedback.uniforms.u_mouse_dir = {value: null};

    this.shdr_master = load(shared_vert, master_frag);
    this.shdr_master.uniforms.u_tex_src = {value: null};

    this.shdr_batch = [
        this.shdr_obj_illum, 
        this.shdr_bg,
        this.shdr_feedback,
        this.shdr_master
    ];
};

GlitchSkull.prototype.init_texture = function(){
    this.tex_noise = new THREE.TextureLoader().load( "../common/assets/noise.jpg" );
    this.tex_noise.wrapS = THREE.ClampToEdgeWrapping;
    this.tex_noise.wrapT = THREE.ClampToEdgeWrapping;
    this.tex_noise.magFilter = THREE.LinearFilter;
    this.tex_noise.minFilter = THREE.LinearFilter;
};

GlitchSkull.prototype.init_buffer = function(){
    // frame buffers 
    var _format = {
        wrapS: THREE.ClampToEdgeWrapping,
        wrapT: THREE.ClampToEdgeWrapping,
        minFilter:THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        type: this.is_mobile ? THREE.HalfFloatTye : THREE.FloatType,
        format: THREE.RGBAFormat,
        stencilBuffer:false,
        depthBuffer:true
    };

    this.fbo_input = [2];
    this.fbo_feedback = [2];

    for(var i = 0; i < 2; i++){
        this.fbo_input[i] = new THREE.WebGLRenderTarget(this.w, this.h, _format);
        this.fbo_feedback[i] = new THREE.WebGLRenderTarget(this.w, this.h, _format);
    }
    this.fbo_obj_illum = new THREE.WebGLRenderTarget(this.w, this.h, _format);
    this.fbo_master = new THREE.WebGLRenderTarget(this.w, this.h, _format);
};

GlitchSkull.prototype.init_scene = function(){
    this.scene = new THREE.Scene();

    var ambientLight = new THREE.AmbientLight( 0x404040 );
    var directionalLight1 = new THREE.DirectionalLight( 0xC0C0C0 );
    var directionalLight2 = new THREE.DirectionalLight( 0xC0C0C0 );
    directionalLight1.position.set( -100, -50, 100 );
    directionalLight2.position.set( 100, 50, -100 );

    directionalLight1.castShadow = true;
    directionalLight1.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 50, 1, 1200, 2500 ) );
    directionalLight1.shadow.bias = 0.0001;
    directionalLight1.shadow.mapSize.width = 1024.;
    directionalLight1.shadow.mapSize.height = 1024.;

    directionalLight2.castShadow = true;
    directionalLight2.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 50, 1, 1200, 2500 ) );
    directionalLight2.shadow.bias = 0.0001;
    directionalLight2.shadow.mapSize.width = 1024.;
    directionalLight2.shadow.mapSize.height = 1024.;

    this.scene.add( directionalLight1 );
    this.scene.add( directionalLight2 );
    this.scene.add( ambientLight );

    // var helper = new THREE.GridHelper( 1200, 60, 0xFF4444, 0x404040 );
    // this.scene.add( helper );

    var _geom = new THREE.PlaneBufferGeometry(1., 1., this.w, this.h);

    this.scene_obj_illum = new THREE.Scene();
    this.scene_obj_illum.add(new THREE.Mesh(_geom, this.shdr_obj_illum));

    this.scene_bg = new THREE.Scene();
    this.scene_bg.add(new THREE.Mesh(_geom, this.shdr_bg));

    this.scene_feedback = new THREE.Scene();
    this.scene_feedback.add(new THREE.Mesh(_geom, this.shdr_feedback));

    this.scene_master = new THREE.Scene();
    this.scene_master.add(new THREE.Mesh(_geom, this.shdr_master));
};

GlitchSkull.prototype.resize = function(){
    this.w = this.is_retina ? this.renderer.w * 1. : this.renderer.w;
    this.h = this.is_retina ? this.renderer.h * 1. : this.renderer.h;
};
