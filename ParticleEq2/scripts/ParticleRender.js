// instancing - https://github.com/SaschaWillems/webgl/blob/master/webgl2_instancing/

class ParticleRender {
    
    constructor(params) {

        this.ctx = params.renderer.ctx;

        this.renderer = params.renderer;
        this.camera = params.camera;

        this.bufferWidth = params.bufferWidth;
        this.bufferHeight = params.bufferHeight;

        this.numInstance = this.bufferWidth * this.bufferHeight;

        this.particleSystem = new ParticleSystem(params);

        this.particleUniformGrid = new ParticleUniformGrid(params);

        this.particleBehaviours = new ParticleBehaviours(params);
        this.particleBehaviours.linkGridTexture(this.particleUniformGrid.uniformGridTexture);

        this.particleDebug = new ParticleDebug(params.renderer.ctx);

        this.thumbnailSize = 50;

        this.updateMatrixUniforms();
    }

    update () {

        this.particleBehaviours.update();

        this.particleUniformGrid.update(
            this.particleBehaviours.positionBuffer,
            this.particleSystem.buffers.instanceIndices,
            this.particleSystem.buffers.instanceTexcoords
            );

        this.updateTextureUniforms( 
            this.particleBehaviours.positionBuffer,
            this.particleBehaviours.velocityBuffer  
        );
    }

    render() {

        const gl = this.ctx;

        gl.enable( gl.DEPTH_TEST );
        gl.depthFunc( gl.LEQUAL );

        gl.viewport( 0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight );

        gl.useProgram( this.particleSystem.program );

        gl.bindVertexArray( this.particleSystem.VAO );
        
        this.updateAttributes();
        
        // gl.drawArraysInstanced(gl.POINTS, 0, this.particleSystem.particle.vertCount, this.numInstance);
        gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, this.particleSystem.particle.vertCount, this.numInstance);

        gl.bindVertexArray( null );

        gl.disable( gl.DEPTH_TEST );
    }

    updateAttributes() {

        gl.bindBuffer( gl.ARRAY_BUFFER, this.particleSystem.buffers.vertices );
        gl.vertexAttribPointer( this.particleSystem.attributes.postion, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray( this.particleSystem.attributes.postion );
        gl.bindBuffer( gl.ARRAY_BUFFER, null );

        gl.bindBuffer( gl.ARRAY_BUFFER, this.particleSystem.buffers.normals );
        gl.vertexAttribPointer( this.particleSystem.attributes.normal, 3, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( this.particleSystem.attributes.normal );
        gl.bindBuffer( gl.ARRAY_BUFFER, null );

        gl.bindBuffer( gl.ARRAY_BUFFER, this.particleSystem.buffers.texcoords );
        gl.vertexAttribPointer( this.particleSystem.attributes.uv, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray( this.particleSystem.attributes.uv );
        gl.bindBuffer( gl.ARRAY_BUFFER, null );

        gl.bindBuffer( gl.ARRAY_BUFFER, this.particleSystem.buffers.instanceIndices );
        gl.vertexAttribPointer( this.particleSystem.attributes.instanceIndices, 1, gl.FLOAT, false, 0, 0);
        gl.vertexAttribDivisor( this.particleSystem.attributes.instanceIndices, 1);
        gl.enableVertexAttribArray( this.particleSystem.attributes.instanceIndices );
        gl.bindBuffer( gl.ARRAY_BUFFER, null );

        gl.bindBuffer( gl.ARRAY_BUFFER, this.particleSystem.buffers.instanceColors );
        gl.vertexAttribPointer( this.particleSystem.attributes.instanceColors, 3, gl.FLOAT, false, 0, 0);
        gl.vertexAttribDivisor( this.particleSystem.attributes.instanceColors, 1);
        gl.enableVertexAttribArray( this.particleSystem.attributes.instanceColors );
        gl.bindBuffer( gl.ARRAY_BUFFER, null );

        gl.bindBuffer( gl.ARRAY_BUFFER, this.particleSystem.buffers.instanceTexcoords );
        gl.vertexAttribPointer( this.particleSystem.attributes.instanceTexcoords, 2, gl.FLOAT, false, 0, 0);
        gl.vertexAttribDivisor( this.particleSystem.attributes.instanceTexcoords, 1);
        gl.enableVertexAttribArray( this.particleSystem.attributes.instanceTexcoords );
        gl.bindBuffer( gl.ARRAY_BUFFER, null );
    }

    updateMatrixUniforms() {

        const gl = this.ctx;

        gl.useProgram( this.particleSystem.program );

        let _tempWorld = new THREE.Matrix4().identity();
        let _tempNormal = new THREE.Matrix3().getNormalMatrix( _tempWorld );

        // *must update threejs camera inverse matrix
        this.camera.matrixWorldInverse.getInverse( this.camera.matrixWorld );
        
        let worldInversMatrix = this.camera.matrixWorldInverse;
        
        let rotInverseMatrix = new THREE.Matrix4().identity();
        rotInverseMatrix.makeRotationFromQuaternion( this.camera.quaternion );
        rotInverseMatrix.getInverse(rotInverseMatrix, true);
        
        let viewMatrix = new THREE.Matrix4().identity();
        viewMatrix.multiplyMatrices(rotInverseMatrix, worldInversMatrix);

        gl.uniformMatrix4fv( this.particleSystem.uniforms.modelMatrix, false, _tempWorld.elements );
        gl.uniformMatrix4fv( this.particleSystem.uniforms.viewMatrix, false, viewMatrix.elements );
        gl.uniformMatrix4fv( this.particleSystem.uniforms.projectionMatrix, false, this.camera.projectionMatrix.elements );
        gl.uniformMatrix3fv( this.particleSystem.uniforms.normalMatrix, false, _tempNormal.elements );
        gl.uniform3f( this.particleSystem.uniforms.cameraPosition, this.camera.position.x, this.camera.position.y, this.camera.position.z );
    }

    updateTextureUniforms( positionTex, velocityTex ) {

        const gl = this.ctx;

        gl.useProgram( this.particleSystem.program ); 

        gl.activeTexture( gl.TEXTURE0 );
        gl.bindTexture( gl.TEXTURE_2D, positionTex );
        gl.uniform1i( this.particleSystem.uniforms.uInstancePosition, 0 );

        gl.activeTexture( gl.TEXTURE1 );
        gl.bindTexture( gl.TEXTURE_2D, velocityTex );
        gl.uniform1i( this.particleSystem.uniforms.uInstanceVelocity, 1 );
        

        // TODO : move this upload to init
        {
            // const uNormalMap = gl.getUniformLocation( this.particleSystem.program, "uNormalMap" );

            // gl.activeTexture(gl.TEXTURE6);
            // gl.bindTexture(gl.TEXTURE_2D, TEXTURE.NORMAL_MAP.TEXTURE);
            // gl.uniform1i(uNormalMap, 6);
        }
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
    }

    reset(params) {

        this.bufferWidth = params.bufferWidth;
        this.bufferHeight = params.bufferHeight;

        this.numInstance = this.bufferWidth * this.bufferHeight;

        this.particleSystem.reset(params);

        this.particleUniformGrid.reset(params);

        this.particleBehaviours.reset(params);
        this.particleBehaviours.linkGridTexture(this.particleUniformGrid.uniformGridTexture);

        this.updateMatrixUniforms();
    }

    destroy() {

        this.particleBehaviours.destroy();
        this.particleUniformGrid.destroy();
        this.particleSystem.destroy();
    }
}