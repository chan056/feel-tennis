var PORT = 3000;

var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var formidable = require('formidable');


var mime = require('./mime').types;
var tools = require('./src/n/tool');

var server = http.createServer(function(request, response) {
	// console.log(request.headers)
	let uo = url.parse(request.url, true);
	pathname = uo.pathname;

	if(pathname == '/'){
		pathname = '/page/index.html';
	}
	
	var ext = path.extname(pathname);
	ext = ext ? ext.slice(1) : 'unknown';
	var contentType = mime[ext];

	if(contentType){// 静态资源
		var realPath;
		realPath = path.join("src/static", pathname)

		fs.exists(realPath, function(exists) {
			if (!exists) {
				tools.response404(response);
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
		if(ext && ext != 'unknown')
			return tools.response404(response)
		// todo 拦截无理请求

		global.UO = uo;
		let resolveApiPathModule = require('./src/n/db/resolveApiPath');
		resolveApiPathModule.resolveApiPath(response, request);
	}
});

server.listen(PORT);
console.log("Server runing at port: " + PORT + ".");