var Ctrl = function(_tar, _analyzer){
	var _ctr = new dat.GUI();

	this.glitch = _tar;
	this.analyzer = _analyzer;

	this.params = {
		audio_gain: 70.,
		show_fps: false
	};

	_ctr.add(this.params, 'audio_gain', 0., 500.).onChange( this.update_params.bind(this) );
	_ctr.add(this.params, 'show_fps').onFinishChange( this.update_params.bind(this) );

	_ctr.add(_tar, 'image_fit_horizontal').onFinishChange( _tar.update_triggers.bind(_tar) );

    _ctr.add(_tar, 'master_ziggle').onChange( _tar.update_triggers.bind(_tar) );
    _ctr.add(_tar, 'monochrome').onChange( _tar.update_triggers.bind(_tar) );
    _ctr.add(_tar, 'ntsc_roll').onChange( _tar.update_triggers.bind(_tar) );
    _ctr.add(_tar, 'bad_signals').onChange( _tar.update_triggers.bind(_tar) );
    _ctr.add(_tar, 'VHS').onChange( _tar.update_triggers.bind(_tar) );
    _ctr.add(_tar, 'add_noise').onChange( _tar.update_triggers.bind(_tar) );
    _ctr.add(_tar, 'rgb_shifting').onChange( _tar.update_triggers.bind(_tar) );

    dat.GUI.toggleHide();
    this.update_params();
};

Ctrl.prototype.update_params = function(){
	this.analyzer.set_gain(this.params.audio_gain);
	
	document.getElementById('stats').style['display'] = this.params.show_fps ? 'block' : 'none';
};