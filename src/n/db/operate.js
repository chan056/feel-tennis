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

module.exports.query = function (operationName, params, response) {
	// console.log(arguments[0], arguments[1])
	qualification = generateQuerySQL(params);
	operations[operationName](response, qualification);

}

module.exports.post = function (operationName, request, response) {
	// console.log(arguments[0], arguments[1])
	var formidable = require('formidable');
	var form = new formidable.IncomingForm();

	form.parse(request, function(err, fields, files){
		operations[operationName](response, fields);
	});
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

