let AudioAnalyzer = function (gain) {
    this.isInit = false;
    this.isPulse = false;

    this.debugCanvas = null;
    this.debugCanvasCtx = null;

    this.FFT_SIZE = 256;

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

    if (navigator.getUserMedia) {
        navigator.getUserMedia({audio: true}, 
            this.init.bind(this, gain),
            this.initWithoutStream.bind(this));
    }
    else {
        if (window.location.protocol == 'https:') {
            this.initWithoutStream();
        }
    }
};

AudioAnalyzer.prototype.init = function (gain, stream) {
    const audioCtx = new (
        window.AudioContext ||
        window.webkitAudioContext ||
        window.mozAudioContext ||
        window.msAudioContext)();
    
    const mediaStreamSource = audioCtx.createMediaStreamSource(stream);

    this.gain = audioCtx.createGain();
    this.gain.gain.value = gain || 70.;
    
    const lowPass = audioCtx.createBiquadFilter();
    lowPass.type = "lowpass";
    lowPass.frequency.value = 1000;
    
    const highPass = audioCtx.createBiquadFilter();
    highPass.type = "highpass";
    highPass.frequency.value = 20000;
    
    this.analyzer = audioCtx.createAnalyser();
    this.analyzer.fftSize = this.FFT_SIZE;
    
    // Node tree
    mediaStreamSource.connect(this.gain);
    this.gain.connect(lowPass);
    this.gain.connect(highPass);
    lowPass.connect(this.analyzer);
    highPass.connect(this.analyzer);

    this.reset();

    this.audioBuffer = new Uint8Array(this.analyzer.frequencyBinCount);

    this.isInit = true;
};

AudioAnalyzer.prototype.initWithoutStream = function () {
    alert("microphone is not detected. pulse is activated instead of mic input");

    this.reset();

    this.isInit = true;
    this.isPulse = true;
};

AudioAnalyzer.prototype.update = function () {
    if (!this.isInit) return;

    let bass = 0, mid = 0, high = 0;
    if (!this.isPulse) {   
        this.analyzer.getByteFrequencyData(this.audioBuffer);
        const passSize = this.analyzer.frequencyBinCount / 3;
        const DATA_SCALE = 255;

        for (let i = 0; i < this.analyzer.frequencyBinCount; i++) {
            
            const val = this.audioBuffer[i] / DATA_SCALE;

            if (val === Infinity || val < this.cutout) continue;

            if (i < passSize) bass += val;
            else if (i < passSize * 2) mid += val;
            else if (i <= passSize * 3) high += val;
        }

        bass /= passSize;
        mid /= passSize;
        high /= passSize;
    } else {
        if (this.frame % 40 == (Math.floor(Math.random() * 40.))) {
            bass = Math.random();
            mid = Math.random();
            high = Math.random();
        }

        this.frame++;
    }

    this.bass = this.bass > bass ? this.bass * .96 : bass;
    this.mid = this.mid > mid ? this.mid * .96 : mid;
    this.high = this.high > high ? this.high * .96 : high;

    this.level = (this.bass + this.mid + this.high) / 3.;
    this.history += this.level * .01 + .005;
};

AudioAnalyzer.prototype.reset = function () {
    this.history = 0.;
};

AudioAnalyzer.prototype.set_gain = function (_val) {
    if (this.gain) this.gain.gain.value = _val;
};

AudioAnalyzer.prototype.get_gain = function () {
    if (this.gain) this.gain.gain.value;
};

AudioAnalyzer.prototype.get_bass = function () {
    return this.bass == undefined ? 0. : this.bass;
};

AudioAnalyzer.prototype.get_mid = function () {
    return this.mid == undefined ? 0. : this.mid;
};

AudioAnalyzer.prototype.get_high = function () {
    return this.high == undefined ? 0. : this.high;
};

AudioAnalyzer.prototype.get_level = function () {
    return this.level == undefined ? 0. : this.level;
};

AudioAnalyzer.prototype.get_history = function () {
    return this.history == undefined ? 0. : this.history;
};

AudioAnalyzer.prototype.trigger_pulse = function (_isPulse) {
    this.isPulse = _isPulse;
};

AudioAnalyzer.prototype.debug = function (_canvas = null) {
    let canvas = _canvas || this.debugCanvas;

    if (canvas === null) {
        this.debugCanvas = document.createElement("canvas");
        this.debugCanvas.className = "audioDebug";
        
        document.body.appendChild(this.debugCanvas);
        
        canvas = this.debugCanvas;
    }

    if(this.debugCanvasCtx === null)
        this.debugCanvasCtx = canvas.getContext("2d");

    const w = canvas.width / 4;
    let h;
    let x = 0;

    const black = "rgb(0, 0, 0)";
    const white = "rgb(255, 255, 255)";

    this.debugCanvasCtx.fillStyle = white;
    this.debugCanvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    this.debugCanvasCtx.font = "10px Verdana";

    h = this.bass * canvas.height;
    this.debugCanvasCtx.fillStyle = black;
    this.debugCanvasCtx.fillRect(x, canvas.height - h, w - 1, h);
    this.debugCanvasCtx.fillStyle = white;
    this.debugCanvasCtx.fillText(this.bass.toFixed(2).toString(), x, canvas.height);
    x += w;

    h = this.mid * canvas.height;
    this.debugCanvasCtx.fillStyle = black;
    this.debugCanvasCtx.fillRect(x, canvas.height - h, w - 1, h);
    this.debugCanvasCtx.fillStyle = white;
    this.debugCanvasCtx.fillText(this.mid.toFixed(2).toString(), x, canvas.height);
    x += w;

    h = this.high * canvas.height;
    this.debugCanvasCtx.fillStyle = black;
    this.debugCanvasCtx.fillRect(x, canvas.height - h, w - 1, h);
    this.debugCanvasCtx.fillStyle = white;
    this.debugCanvasCtx.fillText(this.high.toFixed(2).toString(), x, canvas.height);
    x += w;

    h = this.level * canvas.height;
    this.debugCanvasCtx.fillStyle = black;
    this.debugCanvasCtx.fillRect(x, canvas.height - h, w, h);
    this.debugCanvasCtx.fillStyle = white;
    this.debugCanvasCtx.fillText(this.level.toFixed(2).toString(), x, canvas.height);
};

