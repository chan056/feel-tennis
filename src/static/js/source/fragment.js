module.exports = function(){
    var fragment = {
        attachVideo: function(vId){
            return `{
                let m3u = '/multimedia/ts/${vId}/_.m3u8';
                // m3u = '/multimedia/pristine_v/${vId}.mp4';
                if(Hls.isSupported()) {
                    var video = $('video')[0];
                    // window.vEle = video;
                    
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
                    var s = '<track kind="subtitles" src="/multimedia/ts/${vId}/subtitle.vtt" srclang="zh" label="中文" default >';
                    $(video).prepend(s);
                    video.addEventListener('canplay',function() {
                        // video.play();
                    });
                }else{
                    alert('请更换浏览器后再试,Chrome/Firefox/EDGE等现代浏览器');
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