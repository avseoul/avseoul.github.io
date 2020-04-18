let Ctrl = function(_blob, _audio){
	this.params = {
		audio_gain: 70.
	}
	
	const scene = new dat.GUI();

	this.audio = _audio;

    scene.add(this.params, 'audio_gain', 0., 500.).onChange( this.update_params.bind(this) );
    scene.add(this.audio, 'isPulse');

    this.update_params();
};

Ctrl.prototype.update_params = function(){	
	this.audio.set_gain(this.params.audio_gain);
};
