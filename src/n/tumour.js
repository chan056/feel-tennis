module.exports = {
    joinIndexJS: function(req, res){
        var path = require('path');
        const fs = require('fs');
        let NodeSession = require('node-session');
    	let session = new NodeSession({secret: 'Q3UBzdH9GEfiRCTKbi5MTPyChpzXLsTD'});

		// 读取文件的过程 异步
		session.startSession(req, res, function(){
            let usr = req.session.get('usr');
            console.log('login user id:' + usr);
            if(usr){
                let conn = require('./db/connect.js').conn;

                conn.query(`select * from usr where id = ${usr}`, function(err, result){
                    if(err) throw err;

                    if(result && result[0]){
                        if(result[0].isAdmin == 1){
                            var concat = require('concat-files');
                    
                            let dir = path.resolve(__dirname, '../static');
                            let f1 = dir + '/js/admin.js';
                            let f2 = dir + '/js/tube.js';
                            let tmp = dir + '/js/tmp.js'

                            concat([
                                f1,
                                f2
                            ], tmp, function(err) {
                                if (err) throw err;

                                fs.readFile(tmp, "binary", function(err, file) {
                                    res.write(file, "binary");
                                    res.end();
                                });
                            });
                        }
                    }
                });
            }else{
                retOnlyTube();
            }
        });

        function retOnlyTube(){
            let tubePath = path.resolve(__dirname, '../static') + '/js/tube.js';
            fs.readFile(tubePath, "binary", function(err, file) {
                res.write(file, "binary");
                res.end();
            });
        }
	},
}