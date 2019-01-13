class ParticleBehaviours {
    
    constructor(params) {

        this.ctx = params.renderer.ctx;

        this.renderer = params.renderer;
        this.camera = params.camera;

        this.bufferWidth = params.bufferWidth;
        this.bufferHeight = params.bufferHeight;

        this.rttFrameBuffer;
        
        this.posTextures = [2], this.velTextures = [2];

        this.uIsInit, this.uTime, this.uPosBuffer, this.uVelBuffer;

        this.debugProgram;

        this.uDebugTex;

        this.bufIndex = 0;

        this.isInit = false;

        Promise.all([ 
            GLHelpers.loadShader( "shaders/behaviours.vert.glsl" ), 
            GLHelpers.loadShader( "shaders/behaviours.frag.glsl" ),
            GLHelpers.loadShader( "shaders/debugTexture.vert.glsl" ),
            GLHelpers.loadShader( "shaders/debugTexture.frag.glsl" ) ]).then( (res) => { 

            // behaviour 
            let vs = res[0].target.response;
            let fs = res[1].target.response;

            let fragSplit = fs.split('#version 300 es');
            let fragJoin = fragSplit.join(
                "#version 300 es\n\n#define BUFFER_X " + this.bufferWidth + 
                "\n#define BUFFER_Y " + this.bufferHeight);

            let vert = GLHelpers.compileShader(gl, vs, gl.VERTEX_SHADER);
            let frag = GLHelpers.compileShader(gl, fragJoin, gl.FRAGMENT_SHADER); 

            this.rttProgram = GLHelpers.linkProgram(gl, vert, frag);

            // debug
            vs = res[2].target.response;
            fs = res[3].target.response;

            vert = GLHelpers.compileShader(gl, vs, gl.VERTEX_SHADER);
            frag = GLHelpers.compileShader(gl, fs, gl.FRAGMENT_SHADER); 

            this.debugProgram = GLHelpers.linkProgram(gl, vert, frag);

            this._init();
        });
    }

    get positionBuffer() {

        return this.posTextures[ this.bufIndex ];
    }

    get velocityBuffer() {

        return this.velTextures[ this.bufIndex ];
    }

    _init() {

        let gl = this.ctx;

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
    
                gl.clearColor(0., 0., 0., 0.);
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
    
            this.uPosBuffer = gl.getUniformLocation(this.rttProgram, "uPosBuffer");
            this.uVelBuffer = gl.getUniformLocation(this.rttProgram, "uVelBuffer");
        }

        // init debug shader
        {
            // upload uniform
            gl.useProgram(this.debugProgram);

            this.uDebugTex = gl.getUniformLocation(this.debugProgram, "uTex");
        }

        this.isInit = true;
    }

    update() {
        
        if(!this.isInit) return;

        let gl = this.ctx;

        gl.viewport(0, 0, this.bufferWidth, this.bufferHeight);

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.rttFrameBuffer);

        // gl.clearColor(0., 0., 0., 1.);
        // gl.clear(gl.COLOR_BUFFER_BIT); 

        gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.posTextures[this.bufIndex], 0);
        gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, this.velTextures[this.bufIndex], 0);

        gl.drawBuffers([ gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1 ]);

        let status = gl.checkFramebufferStatus(gl.DRAW_FRAMEBUFFER);
        if (status != gl.FRAMEBUFFER_COMPLETE) {

            console.log('fb status: ' + status.toString(16));
            return;
        }

        gl.useProgram(this.rttProgram);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.posTextures[this.bufIndex ^ 1]);
        gl.uniform1i(this.uPosBuffer, 0);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.velTextures[this.bufIndex ^ 1]);
        gl.uniform1i(this.uVelBuffer, 1);

        gl.uniform1f(this.uTime, performance.now());

        UnitQuad.render();

        let uniform0Val = gl.getUniform(this.rttProgram, this.uIsInit);
        if (uniform0Val === 0) {
            
            gl.uniform1f(this.uIsInit, 1);
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        this.bufIndex ^= 1;
    }

    debug() {

        if(!this.isInit) return;

        const THUMBNAIL_SIZE = 100;

        this._debugTexture(this.posTextures[0], 0, 0, THUMBNAIL_SIZE, THUMBNAIL_SIZE);
        this._debugTexture(this.velTextures[0], THUMBNAIL_SIZE, 0, THUMBNAIL_SIZE, THUMBNAIL_SIZE);
    }

    _debugTexture(tex, x, y, w, h) {
        
        let gl = this.ctx;

        gl.viewport(x, y, w, h);

        gl.useProgram(this.debugProgram);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.uniform1i(this.uDebugTex, 0);

        UnitQuad.render();
    }

    destroy() {

        let gl = this.ctx;
        
        gl.deleteFramebuffer(this.rttFrameBuffer);
        
        gl.deleteTexture(this.posTextures[0]);
        gl.deleteTexture(this.posTextures[1]);
        gl.deleteTexture(this.velTextures[0]);
        gl.deleteTexture(this.velTextures[1]);
        
        gl.deleteProgram(this.rttProgram);
    }
}