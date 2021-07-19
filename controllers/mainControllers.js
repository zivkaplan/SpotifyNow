const mongoose = require('mongoose');
const User = require('../models/user');

const express = require('express');
const { spotifyAuthConfig } = require('../configs/spotifyAuthConfig');
const {
    tokenRequest,
    detailsRequest,
    searchTracks,
    albumsRequest,
    playlistsRequest,
    addToQueueRequest,
    loadNextReqeust,
    isLoggedIn,
} = require('../controllers/functions');
spotifyAuth = spotifyAuthConfig();

module.exports.loginToSpotify = (req, res) => {
    res.redirect(spotifyAuth.authUrl);
};

module.exports.getSearchResults = async (req, res) => {
    if (!req.body.q || !req.session.spotifyAccess) return;
    const user = await User.findOne({
        spotify_id: req.session.spotifyAccess,
    });
    const response = await searchTracks(user, req.body);
    res.send(response);
};

module.exports.getAlbums = async (req, res) => {
    if (!req.session.spotifyAccess) return;
    const user = await User.findOne({
        spotify_id: req.session.spotifyAccess,
    });
    const response = await albumsRequest(user);
    res.send(response);
};

module.exports.getPlaylists = async (req, res) => {
    if (!req.session.spotifyAccess) return;
    const user = await User.findOne({
        spotify_id: req.session.spotifyAccess,
    });
    const response = await playlistsRequest(user);
    res.send(response);
};

module.exports.addToQueue = async (req, res) => {
    if (!req.session.spotifyAccess) return;
    const user = await User.findOne({
        spotify_id: req.session.spotifyAccess,
    });
    if (!req.query.uri) return;
    const response = await addToQueueRequest(user, req.query.uri);
    if (!response.status === 204) {
        res.send('Error. try again');
    }
    res.sendStatus(200);
};

module.exports.loadNext = async (req, res) => {
    if (!req.session.spotifyAccess || !req.query.next) return;
    const user = await User.findOne({
        spotify_id: req.session.spotifyAccess,
    });
    const response = await loadNextReqeust(user, req.query.next);
    // console.log(response);
    res.send(response);
};

module.exports.thisOne = async (req, res) => {
    if (await isLoggedIn(req)) {
        try {
            const user = await User.findOne({
                spotify_id: req.session.spotifyAccess,
            });
            return res.render('loggedin', { user });
        } catch (e) {
            console.log('catch block 1');
            console.log(e);
        }
    } else {
        try {
            //send post request to Spotify
            const response = await tokenRequest(req.query.code, spotifyAuth);
            if (response.error) {
                return res.render('start');
            }
            const userToken = response.data;
            const userData = await detailsRequest(userToken.access_token);
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
                    expires_in: Date.now() + userToken.expires_in * 1000, //Date.now() is in milliseconds, spotify in seconds
                    refresh_token: userToken.refresh_token,
                    scope: userToken.scope,
                },
            };

            // console.log(userDetails);
            let user = await User.findOneAndUpdate(
                { spotify_id: userData.data.id },
                userDetails,
                { new: true }
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
        }
    }
};
