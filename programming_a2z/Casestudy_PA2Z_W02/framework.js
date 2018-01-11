var input, button, sample;

function setup() {
  noCanvas();

  getSample();

  // Selecting the text field and button
  input = select('#textinput');
  button = select('#submit');
  sample = select('#sample');
  // What to do when button pressed
  button.mousePressed(handleInput);
  sample.mousePressed(getSample);
}

//get sample text
function getSample() {
  loadStrings('files/sample.txt', fileLoaded);
}
// When the file is loaded
function fileLoaded(data) {
  var txt = data.join('\n');
  process(txt);
}

// Handle the text input field
function handleInput() {
  process(input.value());
}

function process(txt) {
  //reset first
  var reset_01 = document.getElementById('eventWindow');
  var reset_02 = document.getElementById('counter');
  while (reset_01.firstChild) {
    reset_01.removeChild(reset_01.firstChild);
  }
  while (reset_02.firstChild) {
    reset_02.removeChild(reset_02.firstChild);
  }

  var newParagraph = document.createElement('P');

  var words = splitTokens(txt, ' .,:;!@#$%&*()\n'); 
  var counter = 0;
  for (var i = 0; i < words.length; i++) {
    var newDiv = document.createElement('div');
    newDiv.style.display = 'inline';  

    //detect fuck
    var fuck = words[i].match(/fuck/gi);

    //if there is fuck
    if(fuck){
      //count fuck
      counter++;

      var indexDiv = document.createElement('div');
      indexDiv.style.display = 'inline';  
      var indexnode = document.createTextNode(counter + '. ');
      indexDiv.appendChild(indexnode);
      
      var textnode = document.createTextNode(words[i] + ' ');
      newDiv.appendChild(textnode);

      //decorate fuck
      newDiv.id = 'isFucked';
      indexDiv.id = 'isIndex';

      newParagraph.appendChild(indexDiv);  
      newParagraph.appendChild(newDiv);
    } else {
      var textnode = document.createTextNode(words[i] + ' ');
      newDiv.appendChild(textnode);

      newParagraph.appendChild(newDiv); 
    }                  
  }
  //add message
  var newMessage = document.createTextNode('There are ' + counter + ' fucks in there.' );
  document.getElementById('counter').appendChild(newMessage);
  //add fucks 
  document.getElementById('eventWindow').appendChild(newParagraph);

  // Temporarily overriding splitTokens until
  // https://github.com/processing/p5.js/pull/931
  // made by Daniel Shiffman
  function splitTokens() {
    var d = (arguments.length > 1) ? new RegExp('[' + arguments[1] + ']', 'g') : /\s/g;
    return arguments[0].split(d).filter(function(n){return n;});
  };
}
