/*const connect = require('connect');
const serveStatic = require('serve-static');
const open = require('open');
const path = require('path');
const settings = {
    root: path.resolve('../' + __dirname),
    port: 9000,
    openBrowser: false,
    serveStatic: {
        'index': [
            'index.html'
        ]
    }
}
connect()
    .use(serveStatic(settings.root, settings.serveStatic))
    .listen(settings.port, function(){
        console.log('Server running on ' + settings.port + '...');
});*/

var http = require('http');

var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');

var serve = serveStatic("../");

var server = http.createServer(function(req, res) {
  var done = finalhandler(req, res);
  serve(req, res, done);
});

server.listen(8000);