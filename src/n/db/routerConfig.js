let r =  require('./operate');
let tools = require('../tools');

const routerConfig = {
    '/tube': function(params, res, req){
	    const tumour = require('../tumour');
        tumour.joinIndexJS(res, req.usrInfo);
    },

    '/sports': function(params, res, req){
        r.query('querySports', params, res, req);
    },

    '/skills/:sport_id': function(params, res, req){
        r.query('querySkills', params, res, req);
    },
    
    '/athletes/:sport_id': function(params, res, req){
        r.query('queryAthletes', params, res, req);
    },

    '/sports/:id': function(params, res, req){
        r.query('querySport', params, res, req);
    },

    '/albums': function(params, res, req){
        r.query('queryAlbumList', params, res, req);
    },

    '/sports/:sport_id/albums': function(params, res, req){
        r.query('queryAlbumList', params, res, req);
    },
    
    '/albums/:album_id/videos': function(params, res, req){
        r.query('queryAlbum', params, res, req);
    },
    
    // 根据video id 查询某个视频
    '/videos/:id': function(params, res, req){
        r.query('queryVideo', params, res, req);
    },

    '/makers': function(params, res, req){
        r.query('queryMakers', params, res, req);
    },

    '/maker/:id': function(params, res, req){
        r.query('queryMaker', params, res, req);
    },

    '/emailConfirm': function(params, res, req){
        let code = params.code;

        let crypto = require('../crypto.js');
        let decryptedCode = crypto.aesDecrypt(code, require('../constant').aesKey);
        
        // console.log(decryptedCode);
        decryptedCode = JSON.parse(decryptedCode);
        let sql = `update usr set is_active = '1', active_code = '' where id = ${decryptedCode.id} and active_code = ${decryptedCode.code}`;
        r.excuteSQL(sql, res, function(result){
            if(result.affectedRows){
                res.end();
            }
        });
    },

    // 根据关键字搜索视频
    '/videos': function(params, res, req){
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

    '/tags(/:sport_id)?': function(params, res, req){
        r.query('queryTag', params, res, req);
    },

    '/albumTags/:albumId': function(params, res, req){
        let sql = `select tag from album where id=` + params.albumId;
        r.excuteSQL(sql, res, function(data){
            let tagObj = data[0];

            if(tagObj && tagObj.tag){
                sql = 'select * from tag where id in (' + tagObj.tag + ')';
                r.excuteSQL(sql, res);
            }
        });
    },

    '/videoTags/:videoId': function(params, res, req){
        let sql = `select tag from video where id=` + params.videoId;
        // console.log(sql);
        
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
    '/navInfo/:depth/:id': function(params, res, req){
        if(params.depth == 1){
            r.query('querySport', {id: params.id}, res, req);
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

    '/gifLink': function(params, res, req){
        let createDynamicPreview = require('../ffmpeg/gif.js').createDynamicPreview;
        createDynamicPreview(params, res, req);
    },

    '/srt/:vId': function(params, res, req){
        let parseSrt = require('../srtParser.js').parseSrt;
        parseSrt(params.vId, res);
    },

    '/loginInfo': function(params, res, req){
        r.query('loginInfo', params, res, req);
    },

	// 查询当前用户是否点赞当前视频
    '/queryVoteComment/:vId': function(params, res, req){
        let sql = `select comment from usr_comment where video_id=${params.vId} and comment_type='1' and usr_id=${req.usrInfo.usrId}`;

        r.excuteSQL(sql, res, function(result){
            res.end(JSON.stringify(result[0]));
        });
    },

    '/checkUsernameExist': function(params, res, req){
        r.query('checkUsernameExist', params, res, req);
    },

    '/videoVoteResult': function(params, res, req){
        r.query('videoVoteResult', params, res, req);
    },

    // 视频收藏夹
    '/vStars': function(params, res, req){
        r.query('queryUsrStars', params, res, req);
    },

    // 当前用户当前视频的收藏的文件夹
    '/queryUsrVideoStars/:v_id': function(params, res, req){
        r.query('queryUsrVideoStars', params, res, req);
    },

    // 收藏夹内的视频
    '/starVideo/:star_id': function(params, res, req){
        r.query('queryStarVideo', params, res, req);
    },

    // 收藏的截图
    '/screenshots': function(params, res, req){
        r.query('queryUsrScreenshots', params, res, req);
    },

    // 用户截图所属的视频列表
    '/usrShotVideos': function(params, res, req){
        r.query('queryUsrShotVideos', params, res, req);
    },

    // 根据视频查询截图
    '/usrVshoot': function(params, res, req){
        r.query('queryUsrVshoot', params, res, req);
    },

    // 查询某视频
    '/video/:v_id/remarks': function(params, res, req){
        if(params.type == 1){
            r.query('queryVideoRemarks', params, res, req);
        }else if(params.type == 2){
            r.query('queryUsrVideoRemarks', params, res, req);
        }
    },

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

    '/resetPsw': function(req, res){
        r.post('resetPsw', req, res);
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

    '/voteNext': function(req, res){
        r.post('voteNextVideo', req, res);
    },

    '/star': function(req, res){
        r.post('creatStar', req, res);
    },

    '/star/:starId': function(req, res, pathParams){
        r.post('starVideo', req, res, pathParams);
    },

    '/video/:vId/remark': function(req, res, pathParams){
        r.post('createVideoRemarks', req, res, pathParams);
    },

    // ============put update完整资源=============

    // patch update部分资源
    '/voteVideo': function(req, res){
        r.patch('voteVideo', req, res);
    },

    '/resetPsw': function(req, res){
        r.patch('resetPsw', req, res);
    },

    // delete 删除资源
}

module.exports = routerConfig;