
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
            vIds.push(path.basename(videoRoot));
        }    
    })

    console.log(vIds);
    extract(0);

    function extract(i){
        let vId = vIds[i];
        if(!vId)
            return;
        console.log(i, vId)
        let videoStorePath = path.resolve(__dirname, '../../static/multimedia/pristine_v/'+vId+'.mp4');

        if(fs.existsSync(videoStorePath)){
            extractAudio(videoStorePath, tsRoot + '/' + vId, function(){
                extract(++i);
            });
        }
    }
})

function extractAudio(videoStorePath, tsDir, fn){
    let target = `${tsDir}/audio.mp3`;
    if(fs.existsSync(target)){
        require('del').sync(target, {force: true});
    }

    let cmd = `ffmpeg -i ${videoStorePath} -q:a 0 -map a ${target}`;

    exec(cmd, function(error){
        if(error){
            console.log(error);
        }

        fn && fn();
    })
}