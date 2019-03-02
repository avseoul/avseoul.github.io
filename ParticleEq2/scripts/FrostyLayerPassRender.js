class FrostyLayerPassRender
{
    constructor(params)
    {
        this.ctx = params.renderer.ctx;
        
        this.w = this.ctx.drawingBufferWidth;
        this.h = this.ctx.drawingBufferHeight;

        this.blurTexture = params.blurTexture;
        this.particleRenderTexture = params.particleRenderTexture;

        this.audioAnalyzer = params.audioAnalyzer;

        const vert = GLHelpers.compileShader(this.ctx, SHADER.FROSTY_PASS.VERT, gl.VERTEX_SHADER);
        const frag = GLHelpers.compileShader(this.ctx, SHADER.FROSTY_PASS.FRAG, gl.FRAGMENT_SHADER);

        this.program = GLHelpers.linkProgram(this.ctx, vert, frag);

        this.uBlurTexture = gl.getUniformLocation(this.program, "uBlurTexture");
        this.uParticleRenderTexture = gl.getUniformLocation(this.program, "uParticleRenderTexture");
        
        gl.useProgram(this.program);

        gl.uniform1i(this.uBlurTexture, 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.blurTexture);
        
        gl.uniform1i(this.uParticleRenderTexture, 1);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.particleRenderTexture);

        const uWidth = gl.getUniformLocation(this.program, "uWidth");
        const uHeight = gl.getUniformLocation(this.program, "uHeight");

        gl.uniform1f(uWidth, this.w);
        gl.uniform1f(uHeight, this.h);

        this.uAudioVolume = gl.getUniformLocation(this.program, "uAudioVolume");
        this.uAudioHigh = gl.getUniformLocation(this.program, "uAudioHigh");
        this.uAudioMiddle = gl.getUniformLocation(this.program, "uAudioMiddle");
        this.uAudioLow = gl.getUniformLocation(this.program, "uAudioLow");
        this.uAudioHistory = gl.getUniformLocation(this.program, "uAudioHistory");

        this.uTime = gl.getUniformLocation(this.program, "uTime");

        gl.uniform1f(this.uTime, performance.now() * .0001);
    }

    render() 
    {
        const gl = this.ctx;    
        
        gl.viewport(0, 0, this.w, this.h);

        gl.useProgram(this.program);

        gl.uniform1i(this.uBlurTexture, 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.blurTexture);
        
        gl.uniform1i(this.uParticleRenderTexture, 1);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.particleRenderTexture);

        gl.uniform1f(this.uAudioVolume, this.audioAnalyzer.get_level());
        gl.uniform1f(this.uAudioHigh, this.audioAnalyzer.get_high());
        gl.uniform1f(this.uAudioMiddle, this.audioAnalyzer.get_mid());
        gl.uniform1f(this.uAudioLow, this.audioAnalyzer.get_bass());
        gl.uniform1f(this.uAudioHistory, this.audioAnalyzer.get_history());

        gl.uniform1f(this.uTime, performance.now() * .0001);

        UnitQuad.render();
    }
}