var express     = require('express');
var app         = express();
var fs          = require('fs');
var favicon     = require('serve-favicon');
var cheerio     = require('cheerio');

var get_data = function(){
    var path = __dirname + '/public/src/html/content.json';
    var mJson = JSON.parse(fs.readFileSync(path,'utf8'));
    return mJson
};

var set_works = function(req, res){
    ////set works container
    var path = '/public/src/html/av.html';
    var html = fs.readFileSync(__dirname + path, 'utf8');
    var $ = cheerio.load(html);
    var mJson = get_data();
    var num = mJson['projects'].length;
    for(var i = 0; i < num; i++){
        var s = mJson['projects'][i];
        var scriptNode = 
            '<div class=\"ui_grid\">'+
                '<img class=\"ui_thumbnail\" src=\''+ s['thumbnail_src'] + '\' onclick=\"get_work_content(\''+ i +'\')\">'+
                '<div class=\"ui_subject\"><span onclick=\"get_work_content(\''+ i +'\')\">'+ s['title'] +'</span></div>'+
                '<div class=\"ui_description\">'+ s['description'] +'</div>'+
                '<div class=\'ui_date\'>'+ s['date'] +'</div>'+
            '</div>';
        $('#works_ui_container').append(scriptNode);
    }
    //console.log($.html());
    res.send($.html());
};

//-setup app
app.use(express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/img/favicon.ico')); 
app.get('/', function(req, res){
    //console.log('get"/" is working');
    res.sendFile(__dirname + '/public/src/html/av.html');
    set_works(req, res);
});

app.get('/data', function(req, res){
    var mJson = get_data();
    res.setHeader('Content-Type', 'application/json');
    res.json(mJson);
});

//-run
app.listen(3000, function(){
    console.log('\n$$$\napp is running on 3000');
});

