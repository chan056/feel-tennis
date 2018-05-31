
module.exports = function(src, dest, st, size, fn){
    const exec = require('child_process').exec;

    size = size || require('../constant').videoCoverSize;
    // ffmpeg -ss 00:10:00 -i "t.mp4" -y -f image2 -vframes 1 -s 200x100 test.jpg
    let screenshotCmd = `ffmpeg -ss ${st} -i ${src} -y -f image2 -vframes 1 -s ${size} ${dest}`;

    exec(screenshotCmd, function(err){
        if(err)
            console.log(err);

        fn && fn();
    });
}