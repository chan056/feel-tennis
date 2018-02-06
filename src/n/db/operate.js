let conn = require('./connect.js').conn;
let tools = require('../tool');

var operations = {
	querySports: function (res, qualification) {

		conn.query('SELECT * from sport' + qualification, function (err, result, fields) {
			if (err) throw err;

			result = JSON.stringify(result);
			res.end(result)
		});

	},

	querySport: function (res, qualification) {
		
		conn.query('SELECT * from sport' + qualification, function (err, result, fields) {
			if (err) throw err;

			result = JSON.stringify(result);
			res.end(result)
		});

	},

	queryAlbumList: function (res, qualification) {

		conn.query('SELECT * from album' + qualification, function (err, result, fields) {
			if (err) throw err;

			result = JSON.stringify(result);
			res.end(result)

			
		});
	},

	queryAlbum: function (res, qualification) {

		conn.query('SELECT * from video' + qualification, function (err, result, fields) {
			if (err) throw err;

			result = JSON.stringify(result);
			res.end(result)
		});

	},

	/* 
		查询是否存在临时用户
			没有
				新建
			有
				更新
		超过当天视频播放量
			是
				重定向到所属专辑视频列表
			否
				返回视频信息
	*/
	queryVideo: function (res, qualification) {
		const constants = require('../constant');
		usrInfo = global.usrInfo;
		let dayView = 0;
		let dayViewLeft = 0;
		
		if(usrInfo){
			let usrType = usrInfo.type;

			if(usrType == 1){// 注册
				conn.query(`select * from usr where id = '${usrInfo.usrId}'`, function(err, result){
					let usrRecord = result[0];
					dayView = usrRecord.day_view || 0;

					if(dayView < constants.maxDayView){
						conn.query(`update usr set day_view=day_view+1 where id='${usrRecord.id}'`);
						dayViewLeft = constants.maxDayView - dayView - 1;
						queryVinfo(dayView);
					}else{
						res.end('exceed dayView');
					}
				});
			}else if(usrType == 2){// 临时
				usrIP = usrInfo.ip;
				conn.query(`select * from tmp_usr where ip = '${usrIP}'`, function(err, result){
					let tmpUsrRecord = result[0];
					if(tmpUsrRecord){
						// update dayView
						// 假如同个局域网的不同人访问 !! todo
						// 同个局域网用户提交的IP信息是相同的

						dayView = tmpUsrRecord.day_view;
						// console.log(dayView +1);
						if(dayView < constants.tmpUsrDayView){
							conn.query(`update tmp_usr set day_view=day_view+1 where ip='${usrIP}'`);
							dayViewLeft = constants.tmpUsrDayView - dayView - 1;
							queryVinfo(dayView);
						}else{
							// 跳转到首页？
							// res.writeHead(302, {
							// 	'Location': '/?#/albums/1'
							// });
							res.end('exceed dayView');
						}
					}else{
						conn.query(`INSERT INTO tmp_usr (ip, day_view) VALUES ('${usrIP}', 1)`);
						dayView = 1;
						dayViewLeft = constants.tmpUsrDayView - 1;
						queryVinfo();
					}
				});
			}
		}else{
			res.end('user type error！');
		}

		function queryVinfo(dayView){
			conn.query('SELECT * from video' + qualification, function (err, result, fields) {
				if (err) throw err;
				
				// 更新关联的表
				let albumId = result[0].album_id;
	
				conn.query('update stat set v_show = v_show + 1');
				conn.query('update video set impression = impression + 1' + qualification);
				conn.query('update album set impression = impression + 1 where id=' + albumId);
				conn.query('update sport set impression = impression + 1 where id = (select sport_id from album where id = ' + albumId + ')');

				result[0].dayViewLeft = dayViewLeft;// 查询成功的话 返回当天播放次数
				result = JSON.stringify(result[0]);
				res.end(result);
			});
		}
	},

	queryMakers: function(res, qualification) {
		conn.query('SELECT * from maker' + qualification, function (err, result, fields) {
			if (err) throw err;

			result = JSON.stringify(result);

			res.end(result)
		});
	},

	queryMaker: function(res, qualification) {
		conn.query('SELECT * from maker' + qualification, function (err, result, fields) {
			if (err) throw err;

			result = JSON.stringify(result);

			res.end(result)
		});
	},

	queryTag: function (res, qualification) {

		conn.query('SELECT * from tag' + qualification, function (err, result, fields) {
			if (err) throw err;

			result = JSON.stringify(result);
			res.end(result);
		});

	},

	loginInfo: function(res){
		let usrInfo = global.usrInfo;
		
		if(usrInfo.type == 1){
			conn.query('select name, day_view, is_admin from usr where id = ' + usrInfo.usrId, function(err, result){
				if (err) throw err;

				result = JSON.stringify(result[0]);
				res.end(result);
			});
			// res.end()
		}else if(usrInfo.type == 2){
			// console.log(usrInfo);
			res.end('')
		}
	},

	// POST
	login: function(res, postObj, req){
		var sql = `select * from usr where name=? and psw=?`;

		conn.query(sql, [postObj.name, postObj.psw], function(err, result, fields){
			if(err)
				throw err;
			
			if(result[0] && result[0].id){
				req.session.put('usr', result[0].id);
				res.end('success');
			}else{
				res.statusCode = 401;
				res.end(JSON.stringify({isLogin: false}));
			}
			// console.log(result, fields);
		});
	},

	regist: function(res, postObj, req){
		var sql = `INSERT INTO usr 
			(name, psw)
			VALUES (?, ?)`;

		conn.query(sql, [postObj.name, postObj.psw], function(err, result, fields){
			if(err)
				throw err;

			if(result.affectedRows == 1){
				res.statusMessage = 'regist success';
				res.end();
			}
		});
	},

	creatVedio: function(res, postObj){
		const path = require('path');

		let videoAbsPath = postObj.videoAbsPath;
		let ext = path.extname(videoAbsPath);
		// if(ext){
		// 	ext = ext.replace(/\./, '');
		// }

		var sql = `INSERT INTO video 
			(album_id, headline, tag, video_ext, update_time)
			VALUES (?, ?, ?, ?, ?)`;

		conn.query(sql, [postObj.albumId, postObj.headline, postObj.tag, ext, +new Date()], function(err, result, fields){
			if(err)
				throw err;

			res.end('success');

			// 根据生成的videoId 储存视频
			let insertId = result.insertId;
			let subtitleAbsPath = postObj.subtitleAbsPath;

			const fs = require('fs');
			
			let videoStorePath = path.resolve(__dirname, `../../static/multimedia/pristine_v/${insertId}${ext}`);
			fs.rename(videoAbsPath, videoStorePath);// 用于生成gif
			
			// 生成包含视频和字幕的目录
			require('../ffmpeg/m3u.js').m3u(insertId, videoStorePath, subtitleAbsPath);

			// 更新album 和 sport
			let now = +new Date();
			let albumId = postObj.albumId;

			conn.query('update album set update_time = ' + now + ' where id=' + albumId);
			conn.query('update sport set update_time = ' + now + ' where id = (select sport_id from album where id = ' + albumId + ')');
		});
	},

	creatFeedback: function(res, postObj, req){
		var sql = `INSERT INTO feedback 
			(description, ip, site, email, files)
			VALUES (?, ?, ?, ?, ?)`;

		conn.query(sql, [postObj.desc, req.connection.remoteAddress, postObj.site, postObj.email, postObj.files], function(err, result, fields){
			if(err)
				console.log(err.sql, err.sqlMessage) ;
			
			res.end('success');
		});
	},

	creatTag: function(res, postObj){
		var sql = `INSERT INTO tag 
			(name, sport_id)
			VALUES (?, ?)`;

		conn.query(sql, [postObj.name, postObj.sportId], function(err, result, fields){
			if(err)
				throw err;
			
			res.end('success');
		});
	},

	creatAlbum: function(res, postObj){
		var sql = `INSERT INTO album 
			(sport_id, author_id, name, tag, cover)
			VALUES (?, ?, ?, ?, ?)`;

		conn.query(sql, [postObj.sportId, postObj.maker, postObj.name, postObj.tag, postObj.cover], function(err, result, fields){
			if(err)
				throw err;
			// console.log(arguments);
			res.end('success');
		});
	},

	createMaker: function(res, postObj){
		var sql = `INSERT INTO maker 
			(name, description)
			VALUES (?, ?)`;

		conn.query(sql, [postObj.name, postObj.desc], function(err, result, fields){
			if(err)
				throw err;
			// console.log(arguments);
			res.end('success');
		});
	},

	// 用户评论操作
	comment: function(res, postObj){
		let sql = `INSERT INTO usr_comment 
		(commenter_id, comment_type, comment)
		VALUES (?, ?, ?)`;

		global.usrInfo = {
			type: 1,
			usrId: usr
		}
		if(global.usrInfo && global.usrInfo.type == 1){
			conn.query(sql, [global.usrInfo.usrId, postObj.commentType, postObj.comment], function(err, result, fields){
				if(err)
					throw err;
				// console.log(arguments);
				res.end('success');
			});
	
			// 赞/贬
			if(1){
				sql = `update video set support_time=support_time+1 where id = ?`;
			}else{
				sql = `update video set degrade_time=degrade_time+1 where id = ?`;
			}
	
			conn.query(sql, [postObj.vId], function(err, result, fields){
				if(err)
					throw err;
				// console.log(arguments);
				res.end('success');
			});
		}else{
			// res.statusCode = xx;
			res.end('登录后再操作')
		}
	}
}

// 执行SQL
module.exports.excuteSQL = function (sql, res, fn) {
	conn.query(sql,  function(err, result, fields){
		if(err)
			throw err;
		
		if(fn){
			fn(result);
		}else{
			result = JSON.stringify(result);
			res.end(result);
		}
	});
}

// 基础查询 a=1&b=2
module.exports.query = function (operation, params, response) {
	// console.log(arguments[0], arguments[1])
	clause = tools.newClause(params);
	if(clause){
		clause = ' where ' + clause;
	}
	// console.log(params, clause)
	operations[operation](response, clause);
}

module.exports.post = function (operation, request, response) {
	// console.log(arguments[0], arguments[1])
	var formidable = require('formidable');
	var form = new formidable.IncomingForm();

	form.parse(request, function(err, fields, files){
		operations[operation](response, fields, request);
	});
}



