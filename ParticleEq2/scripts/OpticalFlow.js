class OpticalFlow {

    constructor(params) {

        this.ctx = params.renderer.ctx;

        this.bufferWidth = params.bufferWidth;
        this.bufferHeight = params.bufferHeight;

        this.camWidth = params.camWidth;
        this.camHeight = params.camHeight;

        this.webcamTexture = params.webcamTexture;
        this.prevWebcamTexture = params.prevWebcamTexture;

        this.opticalFlowFrameBuffer;
        this.renderTexture;

        this.program;      
        
        this.uPrevVideo;
        this.uCurrVideo;
        this.uThreshold;
        this.uBlurRadius;

        this._init();
    }

    _init() {

        const gl = this.ctx;

        {
            const vs = SHADER.OPTICAL_FLOW.VERT;
            const fs = SHADER.OPTICAL_FLOW.FRAG;

            const vert = GLHelpers.compileShader(gl, vs, gl.VERTEX_SHADER);
            const frag = GLHelpers.compileShader(gl, fs, gl.FRAGMENT_SHADER); 

            this.program = GLHelpers.linkProgram(gl, vert, frag);

            gl.useProgram(this.program);

            this.uPrevVideo = gl.getUniformLocation(this.program, "uPrevVideo");
            this.uCurrVideo = gl.getUniformLocation(this.program, "uCurrVideo");
            this.uThreshold = gl.getUniformLocation(this.program, "uThreshold");
            this.uBlurRadius = gl.getUniformLocation(this.program, "uBlurRadius");

            gl.uniform1f(this.uThreshold, .001);
            gl.uniform2f(this.uBlurRadius, 5 / this.camWidth, 5 / this.camHeight);
            
            gl.uniform1i(this.uPrevVideo, 0);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.prevWebcamTexture);

            gl.uniform1i(this.uCurrVideo, 1);
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, this.webcamTexture);
        }

        {
            this.opticalFlowFrameBuffer = gl.createFramebuffer();
            this.renderTexture = GLHelpers.createRttTexture(gl, this.bufferWidth, this.bufferHeight);

            gl.viewport(0, 0, this.bufferWidth, this.bufferHeight);
                    
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.opticalFlowFrameBuffer);

            gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.renderTexture, 0);

            gl.drawBuffers([gl.COLOR_ATTACHMENT0]);

            gl.clearColor(0, 0, 0, 0);

            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
    }

    update() {

        const gl = this.ctx;    
        
        gl.viewport(0, 0, this.bufferWidth, this.bufferHeight);

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.opticalFlowFrameBuffer);

        gl.useProgram(this.program);

        gl.uniform1i(this.uPrevVideo, 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.prevWebcamTexture);

        gl.uniform1i(this.uCurrVideo, 1);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.webcamTexture);

        UnitQuad.render();

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
}