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
    if (_playerRadioModeEnabled) {
        $.post(_RadioContentSeekAction, { time: current }, function (html) {
            // DO SOMETHING ?
        });
    }
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
        case "SoundCloud":
            playerSoundCloud.getDuration(function (duration) {
                playerSoundCloud.isPaused(function (wasPaused) {
                    var nextTime = (duration / 1000 * current / 100);
                    playerSoundCloud.pause();
                    playerSoundCloud.seekTo(nextTime * 1000, true);
                    if (nextTime != duration && !wasPaused) {
                        playerSoundCloud.play();
                    }
                });
            });

            break;
        case "Deezer":
            var wasPlaying = (playerDeezer.isPlaying);
            playerDeezer.pause();
            playerDeezer.seek(current, true);
            if (nextTime != playerDeezer.getCurrentTrack().duration && wasPlaying) {
                playerDeezer.play();
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
    if (!_playerYoutubeReady || !_playerSoundCloudReady || !_playerDeezerReady) {
        return false;
    }

    if (currentItem.type != _currentType) {
        playerYoutube.stopVideo();
        playerSoundCloud.pause();
        playerHTML5.load();
        playerDeezer.pause();
    }

    _currentId = currentItem.id;
    if (_playerRadioModeEnabled) {
        $.post(_RadioContentPlayAction, { id: _currentId }, function (html) {
            // DO SOMETHING ?
        });
    }
    _currentType = currentItem.type;
    var needReloadGlobal = (_currentIdPaused == currentItem.id);
    _currentIdPaused = "";
    playerPlay(true);

    $('#player-file').removeClass('hide').addClass('hide');
    $('#player-youtube').removeClass('hide').addClass('hide');
    $('#player-soundcloud').removeClass('hide').addClass('hide');
    $('#player-deezer').removeClass('hide').addClass('hide');

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
            var needReload = (_lastPlayerYoutubeState == YT.PlayerState.PAUSED && needReloadGlobal);
            if (needReload) {
                playerYoutube.playVideo();
            } else {
                playerYoutube.loadVideoById(currentItem.audio);
            }
            $('#player-youtube').removeClass('hide');
            break;
        case 'SoundCloud':
            var needReload = (playerSoundCloud.isPaused() && needReloadGlobal);
            if (needReload) {
                playerSoundCloud.play();
            } else {
                playerSoundCloud.load(currentItem.audio, {
                    buying: false,
                    liking: false,
                    download: false,
                    sharing: false,
                    show_artwork: false,
                    show_comments: false,
                    show_playcount: false,
                    show_user: false,
                    hide_related: false,
                    visual: true,
                    start_track: 0,
                    auto_play: true
                });
            }
            $('#player-soundcloud').removeClass('hide');
            break;
        case 'Deezer':
            var needReload = (!playerDeezer.isPlaying() && needReloadGlobal);
            if (needReload) {
                playerDeezer.play();
            } else {
                playerDeezer.playTracks([currentItem.audio], function (e) {
                    //console.log(e);
                });
            }
            $('#player-deezer').removeClass('hide');
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
        // pause
        playerHTML5.pause();
        if (playerYoutube.pauseVideo != undefined) {
            playerYoutube.pauseVideo();
        }
        playerSoundCloud.pause();
        playerDeezer.pause();
    } else {
        // play
        switch (_currentType) {
            case "File":
                playerHTML5.play();
                break;
            case "Youtube":
                playerYoutube.playVideo();
                break;
            case "SoundCloud":
                playerSoundCloud.play();
                break;
            case "Deezer":
                playerDeezer.play();
                break;
        }
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
function playerSoundCloudVolumeRefresh() {
    var needMute = ($('#player-volume').find('.fa-volume-off').length > 0);
    if (needMute) {
        playerSoundCloud.setVolume(0);
    } else {
        playerSoundCloud.setVolume(100);
    }
}
function playerSoundCloudUpdateDurations() {
    playerSoundCloud.getPosition(function (positionEvent) {
        playerSoundCloud.getDuration(function (durationEvent) {
            updateDurations(positionEvent / 1000, durationEvent / 1000);
        });
    });
}
function playerVolume() {
    var needMute = ($('#player-volume').find('.fa-volume-up').length > 0);

    playerHTML5.muted = needMute;
    playerDeezer.setMute(needMute);
    if (needMute) {
        // mute
        playerYoutube.mute();
        playerSoundCloud.setVolume(0);
    } else {
        // unmute
        playerYoutube.unMute();
        playerSoundCloud.setVolume(100);
    }

    if (needMute) {
        // mute
        $('#player-volume').find('.fa-volume-up').removeClass('fa-volume-up').addClass('fa-volume-off');
    } else {
        // unmute
        $('#player-volume').find('.fa-volume-off').removeClass('fa-volume-off').addClass('fa-volume-up');
    }
}

var _playerRadioModeEnabled = false;
var _playerRadioLastCurrentTime = 0;
var _playerRadioLastCurrentMusicId = "";
var _playerRadioWorkerId = "";
var _playerRadioWorkerIsProcessing = false;
function playerRadio() {
    _playerRadioModeEnabled = ($('#player-radio').find('.fa-microphone-slash').length > 0);

    if (_playerRadioModeEnabled) {
        // radio on

        // SET WORKER
        _playerRadioWorkerId = window.setInterval(playerRadioRefresh, 1000);

        $('#player-radio').find('.fa-microphone-slash').removeClass('fa-microphone-slash').addClass('fa-microphone');
    } else {
        // radio off

        // CLEAR PLAYLIST
        clearQueue();
        // CLEAR WORKER
        window.clearInterval(_playerRadioWorkerId);
        _playerRadioWorkerIsProcessing = false;
        _playerRadioLastCurrentTime = 0;
        _playerRadioLastCurrentMusicId = "";

        $('#player-radio').find('.fa-microphone').removeClass('fa-microphone').addClass('fa-microphone-slash');
    }
}
function playerRadioRefresh() {
    if (!_playerRadioWorkerIsProcessing) {
        _playerRadioWorkerIsProcessing = true;
        // LOAD PLAYLIST
        $.get(_RadioContentAction, function (data) {
            var radio = JSON.parse(data);
            var musics = radio.content;

            // REFRESH PLAYLIST
            _currentQueue = musics; // ONLY IF DIFFERENT !

            // RUN PLAYLIST
            //console.log(_playerRadioLastCurrentMusicId, radio.currentMusicId);
            if (_playerRadioLastCurrentMusicId != radio.currentMusicId) {
                _playerRadioLastCurrentMusicId = radio.currentMusicId;
                playQueue((_playerRadioLastCurrentMusicId != '' ? _playerRadioLastCurrentMusicId : musics[0].id));
            }
            if (_playerRadioLastCurrentTime != radio.currentTime) {
                _playerRadioLastCurrentTime = radio.currentTime;
                setDuration(_playerRadioLastCurrentTime);
            }

            renderMusicList();
            renderQueue();
            _playerRadioWorkerIsProcessing = false;
        });
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
        $('#queue').append($('<li class="' + (_currentQueue[i].id == _currentId ? "active" : "") + '"><a href="#" class="music-queue-item" data-id="' + _currentQueue[i].id + '"><span>' + _currentQueue[i].title + '</span></a></li>'));
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
        if (_playerRadioModeEnabled) {
            $.post(_RadioContentAddAction, { id: $(this).closest('.music-item').data("id") }, function (html) {
                // Do someting ?
            });
        } else {
            addToQueue(
                    $(this).closest('.music-item').data("id"),
                    $(this).closest('.music-item').data("title"),
                    $(this).closest('.music-item').data("audio"),
                    $(this).closest('.music-item').data("thumbnail"),
                    $(this).closest('.music-item').data("type"));
            renderQueue();
        }
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
            if (_playerRadioModeEnabled) {
                $.post(_RadioContentAddAction, { id: $(this).closest('.music-item').data("id"), forcePlay: true }, function (html) {
                    // Do someting ?
                });
            } else {
                clearQueue();
                addToQueue(id, title, audio, thumbnail, type);
                playQueue(id);
            }
        }

        renderMusicList();
    });

}

function renderMusicList() {
    $('.music-item').each(function (i, el) {
        if ($(el).data("id") == _currentId) {
            $(el).addClass('active');
            $(el).find('.play-button').find('.fa').removeClass('fa-play-circle-o').addClass('fa-pause');
        } else {
            $(el).removeClass('active');
            $(el).find('.play-button').find('.fa').removeClass('fa-pause').addClass('fa-play-circle-o');
        }
    });

    renderQueue();
}