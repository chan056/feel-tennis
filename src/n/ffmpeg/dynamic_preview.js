// res req 只有在用户视频功能中才有
// 视频上传生成视频预览时没有
module.exports = function(captureParams, res, req){
    let videoName = captureParams.vId,
        st = captureParams.st,
        et = captureParams.et,
        duration = et - st,
        scale = captureParams.scale || 400;
        now = Date.now();

    captureParams.ext = captureParams.ext || '.mp4';

    if(videoName === undefined || st === undefined || et === undefined)
        responseError();

    if(et <= st)
        responseError();

    if(duration > require('../constant').gifMaxDuration)
        responseError();

    let path = require('path');
    const exec = require('child_process').exec;
    
    let dir = global.staticRoot;
    let vSouce = dir + `/multimedia/pristine_v/${videoName}${captureParams.ext}`;
    let outputPallete = dir + `/multimedia/gif/palette-${now}.png`;
    let output = captureParams.output;
    if(req){// 用户截图
        output = dir + `/multimedia/gif/${videoName}-${now}.gif`;
    }

    let paletteCmd = `ffmpeg -ss ${st} -t ${duration} -i ${vSouce} -vf fps=15,scale=${scale}:-1:flags=lanczos,palettegen ${outputPallete}`;
    let gifShotCmd = `ffmpeg -ss ${st} -t ${duration} -i ${vSouce} -i ${outputPallete} -filter_complex "fps=15,scale=${scale}:-1:flags=lanczos[x];[x][1:v] paletteuse" ${output}`;

    exec(paletteCmd, function(err){
        if(err)
            return console.log(err);

        exec(gifShotCmd, function(err){
            if(err)
                return console.log(err);
            
            let gifFilename = `${videoName}-${now}`;
            output = output.match(/\/multimedia\S+$/);

            if(req && res){// 用户截图
                let conn = require('../db/connect.js').conn;
                let sql = `insert into usr_screenshot_star (usr_id, screenshot, v_id) values (${req.usrInfo.usrId}, '${gifFilename}', ${videoName}), 1`;
                conn.query(sql, function(err, result){
                    if(err)
                        console.log(err);
                });

                return res.end(output[0]);

                require('./screenshot')(
                    vSouce,
                    `${dir}/multimedia/gif/${videoName}-${now}.jpg`,
                    st
                );
            }
        });
    });

    function responseError(){
        if(res){
            res.statusCode = 402;
            res.end();
        }
    }
}