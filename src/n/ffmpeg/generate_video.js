
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
module.exports.extractAudio = extractAudio;

function execM3U(videoStorePath, tsDir, specifiedResolution){
    let multiResolution = {
        360: {scaleW: 640, scaleH: 360, bv: 800, maxrate: 856, bufsize: 1200, ba: 96},
        480: {scaleW: 842, scaleH: 480, bv: 1400, maxrate: 1498, bufsize: 2100, ba: 128},
        720: {scaleW: 1280, scaleH: 720, bv: 2800, maxrate: 2996, bufsize: 4200, ba:128},
        1280: {scaleW: 1920, scaleH: 1080, bv: 5000, maxrate: 5350, bufsize: 7500, ba: 192}
    }

    if(!specifiedResolution){
        delete multiResolution[360];
        delete multiResolution[1280];
    
        // 复制一份多分辨率控制列表
        let sourcePlaylist = path.resolve(tsDir, '../playlist.m3u8');
        let targetPlaylist = path.resolve(tsDir, './_.m3u8');
        
        fs.readFile(sourcePlaylist, (err, data) => {
            fs.writeFile(targetPlaylist, data, (err) => {
                if (err) console.log(err);
            });
        });
    
        let resolutions = [];
        for(let i in multiResolution){
            resolutions.push(i);
        }

        let index = 0;
        cutVideo(resolutions[index], function(){
            ++index;
            resolutions[index] && cutVideo(resolutions[index])
        })
    }else{
        cutVideo(specifiedResolution);
    }

    function cutVideo(videoWidth, fn){
        let resolution = multiResolution[videoWidth]
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

}

function screenShot (videoStorePath, tsDir){

    let vDurationCmd = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${videoStorePath}`;
    let vResolutionCmd = `ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 ${videoStorePath}`;
    let screenshot = require('./screenshot');

    exec(vDurationCmd, function(error, duration){
        if(error){
            console.log(error);
        }

        screenshot(
            videoStorePath,
            path.resolve(tsDir, './cover.jpg'),
            tool.formatTime(duration/2)
        );

        exec(vResolutionCmd, function(error, resolution){
            if(error){
                console.log(error);
            }
    
            resolution = resolution.trim();

            screenshot(
                videoStorePath,
                path.resolve(tsDir, './poster.jpg'),
                tool.formatTime(duration/2),
                resolution
            );
        });
    });
}

// 动态预览
function dynamicPreview(videoStorePath, tsDir, vId, fn){
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

        fn && fn(duration)
    })
}

// 水印
function watermark (videoStorePath, fn){
    let videoStorePathObj = path.parse(videoStorePath);
    let outputVideoPath = path.resolve(
        path.dirname(videoStorePath),
        `${videoStorePathObj.name}.copy${videoStorePathObj.ext}`
    );

    if(fs.existsSync(outputVideoPath)) {  
        fs.unlinkSync(outputVideoPath);  
    }

    let logo = path.resolve(global.staticRoot, './img/site.jpg');

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

// 分离音频
function extractAudio(videoStorePath, tsDir){
    let cmd = `ffmpeg -i ${videoStorePath} -q:a 0 -map a ${tsDir}/audio.mp3`;

    exec(cmd, function(error){
        if(error){
            console.log(error);
        }
    })
}

// 随机打水印
// fs.readdir(tsDir, function(err, files){
//     let tss = 0;
//     files.forEach(function(file){
//         if(file.split('.').pop() == 'ts'){
//             tss++;
//         }
//     });

//     const R = Math.floor(Math.random() * tss/2);
//     console.log(tss, R);
//     watermark(path.resolve(tsDir, path.resolve(tsDir, `480p_00${R}.ts`)));
//     watermark(path.resolve(tsDir, path.resolve(tsDir, `720p_00${R}.ts`)));
// })