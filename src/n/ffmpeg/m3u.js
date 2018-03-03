
// ffmpeg -hide_banner -y -i 2.mp4 -vf scale=w=1280:h=720:force_original_aspect_ratio=decrease -c:a aac -ar 48000 -c:v h264 -profile:v main -crf 20 -sc_threshold 0 -g 48 -keyint_min 48 -hls_time 4 -hls_playlist_type vod -b:v 2800k -maxrate 2996k -bufsize 4200k -b:a 128k -hls_segment_filename ts/720p_%03d.ts ts/720p.m3u8 &
// ffmpeg -hide_banner -y -i 2.mp4 -vf scale=w=1920:h=1080:force_original_aspect_ratio=decrease -c:a aac -ar 48000 -c:v h264 -profile:v main -crf 20 -sc_threshold 0 -g 48 -keyint_min 48 -hls_time 4 -hls_playlist_type vod -b:v 5000k -maxrate 5350k -bufsize 7500k -b:a 192k -hls_segment_filename ts/1080p_%03d.ts ts/1080p.m3u8

// ==========child_process============
module.exports.m3u = function(vId, videoStorePath, subtitleAbsPath){
    const exec = require('child_process').exec;
    const path = require('path');
    const fs = require('fs');
    const tool = require('../tools');

    let coveSize = '210x118';// 视频截图尺寸

    let multiResolution = {
        360: {scaleW: 640, scaleH: 360, bv: 800, maxrate: 856, bufsize: 1200, ba: 96},
        480: {scaleW: 842, scaleH: 480, bv: 1400, maxrate: 1498, bufsize: 2100, ba: 128},
        720: {scaleW: 1280, scaleH: 720, bv: 2800, maxrate: 2996, bufsize: 4200, ba:128},
        1280: {scaleW: 1920, scaleH: 1080, bv: 5000, maxrate: 5350, bufsize: 7500, ba: 192}
    }
    delete multiResolution[360];
    delete multiResolution[1280];

    let dir = path.resolve(__dirname, '../../static')
    let tsDir = path.resolve(dir, `./multimedia/ts/${vId}`);

    fs.exists(tsDir, function(doExist){
        if(!doExist){
            fs.mkdirSync(tsDir, 0777);

            execM3U();
            storeSubtitle();
            screenShot();
            dynamicPreview();
        }else{
            execM3U();
            storeSubtitle();
            screenShot();
            dynamicPreview();
        }
    });

    function execM3U(){
        // 复制一份多分辨率控制列表
        let sourcePlaylist = path.resolve(tsDir, '../playlist.m3u8');
        let targetPlaylist = path.resolve(tsDir, './_.m3u8');
        
        fs.readFile(sourcePlaylist, (err, data) => {
            fs.writeFile(targetPlaylist, data, (err) => {
                if (err) throw err;
                console.log('The file has been saved!');
            });
        });

        for(let i in multiResolution){
            let resolution = multiResolution[i];

            let tsFile = path.resolve(tsDir, `./${i}p_%03d.ts`);
            let m3u8File = path.resolve(tsDir, `./${i}p.m3u8`);

            let cmd = `ffmpeg -hide_banner -y -i ${videoStorePath} -vf scale=w=${resolution.scaleW}:h=${resolution.scaleH}:force_original_aspect_ratio=decrease -c:a aac -ar 48000 -c:v h264 -profile:v main -crf 20 -sc_threshold 0 -g 48 -keyint_min 48 -hls_time 4 -hls_playlist_type vod -b:v ${resolution.bv}k -maxrate ${resolution.maxrate}k -bufsize ${resolution.bufsize}k -b:a ${resolution.ba}k -hls_segment_filename ${tsFile} ${m3u8File}`;

            console.log(cmd)

            exec(cmd, function(error, stdout, stderr){
                if(error) {
                    console.error('error: ' + error);
                    return;
                }
            });
        }
    }

    // 生成视频封面
    function generateVideoCover(){
        const exec = require('child_process').exec;
        let vDurationCmd = `coder$ ffprobe -show_format ${videoStorePath} | sed -n '/duration/s/.*=//p'`;
        let screenshotCmd = `ffmpeg -ss 00:10:00 -i ${videoStorePath} -y -f image2 -vframes 1 -s 210x118 cover.jpg`;

        exec(vDurationCmd, function(error, out){
            if(error){
                console.log(error);
            }

            console.log(out)
        })

    }

    function generatePreviewVideo(){
        
    }

    function storeSubtitle(){
        if(!subtitleAbsPath)
            return;

        // 多字幕 todo
        let subtitleStorePath = path.resolve(tsDir, `./subtitle`);
        fs.rename(subtitleAbsPath, subtitleStorePath);
    }

    function screenShot (){
    
        const exec = require('child_process').exec;
        let vDurationCmd = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${videoStorePath}`;
    
        exec(vDurationCmd, function(error, duration){
            if(error){
                console.log(error);
            }
    
            let coverPath = path.resolve(tsDir, './cover.jpg');
            let screenshotCmd = `ffmpeg -ss ${tool.formatTime(duration/2)} -i ${videoStorePath} -y -f image2 -vframes 1 -s ${coveSize} ${coverPath}`;
            exec(screenshotCmd, function(err){
                if(err){
                    console.log(err);
                }
            });
        })
        
    }

    // 动态预览
    function dynamicPreview(){
        const exec = require('child_process').exec;
        let vDurationCmd = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${videoStorePath}`;
        let CONSTANTS = require('../constant');
    
        exec(vDurationCmd, function(error, duration){
            if(error){
                console.log(error);
            }
    
            let gifModule = require('./gif');

            gifModule.createDynamicPreview({
                vId: vId,
                st: duration / 2,
                et: duration / 2 + CONSTANTS.dynamicPreview.duration,
                scale: CONSTANTS.dynamicPreview.width,
                output: tsDir + '/d_cover.gif',
            });
        })
    }
}


// ==========child_process spawn============
// let ff = spawn(`ffmpeg`, [
//     '-hide_banner', 
//     '-y', 
//     `-i ${vSouce}`,
//     '-vf scale=w=842:h=480:force_original_aspect_ratio=decrease',
//     '-c:a aac', 
//     '-ar 48000', 
//     '-c:v h264', 
//     '-profile:v main',
//     '-crf 20',
//     '-sc_threshold 0',
//     '-g 48',
//     '-keyint_min 48',
//     '-hls_time 4',
//     '-hls_playlist_type vod',
//     '-b:v 1400k',
//     '-maxrate 1498k',
//     '-bufsize 2100k',
//     '-b:a 128k',
//     `-hls_segment_filename ${tsDir}`,
//     `${tsDir}/480p.m3u8`
// ]);

// ff.stdout.on('data', (data) => {
// console.log(`输出`);
// });

// ff.stderr.on('data', (data) => {
// console.log(`错误：${data}`);
// });

// ff.on('close', (code) => {
// console.log(`子进程退出码：${code}`);
// });

// ==========fluent-ffmpeg============
/* const ffmpeg = require('fluent-ffmpeg');
let path = require('path');

let dir = path.resolve(__dirname, '../../../static');
const filename = '1';
let vSouce = dir + `/upload/${filename}.mp4`;
let outputDir = dir + `/multimedia/ts/${filename}`;

let inputOptions = [`-hide_banner`, `-y`];
let outputOptions480 = [`-vf scale=w=842:h=480:force_original_aspect_ratio=decrease`, `-c:a aac`, `-ar 48000`, `-c:v h264`, `-profile:v main`, `-crf 20`, `-sc_threshold 0`, `-g 48`, `-keyint_min 48`, `-hls_time 4`, `-hls_playlist_type vod`, `-b:v 1400k`, `-maxrate 1498k`, `-bufsize 2100k`, `-b:a 128k`, `-segment_list "ts/480p.m3u8"`, `-segment_list_type m3u8`];

let outputOptions720 = [`-vf scale=w=1280:h=720:force_original_aspect_ratio=decrease`, `-c:a aac`, `-ar 48000`, `-c:v h264`, `-profile:v main`, `-crf 20`, `-sc_threshold 0`, `-g 48`, `-keyint_min 48`, `-hls_time 4`, `-hls_playlist_type vod`, `-b:v 2800k`, `-maxrate 2996k`, `-bufsize 4200k`, `-b:a 128k`, `-hls_segment_filename 720p_%03d.ts 720p.m3u8`]

ffmpeg({
    source: vSouce
}).inputOptions(inputOptions)
    .outputOptions(outputOptions480)
    .on('end', end)
    .on('error', error)
    .output('./ts/480p_%03d.ts')
    .run();

ffmpeg({
    source: vSouce
}).inputOptions(inputOptions)
    .outputOptions(outputOptions720)
    .on('end', end)
    .on('error', error)
    .output(outputDir)
    .run();

function end(){
    console.log('success', arguments)
}

function error(){
    console.log('err', arguments)
} */