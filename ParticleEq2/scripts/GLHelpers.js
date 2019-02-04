// multiple render texture targets - https://github.com/WebGLSamples/WebGL2Samples/blob/master/samples/fbo_rtt_draw_buffers.html
// init shader - https://webglfundamentals.org/webgl/lessons/webgl-shaders-and-glsl.html

class GLHelpers {

    static createRttTexture(gl, w, h) {

        'use strict';
        
        let texture = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, texture);
        
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, w, h, 0, gl.RGBA, gl.FLOAT, null);
        
        gl.bindTexture(gl.TEXTURE_2D, null);

        return texture;
    }

    static loadShader(url) {

        'use strict';
            
        return new Promise( (resolve, reject) => {

            let req = new XMLHttpRequest();

            req.open("GET", url, true);
            
            req.onload = resolve;
            req.onerror = reject;
            
            req.send(null);
        } );
    }

    static compileShader(gl, shaderSource, shaderType) {

        'use strict';

        let shader = gl.createShader(shaderType);
        
        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {

            console.error(shaderSource);
            console.error('shader compiler error:\n' + gl.getShaderInfoLog(shader));

            return;
        }

        return shader;
    }

    static linkProgram(gl, vs, fs) {

        'use strict';

        let prog = gl.createProgram();
        
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        
        gl.linkProgram(prog);
        
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {

            console.error('shader linker error:\n' + gl.getProgramInfoLog(prog));

            return;
        }

        return prog;
    }

    static createProgram(gl, vert, frag) {

        'use strict';
        
        let prog = gl.createProgram();
        let log;

        let _vert = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(_vert, vert);
        gl.compileShader(_vert);
        gl.attachShader(prog, _vert);
        gl.deleteShader(_vert);

        log = gl.getShaderInfoLog(_vert);
        if (log) console.log('vert', log);

        let _frag = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(_frag, frag);
        gl.compileShader(_frag);
        gl.attachShader(prog, _frag);
        gl.deleteShader(_frag);

        log = gl.getShaderInfoLog(_frag);
        if (log) console.log('frag', log);

        gl.linkProgram(prog);

        log = gl.getProgramInfoLog(prog);
        if ( log ) console.log('prog', log);

        return prog;
    }

    static createArrayBuffer(gl, data) {

        'use strict';

        let buffer = gl.createBuffer();

        gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
        gl.bufferData( gl.ARRAY_BUFFER, data, gl.STATIC_DRAW );
        
        return buffer;
    }

    static loadTexture(url) {

        'use strict';
            
        return new Promise( (resolve, reject) => {

            var image = new Image();
            image.src = url;
            
            image.onload = resolve;
            image.onerror = reject;
        } );
    }   

    static createImageTexture(gl, image) {

        let texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);

        return texture;
    }
}