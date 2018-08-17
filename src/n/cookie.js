module.exports = {
    setCookie: function(res, opts){
        let crypto = require('./crypto.js');
        let CONSTANT = require('./constant');

        let cookieName = opts.name;
        let cookieValue = '';
        if(opts.plainValue){
            cookieValue = opts.value;
        }else{
            cookieValue = crypto.aesEncrypt(opts.value, CONSTANT.sessionSecret);
        }

        let cookie;
        if(cookieValue){
            let tomorrow = new Date(Date.now()+60*60*24*1000).toUTCString();

            cookie = `${cookieName}=${cookieValue}; expires=${opts.expires || tomorrow}`;
            if(opts.HttpOnly)
                cookie += '; HttpOnly';
        }else{
            cookie = `${cookieName}=${cookieValue}; expires=${(new Date().toUTCString())}`;
        }
            
        res.setHeader('Set-Cookie', [
            cookie
        ]);
    },

    getCookie: function(req, key){
        var matchedCookieValue = '';

        req.headers.cookie.split(';').every(cookie => {
            cookie = cookie.split('=');
            let cookieName = cookie[0],
                cookieValue = cookie[1];

            if(cookieName.trim() == key){
                matchedCookieValue = cookieValue.trim()
                return false;
            }else{
                return true
            }
        });

        return matchedCookieValue
    },
}
