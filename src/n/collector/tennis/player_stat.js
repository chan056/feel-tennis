const http = require('http');
const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');

const conn = require('../../db/connect');

let argv = process.argv.slice(2),
    playerId = argv[0],
    playerName = argv[1];

let cacheFileName = `player.${playerId}.cache.js`;
let sourceURL = `http://www.tennis.com/player/${playerId}/${playerName}/stats/`;

console.log(cacheFileName, sourceURL)

// fetchHTML()

function fetchHTML(){
    let cacheFilePath = `./cache/players/${cacheFileName}`;

    if(!fs.existsSync(cacheFilePath)){
        console.log(`requesting`)
        http.get(sourceURL, function(res) {
            let html = '';
            res.on('data', function(data) {
                html += data;
            }).on('end', function() {
                writeFile(html, cacheFilePath);
                storeData(html)
            });
        }).on('error', function() {
            console.log('获取数据出错！');
        });
    }else{
        fs.readFile(cacheFilePath, (err, data)=>{
            if(err){
                return console.log(err);
            }

            storeData(data.toString())
        })
    }
}

function storeData(fragment) {
    if (fragment) {
        let $ = cheerio.load(fragment);

        let sql = `insert into tennis.athlete (id_tennis_com, name, name_en, gender, ranking, prev_ranking, country, point, state_abbreviation) values `;

        $('#atpRanking').find('.player-row').map((i,playerLine)=>{
            playerLine = $(playerLine);

            let currentRanking = playerLine.find('.current-rank').text(),
                playerPrevRanking = playerLine.find('.prev-rank').text(),
                playerName = playerLine.find('.player-name').text().trim(),
                playerCountry = playerLine.find('.country-name').text().trim();

            let playerId = playerLine.find('.player-name a').eq(0).attr('href') || 0;
            if(playerId){
                playerId = playerId.match(/\/(\d+)\//);
                if(playerId){
                    playerId = playerId[1];
                }
            }

            let stateAbbreviation = playerLine.find('.player-country .flags').attr('class') || '';
            let playerPoints = playerLine.find('.player-points').text() || '';
            
            if(stateAbbreviation){
                stateAbbreviation = stateAbbreviation.match(/-(\w+)$/)[1];
            }

            if(playerPoints){
                playerPoints = playerPoints.replace(/,/g, '')
            }
                
            sql += `(${playerId}, '', '${playerName}', ${gender}, ${currentRanking}, ${playerPrevRanking}, '${playerCountry}', ${playerPoints}, '${stateAbbreviation}'),`
        })

        sql = sql.replace(/,$/, ';');

        runSql(sql/* , function(){
            queueCompletedCount ++;
            (queueCompletedCount == 2) && process.exit();
        }  */);
    }
}

function writeFile(cache, targetFile){
    
    fs.writeFile(targetFile, cache, function(err) {
        if (err) {
            return console.error(err);
        }
    });
}

// <<< SQL
function truncate(tableName){
    const sql = `truncate table ${tableName}`;
    runSql(sql);
}

function runSql(sql, fn){
    return conn.query(sql, function(err, result, fields){
        if(err)
            console.error(err.sqlMessage);
        
        fn && fn()
    });
}
// SQL >>>