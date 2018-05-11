function convertSrt2vtt(srtPath){
    srtPath = './subtitle';
    var fs = require('fs');
    var srt2vtt = require('srt2vtt');

    var srtData = fs.readFileSync(srtPath);
    srt2vtt(srtData, function(err, vttData) {
        if (err) throw new Error(err);
            fs.writeFileSync('subtitle.vtt', vttData);
    });
}

convertSrt2vtt();