var webRequest  = require('./request');

var spotify     = {
    config: {
        clientId:       process.env.CLIENT_ID       || '',
        clientSecret:   process.env.CLIENT_SECRET   || '',
        api:    {
            host:       'api.spotify.com',
            limit:      30
        },
        auth:   {
            host:       'accounts.spotify.com',
            scope:      'playlist-read-private playlist-modify-private user-read-private',
            cbUri:      'http://localhost:3000/spotify/callback'
        }
    },
    generateAuthorizeUri:   function() {
        //required imports
        var spotify         = require('../helpers/spotify');
        //Request Specific Variables
        var responseType    = 'code';
        var state           = 'profile/activity';
        //Spotify Request Variables
        var host            = spotify.config.auth.host;
        var path            ='/authorize/?client_id=' + encodeURIComponent(spotify.config.clientId)
                                                        + '&redirect_uri=' + encodeURIComponent(spotify.config.auth.cbUri)
                                                        + '&scope=' + encodeURIComponent(spotify.config.auth.scope)
                                                        + '&response_type=' + responseType 
                                                        + '&state=' + state;
        return 'https://' + host + path;
    },
    getApiTokens:           function(authorizationCode, callback) {
        //required imports
        var querystring     = require('querystring');
        var request         = require('../helpers/request');
        //Environment Variables Needed
        //Spotify Request Variabels
        var host        = spotify.config.auth.host;
        var path        = '/api/token';
        var postData    = {
            'grant_type':       'authorization_code',
            'code':             authorizationCode,
            'redirect_uri':     spotify.config.auth.cbUri
        };
        //Request Specific Variables
        var postDataStr = querystring.stringify(postData);
        //http headers set (including Authorization key/value)
        var headers     = {
            "Content-Type":     "application/x-www-form-urlencoded",
            "Content-Length":   postDataStr.length,
            "Authorization":    "Basic " + new Buffer(spotify.config.clientId + ":" + spotify.config.clientSecret).toString('base64')      
        };
        //Execute Post to get tokens
        request.executePost(host, path, headers, postDataStr, function(responseStr) {
            try {
                var responseJSON    = JSON.parse(responseStr);
                callback(responseJSON);
            } catch(err) {
                callback(err);
            }
        });
    }
};

module.exports  = spotify;