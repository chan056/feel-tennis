module.exports = function(){
    var fragment = {
        attachVideo: function(vId, resolution, isIntroductory, selector){
            let m3u8 = '';
            if(window.isMobile){
                resolution = resolution || 480;
                m3u8 = resolution + 'p'
            }else if(resolution){
                m3u8 = resolution + 'p'
            }else{
                m3u8 = '_'
            }

            let tsRoot = isIntroductory? `/multimedia/ts_introductory/${vId}/`: `/multimedia/ts/${vId}/`;
            let pristineRoot = isIntroductory? `/multimedia/pristine_introductory_v/`: `/multimedia/pristine_v/`; 
            let video = selector? `document.querySelector('${selector}')`: `$('video')[0]`;

            return `{
                var m3u = '${tsRoot}${m3u8}.m3u8';
                var video = ${video};

                // Chrome for Android 34+
                // Chrome for Desktop 34+
                // Firefox for Android 41+
                // Firefox for Desktop 42+
                // IE11+ for Windows 8.1+
                // Edge for Windows 10+
                // Opera for Desktop
                // Vivaldi for Desktop
                // Safari for Mac 8+ (beta)
                if(Hls.isSupported()) {
                    var hls = new Hls({
                        maxBufferLength: 20,
                        maxMaxBufferLength: 20,
                        enableWebVTT: true
                    });
                    
                    hls.loadSource(m3u);
                    
                    hls.attachMedia(video);

                    hls.on(Hls.Events.MANIFEST_PARSED,function() {
                        video.volume = .6;
                    });

                    // 翻译页 使用自定义字幕 便于修改后刷新
                    if(${resolution} && !${isIntroductory}){

                    }else{
                        var s = '<track kind="subtitles" src="${tsRoot}subtitle.zh.vtt" srclang="zh" label="中文" default></track>';
                        $(video).prepend(s);
    
                        var s = '<track kind="subtitles" src="${tsRoot}subtitle.vtt" srclang="en" label="英文"></track>';
                        $(video).prepend(s);
                    }

                }else if (video.canPlayType('application/vnd.apple.mpegurl')) {// IOS
                    video.src = m3u;
                    
                    // 检查有哪种字幕 排在前面
                    var s = '<track kind="subtitles" src="${tsRoot}subtitle.vtt" srclang="en" label="英文"></track>';
                    $(video).prepend(s);

                    s = '<track kind="subtitles" src="${tsRoot}subtitle.zh.vtt" srclang="zh" label="中文" default></track>';
                    $(video).prepend(s);
                }else{//IE 9 10 11
                    video.src = '${pristineRoot}${vId}.mp4';
                    tools.bindSubtitle(${vId})
                    // 伪全屏 为了显示字幕 TODO
                        // 	tools.fullscreen.watchFullscreenChange(function(){
                        // 		$('html').css('opacity', 0)
                        // 		tools.fullscreen.exit();
                        // 		setTimeout(()=>{
                        // 			// tools.fullscreen.launch(document.documentElement);//不生效TODO，需要手动点击
                        // 			setTimeout(()=>{//伪全屏
                        // 				tools.addfullScreenMask();
                        // 				$('html').css('opacity', 1)
                        // 				fitTowindow('#player-wrapper', window)
                        // 			}, 100)
                        // 		}, 100)
            
                        // 	});
                        // }
        
                        // function fitTowindow(from, to){
                        // 	from = $(from);
                        // 	to = $(to);
                            
                        // 	let zoomLevel = Math.min(to.height()/from.height(), to.width()/from.width());
        
                        // 	from.children('video').css({
                        // 		height: from.height() * zoomLevel,
                        // 	});
        
                        // 	from.addClass('fixed-center')

                        // route change 还原
                }
            }`
        },

        attachSubtitle: `
            console.log('attachSubtitle loaded')
        `,
    
        captcha: `
            {
                if(!$('.jCaptcha').siblings('.jCaptchaText').length){
                    var myCaptcha = new jCaptcha({
                        callback: function(response, $captchaInputElement) {
                            alert(response)
                            alert($captchaInputElement[0].value)
                            // console.log($captchaInputElement)
                            if (response == 'success') {
                                $('#regist-btn').show();
                            }else if (response == 'error') {
                                $('#regist-btn').hide();
                            }
                        },
                        focusOnError: false
                    });
            
                    $('.jCaptcha').on('blur', function(e) {
                        alert('blur')
                        e.preventDefault();
                        myCaptcha.validate();
                    });
                }
            }
        `,

        baiduLinkPusher: `
            {
                var bp = document.createElement('script');
                var curProtocol = window.location.protocol.split(':')[0];
                if (curProtocol === 'https') {
                    bp.src = '${CONSTANT.BAIDUPUSHLINK}';
                }
                else {
                    bp.src = 'http://push.zhanzhang.baidu.com/push.js';
                }
                var s = document.getElementsByTagName("script")[0];
                s.parentNode.insertBefore(bp, s);
            }
        `
    }
    
    window.FRAGMENTS = fragment;
}