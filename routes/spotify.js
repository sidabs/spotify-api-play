var express = require('express');
var router  = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
    res.send('Spotify! (' + process.env.SDTEST + ')');
});
/* Executes Authorization for Initial Setup */
router.get('/authorize', function(req, res) {
    //required imports
    var spotify         = require('../helpers/spotify');
    //Environment Variables Needed
    var clientId        = process.env.CLIENT_ID     || '';
    //Request Specific Variables
    var responseType    = 'code';
    var redirectUri     = spotify.config.auth.callbackUri;
    var scope           = spotify.config.auth.scope;
    var state           = 'profile/activity';
    //Spotify Request Variables
    var host            = spotify.config.auth.host;
    var path            ='/authorize/?client_id=' + encodeURIComponent(clientId)
                                                    + '&response_type=' + responseType 
                                                    + '&redirect_uri=' + encodeURIComponent(redirectUri)
                                                    + '&scope=' + encodeURIComponent(scope)
                                                    + '&state=' + state;
    var url             = 'https://' + host + path;
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
        var querystring     = require('querystring');
        var request         = require('../helpers/request');
        var spotify         = require('../helpers/spotify');
        //Environment Variables Needed
        var clientId        = process.env.CLIENT_ID     || '';
        var clientSecret    = process.env.CLIENT_SECRET || '';
        var redirectUri     = spotify.config.auth.callbackUri;
        //Spotify Request Variabels
        var host        = spotify.config.auth.host;
        var path        = '/api/token';
        var postData    = {
            'grant_type':       'authorization_code',
            'code':             code,
            'redirect_uri':     spotify.config.auth.callbackUri
        };
        //Request Specific Variables
        var postDataStr = querystring.stringify(postData);
        //http headers set (including Authorization key/value)
        var headers     = {
            "Content-Type":     "application/x-www-form-urlencoded",
            "Content-Length":   postDataStr.length,
            "Authorization":    "Basic " + new Buffer(clientId + ":" + clientSecret).toString('base64')      
        };
        //Execute Post to get tokens
        request.executePost(host, path, headers, postDataStr, function(responseStr) {
            console.log('RESPONSE: ', responseStr);
            res.send(responseStr);
        });
    }
});



module.exports = router;
