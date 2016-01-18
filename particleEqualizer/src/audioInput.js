// fork getUserMedia for multiple browser versions, for those
// that need prefixes
navigator.getUserMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var analyserNode = audioCtx.createAnalyser();
var bufferLength = analyserNode.frequencyBinCount;
var micInput = new Uint8Array(bufferLength);
/////* getting mAudio variable from mainPage.js (soundcould api)
var audioNode = audioCtx.createMediaElementSource(mAudio);

var setupAudioNodes = function(stream) {
    var sampleSize = 1024;
    var sourceNode = audioCtx.createMediaStreamSource(stream);
    var filter_low = audioCtx.createBiquadFilter();
    var filter_high = audioCtx.createBiquadFilter(); 
    filter_low.frequency.value = 60.0;
    filter_high.frequency.value = 1280.0; 
    filter_low.type = 'lowpass';
    filter_high.type = 'highpass';
    filter_low.Q = 10.0;
    filter_high.Q = 1.0;
    analyserNode.smoothingTimeConstant = 0.0;
    analyserNode.fftSize = 1024;

    sourceNode.connect(filter_low);
    sourceNode.connect(filter_high);
    audioNode.connect(audioCtx.destination);
    audioNode.connect(filter_low);
    audioNode.connect(filter_high);
    filter_low.connect(analyserNode);
    filter_high.connect(analyserNode);

    micInput = new Uint8Array(analyserNode.frequencyBinCount);
};

var setupAudioNodes_b = function() {
    var sampleSize = 1024;
    var filter_low = audioCtx.createBiquadFilter();
    var filter_high = audioCtx.createBiquadFilter(); 
    filter_low.frequency.value = 60.0;
    filter_high.frequency.value = 1280.0; 
    filter_low.type = 'lowpass';
    filter_high.type = 'highpass';
    filter_low.Q = 10.0;
    filter_high.Q = 1.0;
    analyserNode.smoothingTimeConstant = 0.0;
    analyserNode.fftSize = 1024;

    audioNode.connect(audioCtx.destination);
    audioNode.connect(filter_low);
    audioNode.connect(filter_high);
    filter_low.connect(analyserNode);
    filter_high.connect(analyserNode);

    micInput = new Uint8Array(analyserNode.frequencyBinCount);
};

var getMICInput = function(){
    requestAnimationFrame( getMICInput );
    analyserNode.getByteFrequencyData(micInput);
    //for(var i = 0; i < micInput.length; i++){
    //if(micInput[i] > 100)
    //console.log(i, "' ",micInput[i]);
    //}
};

window.addEventListener("load", function(){
    if (navigator.getUserMedia) {
        //console.log('getUserMedia supported.');
        navigator.getUserMedia ({
            audio: true,
            video: false
        },
        setupAudioNodes,
        function(err) {
            console.log('The following gUM error occured: ' + err);
            setupAudioNodes_b();
        }
        );
    } else {
        console.log('getUserMedia not supported on your browser!');
    }
    getMICInput();
});
