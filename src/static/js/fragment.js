FRAGMENTS = {
    attachVideo: `
        if(Hls.isSupported()) {
            var video = document.getElementById('video');
            var hls = new Hls();

            hls.loadSource('/multimedia/ts/000001/_.m3u8');
            
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED,function() {
                video.play();
                video.volume = 0;
            });

            

            // $.get('/upload/t.srt', function(res){
            //     // console.log(res);
            // });
            // console.log(hls.subtitleTracks, hls.subtitleTrack, hls.subtitleDisplay)
            

            /* video.ondurationchange = function(){
                console.log('ondurationchange', video.currentTime);
            } */

            // function setSubtitleSearchInterval(v){
            //     setInterval(function(){
            //         var curTime = v.currentTime;
            //         console.log(curTime)
            //     }, 100)
            // }

            // function searchSubtitle(){
                
            // }
        }
    `,

    attachSubtitle: `
        
    `
}