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

/* get background.js for console.log */
var bkg = chrome.extension.getBackgroundPage();
bkg.console.log('$$$: newtab.js is working');

var toggleDelete = false;
var thisItem;

/* get empty container */
var getEmptyContainer = function(){
    var allUl = document.getElementsByTagName('UL');
    for(var i = 0; i < allUl.length; i++){
        var mChildren = allUl[i].childNodes.length;

        if( mChildren === 0){
            var mContainer = allUl[i].parentNode.parentNode;

            //change subject block color
            var subject = mContainer.firstChild.nextSibling.firstChild;
            subject.style.transitionProperty = 'background';
            subject.style.transitionDuration = '1s';
            subject.style.backgroundColor = '#ddd';

            //-set different values for root 
            var r = allUl[i].parentNode.parentNode.parentNode.id; //-get root
            var p = document.createElement('P');
            if(r === 'root'){
                //style&add text 
                p.innerHTML = 'add articles by right click and click <font color=\'#a00000\'>\'save it for later\'</font>' + '<br>' + 'or hit <font color=\'#a00000\'>\'ALT + D\'</font>';
                p.style.position = 'absolute';
                p.style.color = '#999';
                p.style.bottom = '380px';
                p.style.left = '22px';
            } else {
                //style&add text 
                //p.innerHTML = 'drag items here &#10024;';
                p.innerHTML = 'drag items here &#9713;';
                p.style.position = 'absolute';
                p.style.color = '#ddd';
                p.style.bottom = '70px';
                p.style.left = '130px';
            }
            subject.appendChild(p);
        } else {
            var mContainer = allUl[i].parentNode.parentNode;
            //change subject block color
            var subject = mContainer.firstChild.nextSibling.firstChild;
            subject.style.transitionProperty = 'background';
            subject.style.transitionDuration = '1s';
            subject.style.backgroundColor = '#000';
            //remove text 
            while(subject.childNodes[1] ){
                subject.removeChild(subject.childNodes[1]);
            }
        }
    }
};

/* get jquery.ui sortable */
$(function(){   
    $('#eventUl, #con1, #con2, #con3, #con4, #con5, #con6' ).sortable({
        cancel: '.isHolded',
        connectWith: '.connectedSortable',
        //change current item's container
        receive: function(event, ui){
            var targetContainer = this.id;
            var thisIndex = ui.item.context.id;

            //get data
            chrome.storage.sync.get(null, function(data){ 
                var titles = data['title'];
                var size = Object.keys(titles).length;
                //compare and swap it
                for(var i = 0; i < size; i++){
                    var c = thisIndex == i;
                    if(c){
                        data['category'][i] = targetContainer;
                        break;
                    }
                }
                chrome.storage.sync.set(data);
            });
            //get empty container
            getEmptyContainer();
        }
    }).disableSelection();
});

/* append data to newtab.html */
var appendDom = function(strings, size, category){
    var target_default = document.getElementById('eventUl');
    var target_con1 = document.getElementById('con1');
    var target_con2 = document.getElementById('con2');
    var target_con3 = document.getElementById('con3');
    var target_con4 = document.getElementById('con4');
    var target_con5 = document.getElementById('con5');
    var target_con6 = document.getElementById('con6');

    //reset doms
    while (target_default.firstChild) {
        target_default.removeChild(target_default.firstChild);
    }
    while (target_con1.firstChild) {
        target_con1.removeChild(target_con1.firstChild);
    }
    while (target_con2.firstChild) {
        target_con2.removeChild(target_con2.firstChild);
    }
    while (target_con3.firstChild) {
        target_con3.removeChild(target_con3.firstChild);
    }
    while (target_con4.firstChild) {
        target_con4.removeChild(target_con4.firstChild);
    }
    while (target_con5.firstChild) {
        target_con5.removeChild(target_con5.firstChild);
    }
    while (target_con6.firstChild) {
        target_con6.removeChild(target_con6.firstChild);
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
        var t = category[i];
        if(t === "eventUl"){
            target_default.appendChild(p);
        } else if (t === "con1"){
            target_con1.appendChild(p);
        } else if (t === "con2"){
            target_con2.appendChild(p);
        } else if (t === "con3"){
            target_con3.appendChild(p);
        } else if (t === "con4"){
            target_con4.appendChild(p);
        } else if (t === "con5"){
            target_con5.appendChild(p);
        } else if (t === "con6"){
            target_con6.appendChild(p);
        } else {
            target_default.appendChild(p);
        }
    }

    //get empty container
    getEmptyContainer();
};

/* append url&title to t */
var appendToString = function(url, title, favicon, category){
    var t = [];
    //get size of storage and store to size
    var size = Object.keys(url).length;
    for(var i = 0; i < size; i++){   
        t[i] = '<div id=\'title\'><a href=\'' + url[i] + '\' target=\'_blank\'>' + title[i] + '</a></div>' +
            '<div>&ensp;<a href=\'' + url[i] + '\' target=\'_blank\'>' + 
            '<img id=\'fav\' src=' + favicon[i] + '></a>' + 
            '</div><br>';
    }     
    appendDom(t, size, category);
};

/* once all doms are loaded then do */
document.addEventListener("DOMContentLoaded", function(event) {
    /* get empty page */
    getEmptyContainer();  

    /* get data from storage */
    chrome.storage.sync.get(null, function(data){ 
        appendToString(data['url'], data['title'], data['favicon'], data['category']);
    });

    /* dynamic z-index order */
    document.addEventListener('mousedown', function(event){
        //get current parent (root or categories)
        var s = event.path[0].offsetParent.offsetParent.id;
        if(!toggleDelete){ //-except when delete article mode on
            document.getElementById('root').style.width = '100%';
            //set dynamic z-index
            if(s === 'root'){
                document.getElementById('categories').style.zIndex = '-1';
                document.getElementById('root').style.zIndex = '1';
            } else if(s === 'categories') {
                document.getElementById('categories').style.zIndex = '1';
                document.getElementById('root').style.zIndex = '-1';
            }
        }
    }, false);
    document.addEventListener('mouseup', function(event){
        document.getElementById('root').style.width = '390px';
    }, false);

    /* block drag while delete mode's on */
    //
    //  TO BE FIXED!!!!!!
    //  
    if(toggleDelete){
        $('li').addClass('isHolded');
    } else {
        $('li').removeClass('isHolded');
    }
    //  TO BE FIXED!!!!!!
    //

    /***************************
     * button: reset           *
     ***************************/
    document.getElementById('clearHistory').addEventListener('click', function(){
        /* confirm process */
        var c = confirm('all history will be deleted');

        if(c)
            chrome.storage.sync.clear(function(){  
                //reset dom
                appendDom(null);
            });
    });

    /***************************
     * button: delete articles *
     ***************************/ 
    document.getElementById('delete').addEventListener('click', function(){ 
        //toggle delete mode
        toggleDelete = !toggleDelete;
        //delete process
        if(toggleDelete){
            //set button's style
            this.style.backgroundColor = '#a00000';
            this.style.color = '#fff';
            //change buttons' text
            this.firstChild.data = 'remove selected articles'; 

            //get elements
            var item = document.getElementsByTagName('LI');
            for(var i = 0; i < item.length; i++){
                //disable a tag 
                var As = item[i].getElementsByTagName('A');
                for(var j = 0; j < As.length; j++){
                    As[j].className = 'non-active';
                    //change a tag style
                    //-text
                    As[0].style.color = '#a00000';
                    As[0].style.transitionProperty = 'color';
                    As[0].style.transitionDuration = '1s';
                }

                //remove list-style-type disc
                item[i].style.listStyleType = 'none';

                //add check-boxes
                var cb = document.createElement('INPUT');
                cb.id = 'checkbox';
                cb.type = 'checkbox';
                item[i].insertBefore(cb, item[i].childNodes[0]);

                //get selected process
                //-toggle check by checkbox
                item[i].firstChild.addEventListener('click', function(){
                    this.checked = !this.checked;
                    //toggle lineThroughed
                    if(this.checked){
                        this.nextSibling.style.textDecoration = 'line-through';
                    } else {
                        this.nextSibling.style.textDecoration = 'none';
                    }
                });
                //-toggle check by title
                item[i].addEventListener('click', function(){
                    this.firstChild.checked = !this.firstChild.checked;
                    //toggle lineThroughed
                    if(this.firstChild.checked){
                        this.childNodes[1].style.textDecoration = 'line-through';
                    } else {
                        this.childNodes[1].style.textDecoration = 'none';
                    }
                });
                //-will delete all 'toggled item' in 'else'
            }
        } else {
            //set button's style
            this.style.backgroundColor = '#fff';
            this.style.color = '#333';
            //change button's text
            this.firstChild.data = 'remove articles';
            //delete all checked items
            chrome.storage.sync.get(null, function(data){
                var item = document.getElementsByTagName('LI');
                    for(var i = item.length-1; i >= 0; i--){
                    var isToggled = item[i].firstChild.checked;

                    if(isToggled){ //-is toggled? then delete it from storage
                        if(!toggleDelete){ //-just make it sure...
                            //get storage index for id
                            var index = item[i].id;
                            //delete item
                            //data['url'][index] = null; //<-------------try this one, shiffman suggested !!!
                            
                            data['url'].splice( index, 1 );
                            data['title'].splice( index, 1 );
                            data['favicon'].splice( index, 1 );
                            data['category'].splice( index, 1 );
                        }
                    }
                }
                //-applay storage changes 
                chrome.storage.sync.set(data);
                //-reset all by reset the doms
                if(!toggleDelete) //-just make it sure...
                    appendToString(data['url'], data['title'], data['favicon'], data['category']);
            });
        }
    });


    /* add category */
    /*
       document.getElementById('renameFolders').addEventListener('click', function(){
       var subject = document.getElementById('subject');
       var hspan   = document.getElementById('hspan');
       var c01span = document.getElementById('c01span');
       var c02span = document.getElementById('c02span');
       var c03span = document.getElementById('c03span');
       var c04span = document.getElementById('c04span');
       var c05span = document.getElementById('c05span');
       var c06span = document.getElementById('c06span');

       var edit = document.createElement('SPAN');
       edit.id = 'edit';
       var btn = document.createTextNode('_edit');
       edit.appendChild(btn);
       subject.insertBefore(edit, hspan.nextSibling);
       subject.insertBefore(edit, c01span.nextSibling);
       subject.insertBefore(edit, c02span.nextSibling);
       subject.insertBefore(edit, c03span.nextSibling);
       subject.insertBefore(edit, c04span.nextSibling);
       subject.insertBefore(edit, c05span.nextSibling);
       subject.insertBefore(edit, c06span.nextSibling);
       });
       */
});




