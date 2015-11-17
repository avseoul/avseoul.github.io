//->loading config.js
var config = require('./config.js');

//->setting Twit app 
var Twit = require('twit');
var T = new Twit(config);

//->setting cfg
var cf = require('./cf.js');

//
var cf = new cf.ContextFree();
//Putting together a context free grammar to make tweets
cf.addRule('S', ['Daya\'s started to learn', 'THING', 'with', 'TECH', 'for', 'TOPIC']);

//Thing can expand to join with another topic
cf.addRule('THING', ['TOPIC', 'THING', 'with', 'TECH']);

// Tech can expand to be multiple technologies
cf.addRule('TECH', ['TECH', 'and', 'TECH']);
cf.addRule('TECH', ['TECH', 'and', 'TECH', 'plus', 'TECH']);

// TOPICS
cf.addRule('TOPIC', ['Global Warming']);
cf.addRule('TOPIC', ['Humanity']);
cf.addRule('TOPIC', ['World Peace']);

// THINGS
cf.addRule('THING', ['walking']);
cf.addRule('THING', ['talking']);
cf.addRule('THING', ['pooping']);
cf.addRule('THING', ['sleeping']);
cf.addRule('THING', ['eating']);
cf.addRule('THING', ['playing']);

// TECHS
cf.addRule('TECH', ['JavaScript']);
cf.addRule('TECH', ['C++']);
cf.addRule('TECH', ['Sesame street']);
cf.addRule('TECH', ['Makerbot']);
cf.addRule('TECH', ['Cardboard']);
cf.addRule('TECH', ['Pencil']);
cf.addRule('TECH', ['Processing']);
cf.addRule('TECH', ['Python']);

//->tweeter function
var tweeter = function(){
    //Callback for when the tweet is sent 
    var tweeted = function(err, data, response) {
        if(err){
            console.log(err);
        } else {
            console.log('Success: ' + data.text);
        }
    };

    var tweet = cf.getExpansion('S');

    //post it 
    T.post('statuses/update', { status:tweet }, tweeted);
};

// Start once
tweeter();

// Once every
setInterval(tweeter, 5*60*1000);
