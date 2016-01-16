var CloudSystem = function(){
    this.mClouds = [];
    
    this.mNumClouds = 50;
    this.mNumPlayingClouds = 50;
    for(var i = 0; i < this.mNumClouds; i++){
        this.mClouds[i] = new Cloud();
    }

    this.windSpeedFactor;
};

CloudSystem.prototype.setup = function(){
    for(var i = 0; i < this.mNumClouds; i++){
        this.mClouds[i].setup();
    }
};

CloudSystem.prototype.getEvent = function(_mNumPlayingClouds, _windSpeedFactor){
    this.windSpeedFactor = _windSpeedFactor;
    this.mNumPlayingClouds = _mNumPlayingClouds;
    for(var i = 0; i < this.mNumPlayingClouds; i++){
        this.mClouds[i].getEvent(this.windSpeedFactor);
    }
};

CloudSystem.prototype.update = function(){
    for(var i = 0; i < this.mNumPlayingClouds; i++){
        this.mClouds[i].update();
    }
};

CloudSystem.prototype.display = function(){
    for(var i = 0; i < this.mNumPlayingClouds; i++){
        this.mClouds[i].display();
    }
};

