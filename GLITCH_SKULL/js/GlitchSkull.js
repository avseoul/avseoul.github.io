var GlitchSkull = function(_renderer, _mouse, _analyzer, _is_retina){ 
    this.is_init = false;
    this.show_hdr = true;

    this.renderer = _renderer;
    this.audio_analyzer = _analyzer;
    this.mouse = _mouse;

    this.is_retina = _is_retina;

    this.w = _renderer.w;
    this.h = _renderer.h;

    this.frame = 1;

    this.z_target = 0.;
    
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

    this.shdr_feedback.uniforms.u_tex_src.value = this.fbo_feedback[this.frame^1].texture;
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

    var _obj_callback = function ( _is_wire, _normal_map, _disp_map, object ) {
        object.traverse( function ( child ) {
            if ( child instanceof THREE.Mesh ) {
                child.material.color = _is_wire ? new THREE.Color(.3, .3, .3) : new THREE.Color(0, 0, 0);
                child.material.bumpMap = _normal_map;
                child.material.displacementMap = _disp_map;
                child.material.normalMap = _normal_map;

                child.material.emissive = new THREE.Color(1.,1.,1.);
                child.material.emissiveIntensity = _is_wire ? 3. : .2;
                child.material.emissiveMap = this.fbo_feedback[this.frame].texture;

                child.material.relectivity = 0.99998;
                child.material.shininess = 3.;
                child.material.specular = new THREE.Color(1, 1, 1);
                
                child.material.wireframe = _is_wire;
                child.material.autoUpdate = true;

                child.material.transparent = true;
                child.material.blending = THREE.NormalBlending;
                
                // console.log(child.material);
            }
        }.bind(this) );
        object.position.y = -1.5;
        // object.position.z = 1.;
        object.scale.x = .8;
        object.scale.y = .8;
        object.scale.z = .8;

        object.castShadow = true;
        object.receiveShadow = true;
        object.children[0].castShadow = true;
        object.children[0].receiveShadow = true;

        this.scene.add(object);

        // console.log(object);
        // console.log(this.scene);
    }

    // var _custom_shader_obj_callback = function ( _scene, _is_wire, object ) {
    //     object.traverse( function ( child ) {
    //         if ( child instanceof THREE.Mesh ) {
    //             child.geometry = new THREE.Geometry().fromBufferGeometry( child.geometry );  
    //             child.geometry.mergeVertices(); 
    //             child.verticesNeedUpdate = true;
    //             child.normalsNeedUpdate = true;
    //             child.uvsNeedUpdate = true;
    //             child.geometry.computeVertexNormals(); 
    //             child.material = this.mesh; // <- for custom material
    //         }
    //     }.bind(this) );
    // }
    
    var loader = new THREE.OBJLoader( manager );
    loader.load( '../common/assets/Skull_B_up_low.obj', _obj_callback.bind(this, false, tex_normal_up, tex_up), onProgress, undefined );   
    loader.load( '../common/assets/Skull_B_down_low.obj', _obj_callback.bind(this, false, tex_normal_down, tex_down), onProgress, undefined );   

    loader.load( '../common/assets/Skull_B_up_low.obj', _obj_callback.bind(this, true, tex_normal_up, tex_up), onProgress, undefined );   
    loader.load( '../common/assets/Skull_B_down_low.obj', _obj_callback.bind(this, true, tex_normal_down, tex_down), onProgress, undefined );   
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
    var _geom = new THREE.PlaneBufferGeometry(1., 1., this.w, this.h);

    this.scene_obj_illum = new THREE.Scene();
    this.scene_obj_illum.add(new THREE.Mesh(_geom, this.shdr_obj_illum));

    this.scene_bg = new THREE.Scene();
    this.scene_bg.add(new THREE.Mesh(_geom, this.shdr_bg));

    this.scene_feedback = new THREE.Scene();
    this.scene_feedback.add(new THREE.Mesh(_geom, this.shdr_feedback));

    this.scene_master = new THREE.Scene();
    this.scene_master.add(new THREE.Mesh(_geom, this.shdr_master));

    this.scene = new THREE.Scene();

    var ambientLight = new THREE.AmbientLight( 0x404040 );
    var directionalLight1 = new THREE.DirectionalLight( 0xff0000 );
    var directionalLight2 = new THREE.DirectionalLight( 0x0000ff );
    directionalLight1.position.set( -4, -0, 4 );
    directionalLight2.position.set( 4, 0, -4 );

    directionalLight1.castShadow = true;
    directionalLight1.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 35, 1, .1, 20 ) );
    directionalLight1.shadow.bias = 0.0001;
    directionalLight1.shadow.mapSize.width = 256.;
    directionalLight1.shadow.mapSize.height = 256.;

    directionalLight2.castShadow = true;
    directionalLight2.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 35, 1, .1, 20 ) );
    directionalLight2.shadow.bias = 0.0001;
    directionalLight2.shadow.mapSize.width = 256.;
    directionalLight2.shadow.mapSize.height = 256.;

    this.scene.add( directionalLight1 );
    this.scene.add( directionalLight2 );
    this.scene.add( ambientLight );
};


GlitchSkull.prototype.ziggle_skull = function(){
    if(this.scene.children[3] && this.scene.children[4] && this.scene.children[6] && this.scene.children[6]){
        var _loc = this.scene.children[3].children[0].position.clone();
        var _rot = this.scene.children[3].children[0].rotation.clone();

        // update position values
        _loc.y = Math.sin(this.audio_analyzer.get_history()*2.) * .3;

        this.z_target = Math.abs(this.z_target - _loc.z) < .05 ? Math.random() * 13. - 10. : this.z_target;
        _loc.z += (this.z_target-_loc.z)*.035;

        // jaw
        var _jaw = _loc.clone();
        _jaw.y += Math.sin(this.audio_analyzer.get_history()*5.) * .2;

        // update rotation values
        _rot.y = Math.sin(this.audio_analyzer.get_history()*1.) * .4;
        _rot.x = Math.sin(this.audio_analyzer.get_history()*3.) * .2;
        
        // update objects
        // TODO - this is BAD BAD BAD way. objects should be allocated to variables next time
        for(var i = 3; i < 7; i++){ 
            if(this.scene.children[i].children[0].name.split('_')[2] == 'up'){
                this.scene.children[i].children[0].position.copy(_loc);
            } else {
                this.scene.children[i].children[0].position.copy(_jaw);
            }

            this.scene.children[i].children[0].rotation.copy(_rot);
        }
    }
};

GlitchSkull.prototype.ziggle_light = function(){
    if(this.scene.children[0] && this.scene.children[1]){
        this.scene.children[0].position.y = Math.sin(this.audio_analyzer.get_history()*6.) * 15.;
        this.scene.children[1].position.y = Math.sin(this.audio_analyzer.get_history()*6.) * -15.;
    }
};

GlitchSkull.prototype.resize = function(){
    this.w = this.renderer.w;
    this.h = this.renderer.h;

    this.init_buffer();
};
