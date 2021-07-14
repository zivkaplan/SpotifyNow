const mongoose = require('mongoose');
const User = require('../models/user');
const axios = require('axios');
const express = require('express');
const session = require('express-session');
const ejsMate = require('ejs-mate');
const { spotifyAuthConfig } = require('../config');
const { getToken, getDetails } = require('../helpers');
spotifyAuth = spotifyAuthConfig();
const router = express.Router();

router.get('/login', (req, res) => {
    res.redirect(spotifyAuth.authUrl);
});

router.post('/search', async (req, res) => {
    const user = await User.findOne({ spotify_id: req.body.id });
    axios({
        method: 'get',
        url: 'https://api.spotify.com/v1/search',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + user.token.access_token,
        },
        params: {
            q: req.body.q,
            type: req.body.type,
        },
    })
        .then((response) => {
            res.send(JSON.stringify(response.data));
        })
        .catch((e) => {
            console.log(e);
            res.send(e);
        });
});

router.get('/now', async (req, res) => {
    //send post request to Spotify
    const response = await getToken(req.query.code, spotifyAuth);
    token = response.data;

    if (response.status !== 200) {
        res.send('error');
    }
    const userDetails = await getDetails(token);
    // console.log(token);
    // console.log(userDetails.data);

    const user = await User.findOne({ spotify_id: userDetails.data.id });
    new User({
        username: userDetails.data.display_name,
        spotify_id: userDetails.data.id,
        image_url: userDetails.data.images[0].url,
        token: {
            access_token: token.access_token,
            token_type: token.token_type,
            expires_in: Date.now() + token.expires_in,
            refresh_token: token.refresh_token,
            scope: token.scope,
        },
    });
    await user.save();

    res.cookie('SpotifyAccess', user.spotify_id);
    res.render('loggedin', { user: userDetails.data });
});
router.get('/', (req, res) => {
    res.render('start');
});

module.exports = router;
