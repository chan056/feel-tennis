// node player_stat.js 471 rafael-nadal
const tools = require('../tools/main.js');
const path = require('path');

const now = Date.now() / 1000,
    day = 24 * 60 * 60;

let argv = process.argv.slice(2),
    playerId = argv[0],
    playerName = argv[1];

let sourceURL = `http://www.tennis.com/player/${playerId}/${playerName}/stats/`;
let playerImagerDownloaded = false;

tools.fetchHTML(sourceURL, storeData)

function storeData(fragment) {
    if (fragment) {
        const cheerio = require('cheerio');

        let $ = cheerio.load(fragment);

        const aboutWrapper = $('.about-wrapper');
        const age = aboutWrapper.find('.about-info').eq(0).text(),
            residence = aboutWrapper.find('.about-info').eq(2).text(),
            turn_pro = aboutWrapper.find('.about-info').eq(3).text(),
            playerImage = $('.player-image').attr('data-image').replace(/\.\w+$/, '') + '/tablet-rankings-players-page.jpg',
            player_image = `/img/tennis/athlete/${playerId}.jpg`;

        tools.downloadImg(playerImage, path.resolve(__dirname, `../../../static${player_image}`, ), function(){
            playerImagerDownloaded = true;
        });

        const stats = $('.player-stats');
        const birthdate = stats.find('.player-birthdate').text(),
            height = stats.find('.player-height').text().match(/\((\d+)/)[1],
            weight = stats.find('.player-weight').text().match(/\((\d+)/)[1],
            plays = stats.find('.player-plays').text() == 'Left-handed'?1:0,
            experience = stats.find('.player-experience').text().match(/\d+/)
            nickname = stats.find('.player-nickname').text(),
            ytd_win = stats.find('.player-wins').text().match(/\d+/g),
            ytd_win_single = ytd_win[0]
            ytd_win_double = ytd_win[1],
            website = stats.find('.player-website a').attr('href');

        let sql = `update tennis.athlete set 
            player_image = '${player_image}',
            age=${age}, 
            residence='${residence}', 
            turn_pro=${turn_pro}, 
            birthdate='${tools.formatBirthdate(birthdate)}', 
            height=${height}, 
            weight=${weight}, 
            plays=${plays}, 
            experience=${experience}, 
            nickname='${nickname}', 
            ytd_win_single=${ytd_win_single}, 
            ytd_win_double=${ytd_win_double}, 
            website='${website}',
            stat_expire=FROM_UNIXTIME(${now + day * 7})
            where id_tennis_com=${playerId}`;

        // console.log(sql);

        tools.runSql(sql, function(){
            setInterval(() => {
                if(playerImagerDownloaded){
                    process.exit();
                }
            }, 1000);
        });
    }
}
