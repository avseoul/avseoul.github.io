/* get json and store into varible */
var mJson;
var xmlhttp = new XMLHttpRequest();
xmlhttp.open('GET', '/data', true);
xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4) {
        if(xmlhttp.status == 200) {
            mJson = JSON.parse(xmlhttp.responseText);
            sort_works();
        }
    }
};
xmlhttp.send(null);


/* scripts */
var a_d2_content = 'Sehyun Kim (also known as ‘AV’ or ‘VISUALOZIK’) has studied about visual language for experiment with all the visual experience. Especially, he has focused on reinterpreting sound to express it as a SEEING SOUND. He has used filming, motion graphic, 3d animation, graphic design, and lighting for his works as the medium.<br>'+
'He has started his career since 2007 as a freelanced director and also designer, and found experimental visual group VISUALOZIK since 2009 with joithedogfather, who is the talented artist and also beloved friend of mine, to start his career as a visual artist in South Korea. He has made his works with his style regardless of any genre, like music video, projection mapping installation, fashion film, experimental film, graphic design, commercial film, promotion video, and so on.<br>'+
'Recently, he has started his master’s degree at NYU ITP. He is focusing on visual programming and new platform which can present digital media in different ways . You can check my ITP works through this blog<br>'+
'And also he has an interest to learn HTML, CSS, JAVASCRIPT for front-end web developing. This web site is sort of on-going project for learning and he is going to keep modifying this web site.<br>'+
'In his spare time, he enjoys taking photographs, listening musics, drinking beers. However, he has spent most of his spare time with his currently greatest concern that is learning ENGLISH…<br>'+
'av.seoul@gmail.com / twitter / facebook / instagram / pinterest / tumblr / vimeo / linkedIn';

/* global variables */
var isPortrait = true;//-to detect responsive
var isInit = false;//-to detect first load
var isNavigate = false;//-to detect navigation
var isUp = false;
var isDown = false;
var isLeft = false; //-to show content window
var isRight = false;
var isScrollToTop = false;
var pv=0;
var w_count=0;
var window_w, window_h;
var wf=0, cL=99999, nL=0, tL=0, rL=0, isOn = false;//-for wheel event
var ct='';
var scroll_target = null;
/* navigate page */
var go_landing = function(current_target){
    var _ct = current_target;
    var _t = document.getElementById('landing_container');
    wheel_page_down(_t);
    lock_overflow('works_container');
};  
var go_about = function(current_target){
    var _ct = current_target;
    var _t;
    if(_ct == 'landing_container'){
        _t = document.getElementById('landing_container');
        wheel_page_up(_t);
    }else if(_ct === 'works_container' || _ct === '' || ct === 'works_ui_container'){
        _t = document.getElementById('about_container');
        wheel_page_down(_t);
    }
    lock_overflow('works_container');
};
var go_works = function(current_target){
    var _ct = current_target;
    if(_ct === 'about_img'){
        var _t = document.getElementById('about_container');
        wheel_page_up(_t);
    }else if(_ct === 'works_content_container'){
        var _t = document.getElementById('works_content_container');
        wheel_page_up(_t);
    }
    unlock_overflow('works_container');
};
var go_content = function(current_target){
    var _ct = current_target;
    var _t = document.getElementById('works_content_container');
    wheel_page_down(_t);
    lock_overflow('works_container');
};
var lock_overflow = function(_t){
    document.getElementById(_t).style['overflow'] = 'hidden';
};
var unlock_overflow = function(_t){
    document.getElementById(_t).style['overflow'] = 'auto';
};

/* set url */
var set_url = function(_t){
    var id = _t;
    console.log(id, isUp, isDown);
    //if(id=='about_img' && isUp==false && isDown==true){window.history.pushState(null,null,'/');}
    //else if(id=='about_img' && isUp==true && isDown==false){window.history.pushState(null,null,'/works');}
    //else if(id=='landing_container' && isUp==true && isDown==false){window.history.pushState(null,null,'/about');}
    //else if(id=='work_container' && isUp==false && isDown==true){window.history.pushState(null,null,'/about');}
};

/* wheel event controller */
var wheel_page_up = function(_t){
    cL = parseFloat(_t.style['top']);
    if(!isOn && cL<99999){
        nL = parseFloat(_t.style['top']);
        rL = document.getElementById('works_container').scrollTop;
        tL = rL-window_h;
        isOn=true;
    }else if(ct === 'works_content_container'){
        rL = document.getElementById('works_container').scrollTop;
        tL = rL-window_h;
    }
    if(nL < (tL*.3)){                    //2.-ease out
        nL -= Math.abs((tL-cL) * .1); 
    }else{                               //1.-ease
        nL -= Math.abs((tL-cL) * .04);
    }
    if(nL < tL+2){                       //3.-settle
        nL = tL; 
        wheel_reset();
        document.getElementById('works_content_container').style['display'] = 'none';
    }
    _t.style['top'] = nL.toString() + 'px';
};
var wheel_page_down = function(_t){  
    cL = parseFloat(_t.style['top']);
    if(!isOn && cL<99999){
        nL = parseFloat(_t.style['top']);
        tL = document.getElementById('works_container').scrollTop;
        rL = tL-window_h;
        isOn=true;
    }
    if(nL > (rL*.7)){                      //2.-ease out
        nL += Math.abs((tL-cL) * .1);
    }else{                                 //1.-ease
        nL +=  Math.abs((tL-cL) * .04);          
    }
    if(nL > tL-2){                         //3.-settle
        nL = tL; 
        wheel_reset();
    }
    _t.style['top'] = nL.toString() + 'px';
};
var scroll_to_top = function(_t){
    var _cL = parseFloat(_t.scrollTop);
    var _nL = _cL*.9;
    if(_nL < .5){
        _nL = 0;
        isScrollToTop = false;
        _t.style['overflow'] = 'hidden';
    }
    _t.scrollTop = _nL;
    //*
    document.getElementById('works_content_container').style['top'] = _nL.toString() + 'px';
};
var wheel_reset = function(){
    isUp = false;
    isDown = false;
    isLeft = false;
    isRight = false;
    isOn = false;
    isNavigate = false;
    cL = 99999999;
};
var wheel_event_trigger = function(event){
    if(event !== null){     
        wf = event.wheelDeltaY;
        if(!isNavigate&&!isDown&&!isUp){ 
            ct = event.srcElement.id;
            console.log('ct: ',ct,', isNavigate: ',isNavigate);
            var scroll_position = document.getElementById('works_container').scrollTop;
            if(ct!=='header'){
                if(ct!==''&&ct!=='works_container'&&ct!=='works_ui_container'&&ct!=='works_content_container'){
                    if(wf<0 && ct !== 'works_container'){//-not for last page
                        isNavigate = true;
                        isUp=true;
                        set_url(ct);
                    }else if(wf>0 && ct !== 'landing_container'){//-not for first page
                        isNavigate = true;
                        isDown=true;
                        set_url(ct);
                    }
                }else if(ct==='' || ct ==='works_container' || ct === 'works_ui_container'){
                    if(wf>0&&scroll_position==0&&ct!=='works_content_container'){
                        if(!isUp&&!isDown){
                            isNavigate = true;
                            isDown=true;
                        }
                    }
                }
            }
        }
    }
};
var wheel_optimize = function(event){
    var v = Math.abs(event.wheelDeltaY);
    if(!isUp&&!isDown){ 
        if(v>pv){ //-prevent unnecessary fire from trackpad
            wheel_event_trigger(event);
        }else if(v>100 && v==pv){ //-for mouse wheeel
            wheel_event_trigger(event);
        }
    }
    //console.log('pv: ',pv,', v: ',v, ', rv: ',event.wheelDeltaY);
    pv = v; 
};

/* animate content bg */
var isBg = '';
var maxOpacity = .5;
var show_content_bg = function(){
    var _t = document.getElementById('works_content_bg');
    var _nt = document.getElementById('works_container').scrollTop;
    var opacity = parseFloat(getComputedStyle(_t, null).getPropertyValue('opacity'));
    if(opacity == 0){
        _t.addEventListener('click', function(){
            isBg='hide'
                ct = 'works_content_container';
            isNavigate = true;
            isUp = true;
        });
        _t.style.display = 'block';
        _t.style.top = _nt+'px';
    }
    opacity += .01;
    if(opacity>maxOpacity){
        opacity = maxOpacity;
        isBg = '';
    }
    _t.style.opacity = opacity;
};
var hide_content_bg = function(){
    var _t = document.getElementById('works_content_bg');
    var opacity = parseFloat(getComputedStyle(_t, null).getPropertyValue('opacity'));
    opacity -= .01;
    if(opacity<0){
        opacity = 0;
        isBg = '';
        _t.style.display = 'none';
    }
    _t.style.opacity = opacity;
};

/* get new image location */
var getImgLoc = function(w,h){
    var s = [2];
    if(w != 0){
        s[0] = w*-.5+window_w*.5; //-left
        s[1] = h*-.5+window_h*.5; //-top
    }else{
        s[0] = 0; s[1] = 0;
    }
    return s
};

/* reset responsive elements style */
var resetElements = function(){
    //-about image 
    var t1 = document.getElementById('about_img');
    if(isPortrait){
        t1.style['width'] = 'auto';
        t1.style['height'] = '100vh';
    }else{
        t1.style['width'] = '100vw';
        t1.style['height'] = 'auto';
    }
    var nL = getImgLoc(t1.clientWidth, t1.clientHeight);
    t1.style['margin-left'] = nL[0].toString() + 'px';
    t1.style['margin-top'] = nL[1].toString() + 'px';

    //-works_content_container
    var t2 = document.getElementById('works_content_container');
    t2.style['margin-left'] = ((window_w - parseFloat(getComputedStyle(t2,null).getPropertyValue('width'))) * .5).toString()+'px';
};

/* detect window ratio */
var get_window_ratio = function(){//-1.77 is default
    window_w = window.innerWidth;
    window_h = window.innerHeight;
    var tr = 1.77;
    var r = window_w/window_h;
    if(r<tr){//-is portrait
        isPortrait = true;
    }else{//is landscape
        isPortrait = false;
    }
    if(isInit){//-fire after first loading
        resetElements();
    }
};


/* get landing page */
var get_landing = function(){
    //-get container
    var t = document.getElementById('landing_container');
    t.style['top'] = '0px';
};

/* get about page */
var get_about = function(){
    //-get container
    var t = document.getElementById('about_container');
    t.style['top'] = '0px';
    //-create img dom
    var a_i = document.getElementById('about_img');
    if(isPortrait){
        a_i.style['width'] = 'auto';
        a_i.style['height'] = '100vh';
    }else{
        a_i.style['width'] = '100vw';
        a_i.style['height'] = 'auto';
    }
    var nL = getImgLoc(a_i.clientWidth, a_i.clientHeight);
    //console.log(a_i.clientWidth);
    a_i.style['margin-left'] = nL[0].toString() + 'px';
    a_i.style['margin-top'] = nL[1].toString() + 'px';
    t.appendChild(a_i);
    var a_d1 = document.createElement('div');
    a_d1.id = 'about_d1';
    a_d1.style['margin'] = '0 auto';
    a_d1.style['position'] = 'absolute';
    a_d1.style['top'] = '0px';
    a_d1.style['width'] = '70vw';
    a_d1.style['color'] = '#fafafa';
    a_d1.className = 'title';
    a_d1.innerHTML = '_about';
    t.appendChild(a_d1);
    var a_d2 = document.createElement('div');
    a_d2.id = 'about_d2';
    a_d2.style['margin'] = '0 auto';
    a_d2.style['position'] = 'absolute';
    a_d2.style['margin-top'] = window.innerHeight.toString();
    a_d2.style['width'] = '70vw';
    a_d2.style['color'] = '#fafafa';
    a_d2.innerHTML = a_d2_content;
    t.appendChild(a_d2);
};

/* get work content page */
var get_work_content = function(_id){
    //-get bg
    isBg = 'show';
    //-get and set container
    var t = document.getElementById('works_content_container');
    while(t.firstChild){t.removeChild(t.firstChild);} //TODO reset dom when container is completely up
    var t_nt = document.getElementById('works_container').scrollTop-window_h;
    t.style['top'] = t_nt.toString()+'px';
    t.style['margin-left'] = ((window_w - parseFloat(getComputedStyle(t,null).getPropertyValue('width'))) * .5).toString()+'px';

    //-build up doms 
    var p = mJson['projects'][_id];
    //-content
    var _content = document.createElement('div');
    _content.id = '_content';
    switch(p.content.is){
        case 'video':
            _content.style['cursor'] = 'pointer';
            _content.style['width'] = p.content.size.w+'px';
            _content.style['height'] = p.content.size.h+'px';
            _content.style['line-height'] = p.content.size.h +'px';
            //console.log(p.content.size.w);
            _content.style['background'] = 'url(\"' + p.content.dummy + '\")';
            _content.style['background-size'] = p.content.size.w+'px '+p.content.size.h+'px';//-for transition, not to make blank     
            _content.style['background-repeat'] = 'no-repeat';
            _content.style['text-align'] = 'center';
            var _play = document.createElement('div');
            _play.style['line-height'] = '1em';
            _play.style['padding'] = '0';
            _play.style['border-radius'] = '50%';
            _play.style['width'] = '150px';
            _play.style['height'] = '150px';
            _play.style['background'] = '#fff';
            //_play.style['border'] = 'none';
            _play.style['display'] = 'inline-block';
            _play.style['vertical-align'] = 'middle';
            _play.style['font-size'] = '136px';
            var _ps = document.createElement('span');
            _ps.style.padding = '0 0 0 22px';
            //_ps.style.opacity = '0.9';
            _ps.innerHTML = '&#9658;';
            _play.appendChild(_ps);
            _play.style.color = '#000';
            _play.style.opacity = '0.5';
            _play.addEventListener('mouseover', function(){
                this.style.opacity = '.7';
            });
            _play.addEventListener('mouseout', function(){
                this.style.opacity = '.5';
            });
            _play.addEventListener('click', function(){
                while(_content.firstChild){
                    _content.removeChild(_content.firstChild);
                }
                _content.style.opacity = '1';
                _content.innerHTML = '<iframe src=\"'+ p.content.url +'\" width=\"'+p.content.size.w+'\" height=\"'+p.content.size.h+'\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
            });
            _content.appendChild(_play);
            break;
        case 'image':
            _content.innerHTML = '<img src=\"' + p.content.url + '\" width=\"'+p.content.size.w+'\" height=\"'+p.content.size.h+'\">';
            break;
        case 'realtime':
            _content.style['cursor'] = 'pointer';
            _content.style['background'] = 'url(\"' + p.content.dummy + '\")';
            _content.style['background-size'] = p.content.size.w+'px '+p.content.size.h+'px';            
            var _dummy = document.createElement('img');
            _dummy.src = p.content.dummy;
            _dummy.width = '800';
            _content.appendChild(_dummy);
            _dummy.addEventListener('click', function(){
                window.open(p.content.url);
            });
            break;
        default:
            break;
    }
    t.appendChild(_content);
    //-else
    for(var i = 0; i < 5; i++){
        var _title, _id;
        switch(i){
            case 0:
                _title = 'Title';
                _id = '_title';
                break;
            case 1:
                _title = 'About';
                _id = '_about';
                break
            case 2:
                    _title = 'Info';
                    _id = '_info';
                    break;
            case 3:
                    _title = 'Process';
                    _id = '_process';
                    break;
            case 4:
                    _title = 'Credit';
                    _id = '_credit';
                    break;
            default:
                    break;
        }
        var _t = document.createElement('div');
        _t.className = 'content_subject';
        var _s = document.createElement('span');
        _s.innerHTML = _title;
        _t.appendChild(_s);
        t.appendChild(_t);
        var _r = document.createElement('div');
        _r.id = _id;
        _r.className = 'content_body';
        switch(i){
            case 0:
                _r.innerHTML = p.title;
                break;
            case 1:
                for(var j = 0; j < p.about.length; j++){
                    var _p = document.createElement('p');
                    _p.innerHTML = '<font class=\'content_body_grey\'>'+ p.about[j].title + '</font>: ' + p.about[j].body;
                    _r.appendChild(_p);
                }
                break;
            case 2:
                for(var j = 0; j < p.info.length; j++){
                    switch(p.info[j].is){
                        case 'video':
                            (function(index){
                                var _div = document.createElement('div');
                                _div.style['width'] = p.info[index].size.w+'px';
                                _div.style['height'] = p.info[index].size.h+'px';
                                _div.style['line-height'] = p.info[index].size.h+'px';
                                _div.style['cursor'] = 'pointer';
                                _div.style['background'] = 'url(\"' + p.info[index].dummy + '\")';
                                _div.style['background-size'] = p.info[index].size.w+'px '+p.info[index].size.h+'px';
                                _div.style['background-repeat'] = 'no-repeat';
                                _div.style['text-align'] = 'center';
                                var _play = document.createElement('div');
                                _play.style['line-height'] = '1.09em';
                                _play.style['padding'] = '0';
                                _play.style['border-radius'] = '50%';
                                _play.style['width'] = '100px';
                                _play.style['height'] = '100px';
                                _play.style['background'] = '#fff';
                                _play.style['display'] = 'inline-block';
                                _play.style['vertical-align'] = 'middle';
                                _play.style['font-size'] = '85px';
                                var _ps = document.createElement('span');
                                _ps.style.padding = '0 0 0 16px';
                                _ps.innerHTML = '&#9658;';
                                _play.appendChild(_ps);
                                _play.style.color = '#000';
                                _play.style.opacity = '.5';
                                _play.addEventListener('mouseover', function(){
                                    this.style.opacity = '.7';
                                });
                                _play.addEventListener('mouseout', function(){
                                    this.style.opacity = '.5';
                                });
                                _play.addEventListener('click', function(){
                                    while(_div.firstChild){
                                        _div.removeChild(_div.firstChild);
                                    }
                                    _div.style.opacity = '1';
                                    _div.innerHTML = '<iframe src=\"'+ p.info[index].url +'\" width=\"'+p.info[index].size.w+'\" height=\"'+p.info[index].size.h+'\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
                                });
                                _div.appendChild(_play);
                                _r.appendChild(_div);
                            })(j);
                            break;
                        case 'image':
                            var _img = document.createElement('img');
                            _img.src = p.info[j].url;
                            _img.width = '720';
                            _r.appendChild(_img);
                            break;
                        case 'text':
                            var _p = document.createElement('p');
                            _p.innerHTML = p.info[j].p;
                            _r.appendChild(_p);
                            break;
                        default:
                            break;
                    }
                }
                break;
            case 3:
                for(var j = 0; j < p.process.length; j++){
                    switch(p.process[j].is){
                        case 'video':
                            (function(index){
                                var _div = document.createElement('div');
                                _div.style['width'] = p.process[index].size.w+'px';
                                _div.style['height'] = p.process[index].size.h+'px';
                                _div.style['line-height'] = p.process[index].size.h+'px';
                                _div.style['cursor'] = 'pointer';
                                _div.style['background'] = 'url(\"' + p.process[index].dummy + '\")';
                                _div.style['background-size'] = p.process[index].size.w+'px '+p.process[index].size.h+'px';
                                _div.style['background-repeat'] = 'no-repeat';
                                _div.style['text-align'] = 'center';
                                var _play = document.createElement('div');
                                _play.style['line-height'] = '1.09em';
                                _play.style['padding'] = '0';
                                _play.style['border-radius'] = '50%';
                                _play.style['width'] = '100px';
                                _play.style['height'] = '100px';
                                _play.style['background'] = '#fff';
                                _play.style['display'] = 'inline-block';
                                _play.style['vertical-align'] = 'middle';
                                _play.style['font-size'] = '85px';
                                var _ps = document.createElement('span');
                                _ps.style.padding = '0 0 0 16px';
                                _ps.innerHTML = '&#9658;';
                                _play.appendChild(_ps);
                                _play.style.color = '#000';
                                _play.style.opacity = '.5';
                                _play.addEventListener('mouseover', function(){
                                    this.style.opacity = '.7';
                                });
                                _play.addEventListener('mouseout', function(){
                                    this.style.opacity = '.5';
                                });
                                _play.addEventListener('click', function(){
                                    while(_div.firstChild){
                                        _div.removeChild(_div.firstChild);
                                    }
                                    _div.style.opacity = '1';
                                    _div.innerHTML = '<iframe src=\"'+ p.process[index].url +'\" width=\"'+p.process[index].size.w+'\" height=\"'+p.process[index].size.h+'\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
                                });
                                _div.appendChild(_play);
                                _r.appendChild(_div);
                            })(j);
                            break;
                        case 'image':
                            var _img = document.createElement('img');
                            _img.src = p.process[j].url;
                            _img.width = '720';
                            _r.appendChild(_img);
                            break;
                        case 'text':
                            var _p = document.createElement('p');
                            _p.innerHTML = p.process[j].p;
                            _r.appendChild(_p);
                            break;
                        default:
                            break;
                    }
                }
                break;
            case 4:
                for(var j = 0; j < p.credit.length; j++){
                    var _p = document.createElement('p');
                    _p.innerHTML = '<font class=\'content_body_grey\'>'+ p.credit[j].role + '</font>: ' + p.credit[j].credit;
                    _r.appendChild(_p);
                }
                break;
            default:
                break;
        }
        t.appendChild(_r);
    }
    //-github source
    if(p.github !== ''){
        var _source = document.createElement('div');
        _source.className = 'content_subject';
        var _source_p = document.createElement('span');
        _source_p.innerHTML = 'Source';
        _source.appendChild(_source_p);
        t.appendChild(_source);
        var _source_body = document.createElement('div');
        _source_body.id = '_github';
        _source_body.className = 'content_body';
        _source_body.innerHTML = '<a href='+p.github+' target=\'_blank\'>github</a>'
            t.appendChild(_source_body);
    }

    //-navigate
    t.style['display'] = 'block';
    ct = 'works_content_container';
    isNavigate = true;
    isDown = true;
};

/* sort works*/
var isSorting = /selected_works/g; 
//var isSorting = '';
var sort_works = function(){
    var data = mJson['projects'];
    var works = document.getElementsByClassName('ui_grid');
    for(var i = 0; i < data.length; i++){
        //-hide all first
        works[i].style.display = 'none';
        //console.log(works[i].style.display);
        //-compare
        var root = data[i].category;
        var target = root.match(isSorting);
        //console.log(target, isSorting, root);
        //-sort
        if(target){
            //console.log(target[0]);
            switch(target[0]){
                case 'selected_works':
                    works[i].style.display = 'inline-block';
                    break;
                case 'creative_coding':
                    works[i].style.display = 'inline-block';
                    break;
                case '3d_mapping':
                    works[i].style.display = 'inline-block';
                    break;
                case 'video_works':
                    works[i].style.display = 'inline-block';
                    break;
                case 'motion_graphic':
                    works[i].style.display = 'inline-block';
                    break;
                case 'graphic_design':
                    works[i].style.display = 'inline-block';
                    break;
                case 'show_all':
                    works[i].style.display = 'inline-block';
                    break;
                default: 
                    break;
            }
        }
    }
};

/* get works page */
var get_works = function(){
    var t = document.getElementById('works_ui_container');
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
        t.innerHTML += scriptNode;
    }
};

/* get header */
var get_header = function(){
    var t = document.getElementById('header');
    var menus = document.getElementsByClassName('menu');
    /*
     *  0: about
     *  1: works
     *  2: #selected-works
     *  3: #creative-coding
     *  4: 3d-mapping
     *  5: video-works
     *  6: motion-graphics
     *  7: graphic-design
     *  8: show-all
     *  9: contact
     */
    var about = menus[0];
    var works = menus[1];
    var contact = menus[9];
    var numCategory = 7;
    //-about
    about.addEventListener('click', function(){
        works.style['text-decoration'] = 'none';
        contact.style['text-decoration'] = 'none';
        this.style['text-decoration'] = 'line-through';

        for(var i=0;i<numCategory;i++){
            menus[i+2].style['text-decoration'] = 'none';
        }
    });
    //-works
    works.addEventListener('click', function(){
        about.style['text-decoration'] = 'none';
        contact.style['text-decoration'] = 'none';
        this.style['text-decoration'] = 'line-through';
    });
    //-contact
    contact.addEventListener('click', function(){
        about.style['text-decoration'] = 'none';
        works.style['text-decoration'] = 'none';
        this.style['text-decoration'] = 'line-through';

        for(var i=0;i<numCategory;i++){
            menus[i+2].style['text-decoration'] = 'none';
        }
    });
    //-set sorting
    for(var i=0;i<numCategory;i++){
        (function(index){
            menus[index+2].addEventListener('click', function(){
                about.style['text-decoration'] = 'none';
                works.style['text-decoration'] = 'line-through';
                contact.style['text-decoration'] = 'none';
                for(var j=0;j<numCategory;j++){
                    if(j!=index){
                        menus[j+2].style['text-decoration'] = 'none';
                    }
                }
                this.style['text-decoration'] = 'line-through';
                isSorting = new RegExp(menus[index+2].id, 'g');
                sort_works();
            });
        })(i);
    }
};

/* animate */
var animate = function(){
    window.requestAnimationFrame(animate);
    if(isNavigate){
        //-do navigation!!
        switch(ct){
            case 'landing_container':
                if(isUp){go_about(ct);}
                break;
            case 'about_img':
                if(isUp){go_works(ct);}
                else if(isDown){go_landing(ct);}
                break;
            case 'works_container':
                if(isDown){go_about(ct);}
                break;
            case '':
                if(isDown){go_about(ct);}
                break;
            case 'works_ui_container':
                if(isDown){go_about(ct);}
                break;
            case 'works_content_container':
                if(isUp){go_works(ct);}
                else if(isDown){go_content(ct);}
                break;
            default:
                break;
        }
        //console.log('isNavi: ',isNavigate,', isUp: ',isUp,', isDown: ',isDown);
    }

    switch(isBg){
        case 'show':
            show_content_bg();
            break;
        case 'hide':
            hide_content_bg();
            break;
        default:
            break;
    }
};  

/* init */
var init = function(){
    get_window_ratio();
    animate();
    get_header();
    get_landing();
    get_about();
    get_works();
    isInit = true;
};

//-initializer when doms are loaded
document.addEventListener('DOMContentLoaded', init, false);
//-detect window size for responsive style
window.addEventListener('resize', get_window_ratio, false);
//-detect wheel event 
window.addEventListener('wheel', wheel_optimize, false);


