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
    $('#player .audio')[0].pause();
    var currentTime = ($('#player .audio')[0].duration * current / 100)
    $('#player .audio')[0].currentTime = currentTime;
    if (currentTime != $('#player .audio')[0].duration) {
        $('#player .audio')[0].play();
    }
}
function updateDurations(begin, end) {
    $('#player-duration-begin').text(formatTime(begin));
    $('#player-duration-end').text(formatTime(end));
    $('#player-duration-current').val(Math.floor(begin / end * 100));
    $('#player-duration-current').trigger('change');
}

function playerPlayMedia(_currentQueueItem) {
    _currentId = _currentQueueItem.id;
    _currentIdPaused = "";
    playerPlay(true);

    var needReload = ($('#player .audio source').attr("src") != _currentQueueItem.audio);
    $('#player .title').text(_currentQueueItem.title);
    $('#player .audio source').attr("src", _currentQueueItem.audio);
    $('#player .thumbnail img').attr("src", _currentQueueItem.thumbnail);
    if (needReload) {
        $('#player .audio')[0].load();
    }
    playerPlay();
}

function playerPlay(forcePause) {
    if (forcePause || $('#player-play').find('.fa-pause').length > 0) {
        // pause
        $('#player-play').find('.fa-pause').removeClass('fa-pause').addClass('fa-play');
        $('#player .audio')[0].pause();
        _currentIdPaused = _currentId;
        _currentId = "";
    } else {
        // play
        $('#player-play').find('.fa-play').removeClass('fa-play').addClass('fa-pause');
        $('#player .audio')[0].play();
        _currentId = _currentIdPaused;
        _currentIdPaused = "";
    }

    renderQueue();
    renderMusicList();
}
function playerVolume() {
    if ($('#player-volume').find('.fa-volume-up').length > 0) {
        // mute
        $('#player-volume').find('.fa-volume-up').removeClass('fa-volume-up').addClass('fa-volume-off');
        $('#player .audio')[0].muted = true;
    } else {
        // unmute
        $('#player-volume').find('.fa-volume-off').removeClass('fa-volume-off').addClass('fa-volume-up');
        $('#player .audio')[0].muted = false;
    }
}

// playlist manager

var _currentQueue = [];
var _currentId = "";
var _currentIdPaused = "";

function renderQueue() {
    //console.log('---renderQueue---');
    $('#queue').empty();
    for (i = 0; i < _currentQueue.length  ; i++) {
        //console.log(_currentQueue[i].title);
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
    //console.log('play id: ' + id);
    for (i = 0; i < _currentQueue.length  ; i++) {
        if (_currentQueue[i].id == id) {
            playerPlayMedia(_currentQueue[i]);
        }
    }
    renderMusicList();
}
function addToQueue(id, title, audio, thumbnail) {
    _currentQueue.push({
        id: id,
        title: title,
        audio: audio,
        thumbnail: thumbnail
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
                $(this).data("thumbnail"));
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
                $(this).closest('.music-item').data("thumbnail"));
        renderQueue();
    });
    $('.play-button').off('click').on('click', function () {
        var id = $(this).closest('.music-item').data('id');
        var title = $(this).closest('.music-item').data('title');
        var audio = $(this).closest('.music-item').data('audio');
        var thumbnail = $(this).closest('.music-item').data('thumbnail');

        if (id == _currentId) {
            playerPlay(true);
        } else {
            clearQueue();
            addToQueue(id, title, audio, thumbnail);
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