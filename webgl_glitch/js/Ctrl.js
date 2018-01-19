var Ctrl = function(_tar, _analyzer){
	var _ctr = new dat.GUI();

	this.glitch = _tar;
	this.analyzer = _analyzer;

	this.params = {
		audio_gain: 70.
	};

	_ctr.add(this.params, 'audio_gain', 0., 500.).onChange( this.update_params.bind(this) );

    _ctr.add(_tar, 'master_ziggle').onChange( _tar.update_triggers.bind(_tar) );
    _ctr.add(_tar, 'monochrome').onChange( _tar.update_triggers.bind(_tar) );
    _ctr.add(_tar, 'low_wave').onChange( _tar.update_triggers.bind(_tar) );
    _ctr.add(_tar, 'high_wave').onChange( _tar.update_triggers.bind(_tar) );
    _ctr.add(_tar, 'bad_signals').onChange( _tar.update_triggers.bind(_tar) );
    _ctr.add(_tar, 'VHS').onChange( _tar.update_triggers.bind(_tar) );
};

Ctrl.prototype.update_params = function(){
	this.analyzer.set_gain(this.params.audio_gain);
};