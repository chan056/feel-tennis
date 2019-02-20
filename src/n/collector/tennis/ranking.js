const tools = require('../tools/main.js');
const path = require('path');

const GENDERS = [1, 2];
const ASSOCIATIONS = {1: 'ATP', 2: 'WTA'};
const IFFYPLAYERS = {
    'Juan Ignacio Londero': 10001,
    'Alex Bolt': 10002,
    'Jason Kubler': 10003,
    'Bibiane Schoofs': 10004
};

const now = Date.now() / 1000,
    day = 24 * 60 * 60;

let queueCompletedCount = 0;

// 清空表之前先复制
tools.runSql('drop table if EXISTS tennis.athlete_tmp; create table tennis.athlete_tmp select * from tennis.athlete;', function(){
    tools.truncate('tennis.athlete', function(){
        GENDERS.forEach((v, i)=>{
            let gender = v;
            let association = ASSOCIATIONS[v];
        
            let sourceURL = `http://www.tennis.com/rankings/${association}/`;
        
            tools.fetchHTML(sourceURL, storeData)
        
            function storeData(fragment) {
                if (fragment) {
                    const cheerio = require('cheerio');
        
                    let $ = cheerio.load(fragment);
            
                    let sql = `insert into tennis.athlete (id_tennis_com, name, name_en, gender, ranking, prev_ranking, country, point, state_abbreviation, ranking_expire) values `;
            
                    $('#atpRanking').find('.player-row').map((i,playerLine)=>{
                        playerLine = $(playerLine);
            
                        let currentRanking = playerLine.find('.current-rank').text(),
                            playerPrevRanking = playerLine.find('.prev-rank').text(),
                            playerName = playerLine.find('.player-name').text().trim(),
                            playerCountry = playerLine.find('.country-name').text().trim();
        
                        let playerId = playerLine.find('.player-name a').eq(0).attr('href') || null;
                        if(playerId){
                            playerId = playerId.match(/\/(\d+)\//);
                            if(playerId){
                                playerId = playerId[1];
                            }
                        }else{
                            // 数据问题，有些球员没有id
                            // playerId大于10000没有用户详情
                            playerId = IFFYPLAYERS[playerName];
                        }
        
                        let stateAbbreviation = playerLine.find('.player-country .flags').attr('class') || '';
                        let playerPoints = playerLine.find('.player-points').text() || '';
                        
                        if(stateAbbreviation){
                            stateAbbreviation = stateAbbreviation.match(/-(\w+)$/)[1];
                        }
        
                        if(playerPoints){
                            playerPoints = playerPoints.replace(/,/g, '')
                        }
                            
                        sql += `(${playerId}, '', '${playerName}', ${gender}, ${currentRanking}, ${playerPrevRanking}, '${playerCountry}', ${playerPoints}, '${stateAbbreviation}', FROM_UNIXTIME(${now + day})),`
                    })
            
                    sql = sql.replace(/,$/, ';');

                    tools.runSql(sql, function(){
                        queueCompletedCount ++;
                        if (queueCompletedCount == GENDERS.length){
                            // 从临时表复制数据
                            tools.runSql(`select id_tennis_com from tennis.athlete`, function(err, ids){

                                let updateCount = 0;

                                ids.forEach(function(value, index){
                                    let id = value['id_tennis_com'];
                                    // console.log(id)

                                    let updateSQL = `update tennis.athlete a, tennis.athlete_tmp b set 
                                        a.nickname= b.nickname,
                                        a.age= b.age,
                                        a.residence = b.residence,
                                        a.turn_pro= b.turn_pro,
                                        a.birthdate= b.birthdate,
                                        a.height= b.height,
                                        a.weight= b.weight,
                                        a.plays= b.plays,
                                        a.experience= b.experience,
                                        a.ytd_win_single= b.ytd_win_single,
                                        a.ytd_win_double= b.ytd_win_double,
                                        a.website= b.website,
                                        a.stat_expire = b.stat_expire,
                                        a.biography = b.biography,
                                        a.titles = b.titles,
                                        a.bio_expire = b.bio_expire,
                                        where  a.id_tennis_com = b.id_tennis_com and a.id_tennis_com = ${id};`;

                                    tools.runSql(updateSQL, function(){
                                        updateCount ++;
                                        if(updateCount == ids.length){
                                            process.exit();
                                        }
                                    })
                                })
                            })
                        }
                    });
                }
            }
        })
    })
})
