
var fs = require('fs');
var path = require('path');
const tsRoot = path.resolve(__dirname, '../../static/multimedia/ts');

module.exports  = function(fn){
    fs.readdir(tsRoot, function(err, files){
        let vIds = [];
        files.forEach(function(file){
            var videoRoot = path.resolve(tsRoot, file)
            let stat = fs.statSync(videoRoot);
            if(stat.isDirectory()){
                vIds.push(path.basename(videoRoot));
            }    
        })

        iterator(0);

        function iterator(i){
            let vId = vIds[i];
            if(!vId)
                return;
            
            let videoStorePath = path.resolve(tsRoot, `../pristine_v/${vId}.mp4`);

            if(fs.existsSync(videoStorePath)){
                fn(videoStorePath, tsRoot + '/' + vId, function(){
                    iterator(++i);
                });
            }else{
                iterator(++i);
            }
        }
    })
}
