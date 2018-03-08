module.exports = function(req, fn, res){
    let session = require('../session').newSession();
    let constants = require('../constant');
    let usrInfo;
	
    // 读取文件的过程 异步
    session.startSession(req, res, function(){
        let usr = req.session.get('usr');
        
        if(usr){// 已经登陆的用户
            // 延长session时间
            // req.session.regenerate();
            // req.session.put('usr', usr);

            usr = JSON.parse(usr);
            usrInfo = {
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
                if(res){
                    let ipEncrypted = crypto.aesEncrypt(ip, constants.aesKey);
                    nodeCookie.create(res, 'tmpUsr', ipEncrypted);
                }

                usrInfo = {
                    type: 2,
                    ip: ip
                }
            }else{
                let ipDecrepted = crypto.aesDecrypt(tmpUsrInCookie, constants.aesKey);

                // ip相当于用户名 存储在浏览器的IP相当于密码
                if(ipDecrepted == ip){
                    usrInfo = {
                        type: 2,
                        ip: ipDecrepted
                    }
                }else{
                    usrInfo = {};
                    console.log('user type error ！');
                }
            }
        }

        req.usrInfo = usrInfo;

        fn && fn(usrInfo);
    });
};