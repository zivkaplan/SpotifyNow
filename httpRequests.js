const axios = require('axios');
const User = require('./models/user');

module.exports.tokenRequest = (code, spotifyAuth) => {
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
            console.log(e.response);
            return e;
        });
};

module.exports.detailsRequest = (access_token) => {
    return axios({
        method: 'get',
        url: 'https://api.spotify.com/v1/me',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Bearer ' + access_token,
        },
    })
        .then((response) => {
            return response;
        })
        .catch((e) => {
            console.log(e.response);
            return e;
        });
};

module.exports.searchTracks = (user, data) => {
    return axios({
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
};

module.exports.albumsRequest = (user) => {
    return axios({
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
};

module.exports.playlistsRequest = (user) => {
    return axios({
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
};

module.exports.addToQueueRequest = (user, uri) => {
    return axios({
        method: 'post',
        url: 'https://api.spotify.com/v1/me/player/queue',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + user.token.access_token,
        },
        params: {
            uri,
        },
    })
        .then((response) => {
            return response;
        })
        .catch((e) => {
            console.log(e.response);
            return e;
        });
};

module.exports.loadNextReqeust = (user, url) => {
    return axios({
        method: 'get',
        url: url,
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
};

module.exports.refreshAccessToken = (user, spotifyAuth) => {
    return axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        params: {
            grant_type: 'refresh_token',
            refresh_token: user.token.refresh_token,
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: spotifyAuth.authorizationHeaderString,
        },
    })
        .then((response) => {
            return response;
        })
        .catch((e) => {
            console.log(e.response);
            return e;
        });
};

module.exports.recentlyPlayedRequest = async (user) => {
    return axios({
        method: 'get',
        url: 'https://api.spotify.com/v1/me/player/recently-played',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + user.token.access_token,
        },
        params: {
            limit: 1,
        },
    })
        .then((response) => {
            return response.data;
        })
        .catch((e) => {
            console.log(e.response);
            return e;
        });
};
