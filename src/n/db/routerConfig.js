let r =  require('./operate');
let tools = require('../tools');

const routerConfig = {
    get: {
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
        
        '/videoInfo/:id': function(params, res, req){
            r.query('queryVideoInfo', params, res, req);
        },

        '/videoIntroInfo/:id': function(params, res, req){
            r.query('queryVideoIntroInfo', params, res, req);
        },

        // 根据video信息并更新相关记录
        '/videos/:id': function(params, res, req){
            r.query('queryVideo', params, res, req);
        },

        '/videos/:id/translatorInfo': function(params, res, req){
            r.query('queryVideoTranslatorInfo', params, res, req);
        },

        '/albumInfo/:id': function(params, res, req){
            r.query('queryAlbumInfo', params, res, req);
        },

        '/sportInfo/:id': function(params, res, req){
            r.query('querySportInfo', params, res, req);
        },
    
        '/makers': {
            fn: function(params, res, req){
                r.query('queryMakers', params, res, req);
            },
            limit: {level: 100}
        },
    
        '/maker/:id': {
            fn: function(params, res, req){
                r.query('queryMaker', params, res, req);
            },
            limit: {level: 100}
        },
    
        '/emailConfirm': function(params, res, req){
            let code = params.code;
    
            let crypto = require('../crypto.js');
            let decryptedCode = crypto.aesDecrypt(code, require('../constant').aesKey);
            
            decryptedCode = JSON.parse(decryptedCode);
            let sql = `update usr set is_active = '1', active_code = '' where id = 
                ${decryptedCode.id} and active_code = ${decryptedCode.code}`;

            r.excuteSQL(sql, res, function(result){
                if(result.affectedRows){
                    req.usrInfo.isActive = 1;
                    req.usrInfo.id = decryptedCode.id;
                    require('../cookie').setCookie(res, {
                        name: `sid`,
                        value: JSON.stringify(req.usrInfo),
                        HttpOnly: true
                    });
                    res.end();
                }else{
                    res.statusMessage = 'active code invalid';
                    res.statusCode = 499;
                    res.end();
                }
            });
        },

        // 分页video列表
        '/videosAdmin':{
            fn: function(params, res, req){
                r.query('queryVideosAdmin', params, res, req);
            },
            limit: {level: 100}
        },

        '/videosIntroAdmin':{
            fn: function(params, res, req){
                r.query('queryVideosIntroAdmin', params, res, req);
            },
            limit: {level: 100}
        },
    
        // 根据关键字搜索视频
        '/videos': function(params, res, req){
            let sql = `select * from video as v`;
    
            if(params && !tools.isEmpty(params)){
                sql += ' where';
            }
    
            var clauses = [];
            // 点击标签
            if(params.tagId){
                clauses.push(`CONCAT(',',tag,',')  like '%,` + params.tagId + `,%'`)
                delete params.tagId;
            }
    
            // 搜索框
            if(params.headline){
                let clause = `
                    (
                        headline LIKE '%${params.headline}%'
                        OR headline_eng LIKE '%${params.headline}%'
                    )
                OR (
                    CONCAT(',', v.tag, ',') REGEXP CONCAT(
                        ',',
                        (SELECT
                            id
                        FROM
                            tag
                        WHERE
                            NAME = '${params.headline}'),
                        ','
                    )
                )`;
                clauses.push(clause);
                delete params.headline;
            }

            if(params.hidden != undefined){
                clauses.push('hidden='+params.hidden)
            }

            if(clauses.length){
                sql += ' ' + clauses.join(' and ');

                r.excuteSQL(sql, res, function(resData){
                    res.end( JSON.stringify({
                            datalist: resData,
                            total: resData.length
                        })
                    )
                });
            }
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
    
        '/shortVideoLink': {
            fn: function(params, res, req){
                require('../ffmpeg/dynamic_preview.js')(params, res, req);
            },
            limit: {level: 10, visits: 3}
        },

        '/videoScreenshot': {
            fn: function(params, res, req){
                const fs = require('fs');
                
                let src = `${global.staticRoot}/multimedia/pristine_v/${params.vId}${params.ext}`,
                    filename = `${params.vId}-${+new Date()}`,
                    relPath = `./multimedia/screenshot/${filename}.jpg`,
                    dest = require('path').resolve(global.staticRoot, relPath),
                    st = params.st;

                let screenshotFolder = global.staticRoot + '/multimedia/screenshot';
                if(!fs.existsSync(screenshotFolder)){
                    fs.mkdirSync(screenshotFolder);
                }

                require('../ffmpeg/screenshot.js')(src, dest, st, params.size, function(){
                    let conn = require('./connect.js').conn;
                    let sql = `insert into usr_screenshot_star (usr_id, screenshot, v_id, type) 
                        values (${req.usrInfo.usrId}, '${filename}', ${params.vId}, 2)`;
                    conn.query(sql, function(err, result){
                        if(err)
                            console.log(err);
                    });
    
                    return res.end(relPath.replace('./', '/'));
                });
            },
            limit: {level: 10, visits: 10}
        },
    
        '/caption/:vId': function(params, res, req){
            let parseCaption = require('../captionParser.js').parseCaption;
            if(req.usrInfo.usrId){
                params.usrId = req.usrInfo.usrId;
            }
            parseCaption(params, res);
        },
    
        '/loginInfo': function(params, res, req){
            r.query('loginInfo', params, res, req);
        },
    
        '/queryVoteComment/:vId': {
            fn: function(params, res, req){
                let sql = `select comment from usr_comment where video_id=${params.vId} and comment_type='1' and usr_id=${req.usrInfo.usrId}`;
        
                r.excuteSQL(sql, res, function(result){
                    res.end(JSON.stringify(result[0]));
                });
            },
            limit: {level: 10}
        },
    
        '/checkUsernameExist': function(params, res, req){
            r.query('checkUsernameExist', params, res, req);
        },
    
        '/checkEmailExist': function(params, res, req){
            r.query('checkEmailExist', params, res, req);
        },
    
        '/videoVoteResult': function(params, res, req){
            r.query('videoVoteResult', params, res, req);
        },
    
        // 视频收藏夹
        '/vStars': {
            fn: function(params, res, req){
                r.query('queryUsrStars', params, res, req);
            },
            limit: {level: 10}
        },
    
        // 当前用户当前视频收藏夹
        '/videoStarsContainTheVideo/:v_id': {
            fn: function(params, res, req){
                r.query('queryVideoStarsContainTheVideo', params, res, req);
            },
            limit: {level: 10}
        },
    
        // 收藏夹内的视频
        '/starVideo/:star_id': {
            fn: function(params, res, req){
                r.query('queryStarVideo', params, res, req);
            },
            limit: {level: 10}
        },
    
        // 收藏的截图
        '/screenshots': {
            fn: function(params, res, req){
                r.query('queryUsrScreenshots', params, res, req);
            },
            limit: {level: 10}
        },
    
        // 用户截图所属的视频列表
        '/usrShotVideos': {
            fn: function(params, res, req){
                r.query('queryUsrShotVideos', params, res, req);
            },
            limit: {level: 10}
        },
    
        // 根据视频查询截图
        '/usrVshoot': {
            fn: function(params, res, req){
                r.query('queryUsrVshoot', params, res, req);
            },
            limit: {level: 10}
        },
    
        // 查询某视频
        '/video/:v_id/remarks': {
            fn: function(params, res, req){
                if(params.type == 1){
                    r.query('queryVideoRemarks', params, res, req);
                }else if(params.type == 2){
                    r.query('queryUsrVideoRemarks', params, res, req);
                }
            },
            limit: {level: 10}
        },
    
        '/usrDatum': {
            fn: function(params, res, req){
                r.query('fetchUsrDatum', params, res, req)
            },
            limit: {level: 10}
        },

        
        '/sameCityPlayer/:last_login_city': {
            fn: function(params, res, req){
                r.query('fetchSameCityPlayer', params, res, req)
            },
            limit: {level: 10}
        },

        '/cityPlayer': function(params, res, req){
            r.query('fetchCityPlayer', params, res, req)
        },

        '/relatedMatches': {
            fn: function(params, res, req){
                r.query('fetchRelatedMatches', params, res, req)
            },
            limit: {level: 10}
        },
        
        '/usrDatumIntegrity': function(params, res, req){
            r.query('checkUsrDatumIntegrity', params, res, req)
        },

        '/feedbacks': {
            fn: function(params, res, req){
                r.query('fetchFeedbackList', params, res, req)
            },
            limit: {level: 10}
        },

        '/resendActiveEmail': function(params, res, req){
            let usrId = req.usrInfo.usrId;
            if(!usrId)
                return;
                
            let sql = `select active_code,email,name from usr where id=${usrId}`;

            let conn = require('./connect.js').conn;
            conn.query(sql, function(err, result){
                if(err)
                    console.log(err);
                
                let activeCode = result[0]['active_code'];
                let email = result[0]['email'];
                let name = result[0]['name'];

                if(email && activeCode){
                    require('../tools.js').sendActiveEmail(usrId, name, email, activeCode, req, res);

                    res.statusMessage = 'resend success';
					res.end(`邮件已发送至 ${email}, 请查收`);
                }
            });
        },

        '/inmails': {
            fn: function(params, res, req){
                r.query('fetchInmails', params, res, req)
            },
            limit: {level: 10}
        },

        '/captionDrafts/:vId': {
            fn: function(params, res, req){
                r.query('fetchCaptionDrafts', params, res, req)
            },
            limit: {level: 10}
        },

        '/introVideoIndex/:sId': function(params, res, req){
            r.query('fetchIntroVideoIndex', params, res, req)
        },
    },

    post: {
        '/login': function(req, res){
            r.post('login', req, res);
        },
    
        '/logout': function(req, res){
            require('../cookie').setCookie(res, {
                name: `sid`,
                plainValue: true,
                value: '',
                HttpOnly: true
            });
            res.end();
        },
        
        '/regist': function(req, res){
            r.post('regist', req, res);
        },
    
        '/resetPsw': function(req, res){
            r.post('resetPsw', req, res);
        },
    
        '/video': {
            fn: function(req, res){
                r.post('createVideo', req, res);
            },
            limit: {level: 100}
        },

        '/sport': {
            fn: function(req, res){
                r.post('createSport', req, res);
            },
            limit: {level: 100}
        },
    
        '/tag': {
            fn: function(req, res){
                r.post('createTag', req, res);
            },
            limit: {level: 100}
        },
    
        '/album': {
            fn: function(req, res){
                r.post('createAlbum', req, res);
            },
            limit: {level: 100}
        },
    
        '/maker': {
            fn: function(req, res){
                r.post('createMaker', req, res);
            },
            limit: {level: 100}
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

            form.maxFileSize = 400 * 1024 * 1024;
        
            form.uploadDir = path.join(__dirname, "../../static", '/upload');
            let uploadDir = '/upload';
        
            form.on('file', function(field, file) {
    
                if(fileType == 'video'){
                    absPath = path.join(form.uploadDir, file.name);
                    relPath = path.join(uploadDir, file.name);
                    fs.rename(file.path, absPath, function(){
                        
                    });
                }else if(fileType == 'subtitle'){
                    absPath = path.join(form.uploadDir, file.name);
                    relPath = path.join(uploadDir, file.name);
                    fs.rename(file.path, absPath, function(){});
                }else if(fileType == 'img'){
                    absPath = path.join(form.uploadDir, file.name);
                    relPath = path.join(uploadDir, file.name);
                    fs.rename(file.path, absPath, function(){});
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
                res.end(JSON.stringify(err));
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
    
        '/feedback': {
            fn: function(req, res){
                r.post('createFeedback', req, res);
            },

            limit: {level: 100}
        },
    
        '/voteNext': {
            fn: function(req, res){
                r.post('voteNextVideo', req, res);
            },
            limit: {level: 10, visits: 1}
        },
    
        '/star': function(req, res){
            r.post('createStar', req, res);
        },
    
        '/star/:starId': {
            fn: function(req, res, pathParams){
                r.post('starVideo', req, res, pathParams);
            },
            limit: {level: 10}
        },
    
        '/video/:vId/remark': {
            fn: function(req, res, pathParams){
                r.post('createVideoRemarks', req, res, pathParams);
            },
            limit: {level: 10}
        },

        '/match': {
            fn: function(req, res, pathParams){
                r.post('foundMatch', req, res, pathParams);
            },
            limit: {level: 10}
        },

        '/blockedUsr': {
            fn: function(req, res, pathParams){
                r.post('blockUsr', req, res, pathParams);
            },
            limit: {level: 100}
        },

        '/competeBlack': {
            fn: function(req, res, pathParams){
                r.post('addCompeteBlack', req, res, pathParams);
            },
            limit: {level: 10}
        },

        '/competeEvaluate': {
            fn: function(req, res, pathParams){
                r.post('competeEvaluate', req, res, pathParams);
            },
            limit: {level: 10}
        },

        '/srt/:vId': {
            fn: function(req, res, pathParams){
                r.post('createCaption', req, res, pathParams);
            },
            limit: {level: 10}
        },

        '/caption/inherition': {
            fn: function(req, res, pathParams){
                r.post('inheritCaption', req, res, pathParams);
            },
            limit: {level: 10}
        },

        '/caption/audition': {
            fn: function(req, res, pathParams){
                r.post('auditCaption', req, res, pathParams);
            },
            limit: {level: 100}
        },
    },

    // ============put update完整资源=============
    put: {
        '/video/:id': {
            fn: function(req, res, pathParams){
                r.put('updateVideoInfo', req, res, pathParams);
            },
            limit: {level: 100}
        },

        '/album/:id': {
            fn: function(req, res, pathParams){
                r.put('updateAlbumInfo', req, res, pathParams);
            },
            limit: {level: 100}
        },

        '/sport/:id': {
            fn: function(req, res, pathParams){
                r.put('updateSportInfo', req, res, pathParams);
            },
            limit: {level: 100}
        },
    },

    // patch update部分资源
    patch: {
        '/voteVideo': function(req, res){
            r.patch('voteVideo', req, res);
        },
    
        '/resetPsw': function(req, res){
            r.patch('resetPsw', req, res);
        },
    
        '/usrDatum': function(req, res){
            r.patch('updateUsrDatum', req, res);
        },

        '/match': {
            fn: function(req, res){
                r.patch('responseChallenge', req, res);
            },
            limit: {level: 10}
        },
        
        '/matchResult': {
            fn: function(req, res){
                r.patch('markMatchResult', req, res);
            },
            limit: {level: 10}
        },

        '/retrievePswEmail': function(req, res){
            r.patch('retrievePswEmail', req, res)
        },
        
        '/retrievePsw': function(req, res){
            r.patch('retrievePsw', req, res)
        },

        '/markAsRead': {
            fn: function(req, res){
                r.patch('markAsRead', req, res);
            },
            limit: {level: 10}
        },

        '/toggleVideo': function(req, res){
            r.patch('toggleVideo', req, res)
        },
    },

    // delete 删除资源
    delete: {
        '/feedback/:id': {
            fn: function(req, res, pathParams){
                r.delete('deleteFeedback', req, res, pathParams);
            },
            limit: {level: 100}
        },

        '/video/:id': {
            fn: function(req, res, pathParams){
                r.delete('deleteVideo', req, res, pathParams);
            },
            limit: {level: 100}
        },

        '/video_introductory/:id': {
            fn: function(req, res, pathParams){
                r.delete('deleteIntroductoryVideo', req, res, pathParams);
            },
            limit: {level: 100}
        },

        '/sport/:id': {
            fn: function(req, res, pathParams){
                r.delete('deleteSport', req, res, pathParams);
            },
            limit: {level: 100}
        }
    }
}

module.exports = routerConfig;