// instancing - https://github.com/SaschaWillems/webgl/blob/master/webgl2_instancing/

class ParticleRender {

    constructor(params) {

        this.ctx = params.renderer.ctx;

        this.renderer = params.renderer;
        this.camera = params.camera;
        this.light = params.light;

        this.bufferWidth = params.bufferWidth;
        this.bufferHeight = params.bufferHeight;

        this.numInstance = this.bufferWidth * this.bufferHeight;

        this.particleSystem = new ParticleSystem(params);

        this.particleUniformGrid = new ParticleUniformGrid(params);

        this.particleBehaviours = new ParticleBehaviours(params);
        this.particleBehaviours.linkGridTexture(this.particleUniformGrid.uniformGridTexture);

        this.particleDebug = new ParticleDebug(params.renderer.ctx);

        this.thumbnailSize = 100;

        this.updateMatrixUniforms(this.camera, this.light.camera);
    }

    update() {

        this.particleBehaviours.update();

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

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.particleBehaviours.positionBuffer);
        gl.uniform1i(this.particleSystem.uniforms.uInstancePosition, 0);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.particleBehaviours.velocityBuffer);
        gl.uniform1i(this.particleSystem.uniforms.uInstanceVelocity, 1);

        gl.uniform1i(this.particleSystem.uniforms.uNormalMap, 2);

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

        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

        gl.activeTexture(gl.TEXTURE3);
        gl.bindTexture(gl.TEXTURE_2D, this.light.shadowMap);
        gl.uniform1i(this.particleSystem.uniforms.uShadowMap, 3);

        gl.uniform1i(this.particleSystem.uniforms.uCubeMap, 4);

        gl.uniform1f(this.particleSystem.uniforms.uIsShadowPass, 0);

        gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, this.particleSystem.particle.vertCount, this.numInstance);

        gl.bindVertexArray(null);

        gl.disable(gl.DEPTH_TEST);

        gl.disable(gl.BLEND)
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

    debug() {

        this.particleDebug.debugTexture(
            this.particleBehaviours.positionBuffer, 0, 0, this.thumbnailSize, this.thumbnailSize);
        this.particleDebug.debugTexture(
            this.particleBehaviours.velocityBuffer, this.thumbnailSize, 0, this.thumbnailSize, this.thumbnailSize);

        this.particleDebug.debugTexture(
            this.particleUniformGrid.gridTexture, this.thumbnailSize * 2, 0, this.thumbnailSize, this.thumbnailSize);

        this.particleDebug.debugTexture(
            TEXTURE.NORMAL_MAP.TEXTURE, this.thumbnailSize * 3, 0, this.thumbnailSize, this.thumbnailSize);

        this.particleDebug.debugTexture(
            this.light.shadowMap, this.thumbnailSize * 4, 0, this.thumbnailSize, this.thumbnailSize);
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