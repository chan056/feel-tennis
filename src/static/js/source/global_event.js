module.exports = function(){
    // setInterval(function(){debugger;}, 1000)

    // 视频播放页 收藏夹
    $('body').on('click', function(){
        $('#star-section').hide();
    });

    var W = $(window);
    W.on('resize', function(){
        if(W.width() < 1000){
            $('#root-container').addClass('brief');
        }
    });
    
    // setTimeout(()=>{
    //     W.trigger('resize');
    // },1000)
}