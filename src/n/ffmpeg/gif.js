module.exports.createDynamicPreview = function(captureParams, res, req){
    let videoName = captureParams.vId,
        st = captureParams.st,
        et = captureParams.et,
        duration = et - st,
        scale = captureParams.scale || 400;
        now = Date.now();

    let output = captureParams.output;
    if(req){// 用户截图
        output = dir + `/multimedia/gif/${videoName}-${now}.gif`;
    }

    captureParams.ext = captureParams.ext || '.mp4';

    if(res && duration > require('../constant').gifMaxDuration){
        return res.end('fail');
    }

    if(res && (videoName === undefined || st === undefined || et === undefined))
        return res.end('fail');

    let path = require('path');
    const exec = require('child_process').exec;
    
    let dir = path.resolve(__dirname, '../../static')
    let vSouce = dir + `/multimedia/pristine_v/${videoName}${captureParams.ext}`;
    let outputPallete = dir + `/multimedia/gif/palette-${now}.png`;
   

    let paletteCmd = `ffmpeg -ss ${st} -t ${duration} -i ${vSouce} -vf fps=15,scale=${scale}:-1:flags=lanczos,palettegen ${outputPallete}`;
    let gifShotCmd = `ffmpeg -ss ${st} -t ${duration} -i ${vSouce} -i ${outputPallete} -filter_complex "fps=15,scale=${scale}:-1:flags=lanczos[x];[x][1:v] paletteuse" ${output}`;

    exec(paletteCmd, function(err){
        if(err)
            return console.log(err);

        exec(gifShotCmd, function(err){
            if(err)
                return console.log(err);
            
            if(req){// 用户截图
                let gifFilename = `${videoName}-${now}`;
                output = output.match(/\/multimedia\S+$/);
                let conn = require('../db/connect.js').conn;
                let sql = `insert into usr_screenshot_star (usr_id, screenshot) values (${req.usrInfo.usrId}, '${gifFilename}')`;
                console.log(sql);
                conn.query(sql, function(err, result){
                    if(err)
                        console.log(err);
                });
                // 存储到
                return res.end(output[0]);
            }
            
        });
    });
}