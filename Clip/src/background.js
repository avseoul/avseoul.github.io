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
                // console.log(response.isDone);
            }
        );
    });
    // window.close();
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
            var CATEGORY = 'all';
            if(!FAVICON){
                FAVICON = '../images/fav.png';
            }
            // console.log(tabs[0]);
            //console.log('img ' + FAVICON); 

            sendURL(URL, TITLE, FAVICON, CATEGORY);
    }); 
};

var confirm_noti = function(){
    <div id='container'>
        <div id='comfirm'>
            <div id='confirm_image'><img src='../images/icon512_done.png' width='100px'></div>
            <div id='confirm_text'>article cliped to</div>
        </div>
        <div id='category'>
            <div id='dropdown_btn_dummy'></div>
            <div id='dropdown_btn'>&#9660;</div>
            <div id='category_ui'></div>
        </div>
    </div>
    var _container = document.createElement('DIV');
    var _confirm = document.createElement('DIV');
    var _confirm_image = document.createElement('DIV');
    var _confirm_image_img = document.createElement('IMG');
    var _confirm_text = document.createElement('DIV');
    var _category = document.createElement('DIV');
    var _dropdow_btn_dummy = document.createElement('DIV');
    var _dropdow_btn = document.createElement('DIV');
    var _category_ui = document.createElement('DIV');
};

/* add rightclick event */
chrome.contextMenus.onClicked.addListener(function(){
    appendURL();
    confirm_noti();
});
/* add key shortcut event */ 
//alt + d
chrome.commands.onCommand.addListener(function(command){
    alert('background: command - ' + command);
    appendURL();
});
