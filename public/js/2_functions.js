const searchTrack = (e) => {
    const url = new URL('http://localhost:3000/search');
    const config = {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            q: e.target.value,
            type: 'track,artist',
        }),
    };

    fetch(url, config)
        .then((response) => response.json())
        .then((data) => {
            const results = data.tracks.items.map((item) => {
                return Track(item);
            });
            document.querySelector('ul').innerHTML = '';
            results.forEach((res) => {
                res.addEventListener('click', addToQueue);
                document.querySelector('ul').append(res);
            });
        })
        .catch((e) => {
            console.log(e);
        });
};

const getAlbums = (e) => {
    const url = new URL('http://localhost:3000/albums');
    const config = {
        method: 'get',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    };
    fetch(url, config)
        .then((response) => response.json())
        .then((data) => {
            const results = data.items.map((item) => {
                return Album(item);
            });
            document.querySelector('ul').innerHTML = results.join('');
        })
        .catch((e) => {
            console.log(e);
        });
};

const getPlaylists = (e) => {
    const url = new URL('http://localhost:3000/playlists');
    const config = {
        method: 'get',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    };
    fetch(url, config)
        .then((response) => response.json())
        .then((data) => {
            const results = data.items.map((item) => {
                return Playlist(item);
            });
            document.querySelector('ul').innerHTML = results.join('');
        })
        .catch((e) => {
            console.log(e);
        });
};

const addToQueue = (e) => {
    const url = new URL('http://localhost:3000/addToQueue');
    const config = {
        method: 'get',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    };
    const params = { uri: e.target.dataset.uri };
    url.search = new URLSearchParams(params);

    fetch(url, config)
        .then((response) => {
            if (response.status === 200) {
                alert('Track added to Queue');
            }
        })
        .catch((e) => {
            console.log(e);
        });
};
