//import required libraries
var express = require('express');
var router  = express.Router();

//import spotify helper
var spotify = require('../helpers/spotify');

//setup before filters
var beforeFilter    = function(req, res, next) {
    console.log('>> this is executing before the route: %s', req.url);

    var now = new Date();
    if(now.getTime() > spotify.config.user.expires) {
        console.log('Access Token is expired!');
        spotify.refreshApiTokens(function(responseJSON) {
            if(responseJSON instanceof Error) {
                next(new Error('Error Refreshing Access Token'));
            } else {
                console.log('Access Token Refreshed!');
                next();
            }
        });
    } else {
        console.log('Access Token is still good!');
        next();
    }
};

//root spotify route
router.get('/', beforeFilter, function(req, res) {
    res.send('Spotify!');
});
// executes authorization for initial setup
router.get('/authorize', beforeFilter, function(req, res) {
    //generate authorization url
    var url     = spotify.generateAuthorizeUri();
    //Redirect for authorization
    res.redirect(url);
});
// callback end point for spotify authorization
router.get('/callback', beforeFilter, function(req, res) {
    //get query string parameters needed
    var error       = req.param('error');
    var code        = req.param('code');
    var state       = req.param('state');
    //check for error
    if(error) {
        res.send('ERROR: ' + error);
    } else {
        spotify.getApiTokens(code, function(result) {
            if(result instanceof Error) {
                //currently only occuring if parsing error with response string to json
                res.json({
                    error:  'response parsing error'
                });
            } else {
                //currently errors returned are json object (error and error_description)
                //so no special handling needed at the moment
                res.json(result);
            }
        });
    }
});

// get and display the current access and refresh tokens
router.get('/accesstoken', beforeFilter, function(req, res) {
    res.json({
        accessToken:    spotify.config.user.accessToken,
        refreshToken:   spotify.config.user.refreshToken,
        user:           spotify.config.user
    });
});

// get all the current playlists for the user (userId set as environment variable at runtime)
router.get('/playlists', beforeFilter, function(req, res) {
    spotify.getAllPlaylists(spotify.config.user.id, function(result) {
        res.json(result);
    });
});

// get a specific playlist (userId and playlistId set as environment variables at runtime)
router.get('/playlist', beforeFilter, function(req, res) {
    console.log('weeeee');
    spotify.getPlaylist(spotify.config.user.id, spotify.config.playlist.id, function(result) {
        res.json(result);
    });
});

module.exports = router;
