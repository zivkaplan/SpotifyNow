const mongoose = require('mongoose');
const express = require('express');

const mainControllers = require('../controllers/mainControllers');
const router = express.Router();

router.get('/login', mainControllers.loginToSpotify);

router.get('/logout', mainControllers.logout);

router.post('/search', mainControllers.getSearchResults);

router.get('/albums', mainControllers.getAlbums);

router.get('/playlists', mainControllers.getPlaylists);

router.get('/addToQueue', mainControllers.addToQueue);

router.get('/next', mainControllers.loadNext);

router.get('/', mainControllers.isAuthenticated, mainControllers.loggedInPage);

module.exports = router;
