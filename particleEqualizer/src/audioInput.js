// fork getUserMedia for multiple browser versions, for those
// that need prefixes
navigator.getUserMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);

var myAudio = document.querySelector('audio');
var video = document.querySelector('video');

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var analyserNode = audioCtx.createAnalyser();

var sourceNode;

var bufferLength = analyserNode.frequencyBinCount;
var micInput = new Uint8Array(bufferLength);

var setupAudioNodes= function(stream) {
    var sampleSize = 32;
    sourceNode = audioCtx.createMediaStreamSource(stream);
    var filter = audioCtx.createBiquadFilter();
    filter.frequency.value = 60.0;
    filter.type = 'lowpass';
    filter.Q = 10.0;
    analyserNode.smoothingTimeConstant = 0.0;
    analyserNode.fftSize = 32;

    sourceNode.connect(filter);
    filter.connect(analyserNode);
    
    micInput = new Uint8Array(analyserNode.frequencyBinCount);
};

var getMICInput = function(){
    requestAnimationFrame( getMICInput );
    //e.preventDefault();
    analyserNode.getByteFrequencyData(micInput);
    //analyserNode.getByteTimeDomainData(micInput);
    //if(micInput[2] > 40)
    //console.log(micInput);
};

window.addEventListener("load", function(){
    if (navigator.getUserMedia) {
        console.log('getUserMedia supported.');
        navigator.getUserMedia ({
            audio: true
        },
        setupAudioNodes,
        function(err) {
            console.log('The following gUM error occured: ' + err);
        }
        );
    } else {
        console.log('getUserMedia not supported on your browser!');
    }
    getMICInput();
});



