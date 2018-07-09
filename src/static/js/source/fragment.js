module.exports = function(){
    var fragment = {
        attachVideo: function(vId, lowResolution, isIntroductory, selector){
            let m3u8 = '';
            if(window.isMobile){
                lowResolution = lowResolution || 480;
                m3u8 = lowResolution + 'p'
                console.log('low resolution：' + m3u8)
            }else if(lowResolution){
                m3u8 = lowResolution + 'p'
                console.log('low resolution：' + m3u8)
            }else{
                m3u8 = '_'
            }

            let tsRoot = isIntroductory? `/multimedia/ts_introductory/${vId}/`: `/multimedia/ts/${vId}/`;
            let video = selector? `document.querySelector('${selector}')`: `$('video')[0]`;

            return `{
                var m3u = '${tsRoot}${m3u8}.m3u8';
                var video = ${video};

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

                }else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = m3u;
                    
                    // 多种vtt字幕 
                    // 只有在全屏时显示

                    // setInterval(function(){
                    //     alert(document.fullscreenElement)
                    // },3000)

                    document.addEventListener("fullscreenchange", function( event ) {
                        alert(document.fullscreenElement)
                    });

                    var s = '<track kind="subtitles" src="${tsRoot}subtitle.vtt" srclang="zh" label="中文" default></track>';
                    $(video).prepend(s);
                }else{
                    video.src = '${tsRoot}${vId}.mp4';
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
                            if (response == 'success') {
                                $('#regist-btn').show();
                            }else if (response == 'error') {
                                $('#regist-btn').hide();
                            }
                        },
                        focusOnError: false
                    });
            
                    $('.jCaptcha').on('blur', function(e) {
                        e.preventDefault();
                        myCaptcha.validate();
                    });
                }
            }
        `,
    }
    
    window.FRAGMENTS = fragment;
}