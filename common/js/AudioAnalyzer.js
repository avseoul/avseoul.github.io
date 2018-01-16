var AudioAnalyzer = function(){
    this.is_init = false;
    this.is_pulse = false;

    navigator.getUserMedia = (
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);

    if (navigator.getUserMedia) {
        console.log('getUserMedia supported.');
        navigator.getUserMedia ({
            audio: true
        }, this.init.bind(this),
        this.init_without_stream.bind(this));
    } else {
        if(window.location.protocol == 'https:')
            this.init_without_stream();
        console.log('getUserMedia not supported on your browser!');
    }
};

AudioAnalyzer.prototype.init = function(_stream){
    var _ctx = new (
        window.AudioContext || 
        window.webkitAudioContext || 
        window.mozAudioContext || 
        window.msAudioContext)();

    var _source = _ctx.createMediaStreamSource(_stream);

    // https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode
    this.analyzer = _ctx.createAnalyser();
    this.analyzer.fftSize = 128;

    this.gain = _ctx.createGain();
    _source.connect(this.gain);
    this.gain.connect(this.analyzer);
    this.gain.gain.value = 70.;

    this.bass = 0.;
    this.mid = 0.;
    this.high = 0.;
    this.level = 0.;

    this.frame = 0;

    this.reset_history();
    
    this.buffer_length = this.analyzer.frequencyBinCount;
    this.audio_buffer = new Uint8Array(this.buffer_length);

    console.log("audio analyzer is init");
    
    this.is_init = true;
};

AudioAnalyzer.prototype.init_without_stream = function(){
    alert("microphone is not detected. pulse is activated instead of mic input");

    this.bass = 0.;
    this.mid = 0.;
    this.high = 0.;
    this.level = 0.;

    this.frame = 0;

    this.reset_history();

    console.log("audio analyzer is init without mic");
    
    this.is_init = true;
    this.is_pulse = true;
};

AudioAnalyzer.prototype.update = function(){   
    if(this.is_init){
        var _bass = 0., _mid = 0., _high = 0.;

        if(!this.is_pulse){
            this.analyzer.getByteFrequencyData(this.audio_buffer);
            
            var _pass_size = this.buffer_length/3.;
            for(var i = 0; i < this.buffer_length; i++){
                var _val = Math.pow(this.audio_buffer[i] / 256., 2.);

                if(i < _pass_size)
                    _bass += _val;
                else if(i >= _pass_size && i < _pass_size*2)
                    _mid += _val;
                else if(i >= _pass_size*2)
                    _high += _val;  
            }

            _bass /= _pass_size;
            _mid /= _pass_size;
            _high /= _pass_size;
        } else {
            if(this.frame % 40 == (Math.floor(Math.random()*40.))){
                _bass = Math.random();
                _mid = Math.random();
                _high = Math.random();
            }
        }

        this.bass = this.bass > _bass ? this.bass * .96 : _bass;
        this.mid = this.mid > _mid ? this.mid * .96 : _mid;
        this.high = this.high > _high ? this.high * .96 : _high;

        this.level = (this.bass + this.mid + this.high)/3.;

        this.history += this.level * .01 + .005; 
    }

    this.frame++;
};

AudioAnalyzer.prototype.reset_history = function(){
    this.history = 0.;
};

AudioAnalyzer.prototype.set_gain = function(_val){
    if(this.gain)
        this.gain.gain.value = _val;
};

AudioAnalyzer.prototype.get_gain = function(){
    if(this.gain)
        this.gain.gain.value;
};

AudioAnalyzer.prototype.get_bass = function(){
    return this.bass;
};

AudioAnalyzer.prototype.get_mid = function(){
    return this.mid;
};

AudioAnalyzer.prototype.get_high = function(){
    return this.high;
};

AudioAnalyzer.prototype.get_level = function(){
    return this.level;
};

AudioAnalyzer.prototype.get_history = function(){
    return this.history;
};

AudioAnalyzer.prototype.trigger_pulse = function(_is_pulse){
    this.is_pulse = _is_pulse;
};

AudioAnalyzer.prototype.debug = function(_canvas){
    var _ctx = _canvas.getContext("2d");

    _ctx.fillStyle = 'rgb(0, 0, 0)';
    _ctx.fillRect(0, 0, _canvas.width, _canvas.height);

    var _w = (_canvas.width / this.buffer_length);
    var _h;
    var _x = 0;

    _x = 0;
    _w = (_canvas.width / 4.);

    _h = this.bass * _canvas.height;
    _ctx.fillStyle = 'rgb(200,0,0)';
    _ctx.fillRect(_x,_canvas.height-_h,_w,_h);
    _x += _w;

    _h = this.mid * _canvas.height;
    _ctx.fillStyle = 'rgb(0,200,0)';
    _ctx.fillRect(_x,_canvas.height-_h,_w,_h);
    _x += _w;

    _h = this.high * _canvas.height;
    _ctx.fillStyle = 'rgb(0,0,200)';
    _ctx.fillRect(_x,_canvas.height-_h,_w,_h);
    _x += _w;

    _h = this.level * _canvas.height;
    _ctx.fillStyle = 'rgb(200,200,200)';
    _ctx.fillRect(_x,_canvas.height-_h,_w,_h);
    _x += _w;
};

