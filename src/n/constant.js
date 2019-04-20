const fs = require('fs');

let CONSTANTS = {

    whiteList: [
        'localhost',
        '47.98.108.40',
        'www.yitube.cn',
        '192.168.3.12',// 家
    ],// 访问白名单
    bootJS: 'tube.js',// JS入口
    maxDayView: 100,// 注册用户最大访问量
    tmpUsrDayView: 10,// 临时用户日常访问量
    gifMaxDuration: 15,// 用户截取gif的时间最大值
    previewWidth: 210,// 预览图宽度 不管是gif 还是 jpg
    dynamicPreview:{// 视频动态预览图
        duration: 8,
        width: 210
    },

    videoCoverSize: '210x118',
    avtarThumbWidth: 50,
    indexPath: '/page/index.html',
    site: 'www.yitube.cn'
};
// console.log(fs.existsSync('./constant_key.js'))
var keyConstantFilePaht = require('path').resolve(__dirname, './constant_key.js');
if(fs.existsSync(keyConstantFilePaht)){
    CONSTANTS = Object.assign(CONSTANTS, require(keyConstantFilePaht))
}
module.exports = CONSTANTS;
