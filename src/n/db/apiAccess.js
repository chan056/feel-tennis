// 权限
//  100 管理员
//  10 注册用户
//  1 临时用户

let config = {
    // '/logout': {level: 10},

    '/voteNext': {level: 10, visits: 1},

    '/gifLink': {level: 10, visits: 3},

    '/stars': {level: 10},

    '/star/:starId': {level: 10},

    '/queryVoteComment/:vId': {level: 10},

    '/queryUsrVideoStars/:v_id': {level: 10},
    
    '/makers': {level: 100},

    '/maker/:id': {level: 100},

    '/video': {level: 100},

    '/tag': {level: 100},

    '/album': {level: 100},

    '/maker': {level: 100},
};

module.exports = {
    check: function(path, usrInfo){
        let apiAccessConfig = config[path];

        if(apiAccessConfig){
            let apiAccessLevel = apiAccessConfig.level;
        
            if(apiAccessLevel){
                let authority = require('../tools').usrAuthority(usrInfo);
                this.authority = authority;
    
                if(authority < apiAccessLevel){
                    return false;
                }else{
                    // 是普通用户 并且 访问次数有限制
                    if (authority == 10 && apiAccessConfig.visits){
                        return this.checkAccessLimit;
                    }else{
                        return true;
                    }
                }
            }else{
                return true;
            }
        }else{
            return true;
        }
    },

    // 普通用户, 特定接口访问次数限制
    checkAccessLimit: function(path, scb, ecb, usrInfo){
        let apiAccessConfig = config[path];
            // 查询是否超过限制
            let accessLimit = apiAccessConfig.visits;
            let conn = require('./connect').conn;
            let sql = `select * 
                from usr_api_access_log 
                where uid=${usrInfo.usrId} 
                and api='${path}' 
                and TO_DAYS( NOW() ) - TO_DAYS( timestamp ) <= 1`;
            
            conn.query(sql, function(err, result){
                if(err)
                    console.log(err);

                if(result.length){
                    let accessCount = result.length;

                    if(accessCount < accessLimit){
                        scb();
                    }else{
                        ecb();
                    }
                }else{
                    scb();
                }
            });
    }
}