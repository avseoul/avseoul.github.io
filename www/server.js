var express = require('express');
var favicon = require('serve-favicon');

//-start express
var app = express();
//-set public folder
app.use(express.static(__dirname + '/public'));
//-set favicon
app.use(favicon(__dirname + '/public/img/favicon.ico'));    

//
app.get('/', function(req, res){
    //res.send('hello world');
    res.sendFile(__dirname + '/public/index.html');
});


//
app.listen(3000, function(){
    console.log('3000 is running');
});
