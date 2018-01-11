
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



//
var Cube = function(_x, _y, _z, _r) {
   this.x = _x/300 - 1;
   this.y = 1 - _y/300;
   this.z = _z;
   this.r = _r/300 - 1;
   
   this.vertices = [];
   this.vertices.push( new Vector3(this.x - this.r/2.0, this.y + this.r/2.0, this.z - this.r/2.0) ); //0
   this.vertices.push( new Vector3(this.x + this.r/2.0, this.y + this.r/2.0, this.z - this.r/2.0) ); //1
   this.vertices.push( new Vector3(this.x - this.r/2.0, this.y - this.r/2.0, this.z - this.r/2.0) ); //2
   this.vertices.push( new Vector3(this.x + this.r/2.0, this.y - this.r/2.0, this.z - this.r/2.0) ); //3
   this.vertices.push( new Vector3(this.x - this.r/2.0, this.y + this.r/2.0, this.z + this.r/2.0) ); //4
   this.vertices.push( new Vector3(this.x + this.r/2.0, this.y + this.r/2.0, this.z + this.r/2.0) ); //5
   this.vertices.push( new Vector3(this.x - this.r/2.0, this.y - this.r/2.0, this.z + this.r/2.0) ); //6
   this.vertices.push( new Vector3(this.x + this.r/2.0, this.y - this.r/2.0, this.z + this.r/2.0) ); //7

   this.edges1 = [];
   this.edges2 = [];
}
Cube.prototype.transform = function(_index, _dst){
   var i = _index;
   var dst = _dst;

   this.vertices[i].set(dst.x, dst.y, dst.z);
}

Cube.prototype.initEdge = function(_index){
   var index = _index;

   if (index == 0){
      this.edges1.push( this.vertices[0]);//0
      this.edges1.push( this.vertices[1]);//1
      this.edges1.push( this.vertices[2]);//2
      this.edges1.push( this.vertices[2]);//3
      this.edges1.push( this.vertices[0]);//4
      this.edges1.push( this.vertices[4]);//5
      this.edges1.push( this.vertices[1]);//6
      this.edges1.push( this.vertices[5]);//7
      this.edges1.push( this.vertices[3]);//8
      this.edges1.push( this.vertices[6]);//9
      this.edges1.push( this.vertices[6]);//10
      this.edges1.push( this.vertices[4]);//11
   } else if (index == 1){
      this.edges2.push( this.vertices[1] );//0
      this.edges2.push( this.vertices[3] );//1
      this.edges2.push( this.vertices[3] );//2
      this.edges2.push( this.vertices[0] );//3
      this.edges2.push( this.vertices[4] );//4
      this.edges2.push( this.vertices[5] );//5
      this.edges2.push( this.vertices[5] );//6
      this.edges2.push( this.vertices[7] );//7
      this.edges2.push( this.vertices[7] );//8
      this.edges2.push( this.vertices[7] );//9
      this.edges2.push( this.vertices[2] );//10
      this.edges2.push( this.vertices[6] );//11
   }
}

Cube.prototype.getUpdatedEdge = function(_index){
   var index = _index;
   if (index == 0){
      this.edges1[0] = this.vertices[0];//0
      this.edges1[1] = this.vertices[1];//1
      this.edges1[2] = this.vertices[2];//2
      this.edges1[3] = this.vertices[2];//3
      this.edges1[4] = this.vertices[0];//4
      this.edges1[5] = this.vertices[4];//5
      this.edges1[6] = this.vertices[1];//6
      this.edges1[7] = this.vertices[5];//7
      this.edges1[8] = this.vertices[3];//8
      this.edges1[9] = this.vertices[6];//9
      this.edges1[10]= this.vertices[6];//10
      this.edges1[11]= this.vertices[4];//11

      return this.edges1;
   } else if (index == 1){
      this.edges2[0] = this.vertices[1];//0
      this.edges2[1] = this.vertices[3];//1
      this.edges2[2] = this.vertices[3];//2
      this.edges2[3] = this.vertices[0];//3
      this.edges2[4] = this.vertices[4];//4
      this.edges2[5] = this.vertices[5];//5
      this.edges2[6] = this.vertices[5];//6
      this.edges2[7] = this.vertices[7];//7
      this.edges2[8] = this.vertices[7];//8
      this.edges2[9] = this.vertices[7];//9
      this.edges2[10]= this.vertices[2];//10
      this.edges2[11]= this.vertices[6];//11

      return this.edges2;
   }
}

var pixelCoord = function(_x, _y){
   var x = _x;
   var y = _y;

   x = (600  / 2) + x * (600 / 2);
   y = (600 / 2) - y * (600 / 2);

   var coord = new Vector3(x, y, 0);
   return coord;
}





//matrix
var Matrix = function(){
   this.matrix = [];
}

Matrix.prototype.identity = function(){
   this.matrix.push(1);//0  x0
   this.matrix.push(0);//1  x1
   this.matrix.push(0);//2  x2 
   this.matrix.push(0);//3  x3

   this.matrix.push(0);//4  y0
   this.matrix.push(1);//5  y1
   this.matrix.push(0);//6  y2
   this.matrix.push(0);//7  y3

   this.matrix.push(0);//8  z0
   this.matrix.push(0);//9  z1
   this.matrix.push(1);//10 z2
   this.matrix.push(0);//11 z3

   this.matrix.push(0);//12 t0 
   this.matrix.push(0);//13 t1
   this.matrix.push(0);//14 t2
   this.matrix.push(1);//15 t3
}

Matrix.prototype.set = function(_index, _value){
   var i = _index;
   var v = _value;
   this.matrix[i] = v;
}

var dotMatrices = function(_a, _b){
   var a = _a.matrix; 
   var b = _b.matrix;

   var matrix = new Matrix();
   matrix.identity();

   matrix.set(0,  a[0]*b[0]  + a[4]*b[1]  + a[8]*b[2]  + a[12]*b[3]);
   matrix.set(1,  a[0]*b[4]  + a[4]*b[5]  + a[8]*b[6]  + a[12]*b[7]);
   matrix.set(2,  a[0]*b[8]  + a[4]*b[9]  + a[8]*b[10] + a[12]*b[11]);
   matrix.set(3,  a[0]*b[12] + a[4]*b[13] + a[8]*b[14] + a[12]*b[15]);

   matrix.set(4,  a[1]*b[0]  + a[5]*b[1]  + a[9]*b[2]  + a[13]*b[3]);
   matrix.set(5,  a[1]*b[4]  + a[5]*b[5]  + a[9]*b[6]  + a[13]*b[7]);
   matrix.set(6,  a[1]*b[8]  + a[5]*b[9]  + a[9]*b[10] + a[13]*b[11]);
   matrix.set(7,  a[1]*b[12] + a[5]*b[13] + a[9]*b[14] + a[13]*b[15]);

   matrix.set(8,  a[2]*b[0]  + a[6]*b[1]  + a[10]*b[2] + a[14]*b[3]);
   matrix.set(9,  a[2]*b[4]  + a[6]*b[5]  + a[10]*b[6] + a[14]*b[7]);
   matrix.set(10, a[2]*b[8]  + a[6]*b[9]  + a[10]*b[10]+ a[14]*b[11]);
   matrix.set(11, a[2]*b[12] + a[6]*b[13] + a[10]*b[14]+ a[14]*b[15]);

   matrix.set(12, a[3]*b[0]  + a[7]*b[1]  + a[11]*b[2] + a[15]*b[3]);
   matrix.set(13, a[3]*b[4]  + a[7]*b[5]  + a[11]*b[6] + a[15]*b[7]);
   matrix.set(14, a[3]*b[8]  + a[7]*b[9]  + a[11]*b[10]+ a[15]*b[11]);
   matrix.set(15, a[3]*b[12] + a[7]*b[13] + a[11]*b[14]+ a[15]*b[15]);

   return matrix;
}

var dotDST = function(_matrix, _vertex){
   var a = _matrix.matrix; 
   var b = _vertex;

   var dst = new Vector3(0, 0, 0);

   var x, y, z;

   x = a[0]*b.x + a[1]*b.y + a[2]*b.z + a[3]*1;
   y = a[4]*b.x + a[5]*b.y + a[6]*b.z + a[7]*1;
   z = a[8]*b.x + a[9]*b.y + a[10]*b.z + a[11]*1;

   dst.set(x, y, z);

   return dst;
}

var translate = function(_x, _y, _z){
   var x = _x; 
   var y = _y; 
   var z = _z;

   var matrix = new Matrix();
   matrix.identity();

   matrix.set(12, x);
   matrix.set(13, y);
   matrix.set(14, z);

   return matrix;
}

var rotateX = function(_theta){
   var theta = _theta;

   var matrix = new Matrix();
   matrix.identity();

   matrix.set(5, Math.cos(theta) );
   matrix.set(6, Math.sin(theta) );

   matrix.set(9, -1 * Math.sin(theta) );
   matrix.set(10, Math.cos(theta) );

   return matrix;
}

var rotateY = function(_theta){
   var theta = _theta;

   var matrix = new Matrix();
   matrix.identity();

   matrix.set(0, Math.cos(theta) );
   matrix.set(2, -1 * Math.sin(theta) );

   matrix.set(8, Math.sin(theta) );
   matrix.set(10, Math.cos(theta) );
   
   return matrix;
}

var rotateZ = function(_theta){
   var theta = _theta;

   var matrix = new Matrix();
   matrix.identity();

   matrix.set(0, Math.cos(theta) );
   matrix.set(1, Math.sin(theta) );

   matrix.set(4, -1 * Math.sin(theta) );
   matrix.set(5, Math.cos(theta) );

   return matrix;
}

var scale = function(_x, _y, _z){
   var x = _x; var y = _y; var z = _z;

   var matrix = new Matrix();
   matrix.identity();

   matrix.set(0, x);
   matrix.set(5, y);
   matrix.set(10, z);

   return matrix;
}
   