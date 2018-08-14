
/**
* 浏览器支持
*/
var BrowserDetect = {
    init: function (noSupportItems, callback){
        var browserInfo = this.getBrowserInfo();
        var b = browserInfo.browser;   // 浏览器类型转换小写
        var v = browserInfo.version;   // 版本号取整数
        var isSupport = this.isSupport(b, v, noSupportItems);

        if( !isSupport ){
            if(callback)
                return callback(isSupport);

            // console.log("当前浏览器不支持！");
            this.showTips(b, v);
        }
       
    },

    /**
    * 浏览器版本检测
    * return Object
    */
    getBrowserInfo: function(){
        var s;
        var Sys = {};
        var browserInfo = {
            browser: "unknown browser",
            version: "unknown version"
        }

        var ua = navigator.userAgent.toLowerCase();
        (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
        (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
        (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
        (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
        (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
        (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;

        for(var type in Sys){
            browserInfo.browser = type;
            if(Sys[type] && Sys[type] !=='') {
                browserInfo.version = Sys[type];
            }
        }
        return browserInfo;
    },

    isSupport: function(browser, version, noSupportItems){
        var _isSupport = true;
        var _version = parseFloat(version);
        if(noSupportItems && noSupportItems[browser] ){
            if(noSupportItems[browser] === '*'){
                return false;
            }

            var items = noSupportItems[browser];
            for ( var item in items ) {
                // console.log(items[item], _version)
                if( items[item] === _version ){
                    _isSupport = false;
                };
            }
        }
        return _isSupport;
    },

    // 不支持的浏览器列表
    // noSupportItems: {
    //     ie: [9, 8, 7, 5, 6],
    // },

    showTips: function(browser, version){
        var tipsStyle =
             '<style>'
            +'   .browser-tips-warp{position:fixed;top:0;left:0;width:100%;height:100%;background:#fff;z-index:11}'
            +'   .browser-tips{border:1px solid #ccc;width:500px;height:220px;background:#fff;position:absolute;top:45%;left:0;right:0;margin:-110px auto auto auto;color:#333;padding:30px;z-index:10}'
            +'   .browser-tips h3{margin:20px auto}'
            +'   .browser-tips .curr-browser-logo{max-height:100px;vertical-align:top}'
            +'   .browser-tips ul{margin:0;width:auto;height:auto;display:inline-block;list-style: none;margin:0;padding:0;}'
            +'   .browser-tips ul li{width:122px;height:120px;float:left;text-align:center;}'
            +'   .browser-tips .browser-logo{width:100px;height:100px;border:0 solid red;display:inline-block}'
            +'   .browser-name{width:100%}'
            +'   .browser-logo.chrome{background:url("../img/browser/chrome.jpg") center no-repeat}'
            +'</style>';

        var browserIconBase = '../lib/browser/';
        var tipsStr =
             '<div class="browser-tips-warp">'
            +'  <div class="browser-tips">'
            +'    <span class="curr-browser-info">当前浏览器：'+ browser + version +'</span>'
            +'    <h3>很抱歉您当前的浏览器暂时不支持，请使用以下浏览器打开</h3>'
            +'    <ul>'
            +'	      <li><a href="https://www.baidu.com/s?ie=UTF-8&wd=chrome" target="_blank"><img class="browser-logo" src="'+ browserIconBase +'chrome.jpg"></img></a>'
            +'		  <div>谷歌浏览器</div></li>'
            +'	      <li><a href="https://www.baidu.com/s?ie=UTF-8&wd=safari" target="_blank"><img class="browser-logo" src="'+ browserIconBase +'safari.jpg"></img></a>'
            +'		  <div>Safari</div></li>'
            +'	      <li><a href="https://www.baidu.com/s?ie=UTF-8&wd=firefox" target="_blank"><img class="browser-logo" src="'+ browserIconBase +'firefox.jpg"></img></a>'
            +'		  <div>火狐浏览器</div></li>'
            +'	      <li><a href="https://www.baidu.com/s?ie=UTF-8&wd=microsoft%20edge" target="_blank"><img class="browser-logo" src="'+ browserIconBase +'edge.jpg"></img></a>'
            +'		  <div>Edge浏览器</div></li>'
            +'    </ul>'
            +'  </div>'
            +'</div>';

        // var el = document.createElement('div');
        // el.html = tipsStr;
        document.write(tipsStyle+tipsStr);
    },

    getBrowserLogoUrl: function(browser, version){
        var url = "./src/component/main/img/browser/"; // logo的绝对路径
        if (browser === "ie") {
            return url + browser +"_"+ version +".jpg";
        }
        else {
            return url + browser +".jpg";
        }
    },

    detectMob: function(){
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    }
}