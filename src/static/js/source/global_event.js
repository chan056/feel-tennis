module.exports = function(){
    // setInterval(function(){debugger;}, 1000)

    // 视频播放页 收藏夹
    $('body').on('click', function(){
        $('#star-section').hide();
    });

    $(window).on('resize', function(){
        Vue.nextTick(function(){
            var rootContainer = $('#root-container');
            if(window.isMobile = BrowserDetect.detectMob()){
                if(location.href.match(/videos\/\d+/)){
                    rootContainer.addClass('mobile-structure').removeClass('brief');
                }else{
                    rootContainer.addClass('brief').removeClass('mobile-structure');
                }
            }else{
                rootContainer.removeClass('mobile-structure');
            }

            // 更新 #aside 和 #main 的高度
            if(!window.isMobile){
                var h = $(window).height()- 70 - 2;
                rootContainer.height(h).children().height(h);
            }
        })
    });
}