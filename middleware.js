// const express = require('express');
// const axios = require('axios');
// const User = require('./models/user');

// module.exports.isLoggedIn = async (req) => {
//     if (!req.session.SpotifyAccess || !req.session.expiration) return false;
//     console.log(req.session.expiration, Date.now());
//     return (
//         req.session.expiration > Date.now() &&
//         (await User.exists({ spotify_id: req.session.SpotifyAccess }))
//     );
// };

// module.exports.validateAccessToken = (user, spotifyAuth) => {
//     console.log(Date.now(), user.token.expires_in);
//     if (Date.now() < user.token.expires_in) return true;
//     return false;
// };

// module.exports.refreshAccessToken = (user, spotifyAuth) => {
//     return axios({
//         method: 'post',
//         url: 'https://accounts.spotify.com/api/token',
//         params: {
//             grant_type: 'authorization_code',
//             code: user.token.refresh_token,
//             redirect_uri: spotifyAuth.redirectUri,
//         },
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//             authorization: spotifyAuth.authorizationHeaderString,
//         },
//     })
//         .then((response) => {
//             return response;
//         })
//         .catch((e) => {
//             return e.response.data;
//         });
// };
