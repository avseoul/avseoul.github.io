class OpticalFlow {

    constructor(params) {

        this.ctx = params.renderer.ctx;

        this.bufferWidth = params.bufferWidth;
        this.bufferHeight = params.bufferHeight;

        this.webcamTexture = params.webcamTexture;
        this.prevWebcamTexture = params.webcamTexture;

        this.frameBuffer;
        this.texture;

        const vs = SHADER.OPTICAL_FLOW.VERT;
        const fs = SHADER.OPTICAL_FLOW.FRAG;

        const vert = GLHelpers.compileShader(gl, vs, gl.VERTEX_SHADER);
        const frag = GLHelpers.compileShader(gl, fs, gl.FRAGMENT_SHADER); 

        this.program = GLHelpers.linkProgram(gl, vert, frag);

        this._init();
    }

    _init() {

        const gl = this.ctx;

        this.frameBuffer = gl.createFramebuffer();
        this.texture = GLHelpers.createRttTexture(gl, this.bufferWidth, this.bufferHeight);

        gl.viewport(0, 0, this.bufferWidth, this.bufferHeight);
                
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);

        gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);

        gl.drawBuffers([gl.COLOR_ATTACHMENT0]);

        gl.clearColor(0, 0, 0, 0);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
}