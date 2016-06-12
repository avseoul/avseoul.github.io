var CharacterSystem = function(){
    this.mCharacter = [];

    this.mRainsFactor;
    this.isHumid;
    
    this.mNumCharacter = 40;
    this.mNumPlayingCharacter = 40;
    for(var i = 0; i < this.mNumCharacter; i++){
        this.mCharacter[i] = new Character();
    }
};

CharacterSystem.prototype.setup = function(){
    for(var i = 0; i < this.mNumCharacter; i++){
        this.mCharacter[i].setup();
    }
};

CharacterSystem.prototype.getEvent = function(_mNumPlayingCharacter, _mRainsFactor, _isHumid){
    this.mNumPlayingCharacter = _mNumPlayingCharacter;
    this.mRainsFactor = _mRainsFactor;
    this.isHumid = _isHumid;
    for(var i = 0; i < this.mNumPlayingCharacter; i++){
        this.mCharacter[i].getEvent(this.mRainsFactor, this.isHumid);
    }
}

CharacterSystem.prototype.update = function(){
    for(var i = 0; i < this.mNumPlayingCharacter; i++){
        this.mCharacter[i].update();
    }
};

CharacterSystem.prototype.display = function(){
    for(var i = 0; i < this.mNumPlayingCharacter; i++){
        this.mCharacter[i].display();
    }
};

