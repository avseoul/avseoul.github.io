var MouseHandler = function(){
	this.w = document.documentElement.clientWidth;
    this.h = document.documentElement.clientHeight;

    this.counter;
};

MouseHandler.prototype.handler = function(_evt){
    clearTimeout(this.counter);
    this.counter = setTimeout(this.reset.bind(this), 100.);

    if (_evt.targetTouches) {
        var touch = _evt.targetTouches[0];

        this.x = touch.pageX;
        this.y = touch.pageY;
    } else {
        this.x = _evt.clientX;
        this.y = _evt.clientY;
    }

    this.norm_x = this.x / this.w;
    this.norm_y = 1. - this.y / this.h;

    this.delta_x = this.norm_x - this.norm_px;
    this.delta_y = this.norm_y - this.norm_py;

    this.dir_x = this.norm_px - this.norm_x;
    this.dir_y = this.norm_py - this.norm_y;

    this.norm_px = this.norm_x;
    this.norm_py = this.norm_y;
};

MouseHandler.prototype.get_x = function(){
	return this.x;
};
MouseHandler.prototype.get_y = function(){
	return this.y;
};
MouseHandler.prototype.get_norm_x = function(){
	return this.norm_x;
};
MouseHandler.prototype.get_norm_y = function(){
	return this.norm_y;
};
MouseHandler.prototype.get_norm_px = function(){
	return this.norm_px;
};
MouseHandler.prototype.get_norm_py = function(){
	return this.norm_py;
};
MouseHandler.prototype.get_delta_x = function(){
	return this.delta_x;
};
MouseHandler.prototype.get_delta_y = function(){
	return this.delta_y;
};
MouseHandler.prototype.get_dir_x = function(){
    return this.dir_x;
};
MouseHandler.prototype.get_dir_y = function(){
    return this.dir_y;
};

MouseHandler.prototype.reset = function(){
    this.norm_px = this.norm_x;
    this.norm_py = this.norm_y;

    this.delta_x = 0.;
    this.delta_y = 0.;

    this.dir_x = 0.;
    this.dir_y = 0.;
};

MouseHandler.prototype.register_dom_events = function(_target){
    _target.addEventListener("mousemove", this.handler.bind(this), false);
    _target.addEventListener("touchmove", this.handler.bind(this), false);

    console.log("MouseHandler : handler() is registered mousemove event listener");

    _target.addEventListener('touchstart', function (event) {
        event.preventDefault();
    }, {passive: false});

    window.addEventListener("resize", function(){
        this.w = document.documentElement.clientWidth;
        this.h = document.documentElement.clientHeight;
    }.bind(this));

    window.addEventListener("mouseout", function(){
        this.reset();
    }.bind(this));
};