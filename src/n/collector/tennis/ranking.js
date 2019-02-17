const tools = require('../tools/main.js');
const path = require('path');

const genders = [1, 2];
const ASSOCIATIONS = {1: 'ATP', 2: 'WTA'};

let queueCompletedCount = 0;

tools.truncate('tennis.athlete')

genders.forEach((v, i)=>{

    let gender = v;
    
    let association = ASSOCIATIONS[v];

    let cacheFileName = path.basename(__filename).replace('.js', `.${association.toLowerCase()}.cache.js`);
    let cacheFilePath = `./cache/${cacheFileName}`;
    let sourceURL = `http://www.tennis.com/rankings/${association}/`;

    tools.fetchHTML(sourceURL, cacheFilePath, storeData)

    function storeData(fragment) {
        if (fragment) {
            const cheerio = require('cheerio');

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
    
            tools.runSql(sql, function(){
                queueCompletedCount ++;
                (queueCompletedCount == genders.length) && process.exit();
            } );
        }
    }
})