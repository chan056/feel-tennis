// node player_bio.js 585 juan-martin-del-potro
const path = require('path');
const tools = require('../tools/main.js');

const now = Date.now() / 1000,
    day = 24 * 60 * 60;

let argv = process.argv.slice(2),
    playerId = argv[0],
    playerName = argv[1];

const expires = require('./expire_config');

let sourceURL = `http://www.tennis.com/player/${playerId}/${playerName}/gear/`;
tools.fetchHTML(sourceURL, storeData)

function storeData(fragment) {
    if (fragment) {
        const cheerio = require('cheerio');

        let $ = cheerio.load(fragment);

        const contentWrapper = $('.single-player-gear');
        let gears = []

        contentWrapper.find('.single-product').each((index, product)=>{
            let picture = $(product).find('.product-image').css('backgroundImage');
            let name = $(product).find('.product-name').text().trim();
            let summary = $(product).find('.product-short-summary').text().trim();
            let link = $(product).find('.btn-container a').attr('href');

            gears.push({picture, name, summary, link});
        })

        if(gears.length){
            gears = escape(JSON.stringify(gears));

            let sql = `update tennis.athlete set 
                gear='${gears}',
                gear_expire = FROM_UNIXTIME(${now + day * expires.gear})
                where id_tennis_com=${playerId}`;
    
            tools.runSql(sql, function(){
                process.exit();
            });
        }else{
            console.log('没有查询到装备信息');
            process.exit();
        }
    }
}




