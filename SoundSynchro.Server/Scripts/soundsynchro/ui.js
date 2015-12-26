// playlist manager

var _currentQueue = [];
var _currentId = "";

function renderQueue() {
    console.log('---renderQueue---');
    $('#queue').empty();
    for (i = 0; i < _currentQueue.length  ; i++) {
        console.log(_currentQueue[i].title);
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
            $('#player .title').text(_currentQueue[i].title);
            $('#player .audio source').attr("src", _currentQueue[i].audio);
            $('#player .thumbnail img').attr("src", _currentQueue[i].thumbnail);
            $('#player .audio')[0].load();
            $('#player .audio')[0].play();
            _currentId = _currentQueue[i].id;
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
    $('#content [data-open]').click(function () {
        var element = $('#' + $(this).data('open'));
        if (!element.hasClass('initialized')) {
            _currentPlaylistModal = new Foundation.Reveal(element);
            $(element).addClass('initialized');
        }
        _currentPlaylistModal.open();
    });
    $('.playlist-edit-modal .playlist-edit-save').click(function () {
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
    $('.play-playlist-button').click(function () {
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
    $("#play-all").click(function () {
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

    $('.edit-button').click(function () {
        $('#musicId').val($(this).closest('.music-item').data('id'));
        $('#musicTitle').val($(this).closest('.music-item').data('title'));
        _musicEditor = new Foundation.Reveal($('#musicEditor'));
        _musicEditor.open();
    });
    $('.add-button').click(function () {
        addToQueue(
                $(this).closest('.music-item').data("id"),
                $(this).closest('.music-item').data("title"),
                $(this).closest('.music-item').data("audio"),
                $(this).closest('.music-item').data("thumbnail"));
        renderQueue();
    });
    $('.play-button').click(function () {
        var id = $(this).closest('.music-item').data('id');
        var title = $(this).closest('.music-item').data('title');
        var audio = $(this).closest('.music-item').data('audio');
        var thumbnail = $(this).closest('.music-item').data('thumbnail');

        if (id == _currentId) {
            $('#player .audio')[0].pause();
            _currentId = "";
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