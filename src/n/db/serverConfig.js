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
			if(/* ext != 'ts' */1){
				fs.readFile(realPath, "binary", function(err, file) {
					if (err) {
						res.writeHead(500, {
							'Content-Type': 'text/plain'
						});
						res.end(err);
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
							}/* else{
								res.write(file, "binary");
								return res.end();
							} */
						}
				
						res.write(file, "binary");
						res.end();
					}
				});
			}else{
				var file = {
					path: realPath,
					name: path.basename(realPath),
					size: (fs.statSync(realPath)).size
				};
	
				fs.open(file.path, 'r', function (err, fd) {
					res.writeHead(200, {
			
						'Content-Type': contentType,
			
						'Content-Length': file.size,
			
						// 'Content-Disposition': "attachment;filename=" + file.name
			
					});
			
					var buff = new Buffer(4096);// 每一小块 4K
					var position = 0;
			
					var id = setInterval(function () {
			
						var quota = 300000; //Byte par seconde
			
						req.on('close', function () {
			
							res.end();

							clearInterval(id);
			
							fs.close(fd);
			
							quota = 0;
			
						});
			
						while (quota > 0) {
							var bytesRead = fs.readSync(fd, buff, 0, buff.length, position);
							res.write(buff);
			
							position += bytesRead;
			
							quota -= bytesRead;
			
							if (bytesRead < buff.length) {
			
								clearInterval(id);

								res.end();
			
								fs.close(fd);
			
								break;
			
							}
			
						}
			
					}, 1000);
				});
			}
		}


	});
}