var conn = require('./connect.js').conn;

module.exports = {
	querySports : function(res){
		
		conn.query('SELECT * from sport', function(err, result, fields) {
			if (err) throw err;
		
			result = JSON.stringify(result);
			res.end(result)
		});
	},

	queryAlbumList : function(res){
		
		conn.query('SELECT * from albumList', function(err, result, fields) {
			if (err) throw err;
		
			result = JSON.stringify(result);
			res.end(result)
		});
	},

	queryAlbum : function (res) {
		
		conn.query('SELECT * from album', function (err, result, fields) {
			if (err) throw err;
	
			result = JSON.stringify(result);
			res.end(result)
		});
	
	}
}
