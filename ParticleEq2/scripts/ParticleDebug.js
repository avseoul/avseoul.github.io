class ParticleDebug {

    constructor(ctx) {

        this.ctx = ctx;

        const vert = GLHelpers.compileShader(gl, SHADER.DEBUG_TEXTURE.VERT, gl.VERTEX_SHADER);
        const frag = GLHelpers.compileShader(gl, SHADER.DEBUG_TEXTURE.FRAG, gl.FRAGMENT_SHADER); 

        this.debugProgram = GLHelpers.linkProgram(gl, vert, frag);

        this.ctx.useProgram(this.debugProgram);
        this.uDebugTex = gl.getUniformLocation(this.debugProgram, "uTex");
    }

    debugTexture(tex, x, y, w, h) {

        const gl = this.ctx;

        gl.viewport(x, y, w, h);

        gl.useProgram(this.debugProgram);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.uniform1i(this.uDebugTex, 0);

        UnitQuad.render();
    }

    destroy() {

        const gl = this.ctx;
        
        gl.deleteProgram(this.debugProgram);
    }
}