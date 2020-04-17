let FuzzyBlob = function (renderer, analyzer, mouse, isRetina, isMobile) {
    this.isInit = false;
    this.renderer = renderer;
    this.audioAnalyzer = analyzer;
    this.mouse = mouse;
    this.isRetina = isRetina;
    this.isMobile = isMobile;
    this.shaderBatch;
    this.frame = 1;
    
    this.init();

    window.addEventListener('resize', this.resize.bind(this));
};

FuzzyBlob.prototype.update = function () {
    if(!this.isInit) return;

    const time = this.renderer.get_timer();

    const audioHigh = this.audioAnalyzer.get_high();
    const audioMid = this.audioAnalyzer.get_mid();
    const audioBass = this.audioAnalyzer.get_bass();
    const audioLevel = this.audioAnalyzer.get_level();
    const audioHistory = this.audioAnalyzer.get_history();

    const mousePosition = new THREE.Vector2(this.mouse.get_norm_x(), this.mouse.get_norm_y());
    const mouseDirection = new THREE.Vector2(this.mouse.get_dir_x(), this.mouse.get_dir_y());
    
    for(const shader of this.shaderBatch) {
        shader.uniforms.u_t.value = time;

        shader.uniforms.u_audio_high.value = audioHigh;
        shader.uniforms.u_audio_mid.value = audioMid;
        shader.uniforms.u_audio_bass.value = audioBass;
        shader.uniforms.u_audio_level.value = audioLevel;
        shader.uniforms.u_audio_history.value = audioHistory;

        shader.uniforms.u_mouse.value = mousePosition;
        shader.uniforms.u_mouse_dir.value = mouseDirection;
    }

    const camera = this.renderer.get_camera();

    this.shdr_input.uniforms.u_tex_src.value = this.fbo_input[this.frame ^ 1].texture;
    this.renderer.renderer.render(this.scene_input, camera, this.fbo_input[this.frame]);

    this.shdr_chan_rgb.uniforms.u_tex_input.value = this.fbo_input[this.frame].texture;
    this.shdr_chan_rgb.uniforms.u_tex_src.value = this.fbo_chan_rgb[this.frame ^ 1].texture;
    this.renderer.renderer.render(this.scene_chan_rgb, camera, this.fbo_chan_rgb[this.frame]);

    this.shdr_chan_mixer.uniforms.u_tex_src.value = this.fbo_chan_rgb[this.frame].texture;
    this.renderer.renderer.render(this.scene_chan_mixer, camera, this.fbo_chan_mixer);

    this.shdr_master.uniforms.u_tex_src.value = this.fbo_chan_mixer.texture;
    this.renderer.renderer.render(this.scene_master, camera);

    this.frame ^= 1;
};

FuzzyBlob.prototype.init = function () {
    const w = this.renderer.w / 2.;
    const h = this.renderer.h / 2.;

    // Load shaders 
    const loadShader = (vert, frag) => {
        return new THREE.ShaderMaterial({
            uniforms: {
                u_t: { value: 0 },
                u_res: { value: new THREE.Vector2(w, h) },
                u_audio_high: { value: 0. },
                u_audio_mid: { value: 0. },
                u_audio_bass: { value: 0. },
                u_audio_level: { value: 0. },
                u_audio_history: { value: 0. },
                u_mouse: { value: new THREE.Vector2(.5, .5) },
                u_mouse_dir: { value: new THREE.Vector2(0., 0.) }
            },
            depthTest: { value: false },
            vertexShader: vert,
            fragmentShader: frag
        });
    };
    this.shdr_input = loadShader(shared_vert, input_frag);
    this.shdr_chan_rgb = loadShader(shared_vert, shaping_frag);
    this.shdr_chan_mixer = loadShader(shared_vert, chan_mixer_frag);
    this.shdr_master = loadShader(shared_vert, master_frag);

    this.shaderBatch = [
        this.shdr_input,
        this.shdr_chan_rgb,
        this.shdr_chan_mixer,
        this.shdr_master
    ];

    // init uniforms 
    this.shdr_input.uniforms.u_tex_src = { value: null };
    this.shdr_chan_rgb.uniforms.u_tex_src = { value: null };
    this.shdr_chan_rgb.uniforms.u_tex_input = { value: null };
    this.shdr_chan_mixer.uniforms.u_tex_src = { value: null };
    this.shdr_master.uniforms.u_tex_src = { value: null };

    // Load noise texture
    const texNoise = new THREE.TextureLoader().load(
        "../common/assets/noise.jpg",
        function () {
            this.shdr_input.uniforms.u_tex_noise = { value: texNoise };
        }.bind(this),
        undefined,
        function (err) {
            console.error('errr texture not loaded');
        }
    );
    texNoise.wrapS = THREE.ClampToEdgeWrapping;
    texNoise.wrapT = THREE.ClampToEdgeWrapping;
    texNoise.magFilter = THREE.LinearFilter;
    texNoise.minFilter = THREE.LinearFilter;

    // Init buffers
    const format = {
        wrapS: THREE.ClampToEdgeWrapping,
        wrapT: THREE.ClampToEdgeWrapping,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        type: this.isMobile ? THREE.HalfFloatTye : THREE.FloatType,
        format: THREE.RGBAFormat,
        stencilBuffer: false,
        depthBuffer: false
    };

    this.fbo_input = [2];
    this.fbo_chan_rgb = [2];

    const bufferSize = 256;
    for (let i = 0; i < 2; i++) {
        this.fbo_input[i] = new THREE.WebGLRenderTarget(bufferSize, bufferSize, format);
        this.fbo_chan_rgb[i] = new THREE.WebGLRenderTarget(bufferSize, bufferSize, format);
    }
    this.fbo_chan_mixer = new THREE.WebGLRenderTarget(bufferSize, bufferSize, format);

    // Init scenes
    const geom = new THREE.PlaneBufferGeometry(1, 1, 1, 1,);

    this.scene_input = new THREE.Scene();
    this.scene_input.add(new THREE.Mesh(geom, this.shdr_input));

    this.scene_chan_rgb = new THREE.Scene();
    this.scene_chan_rgb.add(new THREE.Mesh(geom, this.shdr_chan_rgb));

    this.scene_chan_mixer = new THREE.Scene();
    this.scene_chan_mixer.add(new THREE.Mesh(geom, this.shdr_chan_mixer));

    this.scene_master = new THREE.Scene();
    this.scene_master.add(new THREE.Mesh(geom, this.shdr_master));

    // Ready to go
    this.isInit = true;
};

FuzzyBlob.prototype.resize = function () {
    for(const shader of this.shaderBatch) {
        shader.uniforms.u_res.value = new THREE.Vector2(this.renderer.w / 2., this.renderer.h / 2.);
    }
};



