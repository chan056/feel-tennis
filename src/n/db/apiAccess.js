// 权限
//  100 管理员
//  10 注册用户
//  1 临时用户

module.exports = {
    config: {
        '/logout': 10,
        
        '/makers': 100,

        '/maker/:id': 100,

        '/video': 100,

        '/tag': 100,

        '/album': 100,

        '/maker': 100,
    },
    check: function(path){
        let config = this.config;
        let apiAccessLevel = config[path];
        
        if(apiAccessLevel){
            let authority = 1;

            let usr = global.usrInfo;
            if(usr.type == 1){
                authority = 10;
                if(usr.isAdmin == 1){
                    authority = 100;
                }
            }

            if(authority < apiAccessLevel){
                return false;
            }
        }

        return true;
    }
}