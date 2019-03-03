// node player_stat.js 471 rafael-nadal
const tools = require('../tools/main.js');
const path = require('path');

const now = Date.now() / 1000,
    day = 24 * 60 * 60;
let argv = process.argv.slice(2),
    playerId = argv[0],
    playerName = argv[1];

const expires = require('./expire_config');

let sourceURL = `http://www.tennis.com/player/${playerId}/${playerName}/stats/`;
let playerImagerDownloaded = false,
    featureImagerDownloaded = false;

tools.fetchHTML(sourceURL, storeData)

function storeData(fragment) {
    if (fragment) {
        try{
            const cheerio = require('cheerio');

            let $ = cheerio.load(fragment);
    
            const aboutWrapper = $('.about-wrapper');
            // 由于数据不完整，无法通过排列顺序确定
            let age = null,
                residence = '',
                turn_pro = '',
                earnings = '';
    
            aboutWrapper.find('.about-info').each(function(i, item){
                let infos = $(item).parent().html().split('<br>');
                let label = infos[0].toLowerCase().trim();
                let value = $(infos[1]).text().trim();
    
                if(label == 'age'){
                    age = value
                }else if(label == 'residence'){
                    residence = value
                }else if(label == 'turned pro'){
                    turn_pro = value
                }else if(label.match('earnings')){
                    earnings = value;
                    let earningYear = label.match(/\d+/);
                    if(earningYear)
                        earnings = earningYear + '|' +earnings;
                }
            })
    
            let playerImage = $('.player-image').attr('data-image'),
                playerImageExt = path.extname(playerImage),
                player_image = `/img/tennis/athlete/${playerId}${playerImageExt}`;// 客户端访问地址
    
            playerImage = playerImage.replace(/\.\w+$/, '') + `/tablet-rankings-players-page${playerImageExt}`;
    
            let featureImage = $('.single-player-hero figure').attr('data-image'),
                featureImageExt = path.extname(featureImage),
                feature_image = `/img/tennis/athlete/${playerId}.feature${featureImageExt}`;// 客户端访问地址
    
            featureImage = featureImage.replace(/\.\w+$/, '') + `/desktop-detail-featured-image${featureImageExt}`;
    
            tools.downloadImg(playerImage, path.resolve(__dirname, `../../../static${player_image}`, ), function(){
                playerImagerDownloaded = true;
            });
    
            tools.downloadImg(featureImage, path.resolve(__dirname, `../../../static${feature_image}`, ), function(){
                featureImagerDownloaded = true;
            });
    
            const stats = $('.player-stats');
            const firstname = $('.name-and-ranking .first-name').text().trim(),
                lastname = $('.name-and-ranking .last-name').text().trim(),
                birthdate = stats.find('.player-birthdate').text().trim(),
                height = stats.find('.player-height').text().trim().match(/\((\d+)/)[1],
                weight = stats.find('.player-weight').text().trim().match(/\((\d+)/)[1],
                plays = stats.find('.player-plays').text().trim() == 'Left-handed'?1:0,
                experience = stats.find('.player-experience').text().trim().match(/\d+/)
                nickname = stats.find('.player-nickname').text().trim(),
                ytd_win = stats.find('.player-wins').text().trim().match(/\d+/g),
                ytd_win_single = ytd_win[0]
                ytd_win_double = ytd_win[1],
                website = stats.find('.player-website a').attr('href');

            // JSON ranking + earning + standings
            const historyReg = /_tennis.PLAYER_STATS = [^<]+/;
            let str = fragment.match(historyReg)[0];
            let _tennis = {};
            try{
                eval(str);
                delete _tennis.STATIC_URL;
            }catch(e){
                throw e;
            }
            let historyData = escape(JSON.stringify(_tennis));
           
            let sql = `update tennis.athlete set 
                player_image = '${player_image}',
                feature_image = '${feature_image}',
                firstname = '${firstname}',
                lastname = '${lastname}',
                age = ${age},
                residence = '${residence}',
                turn_pro = '${turn_pro}',
                earnings = '${earnings}',
                birthdate = '${tools.formatBirthdate(birthdate)}', 
                height = ${height}, 
                weight = ${weight}, 
                plays = ${plays}, 
                experience = ${experience}, 
                nickname = '${nickname}', 
                ytd_win_single = ${ytd_win_single}, 
                ytd_win_double = ${ytd_win_double}, 
                website = '${website}',
                history_data = '${historyData}',
                stat_expire = FROM_UNIXTIME(${now + day * expires.stat})
                where id_tennis_com = ${playerId}`;
    
            tools.runSql(sql, function(){
                setInterval(() => {
                    if(playerImagerDownloaded && featureImagerDownloaded){
                        process.exit();
                    }
                }, 500);
            });
        }catch(e){
            throw e;
        }
    }
}
