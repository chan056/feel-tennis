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

		// 读取文件的过程 异步
		session.startSession(request, response, function(){
			global.UO = uo;
			let usrId = request.session.get('id');

			if(usrId){// 已经登陆的用户
				
				request.session.put('id', usrId);
				global.usr = {
					type: 1,
					usrId: usrId
				}

				console.log(global.usr);
			}else{//未登录的用户 设置cookie
				// const signature = '16charlongsecret';
				const nodeCookie = require('node-cookie');
				let crypto = require('../crypto.js');
				
				let getClientIp = require('./getClientIp.js').getClientIp;
				let ip = getClientIp(request);
                let ipEncrypted = crypto.aesEncrypt(ip, 'key');
				
				var tmpUsrInCookie = nodeCookie.get(request, 'tmpUsr');
				// console.log(ip);
				
				if(!tmpUsrInCookie){
					nodeCookie.create(response, 'tmpUsr', ipEncrypted);
					global.usr = {
						type: 2,
						ip: ip
					}
				}else{
					// console.log(crypto.aesDecrypt(tmpUsrInCookie, 'key'))
					let ipDecrepted = crypto.aesDecrypt(tmpUsrInCookie, 'key');

					if(ipDecrepted == ip){
						global.usr = {
							type: 2,
							ip: ipDecrepted
						}
					}else{
						res.end('');
					}
				}
			}
			
			let resolveApiPathModule = require('./resolveApiPath');
			resolveApiPathModule.resolveApiPath(response, request);
		})
	}
}