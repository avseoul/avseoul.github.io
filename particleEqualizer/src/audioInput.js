var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
var analyser = audioCtx.createAnalyser();

source = audioCtx.createMediaStreamSource(stream);
source.connect(analyser);
analyser.connect(distortion);

analyser.fftSize = 256;
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);

analyser.getByteTimeDomainData(dataArray);

for(var i = 0; i < bufferLength; i++){
    console.log(dataArray[i]);
}
