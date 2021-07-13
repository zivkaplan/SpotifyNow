module.exports.localStorageSpotify = {
    getAccessToken: function () {
        var expires = 0 + localStorage.getItem('pa_expires', '0');
        if (new Date().getTime() > expires) {
            return '';
        }
        var token = localStorage.getItem('pa_token', '');
        return token;
    },
    setAccessToken: function (token, expires_in) {
        localStorage.setItem('pa_token', token);
        localStorage.setItem('pa_expires', new Date().getTime() + expires_in);
    },
    getUsername: function () {
        var username = localStorage.getItem('pa_username', '');
        return username;
    },
    setUsername: function (username) {
        localStorage.setItem('pa_username', username);
    },
};
