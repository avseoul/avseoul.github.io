// fork getUserMedia for multiple browser versions, for those
// that need prefixes
navigator.getUserMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);

var myAudio = document.querySelector('audio');
var video = document.querySelector('video');

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var analyser = audioCtx.createAnalyser();

var source;

analyser.fftSize = 256;
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);

analyser.getByteTimeDomainData(dataArray);

var setupAudioNodes= function(stream) {
    var sampleSize = 256;  // number of samples to collect before analyzing FFT
    audioStream = stream;

    // The nodes are:  sourceNode -> analyserNode -> javascriptNode -> destination

    // create an audio buffer source node
    sourceNode = audioContext.createMediaStreamSource(audioStream);

    // connect the nodes together
    sourceNode.connect(analyserNode);

    // allocate the array for Frequency Data
    dataArray = new Uint8Array(analyserNode.frequencyBinCount);
}

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

    for(var i = 0; i < bufferLength; i++){
        console.log(dataArray[i]);
    }
});


