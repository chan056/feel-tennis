module.exports = {
    parseCaption: function(params, res){
        var fs = require('fs');
        var path = require('path');
        var parser = require('subtitles-parser');

        let vId= params.vId;
        let draftId = params.draftId;
        let usrId = params.usrId;

        let captionPath = path.resolve(global.staticRoot, `./multimedia/ts/${vId}/subtitle`);
        
        if(draftId){// 字幕编辑-查看状态
            // 读取优先级 终稿 默认稿
            if(fs.existsSync(captionPath + `.${draftId}`)){
                captionPath += `.${draftId}`;
            }
        }else if(params.ownDraft && usrId){
            // 读取优先级 草稿 终稿 默认稿
            if(fs.existsSync(captionPath + `.tmp.${usrId}`)){
                captionPath = captionPath + `.tmp.${usrId}`;
            }else if(fs.existsSync(captionPath + `.${usrId}`)){
                captionPath += `.${usrId}`;
            }
        }else{// 视频播放
            let p;
            
            if(params.noTutorial){// 非教程视频
                p = path.resolve(global.staticRoot, `./multimedia/ts_introductory/${vId}/subtitle`);
            }else{// 教程视频
                p = path.resolve(global.staticRoot, `./multimedia/ts/${vId}/subtitle.zh`);//默认中文字幕
                if(!fs.existsSync(p)){
                    p = path.resolve(global.staticRoot, `./multimedia/ts/${vId}/subtitle`);
                }
            }
            
            if(fs.existsSync(p)){
                captionPath = p;
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
    },
}