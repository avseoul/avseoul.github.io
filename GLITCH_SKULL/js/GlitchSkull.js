let GlitchSkull = function (_renderer, _mouse, _analyzer, _is_retina) {
    this.isInit = false;
    this.show_hdr = true;

    this.renderer = _renderer;
    this.audio_analyzer = _analyzer;
    this.mouse = _mouse;

    this.is_retina = _is_retina;

    this.frame = 1;

    this.z_target = 0.;

    this.upperPart;
    this.lowerPart;
    this.transform;

    this.init_buffer();
    this.init_shader();
    this.init_scene();
    this.load_obj();

    window.addEventListener('resize', this.resize.bind(this), false);
};

GlitchSkull.prototype.update = function () {

    const high = this.audio_analyzer.get_high();
    const mid = this.audio_analyzer.get_mid();
    const bass = this.audio_analyzer.get_bass();
    const level = this.audio_analyzer.get_level();
    const audioHistory = this.audio_analyzer.get_history();

    const time = this.renderer.get_timer();

    for (const shader of this.shdr_batch) {
        shader.uniforms.u_t.value = time;

        shader.uniforms.u_audio_high.value = high;
        shader.uniforms.u_audio_mid.value = mid;
        shader.uniforms.u_audio_bass.value = bass;
        shader.uniforms.u_audio_level.value = level;
        shader.uniforms.u_audio_history.value = audioHistory;
    }

    const camera = this.renderer.get_camera();
    const orthoCamera = this.renderer.get_ortho();

    this.renderer.renderer.render(this.scene_obj_illum, orthoCamera, this.fbo_obj_illum);

    this.shdr_feedback.uniforms.u_tex_src.value = this.fbo_feedback[this.frame ^ 1].texture;
    this.shdr_feedback.uniforms.u_tex_input.value = this.fbo_obj_illum.texture;
    this.renderer.renderer.render(this.scene_feedback, orthoCamera, this.fbo_feedback[this.frame]);

    this.shdr_bg.uniforms.u_tex_src.value = this.fbo_obj_illum.texture;
    this.renderer.renderer.render(this.scene_bg, orthoCamera, this.fbo_master);

    this.renderer.renderer.clearDepth();

    const feedbackTex = this.fbo_feedback[this.frame].texture;
    if (this.isInit) {
        this.upperPart.children[0].children[0].material.emissiveMap = feedbackTex;
        this.upperPart.children[1].children[0].material.emissiveMap = feedbackTex;
        this.lowerPart.children[0].children[0].material.emissiveMap = feedbackTex;
        this.lowerPart.children[1].children[0].material.emissiveMap = feedbackTex;
    }   

    this.renderer.renderer.render(this.scene, camera, this.fbo_master);
        
    this.shdr_master.uniforms.u_tex_src.value = this.fbo_master.texture;
    this.renderer.renderer.render(this.scene_master, orthoCamera);

    this.frame ^= 1;
    if (this.upperPart.children.length == 2 && this.lowerPart.children.length == 2) {
        this.isInit = true;
    }
};

GlitchSkull.prototype.load_obj = function () {
    const manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
    };

    const textureLoader = new THREE.TextureLoader(manager);
    const tex_normal_up = textureLoader.load('../common/assets/NormalmapSkull_B_up.jpg');
    const tex_normal_down = textureLoader.load('../common/assets/NormalmapSkull_B_down.jpg');
    const tex_up = textureLoader.load('../common/assets/DisplacementSkull_B_up.jpg');
    const tex_down = textureLoader.load('../common/assets/DisplacementSkull_B_down.jpg');

    // model
    const onProgress = function (xhr) {
        if (xhr.lengthComputable) {
            const percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };

    const objOnLoadCallback = function (isWire, normalMap, displaceMap, node, object) {
        object.traverse(function (mesh) {
            if (mesh instanceof THREE.Mesh) {
                mesh.material.color = isWire ? new THREE.Color(.3, .3, .3) : new THREE.Color(0, 0, 0);
                mesh.material.bumpMap = normalMap;
                mesh.material.displacementMap = displaceMap;
                mesh.material.normalMap = normalMap;

                mesh.material.emissive = new THREE.Color(1., 1., 1.);
                mesh.material.emissiveIntensity = isWire ? 3. : .2;
                mesh.material.emissiveMap = this.fbo_feedback[this.frame].texture;

                mesh.material.relectivity = 0.99998;
                mesh.material.shininess = 3.;
                mesh.material.specular = new THREE.Color(1, 1, 1);

                mesh.material.wireframe = isWire;
                mesh.material.autoUpdate = true;

                mesh.material.transparent = true;
                mesh.material.blending = THREE.NormalBlending;
            }
        }.bind(this));

        object.position.y = -1.5;
        object.scale.x = .8;
        object.scale.y = .8;
        object.scale.z = .8;

        object.castShadow = true;
        object.receiveShadow = true;
        object.children[0].castShadow = true;
        object.children[0].receiveShadow = true;

        node.add(object);
    }

    this.upperPart = new THREE.Group();
    this.lowerPart = new THREE.Group();

    this.transform = new THREE.Group();

    this.transform.add(this.upperPart);
    this.transform.add(this.lowerPart);

    this.scene.add(this.transform);

    const loader = new THREE.OBJLoader(manager);
    loader.load('../common/assets/Skull_B_up_low.obj', objOnLoadCallback.bind(this, false, tex_normal_up, tex_up, this.upperPart), onProgress, undefined);
    loader.load('../common/assets/Skull_B_down_low.obj', objOnLoadCallback.bind(this, false, tex_normal_down, tex_down, this.lowerPart), onProgress, undefined);

    loader.load('../common/assets/Skull_B_up_low.obj', objOnLoadCallback.bind(this, true, tex_normal_up, tex_up, this.upperPart), onProgress, undefined);
    loader.load('../common/assets/Skull_B_down_low.obj', objOnLoadCallback.bind(this, true, tex_normal_down, tex_down, this.lowerPart), onProgress, undefined);
};


GlitchSkull.prototype.init_shader = function () {
    const noiseTex = new THREE.TextureLoader().load("../common/assets/noise.jpg");
    noiseTex.wrapS = THREE.ClampToEdgeWrapping;
    noiseTex.wrapT = THREE.ClampToEdgeWrapping;
    noiseTex.magFilter = THREE.LinearFilter;
    noiseTex.minFilter = THREE.LinearFilter;

    const load = (vert, frag) => {
        return new THREE.ShaderMaterial({
            uniforms: {
                u_t: { value: 0 },
                u_is_init: { value: false },
                u_res: { value: new THREE.Vector2(this.renderer.w, this.renderer.h) },
                u_audio_high: { value: 0. },
                u_audio_mid: { value: 0. },
                u_audio_bass: { value: 0. },
                u_audio_level: { value: 0. },
                u_audio_history: { value: 0. }
            },
            vertexShader: vert,
            fragmentShader: frag
        });
    };

    // scene shdr
    this.shdr_obj_illum = load(shared_vert, obj_illum_frag);
    this.shdr_obj_illum.uniforms.u_tex_noise = { value: noiseTex };

    this.shdr_bg = load(shared_vert, bg_frag);
    this.shdr_bg.uniforms.u_tex_src = { value: null };

    this.shdr_feedback = load(shared_vert, feedback_frag);
    this.shdr_feedback.uniforms.u_tex_src = { value: null };
    this.shdr_feedback.uniforms.u_tex_input = { value: null };
    this.shdr_feedback.uniforms.u_tex_noise = { value: noiseTex };
    this.shdr_feedback.uniforms.u_mouse = { value: null };
    this.shdr_feedback.uniforms.u_mouse_dir = { value: null };

    this.shdr_master = load(shared_vert, master_frag);
    this.shdr_master.uniforms.u_tex_src = { value: null };

    this.shdr_batch = [
        this.shdr_obj_illum,
        this.shdr_bg,
        this.shdr_feedback,
        this.shdr_master
    ];
};

GlitchSkull.prototype.init_buffer = function () {
    // frame buffers 
    const format = {
        wrapS: THREE.ClampToEdgeWrapping,
        wrapT: THREE.ClampToEdgeWrapping,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        type: this.is_mobile ? THREE.HalfFloatTye : THREE.FloatType,
        format: THREE.RGBAFormat,
        stencilBuffer: false,
        depthBuffer: true
    };

    const bufferSize = 1024;

    this.fbo_input = [2];
    this.fbo_feedback = [2];

    for (let i = 0; i < 2; i++) {
        this.fbo_input[i] = new THREE.WebGLRenderTarget(bufferSize, bufferSize, format);
        this.fbo_feedback[i] = new THREE.WebGLRenderTarget(bufferSize, bufferSize, format);
    }
    this.fbo_obj_illum = new THREE.WebGLRenderTarget(bufferSize, bufferSize, format);
    this.fbo_master = new THREE.WebGLRenderTarget(bufferSize, bufferSize, format);
};

GlitchSkull.prototype.init_scene = function () {
    const geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1);

    this.scene_obj_illum = new THREE.Scene();
    this.scene_obj_illum.add(new THREE.Mesh(geometry, this.shdr_obj_illum));

    this.scene_bg = new THREE.Scene();
    this.scene_bg.add(new THREE.Mesh(geometry, this.shdr_bg));

    this.scene_feedback = new THREE.Scene();
    this.scene_feedback.add(new THREE.Mesh(geometry, this.shdr_feedback));

    this.scene_master = new THREE.Scene();
    this.scene_master.add(new THREE.Mesh(geometry, this.shdr_master));

    this.scene = new THREE.Scene();

    const ambientLight = new THREE.AmbientLight(0x404040);
    const directionalLight1 = new THREE.DirectionalLight(0xff0000);
    const directionalLight2 = new THREE.DirectionalLight(0x0000ff);
    directionalLight1.position.set(-4, -0, 4);
    directionalLight2.position.set(4, 0, -4);

    directionalLight1.castShadow = true;
    directionalLight1.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(35, 1, .1, 20));
    directionalLight1.shadow.bias = 0.0001;
    directionalLight1.shadow.mapSize.width = 256.;
    directionalLight1.shadow.mapSize.height = 256.;

    directionalLight2.castShadow = true;
    directionalLight2.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(35, 1, .1, 20));
    directionalLight2.shadow.bias = 0.0001;
    directionalLight2.shadow.mapSize.width = 256.;
    directionalLight2.shadow.mapSize.height = 256.;

    this.scene.add(directionalLight1);
    this.scene.add(directionalLight2);
    this.scene.add(ambientLight);
};


GlitchSkull.prototype.ziggle_skull = function () {
    if (!this.isInit) return;

    const position = this.transform.position.clone();
    const rotation = this.transform.rotation.clone();

    const audioHistory = this.audio_analyzer.get_history();

    // update position values
    position.y = Math.sin(audioHistory * 2.) * .3;

    this.z_target = Math.abs(this.z_target - position.z) < .05 ? Math.random() * 13. - 10. : this.z_target;
    position.z += (this.z_target - position.z) * .035;

    // jaw
    const jawPosition = this.lowerPart.position.clone();
    jawPosition.y -= Math.sin(audioHistory * 5.) * .005;

    // update rotation values
    rotation.y = Math.sin(audioHistory * 1) * .4;
    rotation.x = Math.sin(audioHistory * 3) * .2;

    // update objects
    this.transform.position.copy(position);
    this.lowerPart.position.copy(jawPosition);

    this.transform.rotation.copy(rotation);
};

GlitchSkull.prototype.ziggle_light = function () {
    if (!this.isInit) return;

    const ziggle = Math.sin(this.audio_analyzer.get_history() * 6.);

    this.scene.children[0].position.y = ziggle * 15.;
    this.scene.children[1].position.y = ziggle * -15.;
};

GlitchSkull.prototype.resize = function () {
    for (const shader of this.shdr_batch) {
        shader.uniforms.u_res.value = new THREE.Vector2(this.renderer.w, this.renderer.h);
    }
};
