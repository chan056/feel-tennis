var PORT = 3000;

var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var formidable = require('formidable');

var mine = require('./mine').types;
var tools = require('./src/n/tool');

var server = http.createServer(function(request, response) {
	var pathname = url.parse(request.url).pathname;
	global.pathname = pathname;// 存储为全局对象

	if(pathname == '/'){
		pathname = '/page/index.html';
	}
	
	var ext = path.extname(pathname);
	ext = ext ? ext.slice(1) : 'unknown';
	var contentType = mine[ext];

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
		// todo 拦截无理请求
		let resolveApiPathModule = require('./src/n/db/resolveApiPath');
		resolveApiPathModule.resolveApiPath(pathname, response);
	}
});
server.listen(PORT);
console.log("Server runing at port: " + PORT + ".");