var _clientId = guid();
/* http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript */
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
}

$(function () {
    $(document).foundation();

    document.addEventListener("dragover", function (event) {
        if ($('#dropper').length == 0) {
            $('body').append('<textarea id="dropper"></textarea>');
            $('#dropper').change(function () {
                console.log("drop", $('#dropper').val());
                $('#dropper').remove();
            });
        }
    }, false);
    document.addEventListener("drop", function (event) {
        setTimeout(function () { $('#dropper').trigger("change"); }, 200);
    }, false);

    $('.music-item .img-container img').each(function (i, el) {
        if ($(this).attr('src') == '') {
            $(this).attr('src', _defaultThumbnailUrl);
        }
    });

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
                initAutocompleteSearchEngine();
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
    $('#player-previous').click(function () {
        playPrevious();
        return false;
    });
    $('#player-next').click(function () {
        playNext();
        return false;
    });

    $('#player-play').click(function () {
        playerPlay();
        return false;
    });
    $('#player-volume').click(function () {
        playerVolume();
        return false;
    });
    $('#player-radio').click(function () {
        playerRadio();
        return false;
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

// DEEZER

var _playerDeezerReady = false;
var playerDeezer;
window.dzAsyncInit = function () {
    DZ.init({
        appId: _DeezerAPIKey,
        channelUrl: '@Url.Action("DeezerChannel")',
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
};
(function () {
    var e = document.createElement('script');
    e.src = 'http://e-cdn-files.deezer.com/js/min/dz.js';
    e.async = true;
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(e, firstScriptTag);
}());

$(function () {
    initAutocompleteSearchEngine();
});

function initAutocompleteSearchEngine() {
    $('#search').typeahead({
        minLength: 3,
        highlight: true
    }, {
        name: 'async-autocomplete',
        source: autocompleteRequest,
        limit: 50,
        templates: {
            suggestion: Handlebars.compile("<div>{{title}}</div>")
        }
    }).bind('typeahead:select', function (ev, suggestion) {
        //console.log('Selection: ', suggestion);
        $.post(_SearchEnginePushAction, suggestion, function (data) {
            var music = JSON.parse(data);
            if (_playerRadioModeEnabled) {
                $.post(_RadioContentAddAction, { id: music.id }, function (html) {
                    // Do someting ?
                });
            } else {
                addToQueue(music.id, music.title, music.audio, music.thumbnail, music.type)
                playQueue(music.id);
            }
        });
        $('#search').typeahead('val', '');
    });
}

function autocompleteRequest(query, syncResults, asyncResults) {
    //console.log("query", query);
    // YOUTUBE
    $.get('https://www.googleapis.com/youtube/v3/search?part=id,snippet&type=video&q=' + query + '&key=' + _YoutubeAPIKey, function (data) {
        //console.log("YOUTUBE", data);
        var suggestions = [];
        for (var i = 0; i < data.items.length ; i++) {
            suggestions.push({
                type: "Youtube",
                id: data.items[i].id.videoId,
                title: data.items[i].snippet.title,
                thumbnail: data.items[i].snippet.thumbnails.default.url
            });
        }
        //console.log('suggestions YOUTUBE', suggestions);
        asyncResults(suggestions);
    });
    // SOUNDCLOUD
    $.get('http://api.soundcloud.com/tracks/?q=' + query + '&client_id=' + _SoundCloudAPIKey, function (data) {
        //console.log("SOUNDCLOUD", data);
        var suggestions = [];
        for (var i = 0; i < data.length ; i++) {
            suggestions.push({
                type: "SoundCloud",
                id: data[i].permalink_url,
                title: data[i].title,
                thumbnail: data[i].artwork_url
            });
        }
        //console.log('suggestions SOUNDCLOUD', suggestions);
        asyncResults(suggestions);
    });
    // DEEZER - Server call needed
    //$.get('https://api.deezer.com/search?q=track:"' + query + '"&app_id=' + _DeezerAPIKey, function (data) {
    //    console.log("DEEZER", data);
    //});
}