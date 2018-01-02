module.exports = {
    parseSrt: function(srt, res){
        var fs = require('fs');
        var path = require('path');
        var parser = require('subtitles-parser');

        var dir = path.resolve(__dirname, '../../static/upload');
        srt = path.resolve(dir, srt);
        var srtStream = fs.readFileSync(srt,'utf8');

        var data = parser.fromSrt(srtStream, true);
        // console.log(data);
        res.end(JSON.stringify(data));
    }
}