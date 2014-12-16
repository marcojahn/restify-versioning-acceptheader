var restify = require('restify');
var xml = require('xml');

var formatter = function formatXML(req, res, body) {
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

    var data = xml(body);
    res.setHeader('Content-Length', Buffer.byteLength(data));

    return (data);
};

var server = restify.createServer({
    formatters: {
        'application/xml': formatter
    }
});

server.listen(3000, function () {
    console.log('%s listening at %s', server.name, server.url);
});

server.get({path: '/', version: '1.0.0'}, function (req, res, next) {
    res.send({foo: 'bar v1'});
});

server.get({path: '/', version: '2.0.0'}, function (req, res, next) {
    res.send({foo: 'bar v2'});
});