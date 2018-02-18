module.exports = {
    whiteList: 'http://localhost:3000/',// 访问白名单
    bootJS: 'tube.js',// JS入口
    sessionSecret: 'Q3UBzdH9GEfiRCTKbi5MTPyChpzXLsTD',// session 加密字符
    maxDayView: 100,// 注册用户最大访问量
    tmpUsrDayView: 10,// 临时用户日常访问量
    gifMaxDuration: 15,// 用户截取gif的时间最大值
    previewWidth: 210,// 预览图宽度 不管是gif 还是 jpg
    dynamicPreview:{// 视频动态预览图
        duration: 8,
        width: 210
    },
    emailSender: {
        service: 'QQ',
        user: '374029208@qq.com',
        pass: 'btwnqqiqgvjybiid',
    }
}