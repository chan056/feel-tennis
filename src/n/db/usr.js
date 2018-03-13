module.exports = function(req, fn, res){
    let session = require('../session').newSession();
    let constants = require('../constant');
    let usrInfo = {};
	
    // 读取文件的过程 异步
    session.startSession(req, res, function(){
        let usr = req.session.get('usr');// 一定几率获取不成功
        // let usr = req.session.data.user;

        if(usr){// 已经登陆的用户
            // usr = JSON.parse(usr);
            usrInfo = {
                type: 1,
                usrId: usr.id,
                isAdmin: usr.isAdmin
            }
        }else{//未登录的用户 设置cookie
            const nodeCookie = require('node-cookie');
            let crypto = require('../crypto.js');
            
            let ip = require('client-ip')(req);
            if(ip == '::1'){
                ip = '::ffff:127.0.0.1';
            }
            
            var tmpUsrInCookie = nodeCookie.get(req, 'tmpUsr');
            
            if(res){
                let ipEncrypted = crypto.aesEncrypt(ip, constants.aesKey);
                nodeCookie.create(res, 'tmpUsr', ipEncrypted);
            }

            usrInfo = {
                type: 2,
                ip: ip
            }
        }

        req.usrInfo = usrInfo;

        fn && fn();
    });
};