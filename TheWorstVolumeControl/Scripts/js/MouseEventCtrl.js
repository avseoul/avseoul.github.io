var bMouseX = 0, bMouseY = 0;
var mouseX = 0, mouseY = 0;
var pMouseX = 0, pMouseY = 0;
var mouseDeltaX = 0, mouseDeltaY = 0;

var isMouseDown = false;

var mouseDown = function(isTouch, evt)
{
	evt.preventDefault();
	
	var handler = isTouch ? evt.changedTouches[0] : evt;

	isMouseDown = true;

	mouseX = handler.clientX;
	mouseY = handler.clientY;

	bMouseX = mouseX;
	bMouseY = mouseY;
}

var mouseMove = function(isTouch, evt)
{
	evt.preventDefault();

	var handler = isTouch ? evt.changedTouches[0] : evt;

	mouseX = handler.clientX;
	mouseY = handler.clientY;

	mouseDeltaX = mouseX - pMouseX;
	mouseDeltaY = mouseY - pMouseY;

	pMouseX = mouseX;
	pMouseY = mouseY;
}

var mouseUp = function(isTouch, evt)
{
	evt.preventDefault();

	var handler = isTouch ? evt.changedTouches[0] : evt;

	mouseDeltaX = 0;
	mouseDeltaY = 0;

	mouseX = handler.clientX;
	mouseY = handler.clientY;

	isMouseDown = false;
}

var calcMouseAngle = function(originX, originY)
{
	var	rad = bMouseX < originX ?
			Math.atan2(originY - mouseY, originX - mouseX) :
			Math.atan2(mouseY - originY, mouseX - originX);

	return rad * 180 / Math.PI;
}

document.addEventListener("mousedown", mouseDown.bind(this, false), false);
document.addEventListener("mousemove", mouseMove.bind(this, false), false);
document.addEventListener("mouseup", mouseUp.bind(this, false), false);

window.addEventListener("touchstart", mouseDown.bind(this, true), false);
window.addEventListener("touchmove", mouseMove.bind(this, true), false);
window.addEventListener("touchend", mouseUp.bind(this, true), false);