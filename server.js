var PORT = 3000;

var http = require('http');

global.rootDir = __dirname;

// require('sesh').magicSession();
// let session = require('sesh').session;

var server = http.createServer(function(req, res){
	// session(req, res, function(req, res){
		require('./src/n/db/serverConfig')(req, res);
	// })
});

server.listen(PORT, function(){
});
