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
}

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

    //-get list
    var list = document.createElement('div');
    list.id = 'list';
    for(var i = 0; i < mTracks.length; i++){
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
    };
    init();
});
