// DEEZER

var playerDeezer;

var _playerDeezerReady = false;
var _playerDeezerInError = false;

window.dzAsyncInit = function () {
    //try {
    DZ.init({
        appId: _DeezerAPIKey,
        channelUrl: '',//'@Url.Action("DeezerChannel")',
        player: {
            container: 'player-deezer',
            format: 'classic',
            playlist: false,
            onload: function (response) {
                _playerDeezerReady = true;
                playerDeezer = DZ.player;

                // play, pause, position, end events
                DZ.Event.subscribe('player_play', function (e) {
                    playerUIPlay(false);
                });
                DZ.Event.subscribe('player_paused', function (e) {
                    playerUIPlay(true);
                });
                DZ.Event.subscribe('player_position', function (e) {
                    updateDurations(e[0], e[1]);
                });
                DZ.Event.subscribe('track_end', function (e) {
                    playNext();
                });
            }
        }
    });
    //} catch (e) {
    //    console.log(e);
    //    _playerDeezerReady = true;
    //    _playerDeezerInError = true;
    //}
};
(function () {
    var e = document.createElement('script');
    e.src = 'http://e-cdn-files.deezer.com/js/min/dz.js';
    e.async = true;
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(e, firstScriptTag);
}());