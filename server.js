var PORT = 3000;

var http = require('http');

var server = http.createServer(require('./src/n/db/serverConfig').config);

server.listen(PORT, function(){
	setTimeout(function() {
		// require('open')('http://'+ 'localhost:' + PORT);
	},1000);
});