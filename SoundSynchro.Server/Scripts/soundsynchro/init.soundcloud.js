// SOUNDCLOUD

var playerSoundCloud;

var _playerSoundCloudReady = false;
var _playerSoundCloudInError = false;

$(function () {
    playerSoundCloud = SC.Widget("player-soundcloud");
    playerSoundCloud.bind(SC.Widget.Events.READY, function (e) {
        _playerSoundCloudReady = true;

        // INIT EVENT HANDLERS
        playerSoundCloud.bind(SC.Widget.Events.PLAY, function (e) {
            playerUIPlay(false);
            playerSoundCloudVolumeRefresh();
        });
        playerSoundCloud.bind(SC.Widget.Events.PLAY_PROGRESS, function (e) {
            playerSoundCloudUpdateDurations();
        });
        playerSoundCloud.bind(SC.Widget.Events.PAUSE, function (e) {
            playerUIPlay(true);
        });
        playerSoundCloud.bind(SC.Widget.Events.SEEK, function (e) {
            playerSoundCloudUpdateDurations();
        });
        playerSoundCloud.bind(SC.Widget.Events.FINISH, function (e) {
            playNext();
        });
    });
});