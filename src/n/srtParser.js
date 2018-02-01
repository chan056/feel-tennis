module.exports = {
    parseSrt: function(vId, res){
        var fs = require('fs');
        var path = require('path');
        var parser = require('subtitles-parser');

        var dir = path.resolve(__dirname, '../../static/multimedia/ts/');
        srt = path.resolve(dir, `./${vId}/subtitle`);

        if(fs.exists(srt)){
            var srtStream = fs.readFileSync(srt,'utf8');
            var data = parser.fromSrt(srtStream, true);
            // console.log(data);
            res.end(JSON.stringify(data));
        }
        
    }
}