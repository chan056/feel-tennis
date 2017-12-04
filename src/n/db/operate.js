let conn = require('./connect.js').conn;
let tools = require('../tool');

var operations = {
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
			
			res.end('success');
		});
	}
}

module.exports.operate = function (operationName, params, response, reqMethod) {
	console.log(arguments[0], arguments[1])
	reqMethod = reqMethod || 'get';
	if(reqMethod == 'get'){
		qualification = generateQuerySQL(params);
		operations[operationName](response, qualification);
	}else if(reqMethod == 'post'){
		operations[operationName](response, params);
	}
}

function generateQuerySQL(params) {
	
	if (tools.isEmpty(params)) {
		return '';
	}

	var qualification = ' where ';
	var n = 0;
	for (var i in params) {
		let k = params[i];
		k = conn.escape(k);

		n == 0?
			qualification += i + '=' + k:
			qualification += ' and ' + i + '=' + k;

		n ++;
	}

	return qualification;
}

