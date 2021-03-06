function resolveApiPath(req, res) {
    var pathToRegexp = require('path-to-regexp');
    var routerConfig = require('./routerConfig');
    var tools = require('../tools');

    var path;
    var pathReg;
    var pathMatched;
    var fnMatched;
    var keys;
    var urlObj = require('url').parse(req.url, true);
    urlObj.pathname = urlObj.pathname.replace(/\/api/, '');

    let reqMethod = req.method.toLowerCase();
    routerConfig = routerConfig[reqMethod];

    for (path in routerConfig) {
        var routerHandler = routerConfig[path];
        keys = [];

        pathReg = pathToRegexp(path, keys);
        pathMatched = pathReg.exec(urlObj.pathname);

        if (pathMatched) {
            fnMatched = routerHandler;
            break;
        }
    }
 
    if (fnMatched) {
        if(typeof fnMatched == 'function'){
            shunt();
        }else{
            let limit = fnMatched.limit,
                level = limit.level,
                visits = limit.visits;

            if(!Number(req.usrInfo.usrId)){//  && !admin
                res.statusCode = global.StatusCode.ClientErrorUnauthorized;
                res.statusMessage = 'User Not Login';
                return res.end();
            }
            
            if(!Number(req.usrInfo.isActive)){//  && !admin
                res.statusCode = global.StatusCode.ClientErrorForbidden;
                res.statusMessage = 'User Not Activated';
                return res.end();
            }

            fnMatched = fnMatched.fn;

            if(level){
                let usrLevel = usrAuthority(req.usrInfo);

                if(usrLevel >= level){
                    let cookies = require('cookie').parse(req.headers.cookie || '');
                    // 延长token时间
                    require('../cookie').setCookie(res, {
                        name: `sid`,
                        value: cookies.sid,
                        plainValue: true,
                        expires: new Date(Date.now() + 1*60*60*24*1000).toUTCString(),
                    });

                    if(usrLevel == 10 && visits){
                        // 普通用户, 特定接口访问次数限制
                        let conn = require('./connect');
                        let sql = `select * 
                            from usr_api_access_log 
                            where uid=${req.usrInfo.usrId} 
                            and api='${path}' 
                            and TO_DAYS( NOW() ) - TO_DAYS( timestamp ) <= 1`;
                        
                        conn.query(sql, function(err, result){
                            if(err)
                                console.log(err);

                            if(result.length){
                                let accessCount = result.length;

                                if(accessCount < visits){
                                    scb();
                                }else{
                                    ecb();
                                }
                            }else{
                                scb();
                            }
                        });

                        function scb (){
                            let usrId = req.usrInfo.usrId || 0;
        
                            if(usrId){
                                let isAdmin = req.usrInfo.isAdmin || '0';
                                
                                let iSql = `insert into usr_api_access_log (api, uid, is_admin, timestamp)
                                 values ('${path}', ${usrId}, '${isAdmin}', now())`;
                                conn.query(iSql);
                            }
        
                            shunt();
                        }

                        function ecb(){
                            res.statusCode = global.StatusCode.ClientErrorForbidden;
                            res.statusMessage = 'exceed access limit';
                            return res.end();
                        }
                    }else{
                        shunt();
                    }
                }else{
                    res.statusCode = global.StatusCode.ClientErrorUnauthorized;
                    return res.end('Unauthorized: ' + urlObj.pathname);
                }
            }
        }
        
        function shunt(){
            var paramsMathed = {};
            extractParamFromPath();

            if (reqMethod == 'get') {
                // 将params和query结合 /a/1?b=2
                let params = Object.assign(paramsMathed, urlObj.query);
                if(params['_']){delete params['_']}
                fnMatched(params, res, req);
            } else {
                fnMatched(req, res, paramsMathed);
            }

            function extractParamFromPath(){
                for (let i = 0, l = keys.length; i < l; i++) {
                    if (pathMatched[i + 1] != undefined)
                        paramsMathed[keys[i].name] = pathMatched[i + 1]
                }
            }
        }
    } else {
        tools.response404(res);
    }
}

function usrAuthority(usrInfo){
    let authority = 1;

    if(usrInfo.type == 1){
        authority = 10;
        if(usrInfo.isAdmin == 1){
            authority = 100;
        }
    }

    return authority;
}

module.exports = { resolveApiPath: resolveApiPath };