// node player_bio.js 585 juan-martin-del-potro
const path = require('path');
const tools = require('../tools/main.js');

const now = Date.now() / 1000,
    day = 24 * 60 * 60;

let argv = process.argv.slice(2),
    playerId = argv[0],
    playerName = argv[1];

const expires = require('./expire_config');

let sourceURL = `http://www.tennis.com/player/${playerId}/${playerName}/bio/`;
tools.fetchHTML(sourceURL, storeData)

function storeData(fragment) {
    if (fragment) {
        const cheerio = require('cheerio');

        let $ = cheerio.load(fragment);

        const bioContentWrapper = $('.bio-content');
        const bioDescription = escape(bioContentWrapper.find('p').eq(0).text());

        let titlesObj = {};
        
        try{
            let titleWrapper = $('.player-titles');

            titleWrapper.find('.titles-per-year').each((index, titles)=>{
                let titleGroup = [];
                $(titles).children('li').each((index, title)=>{
                    let titleContent = $(title).text();
                    let year = titleContent.match(/(\d+):/)[1];
                    let tournament = titleContent.replace(/^\d+:\W+/, '').replace(/\n/g, '')/* .replace(/'/g, '\'') */;//转义 '
                    titleGroup.push({year: year, tournament: tournament})
                })

                if(index == 0){
                    titlesObj.single = titleGroup
                }else if(index == 1){
                    titlesObj.double = titleGroup
                }
            })
        }catch(e){
            titlesObj = {}
            console.log('TOUNAMENT HISTORY 格式有误')
        }

        let titleJSON = escape(JSON.stringify(titlesObj));

        let sql = `update tennis.athlete set 
            biography='${bioDescription}', 
            titles='${titleJSON}',
            bio_expire=FROM_UNIXTIME(${now + day * expires.bio})
            where id_tennis_com=${playerId}`;

        tools.runSql(sql, function(){
            process.exit();
        });
    }
}




