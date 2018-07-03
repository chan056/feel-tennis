
var fs = require('fs');
var path = require('path');
const exec = require('child_process').exec;

var tsRoot = path.resolve(__dirname, '../../static/multimedia/ts');

fs.readdir(tsRoot, function(err, files){
    let vIds = [];
    files.forEach(function(file){
        var videoRoot = path.resolve(tsRoot, file)
        let stat = fs.statSync(videoRoot);
        if(stat.isDirectory()){
            p480(videoRoot)
        }    
    })

    function p480(videoRoot){
        // 复制一份多分辨率控制列表
        let sourcePlaylist = path.resolve(tsRoot, './playlist.480.m3u8');
        let targetPlaylist = path.resolve(videoRoot, './_.480p.m3u8');
        
        fs.readFile(sourcePlaylist, (err, data) => {
            fs.writeFile(targetPlaylist, data, (err) => {
                if (err) console.log(err);
            });
        });
    }
})

// function extractAudio(videoStorePath, tsDir, fn){
//     let target = `${tsDir}/audio.mp3`;
//     if(fs.existsSync(target)){
//         fn && fn();
//         return;
//         // require('del').sync(target, {force: true});
//     }

//     console.log(videoStorePath)

//     let cmd = `ffmpeg -i ${videoStorePath} -q:a 0 -map a ${target}`;

//     exec(cmd, function(error){
//         if(error){
//             console.log(error);
//         }

//         fn && fn();
//     })
// }