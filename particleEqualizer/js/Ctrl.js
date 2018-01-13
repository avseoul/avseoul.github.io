// need datgui lib & threejs lib

var Ctrl = function(_blob, _light, _pbr){
	this.params = {
		show_hdr: true,
		debug_shadow_map: false,
		cam_ziggle: true,
		light_ziggle: true,
		light_posx: 0,
		light_posy: 0,
		light_posz: 0 
	}
	
	var _g_blob = new dat.GUI();
	var _g_scene = new dat.GUI();

	this.blob = _blob;
	this.light = _light;
	this.pbr = _pbr;

    _g_scene.add(this.params, 'show_hdr').onFinishChange( this.update_params.bind(this) );
    _g_scene.add(this.params, 'debug_shadow_map').onFinishChange( this.update_params.bind(this) );

    _g_scene.add(this.params, 'cam_ziggle');
    _g_scene.add(this.params, 'light_ziggle');

    _g_scene.add(this.params, 'light_posx', -100., 100.).onChange( this.update_params.bind(this) );
    _g_scene.add(this.params, 'light_posy', -100., 100.).onChange( this.update_params.bind(this) );
    _g_scene.add(this.params, 'light_posz', -100., 100.).onChange( this.update_params.bind(this) );

    _g_blob.add(this.pbr, 'normal', 0., 5.);
    _g_blob.add(this.pbr, 'roughness', 0., 1.);
    _g_blob.add(this.pbr, 'metallic', 0., 10.);
    _g_blob.add(this.pbr, 'exposure', 0., 20.);
    _g_blob.add(this.pbr, 'gamma', 0., 10.);

    this.update_params();
};

Ctrl.prototype.update_params = function(){
	var _p = this.params;
	
	this.blob.set_hdr_bg(_p.show_hdr);
	this.blob.debug_shadow_map(_p.debug_shadow_map);

	this.light.set_light_pos( new THREE.Vector3(_p.light_posx, _p.light_posy, _p.light_posz) );
};
