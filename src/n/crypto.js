module.exports = {
    md5: function(s){
        const crypto = require('crypto');
        const hash = crypto.createHash('md5');

        // 可任意多次调用update():
        hash.update(s);
        console.log(hash.digest('hex'));
    },

    aesEncrypt: function (data, key) {
        const crypto = require('crypto');
        const cipher = crypto.createCipher('aes192', key);
        var crypted = cipher.update(data, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    },

    aesDecrypt:function (encrypted, key) {
        const crypto = require('crypto');
        const decipher = crypto.createDecipher('aes192', key);
        var decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}