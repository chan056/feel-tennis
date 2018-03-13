var pathToRegexp = require('path-to-regexp');
var routerConfig = require('./routerConfig');
var tools = require('../tools');

// 从路径中抽取参数
function resolveApiPath(req, res) {
    var path;
    var pathReg;
    var pathMatched;
    var fnMatched;
    var keys;
    var urlObj = require('url').parse(req.url, true);

    for (path in routerConfig) {
        var f = routerConfig[path];
        keys = [];

        pathReg = pathToRegexp(path, keys);
        pathMatched = pathReg.exec(urlObj.pathname);

        if (pathMatched) {
            fnMatched = f;
            break;
        }
    }

    if (fnMatched) {
        // 临时用户 注册用户 admin
        let impowered = require('./apiAccess').check(path, req.usrInfo);

        if(!impowered){
            res.statusCode = 401;
            return res.end('Unauthorized: ' + urlObj.pathname);
        }else{
            if(typeof impowered == 'function'){
                let checkAccessLimit = impowered;
                checkAccessLimit(path, function(){
                    // 新增api acess log
                    let usrId = req.usrInfo.usrId || 0;

                    if(usrId){
                        let conn = require('./connect').conn;
                        let isAdmin = req.usrInfo.isAdmin || '0';
                        
                        // 记录
                        let iSql = `insert into usr_api_access_log (api, uid, is_admin, timestamp)
                         values ('${path}', ${usrId}, '${isAdmin}', now())`;
                        conn.query(iSql);
                    }

                    shunt();
                }, function(){// 超过限制
                    res.statusCode = 402;
                    res.statusMessage = 'exceed access limit';
                    return res.end();
                }, req.usrInfo);
            }else{
                shunt();
            }
        }
        
        function shunt(){
            var paramsMathed = {};

            let reqMethod = req.method;

            if (reqMethod == 'GET') {
                for (let i = 0, l = keys.length; i < l; i++) {
                    let key = keys[i];
                    let keyName = key.name;
                    if (pathMatched[i + 1] != undefined)
                        paramsMathed[keyName] = pathMatched[i + 1]
                }
                // 将params和query结合
                let queryParams = Object.assign(paramsMathed, urlObj.query);
                
                fnMatched(queryParams, res, req);
            } else {
                for (let i = 0, l = keys.length; i < l; i++) {
                    let key = keys[i];
                    let keyName = key.name;
                    if (pathMatched[i + 1] != undefined)
                        paramsMathed[keyName] = pathMatched[i + 1]
                }

                if (reqMethod == 'POST') {
                    fnMatched(req, res, paramsMathed);
                }

                if (reqMethod == 'PATCH') {
                    fnMatched(req, res, paramsMathed);
                }
            }
        }
    } else {
        tools.response404(res);
    }
}

module.exports = { resolveApiPath: resolveApiPath };