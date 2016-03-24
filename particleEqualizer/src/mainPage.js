var isMobile = false;
(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))isMobile = true})(navigator.userAgent||navigator.vendor||window.opera);

/* check framedrops */
var isLow = false;
var resume = function(){
    isLow = false;

    var b = document.getElementById('isLow_bg');
    document.body.removeChild(b);
    var c = document.getElementById('isLow_container');
    document.body.removeChild(c);

    audioNode.mediaElement.play();
    isPlaying = true;
};
var lfnt_bg_opacity = 0;
var lfnt_ct_opacity = 0;
var lfnt_boolean = false;
var lowFrameNotiTransition = function(){
    var bg = document.getElementById('isLow_bg');
    bg.style['opacity'] = lfnt_bg_opacity.toString();
    var container = document.getElementById('isLow_container');
    container.style['opacity'] = lfnt_ct_opacity.toString();
    var pos = (1-lfnt_ct_opacity/.9) * 100; 
    container.style['top'] = pos.toString();
    var vol = 1-lfnt_ct_opacity/.9;
    mAudio.volume = vol;
    lfnt_bg_opacity += .04;
    var t = .9-lfnt_ct_opacity;
    lfnt_ct_opacity += t*.1;
    if(lfnt_bg_opacity > .6){
        lfnt_bg_opacity = .6;
    }   
    if(lfnt_ct_opacity > .89){
        lfnt_ct_opacity = .9;
        audioNode.mediaElement.pause();
        mAudio.volume = 1;
        lfnt_boolean = true;
    }
};
var lowFrameNoti = function(){
    var bg = document.getElementById('isLow_bg');
    bg.style['z-index'] = '1999';
    var container = document.getElementById('isLow_container');
    container.style['z-index'] = '2000';
    lowFrameNotiTransition();
};
var preLoadlowFrameNoti = function(){
    var bg = document.createElement('div');
    bg.id = 'isLow_bg';
    bg.addEventListener('click', resume);
    bg.style['width'] = '100%';
    bg.style['height'] = '100%';
    bg.style['background'] = '#000';
    bg.style['position'] = 'absolute';
    bg.style['top'] = '0';
    bg.style['bottom'] = '0';
    bg.style['left'] = '0';
    bg.style['right'] = '0';
    bg.style['margin'] = 'auto';
    bg.style['z-index'] = '-1';
    bg.style['opacity'] = '.5';
    var container = document.createElement('div');
    container.id = 'isLow_container';
    container.style['width'] = '400px';
    container.style['height'] = '600px';
    container.style['background'] = '#fff';
    container.style['position'] = 'absolute';
    container.style['top'] = '100';
    container.style['bottom'] = '0';
    container.style['left'] = '0';
    container.style['right'] = '0';
    container.style['margin'] = 'auto';
    container.style['z-index'] = '-1';
    container.style['opacity'] = '.8';

    var notification_a = document.createElement('div');
    notification_a.style['font-size'] = '11px';
    notification_a.style['padding'] = '5px';
    notification_a.innerHTML = 
        '<br>I\'m sorry,<br><br>'+
        'Unfortunately, it has shown the framerate is under 25fps on your browser.'+
        'You can try it with low frame rates by ignoring this message'+
        ' or check out the video instead.'+
        '<p>&#x20;</p>';
    container.appendChild(notification_a);

    var videoPlayer = document.createElement('div');
    videoPlayer.innerHTML = '<iframe src="https://player.vimeo.com/video/152375642" width="400" height="255" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
    container.appendChild(videoPlayer);

    var notification_b = document.createElement('div');
    notification_b.style['font-size'] = '11px';
    notification_b.style['padding'] = '5px';
    notification_b.innerHTML = 
        '<p>&#x20;</p>'+
        'If you have any question, please contact me at any time, it will be my pleasure.<br><br>'+
        'Contact info is the following, <br>'+
        '<a href="javascript:contactMe()" target="_blank">av.seoul@gmail.com</a> <br>'+
        '<a href="https://github.com/avseoul" target="_blank">github.com/avseoul</a> <br>'+
        '<a href="https://twitter.com/avseoul" target="_blank">twitter.com/avseoul<a> <br>'+
        '<a href="https://vimeo.com/visualozik" target="_blank">vimeo.com/visualozik</a><br>'+
        '<a href="http://kimsehyun.kr" target="_blank">kimsehyun.kr</a><br><br>'+
        'Sorry for your any inconvenience.<br><br>'+
        'All the best,<br>'+
        'av';
    container.appendChild(notification_b);

    var close = document.createElement('div');
    close.innerHTML = '&#215;';
    close.style['cursor'] = 'pointer';
    close.style['position'] = 'absolute';
    close.style['right'] = '5px';
    close.style['top'] = '0px';
    close.style['color'] = '#888';
    close.addEventListener('mouseover', function(){
        close.style['color'] = '#f00';
    });
    close.addEventListener('mouseout', function(){
        close.style['color'] = '#888';
    });
    close.addEventListener('click', resume);
    container.appendChild(close);

    document.body.appendChild(bg);
    document.body.appendChild(container);
};

var lD = new Date;
var fdct = 0;
var fdcb = false;
var pFps = 0;
var checkFramedrops = function(){
    var tD = new Date;
    var fps = 1000/(tD-lD);
    lD = tD;

    if (fdct < 180){
        fdct++;
    } else {
        fdcb = true;
    }
    
    if (fdct > 150){
        if(fps < 25 && pFps < 25 && !fdcb){
            isLow = true;
            fdcb = true;
            lowFrameNoti();
        }
    }
    pFps = fps;
};

/**/
var sendEmail = function(){
    var address = document.getElementById('emailAddress').value;
    var subject = 'Particle Equalizer #1';
    var content = 'Thanks for checking out Particle Equalizer #1. Please check the link below, \n\n'+
        'bit.do/particleEQ\n\n'+
        'Particle Equalizer #1 currently only supports chrome browser for desktop. Will be supporting other browsers soon. \n' +
        'If you have any question, please contact me at anytime, it would be my pleasure.\n\n'+ 
        'Contact info is the following, \n'+
        'av.seoul@gmail.com \n'+
        'github.com/avseoul \n'+
        'twitter.com/avseoul \n'+
        'vimeo.com/visualozik \n'+
        'kimsehyun.kr\n\n'+
        'All the best,\n'+
        'av';
    document.location.href = "mailto:" + address + "?subject="
        + encodeURIComponent(subject)
        + "&body=" + encodeURIComponent(content);
};
var contactMe = function(){
    document.location.href = "mailto:av.seoul@gmail.com";
};
var mobileNoti = function(){
    var p = document.getElementById('bgm');
    p.style['background'] = 'none';
    var d1 = document.getElementById('description');
    while(d1.firstChild){
        d1.removeChild(d1.firstChild);
    }
    var d2 =document.getElementById('project-info');
    while(d2.firstChild){
        d2.removeChild(d2.firstChild);
    }
    var d3 =document.getElementById('contact-info');
    while(d3.firstChild){
        d3.removeChild(d3.firstChild);
    }
    var d4 = document.getElementById('project-title');
    while(d4.firstChild){
        d4.removeChild(d4.firstChild);
    }

    var container = document.createElement('div');
    container.style['width'] = '300px';
    container.style['background'] = '#fff';
    container.style['position'] = 'absolute';
    container.style['top'] = '0';
    container.style['bottom'] = '0';
    container.style['left'] = '0';
    container.style['right'] = '0';
    container.style['margin'] = 'auto';
    container.style['z-index'] = '2000';
    container.style['opacity'] = '0.8';
    container.style['overflow'] = 'hidden';

    var videoPlayer = document.createElement('div');
    videoPlayer.innerHTML = '<iframe src="https://player.vimeo.com/video/152375642" width="300" height="auto" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
    container.appendChild(videoPlayer);

    var notification_a = document.createElement('div');
    notification_a.style['font-size'] = '11px';
    notification_a.style['padding'] = '5px';
    notification_a.innerHTML = 
        'Particle Equalizer #1 currently only supports chrome for desktop.<br><br>'+ 
        'Please check out the video instead or leave your email address then I will send you the link for you to check this app later on your computer.<br>';
    container.appendChild(notification_a);

    var inputContainer = document.createElement('div');
    inputContainer.style['padding'] = '5px';
    var input = document.createElement('input');
    input.style['width'] = '240px';
    input.id = 'emailAddress';
    input.addEventListener('keypress', function(event){
        var key = event.which || event.keyCode;
        if(key === 13)
            sendEmail();
    });
    var submit = document.createElement('button');
    submit.style['width'] = '50px';
    submit.innerHTML = 'send';
    inputContainer.appendChild(input);
    inputContainer.appendChild(submit);
    submit.addEventListener('click', sendEmail);
    container.appendChild(inputContainer);

    var notification_b = document.createElement('div');
    notification_b.style['font-size'] = '11px';
    notification_b.style['padding'] = '5px';
    notification_b.innerHTML = 
        'If you have any question, please contact me at any time, it will be my pleasure.<br><br>'+
        'Contact info is the following, <br>'+
        '<a href="javascript:contactMe()" target="_blank">av.seoul@gmail.com</a> <br>'+
        '<a href="https://github.com/avseoul" target="_blank">github.com/avseoul</a> <br>'+
        '<a href="https://twitter.com/avseoul" target="_blank">twitter.com/avseoul<a> <br>'+
        '<a href="https://vimeo.com/visualozik" target="_blank">vimeo.com/visualozik</a><br>'+
        '<a href="http://kimsehyun.kr" target="_blank">kimsehyun.kr</a><br><br>'+
        'Sorry for your any inconvenience.<br><br>'+
        'All the best,<br>'+
        'av';
    container.appendChild(notification_b);

    document.body.appendChild(container);
};

SC.initialize({
    client_id: '1c78c29753054d2e9af8926dd4a77db3'
});


/* --------------------------------------------------------- */
var mTracks = ['/tracks/222734029',     //Everything and Nothing - dj krush
    '/tracks/161617178',                //KINGMCK - Don't Get Dead Mix 'BRAIN FREEZE 2014'
    '/tracks/82429092',                 //The Notorious B.I.G. tribute mix by YTst
    '/tracks/199658320',                //SEOUL SIMIN [009] 깐돌 Qunadol - Gently Disappear
    '/tracks/194237965',                //Cannibal Ox - Iron Galaxy (Cold Vein)
    '/tracks/220662300',                //Strange Light - dj krush 
    '/tracks/69174621',                 //Donna Summer - I Feel Love (Sterac instrumental dub edit)
    '/tracks/38732269',                 //Lafayette Afro-Rock Band / Hihache(1973)
    '/tracks/14976296',                 //Andre Nickatina Jungle (f. Equipto)
    '/tracks/221995257',                //Missing Link - dj krush
    '/tracks/228635781',                //Art of Noise - Moments in Love
    '/tracks/157010180',                //venice venture - big wild
    '/tracks/96379023'                  //Disclosure - You & Me (Flume Remix)
];
//var mTracks = ['/tracks/96379023'];                  //Disclosure - You & Me (Flume Remix)
var selector = 0;
var mAudio = new Audio(); //-for web-audio api
mAudio.crossOrigin = "anonymous"; 
var user = [], userProfile = [], permalink = [], title = [], imgUrl = [], stream = [], duration = [];
//mAudio.loop = true;
var isPlaying = true;
/* --------------------------------------------------------- */

/* navigation */
var gO = .8, oO = .08;
var isNav = false;
var naviUpdate = function(){
    //-get doms 
    var d1 = document.getElementById('project-title');
    var d2 = document.getElementById('description');
    var d3 = document.getElementById('project-info');
    var d4 = document.getElementById('contact-info');
    var d5 = document.getElementById('bgm');
    //-get new position based on opacity 0.~.8
    var d1_gP = gO*1.25*90-80;//-80~15
    var d2_gP = gO*1.25*115-90;//-90~25
    var d3_gP = gO*1.25*115-90;
    var d4_gP = gO*1.25*115-90;
    var d5_gP = gO*1.25*115-90;
    //-update it
    d1.style['opacity'] = gO.toString();
    d1.style['top'] = d1_gP.toString();
    d2.style['opacity'] = gO.toString();
    d2.style['bottom'] = d2_gP.toString();
    d3.style['opacity'] = gO.toString();
    d3.style['bottom'] = d3_gP.toString();
    d4.style['opacity'] = gO.toString();
    d4.style['bottom'] = d4_gP.toString();
    d5.style['opacity'] = gO.toString();
    d5.style['bottom'] = d5_gP.toString();
};
var navigation = function(event){
    var trigger = event.wheelDeltaY;
    if(event.srcElement.id == 'mCanvas')
        if(trigger > 0){
            var nO = 0.-gO;
            gO += nO*oO;
            if(gO < 0.02){ //-stop when it approach to edge
                gO = 0.;
            }
        }else if(trigger < 0){
            var nO = .8-gO;
            gO += nO*oO;
            if(gO > .78){ //-stop when it approach to edge
                gO = .8;
            }
        }
    naviUpdate();
};

/* to convert duration to time code */
var toTimer = function (duration) {
    var sec_num = duration;
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = Math.floor(sec_num - (hours * 3600) - (minutes * 60));

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    return time;
};

//-get progress bar for ui
var pBarIntervar;
var getProgressBar = function(){
    mBar = document.getElementById('pBar');
    mTime = document.getElementById('pTime');
    var progress = mAudio.currentTime*1000/duration[selector] * 170;
    mBar.style.width = progress;
    if(mAudio.currentTime){
        mTime.innerHTML = toTimer(mAudio.currentTime);
    }else{
        mTime.innerHTML = '00:00:00';
    }
};
//-playback control by progress bar
var playbackControl = function(event){
    var input = event.offsetX;
    mAudio.currentTime = input/170*duration[selector]/1000;
    getProgressBar();
};
//-store tracks info
var getTracks = function(){
    for(var i = 0; i < mTracks.length; i++){
        SC.get(mTracks[i]).then(function(track){
            user.push(track.user.username);
            userProfile.push(track.user.permalink_url);
            permalink.push(track.permalink_url);
            title.push(track.title);
            if(track.artwork_url){
                imgUrl.push(track.artwork_url);
            }else{
                imgUrl.push('img/noThumbnail.jpg');
            }
            stream.push(track.stream_url);
            duration.push(track.duration);
        });
    }
};
//-add track to the list
var addTrack = function(track_url){
    var mRegex = new RegExp('^https?://soundcloud.com');
    if(mRegex.test(track_url)){
        if(track_url.indexOf('sets/')>-1){//-single set
            SC.resolve(track_url).then(function(_track){
                var arr = _track.tracks;
                for(var i = 0; i < arr.length; i++){
                    user.push(arr[i].user.username);
                    userProfile.push(arr[i].user.permalink_url);
                    permalink.push(arr[i].permalink_url);
                    title.push(arr[i].title);
                    imgUrl.push(arr[i].artwork_url);
                    stream.push(arr[i].stream_url);
                    duration.push(arr[i].duration);
                }
                selector = user.length-arr.length;
                playTracks();
            });
        } else if (track_url.indexOf('sets')>-1){//-multiple sets 
            SC.resolve(track_url).then(function(_track){
                var counter = 0;
                for(var i = 0; i < _track.length; i++){
                    var arr = _track[i].tracks;
                    for(var j = 0; j < arr.length; j++){
                        user.push(arr[j].user.username);
                        userProfile.push(arr[j].user.permalink_url);
                        permalink.push(arr[j].permalink_url);
                        title.push(arr[j].title);
                        imgUrl.push(arr[j].artwork_url);
                        stream.push(arr[j].stream_url);
                        duration.push(arr[j].duration);
                        counter++;
                    }
                }
                selector = user.length-counter;
                playTracks();
            });
        } else if (track_url.indexOf('tracks')>-1){//-multiple tracks 
            SC.resolve(track_url).then(function(_track){
                for(var i = 0; i < _track.length; i++){
                    user.push(_track[i].user.username);
                    userProfile.push(_track[i].user.permalink_url);
                    permalink.push(_track[i].permalink_url);
                    title.push(_track[i].title);
                    imgUrl.push(_track[i].artwork_url);
                    stream.push(_track[i].stream_url);
                    duration.push(_track[i].duration);
                }
                selector = user.length-_track.length;
                playTracks();
            });
        } else {
            SC.resolve(track_url).then(function(_track){//-single track
                user.push(_track.user.username);
                userProfile.push(_track.user.permalink_url);
                permalink.push(_track.permalink_url);
                title.push(_track.title);
                imgUrl.push(_track.artwork_url);
                stream.push(_track.stream_url);
                duration.push(_track.duration);

                selector = user.length-1;
                playTracks();
            });
        }
    }else{
        alert('url not valid');
    }
};
//-build up player
var setPlayer = function(){
    //-set player
    var t = document.getElementById('player-here');
    while(t.firstChild){
        t.removeChild(t.firstChild);
    }
    var mThumb = document.createElement('div');
    mThumb.id = 'mThumb';
    var mImg = document.createElement('img');
    mImg.id = 'mImg';
    mImg.src = imgUrl[selector];
    mImg.addEventListener('click',function(){
        window.open(permalink[selector]);
    });
    var mLink = document.createElement('a');
    mLink.id = 'mLink';
    mLink.setAttribute('href', permalink[selector]);
    mLink.target = '_blank';
    mLink.innerHTML = title[selector];
    var mUsrLink = document.createElement('a');
    mUsrLink.id = 'mUsrLink';
    mUsrLink.setAttribute('href', userProfile[selector]);
    mUsrLink.target = '_blank';
    mUsrLink.innerHTML = ' by ' + user[selector];
    var mLogo = document.createElement('img');
    mLogo.id = 'mLogo';
    mLogo.src = 'img/logo_s.png';
    mLogo.addEventListener('click',function(){
        window.open(permalink[selector]);
    });
    /*
       var mCredit = document.createElement('div');
       mCredit.id = 'mCredit';
       mCredit.innerHTML = 'designed by <a href="http://kimsehyun.kr" target="_blank">av</a>'
       */
    var mUI = document.createElement('span');
    mUI.id = 'mUI';
    var play = document.createElement('span');
    play.innerHTML = '&#9658;';
    play.id = 'play';
    play.addEventListener('click', function(){
        if(!isPlaying)
            audioNode.mediaElement.play();
        isPlaying = true;
    });
    var stop = document.createElement('span');
    stop.innerHTML = '&#10073;&#10073;';
    stop.id = 'stop';
    stop.addEventListener('click', function(){
        if(isPlaying)
            audioNode.mediaElement.pause();
        isPlaying = false;
    });
    var bar = document.createElement('div');
    bar.id = 'bar';
    var pBar = document.createElement('div');
    pBar.id = 'pBar';
    var cBar = document.createElement('div');
    cBar.id = 'cBar';
    var pTime = document.createElement('div');
    pTime.id = 'pTime';
    //-cal progress the width of bar is 170px set in css
    pBarIntervar = setInterval(getProgressBar, 200);
    //-add onclikc event
    cBar.addEventListener('click', playbackControl);

    //-get new track from soundcloud url
    var input = document.createElement('input');
    input.id = 'input';
    input.value = 'paste soundcloud url';
    input.addEventListener('focus', function(){
        this.value = '';
    });
    input.addEventListener('focusout', function(){
        if(this.value == '' || this.value == ' ' || this.value == '   '){
            this.value = 'paste soundcloud url';
        }
    });
    input.addEventListener('keypress', function(event){
        var key = event.which || event.keyCode;
        if(key === 13 && this.value != 'paste soundcloud url'){
            var track_url = input.value;
            addTrack(track_url);
        }
    });
    var button = document.createElement('div');
    button.id = 'button';
    button.innerHTML = '+';
    button.addEventListener('click', function(){
        var track_url = input.value;
        addTrack(track_url);
    });

    //-get list
    var list = document.createElement('div');
    list.id = 'list';
    for(var i = 0; i < user.length; i++){
        var _user = document.createElement('div');
        _user.className = 'user';
        _user.innerHTML = ' <a href="' + permalink[i] + '" target="_blank">' + user[i]+'</a>';
        _title = document.createElement('div');
        _title.className = 'title';
        _title.id = i;
        _title.addEventListener('click', navTracks);
        _title.addEventListener('mouseover', function(){
            this.style.color = '#fff';
        });
        _title.addEventListener('mouseout', function(){
            if(this.id != selector){
                this.style.color = '#888';
            }else{
                this.style.color = '#fff';
            }
        });
        if(i == selector){
            _title.style.color = '#fff';
            _user.style.color = '#ddd';
        }else{
            _title.style.color = '888';
            _user.style.color = '#888';
        }
        _title.innerHTML = title[i];
        list.appendChild(_title);
        list.appendChild(_user);
    }

    mUI.appendChild(play);
    mUI.appendChild(stop);
    mUI.appendChild(bar);
    mUI.appendChild(pBar);
    mUI.appendChild(cBar);
    mUI.appendChild(pTime);
    mThumb.appendChild(mImg);
    t.appendChild(mThumb);
    t.appendChild(mLink);
    t.appendChild(mUsrLink);
    t.appendChild(mUI);
    t.appendChild(list);
    t.appendChild(input);
    t.appendChild(button);
    t.appendChild(mLogo);
};
//-navigate tracks
var navTracks = function(){
    selector = this.id;
    playTracks();
};

//-stream track
var playTracks = function(){
    isPlaying = true;
    mAudio.src = stream[selector]+'?client_id=1c78c29753054d2e9af8926dd4a77db3';
    setPlayer();
    audioNode.mediaElement.play();//-web audio audioInput.js
};
var interval;
var checkArray = function(){
    if(user.length === mTracks.length){//-only run playTracks when my arrays are fully filled
        clearTimeout(interval);
        playTracks();
        //naviInterval = setTimeout(initNavi, 200);
        //initNavi();
    }
};
var loading = function(){ //-keep calling checkArray() until my arrays are filled
    interval = setTimeout(checkArray, 500);
};

//-get playback event and change tracks
mAudio.addEventListener('ended', function(){
    selector++;
    if(selector > mTracks.length-1){
        selector = 0;
    }
    clearInterval(pBarIntervar);
    playTracks();
});

document.addEventListener('DOMContentLoaded', function(){
    var init = function(){
        getTracks();
        loading();
        preLoadlowFrameNoti();
        //checkFramedrops();
        document.addEventListener('wheel', navigation, false);
    };
    if(!isMobile){
        init();
    }else{
        mobileNoti();
    }
});
