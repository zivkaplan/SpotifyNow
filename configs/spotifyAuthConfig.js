module.exports.spotifyAuthConfig = () => {
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
        'user-library-read',
        'user-modify-playback-state',
    ];

    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const redirectUri = `http://localhost:3000/now`;

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
};
