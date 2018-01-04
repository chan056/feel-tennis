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
		conn.query('update stat set v_show = v_show + 1');
		conn.query('update video set impression = impression + 1' + qualification);

		conn.query('SELECT * from video' + qualification, function (err, result, fields) {
			if (err) throw err;

			result = JSON.stringify(result);
			res.end(result);
		});

	},

	queryTag: function (res, qualification) {

		conn.query('SELECT * from tag' + qualification, function (err, result, fields) {
			if (err) throw err;

			result = JSON.stringify(result);
			res.end(result);
			
		});

	},

	creatVedio: function(res, postObj){
		var sql = `INSERT INTO video 
			(album_id, headline, tag)
			VALUES (?, ?, ?)`;

		conn.query(sql, [postObj.albumId, postObj.headline, postObj.tag], function(err, result, fields){
			if(err)
				throw err;
			
			console.log(arguments)
			res.end('success');

			// 根据生成的videoId 重命名
			let insertId = result.insertId;
			let videoAbsPath = postObj.videoAbsPath;
			let subtitleAbsPath = postObj.subtitleAbsPath;

			const fs = require('fs');
			const path = require('path');
			let ext = path.extname(videoAbsPath);
			
			let videoStorePath = path.resolve(__dirname, `../../static/multimedia/pristine_v/${insertId}${ext}`);
			fs.rename(videoAbsPath, videoStorePath);// 用于生成gif
			// console.log(insertId, videoAbsPath)
			require('./ffmpeg/m3u.js').m3u(insertId, videoStorePath, subtitleAbsPath);
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



