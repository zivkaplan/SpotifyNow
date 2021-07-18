const $search = document.getElementById('search');
const $getAlbumsBtn = document.querySelector('button.getAlbums');
const $getPlaylistsBtn = document.querySelector('button.getPlaylists');
const $floatingBarsG = document.querySelector('#floatingBarsG ');
const lastReq = {
    search: false,
    albums: false,
    playlists: false,
    next: null,
    isFecthing: false,
};

$search.addEventListener('input', async (e) => {
    document.querySelector('ul').innerHTML = '';
    const results = await searchTrack(e);
    displayTracks(results);
    setLastReq(lastReq, 'search', results.tracks.next);
});

$getAlbumsBtn.addEventListener('click', async (e) => {
    try {
        $getAlbumsBtn.disabled = true;
        $getAlbumsBtn.innerText = 'loading...';
        document.querySelector('ul').innerHTML = '';
        const results = await getAlbums(e);
        displayAlbums(results);
        setLastReq(lastReq, 'albums', results.next);
        $getAlbumsBtn.disabled = false;
        $getAlbumsBtn.innerText = 'get Albums';
    } catch (e) {
        console.log(e);
        $getAlbumsBtn.disabled = false;
        $getAlbumsBtn.innerText = 'get Albums';
    }
});

$getPlaylistsBtn.addEventListener('click', async (e) => {
    try {
        $getPlaylistsBtn.disabled = true;
        $getPlaylistsBtn.innerText = 'loading';
        document.querySelector('ul').innerHTML = '';
        const results = await getPlaylists(e);
        displayPlaylists(results);
        setLastReq(lastReq, 'playlists', results.next);
        $getPlaylistsBtn.disabled = false;
        $getPlaylistsBtn.innerText = 'Get Playlists';
    } catch (e) {
        console.log(e);
        $getPlaylistsBtn.disabled = false;
        $getPlaylistsBtn.innerText = 'Get Playlists';
    }
});

window.addEventListener('scroll', async (e) => {
    const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
    if (
        lastReq.next === null ||
        lastReq.isFecthing ||
        scrollTop + clientHeight <= scrollHeight - 100
    )
        return;
    const NextUrlBackup = lastReq.next;
    try {
        lastReq.isFecthing = true;
        $floatingBarsG.style.transform = 'scale(1)';
        const type = Object.keys(lastReq).find((el) => lastReq[el] === true);
        lastReq.next = await loadNext(type, lastReq.next);
        lastReq.isFecthing = false;
        $floatingBarsG.style.transform = 'scale(0)';
    } catch {
        lastReq.isFecthing = false;
        lastReq.next = NextUrlBackup;
        $floatingBarsG.style.transform = 'scale(0)';
    }
});
