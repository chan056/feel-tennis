module.exports = function(req, fn, res){
    var NodeSession = require('node-session');
    var sessionInstance = new NodeSession({secret: 'Q3UBzdH9GEfiRCTKbi5MTPyChpzXLsTD', lifetime: 1 * 60 * 60 * 1000});
    let constants = require('../constant');
    let usrInfo = {};
    
    // 如果没有cookie teube， starSession 多次 会新建多个session文件？ ！！
    sessionInstance.startSession(req, res, function(){
        let usr = req.session.get('usr');// 一定几率获取不成功

        if(usr){
            // usr = JSON.parse(usr);
            usrInfo = {
                type: 1,
                usrId: usr.id,
                isAdmin: usr.isAdmin
            }
        }else{
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