var NoseHairJoint = function(x, y)
{
	this.x = x;
	this.y = y;

	this.velX = 0.0;
	this.velY = 0.0;

	this.damping = Math.random() * 0.03 + 0.9;
	this.timeStep = 0.02;

	this.mass = Math.random() * 5.0 + 5.0;
}

NoseHairJoint.prototype.addMouseEvent = function(x, y) 
{
	this.x = x;
	this.y = y;

	this.velX *= 0.0;
	this.velY *= 0.0;
}

NoseHairJoint.prototype.update = function() 
{
	this.x += this.velX * this.timeStep;
	this.y += this.velY * this.timeStep;

	this.velX *= this.damping;
	this.velY *= this.damping;
}

NoseHairJoint.prototype.addForce = function(x, y)
{
	this.velX += x * this.mass;
	this.velY += y * this.mass;
}

