let conn = require('./connect.js');// 一次性代码，因闭包会产生全局变量，在不同用户之间共享
let tools = require('../tools');

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
		params.sortBy && (sql += ` order by ${params.sortBy}`);
		params.sortOrd && (sql += ` ${params.sortOrd}`);

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

		let sql = 'SELECT * from video' + qualification;
		
		sql = disposePageSql(sql, params);
		
		let r = /headline=\S+/;
		if(sql.match(r)){
			sql = sql.replace(r, `headline like '%${params.headline}%'`)
		}

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

	queryVideoIntroInfo: function (res, qualification, params) {
		let sql = `SELECT * from video_introductory ${qualification}`;

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

				if(!vInfo){
					return;
				}
				
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

	queryVideoTranslatorInfo: function(res, qualification, params) {
		conn.query('SELECT duration from video' + qualification, function (err, result, fields) {
			if (err) return throwError(err, res);

			result = JSON.stringify(result);

			res.end(result)
		});
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
			conn.query('select id, name, day_view, is_admin from usr where id = ' + usrInfo.usrId, function(err, result){
				if (err) return throwError(err, res);

				result = JSON.stringify(result[0]);
				res.end(result);
			});
		}else if(usrInfo.type == 2){
			res.end('')
		}
	},

	checkUsernameExist: function(res, qualification, params){
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
				name_en
			FROM
				tennis.athlete
			WHERE
				id_tennis_com = athlete_id
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

	queryVideoStarsContainTheVideo: function(res, qualification, params){
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

		// sql = disposePageSql(sql, params);

		conn.query(sql, function (err, list, fields) {
			if (err) return throwError(err, res);

			// conn.query(`SELECT
			// 	count(*) as count
			// FROM
			// 	usr_video_star AS us
			// JOIN star AS s
			// WHERE
			// 	us.v_id = ${params.v_id}
			// AND us.star_id = s.id
			// AND s.usr_id=${this.usrInfo.usrId}`, function(err, result){

			// 	let json = JSON.stringify({
			// 		datalist: list,
			// 		total: result[0].count
			// 	});

			// 	res.end(json);
			// })
			let data = JSON.stringify(list)
			res.end(data);
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
		AND usr_id = ${ this.usrInfo.usrId } 
		AND type = ${ params.type }`;

		sql = disposePageSql(sql, params);

		conn.query(sql, function (err, list, fields) {
			if (err) return throwError(err, res);

			let json = JSON.stringify({
				datalist: list,
				total: list.length
			});

			res.end(json);
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

		let bSql = `SELECT usr_id FROM compete_black WHERE recorder_id = ${this.usrInfo.usrId} GROUP BY usr_id`;
		conn.query(bSql, function(err, competeBlacks){
			
			let blackIds = [];
			competeBlacks.forEach(function(black){
				blackIds.push(black.usr_id);
			});

			conn.query(sql, function (err, players, fields) {
				if (err) return throwError(err, res);
	
				if(players){
					if(blackIds.length){
						players.forEach(function(p){
							if(blackIds.indexOf(p.usr_id) > -1){
								p.isBlack = true;
							}
						});
					}

					players = JSON.stringify(players);
					res.end(players);
				}
			});
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
				(select nickname from usr_datum where usr_id = c.offense)  as offense_nickname,
				(select nickname from usr_datum where usr_id = c.defense)  as defense_nickname,
				(select wechat from usr_datum where usr_id = c.offense)  as offense_wechat,
				(select wechat from usr_datum where usr_id = c.defense)  as defense_wechat,
				(select tel from usr_datum where usr_id = c.offense)  as offense_tel,
				(select tel from usr_datum where usr_id = defense)  as defense_tel,
				(select 1 where offense=${usrId}) as offensive,
				(select 1 where defense=${usrId}) as defensive
			FROM
				competition as c
			WHERE
				(offense = ${usrId} OR defense = ${usrId})
			AND stage < 3`;
		
		conn.query(sql, function (err, result, fields) {
			if (err) return throwError(err, res);
	
			if(result){
				let proceededResult = [];
				result.forEach(function(){
					let match = arguments[0];

					if(
						(match.offensive && !match.offense_res) ||
						(match.defensive && !match.defense_res)
					){
						isUnAccepted(match) || proceededResult.push(match);
					}
				});

				result = JSON.stringify(proceededResult);
				res.end(result);
			}
		});

		function isUnAccepted(match){
			if(match.stage === 1){
				let offenseTime = match.offense_time.getTime();
				let now = Date.now();
				const day = 1 * 24 * 60 * 60 * 1000;

				if(now - offenseTime > 7 * day){
					return true;
				}
			}
		}
	},

	fetchFeedbackList: function(res, qualification, params){
		var sql = `SELECT
			*
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
		let sql = 'select nickname,level, status, avatar, sex from usr_datum where usr_id=?'
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

	queryVideosAdmin: function(res, qualification, params){
		var sql = `SELECT * from video order by id desc`;

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

	queryVideosIntroAdmin: function(res, qualification, params){
		var sql = `SELECT * from video_introductory order by id desc`;

		sql = disposePageSql(sql, params);

		conn.query(sql, function(err, list, fields){
			if(err)
				console.log(err.sql, err.sqlMessage) ;
			
			conn.query('select count(*) as count from video_introductory', function(err, result){

				let json = JSON.stringify({
					datalist: list,
					total: result[0].count
				});

				res.end(json);
			})
		});
	},

	fetchInmails: function(res, qualification, params){
		var sql = `SELECT * from inmail where receiver=${this.usrInfo.usrId} and readed=0 order by id desc`;

		conn.query(sql, function(err, list, fields){
			if(err)
				console.log(err.sql, err.sqlMessage) ;
			
			let json = JSON.stringify(list);

			res.end(json);
		});
	},

	fetchUsrPosts: function(res, qualification, params){
		// todo 未被审核 并且 未被查看的 
		var sql = `SELECT * from usr_post where isnull(checkor) and not find_in_set(${this.usrInfo.usrId}, readers) order by id desc`;

		conn.query(sql, function(err, list, fields){
			if(err)
				console.log(err.sql, err.sqlMessage) ;
			
			let json = JSON.stringify(list);

			res.end(json);
		});
	},

	fetchCaptionDrafts: function(res, qualification, params){
		const fs = require('fs');
		const path = require('path');

		let captionDir = path.resolve(global.staticRoot, `multimedia/ts/${params.vId}`);

		fs.readdir(captionDir, function(err, files){
			let drafts = [];
			files.forEach(function(file){
				let reg = /subtitle\.(\d+)$/;
				let fileMatch = file.match(reg);
				if(fileMatch){
					drafts.push(Number(fileMatch[1]));
				}
			})

			let json = JSON.stringify(drafts)
			res.end(json);
		})

		// var sql = `SELECT * from inmail where receiver=${this.usrInfo.usrId} and readed=0 order by id desc`;

		// conn.query(sql, function(err, list, fields){
		// 	if(err)
		// 		console.log(err.sql, err.sqlMessage) ;
			
		// 	let json = JSON.stringify(list);

		// 	res.end(json);
		// });
	},

	fetchIntroVideoIndex: function(res, qualification, params){
		var sql = `SELECT id from video_introductory where sport_id=${params.sId}`;

		conn.query(sql, function(err, list, fields){
			if(err)
				return throwError(err, res);
			
			let json = JSON.stringify(list);

			res.end(json);
		});
	},

	isMapper: function(res, qualification, params){
		let usrInfo = this.usrInfo;
		let usrId = usrInfo.usrId;

		if(usrInfo.type == 1 && usrInfo.isAdmin == 1){
			let sql = `select is_mapper from usr where id=${usrId}`;

			conn.query(sql, function(err, list, fields){
				if(err)
					return throwError(err, res);
	
				if(list && list[0]){
					let isMapper = list[0]['is_mapper'];
	
					if(isMapper){
						return res.end('1')
					}
				}
	
				res.end('0')
			});
		}else{
			return res.end('0')
		}
	},

	checkVttSituation: function(res, qualification, params){

		const fs = require('fs');
		const path = require('path');
		
		let isTutorial = params.isTutorial;
		let vId = params.vId;

		let relativePath = [`./multimedia/ts_introductory/${vId}/`, `./multimedia/ts/${vId}/`][isTutorial];
		let absPath = path.resolve(global.staticRoot, relativePath);
		
		let data = {
			zh: fs.existsSync(path.resolve(absPath, 'subtitle.zh.vtt')),
			en: fs.existsSync(path.resolve(absPath, 'subtitle.vtt'))
		}

		res.end(JSON.stringify(data));

	},

	queryUsrPostLately: function(res, qualification, params){
		let usrInfo = this.usrInfo;
		let usrId = usrInfo.usrId;

		if(usrInfo.isAdmin == 1){
			//  where DATE_SUB(CURDATE(), INTERVAL 30 DAY) <= date(time)
			let sql = `select * from usr_post where not in readers`;

			conn.query(sql, function(err, list, fields){
				if(err)
					return throwError(err, res);
	
				res.end('0')
			});
		}else{
			return res.end('0')
		}
	},

	// =========== 网球统计 开始
	// 可用于API或SSR

	queryTopPlayer: function (res, qualification, params) {
		
		conn.query(`select now() > top_expire as is_expire from tennis.athlete where is_top=1`, function(err, rows){
			if(err) return throwError(err, res);

			if(!rows[0] || rows[0].is_expire){
				let file = require('path').resolve(__dirname, '../collector/tennis/top_player.js');

				tools.spawn([file], function(){
					query();
				}, res)
			}else{
				query();
			}
		})
		
		function query(){
			let sql = `select * from tennis.athlete where is_top=1`;

			conn.query(sql , function (err, result, fields) {
				if (err) return throwError(err, res);
				
				if(!res.dynamicDataSet){
					result = JSON.stringify(result);
					res.end(result)
				}else{
					res.dynamicDataSet[params.ssrOutput || 'top'] = result;
				}
			});
		}
	},

	queryTennisRanking: function (res, qualification, params) {
		let gender = [];
		if(!params.type)
			gender = [1,2]

		else{
			params.type = params.type.toLowerCase();

			let typeIds = {'atp': 1, 'wta':2};
			gender.push(typeIds[params.type]);
		}

		
		conn.query(`select now() > ranking_expire as is_expire from tennis.athlete where gender in (${gender.join(',')})`, function(err, rows){
			if(err) return throwError(err, res);

			if(!rows[0] || rows[0].is_expire){
				let file = require('path').resolve(__dirname, '../collector/tennis/ranking.js');

				let i = 0;
				gender.forEach((v)=>{
					tools.spawn([file, v], function(){
						if(++i == gender.length){
							query();
						}
					}, res)
				})
				
			}else{
				query();
			}
		})
		
		function query(){
			let sql = `select * from tennis.athlete where gender in (${gender.join(',')})`;

			conn.query(sql , function (err, result, fields) {
				if (err) return throwError(err, res);
				
				if(!res.dynamicDataSet){
					result = JSON.stringify(result);
					res.end(result)
				}else{
					result.params = params;
					res.dynamicDataSet[params.ssrOutput || 'ranking'] = result;
				}
			});
		}
	},

	queryTennisPlayerStat: function (res, qualification, params) {
		let sql = `select *, now()>stat_expire as is_expire from tennis.athlete where id_tennis_com=${params.playerId}`;

		conn.query(sql, function(err, rows){
			if(err) return throwError(err, res);

			if(!rows[0]|| !rows[0].stat_expire || rows[0].is_expire){
				let file = require('path').resolve(__dirname, '../collector/tennis/player_stat.js');
				let name = rows[0]['name_en'].toLowerCase().replace(/\W+/g, '-');

				tools.spawn([file, params.playerId, name], query, res)
			}else{
				query();
			}
		})

		function query(){
			conn.query(sql , function (err, result, fields) {
				if (err) return throwError(err, res);
				
				result = result[0];

				if(!res.dynamicDataSet){
					result = JSON.stringify(result);
					res.end(result)
				}else{
					res.dynamicDataSet[params.ssrOutput || 'stat'] = result;
				}
			});
		}
	},

	queryTennisPlayerBio: function (res, qualification, params) {
		let sql = `select *, now()>bio_expire as is_expire from tennis.athlete where id_tennis_com=${params.playerId}`;

		conn.query(sql, function(err, rows){
			if(err) return throwError(err, res);

			if(!rows[0] || !rows[0].bio_expire || rows[0].is_expire){
				let file = require('path').resolve(__dirname, '../collector/tennis/player_bio.js');
				let name = rows[0]['name_en'].toLowerCase().replace(/\W+/g, '-');

				tools.spawn([file, params.playerId, name], query, res)
			}else{
				query();
			}
		})

		function query(){
			conn.query(sql , function (err, result, fields) {
				if (err) return throwError(err, res);
				
				result = result[0];

				if(!res.dynamicDataSet){
					result = JSON.stringify(result);
					res.end(result)
				}else{
					res.dynamicDataSet[params.ssrOutput || 'bio'] = result;
				}
			});
		}
	},

	queryTennisPlayerGear: function (res, qualification, params) {
		let sql = `select *, now()>gear_expire as is_expire from tennis.athlete where id_tennis_com=${params.playerId}`;

		conn.query(sql, function(err, rows){
			if(err) return throwError(err, res);

			if(!rows[0] || !rows[0].gear_expire || rows[0].is_expire){
				let file = require('path').resolve(__dirname, '../collector/tennis/player_gear.js');
				let name = rows[0]['name_en'].toLowerCase().replace(/\W+/g, '-');

				tools.spawn([file, params.playerId, name], query, res)
			}else{
				query();
			}
		})

		function query(){
			conn.query(sql , function (err, result, fields) {
				if (err) return throwError(err, res);
				
				result = result[0];

				if(!res.dynamicDataSet){
					result = JSON.stringify(result);
					res.end(result)
				}else{
					res.dynamicDataSet[params.ssrOutput || 'gear'] = result;
				}
			});
		}
	},

	headToHead: function (res, qualification, params) {
		let sql = `select h2h.*, now()>h2h.expire as is_expire from tennis.h2h as h2h where p1=${params.p1} and p2=${params.p2}`

		conn.query(sql, function(err, rows){
			if(err) return throwError(err, res);

			let row = rows[0];
			if(!row || row.is_expire){

				let sql2 = `select name_en from tennis.athlete where id_tennis_com in (${params.p1}, ${params.p2});`
				conn.query(sql2, function(err, result, fields) {
					if (err) return throwError(err, res);
				
					let name1 = result[0]['name_en'],
						name2 = result[1]['name_en'];

					name1 = name1.trim().toLowerCase().replace(/\W+/g, '-'),
					name2 = name2.trim().toLowerCase().replace(/\W+/g, '-');

					let file = require('path').resolve(__dirname, '../collector/tennis/player_h2h.js');

					tools.spawn([file, params.p1, name1, params.p2, name2], query, res)
				})
			}else{
				query();
			}
		})

		function query(){
			conn.query(sql , function (err, result, fields) {
				if (err) return throwError(err, res);
				
				result = result[0];
				result.p1 = params.p1;
				result.p2 = params.p2;

				if(!res.dynamicDataSet){
					result = JSON.stringify(result);
					res.end(result)
				}else{
					res.dynamicDataSet[params.ssrOutput || 'h2h'] = result;
				}
			});
		}
	},

	queryTournament: function (res, qualification, params) {
		
		conn.query(`select now() > expire as is_expire from tennis.tournament`, function(err, rows){
			if(err) return throwError(err, res);

			if(!rows[0] || rows[0].is_expire){
				let file = require('path').resolve(__dirname, '../collector/tennis/tournament.js');

				tools.spawn([file], function(){
					query();
				}, res)
			}else{
				query();
			}
		})
		
		function query(){
			let sql = `select * from tennis.tournament`;

			conn.query(sql , function (err, result, fields) {
				if (err) return throwError(err, res);
				
				if(!res.dynamicDataSet){
					result = JSON.stringify(result);
					res.end(result)
				}else{
					res.dynamicDataSet[params.ssrOutput || 'tournaments'] = result;
				}
			});
		}
	},

	queryTournamentDailySchedule: function(res, qualification, params){
		// http://localhost:3100/tennis/tournaments/858254

		let sql = `select start_time,end_time from tennis.tournament where sid=${params.sid}`;

		conn.query(sql , function (err, result, fields) {
			if (err) return throwError(err, result);
			
			let maxTime = result[0].end_time,
				minTime = result[0].minTime;

			let date = calcTimeZoneDate(params.offset || 0);
			
			let dataSource = `http://ace.tennis.com/pulse/${date}_livescores_new.json`;

			// tools.fetchHTML(dataSource, function(data){
				let data = `{"tournaments": [{"importance": 3, "surface": "Hard", "id": "858253", "startdate": "2019-04-01 00:00:00", "slug": "2019-monterrey-open-wta-womens-singles", "enddate": "2019-04-07 23:59:59", "name": "WTA Monterrey: Abierto GNP Seguros", "country": "Mexico", "events": [{"status": "Finished", "id": "3020350", "players": [{"shoes": "", "is_winner": false, "seed": "5", "set_games": ["1", "1"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "48821", "name": "Victoria Azarenka", "shirt": "", "url": "/player/577/victoria-azarenka/", "country": "BY", "is_serving": false, "country_name": "Belarus"}, {"shoes": "", "is_winner": true, "seed": "2", "set_games": ["6", "3"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "298344", "name": "Garbine Muguruza", "shirt": "", "url": "/player/721/garbine-muguruza/", "country": "ES", "is_serving": false, "country_name": "Spain"}], "duration": "01:26:33", "head_to_head_url": "/players/577/victoria-azarenka/vs/721/garbine-muguruza/", "round": "Championship"}], "location": "Monterrey", "gender": "female", "order": 1, "hero_image_url": "http://media-tenniscdn-com.s3.amazonaws.com/uploads/img/2019/04/05/a6f99229f0e14193980fe1ba5c766253.jpg"}, {"importance": 3, "surface": "Clay", "id": "858254", "startdate": "2019-04-01 00:00:00", "slug": "2019-volvo-car-open-wta-womens-singles", "enddate": "2019-04-07 23:59:59", "name": "WTA Charleston: Volvo Car Open", "country": "United States", "events": [{"status": "Finished", "id": "3020331", "players": [{"shoes": "", "is_winner": true, "seed": "8", "set_games": ["7", "6"], "racket": "", "tiebreak_games": ["7", "", "", "", ""], "id": "169212", "name": "Madison Keys", "shirt": "", "url": "/player/724/madison-keys/", "country": "US", "is_serving": false, "country_name": "United States"}, {"shoes": "", "is_winner": false, "seed": "5", "set_games": ["6", "3"], "racket": "", "tiebreak_games": ["5", "", "", "", ""], "id": "48790", "name": "Caroline Wozniacki", "shirt": "", "url": "/player/570/caroline-wozniacki/", "country": "DK", "is_serving": false, "country_name": "Denmark"}], "duration": "01:45:57", "head_to_head_url": "/players/724/madison-keys/vs/570/caroline-wozniacki/", "round": "Championship"}], "location": "Charleston", "gender": "female", "order": 0, "hero_image_url": "http://media-tenniscdn-com.s3.amazonaws.com/uploads/img/2019/04/05/308e19cdea31432d83be3c74a1074354.jpg"}, {"importance": 3, "surface": "Clay", "id": "858267", "startdate": "2019-04-06 00:00:00", "slug": "2019-claro-open-colsanitas-qualification-wta-womens-singles", "enddate": "2019-04-08 23:59:59", "name": "2019 Claro Open Colsanitas, Qualification WTA (Women's Singles)", "country": "Colombia", "events": [{"status": "Finished", "id": "3020295", "players": [{"shoes": "", "is_winner": true, "seed": "3", "set_games": ["7", "6"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "292676", "name": "Bibiane Schoofs", "shirt": "", "url": "", "country": "NL", "is_serving": false, "country_name": "Netherlands"}, {"shoes": "", "is_winner": false, "seed": "10", "set_games": ["5", "3"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "149397", "name": "Kristie Ahn", "shirt": "", "url": "/player/1251/kristie-ahn/", "country": "US", "is_serving": false, "country_name": "United States"}], "duration": "01:40:06", "head_to_head_url": "", "round": "Round of 16"}, {"status": "Finished", "id": "3020304", "players": [{"shoes": "", "is_winner": true, "seed": "1", "set_games": ["1", "6", "6"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "408774", "name": "Aliona Bolsova", "shirt": "", "url": "", "country": "ES", "is_serving": false, "country_name": "Spain"}, {"shoes": "", "is_winner": false, "seed": "wc", "set_games": ["6", "2", "0"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "393972", "name": "Maria Herazo", "shirt": "", "url": "", "country": "CO", "is_serving": false, "country_name": "Colombia"}], "duration": "01:26:38", "head_to_head_url": "", "round": "Round of 16"}, {"status": "Finished", "id": "3020317", "players": [{"shoes": "", "is_winner": false, "seed": "6", "set_games": ["6", "5", "1"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "665064", "name": "Francesca Di Lorenzo", "shirt": "", "url": "", "country": "US", "is_serving": false, "country_name": "United States"}, {"shoes": "", "is_winner": true, "seed": "7", "set_games": ["4", "7", "6"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "386081", "name": "Beatriz Haddad Maia", "shirt": "", "url": "/player/1148/beatriz-haddad-maia/", "country": "BR", "is_serving": false, "country_name": "Brazil"}], "duration": "02:37:11", "head_to_head_url": "", "round": "Round of 16"}, {"status": "Finished", "id": "3020328", "players": [{"shoes": "", "is_winner": false, "seed": "", "set_games": ["6", "1", "5"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "386124", "name": "Hiroko Kuwata", "shirt": "", "url": "/player/1214/hiroko-kuwata/", "country": "JP", "is_serving": false, "country_name": "Japan"}, {"shoes": "", "is_winner": true, "seed": "", "set_games": ["3", "6", "7"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "245251", "name": "Chloe Paquet", "shirt": "", "url": "/player/1164/chloe-paquet/", "country": "FR", "is_serving": false, "country_name": "France"}], "duration": "02:22:05", "head_to_head_url": "/players/1214/hiroko-kuwata/vs/1164/chloe-paquet/", "round": "Round of 16"}, {"status": "Finished", "id": "3020343", "players": [{"shoes": "", "is_winner": false, "seed": "", "set_games": ["2", "6", "3"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "48876", "name": "Sara Errani", "shirt": "", "url": "/player/588/sara-errani/", "country": "IT", "is_serving": false, "country_name": "Italy"}, {"shoes": "", "is_winner": true, "seed": "9", "set_games": ["6", "3", "6"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "386843", "name": "Jasmine Paolini", "shirt": "", "url": "/player/1518/jasmine-paolini/", "country": "IT", "is_serving": false, "country_name": "Italy"}], "duration": "01:33:13", "head_to_head_url": "/players/588/sara-errani/vs/1518/jasmine-paolini/", "round": "Round of 16"}, {"status": "Finished", "id": "3020345", "players": [{"shoes": "", "is_winner": true, "seed": "5", "set_games": ["3", "6", "6"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "386351", "name": "Irina Bara", "shirt": "", "url": "/player/1219/irina-bara/", "country": "RO", "is_serving": false, "country_name": "Romania"}, {"shoes": "", "is_winner": false, "seed": "", "set_games": ["6", "2", "3"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "240060", "name": "Elitsa Kostova", "shirt": "", "url": "/player/1194/elitsa-kostova/", "country": "BG", "is_serving": false, "country_name": "Bulgaria"}], "duration": "04:05:21", "head_to_head_url": "/players/1219/irina-bara/vs/1194/elitsa-kostova/", "round": "Round of 16"}], "location": "Bogota", "gender": "female", "order": 0, "hero_image_url": ""}, {"importance": 3, "surface": "Clay", "id": "858268", "startdate": "2019-04-07 00:00:00", "slug": "2019-swiss-womens-championship-qualification-wta-womens-singles", "enddate": "2019-04-09 23:59:59", "name": "2019 Swiss Women's Championship, Qualification WTA (Women's Singles)", "country": "Switzerland", "events": [{"status": "Cancelled", "id": "3020219", "players": [{"shoes": "", "is_winner": null, "seed": "1", "set_games": [], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "386069", "name": "Tereza Smitkova", "shirt": "", "url": "/player/781/tereza-smitkova/", "country": "CZ", "is_serving": false, "country_name": "Czech Republic"}, {"shoes": "", "is_winner": null, "seed": "", "set_games": [], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "299104", "name": "Tereza Mrdeza", "shirt": "", "url": "/player/1360/tereza-mrdeza/", "country": "HR", "is_serving": false, "country_name": "Croatia"}], "duration": "N/A", "head_to_head_url": "/players/781/tereza-smitkova/vs/1360/tereza-mrdeza/", "round": "Round of 32"}, {"status": "Finished", "id": "3020220", "players": [{"shoes": "", "is_winner": true, "seed": "wc", "set_games": ["6", "6"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "885683", "name": "Clara Tauson", "shirt": "", "url": "", "country": "DK", "is_serving": false, "country_name": "Denmark"}, {"shoes": "", "is_winner": false, "seed": "12", "set_games": ["1", "2"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "386723", "name": "Rebecca Sramkova", "shirt": "", "url": "/player/1333/rebecca-sramkova/", "country": "SK", "is_serving": false, "country_name": "Slovakia"}], "duration": "00:52:54", "head_to_head_url": "", "round": "Round of 32"}, {"status": "Finished", "id": "3020221", "players": [{"shoes": "", "is_winner": true, "seed": "2", "set_games": ["6", "6"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "435994", "name": "Paula Badosa", "shirt": "", "url": "/player/1319/paula-badosa-gibert/", "country": "ES", "is_serving": false, "country_name": "Spain"}, {"shoes": "", "is_winner": false, "seed": "", "set_games": ["2", "3"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "665071", "name": "Anastasia Zarycka", "shirt": "", "url": "", "country": "CZ", "is_serving": false, "country_name": "Czech Republic"}], "duration": "01:18:06", "head_to_head_url": "", "round": "Round of 32"}, {"status": "Finished", "id": "3020222", "players": [{"shoes": "", "is_winner": false, "seed": "wc", "set_games": ["0", "0"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "272941", "name": "Tess Sugnaux", "shirt": "", "url": "", "country": "CH", "is_serving": false, "country_name": "Switzerland"}, {"shoes": "", "is_winner": true, "seed": "8", "set_games": ["6", "6"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "638823", "name": "Katarina Zavatska", "shirt": "", "url": "", "country": "UA", "is_serving": false, "country_name": "Ukraine"}], "duration": "00:37:27", "head_to_head_url": "", "round": "Round of 32"}, {"status": "Cancelled", "id": "3020223", "players": [{"shoes": "", "is_winner": null, "seed": "3", "set_games": [], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "289384", "name": "Tamara Korpatsch", "shirt": "", "url": "/player/1498/tamara-korpatsch/", "country": "DE", "is_serving": false, "country_name": "Germany"}, {"shoes": "", "is_winner": null, "seed": "wc", "set_games": [], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "845317", "name": "Fiona Ganz", "shirt": "", "url": "", "country": "CH", "is_serving": false, "country_name": "Switzerland"}], "duration": "N/A", "head_to_head_url": "", "round": "Round of 32"}, {"status": "Finished", "id": "3020224", "players": [{"shoes": "", "is_winner": true, "seed": "", "set_games": ["6", "6"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "175903", "name": "Giulia Gatto-Monticone", "shirt": "", "url": "/player/1210/giulia-gatto-monticone/", "country": "IT", "is_serving": false, "country_name": "Italy"}, {"shoes": "", "is_winner": false, "seed": "9", "set_games": ["4", "4"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "387049", "name": "Kathinka von Deichmann", "shirt": "", "url": "/player/1556/kathinka-von-deichmann/", "country": "LI", "is_serving": false, "country_name": "Liechtenstein"}], "duration": "01:44:03", "head_to_head_url": "/players/1210/giulia-gatto-monticone/vs/1556/kathinka-von-deichmann/", "round": "Round of 32"}, {"status": "Finished", "id": "3020225", "players": [{"shoes": "", "is_winner": false, "seed": "4", "set_games": ["0", "2"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "198113", "name": "Viktoriya Tomova", "shirt": "", "url": "/player/1492/viktoriya-tomova/", "country": "BG", "is_serving": false, "country_name": "Bulgaria"}, {"shoes": "", "is_winner": true, "seed": "", "set_games": ["6", "6"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "322002", "name": "Barbara Haas", "shirt": "", "url": "/player/1143/barbara-haas/", "country": "AT", "is_serving": false, "country_name": "Austria"}], "duration": "01:12:30", "head_to_head_url": "/players/1492/viktoriya-tomova/vs/1143/barbara-haas/", "round": "Round of 32"}, {"status": "Finished", "id": "3020226", "players": [{"shoes": "", "is_winner": false, "seed": "wc", "set_games": ["0", "1"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "651551", "name": "Leonie Kueng", "shirt": "", "url": "", "country": "CH", "is_serving": false, "country_name": "Switzerland"}, {"shoes": "", "is_winner": true, "seed": "10", "set_games": ["6", "6"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "215082", "name": "Antonia Lottner", "shirt": "", "url": "/player/1137/antonia-lottner/", "country": "DE", "is_serving": false, "country_name": "Germany"}], "duration": "00:56:39", "head_to_head_url": "", "round": "Round of 32"}, {"status": "Finished", "id": "3020227", "players": [{"shoes": "", "is_winner": false, "seed": "5", "set_games": ["4", "6", "3"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "275401", "name": "Ekaterine Gorgodze", "shirt": "", "url": "/player/1191/ekaterine-gorgodze/", "country": "GE", "is_serving": false, "country_name": "Georgia"}, {"shoes": "", "is_winner": true, "seed": "", "set_games": ["6", "2", "6"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "201505", "name": "Martina Di Giuseppe", "shirt": "", "url": "", "country": "IT", "is_serving": false, "country_name": "Italy"}], "duration": "02:32:17", "head_to_head_url": "", "round": "Round of 32"}, {"status": "Finished", "id": "3020228", "players": [{"shoes": "", "is_winner": false, "seed": "", "set_games": ["4", "4"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "387239", "name": "Deborah Chiesa", "shirt": "", "url": "", "country": "IT", "is_serving": false, "country_name": "Italy"}, {"shoes": "", "is_winner": true, "seed": "11", "set_games": ["6", "6"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "386906", "name": "Magdalena Frech", "shirt": "", "url": "/player/1574/magdalena-frech/", "country": "PL", "is_serving": false, "country_name": "Poland"}], "duration": "01:44:00", "head_to_head_url": "", "round": "Round of 32"}, {"status": "Finished", "id": "3020229", "players": [{"shoes": "", "is_winner": true, "seed": "6", "set_games": ["7", "5", "6"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "386094", "name": "Tereza Martincova", "shirt": "", "url": "/player/1359/tereza-martincova/", "country": "CZ", "is_serving": false, "country_name": "Czech Republic"}, {"shoes": "", "is_winner": false, "seed": "", "set_games": ["5", "7", "2"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "541841", "name": "Anna Bondar", "shirt": "", "url": "", "country": "HU", "is_serving": false, "country_name": "Hungary"}], "duration": "02:14:02", "head_to_head_url": "", "round": "Round of 32"}, {"status": "Finished", "id": "3020230", "players": [{"shoes": "", "is_winner": true, "seed": "", "set_games": ["6", "6"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "175942", "name": "Reka-Luca Jani", "shirt": "", "url": "/player/1334/reka-luca-jani/", "country": "HU", "is_serving": false, "country_name": "Hungary"}, {"shoes": "", "is_winner": false, "seed": "7", "set_games": ["2", "2"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "554700", "name": "Ludmilla Samsonova", "shirt": "", "url": "", "country": "RU", "is_serving": false, "country_name": "Russia"}], "duration": "01:05:10", "head_to_head_url": "", "round": "Round of 32"}, {"status": "Finished", "id": "3020441", "players": [{"shoes": "", "is_winner": false, "seed": "alt", "set_games": ["6", "6", "0"], "racket": "", "tiebreak_games": ["", "5", "", "", ""], "id": "289014", "name": "Ekaterina Yashina", "shirt": "", "url": "/player/1531/ekaterina-yashina/", "country": "RU", "is_serving": false, "country_name": "Russia"}, {"shoes": "", "is_winner": true, "seed": "wc", "set_games": ["2", "7", "6"], "racket": "", "tiebreak_games": ["", "7", "", "", ""], "id": "845317", "name": "Fiona Ganz", "shirt": "", "url": "", "country": "CH", "is_serving": false, "country_name": "Switzerland"}], "duration": "02:06:04", "head_to_head_url": "", "round": "Round of 32"}, {"status": "Finished", "id": "3020455", "players": [{"shoes": "", "is_winner": false, "seed": "alt", "set_games": ["1", "4"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "386827", "name": "Cornelia Lister", "shirt": "", "url": "/player/1169/cornelia-lister/", "country": "SE", "is_serving": false, "country_name": "Sweden"}, {"shoes": "", "is_winner": true, "seed": "", "set_games": ["6", "6"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "299104", "name": "Tereza Mrdeza", "shirt": "", "url": "/player/1360/tereza-mrdeza/", "country": "HR", "is_serving": false, "country_name": "Croatia"}], "duration": "01:15:53", "head_to_head_url": "/players/1169/cornelia-lister/vs/1360/tereza-mrdeza/", "round": "Round of 32"}], "location": "Lugano", "gender": "female", "order": 0, "hero_image_url": ""}, {"importance": 5, "surface": "Clay", "id": "857841", "startdate": "2019-04-07 00:00:00", "slug": "2019-grand-prix-hassan-ii-qualification-atp-mens-singles", "enddate": "2019-04-09 23:59:59", "name": "2019 Grand Prix Hassan II, Qualification ATP (Men's Singles)", "country": "Morocco", "events": [{"status": "Finished", "id": "3020296", "players": [{"shoes": "", "is_winner": true, "seed": "1", "set_games": ["7", "6"], "racket": "", "tiebreak_games": ["7", "", "", "", ""], "id": "566308", "name": "Lorenzo Sonego", "shirt": "", "url": "/player/1448/lorenzo-sonego/", "country": "IT", "is_serving": false, "country_name": "Italy"}, {"shoes": "", "is_winner": false, "seed": "", "set_games": ["6", "4"], "racket": "", "tiebreak_games": ["4", "", "", "", ""], "id": "385443", "name": "Alexey Vatutin", "shirt": "", "url": "/player/1583/alexey-vatutin/", "country": "RU", "is_serving": false, "country_name": "Russia"}], "duration": "01:48:00", "head_to_head_url": "/players/1448/lorenzo-sonego/vs/1583/alexey-vatutin/", "round": "Round of 16"}, {"status": "Finished", "id": "3020297", "players": [{"shoes": "", "is_winner": false, "seed": "wc", "set_games": ["1", "2"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "455261", "name": "Adam Moundir", "shirt": "", "url": "", "country": "MA", "is_serving": false, "country_name": "Morocco"}, {"shoes": "", "is_winner": true, "seed": "7", "set_games": ["6", "6"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "48675", "name": "Carlos Berlocq", "shirt": "", "url": "/player/547/carlos-berlocq/", "country": "AR", "is_serving": false, "country_name": "Argentina"}], "duration": "00:56:14", "head_to_head_url": "", "round": "Round of 16"}, {"status": "Finished", "id": "3020298", "players": [{"shoes": "", "is_winner": true, "seed": "2", "set_games": ["7", "6"], "racket": "", "tiebreak_games": ["7", "", "", "", ""], "id": "398547", "name": "Elias Ymer", "shirt": "", "url": "/player/881/elias-ymer/", "country": "SE", "is_serving": false, "country_name": "Sweden"}, {"shoes": "", "is_winner": false, "seed": "", "set_games": ["6", "4"], "racket": "", "tiebreak_games": ["2", "", "", "", ""], "id": "177435", "name": "Kevin Krawietz", "shirt": "", "url": "/player/965/kevin-krawietz/", "country": "DE", "is_serving": false, "country_name": "Germany"}], "duration": "01:24:46", "head_to_head_url": "/players/881/elias-ymer/vs/965/kevin-krawietz/", "round": "Round of 16"}, {"status": "Finished", "id": "3020299", "players": [{"shoes": "", "is_winner": false, "seed": "", "set_games": ["6", "4"], "racket": "", "tiebreak_games": ["5", "", "", "", ""], "id": "49046", "name": "Viktor Troicki", "shirt": "", "url": "/player/621/viktor-troicki/", "country": "RS", "is_serving": false, "country_name": "Serbia"}, {"shoes": "", "is_winner": true, "seed": "6", "set_games": ["7", "6"], "racket": "", "tiebreak_games": ["7", "", "", "", ""], "id": "185645", "name": "Facundo Bagnis", "shirt": "", "url": "/player/764/facundo-bagnis/", "country": "AR", "is_serving": false, "country_name": "Argentina"}], "duration": "02:09:59", "head_to_head_url": "/players/621/viktor-troicki/vs/764/facundo-bagnis/", "round": "Round of 16"}, {"status": "Finished", "id": "3020300", "players": [{"shoes": "", "is_winner": false, "seed": "3", "set_games": ["5", "6", "4"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "313143", "name": "Gregoire Barrere", "shirt": "", "url": "/player/1174/gregoire-barrere/", "country": "FR", "is_serving": false, "country_name": "France"}, {"shoes": "", "is_winner": true, "seed": "", "set_games": ["7", "3", "6"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "656432", "name": "Alejandro Davidovich", "shirt": "", "url": "", "country": "ES", "is_serving": false, "country_name": "Spain"}], "duration": "01:56:09", "head_to_head_url": "", "round": "Round of 16"}, {"status": "Cancelled", "id": "3020301", "players": [{"shoes": "", "is_winner": null, "seed": "", "set_games": [], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "293485", "name": "Evgeny Karlovskiy", "shirt": "", "url": "", "country": "RU", "is_serving": false, "country_name": "Russia"}, {"shoes": "", "is_winner": null, "seed": "8", "set_games": [], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "157909", "name": "Yannick Hanfmann", "shirt": "", "url": "/player/1615/yannick-hanfmann/", "country": "DE", "is_serving": false, "country_name": "Germany"}], "duration": "N/A", "head_to_head_url": "", "round": "Round of 16"}, {"status": "Finished", "id": "3020302", "players": [{"shoes": "", "is_winner": false, "seed": "4", "set_games": ["3", "6"], "racket": "", "tiebreak_games": ["", "6", "", "", ""], "id": "581144", "name": "Corentin Moutet", "shirt": "", "url": "/player/1624/corentin-moutet/", "country": "FR", "is_serving": false, "country_name": "France"}, {"shoes": "", "is_winner": true, "seed": "", "set_games": ["6", "7"], "racket": "", "tiebreak_games": ["", "8", "", "", ""], "id": "729716", "name": "Elliot Benchetrit", "shirt": "", "url": "", "country": "FR", "is_serving": false, "country_name": "France"}], "duration": "01:45:19", "head_to_head_url": "", "round": "Round of 16"}, {"status": "Finished", "id": "3020303", "players": [{"shoes": "", "is_winner": false, "seed": "wc", "set_games": ["6", "7", "4"], "racket": "", "tiebreak_games": ["5", "7", "", "", ""], "id": "48633", "name": "Lamine Ouahab", "shirt": "", "url": "/player/969/lamine-ouahab/", "country": "MA", "is_serving": false, "country_name": "Morocco"}, {"shoes": "", "is_winner": true, "seed": "5", "set_games": ["7", "6", "6"], "racket": "", "tiebreak_games": ["7", "1", "", "", ""], "id": "78329", "name": "Adrian Menendez", "shirt": "", "url": "/player/797/adrian-menendez-maceiras/", "country": "ES", "is_serving": false, "country_name": "Spain"}], "duration": "03:11:41", "head_to_head_url": "/players/969/lamine-ouahab/vs/797/adrian-menendez-maceiras/", "round": "Round of 16"}, {"status": "Finished", "id": "3020445", "players": [{"shoes": "", "is_winner": true, "seed": "", "set_games": ["7", "4", "6"], "racket": "", "tiebreak_games": ["7", "", "", "", ""], "id": "293485", "name": "Evgeny Karlovskiy", "shirt": "", "url": "", "country": "RU", "is_serving": false, "country_name": "Russia"}, {"shoes": "", "is_winner": false, "seed": "alt", "set_games": ["6", "6", "2"], "racket": "", "tiebreak_games": ["2", "", "", "", ""], "id": "49187", "name": "Tim Puetz", "shirt": "", "url": "/player/1089/tim-puetz/", "country": "DE", "is_serving": false, "country_name": "Germany"}], "duration": "02:09:02", "head_to_head_url": "", "round": "Round of 16"}], "location": "Marrakech", "gender": "male", "order": 0, "hero_image_url": ""}, {"importance": 10, "surface": "Hard", "id": "859564", "startdate": "2019-04-01 00:00:00", "slug": "2019-monterrey-challenger-mens-singles", "enddate": "2019-04-07 23:59:59", "name": "2019 Monterrey Challenger (Men's Singles)", "country": "Mexico", "events": [{"status": "Finished", "id": "3020381", "players": [{"shoes": "", "is_winner": true, "seed": "7", "set_games": ["6", "6"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "313623", "name": "Alexander Bublik", "shirt": "", "url": "/player/1582/alexander-bublik/", "country": "KZ", "is_serving": false, "country_name": "Kazakhstan"}, {"shoes": "", "is_winner": false, "seed": "", "set_games": ["3", "2"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "158890", "name": "Emilio Gomez", "shirt": "", "url": "/player/882/emilio-gomez/", "country": "EC", "is_serving": false, "country_name": "Ecuador"}], "duration": "00:55:00", "head_to_head_url": "/players/1582/alexander-bublik/vs/882/emilio-gomez/", "round": "Championship"}], "location": "Monterrey", "gender": "male", "order": 0, "hero_image_url": ""}, {"importance": 10, "surface": "Clay", "id": "859565", "startdate": "2019-04-01 00:00:00", "slug": "2019-sophia-antipolis-challenger-mens-singles", "enddate": "2019-04-07 23:59:59", "name": "2019 Sophia Antipolis Challenger (Men's Singles)", "country": "France", "events": [{"status": "Finished", "id": "3020265", "players": [{"shoes": "", "is_winner": false, "seed": "5", "set_games": ["3", "5"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "113885", "name": "Filip Krajinovic", "shirt": "", "url": "/player/767/filip-krajinovic/", "country": "RS", "is_serving": false, "country_name": "Serbia"}, {"shoes": "", "is_winner": true, "seed": "", "set_games": ["6", "7"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "48480", "name": "Dustin Brown", "shirt": "", "url": "/player/876/dustin-brown/", "country": "DE", "is_serving": false, "country_name": "Germany"}], "duration": "01:31:15", "head_to_head_url": "/players/767/filip-krajinovic/vs/876/dustin-brown/", "round": "Championship"}], "location": "Sophia Antipolis", "gender": "male", "order": 0, "hero_image_url": ""}, {"importance": 10, "surface": "Clay", "id": "859567", "startdate": "2019-04-01 00:00:00", "slug": "2019-alicante-challenger-mens-singles", "enddate": "2019-04-07 23:59:59", "name": "2019 Alicante Challenger (Men's Singles)", "country": "Spain", "events": [{"status": "Finished", "id": "3020156", "players": [{"shoes": "", "is_winner": true, "seed": "1", "set_games": ["6", "3", "6"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "49068", "name": "Pablo Andujar", "shirt": "", "url": "/player/626/pablo-andujar/", "country": "ES", "is_serving": false, "country_name": "Spain"}, {"shoes": "", "is_winner": false, "seed": "12", "set_games": ["3", "6", "4"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "467428", "name": "Pedro Martinez", "shirt": "", "url": "/player/1554/pedro-martinez-portero/", "country": "ES", "is_serving": false, "country_name": "Spain"}], "duration": "02:32:55", "head_to_head_url": "/players/626/pablo-andujar/vs/1554/pedro-martinez-portero/", "round": "Championship"}], "location": "Alicante", "gender": "male", "order": 0, "hero_image_url": ""}, {"importance": 10, "surface": "Carpet", "id": "859568", "startdate": "2019-04-08 00:00:00", "slug": "2019-taipei-challenger-mens-singles", "enddate": "2019-04-14 23:59:59", "name": "2019 Taipei Challenger (Men's Singles)", "country": "Taiwan", "events": [{"status": "Finished", "id": "3019960", "players": [{"shoes": "", "is_winner": true, "seed": "", "set_games": ["6", "6"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "394797", "name": "Kaichi Uchida", "shirt": "", "url": "/player/1451/kaichi-uchida/", "country": "JP", "is_serving": false, "country_name": "Japan"}, {"shoes": "", "is_winner": false, "seed": "", "set_games": ["4", "4"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "441519", "name": "Duck-Hee Lee", "shirt": "", "url": "/player/874/duckhee-lee/", "country": "KR", "is_serving": false, "country_name": "South Korea"}], "duration": "01:26:16", "head_to_head_url": "/players/1451/kaichi-uchida/vs/874/duckhee-lee/", "round": "Round of 64"}], "location": "Taipei", "gender": "male", "order": 0, "hero_image_url": ""}, {"importance": 10, "surface": "Unknown", "id": "859830", "startdate": "2019-04-05 02:00:00", "slug": "2019-davis-cup-group-2-americas-davis-cup-3-mens-singles", "enddate": "2019-09-13 23:59:59", "name": "2019 Davis Cup Group 2 - Americas Davis Cup 3 (Men's Singles)", "country": "", "events": [{"status": "Finished", "id": "3020346", "players": [{"shoes": "", "is_winner": false, "seed": "", "set_games": ["3", "2"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "1037262", "name": "Kyle Johnson", "shirt": "", "url": "", "country": "US", "is_serving": false, "country_name": "United States"}, {"shoes": "", "is_winner": true, "seed": "", "set_games": ["6", "6"], "racket": "", "tiebreak_games": ["", "", "", "", ""], "id": "327042", "name": "Nicolas Alvarez", "shirt": "", "url": "", "country": "PE", "is_serving": false, "country_name": "Peru"}], "duration": "N/A", "head_to_head_url": "", "round": "Championship"}], "location": "Various", "gender": "male", "order": 0, "hero_image_url": ""}], "last_updated": "Tue, 09 Apr 2019 01:59:09 +0100"}`;
				try{
					const path = require('path');
					const collectorTool = require('../collector/tools/main');
					data = JSON.parse(data);
					data = data.tournaments;
					let matchedData = null;
					data.forEach(function(tour){
						if(tour.id == params.sid){
							matchedData = tour;
						}
					});

					if(matchedData){
						let url = matchedData.hero_image_url;
						if(url){
							let extname = path.extname(url);
							let dest = path.resolve(global.staticRoot, `./img/tennis/tournaments/${params.sid}${extname}`);
							let destMirror = path.resolve(global.staticRoot, `./img/tennis/tournaments/${params.sid}.mirror${extname}`);
							collectorTool.downloadImg(url, dest, function(){
								matchedData.extname = extname;
								matchedData = JSON.stringify(matchedData);
			
								if(!res.dynamicDataSet){
									res.end(matchedData)
								}else{
									res.dynamicDataSet[params.ssrOutput || 'tournament'] = matchedData;
								}
			
								collectorTool.clipImage(dest, destMirror)
							})
						}else{// 没有图片
							matchedData = JSON.stringify(matchedData);
			
							if(!res.dynamicDataSet){
								res.end(matchedData)
							}else{
								res.dynamicDataSet[params.ssrOutput || 'tournament'] = matchedData;
							}
						}
						
					}else{
						if(!res.dynamicDataSet){
							res.end('')
						}else{
							res.dynamicDataSet[params.ssrOutput || 'tournament'] = '';
						}
					}
				}catch(e){
					console.log(e)
					if(!res.dynamicDataSet){
						res.end('')
					}else{
						res.dynamicDataSet[params.ssrOutput || 'tournament'] = {};
					}
				}
			// })

			// 计算+1时区的日期
			// 数据是东1时区的数据（英国）
			function calcTimeZoneDate(offset){
				let GMT = +new Date(
					(new Date()).toUTCString()
				);
				let hourMilli = 60*60*1000;

				let firstTimezone = new Date(GMT + 1 * hourMilli + offset * 24 * hourMilli);

				if(firstTimezone > maxTime){
					firstTimezone = new Date(maxTime)
				}

				if(firstTimezone < minTime){
					firstTimezone = new Date(minTime)
				}

				let y = firstTimezone.getFullYear(),
					m = firstTimezone.getMonth() + 1,
					d = firstTimezone.getDate();

				return (y + '-' + zeroFill(m) + '-' + zeroFill(d)).toString();

				function zeroFill(n){
					return n > 9? n: '0'+n
				}
			}
		})
	},

	queryTournamentDraw: function (res, qualification, params) {
		
		conn.query(`select now() > expire as is_expire from tennis.tournament_draw`, function(err, rows){
			if(err) return throwError(err, res);

			if(!rows[0] || rows[0].is_expire){
				let file = require('path').resolve(__dirname, '../collector/tennis/tournament_draw.js');

				tools.spawn([file], function(){
					query();
				}, res)
			}else{
				query();
			}
		})
		
		function query(){
			let sql = `select * from tennis.tournament_draw where id=${params.sid}`;

			conn.query(sql , function (err, result, fields) {
				if (err) return throwError(err, res);
				
				if(!res.dynamicDataSet){
					result = JSON.stringify(result[0].draw);
					res.end(result)
				}else{
					res.dynamicDataSet[params.ssrOutput || 'tournamentDraw'] = result[0].draw;
				}
			});
		}
	},

	// =========== 网球统计 结束
	
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

				sql = `INSERT INTO usr_login_log VALUES (${id}, now(), '${req.usrInfo.ip}', '${postObj.city.toLowerCase()}', '${postObj.coords}') 
					ON DUPLICATE KEY 
					UPDATE last_login_time=now(), last_login_ip='${req.usrInfo.ip}', last_login_city='${postObj.city.toLowerCase()}', last_login_coords='${postObj.coords}';`
				
				conn.query(sql, function(err, result){
					if(err)
						console.log(err);

					if(result.affectedRows > 0){
						res.statusMessage = 'login success';
						res.end();
					}
				});
			}else{
				res.statusCode = global.StatusCode.ClientErrorUnauthorized;
				res.end();
			}
		});
	},

	regist: function(res, postObj, req){
		let ip = require('client-ip')(req);
		if(ip == '::1'){
			ip = '::ffff:127.0.0.1';
		}
		ip = ip.replace('::ffff:', '');

		// conn.query(`SELECT * from usr WHERE regist_ip='${ip}' and regist_time > DATE_SUB(CURRENT_TIMESTAMP(),INTERVAL 1 DAY)`, function(err, result){
		// 	if(err)
		// 		return throwError(err, res);

			// 1天内同个IP注册超过5个
			// 将IP加入黑名单
			/* if(result.length > 5){
				let sql = `insert into black (ip) values (${ip})`;
				conn.query(sql);

				require('../cookie').setCookie(res, {
					name: `bear`,
					value: '1',
					expires: new Date(Date.now()+10*60*60*24*1000).toUTCString(),
					HttpOnly: true
				});

				// TODO 删除该ip下所有的账户
				res.end();
			}else{ */
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
			// }
		// });
	},

	generateVideo: function(vId, obj){
		let videoAbsPath = obj.videoAbsPath;
		let subtitleAbsPath = obj.subtitleAbsPath;

		let videoGenerator = require('../ffmpeg/generate_video');
		let tsDir = global.staticRoot + `/multimedia/ts/${vId}`;
		
		const fs = require('fs');

		fs.existsSync(tsDir) || fs.mkdirSync(tsDir, 0777);
		
		if(videoAbsPath){
			if(!fs.existsSync(videoAbsPath)){
				return
			}
			
			const del = require('del');
			const path = require('path');

			// 如果只传视频 字幕会被误删
			del([tsDir + '/*.*', '!' + tsDir + '/subtitle', '!' + tsDir + '/subtitle.vtt']).then(paths => {
				// console.log('Deleted files and folders:\n', paths.join('\n'));

				let ext = path.extname(videoAbsPath);
				let videoStorePath = global.staticRoot + `/multimedia/pristine_v/${vId}${ext}`;
				let videoGenerator = require('../ffmpeg/generate_video');
				fs.renameSync(videoAbsPath, videoStorePath);// 用于生成gif
				// 在同级目录分离出音频
				videoGenerator.extractAudio(videoStorePath, tsDir);

				// videoGenerator.watermark(videoStorePath, function(){
				videoGenerator.execM3U(videoStorePath, tsDir);
				videoGenerator.screenShot(videoStorePath, tsDir);
				videoGenerator.dynamicPreview(videoStorePath, tsDir, vId, function(duration){
					let sql = `update video set duration=${duration} where id=${vId}`;
					conn.query(sql, function(err, result){
						if (err) 
							return console.log(err);
					})
				});

				if(subtitleAbsPath && fs.existsSync(subtitleAbsPath)){
					videoGenerator.storeSubtitle(subtitleAbsPath, tsDir);
					// recordSubtitleUploaded();
				}
			})
		}else{
			if(subtitleAbsPath && fs.existsSync(subtitleAbsPath)){
				videoGenerator.storeSubtitle(subtitleAbsPath, tsDir);
				// recordSubtitleUploaded();
			}
		}

		// function recordSubtitleUploaded(){
		// 	let sql = `update video set has_subtitle=1 where id=${vId}`;
		// 	conn.query(sql)
		// }
	},

	generateIntroductoryVideo: function(vId, obj){
		const fs = require('fs');

		let videoAbsPath = obj.videoAbsPath;
		let subtitleAbsPath = obj.subtitleAbsPath;

		let videoGenerator = require('../ffmpeg/generate_video');
		let tsDir = global.staticRoot + `/multimedia/ts_introductory/${vId}`;
		
		fs.existsSync(tsDir) || fs.mkdirSync(tsDir, 0777);
		
		if(videoAbsPath){
			if(!fs.existsSync(videoAbsPath)){
				return
			}
			
			const del = require('del');
			const path = require('path');

			del([tsDir + '/*.*', '!' + tsDir + '/subtitle', '!' + tsDir + '/subtitle.vtt']).then(paths => {
				// console.log('Deleted files and folders:\n', paths.join('\n'));

				let ext = path.extname(videoAbsPath);
				let videoStorePath = global.staticRoot + `/multimedia/pristine_introductory_v/${vId}${ext}`;
				let videoGenerator = require('../ffmpeg/generate_video');
				fs.renameSync(videoAbsPath, videoStorePath);// 用于生成gif

				videoGenerator.execM3U(videoStorePath, tsDir, 360);

				if(subtitleAbsPath && fs.existsSync(subtitleAbsPath)){
					videoGenerator.storeSubtitle(subtitleAbsPath, tsDir);
				}
			})
		}else{
			if(subtitleAbsPath && fs.existsSync(subtitleAbsPath)){
				videoGenerator.storeSubtitle(subtitleAbsPath, tsDir);
			}
		}
	},

	createVideo: function(res, postObj){
		const path = require('path');

		let videoAbsPath = postObj.videoAbsPath;
		let ext = path.extname(videoAbsPath);

		if(postObj.isTutorial){
			let sql = `INSERT INTO video 
			(album_id, headline, headline_eng, tag, video_ext, update_time, translated)
			VALUES (?, ?, ?, ?, ?, ?, ?)`;

			conn.query(sql, [postObj.albumId, postObj.headline, postObj.headlineEng, postObj.tag, ext, Date.now(), postObj.translated], function(err, result, fields){
				if(err)
					return throwError(err, res);

				res.end();

				// 更新album 和 sport
				let now = Date.now();
				let albumId = postObj.albumId;

				conn.query('update album set update_time = ' + now + ' where id=' + albumId);
				conn.query('update sport set update_time = ' + now + ' where id = (select sport_id from album where id = ' + albumId + ')');

				let insertId = result.insertId;
				insertId && this.generateVideo(insertId, postObj);
			}.bind(this));
		}else{
			let sql = `INSERT INTO video_introductory 
			(headline, headline_eng, tag, video_ext, update_time, sport_id)
			VALUES (?, ?, ?, ?, ?, ?)`;

			conn.query(sql, [postObj.headline, postObj.headlineEng, postObj.tag, ext, Date.now(), postObj.sportId], function(err, result, fields){
				if(err)
					return throwError(err, res);

				res.end();

				let insertId = result.insertId;
				insertId && this.generateIntroductoryVideo(insertId, postObj);
			}.bind(this));
		}
	},

	createFeedback: function(res, postObj, req){
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

	createTag: function(res, postObj){
		var sql = `INSERT INTO tag 
			(name, sport_id)
			VALUES (?, ?)`;

		conn.query(sql, [postObj.name, postObj.sportId], function(err, result, fields){
			if(err)
				return throwError(err, res);
			
			res.end();
		});
	},

	createAlbum: function(res, postObj){
		const fs = require('fs'),
			path = require('path');

		const coverExt = path.extname(postObj.cover).toLowerCase() || '.jpg';

		let sql = `INSERT INTO album 
			(sport_id, author_id, name, tag, update_time, cover_ext)
			VALUES (?, ?, ?, ?, ${Date.now()}, ?)`;

		conn.query(sql, [postObj.sportId, postObj.maker, postObj.name, postObj.tag, coverExt], function(err, result, fields){
			if(err)
				return throwError(err, res);

			let albumId = result.insertId;;

			let sourceCoverPath = path.resolve(__dirname, `../../static${postObj.cover}`),
				destCoverPath = path.resolve(__dirname, `../../static/img/cover/album/` + albumId + coverExt);
				
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

	createStar: function(res, postObj){
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
		let offense = this.usrInfo.usrId,
			defense = postObj.defenseId;

		let sql = `insert into competition (offense, defense, offense_time, stage) values (${offense}, ${defense}, now(), 1)`;

		conn.query(sql, function(err, result){
			if(err)
				console.log(err);

			res.end();

			let inmailContent = `有人向你发起了挑战`;
			sendInmail(offense, defense, inmailContent);
		});
	},
/* 
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
						expires: new Date(Date.now()+10*60*60*24*1000).toUTCString(),
						HttpOnly: true
					});
	
					res.end();
				}
			});
		}
	}, */

	createSport: function(res, postObj, req){
		let sql = `insert into sport (name, update_time) values ('${postObj.name}', ${Date.now()})`;

		conn.query(sql, function(err, result){
			if(err)
				console.log(err);

			res.end();
		});
	},

	addCompeteBlack: function(res, postObj, req){
		let t = this;

		conn.query(`select * from competition where id=${postObj.matchId}`, function(err, items){
			let competition = items[0];
			let blackUsrId,
				recorderId = this.usrInfo.usrId;

			if(recorderId == competition.offense){
				blackUsrId = competition.defense;
			}else if(recorderId == competition.defense){
				blackUsrId = competition.offense;
			}

			let sql = `insert into compete_black (usr_id, recorder_id, match_id, time) values (${blackUsrId}, ${recorderId}, ${postObj.matchId}, now() )`;

			conn.query(sql, function(err, result){
				if(err)
					console.log(err);

				res.end();
			});

			// 比赛结果为平 无效 todo
			sql = `update competition set stage=4, offense_res=3, defense_res=3, defense_time=now(), close_time=now() where id=${postObj.matchId}`;
			conn.query(sql, function(err, res){
				if(err)
					return console.log(err);

				t.recordMatchResult([
					blackUsrId + '_' + 3,
					recorderId + '_' + 3
				]);
			});
		}.bind(this));
	},

	competeEvaluate: function(res, postObj, req){
		conn.query(`select * from competition where id=${postObj.matchId}`, function(err, items){
			let competition = items[0];
			let assessed,
				evaluator = this.usrInfo.usrId;

			if(evaluator == competition.offense){
				assessed = competition.defense;
			}else if(evaluator == competition.defense){
				assessed = competition.offense;
			}

			let sql = `insert into compete_evaluate (evaluator, assessed, match_id, result, detail, time) values (${evaluator}, ${assessed}, ${postObj.matchId}, ${postObj.evaluateResult}, '${postObj.evaluateDetail}', now() )`;

			conn.query(sql, function(err, result){
				if(err)
					console.log(err);

				res.end();
			});

			let col = ['like', 'unlike'][postObj.evaluateResult-1];
			sql = `update usr_datum set ${col} = ${col}+1 where usr_id=${assessed}`;
			conn.query(sql, function(err, res){
				if(err)
					return console.log(err);
			});
		}.bind(this));
	},

	createCaption: function(res, postObj, req){
		let toCaption = require('../captionParser.js').toCaption;
		toCaption(postObj, this.usrInfo.usrId);

		res.end();
	},

	recordUsrPost(res, postObj, req){
		let usrId = this.usrInfo.usrId,
			vId = postObj.vId,
			type = postObj.type;

		// 不存在记录就插入
		// let sql = `INSERT INTO usr_post (usr_id, video_id, type) SELECT
		// 	${usrId},
		// 	${usrId},
		// 	${type}
		// FROM
		// 	DUAL
		// WHERE
		// 	NOT EXISTS (
		// 		SELECT
		// 			*
		// 		FROM
		// 			usr_post
		// 		WHERE
		// 			usr_id = ${usrId}
		// 		AND video_id = ${usrId}
		// 		AND type = ${type}
		// 	);`
		
		conn.query(`select * from usr_post where usr_id = ${usrId} AND video_id = ${vId} AND type = ${type}`, function(err, result){
			if(err)
				return throwError(err, result);

			if(result.length){
				conn.query(`update usr_post set 
					time = now(), 
					readers='', 
					checkor = null, 
					check_time = null, 
					check_result = null 
					where id = ${result[0].id}`, 
				function(err, result){
						
					if(err)
						return throwError(err, result);

					if(result.affectedRows == 1){
						res.end();
					}
				})
			}else{
				conn.query(`INSERT INTO usr_post (usr_id, video_id, type) values (${usrId}, ${vId}, ${type})`, function(err, result){
					if(err)
						return throwError(err, result);

					if(result.affectedRows == 1){
						res.end();
					}
				})
			}
		})
	},

	inheritCaption: function(res, postObj, req){
		let usrId = this.usrInfo.usrId;

		var parser = require('subtitles-parser');
        var fs = require('fs');
        var path = require('path');

        // 删除
        // 复制
        let draftPath = path.resolve(
            global.staticRoot, 
            `./multimedia/ts/${postObj.vId}/subtitle.tmp.${usrId}`
		)
		
        let finalDraftPath = path.resolve(
            global.staticRoot, 
            `./multimedia/ts/${postObj.vId}/subtitle.${usrId}`
		)

		require('del')([draftPath, finalDraftPath]).then(paths => {
			let targetFinalDraftPath = path.resolve(
				global.staticRoot, 
				`./multimedia/ts/${postObj.vId}/subtitle.${postObj.draft}`
			)

			fs.readFile(targetFinalDraftPath, function(err, data){
				if(err) console.log(err)

				fs.writeFileSync(finalDraftPath, data);
				res.end();
			})
		});
	},

	auditCaption: function(res, postObj, req){
		let draft = postObj.draft;
		let vId = postObj.vId;
		let usrId = this.usrInfo.usrId;

		conn.query(`select * from usr_post where video_id=${vId} and usr_id=${draft} and not isnull(checkor)`, function(err, result){
			if(err)
				return throwError(err, res);

			if(!result.length){//未审核

				if(postObj.status == 1){// 通过
					const parser = require('subtitles-parser');
					const fs = require('fs');
					const path = require('path');
			
					let root = path.resolve(
						global.staticRoot, 
						`./multimedia/ts/${vId}`
					)
			
					let srcFinalDraftPath = path.resolve(
						root, 
						`subtitle.${draft}`
					)
			
					let zhDrafPath = path.resolve(
						root, 
						`subtitle.zh`
					)
			
					// subtitle.25 -> subtitle.zh
					tools.copyFile(srcFinalDraftPath, zhDrafPath, function(){
						require('../tools').convertSrt2vtt(root, 'subtitle.zh')
						// 标记视频已翻译
						let sql = `update video set translated=1 where id=?`;
						conn.query(sql, [vId], function(err, result){
							if(err)
								return throwError(err, res);
							
							res.end();
						});
			
						// 更新用户审核人
						sql = `update usr_post set checkor=${usrId}, check_time=now(), check_result=1 where video_id=${vId} and usr_id=${draft}`;
						conn.query(sql, function(err, result){
							if(err)
								return throwError(err, res);
			
							if(result.affectedRows == 1){
								res.end()
							}
						})
					})
				}else{// 否决
					let sql = `update usr_post set checkor=${usrId}, check_time=now(), check_result=2 where video_id=${vId} and usr_id=${draft}`;
					conn.query(sql, function(err, result){
						if(err)
							return throwError(err, res);
		
						if(result.affectedRows == 1){
							res.end()
						}
					})
				}
			}else{
				res.end(JSON.stringify({
					checkor: result[0].checkor
				}))
			}
		})
	},

	pageRecoder: function(res, postObj, req){
		const pathModule = require('path'),
			fs = require('fs');

		let pagePath = postObj.pagePath;
		let pageContent = postObj.pageContent;

		if(pathModule.extname(pagePath)){
			// /page/intro_tennis.html
			// /tennis/player/532/gear.ssr
			res.end();
			return updateSitemap();
		}

		// /albums/13 => albums.13
		pagePath = tools.transformPath(pagePath)

		let fileStorePath = pathModule.resolve(global.staticRoot, `./page/spider/${pagePath}.html`);

		fs.writeFile(fileStorePath, pageContent, (err) => {
			if (err) throw err;
		});

		fileStorePath = fileStorePath.replace(/\\/g, '/');// 存储到MYSQL 将\转化为/
		let sql = `insert into spider_food (path, file_path) values ('${postObj.pagePath}', '${fileStorePath}') 
			ON DUPLICATE KEY 
			UPDATE file_path='${fileStorePath}';`;

		if(postObj.pagePath == '/sports'){
			sql += `insert into spider_food (path, file_path) values ('/', '${fileStorePath}') 
			ON DUPLICATE KEY 
			UPDATE file_path='${fileStorePath}';`
		}

		conn.query(sql, [], function(err, result){
			if(err)
				return throwError(err, res);

			res.statusMessage = 'update page success';
			res.end();

			updateSitemap();
			
		});

		// 更新到sitemap
		function updateSitemap(){
			let sitemapLocation = pathModule.resolve(global.staticRoot, 'sitemap.txt');

			fs.exists(sitemapLocation, function(exist){
				if(exist){
					fs.readFile(sitemapLocation, 'utf8', function(err, data){
						let fullpath = postObj.pagePath;// https://www.yitube.cn/albums/13 

						if(!postObj.pagePath.match(/^https?:\/\//)){
							fullpath = req.headers.origin + postObj.pagePath
						}else{
							if(!fullpath.match(req.headers.origin)){// 同源
								return
							}
						}

						let eol  = require('os').EOL;
						data = data? data.split(eol): [];

						if(data.indexOf(fullpath) === -1){
							data.push(fullpath);

							fs.writeFileSync(sitemapLocation, data.join(eol), {encoding: 'utf8'})
						}

						if(postObj.pagePath == '/sports'){
							var indexPagePath = req.headers.origin + '/';
							if(data.indexOf(indexPagePath) === -1){
								data.push(indexPagePath);
								fs.writeFileSync(sitemapLocation, data.join(eol), {encoding: 'utf8'})
							}
						}
					})
				}
			})
			
		}
	},

	notifyUsrPost: function(res, postObj, req){
		let inmailContent = `《${postObj.videoTitle}》审核${['已','未'][postObj.status - 1]}通过`;
		sendInmail(this.usrInfo.usrId, postObj.receiver, inmailContent);

		res.end();
	},

	responseComment: function(res, postObj, req){
		let sender = this.usrInfo.usrId;
		conn.query('update feedback set replied=1 where id=?; select usr_id from feedback where id = ?;', [postObj.commentId, postObj.commentId], function(err, result){
			if(err)
				return throwError(err, res);

			sendInmail(sender, result[1][0]['usr_id'], postObj.responseContent);
			res.end();
		})
	},

	translate: function (res, postObj, req) {
		let translateSevice = require('../service/baidu_translator');

		if(!postObj.source || !postObj.source.trim()){
			res.statusCode = global.StatusCode.ClientErrorExpectationFailed;
			return res.end();
		}

		if(!postObj.isAlone){
			translateSevice(postObj.source, postObj.to, function(translation){
				res.end(translation);
			});
		}else{
			let sourceAry = postObj.source.split(postObj.separator);
			// sourceAry = sourceAry.slice(0, 5);
			let translationAry = new Array(sourceAry.length);

			var translateCount = 0;
			sourceAry.forEach((word, index)=>{
				translateSevice(word, postObj.to, function(translation){
					translateCount ++;
					console.log(translateCount, sourceAry.length)

					translationAry[index] = translation;

					if(translateCount == sourceAry.length){
						res.end(translationAry.join(postObj.separator));
					}
				});
			})
		}
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
			res.statusCode = global.StatusCode.ClientErrorUnauthorized;
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
				res.statusCode = global.StatusCode.ClientErrorExpectationFailed;
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
				res.statusCode = global.StatusCode.ClientErrorExpectationFailed;
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
				res.statusCode = global.StatusCode.ClientErrorExpectationFailed;
				res.end();
			}
		})
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
			let sql = `INSERT INTO usr_datum
				VALUES
				(
					${usrId}, 
					'${patchObj.nickname}',
					'${patchObj.wechat}',
					${patchObj.telephone}, 
					'${patchObj.level}',
					'${patchObj.status}',
					'${pathStored}',
					${patchObj.sex}, 
					0,
					0,
					0,
					0,
					0
				) ON DUPLICATE KEY UPDATE 
				nickname = '${patchObj.nickname}',
				wechat = '${patchObj.wechat}',
				tel = ${ patchObj.telephone }, 
				LEVEL = '${patchObj.level}',
				STATUS = '${patchObj.status}',
				avatar = '${pathStored}',
				sex = ${ patchObj.sex }`;
			
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

	responseChallenge: function(res, patchObj, req){
		let matchId = patchObj.matchId;
		let sql = `update competition set stage=${patchObj.response}, defense_time=now() where id=${matchId}`;
		let usrId = this.usrInfo.usrId;
		
		conn.query(sql, function(err, result){
			if(err)
				console.log(err);
			res.end();

			conn.query('select offense from competition where id='+matchId, function(err, result){
				if(err)
					console.log(err);

				let offense = result[0].offense,
					defense = usrId;
				
				if(patchObj.response == 2){
					let sql = `select wechat,nickname from usr_datum where usr_id=${defense}`;
					conn.query(sql, function(err, result){
						sendInmail(defense, offense, `约球成功，对方(${result[0].nickname})联系方式是微信: ${result[0].wechat}`);
					});

					sql = `select wechat,nickname from usr_datum where usr_id=${offense}`;
					conn.query(sql, function(err, result){
						sendInmail(offense, defense, `约球成功，对方(${result[0].nickname})联系方式是微信: ${result[0].wechat}`);
					});
				}else{
					sql = `select nickname from usr_datum where usr_id=${defense}`;
					conn.query(sql, function(err, result){
						let inmailContent = `对方(${result[0].nickname})拒绝了你的挑战`;
						sendInmail(defense, offense, inmailContent);
					});
				}
			});
		});
	},

	markMatchResult: function(res, patchObj, req){
		let sql = `select * from competition where id=${patchObj.matchId}`;
		let usrId = this.usrInfo.usrId;
		let t = this;

		conn.query(sql, function(err, matchDetail){
			if(err)
				console.log(err);

			if(matchDetail && matchDetail[0]){
				matchDetail = matchDetail[0];
				let offenseUsrId = matchDetail.offense;
				let defenseUsrId = matchDetail.defense;
				let offenseRes = matchDetail.offense_res;
				let defenseRes = matchDetail.defense_res;
				let offenseTime = +matchDetail.offense_time;
				let defenseTime = +matchDetail.defense_time;
				let NOW = Date.now();
				let ONEDAY = 1 * 24 * 60 * 60 *1000;

				let usrMarkedResult = patchObj.result;
				let doMatchClose = false;

				let offenseDefense;

				if(offenseUsrId == usrId){
					if(NOW - offenseTime < ONEDAY){
						res.statusCode = global.StatusCode.ClientErrorBadRequest;
						res.statusMessage = 'should mark later';
						return res.end();
					}

					offenseRes = usrMarkedResult;

					if(defenseRes){
						doMatchClose = true;
						
						sql = `update competition set offense_res=${offenseRes}, stage=4, close_time=now() where id=${patchObj.matchId}`;
					}else
						sql = `update competition set offense_res=${offenseRes} where id=${patchObj.matchId}`;
					
					offenseDefense = defenseRes * offenseRes;
				}else if(defenseUsrId == usrId){
					if(NOW - defenseTime < ONEDAY){
						res.statusCode = global.StatusCode.ClientErrorBadRequest;
						res.statusMessage = 'should mark later';
						return res.end();
					}

					defenseRes = usrMarkedResult;

					if(offenseRes){
						doMatchClose = true;
						sql = `update competition set defense_res=${defenseRes}, stage=4, close_time=now() where id=${patchObj.matchId}`;
					}else
						sql = `update competition set defense_res=${defenseRes} where id=${patchObj.matchId}`;
					
					offenseDefense = offenseRes * defenseRes;
				}

				// 1 2 || 2 1 || 3 3
				if(doMatchClose){
					// 双方互评，评价结果有误
					if(offenseDefense != 2 && offenseDefense != 9){
						res.statusCode = global.StatusCode.ClientErrorBadRequest;
						res.statusMessage = 'match result error';

						if(offenseUsrId == usrId){
							return res.end(defenseRes.toString());
						}else if(defenseUsrId == usrId){
							return res.end(offenseRes.toString());
						}

						// todo 不计胜负
					}
				}

				conn.query(sql, function(err, result){
					if(err)
						console.log(err);

					res.end(+doMatchClose + '');// '1' '0'

					// 双发评价无误，通知对方
					if(doMatchClose){
						if(offenseUsrId == usrId){
							conn.query(`select nickname from usr_datum where usr_id = ${matchDetail.defense}`, function(err, items){
								let inmailContent = `和(${items[0].nickname})的对战结果已记录`;
								sendInmail(offenseUsrId, defenseUsrId, inmailContent);
							});
						}else if(defenseUsrId == usrId){
							conn.query(`select nickname from usr_datum where usr_id = ${matchDetail.offense}`, function(err, items){
								let inmailContent = `和(${items[0].nickname})的对战结果已记录`;
								sendInmail(defenseUsrId, offenseUsrId, inmailContent);
							})
						}

						// 记录比赛结果
						t.recordMatchResult([
							offenseUsrId + '_' + offenseRes,
							defenseUsrId + '_' + defenseRes
						]);
					}
				});
			}
		})
	},

	recordMatchResult: function(items){
		for(let i in items){
			let item = items[i];
			item = item.split('_');
			let usrId = item[0];
			let res = item[1];
			let col = ['win', 'lose', 'tie'][res-1];
			let sql = `update usr_datum set ${col}=${col}+1 where usr_id = ${usrId}`;
			
			conn.query(sql, function(err, result){
				if(err)
					console.log(err);
			});
		}
	},

	markAsRead: function(res, patchObj, req){
		let sql = `update inmail set readed=1 where id=${patchObj.inmailId}`;
		conn.query(sql, function(err, result){
			if(err)
				console.log(err);

			res.end();
		});
	},

	toggleVideo: function(res, patchObj, req){
		let sql = `update video set hidden=${patchObj.hidden? 0: 1} where id=${patchObj.vId}`;
		conn.query(sql, function(err, result){
			if(err)
				console.log(err);

			res.end();
		});
	},

	markUsrPostReader: function(res, patchObj, req){
		var sql = `select readers from usr_post where id=${patchObj.postId}`;
		conn.query(sql, (err, readers)=>{
			if (err) return throwError(err, res);

			readers = readers[0].readers;
			readers = readers? readers.split(','): [];
			if(readers.indexOf(String(this.usrInfo.usrId)) === -1){
				readers.push(this.usrInfo.usrId);
				readers = readers.join(',');
	
				sql = `update usr_post set readers='${readers}' where id=${patchObj.postId}`;
				conn.query(sql, function(err, result){
					if (err) return throwError(err, res);
	
					res.end();
				})
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

	deleteIntroductoryVideo: function (res, deleteObj, req) {
		let vId = deleteObj.id;
		let sql = `delete from video_introductory where id=${vId}`;

		conn.query(sql, function (err, result, fields) {
			if (err) return throwError(err, res);

			if(result.affectedRows == 1)
				res.end()

			// 删除文件
			let del = require('del');
			let pristineVideoPath = global.staticRoot + '/multimedia/pristine_introductory_v/' + vId + '.mp4';
			let tsVideoPath = global.staticRoot + '/multimedia/ts_introductory/' + vId;

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

		if(postObj.isTutorial){
			var sql = `update video set album_id=?, headline=?, headline_eng=?, tag=?, need_translated=?, update_time=? where id=${vId}`;

			conn.query(sql, [postObj.albumId, postObj.headline, postObj.headlineEng, postObj.tag, postObj.needTranslated, Date.now()], function(err, result, fields){
				if(err)
					return throwError(err, res);
	
				res.end();
	
				// 更新album 和 sport
				let now = Date.now();
				let albumId = postObj.albumId;
	
				conn.query('update album set update_time = ' + now + ' where id=' + albumId);
				conn.query('update sport set update_time = ' + now + ' where id = (select sport_id from album where id = ' + albumId + ')');
	
				vId && this.generateVideo(vId, postObj);
			}.bind(this));
		}else{
			let sportId = postObj.sportId;

			var sql = `update video_introductory set sport_id=?, headline=?, headline_eng=?, tag=?, need_translated=?, update_time=? where id=${vId}`;

			conn.query(sql, [sportId, postObj.headline, postObj.headlineEng, postObj.tag, postObj.needTranslated, Date.now()], function(err, result, fields){
				if(err)
					return throwError(err, res);
	
				res.end();

				vId && this.generateIntroductoryVideo(vId, postObj);
			}.bind(this));
		}
	},

	updateAlbumInfo: function(res, putObj){
		var sql = `update album set sport_id=?, author_id=?, tag=?, update_time=? where id=${putObj.id}`;

		conn.query(sql, [putObj.sportId, putObj.maker, putObj.tag, Date.now()], function(err, result, fields){
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
				conn.query('update sport set update_time = ' + (Date.now()) + ' where id = (select sport_id from album where id = ' + putObj.id + ')');
			}
		});
	},

	updateSportInfo:function(res, putObj){
		var sql = `update sport set name=?, update_time=? where id=${putObj.id}`;

		conn.query(sql, [putObj.name, Date.now()], function(err, result, fields){
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
	var errCode = err.sqlMessage;

	res.statusCode = global.StatusCode.ServerErrorInternal;
	res.end(JSON.stringify({
		erorCode: errCode
	}))
}

function sendInmail(sender, receiver, content){
	let sql = `insert into inmail (sender, receiver, content, time) values (${sender}, ${receiver}, '${content}', now())`;

	conn.query(sql, function(err, result){
		if(err)
			console.log(err);

	});
}