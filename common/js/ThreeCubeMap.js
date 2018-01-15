var ThreeCubeMap = function(){
	var _path = "../common/assets/";
	var _format = '.jpg';
	var _urls = [
		_path + 'px_3js' + _format, _path + 'nx_3js' + _format,
		_path + 'py_3js' + _format, _path + 'ny_3js' + _format,
		_path + 'pz_3js' + _format, _path + 'nz_3js' + _format
	];
	
	this.cubemap = new THREE.CubeTextureLoader().load( _urls );
	this.cubemap.format = THREE.RGBFormat;
};

ThreeCubeMap.prototype.toggle_bnw = function(_is_bnw){
	var _path = "../common/assets/";
	var _format = '.jpg';
	var _urls = _is_bnw ? 
		[
			_path + 'px' + _format, _path + 'nx' + _format,
			_path + 'py' + _format, _path + 'ny' + _format,
			_path + 'pz' + _format, _path + 'nz' + _format
		] 
		: [
			_path + 'px_3js' + _format, _path + 'nx_3js' + _format,
			_path + 'py_3js' + _format, _path + 'ny_3js' + _format,
			_path + 'pz_3js' + _format, _path + 'nz_3js' + _format
		];

	this.cubemap = new THREE.CubeTextureLoader().load( _urls );
	this.cubemap.format = THREE.RGBFormat;
};

ThreeCubeMap.prototype.get_cubemap = function(){
	return this.cubemap;
};