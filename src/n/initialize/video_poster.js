
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const videoIterator = require('./iterate_video.js');
const tool = require('../tools');

videoIterator(function posterVideo(videoStorePath, tsDir, fn){
    let target = `${tsDir}/poster.jpg`;
    if(fs.existsSync(target)){
        fn && fn();
        return;
        // require('del').sync(target, {force: true});
    }

    console.log(videoStorePath)

    let vDurationCmd = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${videoStorePath}`;
    let vResolutionCmd = `ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 ${videoStorePath}`;
    let screenshot = require('../ffmpeg/screenshot');

    exec(vDurationCmd, function(error, duration){
        if(error){
            console.log(error);
        }

        exec(vResolutionCmd, function(error, resolution){
            if(error){
                console.log(error);
            }
    
            resolution = resolution.trim();

            screenshot(
                videoStorePath,
                path.resolve(tsDir, './poster.jpg'),
                tool.formatTime(duration/2),
                resolution,
                fn
            );
        });
    });
})

