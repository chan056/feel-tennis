module.exports = function(req, res, fn){
    let conn = require('./db/connect').conn;
    
    let clientIp = require('client-ip')(req);
    if(clientIp == '::1'){
        clientIp = '::ffff:127.0.0.1';
    }
    let sql = `select * from black where ip = '${clientIp}'`;

    conn.query(sql, function(err, result){
        if(result && result.length){
            let cookies = require('cookie').parse(req.headers.cookie || '');
            if(cookies.bear){
                res.end();
                return console.log(`${clientIp}在黑名单`);
            }
        }

        fn && fn();
    });
}