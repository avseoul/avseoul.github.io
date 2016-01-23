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
var pv=0;
var isWheel;
var window_w, window_h;
var wf=0, cL=0, nL=0, isOn = false;//-for wheel event
var ct='';

/* navigate page */
var go_landing = function(current_target){
    var _ct = current_target;
    var _t = document.getElementById('landing_container');
    wheel_page_down(_t);
    //console.log('go_landing');
};  
var go_about = function(current_target){
    var _ct = current_target;
    var _t;
    if(_ct == 'landing_container'){
        _t = document.getElementById('landing_container');
        wheel_page_up(_t);
    }else if(_ct == 'works_container'){
        _t = document.getElementById('about_container');
        wheel_page_down(_t);
    }
    //console.log('go_about');
};
var go_works = function(current_target){
    var _ct = current_target;
    var _t = document.getElementById('about_container');
    wheel_page_up(_t);
    //console.log('go_works');
};


/* wheel event controller */
var wheel_page_up = function(_t){
    //console.log(_t.style['top']);
    cL = parseFloat(_t.style['top']);
    //console.log(cL);
    if(!isOn && cL<99999){nL = parseFloat(_t.style['top']);isOn=true;}
    if(nL < (window_h*-.7)){         //3.-ease out
        nL -= (window_h + cL) * .25; 
    }else if(nL > (window_h*-.1)){   //1.-ease in
        nL += wf*.05;
    }else{                           //2.-ease
        nL -= (window_h + cL) * .13;
    }
    if(nL < (-1*window_h+1)){        //4.-settle
        nL = -1*window_h; 
        wheel_reset();
    }
    _t.style['top'] = nL.toString() + 'px';
};
var wheel_page_down = function(_t){
    cL = parseFloat(_t.style['top']);
    if(!isOn && cL<99999){nL = parseFloat(_t.style['top']);isOn=true;}
    if(nL > (window_h*-.7)){        //2.-ease out
        nL += cL * -.13;
    }else{                          //1.-ease
        nL +=  cL * -.03;          
    }
    if(nL > -1){                    //3.-settle
        nL = 0; 
        wheel_reset();
    }
    _t.style['top'] = nL.toString() + 'px';
};
var wheel_reset = function(){
        isUp = false;
        isDown = false;
        isOn = false;
        isNavigate = false;
        cL = 99999999;
};
var wheel_event_trigger = function(event){
    if(event !== null){     
        wf = event.wheelDeltaY;
        if(wf>3){wf=0;}//-constrain trackpad value
        if(!isNavigate && wf != 0){ 
            ct = event.srcElement.id;
            console.log('ct: ',ct);
            if(wf<0 && ct !== 'works_container'){//-not for last page
                isNavigate = true;
                isUp=true;
            }else if(wf>0 && ct !== 'landing_container'){//-not for first page
                isNavigate = true;
                isDown=true;
            }
        }
    }
    //-do navigation!!
    if(ct == 'landing_container' && isUp){go_about(ct);}
    else if(ct == 'about_img' && isUp){go_works(ct);}
    else if(ct == 'about_img' && isDown){go_landing(ct);}
    else if(ct == 'works_container' && isDown){go_about(ct);}
};
var wheel_optimize = function(event){
    var v = Math.abs(event.wheelDeltaY);
    if(v>pv){ //-prevent unnecessary fire from trackpad
        wheel_event_trigger(event);
    }
    //console.log('pv: ',pv,', v: ',v);
    pv = v; //-pv will be reset when wheel_event is done for next event
    clearTimeout(isWheel);
    //-after 100ms reset pv and isNavigate
    isWheel = setTimeout(function() {
        if(!isUp && !isDown){
            pv = 0;
            isNavigate = false; //-for safety
            console.log(pv, isNavigate);
        }
        //console.log('setTimeout working');
    }, 100);
};

/* get new image location */
var getImgLoc = function(w,h){
    var s = [2];
    if(isInit){
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
    var t = document.getElementById('container');
    //-create contianer div for img 
    var l_c = document.createElement('div');
    l_c.style['top'] = '0px';
    l_c.id = 'landing_container';

    t.appendChild(l_c);
};

/* get about page */
var get_about = function(){
    //-get container
    var t = document.getElementById('container');
    //-create contianer div 
    var a_c = document.createElement('div');
    a_c.id = 'about_container';
    a_c.style['top'] = '0px';
    //-create img dom
    var a_i = document.createElement('img');
    a_i.id = 'about_img';
    a_i.src = 'img/profile.jpg';
    if(isPortrait){
        a_i.style['width'] = 'auto';
        a_i.style['height'] = '100vh';
    }else{
        a_i.style['width'] = '100vw';
        a_i.style['height'] = 'auto';
    }
    var nL = getImgLoc(a_i.clientWidth, a_i.clientHeight);
    a_i.style['margin-left'] = nL[0].toString() + 'px';
    a_i.style['margin-top'] = nL[1].toString() + 'px';
    a_c.appendChild(a_i);
    var a_d1 = document.createElement('div');
    a_d1.id = 'about_d1';
    a_d1.style['margin'] = '0 auto';
    a_d1.style['position'] = 'absolute';
    a_d1.style['top'] = '0px';
    a_d1.style['width'] = '70vw';
    a_d1.style['color'] = '#fafafa';
    a_d1.className = 'title';
    a_d1.innerHTML = '_about';
    a_c.appendChild(a_d1);
    var a_d2 = document.createElement('div');
    a_d2.id = 'about_d2';
    a_d2.style['margin'] = '0 auto';
    a_d2.style['position'] = 'absolute';
    a_d2.style['top'] = '0px';
    a_d2.style['width'] = '70vw';
    a_d2.style['color'] = '#fafafa';
    a_d2.innerHTML = a_d2_content;
    a_c.appendChild(a_d2);

    t.appendChild(a_c);
};

/* get about page */
var get_works = function(){
    //-get container
    var t = document.getElementById('container');
    //-create contianer div 
    var w_c = document.createElement('div');
    w_c.id = 'works_container';
    w_c.style['top'] = '0px';
    
    t.appendChild(w_c);
};

/* get footer */
var get_footer = function(){
    var t = document.getElementById('footer');     
};

/* get header */
var get_header = function(){
    var t = document.getElementById('header');
};

/* animate */
var animate = function(){
    window.requestAnimationFrame(animate);
    if(isNavigate){
        wheel_event_trigger(null);//-to clear wheel event for accident
        console.log('isNavi: ',isNavigate,', isUp: ',isUp,', isDown: ',isDown);
    }
};

/* init */
var init = function(){
    animate();
    get_window_ratio();
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


