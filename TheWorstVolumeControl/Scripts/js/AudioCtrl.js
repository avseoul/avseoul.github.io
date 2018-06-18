var AudioCtrl = function()
{
	this.audio;
	this.volume = 0.0;
	this.pVolume = 0.0;
	this.volumeTarget = 0.0;

	this.isActive = true;

	this.indicator = document.getElementById("masterVolume");
}

AudioCtrl.prototype.init = function(audioUrl)
{
	this.audio = new Audio(audioUrl);
	this.audio.loop = true;

	this.popAlert(true);
}

AudioCtrl.prototype.update = function()
{	
	if(Math.abs(this.volumeTarget - this.volume) > 0.001)
	{
		this.volume += (this.volumeTarget - this.volume) * 0.05;
	} 
	else
	{
		this.volume = this.volumeTarget;
	}

	// status 
	if(this.volumeTarget == this.volume)
	{
		if(this.isActive)
		{
			this.isActive = false;
			console.log("[AudioCtrl] : is de-active");
		}
	}
	else
	{
		if(!this.isActive)
		{
			this.isActive = true;
			console.log("[AudioCtrl] : is active");
		}
	}

	// safety
	this.volume = Math.max(Math.min(this.volume, 1.0), 0.0);

	if(this.pVolume != this.volume)
	{
		var r = Math.round(250 * (1.-this.volume));
		var g = Math.round(10 * (1.-this.volume) + 200 * this.volume);
		var b = Math.round(56 * (1.-this.volume) + 256 * this.volume);
		var color = "rgb(" + r + ", " + g + ", " + b + ")";

		// update dom
		this.indicator.innerHTML = 
			"Volume : <span style=\"color:" + color + ";\">" + ((this.volume * 100.0).toFixed(0)).toString() + "%</span>";

		// update audio dom
		this.audio.volume = this.volume;
	}

	this.pVolume = this.volume;
}

AudioCtrl.prototype.popAlert = function(state)
{
	var popUp = document.getElementById("PermissionPopUp");
	popUp.style["visibility"] = state ? "visible" : "hidden";
}

AudioCtrl.prototype.confirmAlert = function()
{	
	this.audio.volume = this.volume;
	this.playTrack();
	this.popAlert(false);

	console.log("[AudioCtrl] : user confirmed - playing audio");
}

AudioCtrl.prototype.playTrack = function()
{
	this.audio.play();
}

AudioCtrl.prototype.setVolumeTarget = function(val)
{
	this.volumeTarget = val;
}
