module.exports.createDynamicPreview = function(captureParams, res){
    let videoName = captureParams.vId,
        st = captureParams.st,
        et = captureParams.et,
        duration = et - st,
        scale = captureParams.scale || 400;
        now = Date.now();

    let isCover = 0;// 区分 gif 的用途 0 用户截图 1 视频封面
    let output = captureParams.output;
    if(output){
        isCover = 1;
    }

    captureParams.ext = captureParams.ext || '.mp4';

    if(duration > require('../constant').gifMaxDuration){
        return res.end('fail');
    }

    if(videoName === undefined || st === undefined || et === undefined)
        return res.end('fail');

    let path = require('path');
    const exec = require('child_process').exec;
    
    let dir = path.resolve(__dirname, '../../static')
    let vSouce = dir + `/multimedia/pristine_v/${videoName}${captureParams.ext}`;
    let outputPallete = dir + `/multimedia/gif/palette-${now}.png`;
    if(!isCover)
        output = dir + `/multimedia/gif/${videoName}-${now}.gif`;

    let paletteCmd = `ffmpeg -ss ${st} -t ${duration} -i ${vSouce} -vf fps=15,scale=${scale}:-1:flags=lanczos,palettegen ${outputPallete}`;
    let gifShotCmd = `ffmpeg -ss ${st} -t ${duration} -i ${vSouce} -i ${outputPallete} -filter_complex "fps=15,scale=${scale}:-1:flags=lanczos[x];[x][1:v] paletteuse" ${output}`;

    exec(paletteCmd, function(err){
        if(err)
            return console.log(err);

        exec(gifShotCmd, function(err){
            if(err)
                return console.log(err);
            
            if(!isCover){
                output = output.match(/\/multimedia\S+$/);
                return res.end(output[0]);    
            }
            
        });
    });
}