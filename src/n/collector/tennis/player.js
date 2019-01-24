let https = require('https');
var http = require('http');
let cheerio = require('cheerio');
let conn = require('../../db/connect').conn;

// https://www.atptour.com/en/players/roger-federer/f324/overview
let url = 'http://www.tennis.com/players/ATP/';// atp年度排名
fetchHTML(url, 1)

function fetchHTML(url, sportId){
    let requestor = url.match('https://')? https: http;
    requestor.get(url, function(res) {
        let html = '';
        res.on('data', function(data) {
            html += data;
        }).on('end', function() {
            console.log(html)
        });
    }).on('error', function() {
        console.log('获取数据出错！');
    });
}

// function truncateAthlete(fn){
//     conn.query('truncate athlete', function(err, result){
//         if(err)
//             console.log(err);

//         fn && fn();
//     });
// }

function fetchAndfilterData(html, sportId) {
    if (html) {
        let $ = cheerio.load(html);

        if(curSportId == 1){// 网球
            let title = $('title').eq(0).text();
            let gender = 3;
            if(title.match('ATP')){
                gender = 1;
            }else if(title.match('WTA')){
                gender = 2;
            }
            $('#u868>tbody td:nth-child(4)').map(function(i, p){// 4 不是 3！
                if (i > 99)
                    return;
    
                var pt =  $(p).text();
                var sql = `INSERT INTO athlete 
                (sport_id, name, gender)
                VALUES (?, ?, ?)`;
    
                conn.query(sql, [
                    sportId,
                    pt,
                    gender
                ], function(err, result, fields){
                    if(err)
                        console.log(err.sql, err.sqlMessage) ;
                });
            });
        }
    }
}