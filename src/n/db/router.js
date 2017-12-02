var r =  require('./operate');

var routerConfig = {
    '/sports': function(params, response){
        r.operate('querySport', params, response);
    },

    '/albums': function(params, response){
        r.operate('queryAlbumList', params, response);
    },

    '/sports/:sport_id/albums': function(params, response){
        r.operate('queryAlbumList', params, response);
    },
    
    '/albums/:album_id/videos': function(params, response){
        r.operate('queryAlbum', params, response);
    },
    
    '/videos/:album_id': function(params, response){
        r.operate('queryVideo', params, response);
    },

    '/upload/:type': function(){
        let type = '';
        // create an incoming form object
        let form = new formidable.IncomingForm();
        let absPath = '',
            relPath = '';
        
        // specify that we want to allow the user to upload multiple files in a single request
        form.multiples = true;
    
        // store all uploads in the /uploads directory
        form.uploadDir = path.join(__dirname, "src/static", '/uploads');
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
    
        // once all the files have been uploaded, send a response to the client
        form.on('end', function() {
            var d = {
                absPath: absPath,
                relPath: relPath
            }
            response.end(JSON.stringify(d));
        });
    
        // parse the incoming request containing the form data
        form.parse(request);
    },

    '/tags(/:sport_id)?': function(params, response){
        r.operate('queryTag', params, response);
    }
}

module.exports = routerConfig;