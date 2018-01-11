// This is a port of Ken Perlin's Java code. The
// original Java code is at http://cs.nyu.edu/%7Eperlin/noise/.
// Note that in this version, a number from 0 to 1 is returned.
var Noise = function() {
   this.noise = function(x, y, z) {

      var p = new Array(512)
      var permutation = [ 151,160,137,91,90,15,
      131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
      190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
      88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
      77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
      102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
      135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
      5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
      223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
      129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
      251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
      49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
      138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180
      ];
      for (var i=0; i < 256 ; i++) 
         p[256+i] = p[i] = permutation[i]; 

         var X = Math.floor(x) & 255,                  // FIND UNIT CUBE THAT
             Y = Math.floor(y) & 255,                  // CONTAINS POINT.
             Z = Math.floor(z) & 255;
         x -= Math.floor(x);                                // FIND RELATIVE X,Y,Z
         y -= Math.floor(y);                                // OF POINT IN CUBE.
         z -= Math.floor(z);
         var    u = fade(x),                                // COMPUTE FADE CURVES
                v = fade(y),                                // FOR EACH OF X,Y,Z.
                w = fade(z);
         var A = p[X  ]+Y, AA = p[A]+Z, AB = p[A+1]+Z,      // HASH COORDINATES OF
             B = p[X+1]+Y, BA = p[B]+Z, BB = p[B+1]+Z;      // THE 8 CUBE CORNERS,

         return scale(lerp(w, lerp(v, lerp(u, grad(p[AA  ], x  , y  , z   ),  // AND ADD
                                        grad(p[BA  ], x-1, y  , z   )), // BLENDED
                                lerp(u, grad(p[AB  ], x  , y-1, z   ),  // RESULTS
                                        grad(p[BB  ], x-1, y-1, z   ))),// FROM  8
                        lerp(v, lerp(u, grad(p[AA+1], x  , y  , z-1 ),  // CORNERS
                                        grad(p[BA+1], x-1, y  , z-1 )), // OF CUBE
                                lerp(u, grad(p[AB+1], x  , y-1, z-1 ),
                                        grad(p[BB+1], x-1, y-1, z-1 )))));
   }
   function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
   function lerp( t, a, b) { return a + t * (b - a); }
   function grad(hash, x, y, z) {
      var h = hash & 15;                      // CONVERT LO 4 BITS OF HASH CODE
      var u = h<8 ? x : y,                 // INTO 12 GRADIENT DIRECTIONS.
             v = h<4 ? y : h==12||h==14 ? x : z;
      return ((h&1) == 0 ? u : -u) + ((h&2) == 0 ? v : -v);
   } 
   function scale(n) { return (1 + n)/2; }
};


var Vector3 = function(_x, _y, _z) {
   this.x = _x;
   this.y = _y;
   this.z = _z;
}

Vector3.prototype.set = function(_x, _y, _z){
   this.x = _x;
   this.y = _y;
   this.z = _z;
}

var dot = function(_a, _b){
   var ax = _a.x;
   var ay = _a.y;
}

var startTime = (new Date()).getTime() / 1000, time = startTime;
var canvases = [];

function initCanvas(id) {
   var canvas = document.getElementById(id);
   
   canvas.setCursor = function(x, y, z) {
     var r = this.getBoundingClientRect();
	  this.cursor.set(x - r.left, y - r.top, z);
   }

   canvas.cursor = new Vector3(0, 0, 0);
   
   canvas.onmousedown = function(e) { this.setCursor(e.clientX, e.clientY, 1); }
   canvas.onmousemove = function(e) { this.setCursor(e.clientX, e.clientY   ); }
   canvas.onmouseup   = function(e) { this.setCursor(e.clientX, e.clientY, 0); }
   
   canvases.push(canvas);
   
   return canvas;
}

function tick() {
   time = (new Date()).getTime() / 1000 - startTime;
   for (var i = 0 ; i < canvases.length ; i++)
      if (canvases[i].update !== undefined) {
    var canvas = canvases[i];
         var g = canvas.getContext('2d');
         g.clearRect(0, 0, canvas.width, canvas.height);
         canvas.update(g);
      }
   setTimeout(tick, 1000 / 60);
}
tick();



var getMousePos = function(canvas, evt) {
    var rect = canvas.getBoundingClientRect(), root = document.documentElement;

    // return relative mouse position
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
      x: mouseX,
      y: mouseY
    };
  }


var pi = 3.14159265359; 


//******************//
//
//Cube Object
//
//******************//
var Cube = function() {
   this.vertices = [];
   this.vertices.push( new Vector3(-1,  1, -1) ); //0
   this.vertices.push( new Vector3( 1,  1, -1) ); //1
   this.vertices.push( new Vector3(-1, -1, -1) ); //2
   this.vertices.push( new Vector3( 1, -1, -1) ); //3
   this.vertices.push( new Vector3(-1,  1,  1) ); //4
   this.vertices.push( new Vector3( 1,  1,  1) ); //5
   this.vertices.push( new Vector3(-1, -1,  1) ); //6
   this.vertices.push( new Vector3( 1, -1,  1) ); //7

   this.indices = [];
   this.indices.push( [0, 1] );
   this.indices.push( [1, 3] );
   this.indices.push( [2, 3] );
   this.indices.push( [2, 0] );
   this.indices.push( [0, 4] );
   this.indices.push( [4, 5] );
   this.indices.push( [1, 5] );
   this.indices.push( [5, 7] );
   this.indices.push( [3, 7] );
   this.indices.push( [6, 7] );
   this.indices.push( [6, 2] );
   this.indices.push( [4, 6] );

   this.isNoise = false;
   this.noiseP = 1;
}
Cube.prototype.transform = function(_g, _m, _noise){
   var context = _g;
   var dst0    = new Vector3(0, 0, 0);
   var dst1    = new Vector3(0, 0, 0);
   var matrix  = _m.matrix;
   var noise   = _noise;
   

   context.strokeStyle = 'black';
   context.beginPath();

   for(var i = 0; i < this.indices.length; i++){
      var index0 = this.indices[i][0];
      var index1 = this.indices[i][1];

      dst0 = dotDST(matrix, this.vertices[index0]);
      dst1 = dotDST(matrix, this.vertices[index1]);

      if(this.isNoise){
         dst0.x += noise.noise(dst0.x * this.noiseP, dst0.y * this.noiseP, dst0.z * this.noiseP) * .3;
         dst0.y += noise.noise(dst0.y * this.noiseP, dst0.z * this.noiseP, dst0.x * this.noiseP) * .3;
         dst0.z += noise.noise(dst0.z * this.noiseP, dst0.x * this.noiseP, dst0.x * this.noiseP) * .3;
         dst1.x += noise.noise(dst1.x * this.noiseP, dst1.y * this.noiseP, dst1.z * this.noiseP) * .3;
         dst1.y += noise.noise(dst1.y * this.noiseP, dst1.z * this.noiseP, dst1.x * this.noiseP) * .3;
         dst1.z += noise.noise(dst1.z * this.noiseP, dst1.x * this.noiseP, dst1.x * this.noiseP) * .3;
      }

      var coord1 = pixelCoord(dst0.x, dst0.y);
      var coord2 = pixelCoord(dst1.x, dst1.y);

      context.moveTo(coord1.x, coord1.y);
      context.lineTo(coord2.x, coord2.y);
   }
   context.stroke();
};
Cube.prototype.addNoise = function(){
   this.isNoise = !this.isNoise;
};
Cube.prototype.changeNoise = function(v){
   this.noiseP = v;
};

//******************//
//
//Sphere Object
//
//******************//
var Sphere = function() {
   this.isNoise = false;
   this.noiseP = 1;

   this.slice = 24;
   this.segment = 48;

   this.vertices  = [];
   this.indices   = [];
   for(var v = 0; v < this.slice; v++){
      for(var u = 0; u < this.segment; u++){
         var theta = 2 * pi * u/this.segment;
         var phi = pi * v/(this.slice-1) - pi / 2;

         var px = Math.cos(phi) * Math.cos(theta);
         var py = Math.cos(phi) * Math.sin(theta);
         var pz = Math.sin(phi);

         //setup vertices
         this.vertices.push( new Vector3(px, py, pz) );
         //setup indices
         var index_t = u + v * this.segment;
         // console.log(index_t);
         if( index_t % this.segment == this.segment -1) {
            //for theta
            this.indices.push( [index_t, index_t - (this.segment -1) ]);
         } else {
            //for theta
            this.indices.push( [index_t, index_t+1] );
         }
         //for phi
         if( index_t >= this.segment){
            this.indices.push( [index_t, index_t - this.segment] );
         }
      }
   }
};
Sphere.prototype.reInit = function(){
   this.vertices  = [];
   this.indices   = [];

   for(var v = 0; v < this.slice; v++){
      for(var u = 0; u < this.segment; u++){
         var theta = 2 * pi * u/this.segment;
         var phi = pi * v/(this.slice-1) - pi / 2;

         var px = Math.cos(phi) * Math.cos(theta);
         var py = Math.cos(phi) * Math.sin(theta);
         var pz = Math.sin(phi);

         //setup vertices
         this.vertices.push( new Vector3(px, py, pz) );
         //setup indices
         var index_t = u + v * this.segment;
         // console.log(index_t);
         if( index_t % this.segment == this.segment -1) {
            //for theta
            this.indices.push( [index_t, index_t - (this.segment -1) ]);
         } else {
            //for theta
            this.indices.push( [index_t, index_t+1] );
         }
         //for phi
         if( index_t >= this.segment){
            this.indices.push( [index_t, index_t - this.segment] );
         }
      }
   }
};
Sphere.prototype.transform = function(_g, _m, _noise, _theta){
   var context = _g;
   var dst0    = new Vector3(0, 0, 0);
   var dst1    = new Vector3(0, 0, 0);
   var matrix  = _m.matrix;
   var noise   = _noise;
   var theta   = _theta;

   context.strokeStyle = 'black';
   context.lineWidth = 0.5;
   context.beginPath();

   for(var i = 0; i < this.indices.length; i++){
      var index0 = this.indices[i][0];
      var index1 = this.indices[i][1];

      dst0 = dotDST(matrix, this.vertices[index0]);
      dst1 = dotDST(matrix, this.vertices[index1]);

      if(this.isNoise){
         dst0.x += noise.noise(dst0.x * this.noiseP, dst0.y * this.noiseP, dst0.z * this.noiseP) * .3;
         dst0.y += noise.noise(dst0.y * this.noiseP, dst0.z * this.noiseP, dst0.x * this.noiseP) * .3;
         dst0.z += noise.noise(dst0.z * this.noiseP, dst0.x * this.noiseP, dst0.x * this.noiseP) * .3;
         dst1.x += noise.noise(dst1.x * this.noiseP, dst1.y * this.noiseP, dst1.z * this.noiseP) * .3;
         dst1.y += noise.noise(dst1.y * this.noiseP, dst1.z * this.noiseP, dst1.x * this.noiseP) * .3;
         dst1.z += noise.noise(dst1.z * this.noiseP, dst1.x * this.noiseP, dst1.x * this.noiseP) * .3;
      }
      
      var coord1 = pixelCoord(dst0.x, dst0.y);
      var coord2 = pixelCoord(dst1.x, dst1.y);

      context.moveTo(coord1.x, coord1.y);
      context.lineTo(coord2.x, coord2.y);
   }
   context.stroke();
};
Sphere.prototype.getSlice = function(){
   return this.slice;
};
Sphere.prototype.getSeg = function(){
   return this.segment;
};
Sphere.prototype.updateSlice = function(v){
   this.slice = v;
   // console.log(v);
   this.reInit();
};
Sphere.prototype.updateSeg = function(v){
   this.segment = v;
   // console.log(v);
   this.reInit();
};
Sphere.prototype.addNoise = function(){
   this.isNoise = !this.isNoise;
};
Sphere.prototype.changeNoise = function(v){
   this.noiseP = v;
};


//******************//
//
//Cylinder Object
//
//******************//
var Cylinder = function() {
   this.isNoise = false;
   this.noiseP = 1;

   this.slice = 30;
   this.segment = 48;

   this.vertices  = [];
   this.indices   = [];
   for(var v = 0; v < this.slice; v++){
      for(var u = 0; u < this.segment; u++){
         var theta = 2 * pi * u/this.segment;

         var px = Math.cos(theta);
         var py = Math.sin(theta);
         var pz = 1 - 2 * v/this.slice;

         //setup vertices
         this.vertices.push( new Vector3(px, py, pz) );
         //setup indices
         var index_t = u + v * this.segment;
         // console.log(index_t);
         if( index_t % this.segment == this.segment -1) {
            //for theta
            this.indices.push( [index_t, index_t - (this.segment -1) ]);
         } else {
            //for theta
            this.indices.push( [index_t, index_t+1] );
         }
         //for height
         if( index_t >= this.segment){
            this.indices.push( [index_t, index_t - this.segment] );
         }
      }
   }
}
Cylinder.prototype.reInit = function(){
   this.vertices  = [];
   this.indices   = [];

   for(var v = 0; v < this.slice; v++){
      for(var u = 0; u < this.segment; u++){
         var theta = 2 * pi * u/this.segment;

         var px = Math.cos(theta);
         var py = Math.sin(theta);
         var pz = 1 - 2 * v/this.slice;

         //setup vertices
         this.vertices.push( new Vector3(px, py, pz) );
         //setup indices
         var index_t = u + v * this.segment;
         // console.log(index_t);
         if( index_t % this.segment == this.segment -1) {
            //for theta
            this.indices.push( [index_t, index_t - (this.segment -1) ]);
         } else {
            //for theta
            this.indices.push( [index_t, index_t+1] );
         }
         //for height
         if( index_t >= this.segment){
            this.indices.push( [index_t, index_t - this.segment] );
         }
      }
   }
};
Cylinder.prototype.transform = function(_g, _m, _noise){
   var context = _g;
   var dst0    = new Vector3(0, 0, 0);
   var dst1    = new Vector3(0, 0, 0);
   var matrix  = _m.matrix;
   var noise   = _noise;

   context.strokeStyle = 'black';
   context.lineWidth = 0.5;
   context.beginPath();

   for(var i = 0; i < this.indices.length; i++){
      var index0 = this.indices[i][0];
      var index1 = this.indices[i][1];

      dst0 = dotDST(matrix, this.vertices[index0]);
      dst1 = dotDST(matrix, this.vertices[index1]);

      if(this.isNoise){
         dst0.x += noise.noise(dst0.x * this.noiseP, dst0.y * this.noiseP, dst0.z * this.noiseP) * .3;
         dst0.y += noise.noise(dst0.y * this.noiseP, dst0.z * this.noiseP, dst0.x * this.noiseP) * .3;
         dst0.z += noise.noise(dst0.z * this.noiseP, dst0.x * this.noiseP, dst0.x * this.noiseP) * .3;
         dst1.x += noise.noise(dst1.x * this.noiseP, dst1.y * this.noiseP, dst1.z * this.noiseP) * .3;
         dst1.y += noise.noise(dst1.y * this.noiseP, dst1.z * this.noiseP, dst1.x * this.noiseP) * .3;
         dst1.z += noise.noise(dst1.z * this.noiseP, dst1.x * this.noiseP, dst1.x * this.noiseP) * .3;
      }
      
      var coord1 = pixelCoord(dst0.x, dst0.y);
      var coord2 = pixelCoord(dst1.x, dst1.y);

      context.moveTo(coord1.x, coord1.y);
      context.lineTo(coord2.x, coord2.y);
   }
   context.stroke();
}
Cylinder.prototype.getSlice = function(){
   return this.slice;
};
Cylinder.prototype.getSeg = function(){
   return this.segment;
};
Cylinder.prototype.updateSlice = function(v){
   this.slice = v;
   // console.log(v);
   this.reInit();
};
Cylinder.prototype.updateSeg = function(v){
   this.segment = v;
   // console.log(v);
   this.reInit();
};
Cylinder.prototype.addNoise = function(){
   this.isNoise = !this.isNoise;
};
Cylinder.prototype.changeNoise = function(v){
   this.noiseP = v;
};

//******************//
//
//Torus Object
//
//******************//
var Torus = function() {
   this.isNoise = false;
   this.noiseP = 1;

   this.slice = 50;
   this.segment = 30;

   this.vertices  = [];
   this.indices   = [];
   for(var v = 0; v < this.slice; v++){
      for(var u = 0; u < this.segment; u++){
         var theta = 2 * pi * u/this.segment;
         var phi = 2 * pi * v/(this.slice - 1);
         var radius = 0.4;

         var px = (1 + radius * Math.cos(phi)) * Math.cos(theta);
         var py = (1 + radius * Math.cos(phi)) * Math.sin(theta);
         var pz = radius * Math.sin(phi);

         //setup vertices
         this.vertices.push( new Vector3(px, py, pz) );
         //setup indices
         var index_t = u + v * this.segment;
         // console.log(index_t);
         if( index_t % this.segment == this.segment -1) {
            //for theta
            this.indices.push( [index_t, index_t - (this.segment -1) ]);
         } else {
            //for theta
            this.indices.push( [index_t, index_t+1] );
         }
         //for phi
         if( index_t >= this.segment){
            this.indices.push( [index_t, index_t - this.segment] );
         }
      }
   }
};
Torus.prototype.reInit = function(){
   this.vertices  = [];
   this.indices   = [];

   for(var v = 0; v < this.slice; v++){
      for(var u = 0; u < this.segment; u++){
         var theta = 2 * pi * u/this.segment;
         var phi = 2 * pi * v/(this.slice - 1);
         var radius = 0.4;

         var px = (1 + radius * Math.cos(phi)) * Math.cos(theta);
         var py = (1 + radius * Math.cos(phi)) * Math.sin(theta);
         var pz = radius * Math.sin(phi);

         //setup vertices
         this.vertices.push( new Vector3(px, py, pz) );
         //setup indices
         var index_t = u + v * this.segment;
         // console.log(index_t);
         if( index_t % this.segment == this.segment -1) {
            //for theta
            this.indices.push( [index_t, index_t - (this.segment -1) ]);
         } else {
            //for theta
            this.indices.push( [index_t, index_t+1] );
         }
         //for phi
         if( index_t >= this.segment){
            this.indices.push( [index_t, index_t - this.segment] );
         }
      }
   }
};
Torus.prototype.transform = function(_g, _m, _noise){
   var context = _g;
   var dst0    = new Vector3(0, 0, 0);
   var dst1    = new Vector3(0, 0, 0);
   var matrix  = _m.matrix;
   var noise   = _noise;

   context.strokeStyle = 'black';
   context.lineWidth = 0.5;
   context.beginPath();

   for(var i = 0; i < this.indices.length; i++){
      var index0 = this.indices[i][0];
      var index1 = this.indices[i][1];

      dst0 = dotDST(matrix, this.vertices[index0]);
      dst1 = dotDST(matrix, this.vertices[index1]);

      if(this.isNoise){
         dst0.x += noise.noise(dst0.x * this.noiseP, dst0.y * this.noiseP, dst0.z * this.noiseP) * .3;
         dst0.y += noise.noise(dst0.y * this.noiseP, dst0.z * this.noiseP, dst0.x * this.noiseP) * .3;
         dst0.z += noise.noise(dst0.z * this.noiseP, dst0.x * this.noiseP, dst0.x * this.noiseP) * .3;
         dst1.x += noise.noise(dst1.x * this.noiseP, dst1.y * this.noiseP, dst1.z * this.noiseP) * .3;
         dst1.y += noise.noise(dst1.y * this.noiseP, dst1.z * this.noiseP, dst1.x * this.noiseP) * .3;
         dst1.z += noise.noise(dst1.z * this.noiseP, dst1.x * this.noiseP, dst1.x * this.noiseP) * .3;
      }
      
      var coord1 = pixelCoord(dst0.x, dst0.y);
      var coord2 = pixelCoord(dst1.x, dst1.y);

      context.moveTo(coord1.x, coord1.y);
      context.lineTo(coord2.x, coord2.y);
   }
   context.stroke();
};
Torus.prototype.getSlice = function(){
   return this.slice;
};
Torus.prototype.getSeg = function(){
   return this.segment;
};
Torus.prototype.updateSlice = function(v){
   this.slice = v;
   // console.log(v);
   this.reInit();
};
Torus.prototype.updateSeg = function(v){
   this.segment = v;
   // console.log(v);
   this.reInit();
};
Torus.prototype.addNoise = function(){
   this.isNoise = !this.isNoise;
};
Torus.prototype.changeNoise = function(v){
   this.noiseP = v;
};





//matrix
var Matrix = function(){
   this.matrix = [16];
}

Matrix.prototype.identity = function(){
   for(var i = 0; i < 16; i ++){
      this.matrix[i] = 0;
   }
   this.matrix[0] =  1;
   this.matrix[5] =  1;
   this.matrix[10]=  1;
   this.matrix[15]=  1;
}

Matrix.prototype.translate = function(_x, _y, _z){
   var x = _x; 
   var y = _y; 
   var z = _z;

   var temp = [16];
   for(var i = 0; i < 16; i ++){
      temp[i] = 0;
   }
   temp[0] =  1;
   temp[5] =  1;
   temp[10]=  1;
   temp[15]=  1;

   temp[12] = x;
   temp[13] = y;
   temp[14] = z;

   this.matrix = dotMatrices(this.matrix, temp);
}

Matrix.prototype.rotateX = function(_theta){
   var theta = _theta;

   var temp = [16];
   for(var i = 0; i < 16; i ++){
      temp[i] = 0;
   }
   temp[0] =  1;
   temp[5] =  1;
   temp[10]=  1;
   temp[15]=  1;

   temp[5]  = Math.cos(theta);
   temp[6]  = Math.sin(theta);

   temp[9]  = -1 * Math.sin(theta);
   temp[10] = Math.cos(theta);

   this.matrix = dotMatrices(this.matrix, temp);
}

Matrix.prototype.rotateY = function(_theta){
   var theta = _theta;

   var temp = [16];
   for(var i = 0; i < 16; i ++){
      temp[i] = 0;
   }
   temp[0] =  1;
   temp[5] =  1;
   temp[10]=  1;
   temp[15]=  1;

   temp[0]  = Math.cos(theta);
   temp[2]  = -1 * Math.sin(theta);

   temp[8]  = Math.sin(theta);
   temp[10] = Math.cos(theta);
   
   this.matrix = dotMatrices(this.matrix, temp);
}

Matrix.prototype.rotateZ = function(_theta){
   var theta = _theta;

   var temp = [16];
   for(var i = 0; i < 16; i ++){
      temp[i] = 0;
   }
   temp[0] =  1;
   temp[5] =  1;
   temp[10]=  1;
   temp[15]=  1;

   temp[0] = Math.cos(theta);
   temp[1] = Math.sin(theta);

   temp[4] = -1 * Math.sin(theta);
   temp[5] =  Math.cos(theta);

   this.matrix = dotMatrices(this.matrix, temp);
}

Matrix.prototype.scale = function(_x, _y, _z){
   var x = _x; var y = _y; var z = _z;

   var temp = [16];
   for(var i = 0; i < 16; i ++){
      temp[i] = 0;
   }
   temp[0] =  1;
   temp[5] =  1;
   temp[10]=  1;
   temp[15]=  1;

   temp[0] = x;
   temp[5] = y;
   temp[10]= z;

   this.matrix = dotMatrices(this.matrix, temp);
}

var dotMatrices = function(_a, _b){
   var a = _a; 
   var b = _b;

   var temp = [16];
   for(var i = 0; i < 16; i ++){
      temp[i] = 0;
   }

   temp[0] =  a[0]*b[0]  + a[4]*b[1]  + a[8]*b[2]  + a[12]*b[3];
   temp[1] =  a[0]*b[4]  + a[4]*b[5]  + a[8]*b[6]  + a[12]*b[7];
   temp[2] =  a[0]*b[8]  + a[4]*b[9]  + a[8]*b[10] + a[12]*b[11];
   temp[3] =  a[0]*b[12] + a[4]*b[13] + a[8]*b[14] + a[12]*b[15];

   temp[4] =  a[1]*b[0]  + a[5]*b[1]  + a[9]*b[2]  + a[13]*b[3];
   temp[5] =  a[1]*b[4]  + a[5]*b[5]  + a[9]*b[6]  + a[13]*b[7];
   temp[6] =  a[1]*b[8]  + a[5]*b[9]  + a[9]*b[10] + a[13]*b[11];
   temp[7] =  a[1]*b[12] + a[5]*b[13] + a[9]*b[14] + a[13]*b[15];

   temp[8] =  a[2]*b[0]  + a[6]*b[1]  + a[10]*b[2] + a[14]*b[3];
   temp[9] =  a[2]*b[4]  + a[6]*b[5]  + a[10]*b[6] + a[14]*b[7];
   temp[10]=  a[2]*b[8]  + a[6]*b[9]  + a[10]*b[10]+ a[14]*b[11];
   temp[11]=  a[2]*b[12] + a[6]*b[13] + a[10]*b[14]+ a[14]*b[15];

   temp[12]=  a[3]*b[0]  + a[7]*b[1]  + a[11]*b[2] + a[15]*b[3];
   temp[13]=  a[3]*b[4]  + a[7]*b[5]  + a[11]*b[6] + a[15]*b[7];
   temp[14]=  a[3]*b[8]  + a[7]*b[9]  + a[11]*b[10]+ a[15]*b[11];
   temp[15]=  a[3]*b[12] + a[7]*b[13] + a[11]*b[14]+ a[15]*b[15];

   return temp;
}

var dotDST = function(_matrix, _vertex){
   var a = _matrix; 
   var b = _vertex;

   var dst = new Vector3(0, 0, 0);

   var x, y, z;

   x = a[0]*b.x + a[1]*b.y + a[2]*b.z + a[3]*1;
   y = a[4]*b.x + a[5]*b.y + a[6]*b.z + a[7]*1;
   z = a[8]*b.x + a[9]*b.y + a[10]*b.z + a[11]*1;

   dst.set(x, y, z);

   return dst;
}


var pixelCoord = function(_x, _y){
   var x = _x;
   var y = _y;

   x = (600  / 2) + x * (600 / 2);
   y = (600 / 2) - y * (600 / 2);

   var coord = new Vector3(x, y, 0);
   return coord;
}  