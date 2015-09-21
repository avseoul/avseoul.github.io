var btn = function(_x, _y){
	this.backColor = new p5.Vector(77., 216., 101.);
	this.backColorB = new p5.Vector(77., 216., 101.);
	// this.backColorR = new p5.Vector(205., 107., 106.);
	// this.backColorR = new p5.Vector(255., 83., 90.);
	this.backColorR = new p5.Vector(255., 255., 255.);
	this.backSize = new p5.Vector(26., 18.);
	this.backRadius = 100.;

	this.position = new p5.Vector(_x * this.backSize.x + 1.*_x, _y * this.backSize.y + 1.*_y);

	this.btnRadius = 16.;
	this.btnRTarget = 17.;
	this.btnRRoot = 16.;
	this.btnPosition = new p5.Vector(this.btnRadius * .65, this.backSize.y * .5 + 1.0);
	this.btnPositionL = new p5.Vector(this.btnRadius * .65, this.backSize.y * .5 + 1.5);
	this.btnPositionR = new p5.Vector(this.btnRadius * 1.1, this.backSize.y * .5 + 1.0);

	this.isHit = true;

};

btn.prototype.update = function(){
	if(this.isHit == true){
		this.backColor = this.backColorB;
		this.btnPosition = this.btnPositionR;
	} else {
		this.backColor = this.backColorR;
		this.btnPosition = this.btnPositionL;
	}
};

btn.prototype.draw = function(){
	push();
	{
		translate(this.position.x, this.position.y);

		strokeWeight(1);

		//draw btn background
		if(this.isHit == true){
			noStroke();
			fill(this.backColor.x, this.backColor.y, this.backColor.z);
		} else {
			stroke(220.);
			fill(250);
		}
		
		rect(1, 1, this.backSize.x, this.backSize.y, this.backRadius);

		//draw btn button 
		if(this.isHit == true){
			noStroke();
			this.btnRadius = this.btnRRoot;
		} else {
			stroke(230.);
			this.btnRadius = this.btnRTarget;
		}
		fill(255.);
		ellipse(this.btnPosition.x, this.btnPosition.y, this.btnRadius, this.btnRadius);
	}
	pop();
};


