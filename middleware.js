const express = require('express');
const User = require('./models/user');
// const axios = require('axios');

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

module.exports.isAuthenticated = async (req, res, next) => {
    try {
        if (
            !req.session.firstLogin ||
            (req.session.sessionKey &&
                req.session.expires_in &&
                req.session.expires_in > Date.now() &&
                Boolean(
                    await User.countDocuments({
                        sessionKey: req.session.sessionKey,
                    })
                ))
        ) {
            next();
        } else {
            res.redirect('/login');
        }
    } catch (e) {
        console.log(e);
        res.send(e.message);
        // res.redirect('/login');
    }
};
