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

        this.uIsInit, this.uTime, this.uPosBuffer, this.uVelBuffer, 
        this.uGlobalGravity, this.uLocalGravity, this.uOrbitAcc, this.uRandomAcc, 
        this.uRandomScalePop, this.uKeepInSphere, this.uSphereRadius, this.uScaleDamping, 
        this.uTimeDelta, this.uMaxVel;

        this.uDebugTex;

        this.bufIndex = 0;

        // behaviour 
        const vs = SHADER.BEHAVIOURS.VERT;
        const fs = SHADER.BEHAVIOURS.FRAG;

        const vert = GLHelpers.compileShader(gl, vs, gl.VERTEX_SHADER);
        const frag = GLHelpers.compileShader(gl, fs, gl.FRAGMENT_SHADER); 

        this.rttProgram = GLHelpers.linkProgram(gl, vert, frag);

        this.globalGravity = ctrlParams.GlobalGravity;
        this.localGravity = ctrlParams.LocalGravity;
        this.orbitAcc = ctrlParams.OrbitAcc;
        this.randomAcc = ctrlParams.RandomAcc;
        this.randomScalePop = ctrlParams.RandomScalePop;
        this.keepInSphere = ctrlParams.KeepInSphere ? 1 : 0;
        this.sphereRadius = ctrlParams.SphereRadius;
        this.scaleDamping = ctrlParams.ScaleDamping;
        this.timeDelta = ctrlParams.TimeDelta;
        this.maxVel = ctrlParams.MaxVel;

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
            this.uGridBuffer = gl.getUniformLocation(this.rttProgram, "uGridBuffer");

            this.uGlobalGravity = gl.getUniformLocation(this.rttProgram, "uGlobalGravity");
            this.uLocalGravity = gl.getUniformLocation(this.rttProgram, "uLocalGravity");
            this.uOrbitAcc = gl.getUniformLocation(this.rttProgram, "uOrbitAcc");
            this.uRandomAcc = gl.getUniformLocation(this.rttProgram, "uRandomAcc");
            this.uRandomScalePop = gl.getUniformLocation(this.rttProgram, "uRandomScalePop");
            this.uKeepInSphere = gl.getUniformLocation(this.rttProgram, "uKeepInSphere");
            this.uSphereRadius = gl.getUniformLocation(this.rttProgram, "uSphereRadius");            
            this.uScaleDamping = gl.getUniformLocation(this.rttProgram, "uScaleDamping");
            this.uTimeDelta = gl.getUniformLocation(this.rttProgram, "uTimeDelta");
            this.uMaxVel = gl.getUniformLocation(this.rttProgram, "uMaxVel");
        }

        this.updateCtrlParams();
    }

    update(gridTex) {
        
        const gl = this.ctx;

        gl.viewport(0, 0, this.bufferWidth, this.bufferHeight);

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.rttFrameBuffer);

        // gl.clearColor(0., 0., 0., 1.);
        // gl.clear(gl.COLOR_BUFFER_BIT); 

        gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.posTextures[this.bufIndex ^ 1], 0);
        gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, this.velTextures[this.bufIndex ^ 1], 0);

        gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);

        let status = gl.checkFramebufferStatus(gl.DRAW_FRAMEBUFFER);
        if (status != gl.FRAMEBUFFER_COMPLETE) {

            console.log('fb status: ' + status.toString(16));
            return;
        }

        gl.useProgram(this.rttProgram);

        gl.uniform1i(this.uGridBuffer, 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, gridTex);

        gl.uniform1i(this.uPosBuffer, 1);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.posTextures[this.bufIndex]);

        gl.uniform1i(this.uVelBuffer, 2);
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, this.velTextures[this.bufIndex]);

        gl.uniform1f(this.uTime, performance.now());

        UnitQuad.render();

        const uniform0Val = gl.getUniform(this.rttProgram, this.uIsInit);
        if (uniform0Val === 0) {
            
            gl.uniform1f(this.uIsInit, 1);
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        this.bufIndex ^= 1;
    }

    updateCtrlParams() {

        gl.useProgram(this.rttProgram);

        gl.uniform1f(this.uGlobalGravity, this.globalGravity);
        gl.uniform1f(this.uLocalGravity, this.localGravity);
        gl.uniform1f(this.uOrbitAcc, this.orbitAcc);
        gl.uniform1f(this.uRandomAcc, this.randomAcc);
        gl.uniform1f(this.uRandomScalePop, this.randomScalePop);
        gl.uniform1f(this.uKeepInSphere, this.keepInSphere);
        gl.uniform1f(this.uSphereRadius, this.sphereRadius);
        gl.uniform1f(this.uScaleDamping, this.scaleDamping);
        gl.uniform1f(this.uTimeDelta, this.timeDelta);
        gl.uniform1f(this.uMaxVel, this.maxVel);
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