﻿var _defaultThumbnailUrl = "/img/sound_synchro_thumbnail.png";
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
                var link = $('#dropper').val();
                $('#dropper').remove();
                pushDragNDrop(link);
            });
        }
    }, false);
    document.addEventListener("drop", function (event) {
        setTimeout(function () { $('#dropper').trigger("change"); }, 200);
    }, false);

    function pushDragNDrop(link) {
        //console.log('pushDragNDrop', link);
        var platform = link.split('/')[2];
        var id = link;

        switch (platform) {
            case "www.youtube.com":
                var query = link.split('?')[1].split('&');
                //console.log(query.length);
                for (var i = 0; i < query.length; i++) {
                    var keyValue = query[i].split('=');
                    //console.log(keyValue, keyValue[0] == "v");
                    if (keyValue[0] == "v") {
                        id = keyValue[1];
                    }
                }
                $.get('https://www.googleapis.com/youtube/v3/videos?part=id,snippet&id=' + id + '&key=' + _YoutubeAPIKey, function (data) {
                    pushMusicItem({
                        type: "Youtube",
                        id: data.items[0].id,
                        title: data.items[0].snippet.title,
                        thumbnail: data.items[0].snippet.thumbnails.default.url
                    });
                });
                break;
            case "soundcloud.com":
                $.get('http://api.soundcloud.com/resolve?url=' + link + '&client_id=' + _SoundCloudAPIKey, function (data) {
                    pushMusicItem({
                        type: "SoundCloud",
                        id: data.permalink_url,
                        title: data.title,
                        thumbnail: data.artwork_url
                    });
                });
                break;
        }
    }

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
            suggestion: Handlebars.compile("<div><img src=\"{{thumbnail}}\">{{title}}</div>")
        }
    }).bind('typeahead:select', function (ev, suggestion) {
        //console.log('Selection: ', suggestion);
        pushMusicItem(suggestion);
        $('#search').typeahead('val', '');
    });
}

function pushMusicItem(item) {
    console.log('pushMusicItem', item);
    $.post(_SearchEnginePushAction, item, function (data) {
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
                thumbnail: (data[i].artwork_url ? data[i].artwork_url : "/img/sound_synchro_thumbnail.png")
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