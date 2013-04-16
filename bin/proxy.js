var http = require('http');
var send = require('send');
var url = require('url');
var path = require('path');

http.createServer(function(request, response) {
    if (!request.url.match('^/api'))
    {
        send(request,  url.parse(request.url).pathname)
            .root(path.resolve(__dirname, '../'))
            .on('error', function(err){
                console.log(err);
                response.statusCode = err.status || 500;
                response.end();
            })
            .pipe(response);
        return;
    }

    var proxy_request = http.request({
        host: '127.0.0.1',
        port: 8000,
        method: request.method,
        path: request.url,
        headers: request.headers
    });

    proxy_request.addListener('response', function (proxy_response) {
        proxy_response.addListener('data', function(chunk) {
            response.write(chunk, 'binary');
        });
        proxy_response.addListener('end', function() {
            response.end();
        });
        response.writeHead(proxy_response.statusCode, proxy_response.headers);
    });
    request.addListener('data', function(chunk) {
        proxy_request.write(chunk, 'binary');
    });
    request.addListener('end', function() {
        proxy_request.end();
    });
}).listen(9000);