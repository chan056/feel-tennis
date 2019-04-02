const tools = require('../tools/main.js');
const path = require('path');

let argv = process.argv.slice(2);

const expires = require('./expire_config');
const now = Date.now() / 1000,
    day = 24 * 60 * 60;

const sourceURL = `http://www.tennis.com/tournaments/`;

tools.runSql(`delete from tennis.tournament`, function(){

    tools.fetchHTML(sourceURL, storeData)

    function storeData(fragment) {
        if (fragment) {
            const cheerio = require('cheerio');

            let $ = cheerio.load(fragment);
            // current-tournaments
            // upcoming-tournaments-partial
            // recent-tournaments
            // console.log(fragment)
            // console.log( $('.tournament-article').length)
            let sql = 'insert into tennis.tournament values';
            let currentDOMbase = $('.current-tournaments');

            $('.tournament-article').each(function(index, ele){
                ele = $(ele);
                let href = ele.attr('href').trim();
                let name = ele.find('.basic-data h6').text();
                let date = ele.find('.start-date').text();
                
                let linkObj = parseTournamentDetailLink(href);
                let dateObj = processDate(date);

                let status = switchStatus(ele);
                // console.log(linkObj,dateObj,status);
                // status name date type link
                sql += ` (${linkObj.sid}, ${status}, '${escape(name)}', '${href}', ${linkObj.year}, ${dateObj.startTime}, ${dateObj.endTime}, FROM_UNIXTIME(${now + day * expires.tournament})),`
            })

            sql = sql.replace(/,$/, ';');

            tools.runSql(sql, function(){
                process.exit();
            })

            // /scores/tournaments/858254/volvo-car-open-wta-2019/
            function parseTournamentDetailLink(src){
                const sidReg = /\/tournaments\/(\d+)/,
                    yearReg = /(\d{4,})\/$/;

                let sid = src.match(sidReg)[1];
                let year = src.match(yearReg)[1];// 年度

                return {sid, year};
            }

            function processDate(date){
                // April 01 - April 07, 2019
                // April 01, 2018 - April 07, 2019

                if(date){
                    date = date.split('-');

                    let starDate = date[0].trim(),
                        endDate = date[1].trim();

                    if(!starDate.match(/\d{4,}/)){
                        starDate += ', ' + endDate.match(/\d{4,}/)[0];
                    }

                    let startTime = +new Date(starDate),
                        endTime = +new Date(endDate);

                    return {startTime, endTime}
                }
            }

            function switchStatus(ele){

                if(ele.parents('.current-tournaments').length){
                    return 0;
                }else if(ele.parents('.upcoming-tournaments-partial').length){
                    return 1;
                }else if(ele.parents('.recent-tournaments').length){
                    return -1;
                }
            }
        }
    }
})
