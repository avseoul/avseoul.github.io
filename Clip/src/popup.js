// //for compatibility of chrome version
// if (!chrome.runtime) {
//     // Chrome 20-21
//     chrome.runtime = chrome.extension;
// } else if(!chrome.runtime.onMessage) {
//     // Chrome 22-25
//     chrome.runtime.onMessage = chrome.extension.onMessage;
//     chrome.runtime.sendMessage = chrome.extension.sendMessage;
//     chrome.runtime.onConnect = chrome.extension.onConnect;
//     chrome.runtime.connect = chrome.extension.connect;
// };

// /* get background.js for console.log */
// var bkg = chrome.runtime.getBackgroundPage(function(){
//     console.log('$$$: popup.js is working');
// });


/* show_confirm_message */
var show_message = function(){
	var _category_ui = document.getElementById('category_ui');
	
	// get container's name 
	chrome.storage.local.get(null, function(data){
		// bkg.console.log(data);
		var _category_title = [];
		var _category_id = [];
        
        if(typeof(data['container']) !== 'undefined')
        for(var i = 0; i < Object.keys(data['container']).length; i++){
            _category_title.push(data['container'][i]['name']);
            _category_id.push('container.' + data['container'][i]['index'].toString());
        }

        _category_title.push('all');
        _category_id.push('all');

        // append to dom
        for(var j = _category_title.length-1; j >= 0 ; j--){
        	var _temp_li = document.createElement('DIV');
            _temp_li.innerHTML = '<img src=\'../images/container_thumb.png\' class=\'container_thumb\'>';
        	_temp_li.innerHTML += _category_title[j];
        	_temp_li.id = _category_id[j];

        	_temp_li.addEventListener('click', function(){
        		var _id = this.id;
				chrome.storage.local.get('article', function(data){
					var _index = Object.keys(data['article']).length - 1;
            		data['article'][_index]['category'] = _id;					
            		chrome.storage.local.set(data);
            		window.close();
        		});
        	});
        	//append to dom
        	_category_ui.appendChild(_temp_li);
        }
    });
    /* add dropdown button behaviro */
    document.getElementById('dropdown_btn_dummy').addEventListener('click', function(){
        var _btn = document.getElementById('dropdown_btn');
        // bkg.console.log(_btn.innerHTML.toString());
        // swap button
        _btn.className = (_btn.className === '')? 'active':'';
        _btn.innerHTML = (_btn.className === '')? '&#9660;':'&#9650;';

        // change background div behaviors 
        var _ui = document.getElementById('category_ui');
        _ui.className = _btn.className;
        document.body.className = _btn.className;
    });
};

/* get url&title of this current page */
var append_url_to_storage = function(){
    chrome.tabs.query({
        "active": true,
        "lastFocusedWindow": true
    }, 
    function(tabs){
            // get data
            var url = tabs[0].url;
            var title = tabs[0].title;
            var favicon = tabs[0].favIconUrl;
            var category = 'all';
            if(!favicon){
                favicon = '../images/fav.png';
            }

            // bkg.console.log(URL, TITLE, FAVICON, CATEGORY);
            // update storage
            chrome.storage.local.get('article', function(data){ 
		        if(typeof(data['article']) !== 'undefined'){
		            data['article'].push({ 'url':url, 'title':title, 'favicon':favicon, 'category':category });
		        } else {
		            data['article'] = [{ 'url':url, 'title':title, 'favicon':favicon, 'category':category }];
		        }
		        chrome.storage.local.set(data, show_message);
		    });
    }); 
};

/* control auto-close */
var counter_active = true;
var set_counter = function(){
    //-set animation
    var _s_t = Date.now();

    if(counter_active)
        requestAnimationFrame(_anim); 

    function _anim(){
        var _c_t = Date.now();
        var _n_t = (_c_t - _s_t) / 15000;

        if(_n_t <= 1)
            requestAnimationFrame(_anim);
        else
            window.close();
    }
    counter_active = false;
};

/* once all doms are loaded then do */
document.addEventListener("DOMContentLoaded", function(event) {
	append_url_to_storage();
    // set_counter();
});


