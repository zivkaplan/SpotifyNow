const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    spotify_id: { type: String, required: true, unique: true },
    image_url: { type: String },
    sessionKey: { type: String },
    token: {
        access_token: {
            type: String,
            required: true,
            unique: true,
        },
        token_type: {
            type: String,
            required: true,
        },
        expires_in: {
            type: Number,
            required: true,
        },
        refresh_token: {
            type: String,
            required: true,
            unique: true,
        },
        scope: {
            type: String,
            required: true,
        },
    },
});

module.exports = mongoose.model('User', userSchema);
