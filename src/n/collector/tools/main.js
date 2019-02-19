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

    fetchHTML: function (url, fn){
        console.log(url)
        let t = this;

        http.get(url, function(res) {
            let html = '';
            res.on('data', function(data) {
                html += data;
            }).on('end', function() {
                fn && fn(html)
            });
        }).on('error', function() {
            console.log('获取数据出错！');
        });
    },

    // June 03, 1986 => 
    formatBirthdate: function (birthdate){
        return birthdate.replace(/\w+/, function(month){
            let index = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Autum', 'September', 'October', 'Novenmber', 'December'].indexOf(month) + 1;;
            return index > 9? index: ('0' + index)
        })
    },
    
    // <<< SQL
    truncate: function (tableName, fn){
        const sql = `truncate table ${tableName}`;
        this.runSql(sql, fn);
    },
    
    runSql: function (sql, fn){
        return conn.query(sql, function(err, result, fields){
            if(err)
                console.log (err);
            
            fn && fn(err, result, fields)
        });
    }
    // SQL >>>
}