// 权限
//  100 管理员
//  10 注册用户
//  1 临时用户

let config = {
    '/voteNext': {level: 10, visits: 1},

    '/gifLink': {level: 10, visits: 3},

    '/vStars': {level: 10},

    '/screenshots': {level: 10},

    '/star/:starId': {level: 10},

    '/queryStarVideo': {level: 10},

    '/starVideo/:star_id': {level: 10},

    '/queryVoteComment/:vId': {level: 10},

    '/queryUsrVideoStars/:v_id': {level: 10},

    '/usrVshoot/:v_id': {level: 10},
    
    '/usrShotVideos':{level: 10},

    '/video/:v_id/remarks': {level: 10},

    '/usrDatum': {level: 10},

    '/relatedMatches': {level: 10},

    '/match': {level: 10},

    '/matchResult': {level: 10},

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
        // console.log(path)
        if(apiAccessConfig){
            let apiAccessLevel = apiAccessConfig.level;
        
            if(apiAccessLevel){
                let authority = usrAuthority(usrInfo);
                // console.log(path, authority + ' > ' + apiAccessLevel)
                if(authority < apiAccessLevel){
                    console.log('==========S==========');
                    console.log(path, usrInfo, authority, apiAccessLevel)
                    console.log('==========E==========');
                }
    
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
    },

    
}