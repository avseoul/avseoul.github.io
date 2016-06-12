var Ambience = function(){



	this.synth = new Tone.PolySynth(3, Tone.AMSynth, {
			"oscillator" : {
				"type" : "triangle"
			},
			"envelope" : {
				"attack" : 0.1,
				"decay" : 1,
				"sustain" : 1

			}
		}).toMaster();
	this.bass = new Tone.FMSynth({
			"oscillator" : {
				"type" : "square"
			},
			"envelope" : {
				"attack" : 0.1,
				"decay" : 1,
				"sustain" : 0
			},
			"filterEnvelope" : {
				"attack" : 0.1,
				"decay" : 1,
				"sustain" : 1,
				"min" : 200,
				"max" : 600
			}
		}).toMaster();

	this.mono = new Tone.Mono();
	this.mono.toMaster();
	
	this.synth.connect(this.mono);
	this.bass.connect(this.mono);

	this.reverb = new Tone.Freeverb(0.98,0.97);
	this.reverb.toMaster();
	// this.bass.connect(this.reverb);
	this.mono.connect(this.reverb);
	
	this.feedbackDelay = new Tone.PingPongDelay("2n");
	this.feedbackDelay.toMaster();
	this.synth.connect(this.feedbackDelay);
	this.bass.connect(this.feedbackDelay);

	this.scenario = 1;

	if (this.scenario = 1){


	this.currentChord = (function(){
		var Amin = {
			notes : ["A4", "C4", "E4"],
			next : []
		};	
		var Dmin = {
			notes : ["D4", "F4", "A4"],
			next : []
		};
		var E7 = {
			notes : ["E4", "G#4", "B4", "D5"],
			next : []
		};

		// var G = {
		// 	notes: ["G4", "B4", "D5"],
		// 	next: []
		// }
		// var Gmaj = {
		// 	notes : ["G4", "B4", "D5"],
		// 	next : []
		// };
		Amin.next = [Dmin, E7];
		Dmin.next = [Amin, E7];
		E7.next = [Amin, Dmin];
		// Gmaj.next = [Cmaj, Amin];
		return Amin;
	}());

} else if (this.scenario = 2){

		this.currentChord = (function(){
		var Amin = {
			notes : ["A4", "C4", "E4"],
			next : []
		};	
		// var Dmin = {
		// 	notes : ["D4", "F4", "A4"],
		// 	next : []
		// };
		var E7 = {
			notes : ["E4", "G#4", "B4", "D5"],
			next : []
		};
		//g7
		// var G = {
		// 	notes: ["B4", "F5", "G5"],
		// 	next: []
		// }
		//c
		var G = {
			notes: ["C4", "E4", "G4"],
			next: []
		}


		// var Gmaj = {
		// 	notes : ["G4", "B4", "D5"],
		// 	next : []
		// };
		Amin.next = [G, E7];
		G.next = [Amin, E7];
		E7.next = [Amin, G];
		// Gmaj.next = [Cmaj, Amin];
		return Amin;
	}());

	}
	
	var self = this;







	// this.filter = new Tone.Filter("highpass");
	// this.filter.toMaster();
	// this.filter.set({"frequency" :150});
	// this.bass.connect(this.filter);





	function nextState(){
		if (Math.random() > 0.5){
			self.currentChord = self.currentChord.next[0];
		} else {
			self.currentChord = self.currentChord.next[1];
		}
	}




	Tone.Transport.setInterval(function(time){
		self.synth.triggerAttackRelease(self.currentChord.notes, synthRelease, time);
		var bassNote = self.currentChord.notes[0].charAt(0) + "2";
		self.bass.triggerAttackRelease(bassNote, "64n", time);
		nextState();


		// landing();


	}, "1m-5");

}






	// function landing(){
	// 	swoosh=0.2;
	// 	filter.set({"frequency" :swoosh*500});
	// }


	




Ambience.prototype.wind = function(){

	this.noise = new Tone.Noise();

	this.filter = new Tone.Filter(0, "lowpass");

	this.bit = new Tone.BitCrusher(1);

		

		this.bit.set({"wet":(0)});
		// console.log("mappinghere=",mapping);
		this.filter.set({"frequency" :swoosh*500});



		this.noise.connect(this.filter);
		this.filter.toMaster();

		
		// 	


		this.noisereverb = new Tone.Freeverb(0.1,0);

		this.noisereverb.toMaster();
		this.noise.connect(this.noisereverb);

		this.noise.start();
		


}


Tone.Transport.start();





// 	





// }


// var wind = 0;

// var noise = new Tone.Noise();

// 		var filter = new Tone.Filter(0, "lowpass");

// 		var chorus = new Tone.BitCrusher(4);

// 		var bit = new Tone.BitCrusher(1);
		
// 		filter.set({"frequency" :wind*500});
// 		console.log(wind);
// 		// console.log(window.wind);
// 		// nx.onload = function(){
// 		// 	mousey.on("x", function(x){
// 		// 		chorus.set({"wet":(0/2)});
// 		// 		console.log(x);
// 		// 	});
// 		// 	mousey.on("y", function(y){
// 		// 		// filter.set({"frequency" :Math.sin(y)*500});
// 		// 		// var sinewave = Math.sin(0) // unnecess
// 		// 		filter.set({"frequency" :wind*500});
// 		// 		console.log(y);
// 		// 	});
// 		// 	nx.colorize("#FFFFFF"); // sets accent (default)
// 	 //  		nx.colorize("border", "#FFFFFF");
// 	 //  		nx.colorize("fill", "#FFFFFF");
// 		// };

// 	var noiserever = new Tone.Freeverb(0.2,0);

// 	this.noiserever.toMaster();
// 		noise.connect(noiserever);

// 		noise.connect(filter);
// 		filter.connect(chorus);

// 		// chorus.setDepth(depth);

		

		

// 		chorus.toMaster();
// 		// bit.toMaster();




// 	var currentChord = (function(){
// 		var Amin = {
// 			notes : ["A4", "C4", "E4"],
// 			next : []
// 		};	
// 		var Dmin = {
// 			notes : ["D4", "F4", "A4"],
// 			next : []
// 		};
// 		var E7 = {
// 			notes : ["E4", "G#4", "B4", "D5"],
// 			next : []
// 		};
// 		// var Gmaj = {
// 		// 	notes : ["G4", "B4", "D5"],
// 		// 	next : []
// 		// };
// 		Amin.next = [Dmin, E7];
// 		Dmin.next = [Amin, E7];
// 		E7.next = [Amin, Dmin];
// 		// Gmaj.next = [Cmaj, Amin];
// 		return Amin;
// 	}());
// 	var synth = new Tone.PolySynth(3, Tone.AMSynth, {
// 		"oscillator" : {
// 			"type" : "triangle"
// 		},
// 		"envelope" : {
// 			"attack" : 0.1,
// 			"decay" : 1,
// 			"sustain" : 1

// 		}
// 	}).toMaster();
// 	var bass = new Tone.FMSynth({
// 		"oscillator" : {
// 			"type" : "square"
// 		},
// 		"envelope" : {
// 			"attack" : 0.1,
// 			"decay" : 1,
// 			"sustain" : 0
// 		},
// 		"filterEnvelope" : {
// 			"attack" : 0.1,
// 			"decay" : 1,
// 			"sustain" : 1,
// 			"min" : 200,
// 			"max" : 600
// 		}
// 	}).toMaster();

// 	this.mono = new Tone.Mono();
// 	this.mono.toMaster();
// 	this.synth.connect(mono);
// 	this.bass.connect(mono);

// 	this.reverb = new Tone.Freeverb(0.98,0.97);
// 	this.reverb.toMaster();
// 	// this.bass.connect(this.reverb);
// 	this.mono.connect(this.reverb);
	


// 	// this.filter = new Tone.Filter("highpass");
// 	// this.filter.toMaster();
// 	// this.filter.set({"frequency" :150});
// 	// this.bass.connect(this.filter);

// 	Tone.Transport.setInterval(function(time){
// 		synth.triggerAttackRelease(currentChord.notes, "32n", time);
// 		var bassNote = currentChord.notes[0].charAt(0) + "2";
// 		bass.triggerAttackRelease(bassNote, "64n", time);
// 		nextState();
// 	}, "1m-5");
// 	function nextState(){
// 		if (Math.random() > 0.5){
// 			currentChord = currentChord.next[0];
// 		} else {
// 			currentChord = currentChord.next[1];
// 		}
// 	}
// 	Tone.Transport.start();