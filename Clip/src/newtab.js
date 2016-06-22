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
//     console.log('$$$: newtab.js is working');
// });

var toggleDelete = false;

/* get jquery.ui sortable */
var allow_divs_sortable = function(){
    $(function(){   
        $('.connectedSortable' ).sortable({
            cancel: '.isHolded',
            connectWith: '.connectedSortable',
            //change current item's container
            receive: function(event, ui){
                var targetContainer = this.id;
                // console.log('targetContainer',targetContainer);
                var thisIndex = ui.item.context.id;
                // console.log('thisIndex',thisIndex);

                //get data
                chrome.storage.local.get('article', function(data){ 
                    // var articles = data['article'];
                    var size = Object.keys(data['article']).length;
                    // console.log(data, size);
                    //compare and swap it
                    for(var i = 0; i < size; i++){
                        var c = thisIndex == i;
                        if(c){
                            data['article'][i]['category'] = targetContainer;
                            break;
                        }
                    }
                    chrome.storage.local.set(data);
                });
            
            }
        }).disableSelection();
    });
};

/* get only containers */
var get_container = function(container){
    // get all-container(left-side) artilcles
    var target_all = document.getElementById('all');
    //reset doms
    while (target_all.firstChild) 
        target_all.removeChild(target_all.firstChild);
    // get category-container(right-side) artilcles
    // var target_container = document.getElementsByClassName('con');
    var num_containers = (typeof(container) !== 'undefined')? container.length : 0;
    // console.log(container);
    var target_containers = [];
    for(var i = num_containers-1; i >= 0; i--){
        // make and add doms to html
        document.getElementById('categories').appendChild( get_container_dom(container[i]['index'], container[i]['name']) );
        allow_divs_sortable();
        // get doms
        target_containers[container[i]['index']] = document.getElementById( 'clip.' + container[i]['index'].toString() );
    }  
}

/* append data to newtab.html */
var appendDom = function(strings, size, article, container){
    // get all-container(left-side) artilcles
    var target_all = document.getElementById('all');
    //reset doms
    while (target_all.firstChild) 
        target_all.removeChild(target_all.firstChild);
    // get category-container(right-side) artilcles
    // var target_container = document.getElementsByClassName('con');
    var num_containers = (typeof(container) !== 'undefined')? container.length : 0;
    // console.log(container);
    var target_containers = [];
    for(var i = num_containers-1; i >= 0; i--){
        // make and add doms to html
        document.getElementById('categories').appendChild( get_container_dom(container[i]['index'], container[i]['name']) );
        allow_divs_sortable();
        // get doms
        target_containers[container[i]['index']] = document.getElementById( 'clip.' + container[i]['index'].toString() );
    }
    //add articles
    for(var i = size-1; i >= 0; i--){
        var p = document.createElement('LI');
        p.id = i;
        p.className = p.className + ' lists';
        if(strings[i] !== undefined){
            p.innerHTML = strings[i];
        } else {
            p.innerHTML = 'loading...';
        }

        //sort articles
        var t = article[i]['category'];
        switch(t){
            case 'all':
                target_all.appendChild(p);
            break;
            default:
                var _t = parseFloat( t.split('.')[1] );
                target_containers[_t].appendChild(p);
                // console.log(target_containers[_t], ' : ', t);
            break;
        }
    }
    // delete article function
    var _btn = document.getElementsByClassName('btn')
    for(var i = 0; i < _btn.length; i++){
        _btn[i].addEventListener('click', function(){
            if(this.id === 'article_btn')
                delete_article(this);
        });    
    }
    
};

/* append url&title to t */
var appendToString = function(article, container){
    var t = [];
    //get size of storage and store to size
    var size = Object.keys(article).length;
    for(var i = 0; i < size; i++){   
        t[i] = '<img class=\'list_img\' src=\'../images/article_thumb.png\'>'+
            '<div class=\'title\'><a href=\'' + article[i]['url'] + '\' target=\'_blank\'>' + article[i]['title'] + '</a></div>' +
            '<div>&ensp;<a href=\'' + article[i]['url'] + '\' target=\'_blank\'>' + 
            '<img class=\'fav\' src=' + article[i]['favicon'] + '></a>' + 
            '</div>' +
            '<span class=\'btn\' id=\'article_btn\'>&#10005;</span><br>';
    }     
    appendDom(t, size, article, container);
};

/* once all doms are loaded then do */
document.addEventListener("DOMContentLoaded", function(event) {
    /* get data from storage */
    chrome.storage.local.get(null, function(data){ 
        // console.log('data : ', data);
        if(typeof(data['article']) !== 'undefined')
            appendToString(data['article'], data['container']);
        else{
            get_container(data['container']);
        }
    });

    /* dynamic z-index order */
    function dynamic_z_index(msg, evt){
        var _item = evt.path[2];
        if(_item.className === 'lists'){
            var _item_width = parseFloat( getComputedStyle(_item, null).getPropertyValue("width") );
            var _btn = _item.childNodes[3];        
            _item.style['width'] = (msg === 'down' && _item_width > 300)? '300px' : '';
            _item.style['overflow'] = (msg === 'down')? 'hidden' : '';
            _item.style['white-space'] = (msg === 'down')? 'nowrap' : '';
            _btn.style['display'] = (msg === 'down')? 'none' : 'block';
        }

        var _width = getComputedStyle(document.getElementById('root'), null).getPropertyValue("width");
        document.getElementById('root').style.width = (_width === '355px')? '100vw' : '355px';
    };
    document.addEventListener('mousedown', dynamic_z_index.bind(this, 'down'));
    document.addEventListener('mouseup', dynamic_z_index.bind(this, 'up'));


    /*
    * button: menu event
    */
    function menu_control(msg){
        var _menu_button = document.getElementById('menu'); 
        var _add_button = document.getElementById('add_container');
        var _reset_button = document.getElementById('clear_history');

        // console.log(msg);
        _add_button.className = (msg === 'over')? 'btn active' : 'btn';
        _reset_button.className = _add_button.className;
        _menu_button.className = _add_button.className;

        // _add_button.style['pointer-event'] = (msg === 'over')? 'none' : 'auto';
        // _reset_button.style['pointer-event'] = _add_button.style['pointer-event'];
    };
    document.getElementById('menu_click_dummy').addEventListener('mouseover', menu_control.bind(this, 'over') );
    document.getElementById('menu_click_dummy').addEventListener('mouseout', menu_control.bind(this, 'out') );
    document.getElementById('add_container').addEventListener('mouseover', menu_control.bind(this, 'over') );
    document.getElementById('add_container').addEventListener('mouseout', menu_control.bind(this, 'out') );
    document.getElementById('clear_history').addEventListener('mouseover', menu_control.bind(this, 'over') );
    document.getElementById('clear_history').addEventListener('mouseout', menu_control.bind(this, 'out') );

    /*
     * button: reset           
     */
    document.getElementById('clear_history').addEventListener('click', function(){
        /* confirm process */
        var _c = confirm('all history will be deleted');

        if(_c)
            chrome.storage.local.clear(function(){  
                //reset dom
                appendDom(null);
                location.reload();
            });
    });

    /*
     * button: add container           
     */
     function add_container(){
        // get the number of containers and process to storage
        var container_index = 0;
        chrome.storage.local.get(null, function(data){
            // console.log(data['container']);
            // get the number of containers 
            if( typeof(data['container_index_counter']) !== 'undefined' )
                container_index = data['container_index_counter'].length;
            else 
                container_index = 0;

            // process data
            if ( typeof(data['container']) !== 'undefined' ){
                data['container'].push({ 'name':'clip.' + container_index.toString(), 'index': container_index });
                data['container_index_counter'].push(' ');
            } else {
                data['container'] = [{ 'name':'clip.' + container_index.toString(), 'index': container_index }];
                data['container_index_counter'] = [' '];
                // console.log(data['container']['name']);
            }
            // add updated data to storage
            chrome.storage.local.set(data);

            // get assembed dom
            var _div = get_container_dom(container_index, 'null');
            // append to html
            document.getElementById('categories').insertBefore(_div, document.getElementById('categories').firstChild);
            allow_divs_sortable();
            // debug    
            // console.log(container_index + 'th container added');
        });
     }
    document.getElementById('add_container').addEventListener('click', add_container);
    document.getElementById('add_container_image').addEventListener('click', add_container);

});

var get_container_dom = function(_index, _name){
    // create elements 
    var _div_a = document.createElement('div');
    _div_a.className = 'container';
    var _div_b = document.createElement('div');
    _div_b.className = 'subject';
    var _span_b = document.createElement('span');
    _span_b.className = 'btn';
    _span_b.innerHTML = '<img src=\'../images/container_thumb.png\' class=\'container_thumb\'>';
    _span_b.innerHTML += (_name === 'null')? 'clip.' + _index.toString() : _name;
    var _div_c = document.createElement('div');
    _div_c.className = 'eventArea';
    var _ul_c = document.createElement('ul');
    _ul_c.id = 'clip.' + _index.toString();
    _ul_c.className = 'con connectedSortable ui-sortable';

    _span_b.addEventListener('click', edit_containers_name);
    var _change_name_btn = document.createElement('span');
    _change_name_btn.className = 'btn';
    _change_name_btn.id = 'change_name_btn';
    // _change_name_btn.innerHTML = '<img src=\'../images/icon_edit.png\' width=\'13px\'>';
    // _change_name_btn.innerHTML = 'edit';
    _change_name_btn.addEventListener('click', edit_containers_name);
    var _delete_container_btn = document.createElement('span');
    _delete_container_btn.className = 'btn';
    _delete_container_btn.id = 'delete_container_btn';
    // _delete_container_btn.innerHTML = '<img src=\'../images/icon_trash.png\' width=\'13px\'>';
    // _delete_container_btn.innerHTML = '/delete';
    _delete_container_btn.addEventListener('click', trash_container);

    // build up hierarchy
    _div_b.appendChild(_span_b);
    _div_c.appendChild(_ul_c);
    _div_a.appendChild(_div_b);
    _div_a.appendChild(_div_c);
    _div_b.appendChild(_delete_container_btn);
    _div_b.appendChild(_change_name_btn);

    return _div_a;
}

/* delete article */
var delete_article = function(_t){
    var _this_container = _t.parentNode.parentNode;
    var _this_article = _t.parentNode;
    var _this_article_id = _this_article.id;  
    // remove article from html
    _this_container.removeChild(_this_article);

    // update storage
    chrome.storage.local.get('article', function(data){
        if(typeof(data['article']) !== 'undefined'){
            // console.log(_this_article_id, data['article'][_this_article_id]);
            data['article'].splice(_this_article_id, 1); 
        }

        chrome.storage.local.set(data);
    });
};

/* edit containers name button */
var edit_containers_name = function(evt){
    /*
     * ui process
     */
    // get original subject elements
    var _target_subject_container;
    switch(evt.srcElement.nodeName){
        case 'IMG':
            _target_subject_container = evt.path[2];
            break;
        case 'SPAN':
            _target_subject_container = evt.path[1];
            break;
        default:
            break;
    }
    var _img_html = _target_subject_container.firstChild.innerHTML.split('>')[0] + '>';
    var _original_subject = _target_subject_container.firstChild.innerHTML.split('>')[1];
    // console.log(_original_subject.split('>')[1]);
    // create input field 
    var _temp_input = document.createElement('INPUT');
    // give temp_input original subject text
    _temp_input.value = _original_subject;
    // delete original span's value
    _target_subject_container.firstChild.innerHTML = '';
    // append created input field
    _target_subject_container.appendChild(_temp_input);
    _temp_input.focus();

    /*
     * confirm process
     */
     function _confirm(){
        // get user input
        var _user_input = (_temp_input.value !== '')? _temp_input.value : _original_subject; // if user input is empty then fill it with original value
        // fill subject span with user input
        _target_subject_container.firstChild.innerHTML = _img_html + _user_input;
        // remove input dom
        _target_subject_container.removeChild(_temp_input);

        // get dom id 
        var _container_id = parseFloat( _target_subject_container.parentNode.childNodes[1].firstChild.id.split('.')[1] );
        // update storage 
        chrome.storage.local.get(null, function(data){
            for(var i = 0; i < Object.keys(data['container']).length; i++){
                if(data['container'][i]['index'] === _container_id)
                    data['container'][i]['name'] = _user_input;
            }
            chrome.storage.local.set(data);
        });
     };
     // when users hit the enter
    _temp_input.addEventListener('keyup', function(key){
        if(key.keyCode == 13)
            _temp_input.blur();
            // _confirm();
    });
    // when users click outside 
    _temp_input.addEventListener('focusout', _confirm);
};


/* trash container button */
var trash_container = function(evt){
    // get elements
    var _parent_container = evt.path[3];
    var _target_container = evt.path[2];
    // console.log(_parent_container);
    
    // confirm process
    var _c = confirm('delete container. will lose all articles');
    if(_c) {
        // remove target container
        _parent_container.removeChild(_target_container);

        // get target container's name 
        var _target_category = _target_container.childNodes[1].firstChild.id; 
        // update storage 
        chrome.storage.local.get(null, function(data){

            // remove articles
            if(typeof(data['article']) !== 'undefined'){
                for(var i = Object.keys(data['article']).length - 1; i >= 0; i--){
                    if(data['article'][i]['category'] === _target_category){
                        data['article'].splice(i, 1); 
                    }
                }
            }
            // remove container
            if(typeof(data['container']) !== 'undefined'){
                for(var j = Object.keys(data['container']).length - 1; j >= 0; j--){
                    var _c_id = 'clip.' + data['container'][j]['index'];
                    if( _c_id === _target_category){
                        data['container'].splice(j, 1); 
                    }
                }
            }
            //console.log(data);
            chrome.storage.local.set(data);
        });
    }
};

