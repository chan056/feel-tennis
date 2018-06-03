
// ffmpeg -hide_banner -y -i 2.mp4 -vf scale=w=1280:h=720:force_original_aspect_ratio=decrease -c:a aac -ar 48000 -c:v h264 -profile:v main -crf 20 -sc_threshold 0 -g 48 -keyint_min 48 -hls_time 4 -hls_playlist_type vod -b:v 2800k -maxrate 2996k -bufsize 4200k -b:a 128k -hls_segment_filename ts/720p_%03d.ts ts/720p.m3u8 &
// ffmpeg -hide_banner -y -i 2.mp4 -vf scale=w=1920:h=1080:force_original_aspect_ratio=decrease -c:a aac -ar 48000 -c:v h264 -profile:v main -crf 20 -sc_threshold 0 -g 48 -keyint_min 48 -hls_time 4 -hls_playlist_type vod -b:v 5000k -maxrate 5350k -bufsize 7500k -b:a 192k -hls_segment_filename ts/1080p_%03d.ts ts/1080p.m3u8

// ==========child_process============

const exec = require('child_process').exec;
const path = require('path');
const fs = require('fs');
const tool = require('../tools');

module.exports.storeSubtitle = storeSubtitle;
module.exports.execM3U = execM3U;
module.exports.screenShot = screenShot;
module.exports.dynamicPreview = dynamicPreview;
module.exports.watermark = watermark;

function execM3U(videoStorePath, tsDir){
    let multiResolution = {
        360: {scaleW: 640, scaleH: 360, bv: 800, maxrate: 856, bufsize: 1200, ba: 96},
        480: {scaleW: 842, scaleH: 480, bv: 1400, maxrate: 1498, bufsize: 2100, ba: 128},
        720: {scaleW: 1280, scaleH: 720, bv: 2800, maxrate: 2996, bufsize: 4200, ba:128},
        1280: {scaleW: 1920, scaleH: 1080, bv: 5000, maxrate: 5350, bufsize: 7500, ba: 192}
    }
    delete multiResolution[360];
    delete multiResolution[1280];

    // 复制一份多分辨率控制列表
    let sourcePlaylist = path.resolve(tsDir, '../playlist.m3u8');
    let targetPlaylist = path.resolve(tsDir, './_.m3u8');
    
    fs.readFile(sourcePlaylist, (err, data) => {
        fs.writeFile(targetPlaylist, data, (err) => {
            if (err) console.log(err);
            // console.log('The file has been saved!');
        });
    });

    // for(let i in multiResolution){
    //     let resolution = multiResolution[i];

    //     cut(resolution);
    // }

    cutVideo(480, function(){
        cutVideo(720);
    });

    function cutVideo(videoWidth, fn){
        resolution = multiResolution[videoWidth]
        let tsFile = path.resolve(tsDir, `./${videoWidth}p_%03d.ts`);
        let m3u8File = path.resolve(tsDir, `./${videoWidth}p.m3u8`);

        let cmd = `ffmpeg -hide_banner -y -i ${videoStorePath} -vf scale=w=${resolution.scaleW}:h=${resolution.scaleH}:force_original_aspect_ratio=decrease -c:a aac -ar 48000 -c:v h264 -profile:v main -crf 20 -sc_threshold 0 -g 48 -keyint_min 48 -hls_time 4 -hls_playlist_type vod -b:v ${resolution.bv}k -maxrate ${resolution.maxrate}k -bufsize ${resolution.bufsize}k -b:a ${resolution.ba}k -hls_segment_filename ${tsFile} ${m3u8File}`;

        exec(cmd, {maxBuffer: 1024 * 1024 * 1024}, function(error, stdout, stderr){
            if(error) {
                return console.error(error);
            }

            fn && fn();
        });
    }
}

function storeSubtitle(subtitleAbsPath, tsDir){
    if(!subtitleAbsPath)
        return;

    // 多字幕 todo
    let subtitleStorePath = path.resolve(tsDir, `./subtitle`);
    fs.rename(subtitleAbsPath, subtitleStorePath, function(){
        require('../tools').convertSrt2vtt(tsDir);
    });

    // function convertSrt2vtt(srtPath){
    //     var fs = require('fs');
    //     var srt2vtt = require('srt2vtt');

    //     fs.exists(srtPath, function(doExist){
    //         if(doExist){
    //             var srtData = fs.readFileSync(srtPath);
    //             srt2vtt(srtData, function(err, vttData) {
    //                 if (err) throw new Error(err);
        
    //                 var storePos = path.resolve(tsDir, 'subtitle.vtt');
    //                 fs.writeFileSync(storePos, vttData);
    //             });
    //         }
    //     })
    // }
}

function screenShot (videoStorePath, tsDir){

    let vDurationCmd = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${videoStorePath}`;

    exec(vDurationCmd, function(error, duration){
        if(error){
            console.log(error);
        }

        require('./screenshot')(
            videoStorePath,
            path.resolve(tsDir, './cover.jpg'),
            tool.formatTime(duration/2)
        );
    });

}

// 动态预览
function dynamicPreview(videoStorePath, tsDir, vId){
    let vDurationCmd = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${videoStorePath}`;
    let CONSTANTS = require('../constant');

    exec(vDurationCmd, function(error, duration){
        if(error){
            console.log(error);
        }

        let gifModule = require('./dynamic_preview')({
            vId: vId,
            st: duration / 2,
            et: duration / 2 + CONSTANTS.dynamicPreview.duration,
            scale: CONSTANTS.dynamicPreview.width,
            output: tsDir + '/d_cover.gif',
        })
    })
}

// 水印
function watermark (videoStorePath, fn){
    let videoStorePathObj = path.parse(videoStorePath);
    let outputVideoPath = path.dirname(videoStorePath) + `/${videoStorePathObj.name}.copy${videoStorePathObj.ext}`;

    if(fs.existsSync(outputVideoPath)) {  
        fs.unlinkSync(outputVideoPath);  
    }

    let logo = path.resolve(__dirname, '../../static/img/site.jpg');

    let cmd =  `ffmpeg -i ${videoStorePath} -framerate 30000/1001 -loop 1 -i ${logo} -filter_complex "[1:v] fade=out:st=30:d=1:alpha=1 [ov]; [0:v][ov] overlay=W-w-35:35 [v]" -map "[v]" -map 0:a -c:v libx264 -c:a copy -shortest ${outputVideoPath}`;

    console.log('watermarking ........')
    exec(cmd, function(error, duration){
        if(error){
            console.log(error);
        }

        fs.renameSync(outputVideoPath, videoStorePath);

        console.log('watermark done........')

        fn && fn();
    })
}