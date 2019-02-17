function resolvePathSSR(req, res) {
    const pathToRegexp = require('path-to-regexp');
    const path = require('path');
    var routerConfig = require('./router_config_ssr');
    var tools = require('../tools');

    var routerName;
    var pathReg;
    var pathMatched;
    let templateMatched,
        routerNameMatched;

    var keys;
    var urlObj = require('url').parse(req.url, true);
    var pathname = urlObj.pathname.replace(/\.ssr$/, '');

    for (routerName in routerConfig) {
        keys = [];

        pathReg = pathToRegexp(routerName, keys);
        pathMatched = pathReg.exec(pathname);

        if (pathMatched) {
            templateMatched = routerConfig[routerName];
            routerNameMatched = routerName;
            // console.log(keys, templateMatched, routerName);
            break;
        }
    }

    // 根据routerName 和 参数 定位 cache文件
        // 存在
            // continue
        // 不存在
            // node xxx xx
                // continue

    if(routerNameMatched){

    }
 
    if (templateMatched) {
        var paramsMathed = {};
        extractParamFromPath();

        // 将params和query结合 /a/1?b=2
        let params = Object.assign(paramsMathed, urlObj.query);

        const templateDir = '../template';
        const templateSuffix = '.ssr';
        let ssrTemplateParser = require('./template_parser_ssr');
        let templateAbsPath = path.resolve(__dirname, templateDir, templateMatched + templateSuffix);
        ssrTemplateParser(templateAbsPath, params, res, req);

        function extractParamFromPath(){
            for (let i = 0, l = keys.length; i < l; i++) {
                if (pathMatched[i + 1] != undefined)
                    paramsMathed[keys[i].name] = pathMatched[i + 1]
            }
        }
    } else {
        tools.response404(res);
    }
}

module.exports = { resolvePathSSR: resolvePathSSR };