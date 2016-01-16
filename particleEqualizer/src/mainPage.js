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
//mAudio.loop = true;
var isPlaying = true;
mAudio.src = 'https://api.soundcloud.com' + mTracks[selector] + '/stream?client_id=1c78c29753054d2e9af8926dd4a77db3';
mAudio.crossOrigin = "anonymous";
/* --------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', function(){
    //-get song's info & build up player
    var getTrackInfo = function(){
        SC.get(mTracks[selector]).then(function(track){
            var user = track.user.username;
            var userProfile = track.user.permalink_url;
            var permalink = track.permalink_url;
            var title = track.title;
            var imgUrl = track.artwork_url;

            //-set player
            var t = document.getElementById('player-here');
            while(t.firstChild){
                t.removeChild(t.firstChild);
            }
            var mThumb = document.createElement('div');
            mThumb.id = 'mThumb';
            var mImg = document.createElement('img');
            mImg.id = 'mImg';
            mImg.src = imgUrl;
            mImg.addEventListener('click',function(){
                window.open(permalink);
            });
            var mLink = document.createElement('a');
            mLink.id = 'mLink';
            mLink.setAttribute('href', permalink);
            mLink.target = '_blank';
            mLink.innerHTML = title;
            var mUsrLink = document.createElement('a');
            mUsrLink.id = 'mUsrLink';
            mUsrLink.setAttribute('href', userProfile);
            mUsrLink.target = '_blank';
            mUsrLink.innerHTML = ' by ' + user;
            var mLogo = document.createElement('img');
            mLogo.id = 'mLogo';
            mLogo.src = 'img/logo_s.png';
            mLogo.addEventListener('click',function(){
                window.open(permalink);
            });
            var mUI = document.createElement('span');
            mUI.id = 'mUI';
            var play = document.createElement('span');
            play.innerHTML = '&#9658;';
            play.id = 'play';
            play.addEventListener('click', function(){
                if(!isPlaying)
                    audioNode.mediaElement.play();
                mStream.then(function(player){
                    //player.play();
                });
                isPlaying = true;
            });
            var stop = document.createElement('span');
            stop.innerHTML = '&#10073;&#10073;';
            stop.id = 'stop';
            stop.addEventListener('click', function(){
                if(isPlaying)
                    audioNode.mediaElement.pause();
                mStream.then(function(player){
                    //player.pause();
                });
                isPlaying = false;
            });
            mUI.appendChild(play);
            mUI.appendChild(stop);
            mThumb.appendChild(mImg);
            t.appendChild(mThumb);
            t.appendChild(mLink);
            t.appendChild(mUsrLink);
            t.appendChild(mUI);
            t.appendChild(mLogo);
        });
    };
    //-stream track
    var mStream = SC.stream(mTracks[selector]);
    var playTracks = function(){
        mStream.then(function(player){
            getTrackInfo();
            audioNode.mediaElement.play();//-web audio audioInput.js
        });
    };
    playTracks();

    //-get playback event and change tracks
    mAudio.addEventListener('ended', function(){
        selector++;
        if(selector > mTracks.length-1){
            selector = 0;
        }
        mAudio.src = 'https://api.soundcloud.com' + mTracks[selector] + '/stream?client_id=1c78c29753054d2e9af8926dd4a77db3';
        mStream = SC.stream(mTracks[selector]);
        playTracks();
    });
});
