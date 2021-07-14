const axios = require('axios');

// module.exports.localStorageSpotify = {
//     getAccessToken: function () {
//         var expires = 0 + localStorage.getItem('pa_expires', '0');
//         if (new Date().getTime() > expires) {
//             return '';
//         }
//         var token = localStorage.getItem('pa_token', '');
//         return token;
//     },
//     setAccessToken: function (token, expires_in) {
//         localStorage.setItem('pa_token', token);
//         localStorage.setItem('pa_expires', new Date().getTime() + expires_in);
//     },
//     getUsername: function () {
//         var username = localStorage.getItem('pa_username', '');
//         return username;
//     },
//     setUsername: function (username) {
//         localStorage.setItem('pa_username', username);
//     },
// };

module.exports.getToken = (code, spotifyAuth) => {
    return axios({
        method: 'post',
        url: spotifyAuth.tokenUrl,
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
