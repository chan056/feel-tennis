const ffmpeg = require('fluent-ffmpeg');

var ffmpegInstance = ffmpeg({
    source: '3.mp4'
}).size('200x?');

// ffmpeg -i 3.mp4 -ss 4 -t 4 -r 10 -vf scale=136:240 3.gif -hide_banner

inputOptions = ['-ss 4', '-t 4', '-r 10', '-hide_banner'];
outputOptions = [];//'-vf scale=136:240'


end = function(){
    console.log('end')
}
error = function(){
    console.log(arguments)
}

output = `gif/3-${Date.now()}.gif`;

ffmpegInstance
    .inputOptions(inputOptions)
    .outputOptions(outputOptions)
    .on('end', end)
    .on('error', error)
    .output(output)
    .run();