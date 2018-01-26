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
		/* let updateSQL = `update stat set v_show = v_show + 1;
			update video set impression = impression + 1;` */
		

		// console.log(global.usr);
		// 更新
		usr = global.usr;
		if(usr){
			let usrType = usr.type;

			if(usrType == 2){
				usrIP = usr.name;
				conn.query(`select * from tmp_usr where ip = '${usrIP}'`, function(err, result){
					if(result[0]){
						// update today impression
						// 假如同个局域网的不同人访问
						// 同个局域网用户提交的IP信息是相同的

						let impression = result[0].impression;
						// console.log(impression +1);
						if(impression < 100){
							conn.query(`update tmp_usr set impression=impression+1 where ip='${usrIP}'`);
							queryVinfo(impression);
						}else{
							// 定时清除impression
							res.end('IMPRESSION');
						}
					}else{
						conn.query(`INSERT INTO tmp_usr (ip, impression) VALUES ('${usrIP}', 1)`);
						queryVinfo();
					}
				});
			} else if(usrType == 1){
				queryVinfo();
			}
		}

		function queryVinfo(dayPlayCount){
			conn.query('SELECT * from video' + qualification, function (err, result, fields) {
				if (err) throw err;
				
				// 更新关联的表
				let albumId = result[0].album_id;
	
				conn.query('update stat set v_show = v_show + 1');
				conn.query('update video set impression = impression + 1' + qualification);
				conn.query('update album set impression = impression + 1 where id=' + albumId);
				conn.query('update sport set impression = impression + 1 where id = (select sport_id from album where id = ' + albumId + ')');
	
				result = JSON.stringify(result);
				result.dayPlayCount = dayPlayCount;
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

	// POST
	login: function(res, postObj, req){
		var sql = `select * from usr where name=? and psw=?`;

		conn.query(sql, [postObj.name, postObj.psw], function(err, result, fields){
			if(err)
				throw err;
			
			if(result[0].id){
				req.session.put('name', postObj.name);

				res.end('success');
			}else{

			}
			// console.log(result, fields);
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
			require('./ffmpeg/m3u.js').m3u(insertId, videoStorePath, subtitleAbsPath);

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



