const $search = document.getElementById('search');
const $getAlbumsBtn = document.querySelector('button.getAlbums');
const $getPlaylistsBtn = document.querySelector('button.getPlaylists');
const $logoutBtn = document.querySelector('.logout');
const $floatingBarsG = document.querySelector('#floatingBarsG');
const $searchTypeRadioBtns = document.querySelectorAll(
    'input[name="searchType"]'
);
const $spotifyEmbededPlayer = document.querySelector('.spotifyEmbededPlayer');
const $spotifyEmbededPlayerWrapper = document.querySelector(
    '.spotifyEmbededPlayerWrapper'
);
const $arrow = document.querySelector('.arrow');
const lastReq = {
    search: false,
    albums: false,
    playlists: false,
    next: null,
    isFecthing: false,
};
window.addEventListener('load', async (e) => {
    const result = await getRecentlyPlayed();
    const lastTrackUrl =
        'https://open.spotify.com/embed/' +
        result.items[0].track.type +
        '/' +
        result.items[0].track.id;
    $spotifyEmbededPlayer.setAttribute(
        'src',
        result.items[0].track.id
            ? lastTrackUrl
            : 'https://open.spotify.com/embed/track/7MAibcTli4IisCtbHKrGMh'
    );
});

$searchTypeRadioBtns.forEach((btn) => {
    btn.addEventListener('change', newSearch);
});

$search.addEventListener('input', newSearch);

$getAlbumsBtn.addEventListener('click', async (e) => {
    try {
        $getAlbumsBtn.disabled = true;
        $getAlbumsBtn.innerText = 'loading...';
        document.querySelector('ul').innerHTML = '';
        const results = await getAlbums(e);
        displayAlbums(results);
        setLastReq(lastReq, 'albums', results.next);
        $getAlbumsBtn.disabled = false;
        $getAlbumsBtn.innerText = 'Show my saved albums';
    } catch (e) {
        console.log(e);
        $getAlbumsBtn.disabled = false;
        $getAlbumsBtn.innerText = 'Show my saved albums';
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
        $getPlaylistsBtn.innerText = 'Show my saved playlists';
    } catch (e) {
        console.log(e);
        $getPlaylistsBtn.disabled = false;
        $getPlaylistsBtn.innerText = 'Show my saved playlists';
    }
});

window.addEventListener('scroll', async (e) => {
    const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
    if (
        lastReq.next === null ||
        lastReq.isFecthing ||
        scrollTop + clientHeight <= scrollHeight - 600
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

$logoutBtn.addEventListener('click', async (e) => {
    const spotifyLogoutWindow = window.open(
        'https://accounts.spotify.com/en/logout',
        'Spotify Logout',
        'width=700,height=500,top=40,left=40'
    );

    setTimeout(() => {
        spotifyLogoutWindow.close();
        location.assign('/logout');
    }, 2000).then();
});

$spotifyEmbededPlayerWrapper.addEventListener('click', (e) => {
    $spotifyEmbededPlayer.classList.toggle('openList');
    $arrow.classList.toggle('open');
});
