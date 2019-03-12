let AudioAnalyzer = function(gain)
{
    this.is_init = false;
    this.is_pulse = false;

    this.debugCanvas = null;

    this.bass = 0.;
    this.mid = 0.;
    this.high = 0.;
    this.level = 0.;

    this.cutout = .5;

    this.frame = 0;

    navigator.getUserMedia = (

        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia
    );

    if (navigator.getUserMedia) 
    {
        console.log('getUserMedia supported.');
        
        navigator.getUserMedia ({
            
            audio: true
            
        }, this.init.bind(this, gain),
        this.init_without_stream.bind(this));
    } 
    else 
    {
        if(window.location.protocol == 'https:')
        {
            this.init_without_stream();
        }

        console.log('getUserMedia not supported on your browser!');
    }
};

AudioAnalyzer.prototype.init = function(gain, _stream)
{
    const _ctx = new (

        window.AudioContext || 
        window.webkitAudioContext || 
        window.mozAudioContext || 
        window.msAudioContext)();

    let _source = _ctx.createMediaStreamSource(_stream);

    // https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode
    this.analyzer = _ctx.createAnalyser();
    this.analyzer.fftSize = 256;

    this.gain = _ctx.createGain();
    _source.connect(this.gain);
    this.gain.connect(this.analyzer);
    this.gain.gain.value = gain || 70.;

    this.reset_history();
    
    this.buffer_length = this.analyzer.frequencyBinCount;
    this.audio_buffer = new Uint8Array(this.buffer_length);

    console.log("audio analyzer is init");
    
    this.is_init = true;
};

AudioAnalyzer.prototype.init_without_stream = function()
{
    alert("microphone is not detected. pulse is activated instead of mic input");

    this.reset_history();

    console.log("audio analyzer is init without mic");
    
    this.is_init = true;
    this.is_pulse = true;
};

AudioAnalyzer.prototype.update = function()
{   
    
    if(this.is_init)
    {    
        let _bass = 0., _mid = 0., _high = 0.;

        if(!this.is_pulse){

            this.analyzer.getByteFrequencyData(this.audio_buffer);
            
            const _pass_size = this.buffer_length / 3.;

            for(let i = 0; i < this.buffer_length; i++) 
            {
                let _val = this.audio_buffer[i] / 256;

                if(_val < this.cutout) _val *= 0.; 

                if (i < _pass_size) _bass += _val;
                else if (i >= _pass_size && i < _pass_size * 2) _mid += _val;
                else if (i >= _pass_size * 2) _high += _val;  
            }

            _bass /= _pass_size;
            _mid /= _pass_size;
            _high /= _pass_size;
        } 
        else 
        {
            if(this.frame % 40 == (Math.floor(Math.random() * 40.)))
            {
                _bass = Math.random();
                _mid = Math.random();
                _high = Math.random();
            }

            this.frame++;
        }

        console.log(_bass, _mid, _high);

        this.bass = this.bass > _bass ? this.bass * .96 : _bass;
        this.mid = this.mid > _mid ? this.mid * .96 : _mid;
        this.high = this.high > _high ? this.high * .96 : _high;

        this.bass = Math.max(Math.min(this.bass, 1.), 0.);
        this.mid = Math.max(Math.min(this.mid, 1.), 0.);
        this.high = Math.max(Math.min(this.high, 1.), 0.);

        this.level = (this.bass + this.mid + this.high) / 3.;

        this.history += this.level * .01 + .005; 
    }
};

AudioAnalyzer.prototype.reset_history = function()
{
    this.history = 0.;
};

AudioAnalyzer.prototype.set_gain = function(_val)
{
    if(this.gain) this.gain.gain.value = _val;
};

AudioAnalyzer.prototype.get_gain = function()
{
    if(this.gain) this.gain.gain.value;
};

AudioAnalyzer.prototype.get_bass = function()
{
    return this.bass == undefined ? 0. : this.bass;
};

AudioAnalyzer.prototype.get_mid = function()
{
    return this.mid == undefined ? 0. : this.mid;
};

AudioAnalyzer.prototype.get_high = function()
{
    return this.high == undefined ? 0. : this.high;
};

AudioAnalyzer.prototype.get_level = function()
{
    return this.level == undefined ? 0. : this.level;
};

AudioAnalyzer.prototype.get_history = function()
{
    return this.history == undefined ? 0. : this.history;
};

AudioAnalyzer.prototype.trigger_pulse = function(_is_pulse)
{
    this.is_pulse = _is_pulse;
};

AudioAnalyzer.prototype.debug = function(_canvas)
{   
    let canvas = _canvas || this.debugCanvas;

    if(canvas === null) 
    {
        this.debugCanvas = document.createElement("canvas");

        this.debugCanvas.style["width"] = "30px";
        this.debugCanvas.style["height"] = "70px";
        this.debugCanvas.style["z-index"] = 99999;

        document.body.appendChild(this.debugCanvas);
        
        canvas = this.debugCanvas;

        console.log("debug canvas created", canvas);
    }

    const _ctx = canvas.getContext("2d");

    _ctx.fillStyle = 'rgb(0, 0, 0)';
    _ctx.fillRect(0, 0, canvas.width, canvas.height);

    const _w = (canvas.width / 4.);
    let _h;
    let _x = 0;

    _h = this.bass * canvas.height;
    _ctx.fillStyle = 'rgb(200,0,0)';
    _ctx.fillRect(_x, canvas.height - _h, _w, _h);
    _x += _w;

    _h = this.mid * canvas.height;
    _ctx.fillStyle = 'rgb(0,200,0)';
    _ctx.fillRect(_x,canvas.height - _h, _w, _h);
    _x += _w;

    _h = this.high * canvas.height;
    _ctx.fillStyle = 'rgb(0,0,200)';
    _ctx.fillRect(_x,canvas.height - _h, _w, _h);
    _x += _w;

    _h = this.level * canvas.height;
    _ctx.fillStyle = 'rgb(200,200,200)';
    _ctx.fillRect(_x,canvas.height - _h, _w, _h);
    _x += _w;
};

