// instancing - https://github.com/SaschaWillems/webgl/blob/master/webgl2_instancing/

class ParticleRender {

    constructor(params) {

        this.ctx = params.renderer.ctx;

        this.renderer = params.renderer;
        this.camera = params.camera;
        this.light = params.light;

        this.bufferWidth = params.bufferWidth;
        this.bufferHeight = params.bufferHeight;

        this.w = this.ctx.drawingBufferWidth;
        this.h = this.ctx.drawingBufferHeight;

        this.numInstance = this.bufferWidth * this.bufferHeight;

        this.audioAnalyzer = params.audioAnalyzer;

        this.particleSystem = new ParticleSystem(params);

        this.particleUniformGrid = new ParticleUniformGrid(params);

        this.particleBehaviours = new ParticleBehaviours(params);

        this.updateMatrixUniforms(this.camera, this.light.camera);

        const gl = this.ctx;
        
        this.renderTexture = gl.createTexture();
        
        gl.bindTexture(gl.TEXTURE_2D, this.renderTexture);
        
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, this.w, this.h, 0, gl.RGBA, gl.FLOAT, null);

        gl.bindTexture(gl.TEXTURE_2D, null);

        this.frameBuffer = gl.createFramebuffer();
        {
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);

            gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.renderTexture, 0);
            gl.drawBuffers([gl.COLOR_ATTACHMENT0]);

            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
        
    }

    update() {

        this.particleBehaviours.update(this.particleUniformGrid.uniformGridTexture);

        this.particleUniformGrid.update(
            this.particleBehaviours.positionBuffer,
            this.particleSystem.buffers.instanceIndices,
            this.particleSystem.buffers.instanceTexcoords
        );
    }

    render() {

        const gl = this.ctx;

        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        gl.useProgram(this.particleSystem.program);

        gl.uniform1i(this.particleSystem.uniforms.uInstancePosition, 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.particleBehaviours.positionBuffer);

        gl.uniform1i(this.particleSystem.uniforms.uInstanceVelocity, 1);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.particleBehaviours.velocityBuffer);

        gl.uniform1i(this.particleSystem.uniforms.uNormalMap, 2);
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, TEXTURE.NORMAL_MAP.TEXTURE);

        gl.uniform1f(this.particleSystem.uniforms.uAudioVolume, this.audioAnalyzer.get_level());
        gl.uniform1f(this.particleSystem.uniforms.uAudioHigh, this.audioAnalyzer.get_high());
        gl.uniform1f(this.particleSystem.uniforms.uAudioMiddle, this.audioAnalyzer.get_mid());
        gl.uniform1f(this.particleSystem.uniforms.uAudioLow, this.audioAnalyzer.get_bass());
        gl.uniform1f(this.particleSystem.uniforms.uAudioHistory, this.audioAnalyzer.get_history());

        gl.bindVertexArray(this.particleSystem.VAO);

        this.updateAttributes();

        this.updateMatrixUniforms(this.camera, this.light.camera);

        // shadow pass
        {
            gl.cullFace(gl.FRONT);

            gl.viewport(0, 0, this.light.shadowMapSize, this.light.shadowMapSize);

            gl.bindFramebuffer(gl.FRAMEBUFFER, this.light.frameBuffer);

            gl.clear(gl.DEPTH_BUFFER_BIT);

            gl.uniform1f(this.particleSystem.uniforms.uIsShadowPass, 1);

            gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, this.particleSystem.particle.vertCount, this.numInstance);

            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }

        // render pass
        gl.cullFace(gl.BACK);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        gl.viewport(0, 0, this.w, this.h);

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.uniform1i(this.particleSystem.uniforms.uShadowMap, 3);
        gl.activeTexture(gl.TEXTURE3);
        gl.bindTexture(gl.TEXTURE_2D, this.light.shadowMap);

        gl.uniform1i(this.particleSystem.uniforms.uCubeMap, 4);
        gl.activeTexture(gl.TEXTURE4);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, TEXTURE.CUBEMAP.TEXTURE);

        gl.uniform1f(this.particleSystem.uniforms.uIsShadowPass, 0);

        gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, this.particleSystem.particle.vertCount, this.numInstance);

        gl.bindVertexArray(null);

        gl.disable(gl.DEPTH_TEST);

        gl.disable(gl.BLEND);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    updateAttributes() {

        gl.bindBuffer(gl.ARRAY_BUFFER, this.particleSystem.buffers.vertices);
        gl.vertexAttribPointer(this.particleSystem.attributes.postion, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.particleSystem.attributes.postion);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.particleSystem.buffers.normals);
        gl.vertexAttribPointer(this.particleSystem.attributes.normal, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.particleSystem.attributes.normal);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.particleSystem.buffers.texcoords);
        gl.vertexAttribPointer(this.particleSystem.attributes.uv, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.particleSystem.attributes.uv);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.particleSystem.buffers.instanceIndices);
        gl.vertexAttribPointer(this.particleSystem.attributes.instanceIndices, 1, gl.FLOAT, false, 0, 0);
        gl.vertexAttribDivisor(this.particleSystem.attributes.instanceIndices, 1);
        gl.enableVertexAttribArray(this.particleSystem.attributes.instanceIndices);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.particleSystem.buffers.instanceColors);
        gl.vertexAttribPointer(this.particleSystem.attributes.instanceColors, 3, gl.FLOAT, false, 0, 0);
        gl.vertexAttribDivisor(this.particleSystem.attributes.instanceColors, 1);
        gl.enableVertexAttribArray(this.particleSystem.attributes.instanceColors);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.particleSystem.buffers.instanceTexcoords);
        gl.vertexAttribPointer(this.particleSystem.attributes.instanceTexcoords, 2, gl.FLOAT, false, 0, 0);
        gl.vertexAttribDivisor(this.particleSystem.attributes.instanceTexcoords, 1);
        gl.enableVertexAttribArray(this.particleSystem.attributes.instanceTexcoords);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    updateMatrixUniforms(camera, lightCamera) {

        const gl = this.ctx;

        let _tempWorld = new THREE.Matrix4().identity();
        let _tempNormal = new THREE.Matrix3().getNormalMatrix(_tempWorld);

        const viewMatrix = GLHelpers.calcViewMatrix(camera);

        // calc shadow matrix
        const lightView = GLHelpers.calcViewMatrix(lightCamera);
        let lightMVP = new THREE.Matrix4().multiplyMatrices(lightCamera.projectionMatrix, lightView);

        gl.useProgram(this.particleSystem.program);

        gl.uniformMatrix4fv(this.particleSystem.uniforms.modelMatrix, false, _tempWorld.elements);
        gl.uniformMatrix4fv(this.particleSystem.uniforms.viewMatrix, false, viewMatrix.elements);
        gl.uniformMatrix4fv(this.particleSystem.uniforms.projectionMatrix, false, camera.projectionMatrix.elements);
        gl.uniformMatrix4fv(this.particleSystem.uniforms.shadowMatrix, false, lightMVP.elements);
        gl.uniformMatrix3fv(this.particleSystem.uniforms.normalMatrix, false, _tempNormal.elements);
        gl.uniform3f(this.particleSystem.uniforms.cameraPosition, camera.position.x, camera.position.y, camera.position.z);
    }

    reset(params) {

        this.bufferWidth = params.bufferWidth;
        this.bufferHeight = params.bufferHeight;

        this.numInstance = this.bufferWidth * this.bufferHeight;

        this.particleSystem.reset(params);

        this.particleUniformGrid.reset(params);

        this.particleBehaviours.reset(params);
        this.particleBehaviours.linkGridTexture(this.particleUniformGrid.uniformGridTexture);

        this.updateMatrixUniforms(this.camera, this.light.camera);
    }

    destroy() {

        this.particleBehaviours.destroy();
        this.particleUniformGrid.destroy();
        this.particleSystem.destroy();
    }
}