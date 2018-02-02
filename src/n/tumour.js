

module.exports = {
    joinIndexJS: function(req, res){
    
        var concat = require('concat-files');
        var path = require('path');
        
        let dir = path.resolve(__dirname, '../../static');
        let f1 = dir + '/js/admin.js';
        let f2 = dir + '/js/tube.js';
        let tmp = dir + '/js/tmp.js'

        concat([
            f1,
            f2
        ], tmp, function(err) {
            if (err) throw err

            const fs = require('fs');
            fs.readFile(tmp, "binary", function(err, file) {
                res.write(file, "binary");
                res.end();
            });
        });
	},
}