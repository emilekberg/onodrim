const connect = require('connect');
const serveStatic = require('serve-static');
const open = require('open');

const settings = {
    root: __dirname,
    port: 9000,
    openBrowser: true,
    serveStatic: {
        'index': [
            'index.html', 
            'index.htm'
        ]
    }
}
connect().use(serveStatic(settings.root)).listen(settings.port, function(){
    console.log('Server running on ' + settings.port + '...');
    if(settings.openBrowser) {
        open('http:/localhost:' + settings.port + '');
    }
});