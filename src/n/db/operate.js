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

	queryVideo: function (res, qualification) {
		usr = global.usrInfo;
		const maxDayView = 100;
		const tmpUsrDayView = 10;

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
		if(usr){
			let usrType = usr.type;

			if(usrType == 1){// 注册
				conn.query(`select * from usr where id = '${usr.usrId}'`, function(err, result){
					let usrRecord = result[0];
					let dayView = usrRecord.dayview || 0;

					if(dayView < maxDayView){
						conn.query(`update usr set dayview=dayview+1 where id='${usrRecord.id}'`);
						queryVinfo(dayView);
					}else{
						res.writeHead(302, {
							'Location': '/?#/albums/1'
						});
						res.end('exceed dayview');
					}
				});
			}else if(usrType == 2){// 临时
				usrIP = usr.ip;
				conn.query(`select * from tmp_usr where ip = '${usrIP}'`, function(err, result){
					if(result[0]){
						// update dayview
						// 假如同个局域网的不同人访问
						// 同个局域网用户提交的IP信息是相同的

						let dayview = result[0].dayview;
						// console.log(dayview +1);
						if(dayview < tmpUsrDayView){
							conn.query(`update tmp_usr set dayview=dayview+1 where ip='${usrIP}'`);
							queryVinfo(dayview);
						}else{
							// 定时清除dayview
							res.writeHead(302, {
								'Location': '/?#/albums/1'
							});
							res.end('exceed dayview');
						}
					}else{
						conn.query(`INSERT INTO tmp_usr (ip, dayview) VALUES ('${usrIP}', 1)`);
						queryVinfo();
					}
				});
			}
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

				result = JSON.stringify(result);
				result.dayView = dayView;// 查询成功的话 返回当天播放次数
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
			let usr = JSON.parse(usrInfo.usr);
			conn.query('select name,dayview,isAdmin from usr where id = ' + usr.id, function(err, result){
				if (err) throw err;

				result = JSON.stringify(result[0]);
				res.end(result);
			});
			// res.end()
		}else if(usrInfo.type == 2){
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
				req.session.put('usr', JSON.stringify(result[0]));

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



