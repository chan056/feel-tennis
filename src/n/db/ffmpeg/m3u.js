/* ffmpeg -hide_banner -y -i 2.mp4 -vf scale=w=842:h=480:force_original_aspect_ratio=decrease -c:a aac -ar 48000 -c:v h264 -profile:v main -crf 20 -sc_threshold 0 -g 48 -keyint_min 48 -hls_time 4 -hls_playlist_type vod -b:v 1400k -maxrate 1498k -bufsize 2100k -b:a 128k -hls_segment_filename ts/480p_%03d.ts ts/480p.m3u8
ffmpeg -hide_banner -y -i 2.mp4 -vf scale=w=1280:h=720:force_original_aspect_ratio=decrease -c:a aac -ar 48000 -c:v h264 -profile:v main -crf 20 -sc_threshold 0 -g 48 -keyint_min 48 -hls_time 4 -hls_playlist_type vod -b:v 2800k -maxrate 2996k -bufsize 4200k -b:a 128k -hls_segment_filename ts/720p_%03d.ts ts/720p.m3u8 */

// ==========child_process============
module.exports.m3u = function(vId, videoStorePath, subtitleAbsPath){
    const exec = require('child_process').exec;
    const path = require('path');
    const fs = require('fs');

    let dir = path.resolve(__dirname, '../../../static')
    // let vSouce = path.resolve(dir, `./multimedia/pristine_v/${vId}${videoExt}`);
    let tsDir = path.resolve(dir, `./multimedia/ts/${vId}`);

    fs.exists(tsDir, function(doExist){
        if(!doExist){
            fs.mkdir(tsDir, function(){
                execM3U();
                storeSubtitle();
            });
        }else{
            execM3U();
            storeSubtitle();
        }
    });

    function execM3U(){
        let sourcePlaylist = path.resolve(tsDir, '../playlist.m3u8');
        let targetPlaylist = path.resolve(tsDir, './_.m3u8');

        // 复制一份多分辨率控制列表
        fs.readFile(sourcePlaylist, (err, data) => {
            fs.writeFile(targetPlaylist, data, (err) => {
                if (err) throw err;
                console.log('The file has been saved!');
            });
        });

        let tsFile = path.resolve(tsDir, './480p_%03d.ts');
        let m3u8File = path.resolve(tsDir, './480p.m3u8');

        let cmd = `ffmpeg -hide_banner -y -i ${videoStorePath} -vf scale=w=842:h=480:force_original_aspect_ratio=decrease -c:a aac -ar 48000 -c:v h264 -profile:v main -crf 20 -sc_threshold 0 -g 48 -keyint_min 48 -hls_time 4 -hls_playlist_type vod -b:v 1400k -maxrate 1498k -bufsize 2100k -b:a 128k -hls_segment_filename ${tsFile} ${m3u8File}`;

        exec(cmd, function(error, stdout, stderr){
            if(error) {
                console.error('error: ' + error);
                return;
            }
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + typeof stderr);
        });
    }

    function storeSubtitle(){
        // 多字幕 todo
        let subtitleStorePath = path.resolve(tsDir, `./subtitle`);
        fs.rename(subtitleAbsPath, subtitleStorePath);
    }
}

/* #EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360
360p.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=1400000,RESOLUTION=842x480
480p.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=2800000,RESOLUTION=1280x720
720p.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080
1080p.m3u8 */
// console.log(tsDir,tsFile,m3u8File, cmd);


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