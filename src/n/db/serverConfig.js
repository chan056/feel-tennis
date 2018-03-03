module.exports.config = function(req, res) {
	// 检查用户知否在黑名单
	require('../guard')(req, function(){
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
	
							if(ext == 'm3u8'){
								let referer = req.headers.referer;
	
								if(referer != constants.whiteList + '?' && referer != constants.whiteList){
									return res.end();
								}else{
									// let conn = require('./connect').conn;
									// conn.query('select * f')
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
			let session = require('../session.js').newSession();
	
			// 读取文件的过程 异步
			session.startSession(req, res, function(){
				let usr = req.session.get('usr');
	
				if(usr){// 已经登陆的用户
					// 延长session时间
					// req.session.regenerate();
					// req.session.put('usr', usr);
	
					usr = JSON.parse(usr);
					global.usrInfo = {
						type: 1,
						usrId: usr.id,
						isAdmin: usr.isAdmin
					}
				}else{//未登录的用户 设置cookie
					const nodeCookie = require('node-cookie');
					let crypto = require('../crypto.js');
					
					let clientIp = require('client-ip');
					let ip = clientIp(req);
					
					var tmpUsrInCookie = nodeCookie.get(req, 'tmpUsr');
					
					if(!tmpUsrInCookie){
						let ipEncrypted = crypto.aesEncrypt(ip, constants.aesKey);
						nodeCookie.create(res, 'tmpUsr', ipEncrypted);
	
						global.usrInfo = {
							type: 2,
							ip: ip
						}
					}else{
						let ipDecrepted = crypto.aesDecrypt(tmpUsrInCookie, constants.aesKey);
	
						// ip相当于用户名 存储在浏览器的IP相当于密码
						if(ipDecrepted == ip){
							global.usrInfo = {
								type: 2,
								ip: ipDecrepted
							}
						}else{
							res.end('user type error ！');
						}
					}
				}
				
				let resolveApiPathModule = require('./resolveApiPath');
				resolveApiPathModule.resolveApiPath(res, req);
			});
		}
	});
}