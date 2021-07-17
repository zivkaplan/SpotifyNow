if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const mongoose = require('mongoose');
const User = require('../models/user');

mongoose.connect(
    process.env.DB_URL || 'mongodb://localhost:27017/spotify-now',
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    }
);

const db = mongoose.connection;
db.on('error', console.error.bind(console.error, 'conection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const dropDB = async () => {
    await User.deleteMany({});
    console.log('Databse dropped');
};

dropDB();
