let UnitQuad = (function() {
    
    let _render = null;

    let vertices = new Float32Array([
            
        -1.0, -1.0,
        1.0, -1.0,
        1.0,  1.0,
        1.0,  1.0,
        -1.0,  1.0,
        -1.0, -1.0
    ]);

    let texcoords = new Float32Array([
        
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0
    ]);

    let vertBuffer;
    let texcoordBuffer;
    
    let vertArray;
    
    let init = function() {

        vertArray = gl.createVertexArray();

        vertBuffer = gl.createBuffer();
        
        gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
        texcoordBuffer = gl.createBuffer();
    
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, texcoords, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        console.log('UnitQuad is init');

        return () => {

            gl.bindVertexArray(vertArray);

            const VERT_ATTRIB_LOC = 0;
            const TEX_COORD_ATTRIB_LOC = 1;

            gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
            gl.vertexAttribPointer(VERT_ATTRIB_LOC, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(VERT_ATTRIB_LOC);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
            gl.vertexAttribPointer(TEX_COORD_ATTRIB_LOC, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(TEX_COORD_ATTRIB_LOC);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            
            gl.bindVertexArray(null);
        };
    };
    
    return {
        
        render : () => {
            
            if (_render === null) {

                _render = init();
            }

            return _render();
        }
    };
})();