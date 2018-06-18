// scene
var curFrame = 0;

// audio playback
var mAudio = new AudioCtrl();
var mAudioUrl = "Resources/audio/handel-farinelli-lascia_chio_pianga.mp3";
var mVolTarget = 1.0;

// monkey 
var mMonkey;
var mMonkeyVol = document.getElementById("MonkeyVol");
var mNoseLx, mNoseLy, mNoseRx, mNoseRy;
var mEyeLx, mEyeLy, mEyeRx, mEyeRy;

// slider
var mSlider;

var resize = function()
{
	setCanvasSize();
	calcMonkeyNosePos();

	mMonkey.setNosePos(mNoseLx, mNoseLy, mNoseRx, mNoseRy);
}

var calcMonkeyNosePos = function()
{
	var t = mMonkeyVol.getBoundingClientRect();

	// nose
	mNoseLx = t.x + 118;
	mNoseLy = t.y + 160;

	mNoseRx = mNoseLx + 17;
	mNoseRy = mNoseLy;
}

var setVolumeTarget = function()
{
	// update master audio
	mAudio.setVolumeTarget(mVolTarget);

	if(mMonkey.isActive)
	{
		mVolTarget = mMonkey.volumeTarget;

		mSlider.setVolume(mAudio.volume);
	} 
	else if(mSlider.isActive)
	{
		mVolTarget = mSlider.volume;

		mMonkey.rest(mVolTarget, "main")
	}  
}

var update = function(){
    requestAnimationFrame( update );
    clearCanvas();

    {
    	mAudio.update();
    	mMonkey.render(curFrame, mAudio.volume);
    	mSlider.update();
	}
    
    setVolumeTarget();

    // just temp for mouse hold
    if(isMouseDown)
    {
    	mouseDeltaX = mouseX - pMouseX;
		mouseDeltaY = mouseY - pMouseY;

    	pMouseX = mouseX;
    	pMouseY = mouseY;
	}

    curFrame++;
}

var init = function()
{
	initCanvas();
	calcMonkeyNosePos();

	{
		mAudio.init(mAudioUrl);
		mMonkey = new MonkeyVol(mNoseLx, mNoseLy, mNoseRx, mNoseRy);
		mSlider = new Slider();

		mMonkey.connect(mSlider);
		mSlider.connect(mMonkey);
	}

	update();	
	console.log("[main] : is init");
}

// event listeners
document.addEventListener("DOMContentLoaded", init, false);
window.addEventListener("resize", resize, false);
