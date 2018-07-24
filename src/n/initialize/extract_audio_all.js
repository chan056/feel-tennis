
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const videoIterator = require('./iterate_video.js');

videoIterator(function extractAudio(videoStorePath, tsDir, fn){
    let target = `${tsDir}/audio.mp3`;
    if(fs.existsSync(target)){
        fn && fn();
        return;
    }

    console.log(videoStorePath)

    let cmd = `ffmpeg -i ${videoStorePath} -q:a 0 -map a ${target}`;

    exec(cmd, function(error){
        if(error){
            console.log(error);
        }

        fn && fn();
    })
})