var https = require('https');
var cheerio = require('cheerio');

// en zh-Hans
var url = 'https://live-tennis.eu/zh-Hans/atp-live-ranking';// atp年度排名


https.get(url, function(res) {
    var html = '';
    res.on('data', function(data) {
        html += data;
    });
    res.on('end', function() {
        var data = filterData(html);
        console.log(html.length, data)
    });
}).on('error', function() {
    console.log('获取数据出错！');
});

function filterData(html) {
    if (html) {
        var $ = cheerio.load(html);

        // return console.log($('#plyrRankings').length, $('#plyrRankings tbody td').length, $('#plyrRankings tbody td:nth-child(3)').length)
        var playerNames = $('#plyrRankings tbody td:nth-child(4)').map(function(i, p){
            return $(p).text();
        }).get();
        return playerNames;
    }
}