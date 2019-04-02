const tools = require('../tools/main.js');
const path = require('path');

let argv = process.argv.slice(2);
const gender = argv[0];
console.log('gender: ' + gender)
if(!gender){
    console.err('缺少性别参数');
    process.exit();
}

const expires = require('./expire_config');
let temp_id = {1:10000, 2: 20000}[gender];

const now = Date.now() / 1000,
    day = 24 * 60 * 60;

// 清空表之前先复制
tools.runSql('drop table if EXISTS tennis.athlete_tmp; create table tennis.athlete_tmp select * from tennis.athlete; alter table tennis.athlete_tmp add primary key(id);', function(){
    tools.runSql(`delete from tennis.athlete where gender=${gender}`, function(){
        let sourceURL = `http://www.tennis.com/rankings/${{1: 'ATP', 2: 'WTA'}[gender]}/`;
    
        tools.fetchHTML(sourceURL, storeData)
    
        function storeData(fragment) {
            if (fragment) {
                const cheerio = require('cheerio');
    
                let $ = cheerio.load(fragment);
        
                // select count(1)  from information_schema.COLUMNS where table_name = 'athlete';  表总列数
                let sql = `insert into tennis.athlete (id_tennis_com, name, name_en, gender, ranking, prev_ranking, country, point, state_abbreviation, ranking_expire) values `;
        
                $('#atpRanking').find('.player-row').map((i,playerLine)=>{
                    playerLine = $(playerLine);
        
                    let currentRanking = playerLine.find('.current-rank').text(),
                        playerPrevRanking = playerLine.find('.prev-rank').text(),
                        nameEN = playerLine.find('.player-name').text().trim(),
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
                        playerId = ++ temp_id;
                    }
    
                    let stateAbbreviation = playerLine.find('.player-country .flags').attr('class') || '';
                    let playerPoints = playerLine.find('.player-points').text() || '';
                    
                    if(stateAbbreviation){
                        stateAbbreviation = stateAbbreviation.match(/-(\w+)$/)[1];
                    }
    
                    if(playerPoints){
                        playerPoints = playerPoints.replace(/,/g, '')
                    }
                        
                    sql += `(${playerId}, '', '${nameEN}', ${gender}, ${currentRanking}, ${playerPrevRanking}, '${playerCountry}', ${playerPoints}, '${stateAbbreviation}', FROM_UNIXTIME(${now + expires.ranking * day})),`
                })
        
                sql = sql.replace(/,$/, ';');

                tools.runSql(sql, function(){
                        // 从临时表复制数据
                        tools.runSql(`select id_tennis_com from tennis.athlete`, function(err, ids){
                            let ary = [];
                            ids.forEach((row)=>{
                                ary.push(row.id_tennis_com)
                            });

                            let updateSQL = '';

                            // 复制22字段
                            updateSQL += `update tennis.athlete a, tennis.athlete_tmp b set 
                            a.firstname= b.firstname,
                            a.lastname= b.lastname,
                            a.nickname= b.nickname,
                            a.player_image = b.player_image,
                            a.feature_image = b.feature_image,
                            a.age = b.age,
                            a.residence = b.residence,
                            a.turn_pro= b.turn_pro,
                            a.earnings = b.earnings,
                            a.birthdate= b.birthdate,
                            a.height= b.height,
                            a.weight= b.weight,
                            a.plays= b.plays,
                            a.experience= b.experience,
                            a.ytd_win_single= b.ytd_win_single,
                            a.ytd_win_double= b.ytd_win_double,
                            a.website= b.website,
                            a.history_data = b.history_data,
                            a.biography = b.biography,
                            a.titles = b.titles,
                            a.stat_expire = b.stat_expire,
                            a.bio_expire = b.bio_expire
                            where  a.id_tennis_com = b.id_tennis_com 
                            and a.id_tennis_com in (${ary.join(',')}) 
                            and a.gender=${gender}`;

                            tools.runSql(updateSQL, function(){
                                process.exit();
                            })
                        })
                });
            }
        }
    })
})
