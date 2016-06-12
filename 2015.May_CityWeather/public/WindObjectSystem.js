var WindObjectSystem = function(){
    this.mObjects = [];
    
    this.mNumObjects = 100;
    this.mNumPlayingObjects = 100;
    for(var i = 0; i < this.mNumObjects; i++){
        this.mObjects[i] = new WindObject();
    }

    this.speedFactor;
};

WindObjectSystem.prototype.setup = function(){
    for(var i = 0; i < this.mNumObjects; i++){
        this.mObjects[i].setup();
    }
};

WindObjectSystem.prototype.getEvent = function(_mNumPlayingObjects, _speedFactor){
    this.speedFactor = _speedFactor;
    this.mNumPlayingObjects = _mNumPlayingObjects;
    for(var i = 0; i < this.mNumPlayingObjects; i++){
        this.mObjects[i].getEvent(this.speedFactor);
    }
};

WindObjectSystem.prototype.update = function(){
    for(var i = 0; i < this.mNumPlayingObjects; i++){
        this.mObjects[i].update(this.speedFactor);
    }
};

WindObjectSystem.prototype.display = function(){
    for(var i = 0; i < this.mNumPlayingObjects; i++){
        this.mObjects[i].display();
    }
};

