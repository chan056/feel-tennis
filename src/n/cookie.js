module.exports = {
    setCookie: function(res, opts){
        let crypto = require('./crypto.js');
        let CONSTANT = require('./constant');

        let cookieName = opts.name;
        let cookieValue = crypto.aesEncrypt(opts.value, CONSTANT.sessionSecret);
        let tomorrow = new Date(new Date().getTime()+60*60*24*1000).toUTCString();

        let cookie = `${cookieName}=${cookieValue}; expires=${opts.expires || tomorrow}`;
        if(opts.HttpOnly)
            cookie += '; HttpOnly';
            
        res.setHeader('Set-Cookie', [
            cookie
        ]);
    }
}