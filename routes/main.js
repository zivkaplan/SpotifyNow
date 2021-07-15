// const mongoose = require("mongoose");
const User = require("../models/user");
const axios = require("axios");
const express = require("express");
const session = require("express-session");
const ejsMate = require("ejs-mate");
const { spotifyAuthConfig } = require("../configs/spotifyAuthConfig");
const { getToken, getDetails, searchTracks } = require("../helpers");
spotifyAuth = spotifyAuthConfig();
const router = express.Router();
const { validateTokenExpiration } = require("../middleware");

// router.use('/', async (req, res, next) => {
//     // if ()
//     const user = await User.findOne({ spotify_id: req.body.id });
//     validateTokenExpiration();
//     next();
// });

router.get("/login", (req, res) => {
    res.redirect(spotifyAuth.authUrl);
});

router.post("/search", async (req, res) => {
    const user = await User.findOne({ spotify_id: req.body.id });
    if (!req.body.q) return;
    const searchResults = await searchTracks(user, req.body);
    res.send(searchResults);
});

router.get("/now", async (req, res) => {
    //send post request to Spotify
    const response = await getToken(req.query.code, spotifyAuth);
    token = response.data;

    if (response.status !== 200) {
        res.send("error");
    }
    const userDetails = await getDetails(token);
    // console.log(token);
    // console.log(userDetails.data);
    let user;
    try {
        user = await User.findOneAndUpdate(
            { spotify_id: userDetails.data.id },
            {
                username: userDetails.data.display_name,
                spotify_id: userDetails.data.id,
                image_url: userDetails.data.images[0].url
                    ? userDetails.data.images[0].url
                    : null,
                token: {
                    access_token: token.access_token,
                    token_type: token.token_type,
                    expires_in: Date.now() + token.expires_in,
                    refresh_token: token.refresh_token,
                    scope: token.scope,
                },
            }
        );
    } catch (e) {
        console.log(e);
        user = new User({
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
    }
    // console.log(user);

    res.cookie("SpotifyAccess", user.spotify_id);
    res.render("loggedin", { user: userDetails.data });
});
router.get("/", (req, res) => {
    res.render("start");
});

module.exports = router;
