// JS fragment
FRAGMENTS = {
    attachVideo: function(vId){
        return `{
            if(Hls.isSupported()) {
                var video = $('video')[0];
                var hls = new Hls();

                hls.loadSource('/multimedia/ts/`+ vId + `/_.m3u8');
                
                hls.attachMedia(video);

                hls.on(Hls.Events.MANIFEST_PARSED,function() {
                    video.play();
                    video.volume = 0;
                });
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