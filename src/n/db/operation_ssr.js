let conn = require('./connect.js').conn;
let tools = require('../tools');
// let usrInfo = {};

let operations = {

    queryAthletes: function (params, dataSet, res, req) {
        conn.query('SELECT * from athlete' , function (err, result, fields) {
            if (err)
                throw err;

            dataSet['queryAthletes'] = result; 
        });

    },

}

module.exports = operations;