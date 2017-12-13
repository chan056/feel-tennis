FRAGMENTS = {
    playHLS: `
        if(Hls.isSupported()) {
            var video = document.getElementById('video');
            var hls = new Hls();

            hls.loadSource('/multimedia/ts/playlist.m3u8');
            
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED,function() {
                video.play();
            });
        }
    `
}