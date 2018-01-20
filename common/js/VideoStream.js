var VideoStream = function(_callback){
	var constraints = { audio: false, video: {width: 1920, height:1080} }; 
	this.video = document.createElement("video");

	navigator.mediaDevices.getUserMedia(constraints)
	.then( function(mediaStream) {
		this.video.srcObject = mediaStream;
		
		this.video.onloadedmetadata = function(e) {
			this.video.play();
			_callback(this.video);
		}.bind(this);
	}.bind(this)).catch(function(err) { console.log(err.name + ": " + err.message); }); // always check for errors at the end.
};