var pathToRegexp = require('path-to-regexp');
var routerConfig = require('./routerConfig');
var tools = require('../tool');

// 从路径中抽取参数
function resolveApiPath(res, req) {
    var paramsMathed = {};
    var pathMatch;
    var fnMatched;
    var keys;
    var urlObj = require('url').parse(req.url, true);

    for (var k in routerConfig) {
        var f = routerConfig[k];
        keys = [];

        var pathReg = pathToRegexp(k, keys);
        pathMatch = pathReg.exec(urlObj.pathname);

        if (pathMatch) {
            fnMatched = f;
            break;
        }
    }


    if (fnMatched) {
        console.log(k);
        // console.log(usrInfo, pathMatch);

        // 临时用户 注册用户 admin
        let impowered = require('./apiAccess').check(k);

        if(!impowered){
            res.statusCode = 401;
            return res.end('Unauthorized: ' + urlObj.pathname);
        }
        
        let reqMethod = req.method;

        if (reqMethod == 'GET') {
            for (let i = 0, l = keys.length; i < l; i++) {
                let key = keys[i];
                let keyName = key.name;
                if (pathMatch[i + 1] != undefined)
                    paramsMathed[keyName] = pathMatch[i + 1]
            }
            // 将params和query结合
            let queryParams = Object.assign(paramsMathed, urlObj.query);
            
            fnMatched(queryParams, res);
        } else {
            if (reqMethod == 'POST') {
                fnMatched(req, res);
            }

            if (reqMethod == 'PATCH') {
                fnMatched(req, res);
            }
        }
    } else {
        tools.response404(res);
    }
}

module.exports = { resolveApiPath: resolveApiPath };