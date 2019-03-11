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

    downloadImg: function (src, dest, fn){
        // 保存图片之前 检查图片是否存在 以及 缓存时间
        
        const request = require("request");

        fs.access(dest, function(err){
            if(err){
                let writeStream = fs.createWriteStream(dest);

                let readStream = request(src, function(){
                    arguments[0] && console.log(arguments[0]);
                });
        
                readStream.pipe(writeStream);
        
                readStream.on('end', function() {
                    console.log('文件下载成功');
                });
        
                readStream.on('error', function(err) {
                    console.log("错误信息:" + err)
                });
        
                writeStream.on("finish", function() {
                    console.log("文件写入成功");
                    writeStream.end();
        
                    fn && fn()
                });
            }else{
                console.log(`${dest} 已存在`)
                fn && fn()
            }
        })
    },

    fetchHTML: function (url, fn){
        require('request')(url, function(error,response,body) {
            if(error)
                throw error;

            if(!error && response.statusCode == 200){
                fn && fn(body)
            }else{
                throw `statusCode: ${response.statusCode}`;
            }
        })
    },

    // June 03, 1986 => 
    formatBirthdate: function (birthdate){
        return birthdate.replace(/\w+/, function(month){
            let index = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Autum', 'September', 'October', 'November', 'December'].indexOf(month) + 1;;
            return index > 9? index: ('0' + index)
        })
    },
    
    // <<< SQL
    truncate: function (tableName, fn){
        const sql = `truncate table ${tableName}`;
        this.runSql(sql, fn);
    },
    
    runSql: function (sql, fn){
        console.log(sql.replace(/\s{2,}/g, '').slice(0, 100))
        return conn.query(sql, function(err, result, fields){
            if(err)
                console.log (err);
            
            fn && fn(err, result, fields)
        });
    }
    // SQL >>>
}