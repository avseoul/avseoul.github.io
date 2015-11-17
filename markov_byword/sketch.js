// Daniel Shiffman
// Programming from A to Z, Fall 2014
// https://github.com/shiffman/Programming-from-A-to-Z-F14

function setup() {
  noCanvas();
  // Assign the generate() function to the button
  var generateButton = select('#generate');
  generateButton.mousePressed(generate);

  var clearButton = select('#clear');
  clearButton.mousePressed(clearIt);
}

function clearIt() {
  var markovs = selectAll('.markov');
  for (var i = 0; i < markovs.length; i++) {
    markovs[i].remove();
  }
}


function generate() {
  // Get the HTML elements we need
  var order = document.getElementById('order');
  var length = document.getElementById('length');
  

  // Get the input text
  var textinput = document.getElementById('text');

  // Create a generator with parameters
  var markov = new MarkovGeneratorWord(Number(order.value), Number(length.value));

  // Split it up into line breaks
  var lines = textinput.value.split('\n');

  // Feed in the lines
  for (var i = 0; i < lines.length; i++) {
    // Trim out any extra white space
    markov.feed(lines[i].trim());
  }

  // Show the resulting output
  var par = createP(markov.generate());
  par.class('markov');
  par.parent('results');

}
