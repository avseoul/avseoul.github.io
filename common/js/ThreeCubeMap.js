var ThreeCubeMap = function(){
	var _path = "../common/assets/";
	var _format = '.jpg';
	var _urls = [
		_path + 'px' + _format, _path + 'nx' + _format,
		_path + 'py' + _format, _path + 'ny' + _format,
		_path + 'pz' + _format, _path + 'nz' + _format
	];
	
	this.cubemap = new THREE.CubeTextureLoader().load( _urls );
	this.cubemap.format = THREE.RGBFormat;
};

ThreeCubeMap.prototype.get_cubemap = function(){
	return this.cubemap;
};