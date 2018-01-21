var VideoStream = function(_w, _h, _callback){
	var constraints = { audio: false, video: {width: _w, height:_h} }; 
	this.video = document.createElement("video");
	// document.body.appendChild(this.video);

	navigator.mediaDevices.getUserMedia(constraints)
	.then( function(mediaStream) {
		this.video.srcObject = mediaStream;
		
		this.video.onloadedmetadata = function(e) {
			this.video.play();
			_callback(this.video);
		}.bind(this);
	}.bind(this)).catch(function(err) { console.log(err.name + ": " + err.message); }); // always check for errors at the end.
};