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

console.log('$$$: content.js is working');

/* add data to chrome extension storage */
var appendToStorage = function(url, title, favicon, category){
    chrome.storage.local.get(null, function(data){ 
        if(typeof(data['article']) !== 'undefined'){
            data['article'].push({ 'url':url, 'title':title, 'favicon':favicon, 'category':category });
        } else {
            data['article'] = [{ 'url':url, 'title':title, 'favicon':favicon, 'category':category }];
        }
        chrome.storage.local.set(data);
        // console.log(Object.keys(data.url).length + ' urls');
    });
};

/* get URL from background.js */
chrome.runtime.onMessage.addListener(function(msg, sender, rsp){
    var url = msg.URL;
    var title = msg.TITLE;
    var favicon = msg.FAVICON;
    var category = msg.CATEGORY;
    
    if(url)
        appendToStorage(url, title, favicon, category);
});


