let Glitch = function (_renderer, _analyzer, _is_retina, _is_mobile) {
    this.is_init = false;

    this.renderer = _renderer;
    this.audio_analyzer = _analyzer;

    this.is_retina = _is_retina;
    this.is_mobile = _is_mobile;

    this.image_fit_horizontal = false;

    this.is_monochrome = false;
    this.is_glitch = false;

    this.matrix = _renderer.matrix;

    this.frame = 1;

    this.init_buffer();
    this.init_shader();
    this.init_texture();
    this.init_scene();

    window.addEventListener('resize', this.resize.bind(this));
};

Glitch.prototype.update = function () {

    const time = this.renderer.get_timer();

    const high = this.audio_analyzer.get_high();
    const mid = this.audio_analyzer.get_mid();
    const bass = this.audio_analyzer.get_bass();
    const level = this.audio_analyzer.get_level();
    const histroy = this.audio_analyzer.get_history();

    for (const shader of this.shdr_batch) {
        shader.uniforms.u_t.value = time;

        shader.uniforms.u_audio_high.value = high;
        shader.uniforms.u_audio_mid.value = mid;
        shader.uniforms.u_audio_bass.value = bass;
        shader.uniforms.u_audio_level.value = level;
        shader.uniforms.u_audio_history.value = histroy;
    }

    const _cam = this.renderer.get_camera();

    this.shdr_pass.uniforms.u_tex_src.value = this.tex_src;
    this.shdr_pass.uniforms.u_tex_blend.value = this.tex_blend;
    this.frame ^= 1;
    this.renderer.renderer.render(this.scene_pass, _cam, this.frame_buffer[this.frame]);

    if (this.is_glitch) {
        this.shdr_glitch.uniforms.u_tex_src.value = this.frame_buffer[this.frame].texture;
        this.frame ^= 1;
        this.renderer.renderer.render(this.scene_glitch, _cam, this.frame_buffer[this.frame]);
    }

    this.shdr_VHS.uniforms.u_tex_src.value = this.frame_buffer[this.frame].texture;
    this.frame ^= 1;
    this.renderer.renderer.render(this.scene_VHS, _cam, this.frame_buffer[this.frame]);

    this.shuffle();

    if (this.is_monochrome) {
        this.shdr_monochrome_intense.uniforms.u_tex_src.value = this.frame_buffer[this.frame].texture;
        this.frame ^= 1;
        this.renderer.renderer.render(this.scene_monochrome_intense, _cam, this.frame_buffer[this.frame]);
    }

    this.shdr_master.uniforms.u_tex_src.value = this.frame_buffer[this.frame].texture;
    this.frame ^= 1;
    this.renderer.renderer.render(this.scene_master, _cam);
};

Glitch.prototype.shuffle = function () {
    const _seed = Math.floor(this.renderer.get_timer() * 1000.) % 40 == (Math.floor(Math.random() * 40.));

    if (_seed) {
        this.is_monochrome = Math.random() > .5 ? true : false;
        this.is_glitch = Math.random() > .5 ? true : false;

        let _tex_index = Math.floor(Math.random() * this.tex_batch.length);
        this.swap_texture(this.tex_batch[_tex_index]);
    }
};

Glitch.prototype.swap_texture = function (_selected) {
    const _tex_res = new THREE.Vector2(
        _selected.image.naturalWidth,
        _selected.image.naturalHeight);

    this.shdr_pass.uniforms.u_src_res.value = _tex_res;
    this.tex_src = _selected;
}

Glitch.prototype.init_scene = function () {
    const geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1);

    this.scene_monochrome_intense = new THREE.Scene();
    this.scene_monochrome_intense.add(new THREE.Mesh(geometry, this.shdr_monochrome_intense));

    this.scene_glitch = new THREE.Scene();
    this.scene_glitch.add(new THREE.Mesh(geometry, this.shdr_glitch));

    this.scene_VHS = new THREE.Scene();
    this.scene_VHS.add(new THREE.Mesh(geometry, this.shdr_VHS));

    this.scene_master = new THREE.Scene();
    this.scene_master.add(new THREE.Mesh(geometry, this.shdr_master));

    this.scene_pass = new THREE.Scene();
    this.scene_pass.add(new THREE.Mesh(geometry, this.shdr_pass));
};

Glitch.prototype.init_buffer = function () {
    const format = {
        wrapS: THREE.ClampToEdgeWrapping,
        wrapT: THREE.ClampToEdgeWrapping,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        type: this.is_mobile ? THREE.HalfFloatTye : THREE.FloatType,
        format: THREE.RGBAFormat,
        stencilBuffer: false,
        depthBuffer: false
    };
    const bufferSize = 860;

    this.frame_buffer = [2];
    for (let i = 0; i < 2; i++) {
        this.frame_buffer[i] = new THREE.WebGLRenderTarget(bufferSize, bufferSize, format);
    }
};

Glitch.prototype.init_texture = function () {
    const onLoadCallback = () => {
        const _tex_res = new THREE.Vector2(
            tex01.image.naturalWidth,
            tex01.image.naturalHeight);

        this.shdr_pass.uniforms.u_src_res.value = _tex_res;
        this.tex_src = tex01;
    }

    const tex01 = new THREE.TextureLoader().load(
        "../common/assets/test_pattern_ntsc.png",
        onLoadCallback,
        undefined,
        function (err) {
            console.error('errr texture not loaded');
        }
    );
    tex01.wrapS = THREE.ClampToEdgeWrapping;
    tex01.wrapT = THREE.ClampToEdgeWrapping;
    tex01.magFilter = THREE.LinearFilter;
    tex01.minFilter = THREE.LinearFilter;

    const tex02 = new THREE.TextureLoader().load(
        "../common/assets/test_pattern_black.jpg",
        undefined,
        undefined,
        function (err) {
            console.error('errr texture not loaded');
        }
    );
    tex02.wrapS = THREE.ClampToEdgeWrapping;
    tex02.wrapT = THREE.ClampToEdgeWrapping;
    tex02.magFilter = THREE.LinearFilter;
    tex02.minFilter = THREE.LinearFilter;

    this.tex_batch = [
        tex01,
        tex02
    ];
};

Glitch.prototype.init_video_texture = function (_video) {
    this.tex_blend = new THREE.VideoTexture(_video);

    this.tex_blend.wrapS = THREE.ClampToEdgeWrapping;
    this.tex_blend.wrapT = THREE.ClampToEdgeWrapping;
    this.tex_blend.minFilter = THREE.LinearFilter;
    this.tex_blend.magFilter = THREE.LinearFilter;
    this.tex_blend.format = THREE.RGBFormat;
};

Glitch.prototype.init_shader = function () {
    const res = 'vec2( ' + this.w().toFixed(1) + ', ' + this.h().toFixed(1) + ')';
    function load(_vert, _frag) {
        return new THREE.ShaderMaterial({
            defines: {
                SCREEN_RES: res
            },
            uniforms: {
                u_t: { value: 0 },
                u_is_init: { value: false },
                u_audio_high: { value: 0. },
                u_audio_mid: { value: 0. },
                u_audio_bass: { value: 0. },
                u_audio_level: { value: 0. },
                u_audio_history: { value: 0. },
                u_tex_src: { value: null }
            },
            depthTest: { value: false },
            vertexShader: _vert,
            fragmentShader: _frag
        });
    };
    this.shdr_VHS = load(shared_vert, VHS_frag);
    this.shdr_monochrome_intense = load(shared_vert, monochrome_intense_frag);
    this.shdr_glitch = load(shared_vert, glitch_frag);
    this.shdr_master = load(shared_vert, master_frag);

    this.shdr_pass = load(ratio_correct_vert, feed_frag);
    this.shdr_pass.uniforms.u_src_res = { value: new THREE.Vector2(1., 1.) };
    this.shdr_pass.uniforms.u_screen_res = { value: new THREE.Vector2(this.w(), this.h()) };
    this.shdr_pass.uniforms.is_fit_horizontal = { value: this.image_fit_horizontal };
    this.shdr_pass.uniforms.u_tex_blend = { value: this.tex_blend };

    this.shdr_batch = [
        this.shdr_monochrome_intense,
        this.shdr_VHS,
        this.shdr_glitch
    ];
};

Glitch.prototype.update_triggers = function () {
    this.shdr_pass.uniforms.is_fit_horizontal.value = this.image_fit_horizontal;
};

Glitch.prototype.resize = function () {
    this.shdr_pass.uniforms.u_screen_res.value = new THREE.Vector2(this.w(), this.h());
};

Glitch.prototype.w = function () {
    return this.renderer.w;
};

Glitch.prototype.h = function () {
    return this.renderer.h;
}



