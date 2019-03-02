class GaussianBlurPassRender 
{
    constructor(params)
    {
        this.ctx = params.renderer.ctx;
        
        this.w = this.ctx.drawingBufferWidth;
        this.h = this.ctx.drawingBufferHeight;

        this.particleRenderTexture = params.particleRenderTexture;

        this.firstPassTexture = gl.createTexture();
        {
            gl.bindTexture(gl.TEXTURE_2D, this.firstPassTexture);
            
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, this.w, this.h, 0, gl.RGBA, gl.FLOAT, null);

            gl.bindTexture(gl.TEXTURE_2D, null);
        }

        this.renderTexture = gl.createTexture();
        {
            gl.bindTexture(gl.TEXTURE_2D, this.renderTexture);
            
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, this.w, this.h, 0, gl.RGBA, gl.FLOAT, null);

            gl.bindTexture(gl.TEXTURE_2D, null);
        }

        this.frameBuffer = gl.createFramebuffer();

        const vert = GLHelpers.compileShader(this.ctx, SHADER.BLUR_PASS.VERT, gl.VERTEX_SHADER);
        const frag = GLHelpers.compileShader(this.ctx, SHADER.BLUR_PASS.FRAG, gl.FRAGMENT_SHADER);

        this.program = GLHelpers.linkProgram(this.ctx, vert, frag);
        {
            this.uSrcTexture = gl.getUniformLocation(this.program, "uSrcTexture");
            this.uDir = gl.getUniformLocation(this.program, "uDir");
            
            gl.useProgram(this.program);
            
            gl.uniform1i(this.uSrcTex, 0);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.particleRenderTexture);

            const uWidth = gl.getUniformLocation(this.program, "uWidth");
            const uHeight = gl.getUniformLocation(this.program, "uHeight");

            gl.uniform1f(uWidth, this.w);
            gl.uniform1f(uHeight, this.h);
        }
    }

    render() 
    {
        const gl = this.ctx;    
        
        gl.viewport(0, 0, this.w, this.h);

        gl.useProgram(this.program);

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
        // vertical pass 
        {
            gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.firstPassTexture, 0);
            gl.drawBuffers([gl.COLOR_ATTACHMENT0]);

            gl.uniform1i(this.uSrcTexture, 0);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.particleRenderTexture);

            gl.uniform2f(this.uDir, 0, 1);

            UnitQuad.render();
        }

        // horizontal pass
        {
            gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.renderTexture, 0);
            gl.drawBuffers([gl.COLOR_ATTACHMENT0]);

            gl.uniform1i(this.uSrcTexture, 0);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.firstPassTexture);

            gl.uniform2f(this.uDir, 1, 0);

            UnitQuad.render();
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
}