// node player_stat.js 471 rafael-nadal
const tools = require('../tools/main.js');
const path = require('path');

const now = Date.now() / 1000,
    day = 24 * 60 * 60;

const expires = require('./expire_config');

const sourceURL = `http://www.tennis.com/players-rankings/`;
let imgDownloadedNum = 0;

tools.fetchHTML(sourceURL, storeData)

function storeData(fragment) {
    if (fragment) {
        try{
            const cheerio = require('cheerio');

            let $ = cheerio.load(fragment);
    
            const wrapper = $('.rankings');
            let players = {};

            tools.runSql('update tennis.athlete set is_top = null, top_expire=null where is_top = 1;')

            wrapper.find('.player-name').parent().each(function(i, player){
                player = $(player);
                let href = player.attr('href');
                let playerId = href.match(/\d+/);
                players[playerId] = {};

                // 名字
                let nameWrapper = player.find('.player-name');
                let firstname = nameWrapper.find('.first-name').text().trim();
                let fullname = nameWrapper.text().trim();
                let lastname = fullname.replace(firstname, '').trim();

                players[playerId].firstname = firstname;
                players[playerId].lastname = lastname;
                
                // 头像
                let playerImage = player.children('figure').attr('data-image'),
                playerImageExt = path.extname(playerImage),
                player_image = `/img/tennis/athlete/${playerId}.small${playerImageExt}`;// 客户端访问地址
                players[playerId].img = player_image;
    
                playerImage = playerImage.replace(/\.\w+$/, '') + `/small${playerImageExt}`;
                tools.downloadImg(playerImage, path.resolve(__dirname, `../../../static${player_image}`, ), function(){
                    imgDownloadedNum ++;

                    if(imgDownloadedNum == 6){
                        // 检查是否有ranking
                            // 有
                            //     移除旧标记 添加新标记
                            // 没有
                            //     node ranking
                            //         移除旧标记 添加新标记

                        tools.runSql('select * from tennis.athlete', (err, result, fields)=>{
                            if(result.length){
                                markTopPlayer();
                            }else{
                                let file = path.resolve(__dirname, './ranking');
                                let rankingCount = 0;

                                [1,2].forEach((v)=>{
                                    require('../../tools').spawn([file, v], ()=>{
                                        rankingCount ++ 
                                        if(rankingCount == 2){
                                            markTopPlayer();
                                        }
                                    })
                                })
                            }
                        })

                        function markTopPlayer(){
                            let sql = '';

                            for(let id in players){
                                let player = players[id];

                                sql += `update tennis.athlete set 
                                firstname = "${player.firstname}",
                                lastname = "${player.lastname}",
                                is_top=1, 
                                player_image_small="${player.img}", 
                                top_expire=FROM_UNIXTIME(${now + day * expires.top}) 
                                where id_tennis_com = ${id};`;
                            }

                            tools.runSql(sql, (err, result, fields)=>{
                                process.exit();
                            })
                        }
                    }
                });
            })
        }catch(e){
            throw e;
        }
    }
}
