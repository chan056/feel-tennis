module.exports.config = function(req, res) {
	const url = require('url');
    const fs = require('fs');
    const path = require('path');
    const mime = require('./mime').types;
    const tools = require('../tool');
	const uo = url.parse(req.url, true);
	const tumour = require('../tumour');

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
							if(referer != 'http://localhost:3000/?' && referer != 'http://localhost:3000/'){
								return res.end();
							}
						}

						// 拼接admin部分
						// if(uo.pathname.match(/tube\.js$/)){
						// 	tumour.joinIndexJS(req, res);
						// }

						res.write(file, "binary");
						res.end();
					}
				});
			}
		});
	}else{// API
		if(ext && ext != 'unknown')
			return tools.response404(res)
		// todo 拦截无理请求

		let NodeSession = require('node-session');
    	let session = new NodeSession({secret: 'Q3UBzdH9GEfiRCTKbi5MTPyChpzXLsTD'});

		// 读取文件的过程 异步
		session.startSession(req, res, function(){
			global.UO = uo;
			let usr = req.session.get('usr');
			
			if(usr){// 已经登陆的用户
				// usr = JSON.parse(usr);
				console.log(usr)
				// 延长session时间
				req.session.put('usr', usr);
				global.usrInfo = {
					type: 1,
					usr: usr
				}
			}else{//未登录的用户 设置cookie
				// const signature = '16charlongsecret';
				const nodeCookie = require('node-cookie');
				let crypto = require('../crypto.js');
				
				let getClientIp = require('./getClientIp.js').getClientIp;
				let ip = getClientIp(req);
                let ipEncrypted = crypto.aesEncrypt(ip, 'key');
				
				var tmpUsrInCookie = nodeCookie.get(req, 'tmpUsr');
				// console.log(ip);
				
				if(!tmpUsrInCookie){
					nodeCookie.create(res, 'tmpUsr', ipEncrypted);
					global.usrInfo = {
						type: 2,
						ip: ip
					}
				}else{
					// console.log(crypto.aesDecrypt(tmpUsrInCookie, 'key'))
					let ipDecrepted = crypto.aesDecrypt(tmpUsrInCookie, 'key');

					if(ipDecrepted == ip){
						global.usrInfo = {
							type: 2,
							ip: ipDecrepted
						}
					}else{
						res.end('');
					}
				}
			}
			
			let resolveApiPathModule = require('./resolveApiPath');
			resolveApiPathModule.resolveApiPath(res, req);
		})
	}
}