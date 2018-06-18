var mCanvas, mCtx;

var initCanvas = function()
{  
	mCanvas = document.getElementById("Canvas"); 
	mCtx = mCanvas.getContext("2d");

	setCanvasSize();
}

var setCanvasSize = function()
{
	mCanvas.width = mCanvas.clientWidth;
	mCanvas.height = mCanvas.clientHeight;
}

var clearCanvas = function()
{
	mCtx.clearRect(0, 0, mCanvas.width, mCanvas.height);
}
