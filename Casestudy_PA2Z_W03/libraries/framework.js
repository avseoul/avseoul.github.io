var input, button;

function setup() {
  noCanvas();

  // Selecting the text field and button
  input = select('#textinput');
  button = select('#submit');
  // What to do when button pressed
  button.mousePressed(handleInput);
}

// Handle the text input field
function handleInput() {
  process(input.value());
}

function process(email) {
  var regex = /\w+@\w+\.(net|com|edu|org)/;
  var result = email.match(regex);

  if (regex.test(email)) {
    console.log("That's a valid e-mail!");
    // console.log(result);
  }
}
