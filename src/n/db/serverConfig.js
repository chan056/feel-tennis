module.exports.config = function(req, res) {
	
	// 检查用户知否在黑名单
	require('../guard')(req, res, function(){
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
		
		var ext = path.extname(pathname);
		ext = ext ? ext.slice(1) : '';

		if(ext){
			var contentType = mime[ext];
			contentType? disposeStaticResource(): tools.response404(res);
		}else{
			disposeApi();
		}

		function disposeStaticResource(){
			var realPath;
	
			realPath = path.join(global.rootDir, "src/static", pathname);
	
			fs.exists(realPath, function(exists) {
				if (!exists) {
					tools.response404(res);
				} else {
					fs.readFile(realPath, "binary", function(err, file) {
						if (err) {
							res.writeHead(500, {
								'Content-Type': 'text/plain'
							});
							res.end(err);
						} else {
							res.writeHead(200, {
								'Content-Type': contentType
							});
	
							// 所有的静态资源添加同域限制 todo
							if(ext == 'm3u8'){
								let referer = req.headers.referer;
	
								if(referer != constants.whiteList + '?' && referer != constants.whiteList){
									return res.end();
								}else{
									res.write(file, "binary");
									return res.end();
								}
							}
	
							res.write(file, "binary");
							res.end();
						}
					});
				}
			});
		}
	
		function disposeApi(){
			require('./usr')(req, function(){
				let resolveApiPathModule = require('./resolveApiPath');
				resolveApiPathModule.resolveApiPath(req, res);
			}, res);
		}
	});
}