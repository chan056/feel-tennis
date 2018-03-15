var PORT = 3000;

var http = require('http');

global.rootDir = __dirname;

// require('sesh').magicSession();
// let session = require('sesh').session;

var serverConfig = require('./src/n/db/serverConfig');

var server = http.createServer(serverConfig);

server.listen(PORT, function(){
});
