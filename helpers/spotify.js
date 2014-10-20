var webRequest  = require('./request');

var spotify     = {
    config: {
        api:    {
            host:           'api.spotify.com',
            limit:          30
        },
        auth:   {
            host:           'accounts.spotify.com',
            callbackUri:    'http://localhost:3000/spotify/callback',
            scope:          'playlist-read-private playlist-modify-private user-read-private'
        }
    }
};

module.exports  = spotify;