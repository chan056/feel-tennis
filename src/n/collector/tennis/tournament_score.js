const tools = require('../tools/main.js');
const path = require('path');

let argv = process.argv.slice(2);
console.log(argv);
argv[0] = 858254;
let sid = argv[0];

const expires = require('./expire_config');
const now = Date.now() / 1000,
    day = 24 * 60 * 60;

;
const sourceURL = `http://ace.tennis.com/pulse/${calcTimeZoneDate()}_livescores_new.json`;
// const sourceURL = `http://www.tennis.com/scores/tournaments/858254/volvo-car-open-wta-2019/scores/`;

tools.fetchHTML(sourceURL, storeData)

function storeData(fragment) {
    if (fragment) {
        try{
            let data = JSON.parse(fragment);
            let tournaments = data.tournaments;
            tournaments.forEach(function(tournament){
                if(tournament.id == sid){
                    let events = tournament.event;

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

/* // 计算+1时区的日期
// 数据是东1时区的数据（英国）
// 数据链接中带有日期参数
function calcTimeZoneDate(){
    let now = +new Date();
    let hourMilli = 60*60*1000;

    let firstTimezone = new Date(now - 7 * hourMilli);
    let y = firstTimezone.getFullYear(),
        m = firstTimezone.getMonth() + 1,
        d = firstTimezone.getDate();

    return y + '-' + zeroFill(m) + '-' + zeroFill(d);

    function zeroFill(n){
        return n > 9? n: '0'+n
    }
} */
