const tools = require('../tools/main.js');
const path = require('path');

let argv = process.argv.slice(2);
console.log(argv)
argv[0] = 858254;
cosnt sid = argv[0];

const expires = require('./expire_config');
const now = Date.now() / 1000,
    day = 24 * 60 * 60;

const sourceURL = `http://ace.tennis.com/pulse/2019-04-04_livescores_new.json`;
// const sourceURL = `http://www.tennis.com/scores/tournaments/858254/volvo-car-open-wta-2019/scores/`;

tools.fetchHTML(sourceURL, storeData)

function storeData(fragment) {
    if (fragment) {
        console.log(typeof fragment);

        try{
            let data = JSON.parse(fragment);
            console.log(data);
            let tournaments = data.tournaments;
            tournaments.each(function(tournament){
                if(tournament.id = sid){
                    
                }
            })

        }catch(e){
            throw e;
        }
        // let $ = cheerio.load(fragment);
        // let sql = 'insert into tennis.tournament values';
        // let currentDOMbase = $('.current-tournaments');


        // sql = sql.replace(/,$/, ';');

        // tools.runSql(sql, function(){
        //     process.exit();
        // })

    }
}
