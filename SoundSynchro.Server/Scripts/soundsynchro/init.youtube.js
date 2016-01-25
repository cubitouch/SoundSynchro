
// YOUTUBE
var playerYoutube;

var _playerYoutubeReady = false;
var _playerYoutubeInError = false;

// This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
    playerYoutube = new YT.Player('player-youtube', {
        height: '200',
        width: '200',
        playerVars: {
            'autoplay': 1,
            'controls': 0,
            'disablekb': 1,
            'fs': 0,
            'iv_load_policy': 3,
            'showinfo': 0,
            'rel': 0
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    _playerYoutubeReady = true;
    if (_lastPlayerYoutubeState == YT.PlayerState.PLAYING) {
        updateDurations(playerYoutube.getCurrentTime(), playerYoutube.getDuration());
    }
    setTimeout(onPlayerReady, 500);
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var _lastPlayerYoutubeState;
function onPlayerStateChange(event) {
    _lastPlayerYoutubeState = event.data;
    switch (event.data) {
        case YT.PlayerState.ENDED:
            playNext();
            break;
        case YT.PlayerState.PAUSED:
            playerUIPlay(true);
            break;
        case YT.PlayerState.PLAYING:
            playerUIPlay(false);
            break;
    }
}
