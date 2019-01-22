class ParticleSystem {
    
    constructor(params) {

        this.ctx = params.renderer.ctx;

        this.renderer = params.renderer;
        this.camera = params.camera;

        this.bufferWidth = params.bufferWidth;
        this.bufferHeight = params.bufferHeight;

        this.particle = {}

        this._buildUnitSphere(24);
        // this._buildQuad();

        this.buffers = {}

        this._initBuffers();

        this.program;
        this.attributes = {};
        this.uniforms = {};

        this._initProgram();

        this.VAO = this.ctx.createVertexArray();
    }

    _buildQuad() {

        this.particle.vertices = [];
        this.particle.normals = [];
        this.particle.texcoords = [];
        this.particle.vertCount = 0;

        let vi = 0, ni = 0, ti = 0;

        {
            this.particle.vertices[vi++] = 0;
            this.particle.vertices[vi++] = 1;
            this.particle.vertices[vi++] = 0;

            this.particle.normals[ni++] = 0;
            this.particle.normals[ni++] = 0;
            this.particle.normals[ni++] = 1;

            this.particle.texcoords[ti++] = 0;
            this.particle.texcoords[ti++] = 1;

            this.particle.vertCount++;
        }

        {
            this.particle.vertices[vi++] = 0;
            this.particle.vertices[vi++] = 0;
            this.particle.vertices[vi++] = 0;

            this.particle.normals[ni++] = 0;
            this.particle.normals[ni++] = 0;
            this.particle.normals[ni++] = 1;

            this.particle.texcoords[ti++] = 0;
            this.particle.texcoords[ti++] = 0;

            this.particle.vertCount++;
        }

        {
            this.particle.vertices[vi++] = 1;
            this.particle.vertices[vi++] = 1;
            this.particle.vertices[vi++] = 0;

            this.particle.normals[ni++] = 0;
            this.particle.normals[ni++] = 0;
            this.particle.normals[ni++] = 1;

            this.particle.texcoords[ti++] = 1;
            this.particle.texcoords[ti++] = 1;

            this.particle.vertCount++;
        }

        {
            this.particle.vertices[vi++] = 1;
            this.particle.vertices[vi++] = 0;
            this.particle.vertices[vi++] = 0;

            this.particle.normals[ni++] = 0;
            this.particle.normals[ni++] = 0;
            this.particle.normals[ni++] = 1;

            this.particle.texcoords[ti++] = 1;
            this.particle.texcoords[ti++] = 0;

            this.particle.vertCount++;
        }
    }

    _buildUnitSphere(detail) {

        const TWOPI = 6.28318530717958;
        const PIDIV2 = 1.57079632679489;

        const DETAIL = detail;

        this.particle.vertices = [];
        this.particle.normals = [];
        this.particle.texcoords = [];
        this.particle.vertCount = 0;

        let vi = 0, ni = 0, ti = 0;
        for( let i = 0; i < DETAIL/2; ++i ) {

            let theta1 = i * TWOPI / DETAIL - PIDIV2;
            let theta2 = (i + 1) * TWOPI / DETAIL - PIDIV2;

            for(let j = 0; j <= DETAIL; ++j ) {

                let theta3 = j * TWOPI / DETAIL;

                let x = Math.cos(theta2) * Math.cos(theta3);
                let y = Math.sin(theta2);
                let z = Math.cos(theta2) * Math.sin(theta3);
                
                let u  = -j / DETAIL;
                let v  = -2 * ( i + 1 ) / DETAIL;

                this.particle.vertices[vi++] = x;
                this.particle.vertices[vi++] = y;
                this.particle.vertices[vi++] = z;

                this.particle.normals[ni++] = x;
                this.particle.normals[ni++] = y;
                this.particle.normals[ni++] = z;

                this.particle.texcoords[ti++] = u;
                this.particle.texcoords[ti++] = v;

                this.particle.vertCount++;

                x = Math.cos(theta1) * Math.cos(theta3);
                y = Math.sin(theta1);
                z = Math.cos(theta1) * Math.sin(theta3);
                
                u  = -j / DETAIL;
                v  = -2 * i / DETAIL;

                this.particle.vertices[vi++] = x;
                this.particle.vertices[vi++] = y;
                this.particle.vertices[vi++] = z;

                this.particle.normals[ni++] = x;
                this.particle.normals[ni++] = y;
                this.particle.normals[ni++] = z;

                this.particle.texcoords[ti++] = u;
                this.particle.texcoords[ti++] = v;

                this.particle.vertCount++;
            }
        }
    }

    _initBuffers() {

        let gl = this.ctx;

        this.buffers.vertices = GLHelpers.createArrayBuffer( gl, new Float32Array( this.particle.vertices ) );
        this.buffers.texcoords = GLHelpers.createArrayBuffer( gl, new Float32Array( this.particle.texcoords ) );
        this.buffers.normals = GLHelpers.createArrayBuffer( gl, new Float32Array( this.particle.normals ) );

        // instancing 
        let bufSize = this.bufferWidth * this.bufferHeight;
        
        let instanceIndices = [bufSize];
        let instanceTexcoords = [bufSize * 2];
        let instanceColors = [bufSize * 3];

        let ii = 0, ti = 0, ci = 0;
        for (let x = 0; x < this.bufferWidth; x++) {
            
            for (let y = 0; y < this.bufferHeight; y++) {

                instanceIndices[ii] = ii++;
            
                instanceTexcoords[ti++] = x / (this.bufferWidth - 1);
                instanceTexcoords[ti++] = y / (this.bufferHeight - 1);

                instanceColors[ci++] = Math.random();
                instanceColors[ci++] = Math.random();
                instanceColors[ci++] = Math.random();
            }
        }

        this.buffers.instanceIndices = GLHelpers.createArrayBuffer( gl, new Float32Array( instanceIndices ) )
        this.buffers.instanceTexcoords = GLHelpers.createArrayBuffer( gl, new Float32Array( instanceTexcoords ) );
        this.buffers.instanceColors = GLHelpers.createArrayBuffer( gl, new Float32Array( instanceColors ) );
    }

    _initProgram() {

        let gl = this.ctx;

        let vert = GLHelpers.compileShader(gl, SHADER.RENDER.VERT, gl.VERTEX_SHADER);
        let frag = GLHelpers.compileShader(gl, SHADER.RENDER.FRAG, gl.FRAGMENT_SHADER); 

        this.program = GLHelpers.linkProgram(gl, vert, frag);

        this.attributes = {

            position: gl.getAttribLocation( this.program, "position"),
            normal: gl.getAttribLocation( this.program, "normal"),
            uv: gl.getAttribLocation( this.program, "uv"),
            instanceColors: gl.getAttribLocation( this.program, "instanceColors"),
            instanceTexcoords: gl.getAttribLocation( this.program, "instanceTexcoords")
        }

        this.uniforms = {

            modelMatrix: gl.getUniformLocation( this.program, "modelMatrix" ),
            viewMatrix: gl.getUniformLocation( this.program, "viewMatrix" ),
            projectionMatrix: gl.getUniformLocation( this.program, "projectionMatrix" ),
            normalMatrix: gl.getUniformLocation( this.program, "normalMatrix" ),
            cameraPosition: gl.getUniformLocation( this.program, "uWorldcCamPos" ),
            uInstancePosition: gl.getUniformLocation( this.program, "uInstancePositions" ),
            uInstanceVelocity: gl.getUniformLocation( this.program, "uInstanceVelocities" )
        }
    }

    destroy() {

        let gl = this.ctx;

        gl.deleteBuffer(this.buffers.vertices);
        gl.deleteBuffer(this.buffers.texcoords);
        gl.deleteBuffer(this.buffers.normals);
        gl.deleteBuffer(this.buffers.instanceIndices);
        gl.deleteBuffer(this.buffers.instanceTexcoords);
        gl.deleteBuffer(this.buffers.instanceColors);

        gl.deleteVertexArray(this.VAO);
        
        gl.deleteProgram(this.program);
    }
}