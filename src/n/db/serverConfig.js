module.exports = function(req, res) {
	// 检查用户IP是否在黑名单（IP会经常变换、跟踪IP没有意义）
	// require('../ip_guard')(req, res, function(){
	const url = require('url');
	const fs = require('fs');
	const path = require('path');
	const mime = require('./mime').types;
	const tools = require('../tools');
	const constants = require('../constant');

	let urlObj = url.parse(req.url, true);
	let pathname = urlObj.pathname;

	let contentType = '';
	let absPath = '';

	let isBot = tools.botCheck(req.headers['user-agent']);

	if(!isBot && pathname == '/'){
		pathname = constants.indexPath;
	}

	let ext = path.extname(pathname);
	ext = ext ? ext.slice(1) : '';

	if(ext){
		if(ext == 'ssr'){
			// 解析路径 获取参数
			// 匹配路径 找到对应模板
			// 传入参数 查询数据 渲染模板
			checkReferer(function(){
				require('./resolve_path_ssr').resolvePathSSR(req, res);
			})
		}else{
			disposeStaticResource();
		}
	}else{
		if(pathname.match(/\/api\//)){
			disposeApi();
		}else{
			if(isBot){
				feedBot();
			}else{// /sports 直接访问 返回首页
				absPath = path.join(global.staticRoot, constants.indexPath);
				ext = 'html';
				contentType = mime[ext];
				return serveStatic();
			}
		}
	}

	function disposeStaticResource(){
		absPath = path.join(global.staticRoot, pathname);

		contentType = mime[ext];
		if(!contentType){
			tools.response404(res);
		}

		fs.exists(absPath, function(exists) {
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

	function checkReferer(fn){
		// 域名限制
		if(
			ext == 'm3u8' || ext == 'mp4' || ext == 'ts'
			|| ext == 'vtt' || ext == 'srt' || ext == 'ssr'
		){
			let referer = req.headers.referer || '';
			if(!referer)
				return res.end();

			const { URL } = require('url');
			const myURL = new URL(referer);
			refererHost = myURL.hostname;

			if(constants.whiteList.indexOf(refererHost) == -1){
				return res.end();
			}else{
				fn && fn()
			}
		}else{
			fn && fn();
		}
	}

	function serveStatic(){
		checkReferer(function(){
			// gzip压缩
			const zlib = require('zlib');
			let readStream = fs.createReadStream(absPath);
			let acceptEncoding = req.headers['accept-encoding'];
			if (acceptEncoding && acceptEncoding.indexOf('gzip') != -1) {
				var gzipStream = zlib.createGzip();

				res.setHeader("Content-Encoding", "gzip");
				
				readStream.pipe(gzipStream).pipe(res);

			} else {
				readStream.pipe(res);
			}

			let responseHeader = {
				'Content-Type': contentType,
			};

			// 'Cache-Control': 'max-age=3600'
			// console.log(urlObj);

			res.writeHead(200, responseHeader);
		})
	}

	// 如果发现是 robot 返回对应页面
	function feedBot(){

		ext = 'html';
		contentType = mime[ext];

		let conn = require('./connect.js');
		let sql  = `select file_path from spider_food where path='${pathname}'`;

		conn.query(sql, function (err, result, fields) {
			if (err) return console.log(err);

			if(result[0]){
				let filePath = result[0]['file_path'];
				if(fs.existsSync(filePath)){
					absPath = filePath;
					return serveStatic();
				}
			}

			return tools.response404(res);
		});

	}
}