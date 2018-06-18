var NoseHair = function(x, y, id)
{
	this.isDown = false;
	this.isHover = false;
	this.isDiscard = false;

	this.id = id;

	this.worldX = x;
	this.worldY = y;

	this.restLenth = 1.0;
	this.springConstant = 0.5;
	this.totalLength = 0.0;
	this.threshold = 300.0;
	
	this.gravity = 0.95;
	this.osc = 0.0;

	this.isPopOut = false;
	this.popCounter = 0;
	this.isDead = false;
	this.reviveCounter = 0;
	this.reviveMaxCount = 30;

	this.numJoints = 4;
	this.joints = [];

	for(var i = 0; i < this.numJoints; i++)
		this.joints[i] = new NoseHairJoint(x, y + i * 5.0);
}

NoseHair.prototype.addMouseEvent = function(isDown, mx, my, mdx, mdy)
{
	if(!isDown)
	{
		this.isHover = false;
		this.isDown = false;
	}

	if(!this.isDiscard)
	{
		for(var i = 0; i < this.numJoints; i++)
		{
			var i = this.numJoints - 1;
			var dx = mx - this.joints[i].x - mdx;
			var dy = my - this.joints[i].y - mdy;
			var dist = Math.sqrt(dx*dx + dy*dy);
	
			// drag event
			if(dist < 13.0 )
			{
				this.isHover = true;
				
				if(isDown)
				{
					this.isDown = true;
				}
			}
		}
	
		if(this.isDown)
			this.joints[this.numJoints-1].addMouseEvent(mx, my);
	}
}

NoseHair.prototype.calcForward = function()
{
	// the first joint will be a fixed anchor following nose
	this.joints[0].x = this.worldX;
	this.joints[0].y = this.worldY;

	var sc = this.springConstant;
	var rl = this.restLenth;
	var g = this.gravity + this.osc;

	for(var i = 1; i < this.numJoints; i++)
	{
		// add gravity 
		this.joints[i].addForce(0, g);

		// srping
		var anchor = this.joints[i-1];
		var target = this.joints[i]; 
		
		var xGap = target.x - anchor.x;
		var yGap = target.y - anchor.y;

		var xDir = Math.sign(xGap);
		var yDir = Math.sign(yGap);

		var xForce = -1.0 * xDir * (Math.abs(xGap) - rl) * sc;
		var yForce = -1.0 * yDir * (Math.abs(yGap) - rl) * sc;

		this.joints[i-1].addForce(-xForce, -yForce);
		this.joints[i].addForce(xForce, yForce);

		if(this.isDown && i == this.numJoints-1) break;

		this.joints[i].update();
	}
}

NoseHair.prototype.calcBackward = function()
{
	for(var i = 0; i < this.numJoints - 1; i++)
	{
		var sc = this.springConstant * 5.0;
		var rl = this.restLenth;
		var g = this.gravity * 2.0;

		// add gravity 
		this.joints[i].addForce(0.0, g);

		// srping
		var anchor = this.joints[i+1];
		var target = this.joints[i]; 
		
		var xGap = target.x - anchor.x;
		var yGap = target.y - anchor.y;

		var xDir = Math.sign(xGap);
		var yDir = Math.sign(yGap);

		var xForce = -1.0 * xDir * (Math.abs(xGap) - rl) * sc;
		var yForce = -1.0 * yDir * (Math.abs(yGap) - rl) * sc;

		if(i < this.numJoints-2)
			this.joints[i+1].addForce(-xForce, -yForce);

		this.joints[i].addForce(xForce, yForce);

		this.joints[i].update();
	}
}

NoseHair.prototype.checkLength = function()
{
	this.totalLength = 0;

	for(var i = 1; i < this.numJoints; i++)
	{
		var dx = this.joints[i].x - this.joints[i-1].x;
		var dy = this.joints[i].y - this.joints[i-1].y;
		var dist = Math.sqrt(dx*dx + dy*dy); 
		
		this.totalLength += dist; 
	}

	return this.totalLength > this.threshold ? true : false; 
}

NoseHair.prototype.revive = function()
{
	this.isPopOut = false;
	this.isDead = false;
	this.reviveCounter = 0;
	this.popCounter = 0;

	for(var i = 0; i < this.numJoints; i++)
		this.joints[i] = new NoseHairJoint(this.worldX, this.worldY + i * 1.0);
}

NoseHair.prototype.render = function(curFrame, x, y)
{
	// update world position
	this.worldX = x;
	this.worldY = y;

	this.update(curFrame);

	// render hair
	if(!this.isDead)
		this.draw();
}

NoseHair.prototype.update = function(curFrame) 
{
	this.addMouseEvent(isMouseDown, mouseX, mouseY, mouseDeltaX, mouseDeltaY);

	// check total length
	if(this.isDown && !this.isPopOut)
	{ 
		 this.isPopOut = this.checkLength();
	}

	this.osc = Math.sin(this.id * 123.456 + curFrame * 0.1) * 0.2;

	// update spring behaviours 
	if(this.isPopOut)
	{
		this.popCounter++;

		if(this.isDown)
		{
			this.calcBackward();
		}
		else
		{
			this.isDead = true;

			this.reviveCounter++;

			if(this.reviveCounter >= this.reviveMaxCount)
				this.revive();
		}
	}
	else
	{
		this.calcForward();
	}
}

NoseHair.prototype.draw = function()
{
	// set line color
	var gradient = mCtx.createLinearGradient(
		this.joints[0].x, this.joints[0].y, 
		this.joints[this.numJoints-1].x, this.joints[1].y);
	
	var tipCol = this.id == 0 ? "rgb(250, 10, 56)" : "rgb(0, 200, 256)";
	var rootCol = this.isPopOut ? tipCol : "black";

	gradient.addColorStop(0, rootCol);
	gradient.addColorStop(1, tipCol);

	mCtx.beginPath();
	mCtx.lineWidth = 5;
	mCtx.lineCap = "round";
	mCtx.moveTo(this.joints[0].x, this.joints[0].y);

	for(var i = 1; i < this.numJoints; i++)
	{
		mCtx.strokeStyle = gradient;
		mCtx.lineTo(this.joints[i].x, this.joints[i].y);
	}
	mCtx.stroke();

	// head
	mCtx.beginPath();
	mCtx.fillStyle = gradient;
	mCtx.arc(this.joints[this.numJoints-1].x, this.joints[this.numJoints-1].y, 6, 0, 2*Math.PI);
	mCtx.fill();
}