var https = require('https');
var cheerio = require('cheerio');
var conn = require('./db/connect').conn;

// en zh-Hans
var url = 'https://live-tennis.eu/zh-Hans/atp-live-ranking';// atp年度排名
var SPORTID = 1;//网球

https.get(url, function(res) {
    var html = '';
    res.on('data', function(data) {
        html += data;
    });
    res.on('end', function() {
        filterData(html);
    });
}).on('error', function() {
    console.log('获取数据出错！');
});

function filterData(html) {
    if (html) {
        var $ = cheerio.load(html);
        conn.query('truncate athlete', function(){
            // return console.log($('#plyrRankings').length, $('#plyrRankings tbody td').length, $('#plyrRankings tbody td:nth-child(3)').length)
            $('#u868>tbody td:nth-child(4)').map(function(i, p){// 4 不是 3！
                if (i > 299)
                    return;

                var pt =  $(p).text();
                var sql = `INSERT INTO athlete 
                (sport_id, name)
                VALUES (?, ?)`;
                conn.query(sql, [
                    SPORTID,
                    pt
                ], function(err, result, fields){
                    if(err)
                        console.log(err.sql, err.sqlMessage) ;
                });
                
                console.log(pt);
            }).get();
            
        });
    }
}