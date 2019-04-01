let o = {
    evtInfo: [{
        title: '注册',
        name: 'regist',
    },{
        title: '资助',
        name: 'fund',
        tar: '#guide-fund-1',
    },{
        title: '竞赛',
        name: 'compete',
        tar: '#guide-compete-1',
    },{
        title: '视频播放',
        name: 'video',
        tar: '.video-thumb',
        delegator: 'body'
    },{
        prerequisite: detector.browser.safari? true: false,
        title: '添加快捷方式到主屏幕',
        name: 'homescreen',
        tar: 'body',
    },{
        prerequisite: Boolean(detector.browser.chrome) && !isMobile,
        title: '添加快捷方式到桌面',
        name: 'homescreenPC',
        tar: 'body',
    }],
    
    regist: [
        {
            selector: '#usr-btns', 

            lines: `
                注册人口在这<i class="fa fa-handshake-o"></i>
            `,
            direction: 'up'
        }
    ],

    fund: [
        {
            selector: '#guide-fund-1', 

            lines: `
                站长要搭建网站、收集并翻译视频,<br/>
                需要极大的精力投入,<br/>
                如果喜欢这个平台请支持我们<br/>
                <i class="fa fa-handshake-o"></i>
            `,
            direction: 'up'
        }
    ],

    compete: [
        {
            lines: `
                这是竞技场,<br/>
                你可以在这找到志趣相投、水平相近的伙伴,<br/>
                一起打球、一起交流
            `,
        },

        {
            lines: `
                ${window.isMobile? '双击': '右键'}其他用户头像,<br/>
                可以发起挑战,<br/>
                等待对手应战后，可获取对方联系方式
            `,
        }
    ],

    video: [
        {
            lines: `
                这是视频播放页
            `,
            direction: 'left'
        },
        {
            selector: '#capture-btn',
            lines: `
                可以截取小视频，会出现在左侧收藏夹
            `,
            direction: 'down'
        },
        {
            selector: '#mark-btn',
            lines: `
                可以在这留言
            `,
            direction: 'down'
        },
        
        {
            selector: '#star-btn',
            lines: `
                将视频添加到你的收藏夹
            `,
            direction: 'down'
        },

        {
            selector: '#link-to-translator',
            lines: `
                帮忙翻译视频!!
            `,
            direction: 'down'
        }
    ],
    homescreen: [
        {
            lines: `<img style="width: 100%;" src="/img/safari_finder_1.jpg">`,
        },
        {
            lines: `<img style="width: 100%;" src="/img/safari_finder_2.jpg">`,
        }
    ],
    
    homescreenPC: [
        {
            lines: `
                <a target="_blank" href="https://jingyan.baidu.com/article/bad08e1e21512409c85121d7.html">查看详细教程，便于下次访问</a>
            `,
        }
    ]
}

// if(window.isMobile){
//     o.push();
// }

module.exports = o;