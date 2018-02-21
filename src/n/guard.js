module.exports = function(req, fn){
    let conn = require('./db/connect').conn;
    
    let clientIp = require('client-ip')(req);
    let sql = `select * from black where ip = '${clientIp}'`;

    conn.query(sql, function(err, result){
        if(!result.length){
            fn();
        }else if(result.length){

        }
    })
}