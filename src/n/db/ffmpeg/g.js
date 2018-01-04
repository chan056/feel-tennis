module.exports.ff = function(capturtParams, res){
    let videoName = capturtParams.vId,
        st = capturtParams.st,
        et = capturtParams.et,
        duration = et - st;

    if(videoName === undefined || st === undefined || et === undefined)
        return res.end('fail');

    const ffmpeg = require('fluent-ffmpeg');

    let path = require('path');
    let dir = path.resolve(__dirname, '../../../static')

    let vSouce = dir + `/multimedia/pristine_v/${videoName}.mp4`;// todo 视频格式不是固定的

    let outputPallete = dir + '/multimedia/gif/palette.png';
    let outputGif = dir + `/multimedia/gif/${videoName}-${Date.now()}.gif`;

    paletteInputOptions = [`-ss ${st}`, `-t ${duration}`, '-r 10', '-hide_banner', '-y'];
    paletteOutputOptions = ['-vf fps=10,scale=400:-1:flags=lanczos,palettegen'];

    gifInputOptions = [`-ss ${st}`, `-t ${duration}`, '-r 10', '-hide_banner', '-y'];
    gifOutputOptions = [`-i ${outputPallete}`,'-filter_complex fps=10,scale=400:-1:flags=lanczos[x];[x][1:v]paletteuse'];

    let error = function(){
        console.log(arguments[0])
    }

    let end = function(){
        console.log('palettegen end');

        ffmpeg({
            source: vSouce
        }).inputOptions(gifInputOptions)
            .outputOptions(gifOutputOptions)
            .on('end', function(){
                console.log('gif end');
                outputGif = outputGif.match(/\/multimedia\S+$/);

                if(outputGif)
                    return res.end(outputGif[0]);
                else
                    return res.end('fail');
            })
            .on('error', error)
            .output(outputGif)
            .run();
    }

    ffmpeg({
        source: vSouce
    }).inputOptions(paletteInputOptions)
        .outputOptions(paletteOutputOptions)
        .on('end', end)
        .on('error', error)
        .output(outputPallete)
        .run();
}