module.exports = {
    joinIndexJS: function(res, usrInfo){
        const path = require('path');
        const fs = require('fs');

        let dir = path.resolve(__dirname, '../static');
        let f1 = dir + '/js/admin.js';
        let f2 = dir + '/js/tube.js';

        if(usrInfo && usrInfo.isAdmin == 1){
            const concat = require('concat-files');
            
            let tmp = dir + '/js/tmp.js'

            concat([
                f1,
                f2
            ], tmp, function(err) {
                if (err) throw err;

                fs.readFile(tmp, "binary", function(err, file) {
                    res.write(file, "binary");
                    res.end();
                });
            });
        }else{
            fs.readFile(f2, "binary", function(err, file) {
                res.write(file, "binary");
                res.end();
            });
        }

	},
}