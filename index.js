if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const axios = require('axios');
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const spotifyAuth = (function () {
    const baseAuthUrl = 'https://accounts.spotify.com/authorize';
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const scopes = [
        'app-remote-control',
        'streaming',
        'playlist-modify-public',
        'playlist-modify-private',
        'playlist-read-private',
        'playlist-read-collaborative',
        'user-read-currently-playing',
    ];

    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const redirectUri = `http://localhost:${port}/now`;

    const authorizationHeaderString =
        'Basic ' +
        Buffer.from(clientId + ':' + clientSecret).toString('base64');

    const authUrl = `${baseAuthUrl}?response_type=code&client_id=${clientId}&scope=${scopes.join(
        '%20'
    )}&redirect_uri=${encodeURIComponent(redirectUri)}`;

    return {
        authUrl,
        tokenUrl,
        redirectUri,
        authorizationHeaderString,
    };
})();

const getToken = (code) => {
    return axios({
        method: 'post',
        url: spotifyAuth.tokenUrl,
        params: {
            grant_type: 'authorization_code',
            code,
            redirect_uri: spotifyAuth.redirectUri,
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            authorization: spotifyAuth.authorizationHeaderString,
        },
    })
        .then((response) => {
            return response;
        })
        .catch((e) => {
            return e.response.data;
        });
};

app.get('/login', (req, res) => {
    res.redirect(spotifyAuth.authUrl);
});

app.get('/now', async (req, res) => {
    //send post request to Spotify
    const response = await getToken(req.query.code);
    console.log(response);
    res.send('OK');
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.listen(port, (req, res) => {
    console.log('Server up');
});
