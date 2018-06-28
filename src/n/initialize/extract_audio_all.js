
var fs = require('fs');
var path = require('path');

var root = path.resolve(__dirname, '../../static/multimedia/ts');

fs.readdir(root, function(err, files){
    files.forEach(function(file){
        var videoRoot = path.resolve(root, file)
        fs.stat(videoRoot, function(err, stats){
            if(stats.isDirectory()){
                let vId = path.basename(videoRoot);
                let videoStorePath = path.resolve(__dirname, '../../static/multimedia/pristine_v/'+vId+'.mp4');

                extractAudio(videoStorePath, root + '/' + vId);
            }
        })
    })
})

function extractAudio(videoStorePath, tsDir){
    let cmd = `ffmpeg -i ${videoStorePath} -q:a 0 -map a ${tsDir}/audio.mp3`;

    require('child_process').exec(cmd, function(error){
        if(error){
            console.log(error);
        }

        console.log(videoStorePath)
    })
}