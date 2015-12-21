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

    //get shaders
    var PS_03_vert = options.ps03vert;
    var PS_03_frag = options.ps03frag;

    /* extend Object3D */
    THREE.Object3D.apply(this, arguments);

    //set material
    self.mat = new THREE.ShaderMaterial({
        transparent: true,
        uniforms:{
            'uTime': {type: 'f', value: 0.0 },
            'uLife': {type: 'f', value: 0.0 }
        },
        blending: 'THREE.AddictiveBlending',
        depthWrite: true,
        vertexShader: PS_03_vert,
        fragmentShader: PS_03_frag
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
    randomLife = new Float32Array( self.PARTICLE_COUNT  );
    randomLifeTarget = new Float32Array( self.PARTICLE_COUNT  );
    for(var i = 0; i < randomLife.length; i++){
        var r = randomLife[i];
        var rt = randomLifeTarget[i];
        r = 0;
        rt = Math.random() * 30 + 30;
    }
    self.buffer.addAttribute( 'randomLife', new THREE.BufferAttribute( randomLife, 1 ).setDynamic(true) );
    self.buffer.addAttribute( 'randomLifeTarget', new THREE.BufferAttribute( randomLifeTarget, 1 ).setDynamic(true) );


    /* init */
    this.init = function(){
        //-particle system with point cloud
        self.ps = new THREE.Points(self.buffer, self.mat);
        this.add(self.ps);
    };
    
    this.update = function(time, life) {
        //update uniforms
        self.mat.uniforms['uTime'].value = time;
        self.mat.uniforms['uLife'].value = life;

        //update attribues
        var r = randomLife;
        var rt = randomLifeTarget;
        for(var i = 0; i < self.PARTICLE_COUNT; i++){
            if(r[i] > rt[i]){
                r[i] = 0;
                rt[i] = Math.random() * 20 + 10;
            }
            r[i]+= .5;
        }

        self.buffer.attributes.randomLife.needsUpdate = true;
        self.buffer.attributes.randomLifeTarget.needsUpdate = true;

    };

    //excute init()
    this.init();
};

THREE.PS_03.prototype = Object.create(THREE.Object3D.prototype);
THREE.PS_03.prototype.constructor = THREE.PS_03;



