const tools = require('../tools/main.js');
const path = require('path');

let argv = process.argv.slice(2);
console.log(argv);
let tournamentID = argv[0] = 858253;
let sid = argv[0];

const expires = require('./expire_config');
const now = Date.now() / 1000,
    day = 24 * 60 * 60;

;
const sourceURL = `http://www.tennis.com/scores/tournaments/${tournamentID}/monterrey-open-wta-2019/draw/`;

tools.fetchHTML(sourceURL, storeData)

function storeData(fragment) {
    if (fragment) {
        const cheerio = require('cheerio');

        let $ = cheerio.load(fragment);
        let XMLsource = extractXMLlink();
        console.log(XMLsource);
        // let xmlID = XMLsource.match(/\d+/);

        require('request')(XMLsource, function(error,response,body) {
            if(error)
                throw error;

            // console.log(body)
            try{
                let json = escape(JSON.stringify(
                    require('xml-parser')(body)
                ));
                // console.log(JSON.stringify(json))
    
                let sql = `insert into tennis.tournament_draw values (${tournamentID}, '${json}', FROM_UNIXTIME( ${now + day * expires.tournamentDraw}) ) 
                    ON DUPLICATE KEY UPDATE draw='${json}', expire=FROM_UNIXTIME(${now + day * expires.tournamentDraw});`
                tools.runSql(sql, function(){
                    process.exit();
                })
            }catch(e){
                throw e;
            }
            
        });

        function extractXMLlink(){
            let scriptContent = $('#_tennis_image_sizes').next('script').html();
            const reg = /\/draw\/\d+\.xml/;
            let match = scriptContent.match(reg);

            if(match){
                return 'http://ace.tennis.com' + match[0];
            }
            // http://ace.tennis.com/draw/10788.xml
        }
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
