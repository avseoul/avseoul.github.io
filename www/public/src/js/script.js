/* get json and store into varible */
var mJson;
var xmlhttp = new XMLHttpRequest();
xmlhttp.open('GET', '/data', true);
xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4) {
        if(xmlhttp.status == 200) {
            mJson = JSON.parse(xmlhttp.responseText);
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
            if(ct!=='footer'&&ct!=='header'){
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
    var t = document.getElementById('works_content_container');
    var t_nt = document.getElementById('works_container').scrollTop-window_h;
    t.style['top'] = t_nt.toString()+'px';
    var close = document.createElement('div');
    close.style['position'] = 'absolute';
    close.style['right'] = '10px';
    close.style['top'] = '10px';
    close.innerHTML = '&#215;';
    close.style['width'] = '20px';
    close.style['height'] = '20px';
    close.style['cursor'] = 'pointer';
    close.style['font-size'] = '60px';
    close.style['z-index'] = '10000';
    close.style['background'] = 'red';
    close.addEventListener('mouseover', function(){
        close.style['color'] = '#ddd';
    });
    close.addEventListener('mouseout', function(){
        close.style['color'] = '#333';
    });
    close.addEventListener('click', function(){
        ct = 'works_content_container';
        isNavigate = true;
        isUp = true;   
    });
    t.appendChild(close);

    //-build up doms 
    var p = mJson['projects'][_id];
    //-content
    var r1 = document.getElementById('_content');
    r1.innerHTML = '';
    while(r1.firstChild){r1.removeChild(r1.firstChild);}
    r1.innerHTML = p.content;
    t.appendChild(r1);
    //-title
    var r2 = document.getElementById('_title');
    r2.innerHTML = '';
    while(r2.firstChild){r2.removeChild(r2.firstChild);}
    r2.innerHTML = p.title;
    t.appendChild(r2);
    //-about
    var r3 = document.getElementById('_about');
    r3.innerHTML = '';
    while(r3.firstChild){r3.removeChild(r3.firstChild);}
    for(var i = 0; i < p.about.length; i++){
        var _p = document.createElement('p');
        _p.innerHTML = p.about[i].title + ': ' + p.about[i].body;
        r3.appendChild(_p);
    }
    t.appendChild(r3);
    //-info
    var r4 = document.getElementById('_info');
    r4.innerHTML = '';
    while(r4.firstChild){r4.removeChild(r4.firstChild);}
    for(var i = 0; i < p.info.length; i++){
        var _p = document.createElement('p');
        _p.innerHTML = p.info[i].paragraph;
        r4.appendChild(_p);
    }
    t.appendChild(r4);
    //-process
    var r5 = document.getElementById('_process');
    r5.innerHTML = '';
    while(r5.firstChild){r5.removeChild(r5.firstChild);}
    for(var i = 0; i < p.process.length; i++){
        var _p = document.createElement('p');
        _p.innerHTML = p.process[i].paragraph;
        r5.appendChild(_p);
    }
    t.appendChild(r5);
    //-credit
    var r6 = document.getElementById('_credit');
    r6.innerHTML = '';
    while(r6.firstChild){r6.removeChild(r6.firstChild);}
    for(var i = 0; i < p.credit.length; i++){
        var _p = document.createElement('p');
        _p.innerHTML = p.credit[i].role + ': '+
            p.credit[i].credit;
        r6.appendChild(_p);
    }
    t.appendChild(r6);
    //-github
    var r7 = document.getElementById('_github');
    r7.innerHTML = '';
    while(r7.firstChild){r7.removeChild(r7.firstChild);}
    r7.innerHTML = p.github;
    t.appendChild(r7);


    //-navigate
    t.style['display'] = 'block';
    ct = 'works_content_container';
    isNavigate = true;
    isDown = true;
};

/* get works page */
var get_works = function(){
    //-get container
    var t = document.getElementById('works_container');
    t.style['top'] = '0px';
};

/* get footer */
var get_footer = function(){
    var t = document.getElementById('footer');     
    t.style['top'] = '0px';
};

/* get header */
var get_header = function(){
    var t = document.getElementById('header');
    t.style['top'] = '0px';
};

/* animate */
var animate = function(){
    window.requestAnimationFrame(animate);
    if(isNavigate){
        //-do navigation!!
        if(ct == 'landing_container' && isUp){go_about(ct);}
        else if(ct == 'about_img' && isUp){go_works(ct);}
        else if(ct == 'about_img' && isDown){go_landing(ct);}
        else if(ct == 'works_container' || ct === '' || ct ==='works_ui_container'){
            if(isDown){go_about(ct);}
        }else if(ct === 'works_content_container' && isDown){go_content(ct);}
        else if(ct === 'works_content_container' && isUp){go_works(ct);}
        //console.log('isNavi: ',isNavigate,', isUp: ',isUp,', isDown: ',isDown);
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
    get_footer();
    isInit = true;
};

//-initializer when doms are loaded
document.addEventListener('DOMContentLoaded', init, false);
//-detect window size for responsive style
window.addEventListener('resize', get_window_ratio, false);
//-detect wheel event 
window.addEventListener('wheel', wheel_optimize, false);

