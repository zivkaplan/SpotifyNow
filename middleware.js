const express = require('express');
const User = require('./models/user');
const { refreshAccessToken } = require('./httpRequests');
const { spotifyAuthConfig } = require('./configs/spotifyAuthConfig');
spotifyAuth = spotifyAuthConfig();

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
            res.redirect('/');
        }
    } catch (e) {
        console.log(e);
        res.send(e.message);
    }
};

module.exports.validateAccessToken = async (req, res, next) => {
    try {
        if (
            req.session.activeSession &&
            req.session.sessionKey &&
            req.session.expires_in &&
            req.session.expires_in <= Date.now() + 120000
        ) {
            console.log('refreshing access token');
            const newExpiration = await updateAccessToken(req);
            req.session.expires_in = newExpiration;
            console.log('Access Token Updated');
        }
        next();
    } catch (e) {
        console.log(e);
        res.send('validate error');
    }
};

const updateAccessToken = async (req) => {
    try {
        const user = await User.findOne({
            sessionKey: req.session.sessionKey,
        });
        if (!user) return;
        const response = await refreshAccessToken(user, spotifyAuth);
        if (response.status === 200) {
            user.token.access_token = response.data.access_token;
            user.token.expires_in =
                Date.now() + response.data.expires_in * 1000;
            user.token.scope = response.data.scope;
            user.token.refresh_token =
                response.data.refresh_token || user.token.refresh_token;

            await user.save();
            return user.token.expires_in;
        }
    } catch (e) {
        console.log(e);
        return e;
    }
};
