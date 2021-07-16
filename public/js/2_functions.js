const setLastReq = (lastReq, value, next) => {
    for (const key in lastReq) {
        lastReq[key] = key === value ? true : false;
    }
    lastReq.next = next;
};

const searchTrack = async (e) => {
    const url = new URL('http://localhost:3000/search');
    const config = {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            q: e.target.value,
            type: 'track',
        }),
    };

    const response = await fetch(url, config);
    return response.json();
};

const getAlbums = async (e) => {
    const url = new URL('http://localhost:3000/albums');
    const config = {
        method: 'get',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    };
    const response = await fetch(url, config);
    return response.json();
};

const getPlaylists = async (e) => {
    const url = new URL('http://localhost:3000/playlists');
    const config = {
        method: 'get',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    };
    const response = await fetch(url, config);
    return response.json();
};

const displayTracks = (data) => {
    const results = data.tracks.items.map((item) => {
        return Track(item);
    });
    results.forEach((res) => {
        res.addEventListener('click', addToQueue);
        document.querySelector('ul').append(res);
    });
};

const displayAlbums = (data) => {
    const results = data.items.map((item) => {
        return Album(item);
    });
    document.querySelector('ul').innerHTML += results.join('');
};

const displayPlaylists = (data) => {
    const results = data.items.map((item) => {
        return Playlist(item);
    });
    document.querySelector('ul').innerHTML += results.join('');
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

    return fetch(url, config)
        .then((response) => {
            if (response.status === 200) {
                alert('Track added to Queue');
            }
        })
        .catch((e) => {
            console.log(e);
        });
};

const loadNext = async (type, next) => {
    const requestNext = async () => {
        const url = new URL('http://localhost:3000/next');
        const config = {
            method: 'get',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        };

        const params = { next: next };
        url.search = new URLSearchParams(params);

        const response = await fetch(url, config);
        return response.json();
    };

    const results = await requestNext();

    let newNext;
    if (type === 'search') {
        displayTracks(results);
        newNext = results.tracks.next;
    } else if (type === 'albums') {
        newNext = results.next;
        displayAlbums(results);
    } else if (type === 'playlists') {
        displayPlaylists(results);
        newNext = results.next;
    }
    return newNext;
};
