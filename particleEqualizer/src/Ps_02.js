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
    /* set material */
    self.mat = new THREE.ShaderMaterial({
        uniforms:{
            'uTime': {type: 'f', value: 0.0 },
            'uBase': {type: 'f', value: 0 },
            'uTex': {type: 't', value: THREE.TextureLoader('img/p01.png')}
        },
        vertexShader: PS_02_vert,
        fragmentShader: PS_02_frag,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true
    });
    //-append vertices to position attribute
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
    /* set attributes */
    var randomTrigger = new Float32Array( self.PARTICLE_COUNT );
    self.buffer.addAttribute('randomTrigger', new THREE.BufferAttribute(randomTrigger, 1));
    self.buffer.addAttribute('position', new THREE.BufferAttribute(self.pVertices, 3));
    /* init */
    this.init = function(){
        self.ps = new THREE.Points(self.buffer, self.mat);
        this.add(self.ps);
    };
    /* update */
    this.update = function(time, _in_01) {
        //-update unifomrs
        self.mat.uniforms['uTime'].value = time;
        self.mat.uniforms['uBase'].value = _in_01;
        //-update attributes
        for(var i = 0; i < self.PARTICLE_COUNT; i++){
            var rullet = Math.round(Math.random()-.9);
            randomTrigger[i] = rullet;
            //console.log(rullet);
        }
        /* set dynamic attributes */
        self.buffer.attributes.randomTrigger.needsUpdate = true;
    };    
    this.init();
};
/* connect to threejs library */
THREE.PS_02.prototype = Object.create(THREE.Object3D.prototype);
THREE.PS_02.prototype.constructor = THREE.PS_02;


