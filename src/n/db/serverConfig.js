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
			
			if(pathname.match(/\/api\//)){
				disposeApi();
			}else{
				// 如果发现是 robot
				// 返回对应html
				var userAgent = req.headers['user-agent'];
				var isBot = tools.botCheck(userAgent);

				if(isBot){
					var contentType = 'text/html';
					ext = 'html';
					// 查询
					let conn = require('./connect.js').conn;
					pathname = tools.transformPath(pathname);
					let sql  = `select file_path from spider_food where path=${pathname}`;

					conn.query(sql, function (err, result, fields) {
						if (err) return console.log(err);
			
						let filePath = result[0]['file_path'];
						realPath = filePath;
						return serveStatic();
					});
				}else{
					tools.response404(res);
				}
			}
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
				require('./resolveApiPath').resolveApiPath(req, res);
			}, res);
		}

		function serveStatic(){
			
			// 域名限制
			if(ext == 'm3u8' || ext == 'mp4'){
				let referer = req.headers.referer || '';
				if(!referer)
					return res.end();

				const { URL } = require('url');
				const myURL = new URL(referer);
				refererHost = myURL.hostname;
	
				if(constants.whiteList.indexOf(refererHost) == -1){
					return res.end();
				}
			}

			// gzip压缩
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