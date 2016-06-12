var WindObject = function()
{
    this.radius;
    this.loc; 
    this.preLoc;
    this.vel;
    this.speedRandomFactor;
    this.speedFactor;
};

WindObject.prototype.setup = function()
{
    this.reset();
};

WindObject.prototype.getEvent = function(_speedFactor){
    //get wind speed from weather data
    this.speedFactor = _speedFactor * this.speedRandomFactor + 0.1;
};

WindObject.prototype.update = function()
{   
    this.vel.x = this.speedFactor;

    //reset position
    if( this.loc.x > window.innerWidth + this.radius){
        this.reset();
    }

    this.loc.add(this.vel);
};

WindObject.prototype.display = function()
{
    push();
    {
        fill(100);
        ellipse(this.loc.x, this.loc.y, this.radius, this.radius);
        stroke(100);
        line(this.loc.x, this.loc.y, this.preLoc.x, this.preLoc.y);
        noStroke();

        this.preLoc.x = this.loc.x;
        this.preLoc.y = this.loc.y;
    }
    pop();
};


WindObject.prototype.reset = function()
{
    this.radius = Math.random() * 2 + 1;  
    this.loc = new p5.Vector(0, 0); 
    this.preLoc = new p5.Vector(0, 0); 
    // this.cloudVelTarget = new p5.Vector(Math.random() * 1 + 1, 0);
    this.speedRandomFactor = Math.random() * 2;
    this.vel = new p5.Vector(0, 0);

    //initialize rain initail pos
    this.loc.x = -1 * this.radius;
    this.loc.y = Math.random() * window.innerWidth * 0.4;
};