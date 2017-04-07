var regExp =  ' \"\W.,:;!@#$%&*()\n';
var targetC = '#f00';
var targetS = '12px';


function setup() {
  noCanvas();
};

function getString(){
  //clear result
  var result = document.getElementById('result');
  while (result.firstChild) {
    result.removeChild(result.firstChild);
  }

  var txt = document.getElementById("textinput").value;
  getWords(txt); //process it
};

function getWords(txt) {
  var tokens = splitTokens(txt, ' \n'); 
  sendQuery(tokens);
};

function sendQuery(tokens){
  var query = "http://api.urbandictionary.com/v0/define?term=";

  //send query 
  for(var i = 0; i < tokens.length; i++){
    loadJSON(query + tokens[i], convertToString);
  }
};

function sendSingleQuery(word){
  var query = "http://api.urbandictionary.com/v0/define?term=";

  //send query 
  loadJSON(query + word, convertToString);
};

function convertToString(data){
  var index = Math.floor(Math.random() * data.list.length);
  var text;
    if(!data.list[index].example){
      text = 'no such a thing in this universe.'
    } else {
      text = data.list[index].example;
    }
  var token = splitTokens(text, regExp); 
  addToP(token);
};

function addToP(token){
  var targetP = document.getElementById('result');

  var r = Math.floor(Math.random() * 255);
  var g = Math.floor(Math.random() * 255);
  var b = Math.floor(Math.random() * 255);
  var color = 'rgb(' + r + ',' + g + ',' + b + ')';

  for(var i = 0; i < token.length; i++){
    var newD = document.createElement('div');
    newD.style['background-color'] = color;
    newD.style['display'] = 'inline';
    newD.style['cursor'] = 'pointer';
    newD.id = 'newD'

    var nTextNode = document.createTextNode(token[i].toUpperCase() + ' ');

    newD.appendChild(nTextNode);

    newD.addEventListener('mouseover', function(){
      this.style['background-color'] = targetC;
      this.style['color'] = 'black';
      this.style['font-size'] = targetS;
    });   
    newD.addEventListener('mouseout', function(){
      if(this.id === 'newD'){
        this.style['background-color'] = color;
        this.style['color'] = 'white';
      } else if (this.id === 'searchedD'){
        this.style['background-color'] = 'red';
        this.style['color'] = 'black';
      }
      this.style['font-size'] = '12px';
    });  
    newD.addEventListener('click', expandDiv);      

    targetP.appendChild(newD);
  }
};

function expandDiv(){
  var query = "http://api.urbandictionary.com/v0/define?term=";
  var word = this.innerText;
  var thisDiv = this;
  // console.log(word);
  loadJSON(query + word, c);

  function c(data){
    var index = Math.floor(Math.random() * data.list.length);
    var newW;
    if(!data.list[index].example){
      newW = 'no such a thing in this universe.'
    } else {
      newW = data.list[index].example;
    }
    var token = splitTokens(newW, regExp); 

    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    var color = 'rgb(' + r + ',' + g + ',' + b + ')';

    for(var i = 0; i < token.length; i++){
      var newD = document.createElement('div');
      newD.style['background-color'] = color;
      newD.style['display'] = 'inline';
      newD.style['cursor'] = 'pointer';
      newD.id = 'newD'

      var nTextNode = document.createTextNode(token[i].toUpperCase() + ' ');

      newD.appendChild(nTextNode);

      newD.addEventListener('mouseover', function(){
        this.style['background-color'] = targetC;
        this.style['color'] = 'black';
        this.style['font-size'] = targetS;
      });   
      newD.addEventListener('mouseout', function(){
        if(this.id === 'newD'){
          this.style['background-color'] = color;
          this.style['color'] = 'white';
        } else if (this.id === 'searchedD'){
          this.style['background-color'] = 'red';
          this.style['color'] = 'black';
        }
        this.style['font-size'] = '12px';
      });  
      newD.addEventListener('click', expandDiv);      

      thisDiv.parentNode.insertBefore(newD, thisDiv.nextSibling);
      thisDiv.id = 'searchedD';
    }
  }
};

function modify(){
  var thisDiv = document.getElementById('result').querySelectorAll("div");
  
  for(var i = 0; i < thisDiv.length; i++){
    var thisD = thisDiv[i];
    modifyProcess(thisD);
  }
};


function modifyProcess(thisD){
  var query = "http://api.urbandictionary.com/v0/define?term=";
  var rootDiv = document.getElementById('result');
  
  loadJSON(query + thisD.textContent, function(data){
    var index = Math.floor(Math.random() * data.list.length);
    var newW;
    if(!data.list[index].example){
      newW = 'no such a thing in this universe.'
    } else {
      newW = data.list[index].example;
    }


    var token = splitTokens(newW, regExp); 

    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    var color = 'rgb(' + r + ',' + g + ',' + b + ')';

    for(var j = 0; j < token.length; j++){
      var newD = document.createElement('div');
      newD.style['background-color'] = color;
      newD.style['display'] = 'inline';
      newD.style['cursor'] = 'pointer';
      newD.id = 'newD'

      var nTextNode = document.createTextNode(token[j].toUpperCase() + ' ');

      newD.appendChild(nTextNode);

      newD.addEventListener('mouseover', function(){
        this.style['background-color'] = targetC;
        this.style['color'] = 'black';
        this.style['font-size'] = targetS;
      });   
      newD.addEventListener('mouseout', function(){
        if(this.id === 'newD'){
          this.style['background-color'] = color;
          this.style['color'] = 'white';
        } else if (this.id === 'searchedD'){
          this.style['background-color'] = 'red';
          this.style['color'] = 'black';
        }
        this.style['font-size'] = '12px';
      });  
      newD.addEventListener('click', expandDiv);   
      // console.log(thisD);
      rootDiv.insertBefore(newD, thisD.nextSibling);
    }
    thisD.id = 'searchedD';
    thisD.style['background-color'] = 'red';
    thisD.style['color'] = 'black';
  });
}



//---------------------//
//*reset textarea      
//---------------------//
function clearTextarea(element) {
      element.value = '';
};

//---------------------//
//*submit by a key      
//---------------------//
function submitByEnter(e){
    // look for window.event in case event isn't passed in
    e = e || window.event;
    if (e.keyCode == 13)
    {
      getString();   
      return false;
    }
}

//--------------------------------------------------//
//*get all text elements                            
//                          
// Temporarily overriding splitTokens until
// https://github.com/processing/p5.js/pull/931
// made by Daniel Shiffman
//--------------------------------------------------//
function splitTokens() {
  var d = (arguments.length > 1) ? new RegExp('[' + arguments[1] + ']', 'g') : /\s/g;
  return arguments[0].split(d).filter(function(n){return n;});
};

