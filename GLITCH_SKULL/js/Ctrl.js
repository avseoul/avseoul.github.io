// need datgui lib & threejs lib

var Ctrl = function(_audio){
	this.params = {
		audio_gain: 1000.,
		show_fps: false
	}
	
	var _ctr = new dat.GUI();

	this.audio = _audio;

    _ctr.add(this.params, 'audio_gain', 0., 1000.);
    _ctr.add(this.params, 'show_fps').onFinishChange( this.update_params.bind(this) );

    this.update_params();

    // dat.GUI.toggleHide();
};

Ctrl.prototype.update_params = function(){
	this.audio.set_gain(this.params.audio_gain);
	document.getElementById('stats').style['display'] = this.params.show_fps ? 'block' : 'none';
};
