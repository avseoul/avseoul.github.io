var MonkeyVol = function(lx, ly, rx, ry)
{
	this.noseLx = lx;
	this.noseLy = ly;

	this.noseRx = rx;
	this.noseRy = ry;

	this.volume = 0;
	this.volumeTarget = 1;
	this.status = 0;

	this.isActive = true;

	this.hairL = new NoseHair(lx, ly, 0);
	this.hairR = new NoseHair(rx, ry, 1);

	this.faceGauge = document.getElementById("MV_gauge");
	this.faceHover = document.getElementById("MV_faceHover");
	this.faceTrigger = document.getElementById("MV_faceTrigger");
	this.faceIdle = document.getElementById("MV_faceIdle");
	this.faceEyeL = document.getElementById("MV_eyeL");
	this.faceEyeR = document.getElementById("MV_eyeR");

	this.faceEyeInitialTop = parseFloat(getComputedStyle(this.faceEyeL, null).getPropertyValue("top"));
	this.faceEyeLInitialLeft = parseFloat(getComputedStyle(this.faceEyeL, null).getPropertyValue("left"));
	this.faceEyeRInitialLeft = parseFloat(getComputedStyle(this.faceEyeR, null).getPropertyValue("left"));

	this.faceEyeLCenterX = this.faceEyeL.getBoundingClientRect().left + 9;
	this.faceEyeRCenterX = this.faceEyeR.getBoundingClientRect().left + 9;
	this.faceEyeCenterY = this.faceEyeR.getBoundingClientRect().top + 9;

	this.domBody = document.body;
}

MonkeyVol.prototype.connect = function(slider)
{
	this.slider = slider; 
}

MonkeyVol.prototype.rest = function(val, from)
{
	this.volumeTarget = val;

	if(this.isActive)
	{
		console.log("[MonkeyVol] : is de-active from [" + from + "]");
		this.isActive = false;
	}
}

MonkeyVol.prototype.calcVolume = function()
{
	var pullForce = 0.005;
	var popForce = 0.2;

	var fFactorL = this.hairL.totalLength / this.hairL.threshold;
	var fFactorR = this.hairR.totalLength / this.hairR.threshold;

	// pulling
	if(this.hairL.isDown && !this.hairL.isPopOut)
		this.volumeTarget -= pullForce * fFactorL;

	if(this.hairR.isDown && !this.hairR.isPopOut)
		this.volumeTarget += pullForce * fFactorR;

	// pop out
	if(this.hairL.popCounter == 1)
		this.volumeTarget -= popForce;

	if(this.hairR.popCounter == 1)
		this.volumeTarget += popForce;

	this.volumeTarget = Math.max(Math.min(this.volumeTarget, 1.0), 0.0);
}

MonkeyVol.prototype.calcActiveHair = function()
{
	this.hairL.isDiscard = false;
	this.hairR.isDiscard = false;

	if(this.hairL.isHover)
	{	
		this.hairR.isDiscard = true;
	}
	
	if(this.hairR.isHover)
	{
		this.hairL.isDiscard = true;
	}
}

MonkeyVol.prototype.swapCursor = function()
{
	var cursor = "auto";
	if(this.hairL.isHover || this.hairR.isHover)
		cursor = "-webkit-grab";
	
	if(this.hairL.isDown || this.hairR.isDown)
		cursor = "-webkit-grabbing";

	if(cursor != this.domBody.style["cursor"])
	{
		this.domBody.style["cursor"] = cursor;
	}
}

MonkeyVol.prototype.calcStatus = function()
{
	if(this.hairL.isDown || this.hairR.isDown)
	{
		if(!this.isActive)
		{	
			console.log("[MonkeyVol] : is active");
			this.isActive = true;
			this.slider.triggerHandle(false, "monkey");
		}

		if(this.hairL.isPopOut || this.hairR.isPopOut)
		{
			this.status = 2;

			this.faceHover.style["visibility"] = "hidden";
			this.faceTrigger.style["visibility"] = "visible";
		}
		else
		{
			this.status = 1;

			this.faceHover.style["visibility"] = "visible";
			this.faceTrigger.style["visibility"] = "hidden";
		}
	}
	else
	{
		this.status = 0;

		this.faceHover.style["visibility"] = "hidden";
		this.faceTrigger.style["visibility"] = "hidden";
	}
}

MonkeyVol.prototype.setNosePos = function(lx, ly, rx, ry)
{
	this.noseLx = lx;
	this.noseLy = ly;

	this.noseRx = rx;
	this.noseRy = ry;
}

MonkeyVol.prototype.updateGauge = function()
{
	var vol = ((1.0 - this.volume) * 100.0).toString();
	var gauge = "inset(" + vol + "% 0 0 0)";

	{ // monkey
		if(gauge != this.faceGauge.style["clip-path"])
		{
			this.faceGauge.style["clip-path"] = gauge;
			this.faceGauge.style["-webkit-clip-path"] = gauge;

			var mono = "grayscale(" + vol + "%)";			
			this.faceTrigger.style["filter"] = mono;
			this.faceTrigger.style["-webkit-filter"] = mono;
			this.faceHover.style["filter"] = mono;
			this.faceHover.style["-webkit-filter"] = mono;
			this.faceIdle.style["filter"] = mono;
			this.faceIdle.style["-webkit-filter"] = mono;
		}
	}
}

MonkeyVol.prototype.updateEyeMove = function()
{
	var radius = 20;

	// L
	var x = mouseX - this.faceEyeLCenterX;
	var y = mouseY - this.faceEyeCenterY;
	var mag = Math.sqrt(x*x+y*y);
	x = (x / mag) * radius;
	y = (y / mag) * radius;

	this.faceEyeL.style["top"] = (this.faceEyeInitialTop + y).toString() + "px";
	this.faceEyeL.style["left"] = (this.faceEyeLInitialLeft + x).toString() + "px";

	// R
	x = mouseX - this.faceEyeRCenterX;
	mag = Math.sqrt(x*x+y*y);
	x = (x / mag) * radius;

	this.faceEyeR.style["top"] = (this.faceEyeInitialTop + y).toString() + "px";
	this.faceEyeR.style["left"] = (this.faceEyeRInitialLeft + x).toString() + "px";
}

MonkeyVol.prototype.render = function(curFrame, masterVol)
{
	this.volume = masterVol;

	this.calcStatus();
	this.calcActiveHair();
	this.swapCursor();
	this.updateGauge();
	this.calcVolume();

	var statusOffsetX = 0;
	var statusOffsetY = 0;
	
	if(this.status == 1)
	{
		statusOffsetX = 2.0;
		statusOffsetY = 0;

		this.updateEyeMove();
	} 
	else if (this.status == 2)
	{
		statusOffsetX = 4.0;
		statusOffsetY = 6.0;	
	}

	var lx = this.noseLx - statusOffsetX;
	var ly = this.noseLy - statusOffsetY;

	var rx = this.noseRx + statusOffsetX;
	var ry = this.noseRy - statusOffsetY;

	this.hairL.render(curFrame, lx, ly);
	this.hairR.render(curFrame, rx, ry);
}
