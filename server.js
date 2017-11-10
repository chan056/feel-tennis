var PORT = 3000;

var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var mine = require('./mine').types;

var server = http.createServer(function(request, response) {
	var pathname = url.parse(request.url).pathname;
	// return response.end(pathname)
	
	var ext = path.extname(pathname);
	ext = ext ? ext.slice(1) : 'unknown';
	var contentType = mine[ext];

	if(contentType){// 静态资源
		var realPath;
		realPath = path.join("src/static", pathname)

		fs.exists(realPath, function(exists) {
			if (!exists) {
				response404();
			} else {
				fs.readFile(realPath, "binary", function(err, file) {
					if (err) {
						response.writeHead(500, {
							'Content-Type': 'text/plain'
						});
						response.end(err);
					} else {
						response.writeHead(200, {
							'Content-Type': contentType
						});
						response.write(file, "binary");
						response.end();
					}
				});
			}
		});
	}else{// API
		var router = {
			'/albums': function(){
				var r =  require('./src/n/db/queryAlbum');
				r.queryAlbum(response);
			},
		}
		// return console.log(pathname);
		var action = router[pathname];

		if(action){
			action()
		}else{
			response404();
		}
	}

	function response404(){
		response.writeHead(404, {
			'Content-Type': 'text/plain'
		});

		response.write("This request URL " + pathname + " was not found on this server.");
		response.end();
	}
});
server.listen(PORT);
console.log("Server runing at port: " + PORT + ".");