var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '62191056',
    database:'n'
});


exports.conn = connection;