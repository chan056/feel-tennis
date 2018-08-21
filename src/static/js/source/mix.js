(function(){
    // === 百度统计 ===
    var bp = document.createElement('script');
    var curProtocol = window.location.protocol.split(':')[0];
    if (curProtocol === 'https') {
        bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
    }
    else {
        bp.src = 'http://push.zhanzhang.baidu.com/push.js';
    }
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(bp, s);
    // === 百度统计 ===

    // === 移动端样式兼容 ===
    var meta = '';
    if(/Android (\d+\.\d+)/.test(navigator.userAgent)){
        var version = parseFloat(RegExp.$1);
        if(version > 2.3){
            var phoneScale = parseInt(window.screen.width) / 750;
            meta = '<meta name="viewport" content="width=750, minimum-scale = '+ phoneScale +', maximum-scale = '+ phoneScale +', target-densitydpi=device-dpi">';
        }else{
            meta = '<meta name="viewport" content="width=750, target-densitydpi=device-dpi">';
        }
    }else{
        meta = '<meta name="viewport" content="width=750, user-scalable=no, target-densitydpi=device-dpi">';
    }

    $('head').append(meta);
    // === 移动端样式兼容 ===
})();
