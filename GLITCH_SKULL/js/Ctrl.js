// need datgui lib & threejs lib

var Ctrl = function(_audio){
	this.params = {
		audio_gain: 70.
	}
	
	var _ctr = new dat.GUI();

	this.audio = _audio;

    _ctr.add(this.params, 'audio_gain', 0., 1000.);

    this.update_params();

    // dat.GUI.toggleHide();
};

Ctrl.prototype.update_params = function(){
	this.audio.set_gain(this.params.audio_gain);
};
