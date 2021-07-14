const $search = document.getElementById('search');

function getCookie(name) {
    var pair = document.cookie.match(new RegExp(name + '=([^;]+)'));
    return !!pair ? pair[1] : null;
}

$search.addEventListener('input', (e) => {
    if (!e.target.value) {
        document.querySelector('ul').innerHTML = '';
    }

    const url = new URL('http://localhost:3000/search');
    const config = {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: getCookie('SpotifyAccess'),
            q: e.target.value,
            type: 'track,artist',
        }),
    };

    fetch(url, config)
        .then((response) => response.json())
        .then((data) => {
            const results = data.tracks.items.map((track) => {
                return `<li class="li_result">
                <a class="trackHref" href="${track.uri}">
                <div class="result_wrap">
                <img class="albumArt" alt="${track.album.name}" src="${track.album.images[2].url}">
                <span class="result trackName"> ${track.name}</span>
                <span class="result artistName">${track.album.artists[0].name}</span>
                <span class="result albumName">${track.album.name}</span>
                </div></a></li>`;
            });
            document.querySelector('ul').innerHTML = results.join('');
        })
        .catch((e) => {
            console.log(e);
        });
});
