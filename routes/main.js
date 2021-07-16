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
} = require('../helpers');
spotifyAuth = spotifyAuthConfig();
const router = express.Router();
const { validateAccessToken, refreshAccessToken } = require('../middleware');

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
    if (!req.body.q || !req.session.SpotifyAccess) return;
    const user = await User.findOne({ spotify_id: req.session.SpotifyAccess });
    const searchResults = await searchTracks(user, req.body);
    res.send(searchResults);
});

router.get('/albums', async (req, res) => {
    if (!req.session.SpotifyAccess) return;
    const user = await User.findOne({ spotify_id: req.session.SpotifyAccess });
    const albums = await getAlbums(user);
    res.send(albums);
});

router.get('/playlists', async (req, res) => {
    if (!req.session.SpotifyAccess) return;
    const user = await User.findOne({ spotify_id: req.session.SpotifyAccess });
    const playlists = await getPlaylists(user);
    res.send(playlists);
});

router.get('/addToQueue', async (req, res) => {
    const user = await User.findOne({ spotify_id: req.session.SpotifyAccess });
    if (!req.query.uri) return;
    const response = await addToQueue(user, req.query.uri);
    if (!response.status === 204) {
        res.send('Eror. try again');
    }
    res.sendStatus(200);
});

router.get('/now', async (req, res) => {
    //send post request to Spotify
    const response = await getToken(req.query.code, spotifyAuth);
    token = response.data;

    if (response.status !== 200) {
        res.send('error');
    }
    const userData = await getDetails(token);
    // console.log(token);
    // console.log(userData.data);
    const userDetails = {
        username: userData.data.display_name,
        spotify_id: userData.data.id,
        image_url: userData.data.images[0].url
            ? userData.data.images[0].url
            : null,
        token: {
            access_token: token.access_token,
            token_type: token.token_type,
            expires_in: Date.now() + token.expires_in,
            refresh_token: token.refresh_token,
            scope: token.scope,
        },
    };

    let user = await User.findOneAndUpdate(
        { spotify_id: userData.data.id },
        userDetails
    );
    if (!user) {
        user = new User({ userDetails });
        await user.save();
    }
    // console.log(user);

    req.session.SpotifyAccess = user.spotify_id;
    res.render('loggedin', { user: userData.data });
});

router.get('/', (req, res) => {
    res.render('start');
});

module.exports = router;
