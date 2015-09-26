var dropZone, input, button, sample, clearButton;
var paragraphs = [];

function setup() {
  noCanvas();

  getSample();

  // Selecting the text field and button
  input = select('#textinput');
  button = select('#submit');
  // What to do when button pressed
  button.mousePressed(handleInput);
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
  //reset first
  var reset = document.getElementById('eventWindow');
  while (reset.firstChild) {
    reset.removeChild(reset.firstChild);
  }

  //evaluate
  process(input.value());
}

// Processing the text in this example isn't anything
// Just spitting it back out in the window
function process(txt) {
  var node = document.createElement('P');
  var textnode = document.createTextNode(txt);         
  node.appendChild(textnode);                  
  document.getElementById('eventWindow').appendChild(node);
}
