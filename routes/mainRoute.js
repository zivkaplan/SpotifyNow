const mongoose = require('mongoose');
const User = require('../models/user');
const axios = require('axios');
const express = require('express');
const session = require('express-session');
const ejsMate = require('ejs-mate');
const { spotifyAuthConfig } = require('../configs/spotifyAuthConfig');
const {
    getToken,
    getDetails,
    searchTracks,
    getAlbums,
    getPlaylists,
    addToQueue,
    loadNext,
    isLoggedIn,
} = require('../controllers/mainController');
spotifyAuth = spotifyAuthConfig();
const router = express.Router();
// const {
//     validateAccessToken,
//     refreshAccessToken,
// } = require('../middleware');

// router.use('/', async (req, res, next) => {
//     if (!req.body.id) next();
//     const user = await User.findOne({ spotify_id: req.body.id });
//     if (user) {
//         const isValid = validateAccessToken(user, spotifyAuth);
//         if (!isValid) {
//             const newToken = await refreshAccessToken(user, spotifyAuth);
//             await User.findOneAndUpdate(
//                 { spotify_id: req.body.id },
//                 { token: { access_token: newToken } }
//             );
//         }
//     }
//     next();
// });

router.get('/login', (req, res) => {
    res.redirect(spotifyAuth.authUrl);
});

router.post('/search', async (req, res) => {
    if (!req.body.q || !req.session.spotifyAccess) return;
    const user = await User.findOne({ spotify_id: req.session.spotifyAccess });
    const response = await searchTracks(user, req.body);
    res.send(response);
});

router.get('/albums', async (req, res) => {
    if (!req.session.spotifyAccess) return;
    const user = await User.findOne({ spotify_id: req.session.spotifyAccess });
    const response = await getAlbums(user);
    res.send(response);
});

router.get('/playlists', async (req, res) => {
    if (!req.session.spotifyAccess) return;
    const user = await User.findOne({ spotify_id: req.session.spotifyAccess });
    const response = await getPlaylists(user);
    res.send(response);
});

router.get('/addToQueue', async (req, res) => {
    if (!req.session.spotifyAccess) return;
    const user = await User.findOne({ spotify_id: req.session.spotifyAccess });
    if (!req.query.uri) return;
    const response = await addToQueue(user, req.query.uri);
    if (!response.status === 204) {
        res.send('Error. try again');
    }
    res.sendStatus(200);
});

router.get('/next', async (req, res) => {
    if (!req.session.spotifyAccess || !req.query.next) return;
    const user = await User.findOne({ spotify_id: req.session.spotifyAccess });
    const response = await loadNext(user, req.query.next);
    // console.log(response);
    res.send(response);
});

router.get('/now', async (req, res) => {
    // check if user is already logged in
    try {
        console.log(await isLoggedIn(req));
        if (await isLoggedIn(req)) {
            const user = await User.findOne({
                spotify_id: req.session.spotifyAccess,
            });
            console.log(user);
            res.render('loggedin', { user });
        }
    } catch (e) {
        console.log(e);
    }
    try {
        //send post request to Spotify
        const response = await getToken(req.query.code, spotifyAuth);
        const userToken = response.data;
        const userData = await getDetails(userToken.access_token);
        // console.log(userToken);
        // console.log(userData.data);
        const userDetails = {
            username: userData.data.display_name,
            spotify_id: userData.data.id,
            image_url: userData.data.images?.[0]?.url
                ? userData.data.images[0].url
                : null,
            token: {
                access_token: userToken.access_token,
                token_type: userToken.token_type,
                expires_in: userToken.expires_in,
                refresh_token: userToken.refresh_token,
                scope: userToken.scope,
            },
        };
        // console.log(userDetails);
        let user = await User.findOneAndUpdate(
            { spotify_id: userData.data.id },
            userDetails
        );
        if (!user) {
            user = new User(userDetails);
            await user.save();
        }
        // console.log(user);
        req.session.spotifyAccess = user.spotify_id;
        req.session.expires_in = user.token.expires_in;

        res.render('loggedin', { user });
    } catch (e) {
        console.log(e);
        res.redirect('/');
    }
});

router.get('/', async (req, res) => {
    res.render('start');
});

module.exports = router;
