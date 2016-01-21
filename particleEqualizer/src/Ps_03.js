/*
 *  GPU PS Object
 *  author av(Sehyun Kim)
 *
 *  av.seoul@gmail.com
 *  http://kimsehyun.kr
 */

THREE.PS_03 = function(_options){
    var self = this;
    var options = _options || {};
    var pi = 3.14159265;
    var randomLife, randomLifeTarget;
    self.slice = options.slice || 24;
    self.segment = options.segment || 48;
    self.PARTICLE_COUNT = self.slice * self.segment;
    self.pVertices = new Float32Array(self.PARTICLE_COUNT * 3);
    self.radius = options.radius || 0.8;
    self.buffer = new THREE.BufferGeometry();
    self.ps; //<-'praticlesystem' will be point cloud
    //-get shaders
    var PS_03_vert = options.ps03vert;
    var PS_03_frag = options.ps03frag;
    /* extend Object3D */
    THREE.Object3D.apply(this, arguments);
    /* set material */
    self.mat = new THREE.ShaderMaterial({
        transparent: true,
        uniforms:{
            'uTime': {type: 'f', value: 0.0 },
            'uLife': {type: 'f', value: 0.0 },
            'uBass': {type: 'f', value: 0.0 },
            'uTreble': {type: 'f', value: 0.0 },
            'fogColor': { type: 'c', value: scene.fog.color },
            'fogNear': { type: 'f', value: scene.fog.near },
            'fogFar': { type: 'f', value: scene.fog.far }
        },
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        vertexShader: PS_03_vert,
        fragmentShader: PS_03_frag,
        fog: true
    });
    //-append vertices to position attribute
    for(var v = 0; v < self.slice; v++){
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
    self.buffer.addAttribute('position', new THREE.BufferAttribute(self.pVertices, 3));
    randomLife = new Float32Array( self.PARTICLE_COUNT  );
    randomLifeTarget = new Float32Array( self.PARTICLE_COUNT  );
    var aBass = new Float32Array( self.PARTICLE_COUNT );
    for(var i = 0; i < randomLife.length; i++){
        var r = randomLife[i];
        var rt = randomLifeTarget[i];
        r = 0;
        rt = Math.random() * 30 + 30;
    }
    self.buffer.addAttribute( 'randomLife', new THREE.BufferAttribute( randomLife, 1 ).setDynamic(true) );
    self.buffer.addAttribute( 'randomLifeTarget', new THREE.BufferAttribute( randomLifeTarget, 1 ).setDynamic(true) );
    self.buffer.addAttribute( 'aBass', new THREE.BufferAttribute( aBass, 1).setDynamic(true));
    /* init */
    this.init = function(){
        self.ps = new THREE.Points(self.buffer, self.mat);
        this.add(self.ps);
    };
    /* update */
    this.update = function(_time, _life, _bass, _treble) {
        //-update uniforms
        self.mat.uniforms['uTime'].value = _time;
        self.mat.uniforms['uLife'].value = _life;
        self.mat.uniforms['uBass'].value = _bass;
        self.mat.uniforms['uTreble'].value = _treble;
        //-update attribues
        var r = randomLife;
        var rt = randomLifeTarget;
        for(var i = 0; i < self.PARTICLE_COUNT; i++){
            if(aBass[i] > 1){
                aBass[i] -= .5;
            } else {
                var index = Math.floor( Math.random() * self.PARTICLE_COUNT );
                var trigger = 150;
                if( index%i == 0 && _bass > trigger ){ 
                    aBass[index] = _bass;
                }
            }
            if(r[i] > rt[i]){
                r[i] = 0;
                rt[i] = Math.random() * 20 + 10;
            }
            r[i]+= .5;
        }
        /* set dynamic attributes */
        self.buffer.attributes.randomLife.needsUpdate = true;
        self.buffer.attributes.randomLifeTarget.needsUpdate = true;
        self.buffer.attributes.aBass.needsUpdate = true;
    };
    //-excute init()
    this.init();
};
/* connect to threejs library */
THREE.PS_03.prototype = Object.create(THREE.Object3D.prototype);
THREE.PS_03.prototype.constructor = THREE.PS_03;



