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
        console.log(req.session.expires_in, Date.now() + 12000);
        if (
            req.session.firstLogin &&
            req.session.sessionKey &&
            req.session.expires_in &&
            req.session.expires_in <= Date.now() + 120000
        ) {
            console.log('refreshing access token');
            await updateAccessToken(req);
        }
        next();
    } catch (e) {
        console.log(e);
        res.redirect('/');
    }
};

const updateAccessToken = async (req) => {
    try {
        const user = await User.findOne({
            sessionKey: req.session.sessionKey,
        });
        if (!user) return;
        const response = await refreshAccessToken(user, spotifyAuth);
        user.token.access_token = response.data.access_token;
        user.token.expires_in = Date.now() + response.data.expires_in * 1000;
        user.token.scope = response.data.scope;
        user.token.refresh_token =
            response.data.refresh_token || user.token.refresh_token;

        return await user.save();
    } catch (e) {
        console.log(e);
        return e;
    }
};
