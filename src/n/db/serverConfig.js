module.exports.config = function(request, response) {
	var url = require('url');
    var fs = require('fs');
    var path = require('path');
    var mime = require('./mime').types;

    var NodeSession = require('node-session');
    let session = new NodeSession({secret: 'Q3UBzdH9GEfiRCTKbi5MTPyChpzXLsTD'});

    var tools = require('../tool');
	
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

						if(ext == 'm3u8'){
							let referer = request.headers.referer;
							if(referer != 'http://localhost:3000/?'){
								return response.end();
							}
						}
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

		session.startSession(request, response, function(){
			// if (request.session.has('name')){
                let storedName = request.session.get('name')
				storedName && console.log(storedName);
			// }

			let resolveApiPathModule = require('./resolveApiPath');
			resolveApiPathModule.resolveApiPath(response, request);
		})
	}
}