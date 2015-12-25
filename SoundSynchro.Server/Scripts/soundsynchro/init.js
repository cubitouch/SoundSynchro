$(function () {
    $('#searchButton').click(function () {
        var search = $('#search').val();

        $.get(_MusicSearchAction + "?search=" + search, function (html) {
            $('#content').html(html);
            initMusicList();
        });
    });

    $('#sidemenu li a').click(function () {
        $.get($(this).attr('href'), function (html) {
            $('#content').html(html);
            initMusicList();
            initPlaylistList();
        });
        return false;
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

    $('#player .audio')[0].addEventListener("ended", function () {
        playNext();
    }, true);
    $('#player-previous').click(function () { playPrevious(); });
    $('#player-next').click(function () { playNext(); });

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
});