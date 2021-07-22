const mongoose = require('mongoose');
const User = require('../models/user');
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const {
    tokenRequest,
    detailsRequest,
    searchTracks,
    albumsRequest,
    playlistsRequest,
    addToQueueRequest,
    loadNextReqeust,
} = require('../httpRequests');
const { spotifyAuthConfig } = require('../configs/spotifyAuthConfig');
spotifyAuth = spotifyAuthConfig();

module.exports.loginToSpotify = (req, res) => {
    res.redirect(spotifyAuth.authUrl);
};

module.exports.logout = async (req, res) => {
    req.session.destroy();
    res.redirect('/');
};

module.exports.getSearchResults = async (req, res) => {
    if (!req.body.q || !req.session.sessionKey) return;
    const user = await User.findOne({
        sessionKey: req.session.sessionKey,
    });
    const response = await searchTracks(user, req.body);
    res.send(response);
};

module.exports.getAlbums = async (req, res) => {
    if (!req.session.sessionKey) return;
    const user = await User.findOne({
        sessionKey: req.session.sessionKey,
    });
    const response = await albumsRequest(user);
    res.send(response);
};

module.exports.getPlaylists = async (req, res) => {
    if (!req.session.sessionKey) return;
    const user = await User.findOne({
        sessionKey: req.session.sessionKey,
    });
    const response = await playlistsRequest(user);
    res.send(response);
};

module.exports.addToQueue = async (req, res) => {
    if (!req.session.sessionKey) return;
    const user = await User.findOne({
        sessionKey: req.session.sessionKey,
    });
    if (!req.query.uri) return;
    const response = await addToQueueRequest(user, req.query.uri);
    if (!response.status === 204) {
        res.send('Error. try again');
    }
    res.sendStatus(200);
};

module.exports.loadNext = async (req, res) => {
    if (!req.session.sessionKey || !req.query.next) return;
    const user = await User.findOne({
        sessionKey: req.session.sessionKey,
    });
    const response = await loadNextReqeust(user, req.query.next);
    // console.log(response);
    res.send(response);
};

module.exports.loadExistingUser = {};

module.exports.loggedInPage = async (req, res) => {
    try {
        let user;
        if (!req.query.code && !req.session.activeSession) {
            //if the user was not logged in and was not redirected from spotify
            return res.render('loginPage');
        } else if (req.session.activeSession) {
            // user already logged in - session active
            user = await User.findOne({
                sessionKey: req.session.sessionKey,
            });
        } else {
            //first login in to session user logged in and redirected from spofity
            //send post request to Spotify
            const response = await tokenRequest(req.query.code, spotifyAuth);
            const userToken = response.data;
            const userData = await detailsRequest(userToken.access_token);

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
                sessionKey: uuidv4(),
            };

            user = await User.findOneAndUpdate(
                { spotify_id: userData.data.id },
                userDetails,
                { new: true }
            );

            if (!user) {
                user = new User(userDetails);
                await user.save();
            }

            req.session.activeSession = true;
            req.session.sessionKey = userDetails.sessionKey;
            req.session.expires_in = user.token.expires_in;
        }
        res.render('loggedin', { user });
    } catch (e) {
        console.log(e);
        res.render('loginPage');
    }
};
