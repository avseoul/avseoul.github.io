var Character = function()
{
    this.characterSize;
    this.characterLoc; 
    this.characterVel;
    this.characterAcc;
    this.characterA;
    this.characterB;
    this.characterC;

    this.characterMoveVel;

    this.counter;
    this.counterTarget;

    this.isRainning = false;
    this.isHumid = false;
};

Character.prototype.setup = function()
{
    this.characterA = loadImage("CharacterA.png");
    this.characterB = loadImage("CharacterB.png");
    this.characterC = loadImage("CharacterC.png");

    this.reset();
};

Character.prototype.getEvent = function(_isRainning, _isHumid)
{
    this.isRainning = _isRainning;
    this.isHumid = _isHumid;
};

Character.prototype.update = function()
{   
    //make it jump
    if(this.counter > this.counterTarget){
        this.characterVelTarget = -7;
        this.characterMoveVel   = Math.random() * 6 - 3;
        this.characterVel.y = this.characterVelTarget;
        this.counter = 0;
    }

    //set gravity
    this.characterAcc.y = 1;

    this.characterVel.add(this.characterAcc);
    this.characterLoc.add(this.characterVel);
    //make it walk
    this.characterLoc.x += this.characterMoveVel;

    //make it stay on the ground
    if(this.characterLoc.x < 0 || this.characterLoc.x > window.innerWidth - this.characterSize.x){
        this.characterMoveVel *= -1;
    }
    if(this.characterLoc.y > window.innerHeight - this.characterSize.y){
        this.characterLoc.y = window.innerHeight - this.characterSize.y;

        //make series of jump 
        this.characterVelTarget *= 0.76;
        this.characterMoveVel *= 0.76;
        this.characterVel.y = this.characterVelTarget;
    }

    this.characterAcc.mult(0);

    this.counter++;
};

Character.prototype.display = function()
{
    push();
    {
        translate(this.characterLoc.x, this.characterLoc.y);
        if(this.isRainning){
            image(this.characterA, 0, 0, this.characterSize.x, this.characterSize.y);
        } else if(this.isHumid) {
            image(this.characterC, 0, 0, this.characterSize.x, this.characterSize.y);
        } else {
            image(this.characterB, 0, 0, this.characterSize.x, this.characterSize.y);
        }
    }
    pop();
};

Character.prototype.reset = function()
{
    var sizeFactor = Math.random() * 0.05 + 0.07;
    this.characterSize = new p5.Vector(400 * sizeFactor, 550 * sizeFactor);  
    this.characterLoc = new p5.Vector(0, 0);
    this.characterVel = new p5.Vector(0, 0);
    this.characterVelTarget = 0;
    this.characterAcc = new p5.Vector(0, 0);

    this.characterMoveVel = 0;

    this.counterTarget = Math.random() * 100 + 100;
    this.counter = 0;

    //initialize rain initail pos
    this.characterLoc.x = Math.random() * window.innerWidth - (4 * this.characterSize.x) + (2 * this.characterSize.x);
    this.characterLoc.y = window.innerHeight - this.characterSize.y;
};