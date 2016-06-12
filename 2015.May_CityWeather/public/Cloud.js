var Cloud = function()
{
    this.cloudSize;
    this.cloudLoc; 
    this.cloudVel;
    this.windSpeedRandomFactor;
    this.windSpeedFactor;

    this.cloud = [];
};

Cloud.prototype.setup = function()
{
    this.cloud[0] = loadImage("cloud_01.png");
    this.cloud[1] = loadImage("cloud_02.png");
    this.cloud[2] = loadImage("cloud_03.png");
    this.cloud[3] = loadImage("cloud_04.png");

    this.reset();
};

Cloud.prototype.getEvent = function(_windSpeedFactor){
    //get wind speed from weather data
    this.windSpeedFactor = _windSpeedFactor * this.windSpeedRandomFactor + 0.1;
};

Cloud.prototype.update = function()
{   
    this.cloudVel.x = this.windSpeedFactor;

    //reset position
    if( this.cloudLoc.x > window.innerWidth + this.cloudSize.x){
        this.reset();
    }

    this.cloudLoc.add(this.cloudVel);
};

Cloud.prototype.display = function()
{
    push();
    {
        translate(this.cloudLoc.x, this.cloudLoc.y);
        image(this.currentCloud, 0, 0, this.cloudSize.x, this.cloudSize.y);
    }
    pop();
};


Cloud.prototype.reset = function()
{
    this.cloudSize = new p5.Vector(Math.random() * 500 + 300, Math.random() * 500 + 300);  
    this.cloudLoc = new p5.Vector(0, 0); 
    // this.cloudVelTarget = new p5.Vector(Math.random() * 1 + 1, 0);
    this.windSpeedRandomFactor = Math.random();
    this.cloudVel = new p5.Vector(0, 0);

    var index = Math.floor(Math.random() * this.cloud.length);
    this.currentCloud = this.cloud[index];

    //initialize rain initail pos
    this.cloudLoc.x = -1 * this.cloudSize.x;
    this.cloudLoc.y = Math.random() * this.cloudSize.y/2 * -1;
};