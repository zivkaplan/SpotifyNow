const axios = require('axios');

module.exports.getToken = (code, spotifyAuth) => {
    return axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        params: {
            grant_type: 'authorization_code',
            code,
            redirect_uri: spotifyAuth.redirectUri,
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            authorization: spotifyAuth.authorizationHeaderString,
        },
    })
        .then((response) => {
            return response;
        })
        .catch((e) => {
            return e.response.data;
        });
};

module.exports.getDetails = (token) => {
    return axios({
        method: 'get',
        url: 'https://api.spotify.com/v1/me',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Bearer ' + token.access_token,
        },
    })
        .then((response) => {
            return response;
        })
        .catch((e) => {
            return e.response.data;
        });
};

module.exports.searchTracks = (user, data) => {
    const searchResults = axios({
        method: 'get',
        url: 'https://api.spotify.com/v1/search',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + user.token.access_token,
        },
        params: {
            q: data.q,
            type: data.type,
        },
    })
        .then((response) => {
            return response.data;
        })
        .catch((e) => {
            console.log(e.response);
            return e;
        });

    return searchResults ? searchResults : null;
};

module.exports.getAlbums = (user) => {
    const albums = axios({
        method: 'get',
        url: 'https://api.spotify.com/v1/me/albums',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + user.token.access_token,
        },
    })
        .then((response) => {
            return response.data;
        })
        .catch((e) => {
            console.log(e.response);
            return e;
        });
    return albums ? albums : null;
};

module.exports.getPlaylists = (user) => {
    const playlists = axios({
        method: 'get',
        url: 'https://api.spotify.com/v1/me/playlists',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + user.token.access_token,
        },
    })
        .then((response) => {
            return response.data;
        })
        .catch((e) => {
            console.log(e.response);
            return e;
        });
    return playlists ? playlists : null;
};

module.exports.addToQueue = (user, data) => {
    const response = axios({
        method: 'post',
        url: 'https://api.spotify.com/v1/me/player/queue',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + user.token.access_token,
        },
        params: {
            uri: data.uri,
        },
    })
        .then((response) => {
            return response;
        })
        .catch((e) => {
            console.log(e.response);
            return e;
        });

    return response ? response : null;
};
