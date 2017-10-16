var conn = require('./connect.js').conn;

//查询

exports.queryAlbum = function(res){
	
	conn.query('SELECT * from album', function(err, result, fields) {
    	if (err) throw err;
    
	    result = JSON.stringify(result);
	    res.end(result)
	});

};