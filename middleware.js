const axios = require('axios');
const User = require('./models/user');

module.exports.validateTokenExpiration = (user, spotifyAuth) => {
    if (Date.now() < user.token.expires_in) return;
    return axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        params: {
            grant_type: 'authorization_code',
            code: refreshToken,
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
