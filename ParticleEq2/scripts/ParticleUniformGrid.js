class ParticleUniformGrid {

    constructor(params) {

        this.ctx = params.renderer.ctx;

        this.renderer = params.renderer;
        this.camera = params.camera;

        this.bufferWidth = params.bufferWidth;
        this.bufferHeight = params.bufferHeight;

        this.numParticles = this.bufferWidth * this.bufferHeight;

        this.gridTexSize = params.gridTexSize;
        this.gridWidth = params.gridWidth;
        this.gridHalfWidth = params.gridHalfWidth;
        this.numGridSliceInGridTexWidth = params.numGridSliceInGridTexWidth;

        this.rttFrameBuffer;

        const vert = GLHelpers.compileShader(gl, SHADER.UNIFORM_GRID.VERT, gl.VERTEX_SHADER);
        const frag = GLHelpers.compileShader(gl, SHADER.UNIFORM_GRID.FRAG, gl.FRAGMENT_SHADER); 
        
        this.program = GLHelpers.linkProgram(gl, vert, frag);

        this.uniformGridTexture;

        this.uPosTex;
        this.aId;
        this.aTexCoords;

        this._init();        
    }

    get gridTexture() {

        return this.uniformGridTexture;
    }

    _init() {
        const gl = this.ctx;

        // create fbo
        this.rttFrameBuffer = gl.createFramebuffer();

        // create grid texture 
        this.uniformGridTexture = GLHelpers.createRttTexture(gl, this.gridTexSize, this.gridTexSize);

        // bind depth, stencil buffer
        {
            const depth_stencil = gl.createRenderbuffer();

            gl.bindRenderbuffer(gl.RENDERBUFFER, depth_stencil);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, this.gridTexSize, this.gridTexSize);
            
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.rttFrameBuffer);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, depth_stencil);

            gl.bindRenderbuffer(gl.RENDERBUFFER, null);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }

        // init textures
        {
            gl.viewport(0, 0, this.gridTexSize, this.gridTexSize);
            
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.rttFrameBuffer);

            gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.uniformGridTexture, 0);

            gl.drawBuffers([
                gl.COLOR_ATTACHMENT0
            ]);

            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }

        // init rtt shader
        {
            gl.useProgram(this.program);

            this.aId = gl.getAttribLocation(this.program, "aId");
            this.aTexCoords = gl.getAttribLocation(this.program, "aTexCoords");
    
            this.uPosTex = gl.getUniformLocation(this.program, "uPosTex");

            const uPosTexWidth = gl.getUniformLocation(this.program, 'uPosTexWidth');
            gl.uniform1f(uPosTexWidth, this.bufferWidth);

            const uGridTexWidth = gl.getUniformLocation(this.program, 'uGridTexWidth');
            gl.uniform1f(uGridTexWidth, this.gridTexSize);

            const uNumGridSliceInGridTexWidth = gl.getUniformLocation(this.program, 'uNumGridSliceInGridTexWidth');
            gl.uniform1f(uNumGridSliceInGridTexWidth, this.numGridSliceInGridTexWidth);

            const uGridSliceWidth = gl.getUniformLocation(this.program, 'uGridSliceWidth');
            gl.uniform1f(uGridSliceWidth, this.gridWidth);

            const uHalfGridSliceWidth = gl.getUniformLocation(this.program, 'uHalfGridSliceWidth');
            gl.uniform1f(uHalfGridSliceWidth, this.gridHalfWidth);

            // console.log(
            //     gl.getUniform(this.program, uPosTexWidth),
            //     gl.getUniform(this.program, uGridTexWidth),
            //     gl.getUniform(this.program, uNumGridSliceInGridTexWidth),
            //     gl.getUniform(this.program, uHalfGridSliceWidth));
        }
    }

    update(posTex, indicesBuffer, texCoordsBuffer) {

        const gl = this.ctx;

        gl.enable(gl.DEPTH_TEST);
        gl.disable(gl.BLEND);

        gl.viewport(0, 0, this.gridTexSize, this.gridTexSize);

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.rttFrameBuffer);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.clearColor(0, 0, 0, 0);

        gl.useProgram(this.program);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, posTex);
        gl.uniform1i(this.uPosTex, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, indicesBuffer);
        gl.enableVertexAttribArray(this.aId);
        gl.vertexAttribPointer(this.aId, 1, gl.FLOAT, gl.FALSE, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordsBuffer);
        gl.enableVertexAttribArray(this.aTexCoords);
        gl.vertexAttribPointer(this.aTexCoords, 2, gl.FLOAT, gl.FALSE, 0, 0);

        gl.colorMask(true, false, false, false);
        gl.depthFunc(gl.LESS);
        gl.drawArrays(gl.POINTS, 0, this.numParticles);

        gl.enable(gl.STENCIL_TEST); 
        {
            gl.depthFunc(gl.GREATER);
            gl.stencilFunc(gl.EQUAL, 0, 0xFF); 
            // gl.stencilFunc(gl.GREATER, 0, 0xFF); 
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);

            gl.colorMask(false, true, false, false);
            gl.clear(gl.STENCIL_BUFFER_BIT);
            gl.drawArrays(gl.POINTS, 0, this.numParticles);

            gl.colorMask(false, false, true, false);
            gl.clear(gl.STENCIL_BUFFER_BIT);
            gl.drawArrays(gl.POINTS, 0, this.numParticles);
            
            gl.colorMask(false, false, false, true);
            gl.clear(gl.STENCIL_BUFFER_BIT);
            gl.drawArrays(gl.POINTS, 0, this.numParticles);
        }
        gl.disable(gl.STENCIL_TEST);
        
        // reset
        gl.depthFunc(gl.LESS);
        gl.colorMask(true, true, true, true);

        gl.disable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);

        gl.clearColor(0, 0, 0, 1);
        
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);    
    }

    destroy() {

        const gl = this.ctx;
        
        gl.deleteFramebuffer(this.rttFrameBuffer);
        
        gl.deleteTexture(this.uniformGridTexture);
        
        gl.deleteProgram(this.program);
    }
}