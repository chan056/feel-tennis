var r =  require('./operate');

var routerConfig = {
    '/sports': function(params, res){
        r.query('querySports', params, res);
    },

    '/sports/:id': function(params, res){
        r.query('querySport', params, res);tag
    },

    '/albums': function(params, res){
        r.query('queryAlbumList', params, res);
    },

    '/sports/:sport_id/albums': function(params, res){
        r.query('queryAlbumList', params, res);
    },
    
    '/albums/:album_id/videos': function(params, res){
        r.query('queryAlbum', params, res);
    },
    
    '/videos/:album_id': function(params, res){
        r.query('queryVideo', params, res);
    },

    '/tags(/:sport_id)?': function(params, res){
        r.query('queryTag', params, res);
    },

    '/albumTags/:albumId': function(params, res){
        let sql = `select tag from album where id=` + params.albumId;
        r.excuteSQL(sql, res, function(data){
            // data = JSON.stringify(data);
            let tagObj = data[0];
            if(tagObj && tagObj.tag){
                sql = 'select * from tag where id in (' + tagObj.tag + ')';
                r.excuteSQL(sql, res);
            }
        });
    },

    '/videoTags/:videoId': function(params, res){
        let sql = `select tag from video where id=` + params.videoId;
        r.excuteSQL(sql, res, function(data){
            // data = JSON.stringify(data);
            let tagObj = data[0];
            if(tagObj && tagObj.tag){
                sql = 'select * from tag where id in (' + tagObj.tag + ')';
                r.excuteSQL(sql, res);
            }
        });
    },

    // 收集所有和导航有关信息
    // 根据 sportId albumId videoId
    '/navInfo/:depth/:id': function(params, res){
        if(params.depth == 1){
            r.query('querySport', {id: params.id}, res);
        }else if(params.depth == 2){
            let sql = `SELECT
                    a.id AS aId ,
                    a. NAME AS aName ,
                    s.id AS sId,
                    s.NAME as sName
                FROM
                    album AS a ,
                    sport AS s
                WHERE
                    a.sport_id = s.id
                AND a.id = ` + params.id;

                r.excuteSQL(sql, res);
        }else if(params.depth == 3){
            let sql = `SELECT
                v.id AS vId,
                v.headline AS vHeadline,
                a.id AS aId ,
                a. NAME AS aName ,
                s.id AS sId,
                s.NAME as sName
            FROM
                video as v,
                album AS a ,
                sport AS s
            WHERE
                a.sport_id = s.id
                AND
                v.album_id = a.id
                AND 
                v.id = ` + params.id;
            
                r.excuteSQL(sql, res);
        }
        // console.log(params);
    },

    // POST
    '/video': function(res, req){

        // if(req.method.toLowerCase() == 'post'){
        //     var formidable = require('formidable');

        //     var form = new formidable.IncomingForm();

        //     form.parse(req, function(err, fields, files){
        //         r.post('creatVedio', fields, res, 'post');
        //     });
        // }
        r.post('creatVedio', req, res);
    },

    '/tag': function(res, req){
        
        // if(req.method.toLowerCase() == 'post'){
        //     var formidable = require('formidable');

        //       var form = new formidable.IncomingForm();

        //     form.parse(req, function(err, fields, files){
        //         r.post('creatTag', fields, res, 'post');
        //   });
        // }
        
        r.post('creatTag', req, res);
    },

    // POST 上传文件
    '/upload': function(res, req){
        var formidable = require('formidable');
        var path = require('path');
        var fs = require('fs');

        // create an incoming form object
        let form = new formidable.IncomingForm();
        let absPath = '',
            relPath = '';
        
        // specify that we want to allow the user to upload multiple files in a single request
        form.multiples = true;
    
        // store all uploads in the /uploads directory
        form.uploadDir = path.join(__dirname, "../../static", '/upload');
        let uploadDir = '/upload';
    
        // every time a file has been uploaded successfully,
        // rename it to it's orignal name
        form.on('file', function(field, file) {
            absPath = path.join(form.uploadDir, file.name);
            relPath = path.join(uploadDir, file.name);

            fs.rename(file.path, absPath);
        });

        form.on('field', function(){
            console.log(arguments);
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