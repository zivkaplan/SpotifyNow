if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const User = require('./models/user');
const axios = require('axios');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const ejsMate = require('ejs-mate');
const path = require('path');
const app = express();
const mainRouter = require('./routes/mainRoute');

const port = process.env.PORT || 3000;
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/spotify-now';
const secret = process.env.SECRET || 'spotifyProject';

const { mongooseConfig } = require('./configs/mongooseConfig');
mongooseConfig(dbUrl);

const appConfig = (function () {
    const sessionConfig = {
        name: 'SessConnect',
        secret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
            // secure: true,
        },
        store: MongoStore.create({
            mongoUrl: dbUrl,
            touchAfter: 24 * 60 * 60,
            crypto: {
                secret: secret,
            },
        }),
    };

    app.engine('ejs', ejsMate);
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));
    app.use(session(sessionConfig));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
})();

// routes
app.use('/', mainRouter);

app.listen(port, (req, res) => {
    console.log('Server up');
});
