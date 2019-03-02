class ParticleSystem {

    constructor(params) {

        this.ctx = params.renderer.ctx;

        this.renderer = params.renderer;
        this.camera = params.camera;

        this.bufferWidth = params.bufferWidth;
        this.bufferHeight = params.bufferHeight;

        this.numParticles = this.bufferWidth * this.bufferHeight;

        this.particle = {}

        this._buildUnitSphere(params.parameters.SphereResolution);
        //this._buildQuad();

        this.buffers = {}

        this._initBuffers();

        this.program;
        this.attributes = {};
        this.uniforms = {};

        this._initProgram();

        this.VAO = this.ctx.createVertexArray();

        this.particleScaleFactor = params.parameters.ParticleScaleFactor;
        this.ambient = params.parameters.Ambient;
        this.diffuse = params.parameters.Diffuse;
        this.fill = params.parameters.Fill;
        this.back = params.parameters.Back;
        this.fresnel = params.parameters.Fresnel;
        this.gamma = params.parameters.Gamma;
        this.isBW = params.parameters.isBW ? 1 : 0;

        this.updateCtrlParams();
    }

    _buildQuad() {

        this.particle.vertices = [];
        this.particle.normals = [];
        this.particle.texcoords = [];
        this.particle.vertCount = 0;

        let vi = 0, ni = 0, ui = 0;

        {
            this.particle.vertices[vi++] = 0;
            this.particle.vertices[vi++] = 1;
            this.particle.vertices[vi++] = 0;

            this.particle.normals[ni++] = 0;
            this.particle.normals[ni++] = 0;
            this.particle.normals[ni++] = 1;

            this.particle.texcoords[ui++] = 0;
            this.particle.texcoords[ui++] = 1;

            this.particle.vertCount++;
        }

        {
            this.particle.vertices[vi++] = 0;
            this.particle.vertices[vi++] = 0;
            this.particle.vertices[vi++] = 0;

            this.particle.normals[ni++] = 0;
            this.particle.normals[ni++] = 0;
            this.particle.normals[ni++] = 1;

            this.particle.texcoords[ui++] = 0;
            this.particle.texcoords[ui++] = 0;

            this.particle.vertCount++;
        }

        {
            this.particle.vertices[vi++] = 1;
            this.particle.vertices[vi++] = 1;
            this.particle.vertices[vi++] = 0;

            this.particle.normals[ni++] = 0;
            this.particle.normals[ni++] = 0;
            this.particle.normals[ni++] = 1;

            this.particle.texcoords[ui++] = 1;
            this.particle.texcoords[ui++] = 1;

            this.particle.vertCount++;
        }

        {
            this.particle.vertices[vi++] = 1;
            this.particle.vertices[vi++] = 0;
            this.particle.vertices[vi++] = 0;

            this.particle.normals[ni++] = 0;
            this.particle.normals[ni++] = 0;
            this.particle.normals[ni++] = 1;

            this.particle.texcoords[ui++] = 1;
            this.particle.texcoords[ui++] = 0;

            this.particle.vertCount++;
        }
    }

    _buildUnitSphere(detail) {

        const TWOPI = 6.28318530717958;
        const PIDIV2 = 1.57079632679489;

        const DETAIL = detail;

        this.particle.vertices = [];
        this.particle.normals = [];
        this.particle.texcoords = [];
        this.particle.vertCount = 0;

        let vi = 0, ni = 0, ti = 0;
        for (let i = 0; i < DETAIL / 2; ++i) {

            let theta1 = i * TWOPI / DETAIL - PIDIV2;
            let theta2 = (i + 1) * TWOPI / DETAIL - PIDIV2;

            for (let j = 0; j <= DETAIL; ++j) {

                let theta3 = j * TWOPI / DETAIL;

                let x = Math.cos(theta2) * Math.cos(theta3);
                let y = Math.sin(theta2);
                let z = Math.cos(theta2) * Math.sin(theta3);

                let u = j / DETAIL;
                let v = 2 * (i + 1) / DETAIL;

                this.particle.vertices[vi++] = x;
                this.particle.vertices[vi++] = y;
                this.particle.vertices[vi++] = z;

                this.particle.normals[ni++] = x;
                this.particle.normals[ni++] = y;
                this.particle.normals[ni++] = z;

                this.particle.texcoords[ti++] = u;
                this.particle.texcoords[ti++] = v;

                this.particle.vertCount++;

                x = Math.cos(theta1) * Math.cos(theta3);
                y = Math.sin(theta1);
                z = Math.cos(theta1) * Math.sin(theta3);

                u = j / DETAIL;
                v = 2 * (i) / DETAIL;

                this.particle.vertices[vi++] = x;
                this.particle.vertices[vi++] = y;
                this.particle.vertices[vi++] = z;

                this.particle.normals[ni++] = x;
                this.particle.normals[ni++] = y;
                this.particle.normals[ni++] = z;

                this.particle.texcoords[ti++] = u;
                this.particle.texcoords[ti++] = v;

                this.particle.vertCount++;
            }
        }
    }

    _initBuffers() {

        const gl = this.ctx;

        // TODO : investigate UV 
        // console.log(this.particle.texcoords);

        this.buffers.vertices = GLHelpers.createArrayBuffer(gl, new Float32Array(this.particle.vertices));
        this.buffers.texcoords = GLHelpers.createArrayBuffer(gl, new Float32Array(this.particle.texcoords));
        this.buffers.normals = GLHelpers.createArrayBuffer(gl, new Float32Array(this.particle.normals));

        // instancing         
        let instanceIndices = [this.numParticle];
        let instanceTexcoords = [this.numParticle * 2];
        let instanceColors = [this.numParticle * 3];

        let ii = 0, ti = 0, ci = 0;
        for (let i = 0; i < this.numParticles; i++) {

            instanceIndices[ii] = ii;

            const v = Math.floor(instanceIndices[ii] / this.bufferWidth);
            const u = instanceIndices[ii] - this.bufferWidth * v;

            ii++;

            instanceTexcoords[ti++] = u / (this.bufferWidth - 1);
            instanceTexcoords[ti++] = v / (this.bufferWidth - 1);

            //const dice = i % 16;
            instanceColors[ci++] = 0;//dice == 0 ? .1 : 1;
            instanceColors[ci++] = 0;//dice == 0 ? .1 : 1;
            instanceColors[ci++] = 0;//dice == 0 ? .1 : 1;
        }

        this.buffers.instanceIndices = GLHelpers.createArrayBuffer(gl, new Float32Array(instanceIndices))
        this.buffers.instanceTexcoords = GLHelpers.createArrayBuffer(gl, new Float32Array(instanceTexcoords));
        this.buffers.instanceColors = GLHelpers.createArrayBuffer(gl, new Float32Array(instanceColors));
    }

    _initProgram() {

        const gl = this.ctx;

        const vert = GLHelpers.compileShader(gl, SHADER.RENDER.VERT, gl.VERTEX_SHADER);
        const frag = GLHelpers.compileShader(gl, SHADER.RENDER.FRAG, gl.FRAGMENT_SHADER);

        this.program = GLHelpers.linkProgram(gl, vert, frag);

        this.attributes = {

            position: gl.getAttribLocation(this.program, "position"),
            normal: gl.getAttribLocation(this.program, "normal"),
            uv: gl.getAttribLocation(this.program, "uv"),
            instanceIndices: gl.getAttribLocation(this.program, "instanceIndices"),
            instanceColors: gl.getAttribLocation(this.program, "instanceColors"),
            instanceTexcoords: gl.getAttribLocation(this.program, "instanceTexcoords")
        }

        this.uniforms = {

            modelMatrix: gl.getUniformLocation(this.program, "modelMatrix"),
            viewMatrix: gl.getUniformLocation(this.program, "viewMatrix"),
            projectionMatrix: gl.getUniformLocation(this.program, "projectionMatrix"),
            normalMatrix: gl.getUniformLocation(this.program, "normalMatrix"),
            shadowMatrix: gl.getUniformLocation(this.program, "shadowMatrix"),
            cameraPosition: gl.getUniformLocation(this.program, "uWorldcCamPos"),
            uInstancePosition: gl.getUniformLocation(this.program, "uInstancePositions"),
            uInstanceVelocity: gl.getUniformLocation(this.program, "uInstanceVelocities"),
            uWebcamTexture: gl.getUniformLocation(this.program, "uWebcamTexture"),
            uOpticalFlowTexture: gl.getUniformLocation(this.program, "uOpticalFlowTexture"),
            uNormalMap: gl.getUniformLocation(this.program, "uNormalMap"),
            uShadowMap: gl.getUniformLocation(this.program, "uShadowMap"),
            uCubeMap: gl.getUniformLocation(this.program, "uCubeMap"),
            uParticleScaleFactor: gl.getUniformLocation(this.program, "uParticleScaleFactor"),
            uAmbient: gl.getUniformLocation(this.program, "uAmbient"),
            uDiffuse: gl.getUniformLocation(this.program, "uDiffuse"),
            uFill: gl.getUniformLocation(this.program, "uFill"),
            uBack: gl.getUniformLocation(this.program, "uBack"),
            uFresnel: gl.getUniformLocation(this.program, "uFresnel"),
            uGamma: gl.getUniformLocation(this.program, "uGamma"),
            uisBW: gl.getUniformLocation(this.program, "uisBW"),
            uIsShadowPass: gl.getUniformLocation(this.program, "uIsShadowPass"),
            uAudioVolume: gl.getUniformLocation(this.program, "uAudioVolume"),
            uAudioHigh: gl.getUniformLocation(this.program, "uAudioHigh"),
            uAudioMiddle: gl.getUniformLocation(this.program, "uAudioMiddle"),
            uAudioLow: gl.getUniformLocation(this.program, "uAudioLow"),
            uAudioHistory: gl.getUniformLocation(this.program, "uAudioHistory")
        }

        // link normal map 
        gl.useProgram(this.program);

        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, TEXTURE.NORMAL_MAP.TEXTURE);
        gl.uniform1i(this.uniforms.uNormalMap, 2);

        // link cubemap
        gl.activeTexture(gl.TEXTURE4);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, TEXTURE.CUBEMAP.TEXTURE);
        gl.uniform1i(this.uniforms.uCubeMap, 4);

        gl.uniform1f(this.uniforms.uParticleScaleFactor, 1.);
        gl.uniform1f(this.uniforms.uAmbient, .3);
        gl.uniform1f(this.uniforms.uDiffuse, .5);
        gl.uniform1f(this.uniforms.uFill, .1);
        gl.uniform1f(this.uniforms.uBack, .1);
        gl.uniform1f(this.uniforms.uFresnel, .5);
        gl.uniform1f(this.uniforms.uGamma, .45);
        gl.uniform1f(this.uniforms.uisBW, 0);
    }

    updateCtrlParams() {

        gl.useProgram(this.program);

        gl.uniform1f(this.uniforms.uParticleScaleFactor, this.particleScaleFactor);
        gl.uniform1f(this.uniforms.uAmbient, this.ambient);
        gl.uniform1f(this.uniforms.uDiffuse, this.diffuse);
        gl.uniform1f(this.uniforms.uFill, this.fill);
        gl.uniform1f(this.uniforms.uBack, this.back);
        gl.uniform1f(this.uniforms.uFresnel, this.fresnel);
        gl.uniform1f(this.uniforms.uGamma, this.gamma);
        gl.uniform1f(this.uniforms.uisBW, this.isBW);
    }

    reset(params) {

        this.bufferWidth = params.bufferWidth;
        this.bufferHeight = params.bufferHeight;

        this.numParticles = this.bufferWidth * this.bufferHeight;

        this._initBuffers();
        this._initProgram();
        this.updateCtrlParams();
    }

    destroy() {

        const gl = this.ctx;

        gl.deleteBuffer(this.buffers.vertices);
        gl.deleteBuffer(this.buffers.texcoords);
        gl.deleteBuffer(this.buffers.normals);
        gl.deleteBuffer(this.buffers.instanceIndices);
        gl.deleteBuffer(this.buffers.instanceTexcoords);
        gl.deleteBuffer(this.buffers.instanceColors);

        gl.deleteVertexArray(this.VAO);

        gl.deleteProgram(this.program);
    }
}