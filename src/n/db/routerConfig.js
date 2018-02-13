let r =  require('./operate');
let tools = require('../tool');

const routerConfig = {
    '/sports': function(params, res){
        r.query('querySports', params, res);
    },

    '/sports/:id': function(params, res){
        r.query('querySport', params, res);
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
    
    // 根据video id 查询某个视频
    '/videos/:id': function(params, res){
        r.query('queryVideo', params, res);
    },

    '/makers': function(params, res){
        r.query('queryMakers', params, res);
    },

    '/maker/:id': function(params, res){
        r.query('queryMaker', params, res);
    },
    // 根据video id 查询某个视频
    // '/videos/:id': function(params, res){
    //     r.query('queryVideo', params, res);
    // },

    // 根据关键字搜索视频
    '/videos': function(params, res){
        let sql = `select * from video`;

        if(params && !tools.isEmpty(params)){
            sql += ' where';
        }

        var clauses = [];
        if(params.tagId){
            clauses.push(`CONCAT(',',tag,',')  like '%,` + params.tagId + `,%'`)
            delete params.tagId;
        }

        if(params.headline){
            clauses.push(`headline like '%` + params.headline + `%'`);
            delete params.headline;
        }
        
        let clause = tools.newClause(params);
        if(clause){
            clauses.push(clause);
        }

        if(clauses.length){
            sql += ' ' + clauses.join(' and ');
        }

        r.excuteSQL(sql, res);
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

    '/gifLink': function(params, res){
        let ff = require('../ffmpeg/g.js').ff;
        ff(params, res);
    },

    '/srt/:vId': function(params, res){
        let parseSrt = require('../srtParser.js').parseSrt;
        parseSrt(params.vId, res);
    },

    '/loginInfo': function(params, res){
        r.query('loginInfo', params, res);
    },

	// 查询当前用户是否点赞当前视频
    '/queryVoteComment/:vId': function(params, res){
        if(global.usrInfo && global.usrInfo.type == 1){
			let sql = `select comment from usr_comment where video_id=${params.vId} and comment_type='1' and usr_id=${global.usrInfo.usrId}`;

            r.excuteSQL(sql, res, function(result){
                res.end(JSON.stringify(result[0]));
            });
		}else{
			res.end('need login !')
		}
    },

    // '/joinIndexJS': function(params, res){
    //     r.query('joinIndexJS', params, res);
    // },

    // ============POST 新建资源=============
    '/login': function(req, res){
        r.post('login', req, res);
    },

    '/logout': function(req, res){
        req.session.forget('usr');
        res.end();
    },
    
    '/regist': function(req, res){
        r.post('regist', req, res);
    },

    '/video': function(req, res){
        r.post('creatVedio', req, res);
    },

    '/tag': function(req, res){
        r.post('creatTag', req, res);
    },

    '/album': function(req, res){
        r.post('creatAlbum', req, res);
    },

    '/maker': function(req, res){
        r.post('createMaker', req, res);
    },

    // POST 上传文件
    '/upload': function(req, res){
        var formidable = require('formidable');
        var path = require('path');
        var fs = require('fs');

        let form = new formidable.IncomingForm();
        let absPath = '',
            relPath = '';

        let fileType;
        
        form.multiples = true;
    
        form.uploadDir = path.join(__dirname, "../../static", '/upload');
        let uploadDir = '/upload';
    
        form.on('file', function(field, file) {

            if(fileType == 'video'){
                absPath = path.join(form.uploadDir, file.name);
                relPath = path.join(uploadDir, file.name);
                fs.rename(file.path, absPath);// 没必要rename todo
            }else if(fileType == 'subtitle'){
                absPath = path.join(form.uploadDir, file.name);
                relPath = path.join(uploadDir, file.name);
                fs.rename(file.path, absPath);
            }else if(fileType == 'img'){
                absPath = path.join(form.uploadDir, file.name);
                relPath = path.join(uploadDir, file.name);
                fs.rename(file.path, absPath);
            }
        });

        form.on('field', function(k, v){
            if(k === 'type'){
                fileType = v;
            }
            // console.log('onfield', arguments);
        });
    
        form.on('error', function(err) {
            console.log('An error has occured: \n' + err);
        });
    
        form.on('end', function() {
            var d = {
                absPath: absPath,// 不能返回路径todo，会暴露服务器信息
                relPath: relPath
            }
            res.end(JSON.stringify(d));
            
        });
    
        form.parse(req);
    },

    '/feedback': function(req, res){
        r.post('creatFeedback', req, res);
    },

    // ============put update完整资源=============

    '/voteVideo': function(req, res){
        r.patch('voteVideo', req, res);
    },
    

    // patch update部分资源

    // delete 删除资源
}

module.exports = routerConfig;