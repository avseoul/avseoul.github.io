/*
 *  GPU PS Object
 *  author av(Sehyun Kim)
 *
 *  av.seoul@gmail.com
 *  http://kimsehyun.kr
 */

THREE.PS_05 = function(_options){
    var self = this;
    var options = _options || {};
    var pi = 3.14159265;
    self.PARTICLE_COUNT = options.size || 100;
    self.pVertices = new Float32Array(self.PARTICLE_COUNT * 3);
    self.buffer = new THREE.BufferGeometry();
    self.ps; //<-'praticlesystem' will be point cloud
    //get shaders
    var PS_05_vert = options.ps05vert;
    var PS_05_frag = options.ps05frag;
    /* extend Object3D */
    THREE.Object3D.apply(this, arguments);
    /* set material */
    self.mat = new THREE.ShaderMaterial({
        transparent: true,
        uniforms:{
            'uTime': {type: 'f', value: 0.0 },
            'uTreble': {type: 'f', value: 0.0 }
        },
        depthWrite: false,
        blending: 'THREE.AddictiveBlending',
        vertexShader: PS_05_vert,
        fragmentShader: PS_05_frag
    });
    //-append vertices
    for(var i = 0; i < self.PARTICLE_COUNT; i++){
        self.pVertices[i * 3 + 0] = 0;
        self.pVertices[i * 3 + 1] = 0;
        self.pVertices[i * 3 + 2] = 0;
    }
    /* set attributes */
    self.buffer.addAttribute('position', new THREE.BufferAttribute(self.pVertices, 3));
    var aVel = new Float32Array( self.PARTICLE_COUNT * 2 );
    var aBass = new Float32Array( self.PARTICLE_COUNT );
    var randomLife = new Float32Array( self.PARTICLE_COUNT  );
    var randomLifeTarget = new Float32Array( self.PARTICLE_COUNT  );
    for(var i = 0; i < randomLife.length; i++){
        var r = randomLife[i];
        var rt = randomLifeTarget[i];
        r = 0;
        rt = Math.random() * 30 + 30;
    }
    self.buffer.addAttribute( 'aVel', new THREE.BufferAttribute( aVel, 2 ).setDynamic(true) );
    self.buffer.addAttribute( 'randomLife', new THREE.BufferAttribute( randomLife, 1 ).setDynamic(true) );
    self.buffer.addAttribute( 'randomLifeTarget', new THREE.BufferAttribute( randomLifeTarget, 1 ).setDynamic(true) );
    self.buffer.addAttribute( 'aBass', new THREE.BufferAttribute( aBass, 1 ).setDynamic(true) );
    /* init */
    this.init = function(){
        for(var i = 0; i < self.PARTICLE_COUNT; i++){
            aVel[i*2+0] = 0;
            aVel[i*2+1] = 0;
        }
        self.ps = new THREE.Points(self.buffer, self.mat);
        this.add(self.ps);
    };
    /* update */
    this.update = function(_time, _bass, _treble) {
        //-update uniforms
        self.mat.uniforms['uTime'].value = _time;
        self.mat.uniforms['uTreble'].value = _treble;
        //update attribues
        for(var i = 0; i < self.PARTICLE_COUNT; i++){
            if(randomLife[i] > randomLifeTarget[i]){
                randomLife[i] = 0;
                randomLifeTarget[i] = Math.random() * 20 + 10;
                aVel[i*2+0] = (Math.random()*2-1)*500;
                aVel[i*2+1] = (Math.random()*2-1)*500;
            }
            randomLife[i]+= .5;
            
            if(aBass[i] > 1){
                aBass[i] -= .5;
            } else {
                var index = Math.floor( Math.random() * self.PARTICLE_COUNT );
                var trigger = 90;
                if( index%i == 0 && _bass > trigger ){ 
                    aBass[index] = _bass;
                }
            }
        }
        /* set dynamic attributes */
        self.buffer.attributes.aVel.needsUpdate = true;
        self.buffer.attributes.aBass.needsUpdate = true;
        self.buffer.attributes.randomLife.needsUpdate = true;
        self.buffer.attributes.randomLifeTarget.needsUpdate = true;
    };
    //excute init()
    this.init();
};
/* connect to threejs library */
THREE.PS_05.prototype = Object.create(THREE.Object3D.prototype);
THREE.PS_05.prototype.constructor = THREE.PS_05;



