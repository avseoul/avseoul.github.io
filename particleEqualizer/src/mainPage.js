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
naviInterval = setInterval(initNavi, 50);

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
    var pTime = document.createElement('div');
    pTime.id = 'pTime'
        //-cal progress the width of bar is 170px set in css
        pBarIntervar = setInterval(getProgressBar, 200);

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
    init();
});

