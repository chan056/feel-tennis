const path = require('path');
const fs = require('fs');

let r =  require('./operation_ssr');
let tools = require('../tools');

module.exports = function(tempaltePath, params, res, req){
    // 解析模板 
    // 查询数据
    // 返回

    fs.readFile(tempaltePath, (err, data)=>{
        if(err)
            throwError(err, res);

        // 规定动态代码只出现一次
        let templateStr = data.toString();
        const dynamicCodePattern = /{{([\s\S]+?)}}/;

        let dataSourceCode = templateStr.match(dynamicCodePattern);
        let pageStructureCode = templateStr.replace(dynamicCodePattern, '');
        let dynamicDataSet = {};
        let reqNames = [];

        dynamicDataSet = new Proxy(dynamicDataSet, {
            get: (target, key, receiver) => {
                return target[key]
            },
            set: (target, key, value, receiver) => {
                target[key] = value;

                // console.log(countAttribute(target), reqNames.length)
                if(countAttribute(target) === reqNames.length){
                    // 数据准备完毕，解析模板
                    const pug = require('pug');
                    
                    var html = pug.compile(`- 
                    each item in dynamicDataSet
                    li= item`, {
                        dynamicDataSet: dynamicDataSet
                    });

                    console.log(html());
                }
                return true
            }
        })

        if(dataSourceCode){
            dataSourceCode =  dataSourceCode[1].trim();
            reqNames = eval(dataSourceCode);
            // console.log(reqNames);

            let operations = require('./operation_ssr')
            reqNames.forEach(reqName => {
                if(operations[reqName]){
                    operations[reqName](params, dynamicDataSet, res, req);
                }
            });
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