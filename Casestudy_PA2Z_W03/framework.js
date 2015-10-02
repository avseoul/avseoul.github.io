var input, button;

function setup() {
  noCanvas();

  button = select('#submit');
  button.mousePressed(process);
}

function process() {
  var email = document.getElementById("email").value;
  var regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

  if (regex.test(email)) {
    var result = email.match(regex);
    sendIt(result[0]);
  } else {
    alert('This is not a valid email address');
  }
}

function sendIt(email){
    var message = document.getElementById("message").value;
    var subject = document.getElementById("subject").value;
    document.location.href = "mailto:" + email + "?subject="
        + encodeURIComponent(subject)
        + "&body=" + encodeURIComponent(message);
  }

function clearTextarea(element) {
  var email = document.getElementById("email").value;
  var message = document.getElementById("message").value;
  var subject = document.getElementById("subject").value;

  if(element.id == 'email'){
    if(email == 'email address'){
      element.value = '';
    } 
  } else if(element.id == 'message'){
    if(message == 'message'){
      element.value = '';
    } 
  } else if(element.id == 'subject'){
    if(subject == 'subject'){
      element.value = '';
    } 
  }
}


