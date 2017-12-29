FRAGMENTS = {
    playHLS: `
        if(Hls.isSupported()) {
            var video = document.getElementById('video');
            var hls = new Hls();

            hls.loadSource('/multimedia/ts/000001/_.m3u8');
            
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED,function() {
                video.play();
            });
        }
    `
}