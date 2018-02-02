var pathToRegexp = require('path-to-regexp');

var routerConfig = require('./routerConfig');
var tools = require('../tool');

// 从路径中抽取参数
function resolveApiPath(res, req) {
    var paramsMathed = {};
    var pathMatch;
    var fnMatched;
    var keys;

    for (var k in routerConfig) {
        var f = routerConfig[k];
        keys = [];

        var pathReg = pathToRegexp(k, keys);
        pathMatch = pathReg.exec(UO.pathname);

        if (pathMatch) {
            fnMatched = f;
            break;
        }
    }

    // console.log(keys)

    if (pathMatch) {
        for (let i = 0, l = keys.length; i < l; i++) {
            let key = keys[i];
            let keyName = key.name;
            if (pathMatch[i + 1] != undefined)
                paramsMathed[keyName] = pathMatch[i + 1]
        }
    }

    if (fnMatched) {
        let reqMethod = req.method;

        if (reqMethod == 'GET') {
            // 将params和query结合
            let queryParams = Object.assign(paramsMathed, UO.query);
            fnMatched(queryParams, res);
        } else {
            if (reqMethod == 'POST') {
                fnMatched(req, res);
            }
        }
    } else {
        tools.response404(res);
    }
}

module.exports = { resolveApiPath: resolveApiPath };