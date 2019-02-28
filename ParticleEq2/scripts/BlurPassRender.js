class BlurPassRender
{
    constructor(params)
    {
        this.ctx = params.renderer.ctx;

        this.w = this.ctx.drawingBufferWidth;
        this.h = this.ctx.drawingBufferHeight;

        this.particleRenderTexture = params.particleRenderTexture;
        this.webcamTexture = params.webcamTexture;
        this.opticalFlowTexture = params.opticalFlowTexture;

        const vert = GLHelpers.compileShader(this.ctx, SHADER.BLUR_PASS.VERT, gl.VERTEX_SHADER);
        const frag = GLHelpers.compileShader(this.ctx, SHADER.BLUR_PASS.FRAG, gl.FRAGMENT_SHADER);

        this.program = GLHelpers.linkProgram(this.ctx, vert, frag);

        const uParticleRenderTexture = gl.getUniformLocation(this.program, "uParticleRenderTexture");
        const uWebcamTexture = gl.getUniformLocation(this.program, "uWebcamTexture");
        const uOpticalFlowTexture = gl.getUniformLocation(this.program, "uOpticalFlowTexture");
        
        gl.useProgram(this.program);
        
        gl.uniform1i(uParticleRenderTexture, 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.particleRenderTexture);

        gl.uniform1i(uWebcamTexture, 1);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.webcamTexture);

        gl.uniform1i(uOpticalFlowTexture, 2);
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, this.opticalFlowTexture);

        const uWidth = gl.getUniformLocation(this.program, "uWidth");
        const uHeight = gl.getUniformLocation(this.program, "uHeight");

        gl.uniform1f(uWidth, this.w);
        gl.uniform1f(uHeight, this.h);

        this.uTime = gl.getUniformLocation(this.program, "uTime");

        gl.uniform1f(this.uTime, performance.now() * .0001);
    }

    render() 
    {
        const gl = this.ctx;    
        
        gl.viewport(0, 0, this.w, this.h);

        gl.useProgram(this.program);

        gl.uniform1f(this.uTime, performance.now() * .0001);

        UnitQuad.render();
    }
}