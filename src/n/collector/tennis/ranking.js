const https = require('https');
const http = require('http');
const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');

const conn = require('../../db/connect');

let argv = process.argv.slice(2);

let sportId = argv[0];// node ranking 1
const ASSOCIATIONS = {1: 'ATP', 2: 'WTA'};
let association = ASSOCIATIONS[sportId];

const cacheFileName = path.basename(__filename).replace('.js', `.${association}.cache.js`);

let url = `http://www.tennis.com/rankings/${association}/`;// atp年度排名
fetchHTML(url)

function fetchHTML(url){
    let requestor = url.match('https://')? https: http;

    if(!fs.existsSync(`./${cacheFileName}`)){
        requestor.get(url, function(res) {
            let html = '';
            res.on('data', function(data) {
                html += data;
            }).on('end', function() {
                writeFile(html);
                fetchAndfilterData(html)
            });
        }).on('error', function() {
            console.log('获取数据出错！');
        });
    }else{
        fs.readFile(`./${cacheFileName}`, (err, data)=>{
            if(err){
                return console.log(err);
            }

            fetchAndfilterData(data.toString())
        })
    }

}

function fetchAndfilterData(html) {
    if (html) {
        let $ = cheerio.load(html);

        let sql = ``;
        $('#atpRanking').find('.player-row').map((i,playerLine)=>{
            playerLine = $(playerLine);

            let currentRank = playerLine.find('.current-rank').text(),
                playerPrevRank = playerLine.find('.prev-rank').text(),
                playerName = playerLine.find('.player-name').text(),
                playerCountry = playerLine.find('.player-country').text(),
                playerPoints = playerLine.find('.player-points').text();

                playerPoints && (playerPoints = playerPoints.replace(/,/g, ''))

            // INSERT INTO 

            // items(name,city,price,number,picture) 
            
            // VALUES
            
            // ('耐克运动鞋','广州',500,1000,'003.jpg'),
            
            // ('耐克运动鞋2','广州2',500,1000,'002.jpg');
            sql += `insert into tennis.athlete ()`;
            console.log(currentRank);
        })
       /*  $('#u868>tbody td:nth-child(4)').map(function(i, p){// 4 不是 3！
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
        }); */
    }
}

function writeFile(cache){
    
    fs.writeFile(cacheFileName, cache, function(err) {
        if (err) {
            return console.error(err);
        }
    });
}