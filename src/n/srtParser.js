module.exports = {
    parseSrt: function(params, res){
        var fs = require('fs');
        var path = require('path');
        var parser = require('subtitles-parser');

        let vId= params.vId;
        let usrId = params.usrId;

        let srt = path.resolve(global.staticRoot, `./multimedia/ts/${vId}/subtitle`);

        if(usrId){
            srt += `.${usrId}`;
        }

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
                item = data[i];
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

    toSrt: function(vId, arr, usrId){
        var parser = require('subtitles-parser');
        var fs = require('fs');
        var path = require('path');
        var srtPath = path.resolve(global.staticRoot, `./multimedia/ts/${vId}/subtitle.${usrId}`);

        var srt = parser.toSrt(arr);
        fs.writeFileSync(srtPath, srt);
    }
}