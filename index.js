var restify = require('restify');

// lib/formatters/json.js
var formatter = function formatJSON(req, res, body) {
    if (body instanceof Error) {
        // snoop for RestError or HttpError, but don't rely on
        // instanceof
        res.statusCode = body.statusCode || 500;

        if (body.body) {
            body = body.body;
        } else {
            body = {
                message: body.message
            };
        }
    } else if (Buffer.isBuffer(body)) {
        body = body.toString('base64');
    }

    var data = JSON.stringify(body);
    res.setHeader('Content-Length', Buffer.byteLength(data));

    return (data);
};

var server = restify.createServer({
    formatters: {
        'application/vnd.app.v1+json': formatter/*function(req, res, body) {
          console.log('custom formatter called')
          return JSON.stringify(body);
        }*/
    }
});

server.listen(3000, function () {
    console.log('%s listening at %s', server.name, server.url);
});

server.get('/', function (req, res, next) {
    res.send({foo: 'bar'})
});