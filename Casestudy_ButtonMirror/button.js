var btn = function(_x, _y){
	this.backColor = new p5.Vector(52., 100., 157.);
	this.backColorB = new p5.Vector(52., 100., 157.);
	// this.backColorR = new p5.Vector(205., 107., 106.);
	this.backColorR = new p5.Vector(205., 205., 205.);
	this.backSize = new p5.Vector(26., 18.);
	this.backRadius = 100.;

	this.position = new p5.Vector(_x * this.backSize.x, _y * this.backSize.y);

	this.btnRadius = 14.;
	this.btnPosition = new p5.Vector(this.btnRadius * .65, this.backSize.y * .5 + 1.5);
	this.btnPositionL = this.btnRadius * .65;
	this.btnPositionR = this.btnRadius * 1.4;

	this.isHit = false;

};

btn.prototype.update = function(){
	if(this.isHit == true){
		this.backColor = this.backColorB;
		this.btnPosition.x = this.btnPositionR;

		// console.log('isHit');
	} else {
		this.backColor = this.backColorR;
		this.btnPosition.x = this.btnPositionL;
	}
};

btn.prototype.draw = function(){
	push();
	{
		translate(this.position.x, this.position.y);

		strokeWeight(1.);

		//draw btn background
		fill(this.backColor.x, this.backColor.y, this.backColor.z);
		stroke(255.);
		rect(1, 1, this.backSize.x, this.backSize.y, this.backRadius);

		//draw btn button 
		fill(255.);
		stroke(235.);
		ellipse(this.btnPosition.x, this.btnPosition.y, this.btnRadius, this.btnRadius);
	}
	pop();
};


