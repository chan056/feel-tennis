var PORT = 3000;

var http = require('http');

global.rootDir = __dirname;

// require('sesh').magicSession();

var server = http.createServer(require('./src/n/db/serverConfig').config);

server.listen(PORT, function(){
});
