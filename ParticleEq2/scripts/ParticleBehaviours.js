class ParticleBehaviours {
    
    constructor(params) {

        this.ctx = params.renderer.ctx;

        this.renderer = params.renderer;
        this.camera = params.camera;

        this.bufferWidth = params.bufferWidth;
        this.bufferHeight = params.bufferHeight;

        this.gridTexSize = params.gridTexSize;
        this.gridWidth = params.gridWidth;
        this.gridHalfWidth = params.gridHalfWidth;
        this.numGridSliceInGridTexWidth = params.numGridSliceInGridTexWidth;
        
        this.posTextures = [2], this.velTextures = [2];

        this.uIsInit, this.uTime, this.uPosBuffer, this.uVelBuffer;

        this.uDebugTex;

        this.bufIndex = 0;

        // behaviour 
        const vs = SHADER.BEHAVIOURS.VERT;
        const fs = SHADER.BEHAVIOURS.FRAG;

        const vert = GLHelpers.compileShader(gl, vs, gl.VERTEX_SHADER);
        const frag = GLHelpers.compileShader(gl, fs, gl.FRAGMENT_SHADER); 

        this.rttProgram = GLHelpers.linkProgram(gl, vert, frag);

        this._init();
    }

    get positionBuffer() {

        return this.posTextures[ this.bufIndex ];
    }

    get velocityBuffer() {

        return this.velTextures[ this.bufIndex ];
    }

    _init() {

        const gl = this.ctx;

        // create fbo
        this.rttFrameBuffer = gl.createFramebuffer();

        // create rtt textures
        for (let i = 0; i < 2; i++) {

            this.posTextures[i] = GLHelpers.createRttTexture(gl, this.bufferWidth, this.bufferHeight);
            this.velTextures[i] = GLHelpers.createRttTexture(gl, this.bufferWidth, this.bufferHeight);

            // init textures
            {
                gl.viewport(0, 0, this.bufferWidth, this.bufferHeight);
                
                gl.bindFramebuffer(gl.FRAMEBUFFER, this.rttFrameBuffer);

                gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.posTextures[i], 0);
                gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, this.velTextures[i], 0);
    
                gl.drawBuffers([
                    gl.COLOR_ATTACHMENT0,
                    gl.COLOR_ATTACHMENT1
                ]);
    
                gl.clearColor(0, 0, 0, 0);
                gl.clear(gl.COLOR_BUFFER_BIT);
    
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            }
        }

        // init rtt shader
        {
            // upload uniform
            gl.useProgram(this.rttProgram);
    
            this.uIsInit = gl.getUniformLocation(this.rttProgram, 'uIsInit');
            gl.uniform1f(this.uIsInit, 0);
    
            this.uTime = gl.getUniformLocation(this.rttProgram, 'uTime');
            gl.uniform1f(this.uTime, performance.now());

            const uNumParticleSqrt = gl.getUniformLocation(this.rttProgram, 'uNumParticleSqrt');
            gl.uniform1f(uNumParticleSqrt, this.bufferWidth);

            const uPosTexWidth = gl.getUniformLocation(this.rttProgram, 'uPosTexWidth');
            gl.uniform1f(uPosTexWidth, this.bufferWidth);

            const uGridTexWidth = gl.getUniformLocation(this.rttProgram, 'uGridTexWidth');
            gl.uniform1f(uGridTexWidth, this.gridTexSize);

            const uNumGridSliceInGridTexWidth = gl.getUniformLocation(this.rttProgram, 'uNumGridSliceInGridTexWidth');
            gl.uniform1f(uNumGridSliceInGridTexWidth, this.numGridSliceInGridTexWidth);

            const uGridSliceWidth = gl.getUniformLocation(this.rttProgram, 'uGridSliceWidth');
            gl.uniform1f(uGridSliceWidth, this.gridWidth);

            const uHalfGridSliceWidth = gl.getUniformLocation(this.rttProgram, 'uHalfGridSliceWidth');
            gl.uniform1f(uHalfGridSliceWidth, this.gridHalfWidth);

            this.uPosBuffer = gl.getUniformLocation(this.rttProgram, "uPosBuffer");
            this.uVelBuffer = gl.getUniformLocation(this.rttProgram, "uVelBuffer");
        }
    }

    linkGridTexture(gridTex) {

        gl.useProgram(this.rttProgram);

        const uGridBuffer = gl.getUniformLocation(this.rttProgram, "uGridBuffer");

        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, gridTex);
        gl.uniform1i(uGridBuffer, 2);
    }

    update() {
        
        const gl = this.ctx;

        gl.viewport(0, 0, this.bufferWidth, this.bufferHeight);

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.rttFrameBuffer);

        // gl.clearColor(0., 0., 0., 1.);
        // gl.clear(gl.COLOR_BUFFER_BIT); 

        gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.posTextures[this.bufIndex ^ 1], 0);
        gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, this.velTextures[this.bufIndex ^ 1], 0);

        gl.drawBuffers([ gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);

        let status = gl.checkFramebufferStatus(gl.DRAW_FRAMEBUFFER);
        if (status != gl.FRAMEBUFFER_COMPLETE) {

            console.log('fb status: ' + status.toString(16));
            return;
        }

        gl.useProgram(this.rttProgram);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.posTextures[this.bufIndex]);
        gl.uniform1i(this.uPosBuffer, 0);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.velTextures[this.bufIndex]);
        gl.uniform1i(this.uVelBuffer, 1);

        gl.uniform1f(this.uTime, performance.now());

        UnitQuad.render();

        const uniform0Val = gl.getUniform(this.rttProgram, this.uIsInit);
        if (uniform0Val === 0) {
            
            gl.uniform1f(this.uIsInit, 1);
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        this.bufIndex ^= 1;
    }

    reset(params) {

        this.bufferWidth = params.bufferWidth;
        this.bufferHeight = params.bufferHeight;

        this._init();
    }

    destroy() {

        const gl = this.ctx;
        
        gl.deleteFramebuffer(this.rttFrameBuffer);
        
        gl.deleteTexture(this.posTextures[0]);
        gl.deleteTexture(this.posTextures[1]);
        gl.deleteTexture(this.velTextures[0]);
        gl.deleteTexture(this.velTextures[1]);
        
        gl.deleteProgram(this.rttProgram);
    }
}