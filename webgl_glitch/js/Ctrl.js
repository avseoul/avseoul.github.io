var Ctrl = function(_tar, _analyzer){
	var _ctr = new dat.GUI();

	this.glitch = _tar;
	this.analyzer = _analyzer;

	this.params = {
		audio_gain: 70.
	};

	_ctr.add(this.params, 'audio_gain', 0., 500.).onChange( this.update_params.bind(this) );

    _ctr.add(_tar, 'is_hor_move')
    _ctr.add(_tar, 'is_vhs')
    _ctr.add(_tar, 'is_subtle')
    _ctr.add(_tar, 'is_intense')
    _ctr.add(_tar, 'is_bad_signals')
};

Ctrl.prototype.update_params = function(){
	this.analyzer.set_gain(this.params.audio_gain);
};