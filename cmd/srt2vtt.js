
// 复制m3u8
var fs = require('fs');
var path = require('path');

var root = path.resolve(__dirname, '../src/static/multimedia/ts');

fs.readdir(root, function(err, files){
    files.forEach(function(file){
        var videoRoot = path.resolve(root, file)
        fs.stat(videoRoot, function(err, stats){
            if(stats.isDirectory()){
                convertSrt2vtt(videoRoot);
                copyM3u8(videoRoot);
            }
        })
    })
})

function convertSrt2vtt(r){
    srtPath = path.resolve(r, './subtitle');
    var srt2vtt = require('srt2vtt');

    var srtData = fs.readFileSync(srtPath);
    srt2vtt(srtData, function(err, vttData) {
        if (err) throw new Error(err);
            
        var storePos = path.resolve(r, 'subtitle.vtt')
        fs.writeFileSync(storePos, vttData);
    });
}

function copyM3u8(storeRoot){
    // 复制一份多分辨率控制列表
    let sourcePlaylist = path.resolve(root, './playlist.m3u8');
    let targetPlaylist = path.resolve(storeRoot, './_.m3u8');
    
    fs.readFile(sourcePlaylist, (err, data) => {
        fs.writeFileSync(targetPlaylist, data);
    });
}