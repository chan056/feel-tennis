const path = require('path');
const fs = require('fs');
const ejs = require('ejs');

let tools = require('../tools');

module.exports = function(tempaltePath, routeParams, res, req){
    // 解析模板 
    // 查询数据

    fs.readFile(tempaltePath, (err, data)=>{
        if(err)
            throwError(err, res);

        // 规定动态代码只出现一次
        let templateStr = data.toString();
        const dynamicCodePattern = /{{%([\s\S]+?)%}}/;

        let dataSourceCode = templateStr.match(dynamicCodePattern);
        let pageStructureCode = templateStr.replace(dynamicCodePattern, '');
        let dynamicDataSet = {};
        let reqs = [];

        dynamicDataSet = new Proxy(dynamicDataSet, {
            get: (target, key, receiver) => {
                return target[key]
            },
            set: (target, key, value, receiver) => {
                target[key] = value;

                if(countAttribute(target) === reqs.length){
                    // 数据准备完毕，解析模板
                    renderFile({
                        dynamicDataSet: dynamicDataSet
                    });
                }

                return true
            }
        })

        if(dataSourceCode){
            const operate = require('./operate');

            dataSourceCode =  dataSourceCode[1].trim();
            reqs = eval(dataSourceCode);
            // console.log(reqs);

            reqs.forEach(reqData => {
                res.dynamicDataSet = dynamicDataSet;
                
                if(typeof reqData == 'string'){
                    operate.query(reqData, routeParams, res, req);
                }else if(typeof reqData == 'object'){// 自定义参数
                    let keymap = reqData.keymap;
                    let reqParams = reqData.params || {};

                    // 复制属性给特定接口使用
                    // keymap {p1: 'playerId'} // p1属性复制出playerId
                    // {p1: 100, p2: 200} => {p1: 100, p2: 200, playerId: 100}
                    if(keymap){
                        for(let k in keymap){
                            if(routeParams[k] != undefined){
                                reqParams[keymap[k]] = routeParams[k];
                            }
                        }
                    }

                    operate.query(reqData.method, reqParams, res, req);
                }
            });
            
        }else{
            if(tempaltePath.match('shortcut.ssr')){
                renderFile({
                    links: require('./shorcut.js')
                });
            }
        } 

        function renderFile(renderOpt){
            let renderTools = require('../collector/tools/main.front');
            let opt = Object.assign({
                filename: tempaltePath,
                renderTools: renderTools
            }, renderOpt)
            
            try{
                var html = ejs.render(pageStructureCode.trim(), opt);

                res.end(html);
            }catch(e){
                res.end(e.message);
            }
        }        
    })
}

function throwError(err, res){
	res.statusCode = 500;
	res.end(JSON.stringify(err))
}

function countAttribute(obj) {
    var count = 0;
    for(var i in obj) {
        if(obj.hasOwnProperty(i)) {  // 建议加上判断,如果没有扩展对象属性可以不加
            count++;
        }
    }
    return count;
}