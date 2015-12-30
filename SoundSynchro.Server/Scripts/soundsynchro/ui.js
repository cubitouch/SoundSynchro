// player

function formatTime(time) {
    time = Math.floor(time);
    var minutes = Math.floor(time / 60);
    var seconds = time - minutes * 60;
    return str_pad_left(minutes, '0', 2) + ':' + str_pad_left(seconds, '0', 2);
}
function str_pad_left(string, pad, length) {
    return (new Array(length + 1).join(pad) + string).slice(-length);
}

function setDuration(current) {
    switch (_currentType) {
        case "File":

            var nextTime = (playerHTML5.duration * current / 100);
            var wasPlaying = !playerHTML5.paused;
            playerHTML5.pause();
            playerHTML5.currentTime = nextTime;
            if (nextTime != playerHTML5.duration && wasPlaying) {
                playerHTML5.play();
            }

            break;
        case "Youtube":

            var nextTime = (playerYoutube.getDuration() * current / 100);
            var wasPlaying = (_lastPlayerYoutubeState == YT.PlayerState.PLAYING);
            playerYoutube.pauseVideo();
            playerYoutube.seekTo(nextTime, true);
            if (nextTime != playerYoutube.duration && wasPlaying) {
                playerYoutube.playVideo();
            }

            break;
    }
}
function updateDurations(begin, end) {
    $('#player-duration-begin').text(formatTime(begin));
    $('#player-duration-end').text(formatTime(end));
    $('#player-duration-current').val(Math.floor(begin / end * 100));
    $('#player-duration-current').trigger('change');
}

function playerPlayMedia(currentItem) {
    if (currentItem.type == "Youtube" && !_playerYoutubeReady) {
        return false;
    }

    if (currentItem.type != _currentType) {
        playerYoutube.stopVideo();
        playerHTML5.load();
    }

    _currentId = currentItem.id;
    _currentType = currentItem.type;
    _currentIdPaused = "";
    playerPlay(true);

    $('#player-file').removeClass('hide').addClass('hide');
    $('#player-youtube').removeClass('hide').addClass('hide');

    $('#player .title').text(currentItem.title);

    switch (_currentType) {
        case 'File':
            var needReload = ($('#player .audio source').attr("src") != currentItem.audio);

            $('#player .audio source').attr("src", currentItem.audio);
            $('#player-file .cover').css("background-image", "url('" + currentItem.thumbnail + "')");
            if (needReload) {
                playerHTML5.load();
            }
            $('#player-file').removeClass('hide');
            break;
        case 'Youtube':
            var needReload = (_lastPlayerYoutubeState == YT.PlayerState.PAUSED);
            if (needReload) {
                playerYoutube.playVideo();
            } else {
                playerYoutube.loadVideoById(currentItem.audio);
            }
            $('#player-youtube').removeClass('hide');
            break;
        case 'SoundCloud':
            break;
    }
    playerPlay();
}

function playerUIPlay(pause) {
    if (pause) {
        // pause
        $('#player-play').find('.fa-pause').removeClass('fa-pause').addClass('fa-play');
    } else {
        // play
        $('#player-play').find('.fa-play').removeClass('fa-play').addClass('fa-pause');
    }
}
function playerPlay(forcePause) {
    var needPause = (forcePause || $('#player-play').find('.fa-pause').length > 0);
    if (needPause) {
        playerHTML5.pause();
        if (playerYoutube.pauseVideo != undefined) {
            playerYoutube.pauseVideo();
        }
    }
    switch (_currentType) {
        case "File":
            if (needPause) {
                // pause
            } else {
                // play
                playerHTML5.play();
            }
            break;
        case "Youtube":
            if (needPause) {
                // pause
            } else {
                // play
                playerYoutube.playVideo();
            }
            break;
    }

    if (needPause) {
        // pause
        $('#player-play').find('.fa-pause').removeClass('fa-pause').addClass('fa-play');
        _currentIdPaused = _currentId;
        _currentId = "";
    } else {
        // play
        $('#player-play').find('.fa-play').removeClass('fa-play').addClass('fa-pause');
        _currentId = _currentIdPaused;
        _currentIdPaused = "";
    }

    renderQueue();
    renderMusicList();
}
function playerVolume() {
    var needMute = ($('#player-volume').find('.fa-volume-up').length > 0);

    playerHTML5.muted = needMute;
    if (needMute) {
        // pause
        playerYoutube.mute();
    } else {
        // play
        playerYoutube.unMute();
    }

    if (needMute) {
        // mute
        $('#player-volume').find('.fa-volume-up').removeClass('fa-volume-up').addClass('fa-volume-off');
    } else {
        // unmute
        $('#player-volume').find('.fa-volume-off').removeClass('fa-volume-off').addClass('fa-volume-up');
    }
}

// playlist manager

var _currentQueue = [];
var _currentId = "";
var _currentType = "";
var _currentIdPaused = "";

function renderQueue() {
    $('#queue').empty();
    for (i = 0; i < _currentQueue.length  ; i++) {
        $('#queue').append($('<li class="tabs-title ' + (_currentQueue[i].id == _currentId ? "active" : "") + '"><a href="#" class="music-queue-item" data-id="' + _currentQueue[i].id + '">' + _currentQueue[i].title + '</a></li>'));
    }

    $('.music-queue-item').click(function () {
        playQueue($(this).data('id'));
    });
}
var _playlistCreator;


function playNext() {
    for (i = 0; i < _currentQueue.length  ; i++) {
        if (_currentId == _currentQueue[i].id) {
            if (i < _currentQueue.length - 1) {
                playQueue(_currentQueue[i + 1].id);
            }
        }
    }
}
function playPrevious() {
    for (i = 0; i < _currentQueue.length  ; i++) {
        if (_currentId == _currentQueue[i].id) {
            if (i > 0) {
                playQueue(_currentQueue[i - 1].id);
            } else {
                playQueue(_currentId);
            }
        }
    }
}

function playQueue(id) {
    for (i = 0; i < _currentQueue.length  ; i++) {
        if (_currentQueue[i].id == id) {
            playerPlayMedia(_currentQueue[i]);
        }
    }
    renderMusicList();
}
function addToQueue(id, title, audio, thumbnail, type) {
    _currentQueue.push({
        id: id,
        title: title,
        audio: audio,
        thumbnail: thumbnail,
        type: type
    });
}
function deleteFromQueue(id) {
    for (i = 0; i < _currentQueue.length  ; i++) {
        if (_currentQueue[i].id == id) {
            _currentQueue.pop(_currentQueue[i]);
        }
    }
}
function updateFromQueue(id, title) {
    for (i = 0; i < _currentQueue.length  ; i++) {
        if (_currentQueue[i].id == id) {
            _currentQueue[i].title = title;
        }
    }
}
function clearQueue() {
    _currentQueue = [];
}

// playlists list
var _currentPlaylistModal;
function initPlaylistList() {
    $('#content [data-open]').off('click').on('click', function () {
        var element = $('#' + $(this).data('open'));
        if (!element.hasClass('initialized')) {
            _currentPlaylistModal = new Foundation.Reveal(element);
            $(element).addClass('initialized');
        }
        _currentPlaylistModal.open();
    });
    $('.playlist-edit-modal .playlist-edit-save').off('click').on('click', function () {
        var id = $(this).closest('.playlist-edit-modal').data('id');
        var title = $(this).closest('.playlist-edit-modal').find('.playlistTitle').val();
        var musics = [];

        var selectedMusics = $(this).closest('.playlist-edit-modal').find(':checkbox:checked');
        for (i = 0; i < selectedMusics.length; i++) {
            musics.push({ id: $(selectedMusics[i]).data('id') });
        }

        $.post(_PlaylistUpdateAction, { id: id, title: title, musics: musics }, function (html) {
            _currentPlaylistModal.close();
            $('#content .playlist-item[data-id="' + id + '"]').replaceWith(html);
            initPlaylistList();
        });
        return false;
    });
    $('.play-playlist-button').off('click').on('click', function () {
        var id = $(this).closest('.playlist-item').data('id');

        $.get(_PlaylistContentAction + "?id=" + id, function (data) {
            var musics = JSON.parse(data);
            _currentQueue = musics;
            playQueue(musics[0].id);
        });
    });
}

// music list

var _musicEditor;
function initMusicList() {
    $("#play-all").off('click').on('click', function () {
        clearQueue();
        $('.music-item').each(function (i, el) {
            addToQueue(
                $(this).data("id"),
                $(this).data("title"),
                $(this).data("audio"),
                $(this).data("thumbnail"),
                $(this).data("type"));
        }).promise().done(function () {
            playQueue(_currentQueue[0].id);
        });
        return false;
    });

    $('.edit-button').off('click').on('click', function () {
        $('#musicId').val($(this).closest('.music-item').data('id'));
        $('#musicTitle').val($(this).closest('.music-item').data('title'));
        _musicEditor = new Foundation.Reveal($('#musicEditor'));
        _musicEditor.open();
    });
    $('.add-button').off('click').on('click', function () {
        addToQueue(
                $(this).closest('.music-item').data("id"),
                $(this).closest('.music-item').data("title"),
                $(this).closest('.music-item').data("audio"),
                $(this).closest('.music-item').data("thumbnail"),
                $(this).closest('.music-item').data("type"));
        renderQueue();
    });
    $('.play-button').off('click').on('click', function () {
        var id = $(this).closest('.music-item').data('id');
        var title = $(this).closest('.music-item').data('title');
        var audio = $(this).closest('.music-item').data('audio');
        var thumbnail = $(this).closest('.music-item').data('thumbnail');
        var type = $(this).closest('.music-item').data('type');

        if (id == _currentId) {
            playerPlay(true);
        } else {
            clearQueue();
            addToQueue(id, title, audio, thumbnail, type);
            playQueue(id);
        }

        renderMusicList();
    });

}

function renderMusicList() {
    $('.music-item').each(function (i, el) {
        if ($(el).data("id") == _currentId) {
            $(el).addClass('active');
            $(el).find('.play-button').html('<i class="fa fa-pause"></i>');
        } else {
            $(el).removeClass('active');
            $(el).find('.play-button').html('<i class="fa fa-play"></i>');
        }
    });

    renderQueue();
}