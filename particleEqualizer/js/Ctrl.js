// need datgui lib & threejs lib

var Ctrl = function(_blob, _light, _pbr){
	this.params = {
		show_hdr: false,
		debug_shadow_map: false
	}
	
	var _g = new dat.GUI();

	this.blob = _blob;
	this.light = _light;
	this.pbr = _pbr;

    _g.add(this.params, 'show_hdr').onFinishChange( this.update_params.bind(this) );
    _g.add(this.params, 'debug_shadow_map').onFinishChange( this.update_params.bind(this) );

    _g.add(this.pbr, 'normal');
    _g.add(this.pbr, 'roughness');
    _g.add(this.pbr, 'metallic');
    _g.add(this.pbr, 'exposure');
    _g.add(this.pbr, 'gamma');
};

Ctrl.prototype.update_params = function(){
	var _p = this.params;
	
	this.blob.set_hdr_bg(_p.show_hdr);
	this.blob.debug_shadow_map(_p.debug_shadow_map);
};
