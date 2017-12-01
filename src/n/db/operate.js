let conn = require('./connect.js').conn;

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

			result.push({x : 'queryAlbumList'})
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

	}
}

module.exports.operate = function (operationName, params, response) {
	console.log(arguments[0], arguments[1])
	qualification = parseParam(params);
	operations[operationName](response, qualification);
}

function parseParam(params) {
	if (isEmpty(params)) {
		return '';
	}

	var qualification = ' where ';
	var n = 0;
	for (var i in params) {
		let k = params[i];

		n == 0?
			qualification += i + '=' + k:
			qualification += ' and ' + i + '=' + k;

		n ++;
	}

	return qualification;
}

function isEmpty(obj) {
	return (Object.getOwnPropertyNames(obj).length === 0);
}