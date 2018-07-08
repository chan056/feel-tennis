let https = require('https');
let cheerio = require('cheerio');
let conn = require('../db/connect').conn;

let TENNISSPORTID = 1;//网球

var curSportId = TENNISSPORTID;

// language: en + zh-Hans
let url1 = 'https://live-tennis.eu/zh-Hans/atp-live-ranking';// atp年度排名
let url2 = 'https://live-tennis.eu/zh-Hans/wta-live-ranking';// wta年度排名

let urls = {};
urls[TENNISSPORTID] = {'atp': url1, 'wta': url2};

truncateAthlete(function(){
    for(let sportId in urls){
        let sportUrls = urls[sportId];
        for(let sportDataSourceName in sportUrls){
            let sportDataSourceUrl = sportUrls[sportDataSourceName];
            fetchHTML(sportDataSourceUrl, sportId)
        }
    }
});

function fetchHTML(url, sportId){
    https.get(url, function(res) {
        let html = '';
        res.on('data', function(data) {
            html += data;
        });
        res.on('end', function() {
            fetchAndfilterData(html, sportId);
        });
    }).on('error', function() {
        console.log('获取数据出错！');
    });
}

function truncateAthlete(fn){
    conn.query('truncate athlete', function(err, result){
        if(err)
            console.log(err);

        fn && fn();
    });
}

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