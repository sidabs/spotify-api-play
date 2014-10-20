var express = require('express');
var router  = express.Router();

var spotify = require('../helpers/spotify');

/* GET users listing. */
router.get('/', function(req, res) {
    res.send('Spotify! (' + process.env.SDTEST + ')');
});
/* Executes Authorization for Initial Setup */
router.get('/authorize', function(req, res) {
    //generate authorization url
    var url     = spotify.generateAuthorizeUri();
    //Redirect for authorization
    res.redirect(url);
});
/* Callback end point for Spotify Authorization */
router.get('/callback', function(req, res) {
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

router.get('/accesstoken', function(req, res) {
    res.json({
        accessToken:    spotify.config.user.accessToken,
        refreshToken:   spotify.config.user.refreshToken
    });
});

router.get('/playlists', function(req, res) {
    spotify.getAllPlaylists(spotify.config.user.id, function(result) {
        res.json(result);
    });
});

router.get('/playlist', function(req, res) {
    spotify.getPlaylist(spotify.config.user.id, spotify.config.playlist.id, function(result) {
        res.json(result);
    });
});



module.exports = router;
