var Ctrl = function(_analyzer){
	var _ctr = new dat.GUI();

	this.analyzer = _analyzer;

	this.params = {
		audio_gain: 70.,
		show_fps: true
	};

	_ctr.add(this.params, 'audio_gain', 0., 500.).onChange( this.update_params.bind(this) );
	_ctr.add(this.params, 'show_fps').onFinishChange( this.update_params.bind(this) );


    // dat.GUI.toggleHide();
    this.update_params();
};

Ctrl.prototype.update_params = function(){
	this.analyzer.set_gain(this.params.audio_gain);
	
	document.getElementById('stats').style['display'] = this.params.show_fps ? 'block' : 'none';
};