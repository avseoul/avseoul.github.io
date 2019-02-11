class MainLight {

    constructor(params) {

        this.ctx = params.renderer.ctx;

        this.shadowMapSize = params.shadowMapSize;

        this.light = new THREE.PerspectiveCamera(45,  1, params.near, params.far);

        // setup shadow map 
        {
            this.shadowMap = this.ctx.createTexture();

            gl.bindTexture(gl.TEXTURE_2D, this.shadowMap);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

            gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT16, this.shadowMapSize, this.shadowMapSize, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, null);

            gl.bindTexture(gl.TEXTURE_2D, null);
        }

        // setup frame buffer
        {
            this.frameBuffer = this.ctx.createFramebuffer();

            gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);

            gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.shadowMap, 0);

            gl.drawBuffers([gl.NONE]);

            gl.clear(gl.DEPTH_BUFFER_BIT);

            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
    }

    get camera() {

        return this.light;
    }

    get position() {

        return this.light.position;
    }

    get up() {

        return this.light.up;
    }

    lookAt(target) {

        this.light.lookAt(target);
    }
}