$(function () {
    $('#searchButton').click(function () {
        var search = $('#search').val();

        $.get(_MusicSearchAction + "?search=" + search, function (html) {
            $('#content').html(html);
            initMusicList();
        });
    });

    $('#sidemenu li a').click(function () {
        if (!$(this).hasClass('redirect')) {
            $.get($(this).attr('href'), function (html) {
                $('#content').html(html);
                initMusicList();
                initPlaylistList();
            });
            return false;
        }
    });

    initMusicList();

    $('#musicDelete').click(function () {
        $.post(_MusicDeleteAction, { id: $('#musicId').val() }, function (data) {
            if (data == "True") {
                $('.music-item[data-id="' + $('#musicId').val() + '"]').remove();
                _musicEditor.close();
                deleteFromQueue($('#musicId').val());
            }
        });
        return false;
    });

    $('#musicUpdate').click(function () {
        $.post(_MusicUpdateAction, {
            id: $('#musicId').val(),
            title: $('#musicTitle').val()
        }, function (data) {
            if (data == "True") {
                var musicItem = $('.music-item[data-id="' + $('#musicId').val() + '"]');
                $(musicItem).find('.music-title').text($('#musicTitle').val());
                $(musicItem).data('title', $('#musicTitle').val());
                _musicEditor.close();
                updateFromQueue($('#musicId').val(), $('#musicTitle').val());
            }
        });
        return false;
    });


    $('#player-save-playlist').click(function () {
        $('#playlistTitle').val('');
        _playlistCreator = new Foundation.Reveal($('#playlistCreator'));
        _playlistCreator.open();
        return false;
    });

    $('#playlistSave').click(function () {
        var title = $('#playlistTitle').val();
        if (title.trim() != '') {
            $.post(_PlaylistCreateAction, { title: title, musics: _currentQueue }, function (data) {
                if (data == "True") {
                    $('#playlistTitle').val('');
                    _playlistCreator.close();
                }
            });
        }
        return false;
    });

    // player init
    playerSlider = new Foundation.Slider($('#player .slider'));
    $('#player .slider').on('moved.zf.slider', function (e) {
        var current = $(this).children('.slider-handle').attr('aria-valuenow');
        setDuration(current);
        return false;
    });

    playerHTML5.addEventListener("ended", function () {
        playNext();
    }, true);
    playerHTML5.addEventListener("durationchange", function (e) {
        updateDurations(0, this.duration);
    }, true);
    playerHTML5.addEventListener("timeupdate", function (e) {
        updateDurations(this.currentTime, this.duration);
    }, true);
    $('#player-previous').click(function () { playPrevious(); });
    $('#player-next').click(function () { playNext(); });

    $('#player-play').click(function () {
        playerPlay();
    });
    $('#player-volume').click(function () {
        playerVolume();
    });
    $('#player-radio').click(function () {
        playerRadio();
    });
});

var playerSlider;
var playerHTML5 = $('#player .audio')[0];

// This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var playerYoutube;
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

// YOUTUBE
var _playerYoutubeReady = false;
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

// SOUNDCLOUD

var _playerSoundCloudReady = false;
var playerSoundCloud;
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