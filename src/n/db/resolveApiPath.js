var pathToRegexp = require('path-to-regexp');
var routerConfig = require('./routerConfig');
var tools = require('../tools');

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

        // 临时用户 注册用户 admin
        let impowered = require('./apiAccess').check(k);

        if(!impowered){
            res.statusCode = 401;
            return res.end('Unauthorized: ' + urlObj.pathname);
        }else{
            if(typeof impowered == 'function'){// 普通用户
                let checkAccessLimit = impowered;
                checkAccessLimit(k, function(){
                    // 新增api acess log
                    let usrId = global.usrInfo.usrId || 0;

                    if(usrId){
                        let conn = require('./connect').conn;
                        let isAdmin = global.usrInfo.isAdmin || '0';
                        
                        /* let qSql = `select count(*) as dayApiAccessCount from usr_api_access_log where api='${k}' and uid=${usrId} and TO_DAYS( NOW() ) - TO_DAYS( timestamp ) <= 1`;
                        conn.query(qSql, function(err, result){
                            if(err)
                                console.log(err);
                            
                            if(result && result[0]){
                                let uSql = `update usr_api_access_log set count where api='${k}' and uid=${usrId} and TO_DAYS( NOW() ) - TO_DAYS( timestamp ) <= 1`
                                console.log(result)
                            }
                        }); */
                        // 记录
                        let iSql = `insert into usr_api_access_log (api, uid, is_admin, timestamp) values ('${k}', ${usrId}, '${isAdmin}', now())`;
                        conn.query(iSql);
                    }

                    gg();
                }, function(){// 超过限制
                    res.statusCode = 402;
                    res.statusMessage = 'exceed access limit';
                    return res.end();
                });
            }else{
                gg();
            }
        }
        
        function gg(){
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
        }
    } else {
        tools.response404(res);
    }
}

module.exports = { resolveApiPath: resolveApiPath };