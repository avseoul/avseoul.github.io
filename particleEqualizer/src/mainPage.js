var isMobile = false;
(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))isMobile = true})(navigator.userAgent||navigator.vendor||window.opera);

SC.initialize({
    client_id: '1c78c29753054d2e9af8926dd4a77db3'
});


/* --------------------------------------------------------- */
var mTracks = ['/tracks/222734029',     //Everything and Nothing - dj krush
    '/tracks/220103939',                //Future Correction[45sec] - dj krush
    '/tracks/221995257',                //Missing Link - dj krush
    '/tracks/220662300',                //Strange Light - dj krush 
    '/tracks/222735580',                //Nostalgia feat.Takashi Niigaki[45sec] - dj krush 
    '/tracks/222735459',                //My Light feat. Yasmine Hamdan[30sec] - dj krush
    '/tracks/222734282',                //Coruscation[45sec] - dj krush
    '/tracks/221995046'                 //Song of the Haze[45sec] - dj krush
];               
var selector = 0;
var mAudio = new Audio(); //-for web-audio api
mAudio.crossOrigin = "anonymous"; 
var user = [], userProfile = [], permalink = [], title = [], imgUrl = [], stream = [], duration = [];
//mAudio.loop = true;
var isPlaying = true;
/* --------------------------------------------------------- */

/* navigation */
var gO = .0, oO = .08;
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

var naviInterval;
var clearNaviInterval = function(){
    clearInterval(naviInterval);
};
var initNavi = function(){
    var nO = .8-gO;
    gO += nO*oO*2;
    if(gO > .78){ //-stop when it approach to edge
        gO = .8;
        clearNaviInterval();
    }
    naviUpdate();
};
var navigation = function(event){
    var trigger = event.wheelDeltaY;
    if(event.srcElement.id == 'mCanvas')
        if(trigger < 0){
            var nO = 0.-gO;
            gO += nO*oO;
            if(gO < 0.02){ //-stop when it approach to edge
                gO = 0.;
            }
        }else if(trigger > 0){
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
            imgUrl.push(track.artwork_url);
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
        _user.innerHTML = ' <a href="' + permalink[i] + '" target="_blank">by ' + user[i]+'</a>';
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
    mAudio.src = stream[selector]+'?client_id=1c78c29753054d2e9af8926dd4a77db3';
    setPlayer();
    audioNode.mediaElement.play();//-web audio audioInput.js
};
var interval;
var checkArray = function(){
    if(user.length === mTracks.length){//-only run playTracks when my arrays are fully filled
        clearInterval(interval);
        playTracks();
        naviInterval = setInterval(initNavi, 50);
    }
};
var loading = function(){ //-keep calling checkArray() until my arrays are filled
    interval = setInterval(checkArray, 500);
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
        document.addEventListener('wheel', navigation, false);
    };
    if(!isMobile)
    init();
});
