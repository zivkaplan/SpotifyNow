const mongoose = require('mongoose');
const express = require('express');
const { isAuthenticated, validateAccessToken } = require('../middleware');
const mainControllers = require('../controllers/mainControllers');
const router = express.Router();

router.use(validateAccessToken);

router.get('/login', mainControllers.loginToSpotify);

router.get('/logout', isAuthenticated, mainControllers.logout);

router.post('/search', isAuthenticated, mainControllers.getSearchResults);

router.get('/albums', isAuthenticated, mainControllers.getAlbums);

router.get('/playlists', isAuthenticated, mainControllers.getPlaylists);

router.get('/addToQueue', isAuthenticated, mainControllers.addToQueue);

router.get(
    '/recentlyPlayed',
    isAuthenticated,
    mainControllers.getRecentlyPlayed
);
router.get('/next', isAuthenticated, mainControllers.loadNext);

router.get('/', mainControllers.loggedInPage);

module.exports = router;
