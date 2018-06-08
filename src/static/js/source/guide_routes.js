module.exports = {
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
            selector: '#guide-compete-1', 

            lines: `
                这是竞技场入口,<br/>
                你可以在这找到志趣相投、水平相近的伙伴,<br/>
                一起打球、一起交流
            `,
            direction: 'left',
            trigger: true
        },

        {
            lines: `
                右键其他用户头像,<br/>
                可以发起挑战,<br/>
                等待对手应战，可获取对方联系方式
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
    ]
}