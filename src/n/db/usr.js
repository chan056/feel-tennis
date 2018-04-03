module.exports = function(req, fn, res){
    let constants = require('../constant');
    let usrInfo = {};

    let cookies = require('cookie').parse(req.headers.cookie || '');
    let sid;

    if(cookies.sid){
        let crypto = require('../crypto.js');
        sid = crypto.aesDecrypt(cookies.sid, constants.sessionSecret);
    }
    
    if(sid){
        let usr = JSON.parse(sid);
        usrInfo = {
            type: 1,
            usrId: usr.id,
            isAdmin: usr.isAdmin,
            isActive: usr.isActive
        }
    }else{
        let crypto = require('../crypto.js');
        
        let ip = require('client-ip')(req);
        if(ip == '::1'){
            ip = '::ffff:127.0.0.1';
        }

        usrInfo = {
            type: 2,
            ip: ip
        }

        if(res && req.url=="/tube"){
            let ipEncrypted = crypto.aesEncrypt(ip, constants.aesKey);
            res.setHeader('Set-Cookie', [`tmpUsr=${ipEncrypted}`]); 
        }
    }

    req.usrInfo = usrInfo;

    fn && fn();
};