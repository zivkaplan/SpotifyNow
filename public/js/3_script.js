const $search = document.getElementById('search');
const $getAlbumsBtn = document.querySelector('button.getAlbums');
const $getPlaylistsBtn = document.querySelector('button.getPlaylists');
const lastReq = {
    search: false,
    albums: false,
    playlists: false,
    next: null,
};

$search.addEventListener('input', async (e) => {
    document.querySelector('ul').innerHTML = '';
    const results = await searchTrack(e);
    displayTracks(results);
    setLastReq(lastReq, 'search', results.tracks.next);
});

$getAlbumsBtn.addEventListener('click', async (e) => {
    document.querySelector('ul').innerHTML = '';
    const results = await getAlbums(e);
    displayAlbums(results);
    setLastReq(lastReq, 'albums', results.next);
});

$getPlaylistsBtn.addEventListener('click', async (e) => {
    document.querySelector('ul').innerHTML = '';
    const results = await getPlaylists(e);
    displayPlaylists(results);
    setLastReq(lastReq, 'playlists', results.next);
});

window.addEventListener('scroll', async (e) => {
    if (
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight
    ) {
        const type = Object.keys(lastReq).find((el) => lastReq[el] === true);
        lastReq.next = await loadNext(type, lastReq.next);
    }
});
