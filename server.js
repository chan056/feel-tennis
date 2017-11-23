var PORT = 3000;

var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var mine = require('./mine').types;

var server = http.createServer(function(request, response) {
	var pathname = url.parse(request.url).pathname;
	// return response.end(pathname)

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
		var r =  require('./src/n/db/operate');
		var pathToRegexp = require('path-to-regexp');
		var paramsMathed = {};

		var routerConfig = {
			'/sports': function(){
				r.operate('querySports', paramsMathed, response);
			},

			'/sports/:sport_id/albums': function(){
				r.operate('queryAlbumList', paramsMathed, response);
			},
			
			'/albums/:album_id/videos': function(){
				r.operate('queryAlbum', paramsMathed, response);
			},
			
			'/videos/:album_video_id': function(){
				r.operate('queryVideo', paramsMathed, response);
			},
		}

		// 从路径中抽取参数
		var pathMatch;
		var fnMatched;
		var keys;

		for(var k in routerConfig){
			var f = routerConfig[k];
			keys = [];
			var pathReg = pathToRegexp(k, keys);

			pathMatch = pathReg.exec(pathname);
			if(pathMatch){
				fnMatched = f;
				
				break;
			}
		}

		if(pathMatch){
			for(let i=0, l=keys.length; i < l; i++){
				let key = keys[i];
				let keyName = key.name;
				paramsMathed[keyName] = pathMatch[i + 1]
			}
		}
		// ====
		
		if(fnMatched){
			fnMatched();
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