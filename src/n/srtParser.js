module.exports = {
    parseSrt: function(vId, res){
        var fs = require('fs');
        var path = require('path');
        var parser = require('subtitles-parser');

        var dir = path.resolve(__dirname, '../static/multimedia/ts/');
        srt = path.resolve(dir, `./${vId}/subtitle`);

        fs.exists(srt, function(doExsit){
            if(doExsit){
                var srtStream = fs.readFileSync(srt,'utf8');
                var data = parser.fromSrt(srtStream, true);
                console.log(data);
                res.end(JSON.stringify(data));
            }else{
                res.statusCode = 404;
                res.end('srt 404');
            }
        });
    }
}