var gl, prog;
var pi = 3.14159265359; 

function draw() {
    gl = document.getElementById('canvas1').getContext('experimental-webgl');
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    prog = gl.createProgram();

    function addShader(type, str) {
        var s = gl.createShader(type);
        gl.shaderSource(s, str);
        gl.compileShader(s);
        gl.attachShader(prog, s);
    };

    addShader(gl.VERTEX_SHADER, [
            ,'attribute vec3 aPos;'
            ,'uniform mat4 uMatrix;'
            ,'varying vec3 uPos;'
            ,'void main() {'
                ,'   uPos = aPos;'
                    ,'   gl_Position = uMatrix * vec4(aPos, 1.);'
                    ,'}',
    ].join('\n'));

    addShader(gl.FRAGMENT_SHADER, [
            ,'precision highp float;'
            ,'varying vec3 uPos;'
            ,'void main() {'
                ,'gl_FragColor = vec4(vec3(1.0, 0.0, 0.0) * abs(uPos.z) * 1.0, 1.0);'
                    ,'}',
    ].join('\n'));

    var vertices = [];
    var slice = 24;
    var segment = 48;
    var radius = 0.6;
    var innerRadius = 0.3;

    //-> start cap
    for(var u = 0; u < segment; u++){
    var theta; 
    var px, py, pz;

    pz = radius;

    //first point strip
    theta = 2 * pi * u/segment;

    px = Math.cos(theta) * radius;
    py = Math.sin(theta) * radius;

    vertices.push(px);
    vertices.push(py);
    vertices.push(pz);

    //second point strip
    theta = 2 * pi * u/segment;

    px = Math.cos(theta) * innerRadius;
    py = Math.sin(theta) * innerRadius;

    vertices.push(px);
    vertices.push(py);
    vertices.push(pz);

    //third point strip
    theta = 2 * pi * (u+1)/segment;

    px = Math.cos(theta) * radius;
    py = Math.sin(theta) * radius;

    vertices.push(px);
    vertices.push(py);
    vertices.push(pz);

    //forth point strip
    theta = 2 * pi * u/segment;

    px = Math.cos(theta) * innerRadius;
    py = Math.sin(theta) * innerRadius;

    vertices.push(px);
    vertices.push(py);
    vertices.push(pz); 

    //fifth point strip 
    theta = 2 * pi * (u+1)/segment;

    px = Math.cos(theta) * innerRadius;
    py = Math.sin(theta) * innerRadius;

    vertices.push(px);
    vertices.push(py);
    vertices.push(pz);                               
    }
   
    //-> outter cylinder
    for(var v = 0; v < slice; v++){
        for(var u = 0; u < segment; u++){
            var theta; 
            var px, py, pz;
            var r = radius;

            if(v == 0){
                theta = 2 * pi * u/segment;

                px = Math.cos(theta) * r;
                py = Math.sin(theta) * r;
                pz = radius;

                vertices.push(px);
                vertices.push(py);
                vertices.push(pz);

                theta = 2 * pi * (u+1)/segment;

                px = Math.cos(theta) * r;
                py = Math.sin(theta) * r;
                pz = radius;

                vertices.push(px);
                vertices.push(py);
                vertices.push(pz);
            }

            //first point strip
            theta = 2 * pi * u/segment;

            px = Math.cos(theta) * r;
            py = Math.sin(theta) * r;
            pz = (1 - 2 * v/slice) * radius;

            vertices.push(px);
            vertices.push(py);
            vertices.push(pz);

            //second point strip
            theta = 2 * pi * u/segment;

            px = Math.cos(theta) * r;
            py = Math.sin(theta) * r;
            pz = (1 - 2 * (v+1)/slice) * radius;

            vertices.push(px);
            vertices.push(py);
            vertices.push(pz);

            //third point strip
            theta = 2 * pi * (u+1)/segment;

            px = Math.cos(theta) * r;
            py = Math.sin(theta) * r;
            pz = (1 - 2 * v/slice) * radius;

            vertices.push(px);
            vertices.push(py);
            vertices.push(pz);

            //forth point strip
            theta = 2 * pi * u/segment;

            px = Math.cos(theta) * r;
            py = Math.sin(theta) * r;
            pz = (1 - 2 * (v+1)/slice) * radius;

            vertices.push(px);
            vertices.push(py);
            vertices.push(pz);

            //fifth point strip
            theta = 2 * pi * (u+1)/segment;

            px = Math.cos(theta) * r;
            py = Math.sin(theta) * r;
            pz = (1 - 2 * (v+1)/slice) * radius;

            vertices.push(px);
            vertices.push(py);
            vertices.push(pz);

        }
    }
    
    //-> end cap
    for(var u = 0; u < segment; u++){
    var theta; 
    var px, py, pz;

    pz = -1 * radius;

    //first point strip
    theta = 2 * pi * u/segment;

    px = Math.cos(theta) * radius;
    py = Math.sin(theta) * radius;

    vertices.push(px);
    vertices.push(py);
    vertices.push(pz);

    //second point strip
    theta = 2 * pi * u/segment;

    px = Math.cos(theta) * innerRadius;
    py = Math.sin(theta) * innerRadius;

    vertices.push(px);
    vertices.push(py);
    vertices.push(pz);

    //third point strip
    theta = 2 * pi * (u+1)/segment;

    px = Math.cos(theta) * radius;
    py = Math.sin(theta) * radius;

    vertices.push(px);
    vertices.push(py);
    vertices.push(pz);

    //forth point strip
    theta = 2 * pi * u/segment;

    px = Math.cos(theta) * innerRadius;
    py = Math.sin(theta) * innerRadius;

    vertices.push(px);
    vertices.push(py);
    vertices.push(pz); 

    //fifth point strip 
    theta = 2 * pi * (u+1)/segment;

    px = Math.cos(theta) * innerRadius;
    py = Math.sin(theta) * innerRadius;

    vertices.push(px);
    vertices.push(py);
    vertices.push(pz);                               
    }
    //-> inner cylinder
    for(var v = 0; v < slice; v++){
        for(var u = 0; u < segment; u++){
            var theta; 
            var px, py, pz;
            var r = innerRadius;

            if(v == 0){
                theta = 2 * pi * u/segment;

                px = Math.cos(theta) * r;
                py = Math.sin(theta) * r;
                pz = radius;

                vertices.push(px);
                vertices.push(py);
                vertices.push(pz);

                theta = 2 * pi * (u+1)/segment;

                px = Math.cos(theta) * r;
                py = Math.sin(theta) * r;
                pz = radius;

                vertices.push(px);
                vertices.push(py);
                vertices.push(pz);
            }

            //first point strip
            theta = 2 * pi * u/segment;

            px = Math.cos(theta) * r;
            py = Math.sin(theta) * r;
            pz = (1 - 2 * v/slice) * radius;

            vertices.push(px);
            vertices.push(py);
            vertices.push(pz);

            //second point strip
            theta = 2 * pi * u/segment;

            px = Math.cos(theta) * r;
            py = Math.sin(theta) * r;
            pz = (1 - 2 * (v+1)/slice) * radius;

            vertices.push(px);
            vertices.push(py);
            vertices.push(pz);

            //third point strip
            theta = 2 * pi * (u+1)/segment;

            px = Math.cos(theta) * r;
            py = Math.sin(theta) * r;
            pz = (1 - 2 * v/slice) * radius;

            vertices.push(px);
            vertices.push(py);
            vertices.push(pz);

            //forth point strip
            theta = 2 * pi * u/segment;

            px = Math.cos(theta) * r;
            py = Math.sin(theta) * r;
            pz = (1 - 2 * (v+1)/slice) * radius;

            vertices.push(px);
            vertices.push(py);
            vertices.push(pz);

            //fifth point strip
            theta = 2 * pi * (u+1)/segment;

            px = Math.cos(theta) * r;
            py = Math.sin(theta) * r;
            pz = (1 - 2 * (v+1)/slice) * radius;

            vertices.push(px);
            vertices.push(py);
            vertices.push(pz);
        }
    }


    function address(name) { 
        return gl.getUniformLocation(prog, name); 
    };

    gl.linkProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var attr = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(attr);
    gl.vertexAttribPointer(attr, 3, gl.FLOAT, false, 0, 0);
    /*->
    //-> for normal 
    var posAttr = gl.getAttribLocation(prog, 'aPos');
    var normalAttr = gl.getAttribLocation(prog, 'aNormal');
    gl.enableVertexAttribArray(posAttr);
    gl.enableVertexAttribArray(normalAttr);
    var bpe = Float32Array.BYTES_PER_ELEMENT;
    gl.vertexAttribPointer(posAttr , 3, gl.FLOAT, false, 6 * bpe, 0);
    gl.vertexAttribPointer(normalAttr, 3, gl.FLOAT, false, 6 * bpe, 3 * bpe);
    <-*/

    gl.useProgram(prog);

    setInterval(tick, 1000 / 60);

    function tick() {
        var turn = (new Date()).getTime() / 1500.;
        var cos = Math.cos(turn);
        var sin = Math.sin(turn);
        var adjust = gl.canvas.height / gl.canvas.width;

        var matrix = [ adjust*cos,  0,      sin, .1*sin,
        0,           1,        0,      0,
        -adjust*sin,  0,      cos, .1*cos,
        0,           0,        0,      1
        ];

        gl.uniformMatrix4fv(address('uMatrix'), false, matrix);
        //gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length / 3);
        gl.drawArrays(gl.LINE_STRIP, 0, vertices.length / 3);
    };            
            };
    setTimeout(draw, 100);
