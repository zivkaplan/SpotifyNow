const $search = document.getElementById('search');
const $getAlbumsBtn = document.querySelector('button.getAlbums');
const $getPlaylistsBtn = document.querySelector('button.getPlaylists');

$search.addEventListener('input', (e) => {
    if (!e.target.value) {
        document.querySelector('ul').innerHTML = '';
    }
    searchTrack(e);
});

$getAlbumsBtn.addEventListener('click', (e) => {
    getAlbums(e);
});

$getPlaylistsBtn.addEventListener('click', (e) => {
    getPlaylists(e);
});
