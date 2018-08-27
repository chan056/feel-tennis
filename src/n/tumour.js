module.exports = {
    joinIndexJS: function(res, usrInfo){
        const path = require('path');
        const fs = require('fs');

        const staticRoot = global.staticRoot;
        let f1 = staticRoot + '/js/admin.js';
        let f2 = staticRoot + '/js/tube.js';

        if(usrInfo && usrInfo.isAdmin == 1){
            const concat = require('concat-files');
            let usrId = usrInfo.usrId;
            let tmp = staticRoot + `/js/tmp_${usrId}.js`

            concat([
                f1,
                f2
            ], tmp, function(err) {
                if (err) throw err;

                fs.readFile(tmp, "binary", function(err, file) {
                    res.write(file, "binary");
                    res.end();

                    require('del')(tmp)
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