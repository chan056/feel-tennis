var PORT = 80;

var argv = process.argv;
if(argv[0] == '/usr/local/bin/node'){
    PORT = 3000;
}

var http = require('http');

global.staticRoot = __dirname + '/src/static';

// require('sesh').magicSession();
// let session = require('sesh').session;

var serverConfig = require('./src/n/db/serverConfig');

var server = http.createServer(serverConfig);

server.listen(PORT, function(){
    console.log('listen on ' + PORT)
});
