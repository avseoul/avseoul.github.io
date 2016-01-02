/*
 *  GPU PS Object
 *  author av(Sehyun Kim)
 *
 *  av.seoul@gmail.com
 *  http://kimsehyun.kr
 */

THREE.PS_02 = function(_options){
    var self = this;
    var options = _options || {};

    var pi = 3.14159265;

    self.slice = options.slice || 24;
    self.segment = options.segment || 48;
    self.PARTICLE_COUNT = self.slice * self.segment;
    self.pVertices = new Float32Array(self.PARTICLE_COUNT * 3);
    self.radius = options.radius || 0.8;

    self.buffer = new THREE.BufferGeometry();
    self.ps; //<-'praticlesystem' will be point cloud

    //get shaders
    var PS_02_vert = options.ps02vert;
    var PS_02_frag = options.ps02frag;

    /* extend Object3D */
    THREE.Object3D.apply(this, arguments);

    //set material
    self.mat = new THREE.ShaderMaterial({
        transparent: true,
        uniforms:{
            'uTime': {type: 'f', value: 0.0 },
            'uBase' : {type: 'f', value: 0 }
        },
        blending: 'THREE.AddictiveBlending',
        depthWrite: true,
        vertexShader: PS_02_vert,
        fragmentShader: PS_02_frag
    });

    //-append vertices
    for(var v = 0; v < self.slice-1; v++){
        for(var u = 0; u < self.segment; u++){
            var i = u + v * self.segment;
            var theta = 2 * pi * u/self.segment;
            var phi = pi * v/(self.slice-1) - pi/2;
            var radius = self.radius;

            var px = Math.cos(phi) * Math.cos(theta) * radius;
            var py = Math.cos(phi) * Math.sin(theta) * radius;
            var pz = Math.sin(phi) * radius;

            self.pVertices[i * 3 + 0] = px;
            self.pVertices[i * 3 + 1] = py;
            self.pVertices[i * 3 + 2] = pz;
        }
    }
    
    //-tell shader about default position.. 
    self.buffer.addAttribute('position', new THREE.BufferAttribute(self.pVertices, 3));

    /* init */
    this.init = function(){
        //-particle system with point cloud
        self.ps = new THREE.Points(self.buffer, self.mat);
        this.add(self.ps);
    };

    this.update = function(time, _in_01) {
        self.mat.uniforms['uTime'].value = time;
        self.mat.uniforms['uBase'].value = _in_01;
    };
    
    //excute init()
    this.init();
};

THREE.PS_02.prototype = Object.create(THREE.Object3D.prototype);
THREE.PS_02.prototype.constructor = THREE.PS_02;


