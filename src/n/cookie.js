module.exports = {
    setCookie: function(res, opts){
        // console.log('setCookie', opts.value, opts.plainValue)
        let crypto = require('./crypto.js');
        let CONSTANT = require('./constant');

        let cookieName = opts.name;
        let cookieValue = '';
        if(opts.plainValue){
            cookieValue = opts.value;
        }else{
            cookieValue = crypto.aesEncrypt(opts.value, CONSTANT.sessionSecret);
        }
        let tomorrow = new Date(Date.now()+60*60*24*1000).toUTCString();

        let cookie = `${cookieName}=${cookieValue}; expires=${opts.expires || tomorrow}`;
        if(opts.HttpOnly)
            cookie += '; HttpOnly';
            
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
    }
}
