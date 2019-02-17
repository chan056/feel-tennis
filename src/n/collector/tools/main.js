const http = require('http');
const path = require('path');
const fs = require('fs');
const conn = require('../../db/connect');

module.exports = {
    writeFile: function (cache, targetFile){
        fs.writeFile(targetFile, cache, function(err) {
            if (err) {
                return console.error(err);
            }
        });
    },

    fetchHTML: function (url, cacheFilePath, fn){
        let t = this;
        if(!fs.existsSync(cacheFilePath)){
            console.log(`requesting`)
            http.get(url, function(res) {
                let html = '';
                res.on('data', function(data) {
                    html += data;
                }).on('end', function() {
                    t.writeFile(html, cacheFilePath);
                    fn && fn(html)
                });
            }).on('error', function() {
                console.log('获取数据出错！');
            });
        }else{
            fs.readFile(cacheFilePath, (err, data)=>{
                if(err){
                    return console.log(err);
                }
    
                fn && fn(data.toString())
            })
        }
    },

    // June 03, 1986 => 
    formatBirthdate: function (birthdate){
        return birthdate.replace(/\w+/, function(month){
            let index = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Autum', 'September', 'October', 'Novenmber', 'December'].indexOf(month) + 1;;
            return index > 9? index: ('0' + index)
        })
    },
    
    // <<< SQL
    truncate: function (tableName){
        const sql = `truncate table ${tableName}`;
        this.runSql(sql);
    },
    
    runSql: function (sql, fn){
        return conn.query(sql, function(err, result, fields){
            if(err)
                console.error(err.sqlMessage);
            
            fn && fn()
        });
    }
    // SQL >>>
}