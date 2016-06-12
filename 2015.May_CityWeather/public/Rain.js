var Rain = function()
{
    this.rainSize;
    this.rainLoc; 
    this.rainVel;
    this.rainAcc;

    this.mNumPlayingRains = 0;

    this.reset();
};

Rain.prototype.update = function()
{   
    //reset position
    if( this.rainLoc.y > window.innerHeight + this.rainSize * 2){
        this.reset();
    }

    this.rainVel.add(this.rainAcc);
    this.rainLoc.add(this.rainVel);

    this.rainAcc.mult(0);
};

Rain.prototype.getEvent = function(_mNumPlayingRains){
    this.mNumPlayingRains = _mNumPlayingRains;
    this.reset();
};

Rain.prototype.display = function()
{
    push();
    {
        translate(this.rainLoc.x, this.rainLoc.y);
        push();
        {
            stroke(150);
            line(0, 0, 0, this.rainSize);
        }
        pop();
    }
    pop();
};

Rain.prototype.reset = function()
{
    this.rainSize = Math.random() * 50 + 30;
    this.rainLoc = new p5.Vector(0, 0); 
    this.rainVel = new p5.Vector(0, Math.random() * 5 + 3);
    this.rainVel.y += this.mNumPlayingRains * 0.1;
    this.rainAcc = new p5.Vector(0, 0);

    //initialize rain initail pos
    this.rainLoc.x = Math.random() * window.innerWidth;
    this.rainLoc.y = -2 * this.rainSize;
};