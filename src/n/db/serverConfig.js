module.exports = function(req, res) {
	
	// 检查用户IP是否在黑名单
	require('../ip_guard')(req, res, function(){
		const url = require('url');
		const fs = require('fs');
		const path = require('path');
		const mime = require('./mime').types;
		const tools = require('../tools');
		const constants = require('../constant');

		let urlObj = url.parse(req.url, true);
		let pathname = urlObj.pathname;

		if(pathname == '/'){
			pathname = '/page/index.html';
		}

		var realPath = path.join(global.staticRoot, pathname);
		
		var ext = path.extname(pathname);
		ext = ext ? ext.slice(1) : '';

		if(ext){
			var contentType = mime[ext];
			contentType? disposeStaticResource(): tools.response404(res);
		}else{
			disposeApi();
		}

		function disposeStaticResource(){
	
			fs.exists(realPath, function(exists) {
				if (!exists) {
					tools.response404(res);
				} else {
					serveStatic();
				}
			});
		}
	
		function disposeApi(){
			require('./usr')(req, function(){
				let resolveApiPathModule = require('./resolveApiPath');
				resolveApiPathModule.resolveApiPath(req, res);
			}, res);
		}

		function serveStatic(){
			/* fs.readFile(realPath, "binary", function(err, file) {
				if (err) {
					res.writeHead(500, {
						'Content-Type': 'text/plain'
					});
					console.log(err);
					res.end();
				} else {
					res.writeHead(200, {
						'Content-Type': contentType,
						'Cache-Control': 'max-age=3600'
					});
			
					// 所有的静态资源添加同域限制 todo
					if(ext == 'm3u8'){
						let referer = req.headers.referer;
						referer = path.basename(referer);
			
						if(constants.whiteList.indexOf(referer) == -1){
							return res.end();
						}
					}
			
					res.write(file, "binary");
					res.end();
				}
			}); */

			var zlib = require('zlib');
			var file = fs.createReadStream(realPath);
			var acceptEncoding = req.headers['accept-encoding'];
			if (acceptEncoding && acceptEncoding.indexOf('gzip') != -1) {
				var gzipStream = zlib.createGzip();

				res.setHeader("Content-Encoding", "gzip");
				
				file.pipe(gzipStream).pipe(res);

			} else {
				file.pipe(res);
			}

			res.writeHead(200, {
				'Content-Type': contentType,
				// 'Cache-Control': 'max-age=3600'
			});

			res.pipe(file);
		}
	});
}