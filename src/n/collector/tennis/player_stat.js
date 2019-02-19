const path = require('path');
const tools = require('../tools/main.js');

const now = Date.now() / 1000,
    day = 24 * 60 * 60;

let argv = process.argv.slice(2),
    playerId = argv[0],
    playerName = argv[1];

let sourceURL = `http://www.tennis.com/player/${playerId}/${playerName}/record/`;

tools.fetchHTML(sourceURL, storeData)

function storeData(fragment) {
    if (fragment) {
        const cheerio = require('cheerio');

        let $ = cheerio.load(fragment);
        let sql;

        const events = $('.event-breakdown');
        events.each((index, eventWrapper) => {
            let eventScoreRow = eventWrapper.find('.player-row');
            const birthdate = stats.find('.player-birthdate').text(),

            sql = `update tennis.athlete set 
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

        
        });

        tools.runSql(sql, function(){
            process.exit();
        });
    }
}




