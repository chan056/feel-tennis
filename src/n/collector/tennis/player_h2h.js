// node player_bio.js 585 juan-martin-del-potro
const path = require('path');
const tools = require('../tools/main.js');

const now = Date.now() / 1000,
    day = 24 * 60 * 60;

let argv = process.argv.slice(2),
    p1 = argv[0],
    p1Name = argv[1],
    p2 = argv[2],
    p2Name = argv[3];;

// http://www.tennis.com/players/471/rafael-nadal/vs/646/adrian-mannarino/
let sourceURL = `http://www.tennis.com/players/${p1}/${p1Name}/vs/${p2}/${p2Name}/`;

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
        let sql = `delete * from tennis.h2h where p1=${p1} and p2=${p2}; 
        insert into tennis.h2h values (null, ${p1}, ${p2}, ${win}, ${lose}, FROM_UNIXTIME(${now+7*day}))`;

        // console.log(sql);

        tools.runSql(sql, function(){
            process.exit();
        });
    }
}




