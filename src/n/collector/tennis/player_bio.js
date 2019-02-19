// node player_bio.js 585 juan-martin-del-potro
const path = require('path');
const tools = require('../tools/main.js');

const now = Date.now() / 1000,
    day = 24 * 60 * 60;

let argv = process.argv.slice(2),
    playerId = argv[0],
    playerName = argv[1];

let sourceURL = `http://www.tennis.com/player/${playerId}/${playerName}/bio/`;

tools.fetchHTML(sourceURL, storeData)

function storeData(fragment) {
    if (fragment) {
        const cheerio = require('cheerio');

        let $ = cheerio.load(fragment);

        const bioContentWrapper = $('.bio-content');
        const bioDescription = bioContentWrapper.find('p').eq(0).text();

        let titleWrapper = $('.player-titles');
        let titlesObj = {};
        
        titleWrapper.find('.titles-per-year').each((index, titles)=>{
            let titleGroup = [];
            $(titles).children('li').each((index, title)=>{
                let titleContent = $(title).text();
                // console.log(titleContent)
                let year = titleContent.match(/^\d+/)[0];
                let tournament = titleContent.replace(/^\d+:\W+/, '').replace(/\n/g, '');//转义 '
console.log(tournament)
                titleGroup.push({year: year, tournament: tournament})
            })

            if(index == 0){
                titlesObj.single = titleGroup
            }else if(index == 1){
                titlesObj.double = titleGroup
            }
        })

        let titleJSON = unescape(escape(JSON.stringify(titlesObj)));

        // console.log(titlesObj)
        let sql = `update tennis.athlete set 
            biography='${bioDescription}', 
            titles='${titleJSON}',
            bio_expire=FROM_UNIXTIME(${now + day * 7})
            where id_tennis_com=${playerId}`;

        // console.log(sql);

        tools.runSql(sql, function(){
            process.exit();
        });
    }
}




