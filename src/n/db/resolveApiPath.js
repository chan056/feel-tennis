var pathToRegexp = require('path-to-regexp');

var routerConfig = require('./router');
var tools = require('../tool');

// 从路径中抽取参数
function resolveApiPath(pathname, response) {
    var paramsMathed = {};
    var pathMatch;
    var fnMatched;
    var keys;
    
    for(var k in routerConfig){
        var f = routerConfig[k];
        keys = [];
    
        var pathReg = pathToRegexp(k, keys);
        pathMatch = pathReg.exec(pathname);
    
        if(pathMatch){
            fnMatched = f;
            break;
        }
    }
    
    if(pathMatch){
        for(let i=0, l=keys.length; i < l; i++){
            let key = keys[i];
            let keyName = key.name;
            if(pathMatch[i + 1] != undefined)
                paramsMathed[keyName] = pathMatch[i + 1]
        }
    }
    if(fnMatched){
        fnMatched(paramsMathed, response);
    }else{
        tools.response404(response);
    }
}

module.exports = {resolveApiPath: resolveApiPath};