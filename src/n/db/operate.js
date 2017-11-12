var conn = require('./connect.js').conn;
var qualification,
	res;

var operations = {
	querySports: function () {

		conn.query('SELECT * from sport' + qualification, function (err, result, fields) {
			if (err) throw err;

			result = JSON.stringify(result);
			res.end(result)
		});

	},

	queryAlbumList: function () {

		conn.query('SELECT * from albumList' + qualification, function (err, result, fields) {
			if (err) throw err;

			result = JSON.stringify(result);
			res.end(result)
		});

	},

	queryAlbum: function () {

		conn.query('SELECT * from album' + qualification, function (err, result, fields) {
			if (err) throw err;

			result = JSON.stringify(result);
			res.end(result)
		});

	}
}

module.exports.operate = function (operationName, params, response) {
	qualification = parseParam(params);
	res = response;
	operations[operationName]();
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