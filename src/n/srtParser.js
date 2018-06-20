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
                // console.log(data);
                data = trimSrt(data);
                res.end(JSON.stringify(data));
            }else{
                // res.statusCode = 404;
                res.end();
            }
        }.bind(this));

        function trimSrt(data){
            let item;
            for(let i=0; i<data.length; i++){
                item=data[i];
                if(!item){
                    break;
                }
    
                if(!item.text){
                    if(i > 0){
                        data[i-1]['endTime'] = item.endTime;
                        data.splice(i, 1);
                        i--;
                    }
                }
            }
    
            return data;
        }
    },

    toSrt: function(vId, arr){
        var parser = require('subtitles-parser');
        var fs = require('fs');
        var path = require('path');
        var dir = path.resolve(__dirname, '../static/multimedia/ts/');
        var srtPath = path.resolve(dir, `./${vId}/subtitle.${vId}`);

        var srt = parser.toSrt(arr);
        fs.writeFileSync(srtPath, srt);
    }
}