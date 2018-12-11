module.exports = {
    aesKey: 'key',// 密钥

    whiteList: [
        'localhost',
        '47.98.108.40',
        'www.yitube.cn',
        '192.168.33.30',// 公司
        '192.168.3.3',// 家
    ],// 访问白名单
    bootJS: 'tube.js',// JS入口
    sessionSecret: 'Q3UBzdH9GEfiRCTKbi5MTPyChpzXLsTD',// session加密字符
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
        pass: 'rpnuovesymglcaic',  //btwnqqiqgvjybiid
    },

    isLocalData: 1,// 是否连接本地数据库

    dbConfig: {
        host: 'localhost',
        user: 'root',
        password: '62191056',
        database: 'n',
        multipleStatements: true// 执行多条语句
    },

    dbConfigProductive: {
        host: '47.98.108.40',
        user: 'root',
        password: '62191056',
        database: 'n',
        multipleStatements: true// 执行多条语句
    },

    videoCoverSize: '210x118',
    avtarThumbWidth: 50,
    indexPath: '/page/index.html',
    site: 'www.yitube.cn'
}