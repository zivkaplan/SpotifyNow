if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const axios = require('axios');
const express = require('express');
const session = require('express-session');
const ejsMate = require('ejs-mate');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

const appConfig = (function () {
    const secret = process.env.SECRET || 'spotifyProject';
    const sessionConfig = {
        name: 'SessConnect',
        secret: secret,
        resave: false,
        saveUninitialized: true,
        cookie: {
            expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
            // secure: true,
        },
    };

    app.engine('ejs', ejsMate);
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));
    app.use(session(sessionConfig));

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
})();

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

const getDetails = (token) => {
    return axios({
        method: 'get',
        url: 'https://api.spotify.com/v1/me',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Bearer ' + token.access_token,
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
    token = response.data;
    console.log(token);

    if (response.status !== 200) {
        res.send('Auth failed!');
    }

    res.cookie('acces_token', JSON.stringify(token.access_token));
    const userDetails = await getDetails(token);
    console.log(userDetails);

    res.render('main', { user: userDetails.data });
});

app.get('/', (req, res) => {
    res.render('home');
});

app.listen(port, (req, res) => {
    console.log('Server up');
});
