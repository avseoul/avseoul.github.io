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

console.log('$$$: background.js is working');

/* set up context menu at install time */
chrome.runtime.onInstalled.addListener(function(){
    var context = 'all';
    var title = 'save it for later';
    var id = chrome.contextMenus.create({
        "title": title,
        "contexts": [context],
        "id": "context" + context
    });
});

/* send url&title to content.js */
var sendURL = function(url, title, favicon, category){
    //send popup.js url
    chrome.tabs.query({
        active: true, 
        currentWindow: true
    }, 
    function(tabs) {
        chrome.tabs.sendMessage(
                tabs[0].id, 
                {
                    URL: url,
                    TITLE: title,
                    FAVICON: favicon,
                    CATEGORY: category
                }, 
                function(response) {
                    console.log(response.isDone);
                });
    });
};

/* get url&title of this current page */
var appendURL = function(){
    chrome.tabs.query({
        "active": true,
        "lastFocusedWindow": true
    }, 
    function(tabs){
            //get data
            var URL = tabs[0].url;
            var TITLE = tabs[0].title;
            var FAVICON = tabs[0].favIconUrl;
            var CATEGORY = 'eventUl';
            if(!FAVICON){
                FAVICON = '../images/fav.png';
            }
            console.log(tabs[0]);
            //console.log('img ' + FAVICON); 

            sendURL(URL, TITLE, FAVICON, CATEGORY);
    }); 
};

/* add rightclick event */
chrome.contextMenus.onClicked.addListener(appendURL);
/* add key shortcut event */ 
//alt + d
chrome.commands.onCommand.addListener(function(command){
    console.log('background: command - ' + command);
    appendURL();
});
