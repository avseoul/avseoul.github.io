var ThreePointLight = function(){
	this.shadow_buffer = new THREE.WebGLRenderTarget( 2048., 2048. );
	this.shadow_buffer.depthBuffer = true;
	this.shadow_buffer.depthTexture = new THREE.DepthTexture();
    
	var _ratio = this.shadow_buffer.width / this.shadow_buffer.height;
	this.light = new THREE.PerspectiveCamera( 35., _ratio, .1, 1000. );

	this.light.position = new THREE.Vector3(3., 3., 3.);
	this.light.lookAt = new THREE.Vector3(0., 0., 0.);
};

ThreePointLight.prototype.ziggle = function(_frame){
	var _e = _frame*10.;
    var _n_loc = new THREE.Vector3(
        this.light.position.x * Math.sin(_e),
        this.light.position.y,
        this.light.position.z * Math.cos(_e))
    
    this.light.position.copy(_n_loc);
    this.light.lookAt = new THREE.Vector3(0.,0.,0.);  

    this.light.updateProjectionMatrix(); 
};

ThreePointLight.prototype.get_light = function(){
	return this.light;
};

ThreePointLight.prototype.get_light_pos = function(){
	return this.light.position;
};

ThreePointLight.prototype.get_shadow_frame_buffer = function(){
	return this.shadow_buffer;
};

ThreePointLight.prototype.get_shadow_map = function(){
	return this.shadow_buffer.depthTexture;
};


ThreePointLight.prototype.set_light_pos = function(_val){
	this.light.position.copy(_val);
	this.light.updateProjectionMatrix();
};

ThreePointLight.prototype.set_light_lookat = function(_val){
	this.light.lookAt = _val;
	this.light.updateProjectionMatrix();
};