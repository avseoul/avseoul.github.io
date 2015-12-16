//for compatibility of chrome version
if (!chrome.runtime) {
    // Chrome 20-21
    chrome.runtime = chrome.extension;
} else if(!chrome.runtime.onMessage) {
    // Chrome 22-25
    chrome.runtime.onMessage = chrome.extension.onMessage;
    chrome.runtime.sendMessage = chrome.extension.sendMessage;
    chrome.runtime.onConnect = chrome.extension.onConnect;
    chrome.runtime.connect = chrome.extension.connect;
};

/* if the container is empty */
var emptyContainer = function(){
    var ul = document.getElementById('mlist');
    var subject = document.getElementById('subject').firstChild;
    var h = document.getElementById('header');
    if(ul.childNodes.length === 0){
        var p = document.createElement('P');
        p.innerHTML = 'add articles &#9713<br><font color=\'#a00000\'>instruction</font> is below';
        p.style.position = 'absolute';
        p.style.color = '#999';
        p.style.bottom = '65px';
        p.style.left = '0px';

        subject.style.transitionProperty = 'background';
        subject.style.transitionDuration = '1s';
        subject.style.backgroundColor = '#ddd';  
        subject.appendChild(p);

        h.style.color = '#ddd';
        h.style.transitionProperty = 'color';
        h.style.transitionDuration = '1s';
    } else {
        subject.style.transitionProperty = 'background';
        subject.style.transitionDuration = '1s';
        subject.style.backgroundColor = '#000';
        while(subject.childNodes[1]){
            subject.removeChild(subject.childNodes[1]);
        }

        h.style.color = '#333';
    }
};

/* get background.js for console.log */
var bkg = chrome.extension.getBackgroundPage();
bkg.console.log('$$$: popup.js is working');

/* append data to popup.html */
var appendDom = function(strings, max){
    var target = document.getElementById('mlist');
    for(var i = 0; i < max; i++){
        var p = document.createElement('LI');
        p.innerHTML = strings[i];
        target.appendChild(p);
    }
    //check again container's empty or not
    emptyContainer();
};

/* append url&title to t */
var appendToString = function(url, title, favicon){
    var t = [];
    //get size of storage and store to size
    var size = Object.keys(url).length;
    var maxArticle = 10;
    
    for(var i = 0; i < size; i++){   
        t[i] = '<div id=\'title\'><a href=\'' + url[size - 1 - i] + '\' target=\'_blank\'>' + title[size - 1 - i] + '</a></div>' +
            '<div>&ensp;<a href=\'' + url[size - 1 - i] + '\' target=\'_blank\'>' + 
            '<img id=\'fav\' src=' + favicon[size - 1 - i] + '></a>' + 
            '</div><br>';
    }
    //limit the number of articles
    if(size > maxArticle){
        size = maxArticle;
    }
    //append t to dom
    appendDom(t, size);
};

/* once all doms are loaded then do */
document.addEventListener("DOMContentLoaded", function(event) {
    /* if container is empty */
    emptyContainer();

    /* get data from storage */
    chrome.storage.sync.get(null, function(data){ 
        appendToString(data['url'], data['title'], data['favicon']);
    });

    /* view all */
    document.getElementById('viewall').addEventListener('click', function(){
        chrome.tabs.create({ url: 'src/newtab.html' });
    });

});
