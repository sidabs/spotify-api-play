
var request = {
    executeGet:     function(host, path, headers, callback) {
        var https   = require('https');

        var options = {
            host:       host,
            path:       path,
            method:     'GET',
            headers:    headers
        };

        var request = https.request(options, function(response) {
            var str = '';
            response.on('data', function (chunk) {
                str += chunk;
            });
            response.on('end', function () {
                callback(str);
            });
        });
        request.end();
    },
    executePost:    function(host, path, headers, postDataStr, callback) {
        var https   = require('https');

        var options = {
            host:       host,
            path:       path,
            method:     'POST',
            headers:    headers
        };

        var request = https.request(options, function(response) {
            var str = '';
            response.on('data', function (chunk) {
                str += chunk;
            });
            response.on('end', function () {
                callback(str);
            });
        });
        request.write(postDataStr);
        request.end();
    }
};



module.exports = request;