let conn = require('./connect.js').conn;
let tools = require('../tools');
let usrInfo = {};

let operations = {
	querySports: function (res, qualification, params) {
		
		let sql = 'SELECT * from sport' + qualification;
		sql = disposePageSql(sql, params);

		conn.query(sql, function (err, list, fields) {
			if (err) return throwError(err, res);

			if(params.pageSize){
				conn.query('select count(*) as count from sport', function(err, result){

					let json = JSON.stringify({
						datalist: list,
						total: result[0].count
					});
	
					res.end(json);
				})
			}else{
				result = JSON.stringify(list);
				res.end(result);
			}
		});
	},

	querySkills: function (res, qualification, params) {

		conn.query('SELECT * from skill' + qualification, function (err, result, fields) {
			if (err) return throwError(err, res);

			result = JSON.stringify(result);
			res.end(result)
		});

	},

	queryAthletes: function (res, qualification, params) {

		conn.query('SELECT * from athlete' + qualification, function (err, result, fields) {
			if (err) return throwError(err, res);

			result = JSON.stringify(result);
			res.end(result)
		});

	},

	querySport: function (res, qualification, params) {
		
		conn.query('SELECT * from sport' + qualification, function (err, result, fields) {
			if (err) return throwError(err, res);

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

		params.sport_id && (sql += ` and a.sport_id = ${params.sport_id}`);

		if(params.pageSize){
			sql = disposePageSql(sql, params);
			conn.query(sql, function (err, list, fields) {
				if (err) return throwError(err, res);
	
				let sql = '';
				if(params.sport_id){
					sql = `select count(*) as count from album where sport_id=${params.sport_id}`
				}else{
					sql = `select count(*) as count from album`
				}
	
				conn.query(sql, function(err, result){
					let json = JSON.stringify({
						datalist: list,
						total: result[0].count
					});
	
					res.end(json);
				})
			});
		}else{
			conn.query(sql, function (err, result, fields) {
				if (err) return throwError(err, res);
	
				result = JSON.stringify(result);
				res.end(result);
			});
		}
	},

	queryAlbum: function (res, qualification, params) {

		var sql = 'SELECT * from video' + qualification;
		
		sql = disposePageSql(sql, params);
		
		conn.query(sql, function (err, list, fields) {
			if (err) return throwError(err, res);
		
			conn.query(`select count(*) as count from video ${qualification}`, function(err, result){

				let json = JSON.stringify({
					datalist: list,
					total: result[0].count
				});

				res.end(json);
			})
		});

	},

	queryVideoInfo: function (res, qualification, params) {
		let sql = `SELECT
			v.*,
			(SELECT sport_id from album where id=v.album_id ) as sport_id
		FROM
			video AS v
		${qualification}`;

		conn.query(sql, function (err, result, fields) {
			if (err) return throwError(err, res);
			
			let vInfo = result[0];
			result = JSON.stringify(vInfo);
			
			res.end(result);
		});
	},

	queryAlbumInfo: function (res, qualification, params) {
		conn.query('SELECT * from album' + qualification, function (err, result, fields) {
			if (err) return throwError(err, res);
			
			let albumInfo = result[0];
			result = JSON.stringify(albumInfo);
			
			res.end(result);
		});
	},

	querySportInfo: function (res, qualification, params) {
		conn.query('SELECT * from sport' + qualification, function (err, result, fields) {
			if (err) return throwError(err, res);
			
			let sportInfo = result[0];
			result = JSON.stringify(sportInfo);
			
			res.end(result);
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
						queryVinfo();
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
							conn.query(`update tmp_usr set day_view=day_view+1,time=now() where ip='${usrIP}'`);
							dayViewLeft = constants.tmpUsrDayView - dayView - 1;
							queryVinfo();
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

		function queryVinfo(){
			conn.query('SELECT * from video' + qualification, function (err, result, fields) {
				if (err) return throwError(err, res);
				
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
			if (err) return throwError(err, res);

			result = JSON.stringify(result);

			res.end(result)
		});
	},

	queryMaker: function(res, qualification, params) {
		conn.query('SELECT * from maker' + qualification, function (err, result, fields) {
			if (err) return throwError(err, res);

			result = JSON.stringify(result);

			res.end(result)
		});
	},

	queryTag: function (res, qualification, params) {

		conn.query('SELECT * from tag' + qualification, function (err, result, fields) {
			if (err) return throwError(err, res);

			result = JSON.stringify(result);
			res.end(result);
		});

	},

	loginInfo: function(res, qualification, params){
		let usrInfo = this.usrInfo;
		
		if(usrInfo.type == 1){
			conn.query('select name, day_view, is_admin from usr where id = ' + usrInfo.usrId, function(err, result){
				if (err) return throwError(err, res);

				result = JSON.stringify(result[0]);
				res.end(result);
			});
		}else if(usrInfo.type == 2){
			res.end('')
		}
	},

	checkUsernameExist: function(res, qualification, params){
		console.log('SELECT * from usr' + qualification)
		conn.query('SELECT * from usr' + qualification, function (err, result, fields) {
			if (err) return throwError(err, res);

			if(result && result.length){
				res.end('1');
			}else{
				res.end('0');
			}
		});
	},

	checkEmailExist: function(res, qualification, params){
		conn.query('SELECT * from usr' + qualification, function (err, result, fields) {
			if (err) return throwError(err, res);

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
			if (err) return throwError(err, res);

			resData.skill = result;

			conn.query(sql2, function (err, result, fields) {
				if (err) return throwError(err, res);
				
				resData.athlete = result;

				res.end(JSON.stringify(resData));
			});
		});
	},

	queryUsrStars: function(res, qualification, params){
		let sql = 'SELECT * from star where usr_id=' + this.usrInfo.usrId;

		if(params.pageSize){
			sql = disposePageSql(sql, params);

			conn.query(sql, function (err, list, fields) {
				if (err) return throwError(err, res);
	
				conn.query('select count(*) as count from star where usr_id=' + this.usrInfo.usrId, function(err, result){
	
					let json = JSON.stringify({
						datalist: list,
						total: result[0].count
					});
	
					res.end(json);
				})
			}.bind(this));
		}else{
			conn.query(sql, function (err, list, fields) {
				if (err) return throwError(err, res);
	
				res.end(JSON.stringify(list));
			});
		}
		
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

		sql = disposePageSql(sql, params);

		conn.query(sql, function (err, list, fields) {
			if (err) return throwError(err, res);

			conn.query(`SELECT
				count(*) as count
			FROM
				usr_video_star AS us
			JOIN star AS s
			WHERE
				us.v_id = ${params.v_id}
			AND us.star_id = s.id
			AND s.usr_id=${this.usrInfo.usrId}`, function(err, result){

				let json = JSON.stringify({
					datalist: list,
					total: result[0].count
				});

				res.end(json);
			})
		}.bind(this));
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
			if (err) return throwError(err, res);

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

		sql = disposePageSql(sql, params);
		
		conn.query(sql, function (err, list, fields) {
			if (err) return throwError(err, res);

			conn.query(`SELECT
			count(*) as count
			FROM
				video
			WHERE
			id IN (
				SELECT DISTINCT
					v_id
				FROM
					usr_screenshot_star AS uss
				WHERE usr_id=${this.usrInfo.usrId}
			)`, function(err, result){

				let json = JSON.stringify({
					datalist: list,
					total: result[0].count
				});

				res.end(json);
			})
		}.bind(this));
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
			
		sql = disposePageSql(sql, params)
		
		conn.query(sql, function (err, list, fields) {
			if (err) return throwError(err, res);

			conn.query(`SELECT
				count(*) as count
				FROM
					usr_video_star as uvs
				join
					video as v
				WHERE
				uvs.star_id = ${params.star_id}
				and
				uvs.v_id = v.id`, function(err, result){

				let json = JSON.stringify({
					datalist: list,
					total: result[0].count
				});

				res.end(json);
			})
		}.bind(this));
	},

	queryUsrVshoot: function(res, qualification, params){
		let sql = `SELECT
			*
		FROM
			usr_screenshot_star
		WHERE
			v_id = ${ params.vId }
		AND usr_id = ${ this.usrInfo.usrId }`;
		sql = disposePageSql(sql, params);

		conn.query(sql, function (err, list, fields) {
			if (err) return throwError(err, res);
	
			conn.query(`SELECT
					count(*) as count
				FROM
					usr_screenshot_star
				WHERE
					v_id = ${ params.vId }
				AND usr_id = ${ this.usrInfo.usrId }`, 

			function(err, result){

				let json = JSON.stringify({
					datalist: list,
					total: result[0].count
				});

				res.end(json);
			})
		}.bind(this));
	},

	queryVideoRemarks: function(res, qualification, params){
		conn.query(`SELECT * FROM video_remark where v_id='${params.v_id}'`, function (err, result, fields) {
			if (err) return throwError(err, res);

			result = JSON.stringify(result);
			res.end(result);
		});
	},

	queryUsrVideoRemarks: function(res, qualification, params){
		conn.query(`SELECT * FROM video_remark where v_id='${params.v_id}' and usr_id=${this.usrInfo.usrId}`, function (err, result, fields) {
			if (err) return throwError(err, res);

			result = JSON.stringify(result);
			res.end(result);
		});
	},

	fetchUsrDatum: function(res, qualification, params){
		let sql = `SELECT * FROM usr_datum where usr_id=${this.usrInfo.usrId}`;
		conn.query(sql, function (err, result, fields) {
			if (err) return throwError(err, res);

			if(result && result[0]){
				result = JSON.stringify(result[0]);
				res.end(result);
			}
		});
	},

	fetchSameCityPlayer: function(res, qualification, params){
		// 因为百度地图拾取的城市名称是中文
		let city = decodeURI(params.last_login_city);
		// if(!city)
		// 	return;
		// city = city.replace('市', '');
		// const pinyin =  require('pinyin');
		// city = pinyin(city, {style: pinyin.STYLE_NORMAL, heteronym: true, segment: true });
		// city = city.join('').replace(',', '');

		let sql = `SELECT
				ud.*,
				ull.last_login_coords AS last_login_coords,
				if(ud.usr_id=${this.usrInfo.usrId}, 1, 0) as is_self
			FROM
				usr_datum AS ud
				JOIN usr_login_log AS ull
			WHERE
				ull.last_login_city = '${city}'
			AND ud.usr_id = ull.usr_id`;

		conn.query(sql, function (err, result, fields) {
			if (err) return throwError(err, res);

			if(result){
				result = JSON.stringify(result);
				res.end(result);
			}
		});
	},

	fetchCityPlayer: function(res, qualification, params){
		let sql = `SELECT count(*) as player_amount, last_login_city as city from usr_login_log GROUP BY last_login_city`;

		responseQry(sql, res)
	},

	// 查询进行中的比赛
	fetchRelatedMatches: function(res, qualification, params){
		let usrId = this.usrInfo.usrId;

		let sql = `SELECT
				*,
				(select nickname from usr_datum where usr_id = offense)  as offense_nickname,
				(select nickname from usr_datum where usr_id = defense)  as defense_nickname,
				(select wechat from usr_datum where usr_id = offense)  as offense_wechat,
				(select wechat from usr_datum where usr_id = defense)  as defense_wechat,
				(select 1 where offense=${usrId}) as offensive,
				(select 1 where defense=${usrId}) as defensive
			FROM
				competition
			WHERE
				(offense = ${usrId} OR defense = ${usrId})
			AND stage < 3`;
		
		conn.query(sql, function (err, result, fields) {
			if (err) return throwError(err, res);
	
			if(result){
				// 过滤
				let proceededResult = [];
				result.forEach(function(){
					let match = arguments[0];

					if(match.offense == usrId && match.offense_res){

					}else if(match.defense == usrId && match.defense_res){

					}else{
						proceededResult.push(match);
					}
				});

				result = JSON.stringify(proceededResult);
				res.end(result);
			}
		});
	},

	fetchFeedbackList: function(res, qualification, params){
		var sql = `SELECT
			*,(
				SELECT
					count(*)
				FROM
					black AS b
				WHERE
					b.usr_id = feedback.usr_id
			) AS black_usr_id_record ,
			(
				SELECT
					count(*)
				FROM
					black AS b
				WHERE
					b.ip = feedback.ip
			) AS black_ip_record
		FROM
			feedback
		ORDER BY
			id DESC`;

		sql = disposePageSql(sql, params);

		conn.query(sql, function(err, list, fields){
			if(err)
				console.log(err.sql, err.sqlMessage) ;
			
			conn.query('select count(*) as count from feedback', function(err, result){

				let json = JSON.stringify({
					datalist: list,
					total: result[0].count
				});

				res.end(json);
			})
		});
	},

	checkUsrDatumIntegrity: function(res, qualification, params){
		let sql = 'select nickname, wechat,level, status, avatar, sex from usr_datum where usr_id=?'
		conn.query(sql, [this.usrInfo.usrId], function(err, result, fields){
			if(err)
				console.log(err.sql, err.sqlMessage) ;
			
			let row = result[0];
			let whole = 1;
			if(row){
				for(var i in row){
					if(!row[i]){
						whole = 0;
					}
				};
			}else{
				whole = 0;
			}

			res.end(String(whole));
		});
	},

	queryPageVideos: function(res, qualification, params){
		var sql = `SELECT * from video order by update_time desc`;

		sql = disposePageSql(sql, params);

		conn.query(sql, function(err, list, fields){
			if(err)
				console.log(err.sql, err.sqlMessage) ;
			
			conn.query('select count(*) as count from video', function(err, result){

				let json = JSON.stringify({
					datalist: list,
					total: result[0].count
				});

				res.end(json);
			})
		});
	},
	
	// ===============POST================
	login: function(res, postObj, req){
		var sql = `select * from usr where name=? and psw=?`;

		conn.query(sql, [postObj.name, postObj.psw], function(err, result, fields){
			if(err)
				return throwError(err, res);

			let usr = result[0];
			if(usr && usr.id){
				let id = usr.id,
					isAdmin = usr.is_admin,
					isActive = usr.is_active;

				let info = {id: id, isAdmin: isAdmin, isActive: isActive};
				info = JSON.stringify(info);

				require('../cookie').setCookie(res, {
					name: `sid`,
					value: info,
					HttpOnly: true
				});

				if(!postObj.city){
					res.statusCode = 400;
					res.statusMessage = 'login fail';
					return res.end();
				}

				sql = `INSERT INTO usr_login_log VALUES (${id}, now(), '${postObj.ip}', '${postObj.city.toLowerCase()}', '${postObj.coords}') 
					ON DUPLICATE KEY 
					UPDATE last_login_time=now(), last_login_ip='${postObj.ip}', last_login_city='${postObj.city.toLowerCase()}', last_login_coords='${postObj.coords}';`
				
				conn.query(sql, function(err, result){
					if(err)
						console.log(err);

					if(result.affectedRows > 0){
						res.statusMessage = 'login success';
						res.end();
					}
				});
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
		ip = ip.replace('::ffff:', '');

		conn.query(`SELECT * from usr WHERE regist_ip='${ip}' and regist_time > DATE_SUB(CURRENT_TIMESTAMP(),INTERVAL 1 DAY)`, function(err, result){
			if(err)
				return throwError(err, res);

			// 1天内同个IP注册超过10个
			// 将IP加入黑名单
			if(result.length > 10){
				// conn.query('select * from black where ip == ${ip}')
				let sql = `insert into black (ip) values (${ip})`;
				conn.query(sql);

				require('../cookie').setCookie(res, {
					name: `bear`,
					value: '1',
					expires: new Date(new Date().getTime()+10*60*60*24*1000).toUTCString(),
					HttpOnly: true
				});

				res.end();
			}else{
				let code = Math.floor(Math.random() * 1000000000);
				let email = postObj.email;
		
				let sql = `INSERT INTO usr 
					(name, psw, email, active_code, regist_ip)
					VALUES (?, ?, ?, ?, ?)`;
				
		
				conn.query(sql, [postObj.name, postObj.psw, email, code, ip], function(err, result, fields){
					if(err)
						return throwError(err, res);
		
					let usrId = result.insertId;
					if(usrId){
						let info = {id: usrId, isAdmin: 0};
						info = JSON.stringify(info);
						require('../cookie').setCookie(res, {
							name: `sid`,
							value: info,
							HttpOnly: true
						});
		
						res.statusMessage = 'regist success';
						res.end(`邮件已发送至 ${email}, 请查收`);
		
						if(email){
							require('../tools.js').sendActiveEmail(usrId, postObj.name, email, code, req, res);
						}
					}
				});
			}
		});
	},

	generateVideo: function(vId, obj){
		let videoAbsPath = obj.videoAbsPath;
		let subtitleAbsPath = obj.subtitleAbsPath;

		let videoGenerator = require('../ffmpeg/generate_video');
		let tsDir = global.staticRoot + `/multimedia/ts/${vId}`;
		
		const fs = require('fs');
		
		if(videoAbsPath){
			if(!fs.existsSync(videoAbsPath)){
				return
			}
			
			const del = require('del');
			const path = require('path');

			// 如果只传视频 字幕会被误删
			del([tsDir + '/*.*', '!' + tsDir + '/subtitle', '!' + tsDir + '/subtitle.vtt']).then(paths => {
				// console.log('Deleted files and folders:\n', paths.join('\n'));
				fs.existsSync(tsDir) || fs.mkdirSync(tsDir, 0777);

				let ext = path.extname(videoAbsPath);
				let videoStorePath = global.staticRoot + `/multimedia/pristine_v/${vId}${ext}`;
				let videoGenerator = require('../ffmpeg/generate_video');
				fs.renameSync(videoAbsPath, videoStorePath);// 用于生成gif

				videoGenerator.watermark(videoStorePath, function(){
					videoGenerator.execM3U(videoStorePath, tsDir);
					videoGenerator.screenShot(videoStorePath, tsDir);
					videoGenerator.dynamicPreview(videoStorePath, tsDir, vId);
				});

				subtitleAbsPath && videoGenerator.storeSubtitle(subtitleAbsPath, tsDir);
			})
		}else{
			if(!fs.existsSync(subtitleAbsPath)){
				return
			}
			
			subtitleAbsPath && videoGenerator.storeSubtitle(subtitleAbsPath, tsDir);
		}
	},

	creatVideo: function(res, postObj){
		const path = require('path');

		let videoAbsPath = postObj.videoAbsPath;
		let ext = path.extname(videoAbsPath);

		var sql = `INSERT INTO video 
			(album_id, headline, headline_eng, tag, video_ext, update_time)
			VALUES (?, ?, ?, ?, ?, ?)`;

		conn.query(sql, [postObj.albumId, postObj.headline, postObj.headlineEng, postObj.tag, ext, +new Date()], function(err, result, fields){
			if(err)
				return throwError(err, res);

			res.end();

			// 更新album 和 sport
			let now = +new Date();
			let albumId = postObj.albumId;

			conn.query('update album set update_time = ' + now + ' where id=' + albumId);
			conn.query('update sport set update_time = ' + now + ' where id = (select sport_id from album where id = ' + albumId + ')');

			let insertId = result.insertId;
			insertId && this.generateVideo(insertId, postObj);
		}.bind(this));
	},

	creatFeedback: function(res, postObj, req){
		let ip = require('client-ip')(req);
		if(ip == '::1'){
			ip = '::ffff:127.0.0.1';
		}
		ip = ip.replace('::ffff:', '');

		var sql = `INSERT INTO feedback 
			(description, ip, site, wechat, email, files, usr_id, time)
			VALUES (?, ?, ?, ?, ?, ?, ?, now())`;

		conn.query(sql, [
			postObj.desc, 
			ip, 
			postObj.site, 
			postObj.wechat, 
			postObj.email, 
			postObj.files,
			this.usrInfo.usrId || 0
		], function(err, result, fields){
			if(err)
				console.log(err.sql, err.sqlMessage) ;
			
			res.end();
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
			
			res.end();
		});
	},

	creatTag: function(res, postObj){
		var sql = `INSERT INTO tag 
			(name, sport_id)
			VALUES (?, ?)`;

		conn.query(sql, [postObj.name, postObj.sportId], function(err, result, fields){
			if(err)
				return throwError(err, res);
			
			res.end();
		});
	},

	creatAlbum: function(res, postObj){
		var sql = `INSERT INTO album 
			(sport_id, author_id, name, tag, update_time)
			VALUES (?, ?, ?, ?, ${+new Date()})`;

		conn.query(sql, [postObj.sportId, postObj.maker, postObj.name, postObj.tag], function(err, result, fields){
			if(err)
				return throwError(err, res);

			let albumId = result.insertId;;

			let fs = require('fs'),
				path = require('path');

			let sourceCoverPath = path.resolve(__dirname, `../../static${postObj.cover}`),
				ext = path.extname(sourceCoverPath),
				destCoverPath = path.resolve(__dirname, `../../static/img/cover/album/` + albumId + ext);
				
			require('../tools.js').scaleImage(sourceCoverPath, destCoverPath);

			res.end();
		});
	},

	createMaker: function(res, postObj){
		var sql = `INSERT INTO maker 
			(name, description)
			VALUES (?, ?)`;

		conn.query(sql, [postObj.name, postObj.desc], function(err, result, fields){
			if(err)
				return throwError(err, res);
			// console.log(arguments);
			res.end();
		});
	},

	creatStar: function(res, postObj){
		var sql = `INSERT INTO star 
			(usr_id, name)
			VALUES (?, ?)`;

			conn.query(sql, [this.usrInfo.usrId, postObj.name], function(err, result, fields){
			if(err)
				return throwError(err, res);
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
						return throwError(err, res);
					
					res.end();
				});
			}
		});
		
	},

	createVideoRemarks: function(res, postObj){
		let sql =  `INSERT INTO video_remark (v_id, usr_id, remark, moment) VALUES (?, ?, ?, ?)`;

		conn.query(sql, [postObj.vId, this.usrInfo.usrId, postObj.remark, postObj.moment], function (err, result, fields) {
			if (err) return throwError(err, res);

			res.end();
		});
	},

	foundMatch: function(res, postObj, req){
		let sql = `insert into competition (offense, defense, offense_time, stage) values (${this.usrInfo.usrId}, ${postObj.defenseId}, now(), 1)`;

		conn.query(sql, function(err, result){
			if(err)
				console.log(err);

			res.end();
		});
	},

	blockUsr: function(res, postObj){
		let sql;
		if(postObj.usrId){
			conn.query(`select id from black where usr_id=${postObj.usr_id}`, function(err, result){
				
				if(!result){
					sql =  `INSERT INTO black (ip, usr_id, time) VALUES ('${postObj.ip}', ${postObj.usrId}, now())`;
					addBlack(sql);
				}else{
					res.statusCode = 400;
					res.statusMessage = 'record exist';
					res.end();
				}
			});
		}else if(postObj.ip){
			conn.query(`select id from black where ip=${postObj.ip}`, function(err, result){
				if(!result){
					sql =  `INSERT INTO black (ip, time) VALUES ('${postObj.ip}', now())`;
					addBlack(sql);
				}else{
					res.statusCode = 400;
					res.statusMessage = 'record exist';
					res.end();
				}
			});
		}

		function addBlack(sql){
			conn.query(sql, function (err, result, fields) {
				if (err) return throwError(err, res);
	
				if(result.affectedRows){
					require('../cookie').setCookie(res, {
						name: `bear`,
						value: '1',
						expires: new Date(new Date().getTime()+10*60*60*24*1000).toUTCString(),
						HttpOnly: true
					});
	
					res.end();
				}
			});
		}
	},

	creatSport: function(res, postObj, req){
		let sql = `insert into sport (name, update_time) values ('${postObj.name}', ${+new Date()})`;

		conn.query(sql, function(err, result){
			if(err)
				console.log(err);

			res.end();
		});
	},

	// ===============PATCH================
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
					return throwError(err, res);

				collectVideoVoteInfo();
			});

			sql = `select id from usr_comment where usr_id=? and video_id=? and comment_type=?`;
			conn.query(sql, [usrId, vId, '1'], function(err, result){
				if(err)
					return throwError(err, res);

				if(result && result[0]){
					sql = `update usr_comment set comment=? where usr_id=? and video_id=? and comment_type=?`;
					conn.query(sql, [voteStatus, usrId, vId, '1'], function(err, result){
						if(err)
							return throwError(err, res);
					});
				}else{
					sql = `insert into usr_comment (usr_id, video_id, comment_type, comment) values (?,?,?,?)`;
					// console.log(sql);
					conn.query(sql, [usrId, vId, '1', voteStatus], function(err, result){
						if(err)
							return throwError(err, res);
					});
				}
			});

			function collectVideoVoteInfo(){
				let sql = `select support_time,degrade_time from video where id=?`
				conn.query(sql, [vId], function(err, result, fields){
					if(err)
						return throwError(err, res);
	
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
		// console.log(sql);
		
		conn.query(sql, function(err, result){
			if(err)
				console.log( err );

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

	retrievePswEmail: function(res, patchObj, req){
		let usrname = patchObj.usrname;
		let code = Math.floor(Math.random() * 1000000000);
		let sql = `update usr set retrieve_code=${code} where name='${usrname}'`;

		conn.query(sql, function(err, result){
			if(err){
				console.log(err);
			}

			if(result.affectedRows){
				
				let codeStr = JSON.stringify({
					name: usrname,
					code: code
				});
		
				let crypto = require('../crypto.js');
				let encryptedCode = crypto.aesEncrypt(codeStr, require('../constant').aesKey);
		
				let emailSubject = 'yitube找回密码',
					link = `${req.headers.referer}?retrievePswCode=${encryptedCode}`,
					emailContent = `你好 ${usrname}, 点击或复制链接完成密码重置
						<br/><a href="${link}">${link}</a>`;
		
				let emailer = require('../mail');

				sql = `select email from usr where name='${usrname}'`;
				conn.query(sql, function(err, result){
					if(err)
						console.log(err);
					
					if(result[0]){
						emailer.sendMail(result[0].email, emailSubject, emailContent);
						res.end(`邮件已发送至 ${result[0].email}`);
					}
				});
			}else{
				res.statusCode = 400;
				return res.end()
			}
		})
	},

	retrievePsw: function(res, patchObj, req){
		let code = patchObj.code;
		let crypto = require('../crypto.js');
		let encryptedCode = crypto.aesDecrypt(code, require('../constant').aesKey);
		encryptedCode = JSON.parse(encryptedCode);

		let sql = `update usr set psw='${patchObj.npsw}' where name='${encryptedCode.name}' and retrieve_code='${encryptedCode.code}'`;

		conn.query(sql, function(err, result){
			if(err)
				console.log(err);

			if(result && result.affectedRows == 1){
				res.end();
			}else{
				res.statusCode = 400;
				res.end();
			}
		})
	},

	resetPsw: function(res, patchObj, req){
		let sql = `update usr set psw='${patchObj.npsw}' where psw='${patchObj.opsw}' and name='${patchObj.name}'`;
		// console.log(sql);
		
		conn.query(sql, function(err, result){
			if(err)
				console.log( err );

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

	updateUsrDatum: function(res, patchObj, req){
		// 移动头像位置
		var path = require('path');
		var fs = require('fs');

		var avatarExt = path.extname(patchObj.avatar);

		var usrId = this.usrInfo.usrId;
		var srcPath = path.join(global.staticRoot, './' + patchObj.avatar);
		
		var pathStored = '/img/avatar/' + usrId + avatarExt;
		if(fs.existsSync(srcPath)){
			var desPath = path.resolve(global.staticRoot, '.' + pathStored);

			require('../tools.js').scaleImage(srcPath, desPath, require('../constant.js').avtarThumbWidth, updateData)
		}else{
			updateData();
		}

		function updateData(){
			let sql = `
				insert into usr_datum values(${usrId}, '${patchObj.nickname}', '${patchObj.wechat}', '${patchObj.level}', '${patchObj.status}', '${pathStored}', 0, 0, ${patchObj.sex}) 
				ON DUPLICATE KEY 
				update nickname='${patchObj.nickname}',wechat='${patchObj.wechat}', level='${patchObj.level}', status='${patchObj.status}', avatar='${pathStored}', sex=${patchObj.sex}`;
			
			conn.query(sql, function(err, result){
				if(err)
					return throwError(err, res);
	
				if(result.affectedRows > 0){
					res.statusMessage = 'update usrinfo success';
					res.end();
				}
			});
		}
	},

	acceptChallenge: function(res, patchObj, req){
		let sql = `update competition set stage=2, defense_time=now() where id=${patchObj.matchId}`;
		conn.query(sql, function(err, result){
			if(err)
				console.log(err);

			res.end();
		});
	},
	
	markMatchResult: function(res, patchObj, req){
		let sql = `select * from competition where id=${patchObj.matchId}`;
		let usrId = this.usrInfo.usrId;
		conn.query(sql, function(err, result){
			if(err)
				console.log(err);

			if(result && result[0]){
				let offenseUsrId = result[0].offense;
				let defenseUsrId = result[0].defense;
				let offenseRes = result[0].offense_res;
				let defenseRes = result[0].defense_res;
				let offenseTime = +result[0].offense_time;
				let defenseTime = +result[0].defense_time;
				let NOW = +new Date();
				let ONEDAY = 1 * 24 * 60 * 60 *1000;

				let usrMarkedResult = patchObj.result;
				let doMatchClose = false;

				if(offenseUsrId == usrId){
					if(NOW - offenseTime < ONEDAY){
						res.statusCode = 400;
						res.statusMessage = 'should mark later';
						return res.end();
					}

					if(defenseRes){
						doMatchClose = true;
						sql = `update competition set offense_res=${usrMarkedResult}, stage=3, close_time=now() where id=${patchObj.matchId}`;
					}else
						sql = `update competition set offense_res=${usrMarkedResult} where id=${patchObj.matchId}`;
					
				}else if(defenseUsrId == usrId){
					if(NOW - defenseTime < ONEDAY){
						res.statusCode = 400;
						res.statusMessage = 'should mark later';
						return res.end();
					}

					if(offenseRes){
						doMatchClose = true;
						sql = `update competition set defense_res=${usrMarkedResult}, stage=3, close_time=now() where id=${patchObj.matchId}`;
					}else
						sql = `update competition set defense_res=${usrMarkedResult} where id=${patchObj.matchId}`;
				}

				let offenseDefense = defenseRes * usrMarkedResult;
				// 1 2 || 2 1 || 3 3
				if(doMatchClose){
					if(offenseDefense != 2 && offenseDefense != 9){
						res.statusCode = 400;
						res.statusMessage = 'match result error';
						return res.end();
					}
					// 修改 usr 胜负
				}

				conn.query(sql, function(err, result){
					if(err)
						console.log(err);

					res.end();
				});
			}
		})
	},

	// ===============DELETE================
	deleteFeedback: function (res, deleteObj, req) {
		
		let sql = 'delete from feedback where id=?';

		conn.query(sql, [deleteObj.id], function (err, result, fields) {
			if (err) return throwError(err, res);

			if(result.affectedRows == 1)
				res.end()
		});

	},

	deleteVideo: function (res, deleteObj, req) {
		let vId = deleteObj.id;
		let sql = `delete from video where id=${vId}`;

		conn.query(sql, function (err, result, fields) {
			if (err) return throwError(err, res);

			if(result.affectedRows == 1)
				res.end()

			// 删除文件
			let del = require('del');
			let pristineVideoPath = global.staticRoot + '/multimedia/pristine_v/' + vId + '.mp4';
			let tsVideoPath = global.staticRoot + '/multimedia/ts/' + vId;

			del([pristineVideoPath, tsVideoPath]).then(paths => {
				console.log('Deleted files and folders:\n', paths.join('\n'));
			});
		});

	},
	
	deleteSport: function (res, deleteObj, req) {
		
		let sql = 'delete from sport where id=?';

		conn.query(sql, [deleteObj.id], function (err, result, fields) {
			if (err) return throwError(err, res);

			if(result.affectedRows == 1)
				res.end()
		});

	},

	// ===============PUT================
	updateVideoInfo: function(res, postObj){
		let vId = postObj.id;
		var sql = `update video set album_id=?, headline=?, headline_eng=?, tag=?, update_time=? where id=${postObj.id}`;

		conn.query(sql, [postObj.albumId, postObj.headline, postObj.headlineEng, postObj.tag, +new Date()], function(err, result, fields){
			if(err)
				return throwError(err, res);

			res.end();

			// 更新album 和 sport
			let now = +new Date();
			let albumId = postObj.albumId;

			conn.query('update album set update_time = ' + now + ' where id=' + albumId);
			conn.query('update sport set update_time = ' + now + ' where id = (select sport_id from album where id = ' + albumId + ')');

			vId && this.generateVideo(vId, postObj);
		}.bind(this));
	},

	updateAlbumInfo: function(res, putObj){
		var sql = `update album set sport_id=?, author_id=?, tag=?, update_time=? where id=${putObj.id}`;

		conn.query(sql, [putObj.sportId, putObj.maker, putObj.tag, +new Date()], function(err, result, fields){
			if(err)
				return throwError(err, res);
				
			if(result.affectedRows){
				res.end();

				if(putObj.cover){
					let fs = require('fs'),
						path = require('path');
	
					let sourceCoverPath = path.resolve(global.staticRoot, `./${putObj.cover}`),
						ext = path.extname(sourceCoverPath),
						destCoverPath = path.resolve(global.staticRoot, `./img/cover/album/` + putObj.id + ext);// 封面格式动态 todo
						
					require('../tools.js').scaleImage(sourceCoverPath, destCoverPath);
				}
				conn.query('update sport set update_time = ' + (+new Date()) + ' where id = (select sport_id from album where id = ' + putObj.id + ')');
			}
		});
	},

	updateSportInfo:function(res, putObj){
		var sql = `update sport set name=?, update_time=? where id=${putObj.id}`;

		conn.query(sql, [putObj.name, +new Date()], function(err, result, fields){
			if(err)
				return throwError(err, res);
				
			if(result.affectedRows){
				res.end();
			}
		});
	},
}

// 执行SQL
module.exports.excuteSQL = function (sql, res, fn) {
	conn.query(sql,  function(err, result, fields){
		if(err)
			return throwError(err, res);
		
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

module.exports.put = function (operation, request, response, pathParams) {
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

module.exports.delete = function (operation, request, response, pathParams) {
	operations.usrInfo = request.usrInfo;
	var formidable = require('formidable');
	var form = new formidable.IncomingForm();

	form.parse(request, function(err, fields, files){
		pathParams && Object.assign(fields, pathParams);
		operations[operation] && operations[operation](response, fields, request);
	});
}

function responseQry(sql, res, single){
	conn.query(sql, function (err, result, fields) {
		if (err) return throwError(err, res);

		if(result){
			if(single){
				if(result[0]){
					result = JSON.stringify(result[0]);
					res.end(result)
				}
			}else{
				result = JSON.stringify(result);
				res.end(result);
			}
		}
	});
}

function disposePageSql(sql, params){
	let pageNum = Number(params.pageNum),
		pageSize = Number(params.pageSize);

	if(pageNum || pageSize){
		let firstPage = pageNum * pageSize;
		sql += ` limit ${firstPage}, ${pageSize}`;
	}

	return sql;
}

function throwError(err, res){
	var errCode = err.code;

	res.statusCode = 500;
	res.end(JSON.stringify({
		erorCode: errCode
	}))
}