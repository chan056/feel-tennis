module.exports = {
    parseCaption: function(params, res){
        var fs = require('fs');
        var path = require('path');
        var parser = require('subtitles-parser');

        let vId= params.vId;
        let draftId = params.draftId;

        let captionPath = path.resolve(global.staticRoot, `./multimedia/ts/${vId}/subtitle`);

        // 读取优先级 草稿 终稿 原稿
        if(draftId){// 
            if(fs.existsSync(captionPath + `.tmp.${draftId}`)){
                captionPath = captionPath + `.tmp.${draftId}`;
            }else{
                captionPath += `.${draftId}`;
            }
        }

        fs.exists(captionPath, function(doExsit){
            if(doExsit){
                var captionStream = fs.readFileSync(captionPath,'utf8');
                var data = parser.fromSrt(captionStream, true);
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

    toCaption: function(postObj, usrId){
        var parser = require('subtitles-parser');
        var fs = require('fs');
        var path = require('path');

        let draftPath = path.resolve(
            global.staticRoot, 
            `./multimedia/ts/${postObj.vId}/subtitle.tmp.${usrId}`
        )
        let finalDraftPath = path.resolve(
            global.staticRoot, 
            `./multimedia/ts/${postObj.vId}/subtitle.${usrId}`
        )

        var captions = parser.toSrt(postObj.captions);
        fs.writeFileSync(postObj.isFinal? finalDraftPath: draftPath, captions);

        // 发布时 删除草稿
        if(postObj.isFinal){
            require('del')([draftPath])
        }
    }
}