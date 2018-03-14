let conn = require('./connect.js').conn;
let tools = require('../tools');
let usrInfo = {};

let operations = {
	querySports: function (res, qualification, params) {
		
		let sql = 'SELECT * from sport' + qualification;
		sql = disposePageSql(sql, params);

		conn.query(sql, function (err, result, fields) {
			if (err) throw err;

			result = JSON.stringify(result);
			res.end(result)
		});

	},

	querySkills: function (res, qualification, params) {

		conn.query('SELECT * from skill' + qualification, function (err, result, fields) {
			if (err) throw err;

			result = JSON.stringify(result);
			res.end(result)
		});

	},

	queryAthletes: function (res, qualification, params) {

		conn.query('SELECT * from athlete' + qualification, function (err, result, fields) {
			if (err) throw err;

			result = JSON.stringify(result);
			res.end(result)
		});

	},

	querySport: function (res, qualification, params) {
		
		conn.query('SELECT * from sport' + qualification, function (err, result, fields) {
			if (err) throw err;

			result = JSON.stringify(result);
			res.end(result)
		});

	},

	queryAlbumList: function (res, qualification, params) {

		let sql = `select 
			a.*, 
			m.name as author_name,
			m.description as author_description,
			m.link as author_link
			from album as a inner join maker as m 
			where a.author_id = m.id`;
		if(params.sport_id)
			sql += ` and a.sport_id = ${params.sport_id}`;

		conn.query(sql, function (err, result, fields) {
			if (err) throw err;

			result = JSON.stringify(result);
			res.end(result)
		});

	},

	queryAlbum: function (res, qualification, params) {
		conn.query('SELECT * from video' + qualification, function (err, result, fields) {
			if (err) throw err;
		
			result = JSON.stringify(result);
			res.end(result)
		});

	},

	queryVideo: function (res, qualification, params) {
		const constants = require('../constant');
		let dayView = 0;
		let dayViewLeft = 0;
		let usrInfo = this.usrInfo;

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
						res.end();
					}
				});
			}else if(usrType == 2){// 临时
				usrIP = usrInfo.ip;
				conn.query(`select * from tmp_usr where ip = '${usrIP}'`, function(err, result){
					if(result && result[0]){
						let tmpUsrRecord = result[0];
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
							res.end();
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
				
				let vInfo = result[0];
				// 更新关联的表
				let albumId = result[0].album_id;
	
				conn.query('update stat set v_show = v_show + 1');
				conn.query('update video set impression = impression + 1' + qualification);
				conn.query('update album set impression = impression + 1 where id=' + albumId);
				conn.query('update sport set impression = impression + 1 where id = (select sport_id from album where id = ' + albumId + ')');

				vInfo.dayViewLeft = dayViewLeft;// 查询成功的话 返回当天播放剩余次数
				result = JSON.stringify(vInfo);
				res.end(result);
				
			});
		}
	},

	queryMakers: function(res, qualification, params) {
		conn.query('SELECT * from maker' + qualification, function (err, result, fields) {
			if (err) throw err;

			result = JSON.stringify(result);

			res.end(result)
		});
	},

	queryMaker: function(res, qualification, params) {
		conn.query('SELECT * from maker' + qualification, function (err, result, fields) {
			if (err) throw err;

			result = JSON.stringify(result);

			res.end(result)
		});
	},

	queryTag: function (res, qualification, params) {

		conn.query('SELECT * from tag' + qualification, function (err, result, fields) {
			if (err) throw err;

			result = JSON.stringify(result);
			res.end(result);
		});

	},

	loginInfo: function(res, qualification, params){
		let usrInfo = this.usrInfo;
		
		if(usrInfo.type == 1){
			conn.query('select name, day_view, is_admin from usr where id = ' + usrInfo.usrId, function(err, result){
				if (err) throw err;

				result = JSON.stringify(result[0]);
				res.end(result);
			});
		}else if(usrInfo.type == 2){
			res.end('')
		}
	},

	checkUsernameExist: function(res, qualification, params){
		conn.query('SELECT * from usr' + qualification, function (err, result, fields) {
			if (err) throw err;

			if(result && result.length){
				res.end('1');
			}else{
				res.end('0');
			}
		});
	},

	checkEmailExist: function(res, qualification, params){
		conn.query('SELECT * from usr' + qualification, function (err, result, fields) {
			if (err) throw err;

			if(result && result.length){
				res.end('1');
			}else{
				res.end('0');
			}
		});
	},

	videoVoteResult: function(res, qualification, params){
		let sql = `SELECT
			(
				SELECT
					NAME
				FROM
					skill
				WHERE
					id = skill_id
			) as tag,
			count(*) as count
		FROM
			next_video
		WHERE
			overdue = 0
		GROUP BY
			skill_id
		ORDER BY
			count DESC`;

		let sql2 = `SELECT
		(
			SELECT
				NAME
			FROM
				athlete
			WHERE
				id = athlete_id
		) AS tag,
			count(*) AS count
		FROM
			next_video
		WHERE
			overdue = 0
		GROUP BY
			athlete_id
		ORDER BY
			count DESC`;

		let resData = {};
		conn.query(sql, function (err, result, fields) {
			if (err) throw err;

			resData.skill = result;

			conn.query(sql2, function (err, result, fields) {
				if (err) throw err;
				
				resData.athlete = result;

				res.end(JSON.stringify(resData));
			});
		});
	},

	queryUsrStars: function(res, qualification, params){
		conn.query('SELECT * from star where usr_id=' + this.usrInfo.usrId, function (err, result, fields) {
			if (err) throw err;

			result = JSON.stringify(result);
			res.end(result);
		});
	},

	queryUsrVideoStars: function(res, qualification, params){
		let sql = `SELECT
			us.star_id as id,
			s.NAME as name
		FROM
			usr_video_star AS us
		JOIN star AS s
		WHERE
			us.v_id = ${params.v_id}
		AND us.star_id = s.id
		AND s.usr_id=${this.usrInfo.usrId}`;

		conn.query(sql, function (err, result, fields) {
			if (err) throw err;

			result = JSON.stringify(result);
			res.end(result);
		});
	},

	queryUsrScreenshots: function(res, qualification, params){
		let sql = `SELECT
			usv.screenshot,
			v.headline,
			v.id
		FROM
			usr_screenshot_star as usv
			JOIN
			video as v
		WHERE
			usr_id = ${this.usrInfo.usrId}
			and
			usv.v_id=v.id`
		conn.query(sql, function (err, result, fields) {
			if (err) throw err;

			result = JSON.stringify(result);
			res.end(result);
		});
	},

	
	queryUsrShotVideos: function(res, qualification, params){
		let sql = `SELECT
			*
			FROM
				video
			WHERE
			id IN (
				SELECT DISTINCT
					v_id
				FROM
					usr_screenshot_star AS uss
				WHERE usr_id=${this.usrInfo.usrId}
			)`;
		
		conn.query(sql, function (err, result, fields) {
			if (err) throw err;

			result = JSON.stringify(result);
			res.end(result);
		});
	},

	queryStarVideo: function(res, qualification, params){
		let sql = `SELECT
			v.*,
			uvs.v_id
			FROM
				usr_video_star as uvs
			join
				video as v
			WHERE
				uvs.star_id = ${params.star_id}
				and
				uvs.v_id = v.id`;
		
		conn.query(sql, function (err, result, fields) {
			if (err) throw err;

			result = JSON.stringify(result);
			res.end(result);
		});
	},

	queryUsrVshoot: function(res, qualification, params){
		conn.query(`SELECT * from usr_screenshot_star where v_id=${params.vId} and usr_id=` + this.usrInfo.usrId, function (err, result, fields) {
			if (err) throw err;

			result = JSON.stringify(result);
			res.end(result);
		});
	},

	queryVideoRemarks: function(res, qualification, params){
		conn.query(`SELECT * FROM video_remark where v_id='${params.v_id}'`, function (err, result, fields) {
			if (err) throw err;

			result = JSON.stringify(result);
			res.end(result);
		});
	},

	queryUsrVideoRemarks: function(res, qualification, params){
		conn.query(`SELECT * FROM video_remark where v_id='${params.v_id}' and usr_id=${this.usrInfo.usrId}`, function (err, result, fields) {
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

			let usr = result[0];
			if(usr && usr.id){
				let id = usr.id,
					isAdmin = usr.is_admin;

				let info = {id: id, isAdmin: isAdmin};
				// info = JSON.stringify(info);
				req.session.put('usr', info);

				res.statusMessage = 'login success';
				res.end();
			}else{
				res.statusCode = 401;
				res.statusMessage = 'login fail';
				res.end();
			}
			// console.log(result, fields);
		});
	},

	regist: function(res, postObj, req){
		let ip = require('client-ip')(req);
		if(ip == '::1'){
			ip = '::ffff:127.0.0.1';
		}

		conn.query(`SELECT * from usr WHERE regist_ip=${ip} and regist_time > DATE_SUB(CURRENT_TIMESTAMP(),INTERVAL 1 DAY)`, function(err, result){
			if(err)
				throw err;

			// 1天内同个IP注册超过10个
			// 将IP加入黑名单
			if(result.length > 10){
				// conn.query('select * from black where ip == ${ip}')
				let sql = `insert into black (ip) values (${ip})`;
				conn.query(sql);
			}else{
				let code = Math.floor(Math.random() * 1000000000);
				let email = postObj.email;
		
				let sql = `INSERT INTO usr 
					(name, psw, email, active_code, regist_ip)
					VALUES (?, ?, ?, ?, ?)`;
				
		
				conn.query(sql, [postObj.name, postObj.psw, email, code, ip], function(err, result, fields){
					if(err)
						throw err;
		
					let usrId = result.insertId;
					if(usrId){
		
						let info = JSON.stringify({id: usrId, isAdmin: 0});
						req.session.put('usr', info);
		
						res.statusMessage = 'regist success';
						res.end('success');
		
						if(email){
							let activeCode = JSON.stringify({
								id: usrId,
								code: code
							});
		
							let crypto = require('../crypto.js');
							let encryptedCode = crypto.aesEncrypt(activeCode, require('../constant').aesKey);
		
							let emailSubject = 'chantube注册确认',
								emailContent = `你好 ${postObj.name}, 
									<a href="http://localhost:3000?code=${encryptedCode}#/emailConfirm">点击</a>完成注册
									<br/>
									如无法打开，请复制以下链接
									<br/>
									http://localhost:3000?code=${encryptedCode}#/emailConfirm`;
		
							let emailer = require('../mail');
							emailer.sendMail(email, emailSubject, emailContent);
						}
					}
				});
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
			(description, ip, site, wechat, email, files, usr_id)
			VALUES (?, ?, ?, ?, ?, ?, ?)`;

		conn.query(sql, [
			postObj.desc, 
			req.connection.remoteAddress, 
			postObj.site, 
			postObj.wechat, 
			postObj.email, 
			postObj.files,
			this.usrInfo.usrId || 0
		], function(err, result, fields){
			if(err)
				console.log(err.sql, err.sqlMessage) ;
			
			res.end('success');
		});
	},

	voteNextVideo: function(res, postObj, req){
		var sql = `INSERT INTO next_video 
			(sport_id, skill_id, athlete_id)
			VALUES (?, ?, ?)`;

		conn.query(sql, [
			postObj.sport, 
			postObj.skill, 
			postObj.athlete, 
		], function(err, result, fields){
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
			(sport_id, author_id, name, tag, update_time)
			VALUES (?, ?, ?, ?, ${+new Date()})`;

		conn.query(sql, [postObj.sportId, postObj.maker, postObj.name, postObj.tag], function(err, result, fields){
			if(err)
				throw err;
			// console.log(arguments);

			let albumId = result.insertId;;

			let fs = require('fs'),
				path = require('path');

			let sourceCoverPath = path.resolve(__dirname, `../../static${postObj.cover}`),
				destCoverPath = path.resolve(__dirname, `../../static/img/cover/album/` + albumId + '.jpg');// 封面格式动态 todo
				
			fs.rename(sourceCoverPath, destCoverPath, function(){
				console.log('专辑封面移动完成');
			});

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

	creatStar: function(res, postObj){
		var sql = `INSERT INTO star 
			(usr_id, name)
			VALUES (?, ?)`;

			conn.query(sql, [this.usrInfo.usrId, postObj.name], function(err, result, fields){
			if(err)
				throw err;
			// console.log(result);
			res.end(`${result.insertId}`);
		});
	},

	starVideo: function(res, postObj){

		let qSql = `select * from usr_video_star where star_id=${postObj.starId} and v_id=${postObj.vId}`;
		conn.query(qSql, function(err, result){
			if(err)
				console.log(err);

			if(result && result.length){
				let dSql = `delete from usr_video_star where star_id=${postObj.starId} and v_id=${postObj.vId}`;
				conn.query(dSql, function(){
					res.end('1');
				});
			}else{
				let iSql = `INSERT INTO usr_video_star 
					(star_id, v_id, add_time)
					VALUES (?, ?, now())`;

				conn.query(iSql, [postObj.starId, postObj.vId], function(err, result, fields){
					if(err)
						throw err;
					
					res.end();
				});
			}
		});
		
	},

	createVideoRemarks: function(res, postObj){
		let sql =  `INSERT INTO video_remark (v_id, usr_id, remark, moment) VALUES (?, ?, ?, ?)`;

		conn.query(sql, [postObj.vId, this.usrInfo.usrId, postObj.remark, postObj.moment], function (err, result, fields) {
			if (err) throw err;

			res.end();
		});
	},

	// ===============PATCH================
	// 投票
	voteVideo: function(res, patchObj){
		let voteType = patchObj.type;
		let sql = '';
		var sql2 = '';

		let voteStatus = patchObj.voteStatus;
		let needClearOther = patchObj.needClearOther;
		let vId = patchObj.vId;

		let usrId;

		let usrInfo = this.usrInfo;

		if(usrInfo && usrInfo.type == 1){
			usrId = usrInfo.usrId;

			if(voteType == 1){
				if(voteStatus == 1){
					sql = `update video set support_time=support_time+1 where id = ?`;
					if(needClearOther){
						sql = `update video set support_time=support_time+1,degrade_time=degrade_time-1 where id = ?`;
					}
				}else if(voteStatus == 0){
					sql = `update video set support_time=support_time-1 where id = ?`;
				}
			}else if(voteType == -1){
				if(voteStatus == -1){
					sql = `update video set degrade_time=degrade_time+1 where id = ?`;
					if(needClearOther){
						sql = `update video set degrade_time=degrade_time+1,support_time=support_time-1  where id = ?`
					}
				}else if(voteStatus == 0){
					sql = `update video set degrade_time=degrade_time-1 where id = ?`;
				}
			}

			conn.query(sql, [vId], function(err, result){
				if(err)
					throw err;

				collectVideoVoteInfo();
			});

			sql = `select id from usr_comment where usr_id=? and video_id=? and comment_type=?`;
			conn.query(sql, [usrId, vId, '1'], function(err, result){
				if(err)
					throw err;

				if(result && result[0]){
					sql = `update usr_comment set comment=? where usr_id=? and video_id=? and comment_type=?`;
					conn.query(sql, [voteStatus, usrId, vId, '1'], function(err, result){
						if(err)
							throw err;
					});
				}else{
					sql = `insert into usr_comment (usr_id, video_id, comment_type, comment) values (?,?,?,?)`;
					// console.log(sql);
					conn.query(sql, [usrId, vId, '1', voteStatus], function(err, result){
						if(err)
							throw err;
					});
				}
			});

			function collectVideoVoteInfo(){
				let sql = `select support_time,degrade_time from video where id=?`
				conn.query(sql, [vId], function(err, result, fields){
					if(err)
						throw err;
	
					result = result[0];
					res.end(JSON.stringify(result));
				});
			}
		}else{
			res.statusCode = 401;
			res.end();
		}
	},

	resetPsw: function(res, patchObj, req){
		let sql = `update usr set psw='${patchObj.npsw}' where psw='${patchObj.opsw}' and name='${patchObj.name}'`;
		console.log(sql);
		
		conn.query(sql, function(err, result){
			if(err)
				throw err;

			if(result.affectedRows == 1){
				res.statusMessage = 'reset password success';
				res.end();
			}else{
				res.statusCode = 401;
				res.statusMessage = 'reset password fail';
				res.end();
			}
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
module.exports.query = function (operation, params, response, request) {
	operations.usrInfo = request.usrInfo;
	clause = tools.newClause(params);
	if(clause){
		clause = ' where ' + clause;
	}
	operations[operation] && operations[operation](response, clause, params);
}

module.exports.post = function (operation, request, response, pathParams) {
	operations.usrInfo = request.usrInfo;
	var formidable = require('formidable');
	var form = new formidable.IncomingForm();

	form.parse(request, function(err, fields, files){
		pathParams && Object.assign(fields, pathParams);
		operations[operation] && operations[operation](response, fields, request);
	});
}

module.exports.patch = function (operation, request, response, pathParams) {
	operations.usrInfo = request.usrInfo;
	var formidable = require('formidable');
	var form = new formidable.IncomingForm();

	form.parse(request, function(err, fields, files){
		pathParams && Object.assign(fields, pathParams);
		operations[operation] && operations[operation](response, fields, request);
	});
}

function disposePageSql(sql, params){
	let pageNum = Number(params.pageNum),
		pageSize = Number(params.pageSize);

	if(pageNum || pageSize){
		let firstPage = pageNum * pageSize;
		sql += ` limit ${firstPage}, ${firstPage + pageSize}`;
	}

	return sql;
}