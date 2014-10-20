var express = require('express');
var router  = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
    res.send('Spotify! (' + process.env.SDTEST + ')');
});
/* Executes Authorization for Initial Setup */
router.get('/authorize', function(req, res) {
    //required imports
    var spotify = require('../helpers/spotify');
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
        //required imports
        var spotify         = require('../helpers/spotify');
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



module.exports = router;
