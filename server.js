var PORT = 3000;

var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var mine = require('./mine').types;
var formidable = require('formidable');

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

			'/albums': function(){
				r.operate('queryAlbumList', paramsMathed, response);
			},

			'/sports/:sport_id/albums': function(){
				r.operate('queryAlbumList', paramsMathed, response);
			},
			
			'/albums/:album_id/videos': function(){
				r.operate('queryAlbum', paramsMathed, response);
			},
			
			'/videos/:album_id': function(){
				r.operate('queryVideo', paramsMathed, response);
			},

			'/upload/:type': function(){
				// create an incoming form object
				var form = new formidable.IncomingForm();
				
				// specify that we want to allow the user to upload multiple files in a single request
				form.multiples = true;
			
				// store all uploads in the /uploads directory
				form.uploadDir = path.join(__dirname, '/uploads');
			
				// every time a file has been uploaded successfully,
				// rename it to it's orignal name
				form.on('file', function(field, file) {
					fs.rename(file.path, path.join(form.uploadDir, file.name));
				});
			
				// log any errors that occur
				form.on('error', function(err) {
					console.log('An error has occured: \n' + err);
				});
			
				// once all the files have been uploaded, send a response to the client
				form.on('end', function() {
					response.end('upload success');
				});
			
				// parse the incoming request containing the form data
				form.parse(request);
			}
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