// JS fragment
FRAGMENTS = {
    attachVideo: function(vId){
        return `
            if(Hls.isSupported()) {
                var video = document.getElementById('video');
                var hls = new Hls();

                hls.loadSource('/multimedia/ts/`+ vId + `/_.m3u8');
                
                hls.attachMedia(video);

                hls.on(Hls.Events.MANIFEST_PARSED,function() {
                    video.play();
                    video.volume = 0;
                });
            }
        `
    },

    attachSubtitle: `
        console.log('attachSubtitle loaded')
    `
}