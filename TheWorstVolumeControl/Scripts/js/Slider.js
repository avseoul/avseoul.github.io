var Slider = function()
{
	this.handleLoc = 0;
	
	this.isActive = false;
	this.isValidClick = false;

	this.clickHandleLoc = 0;
	this.clickLoc = 0;
	this.clickForce = 0;
	
	this.force = 0;
	
	this.angle = 0;
	this.maxAngle = 20;
	this.angleForce = 0;

	this.centerX = 0;
	this.centerY = 0;

	this.isHandlerLMove = false;
	this.isHandlerRMove = false;

	this.buildSlider();
}

Slider.prototype.buildSlider = function()
{
	// create
	this.ui_bg = document.createElement("div");
	this.ui_handlerL = document.createElement("div");
	this.ui_handlerR = document.createElement("div");
	this.ui_rail = document.createElement("div");
	this.ui_handle = document.createElement("div");
	this.ui_spring = document.createElement("div"); 

	// class
	this.ui_bg.className = "slider_bg";
	this.ui_handlerL.className = "slider_handler L";
	this.ui_handlerR.className = "slider_handler R";
	this.ui_rail.className = "slider_rail";
	this.ui_handle.className = "slider_handle";
	this.ui_spring.className = "slider_spring";

	// hierarchy
	this.ui_rail.appendChild(this.ui_handle);
	this.ui_rail.appendChild(this.ui_handlerL);
	this.ui_rail.appendChild(this.ui_handlerR);
	this.ui_rail.appendChild(this.ui_spring);
	this.ui_bg.appendChild(this.ui_rail);		
	document.body.appendChild(this.ui_bg);

	// event listener
	this.ui_handle.addEventListener("mousedown", this.triggerHandle.bind(this, true, "self"), false);
	this.ui_handle.addEventListener("touchstart", this.triggerHandle.bind(this, true, "self"), false);

	this.ui_handlerL.addEventListener("mousedown", this.triggerHandler.bind(this, "L"), false);
	this.ui_handlerL.addEventListener("touchstart", this.triggerHandler.bind(this, "L"), false);
	this.ui_handlerR.addEventListener("mousedown", this.triggerHandler.bind(this, "R"), false);
	this.ui_handlerR.addEventListener("touchstart", this.triggerHandler.bind(this, "R"), false);

	// get variables from css
	this.railWidth = parseFloat(getComputedStyle(this.ui_rail, null).getPropertyValue("width"));
	this.handleWidth = parseFloat(getComputedStyle(this.ui_handle, null).getPropertyValue("width"));
	this.handleLocMin = -this.handleWidth * .5; 
	this.handleLocMax = this.railWidth + this.handleLocMin;
}

Slider.prototype.connect = function(monkey)
{
	this.monkey = monkey;
}

Slider.prototype.triggerHandler = function(type, evt)
{
	evt.preventDefault();

	this.bgInitialWidth = parseFloat(getComputedStyle(this.ui_bg, null).getPropertyValue("width"));
	this.bgInitialHeight = parseFloat(getComputedStyle(this.ui_bg, null).getPropertyValue("height"));
	this.bgInitialTop = parseFloat(getComputedStyle(this.ui_bg, null).getPropertyValue("top"));
	this.bgInitialLeft = parseFloat(getComputedStyle(this.ui_bg, null).getPropertyValue("left"));

	this.railInitialWidth = parseFloat(getComputedStyle(this.ui_rail, null).getPropertyValue("width"));
	this.railInitialTop = parseFloat(getComputedStyle(this.ui_rail, null).getPropertyValue("top"));
	this.railinitialLeft = parseFloat(getComputedStyle(this.ui_rail, null).getPropertyValue("left"));

	this.centerX = this.bgInitialLeft + this.bgInitialWidth * .5;
	this.centerY = this.bgInitialTop + this.bgInitialHeight * .5;

	this.initialHandleLoc = this.handleLoc;
	
	this.handlerStartX = mouseX;
	this.handlerStartY = mouseY;

	if(type === "L")
	{
		this.isHandlerLMove = true;

		console.log("[Slider] : hanlder L is active");
	}
	
	if(type === "R")
	{
		this.isHandlerRMove = true;

		console.log("[Slider] : hanlder R is active");
	}
}

Slider.prototype.updateHandler = function()
{

	if(!isMouseDown)
	{
		if(this.isHandlerLMove || this.isHandlerRMove)
		{
			this.isHandlerLMove = false;
			this.isHandlerRMove = false;

			console.log("[Slider] : hanlders L&R are deactivated");
			
			this.triggerHandle(true, "triggerHandler");
		}
	}

	if(this.isHandlerLMove || this.isHandlerRMove)
	{
		var mdx = (mouseX - this.handlerStartX);
		
		var rw = this.railInitialWidth + (this.isHandlerLMove ? -mdx : mdx);
		var offset = 0;

		if(rw <= 50) offset = 50 - rw;

		this.angle = calcMouseAngle(this.centerX, this.centerY);
		this.angle = Math.max(Math.min(this.angle, this.maxAngle), -this.maxAngle);
		this.angleForce = this.angle / this.maxAngle;
		
		if(this.isHandlerLMove)
		{
			if(offset == 0)
			{
				// rotate
				{
					this.ui_bg.style["transform"] = "rotate(" + this.angle.toString() + "deg)";
				}

				// rail
				this.ui_rail.style["width"] = (this.railInitialWidth - mdx).toString() + "px";

				// bg
				this.ui_bg.style["width"] = (this.bgInitialWidth - mdx).toString() + "px";
				this.ui_bg.style["left"] = (this.bgInitialLeft + mdx).toString() + "px";

				// handle
				this.handleLoc -= mouseDeltaX;
			}
		}

		if(this.isHandlerRMove) // R
		{
			// rotate
			{
				this.ui_bg.style["transform"] = "rotate(" + this.angle.toString() + "deg)";
			}

			// rail
			this.ui_rail.style["width"] = (this.railInitialWidth + mdx + offset).toString() + "px";

			// bg
			this.ui_bg.style["width"] = (this.bgInitialWidth + mdx + offset).toString() + "px";

			// handle
		}

		this.railWidth = parseFloat(getComputedStyle(this.ui_rail, null).getPropertyValue("width"));
		
		this.handleLocMin = -this.handleWidth * .5; 
		this.handleLocMax = this.railWidth + this.handleLocMin;
		
		this.updateHandle();
	}
}

Slider.prototype.updateSpringGauze = function()
{
	if(this.isValidClick)
	{
		var dir = this.clickHandleLoc - this.handleLoc;
		var anchor = this.clickHandleLoc / this.railWidth;
		var target = this.handleLoc / this.railWidth;  
		var l = ((dir > 0 ? target : anchor) * 100.).toString() + "%";  
		var r = ((dir > 0 ? 1.-anchor : 1.-target) * 100.).toString() + "%";
				
		var clip = "inset(0 " + r + " 0 " + l + ")";

		this.ui_spring.style["clip-path"] = clip; 
		this.ui_spring.style["-webkit-clip-path"] = clip; 
		
		this.ui_spring.style["background-color"] = dir < 0 ? "rgb(250, 10, 56)" : "rgb(0, 200, 256)";
	}
	else
	{
		if(this.ui_spring.style["background-color"] !== "none")
		{
			this.ui_spring.style["background-color"] = "transparent";
		}
		else
		{
			return;
		}
	}
}

Slider.prototype.triggerHandle = function(isDown, from)
{
	if(isDown)
	{
		this.monkey.rest(this.volume, "slider");

		if(from === "self")
		{
			this.clickHandleLoc = this.handleLoc;
			this.clickLoc = mouseX - this.clickHandleLoc;

			this.isValidClick = true;

			this.force *= 0;

			console.log("[Slider] : force is activated");
		}
	}

	if(this.isActive != isDown)
	{
		console.log("[Slider] : is triggerred " + (isDown ? "active" : "de-active") + "from [" + from + "]");
		this.isActive = isDown;
	}
}

Slider.prototype.updateHandleLoc = function()
{
	if(this.isValidClick)
	{
		this.handleLoc = mouseX - this.clickLoc;
		this.clickForce = this.clickLoc - (mouseX - this.clickHandleLoc);
	}

	this.updateHandle();
}

Slider.prototype.updateForce = function()
{
	this.force += this.angleForce * 20.;
	this.angleForce *= .99;

	if(!isMouseDown)
	{
		if(this.clickForce != 0)
		{
			this.force += this.clickForce;
			this.clickForce *= 0.;
		}
	}

	if(Math.abs(this.force) > 0.1)
	{
		this.handleLoc += this.force * .1;
	
		this.force *= .96;

		if(this.handleLoc < this.handleLocMin || this.handleLoc > this.handleLocMax)
			this.force *= -0.6;

		this.updateHandle();
	}
	else
	{
		this.force = 0;
	}
}

Slider.prototype.updateHandle = function()
{
	// clamp 
	this.handleLoc = Math.max(Math.min(this.handleLoc, this.handleLocMax), this.handleLocMin);

	this.ui_handle.style["left"] = this.handleLoc.toString() + "px";

	this.calcVolume();
}

Slider.prototype.calcVolume = function()
{
	this.volume = (this.handleLoc + this.handleWidth * .5) / this.railWidth;
}

Slider.prototype.setVolume = function(val)
{	
	this.volume = val;
	this.handleLoc = (this.volume * this.railWidth) - this.handleWidth * .5; 

	this.updateHandle();
}

Slider.prototype.update = function()
{
	this.updateHandler();

	if(this.isActive) 
	{
		if(isMouseDown)
		{	
			this.updateHandleLoc();
		}
		else
		{
			if(this.isValidClick)
			{
				this.isValidClick = false;

				console.log("[Slider] : force is de-activated");
			}
		}
		this.updateSpringGauze();
		this.updateForce();
	}
}