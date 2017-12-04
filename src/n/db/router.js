var r =  require('./operate');

var routerConfig = {
    '/sports': function(params, res){
        r.operate('querySport', params, res);
    },

    '/albums': function(params, res){
        r.operate('queryAlbumList', params, res);
    },

    '/sports/:sport_id/albums': function(params, res){
        r.operate('queryAlbumList', params, res);
    },
    
    '/albums/:album_id/videos': function(params, res){
        r.operate('queryAlbum', params, res);
    },
    
    '/videos/:album_id': function(params, res){
        r.operate('queryVideo', params, res);
    },

    '/tags(/:sport_id)?': function(params, res){
        r.operate('queryTag', params, res);
    },

    // POST
    '/video': function(res, req){
        if(req.method.toLowerCase() == 'post'){
            var formidable = require('formidable');

            var form = new formidable.IncomingForm();

            form.parse(req, function(err, fields, files){
                r.operate('creatVedio', fields, res, 'post');
            });
        }
        
    },

    // POST 上传文件
    '/upload/:type': function(params, res, req){
        var formidable = require('formidable');
        var path = require('path');
        var fs = require('fs');

        let type = '';
        // create an incoming form object
        let form = new formidable.IncomingForm();
        let absPath = '',
            relPath = '';
        
        // specify that we want to allow the user to upload multiple files in a single request
        form.multiples = true;
    
        // store all uploads in the /uploads directory
        form.uploadDir = path.join(__dirname, "../../static", '/uploads');
        let uploadDir = '/uploads';
    
        // every time a file has been uploaded successfully,
        // rename it to it's orignal name
        form.on('file', function(field, file) {
            absPath = path.join(form.uploadDir, file.name);
            relPath = path.join(uploadDir, file.name);

            fs.rename(file.path, absPath);
        });
    
        // log any errors that occur
        form.on('error', function(err) {
            console.log('An error has occured: \n' + err);
        });
    
        // once all the files have been uploaded, send a request to the client
        form.on('end', function() {
            var d = {
                absPath: absPath,
                relPath: relPath
            }
            res.end(JSON.stringify(d));
        });
    
        // parse the incoming request containing the form data
        form.parse(req);
    },

    
}

module.exports = routerConfig;