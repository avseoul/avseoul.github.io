var RainSystem = function(){
    this.mRains = [];
    
    this.mNumRains = 100;
    this.mNumPlayingRains = 100;
    for(var i = 0; i < this.mNumRains; i++){
        this.mRains[i] = new Rain();
    }
};

RainSystem.prototype.getEvent = function(_mNumPlayingRains){
    this.mNumPlayingRains = _mNumPlayingRains;
    for(var i = 0; i < this.mNumPlayingRains; i++){
        this.mRains[i].getEvent(_mNumPlayingRains);
    }
};

RainSystem.prototype.update = function(){
    for(var i = 0; i < this.mNumPlayingRains; i++){
        this.mRains[i].update();
    }
};

RainSystem.prototype.display = function(){
    for(var i = 0; i < this.mNumPlayingRains; i++){
        this.mRains[i].display();
    }
};