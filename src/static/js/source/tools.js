let tools = {
    // POST 才有 params
    xhr: function xhr(api, sfn, type, params, errorHandle) {
        type = type || 'get';
        if (type === 'get') {
            if (params) {
                params['_'] = Date.now();
                params = { params: params };
            } else {
                params = { params: { '_': Date.now() } };
            }
        }

        api = '/api' + api;
        return axios[type](api, params)
            .then(function (response) {
                sfn && sfn(response.data)
            })
            .catch(function (error) {
                let response = error.response;
                if (!response)
                    return;

                let statusCode = response.status;
                let isActivePage = location.href.match('/emailConfirm');

                // 自定义错误处理
                errorHandle && errorHandle(response);

                var notifyConfig = {
                    title: response.statusText,
                    message: CONSTANT.erroMsg[statusCode] || '',
                    type: 'warning',
                    position: 'bottom-right',
                    onClose: function () {
                        // console.log('close');
                    }
                };

                // 未登录
                if (statusCode == 401) {
                    // 弹出登录窗口
                    notifyConfig.onClick = function () {
                        Vue.bus.emit('trigger-login');
                    }

                    isActivePage || Vue.bus.emit('trigger-login');
                }

                // 未激活
                if (statusCode == 402) {
                    // 重新激活
                    notifyConfig.onClick = function () {
                        Vue.prototype.$confirm('是否发送新的激活邮件', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(function () {
                            tools.xhr('/resendActiveEmail', function (data) {
                                Vue.prototype.$message({
                                    message: data,
                                    type: 'success'
                                });
                            });
                        }).catch(function () {

                        });
                    }
                }

                // 统一错误处理
                setTimeout(function () {
                    Vue.prototype.$notify(notifyConfig);
                }, 100)
            });
    },

    /**
     * [1,2] ['tag', 'innerHtml']
     * 文档中插入脚本
     */
    insertScriptTag: function (type, str, attrs) {
        let id = attrs.id;
        if (id && $('script#' + id).length) {// ? return
            if (type == 1) {
                return attrs.onload && attrs.onload();
            }

            $('script#' + id).remove();
        }

        let script = document.createElement('script');
        for (let i in attrs) {
            script[i] = attrs[i];
        }

        if (type == 1) {
            script.setAttribute('src', str);
        } else if (type == 2) {
            script.innerHTML = str;
        }

        document.body.appendChild(script);
    },

    // 给视频绑定字幕
    // 通过轮询的方式 每x秒检测一次
    // 根据SRT DATA中的start time 和end time 定位字幕
    attachSubtile: function (video, captions, interval, fn) {
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            return;
        }

        interval = interval || 500;

        let lastCaptionIndex;// 上个匹配到的caption id，用于优化查找速度 todo

        let intervalId = setInterval(function () {
            let curVtime = video.currentTime;// curVtime和上次一样的话 中断todo
            curVtime = curVtime * 1000;// 微秒
            let caption, subtitle;
            let st, et;// 微秒

            let i = 0;
            let l = captions.length;

            if (lastCaptionIndex) {
                i = lastCaptionIndex;
            }

            for (; i < l; i++) {
                caption = captions[i];
                if (!caption) {
                    continue;
                }
                st = caption.startTime;
                et = caption.endTime;

                if (curVtime >= st && curVtime <= et) {
                    subtitle = caption.text;
                    if (i != lastCaptionIndex) {
                        fn && fn(subtitle);
                        lastCaptionIndex = i;
                    }

                    break;
                } else {
                    if (i == l - 1) {
                        lastCaptionIndex = undefined;
                    }

                    fn && fn('');
                }
            }

        }, interval)

        return intervalId;
    },

    // 给视频绑定用户备注
    attachRemark: function (video, rmks, interval, fn) {
        interval = interval || 500;

        let len = rmks.length;

        window.remarkIntervalId = setInterval(function () {
            let curVtime = video.currentTime;
            let rmkMoment;
            let curRmks = [];

            for (let i = 0; i < len; i++) {
                rmkMoment = rmks[i].moment;
                if (Math.abs(curVtime - rmkMoment) < 2) {
                    curRmks.push(rmks[i]);
                }
            }

            fn(curRmks);
        }, interval)
    },

    // 将时间戳转换 “周、月、年”
    formatTimeSlot: function (timestamp) {
        let now = + new Date();
        let timeSlot = now - timestamp;

        // 1天 1周 1月 1年
        let hourMS = 60 * 60 * 1000;
        let dayMS = 24 * hourMS;
        let weekMS = dayMS * 7;
        let monthMS = dayMS * 30;
        let yearMS = dayMS * 365;

        let s = '';

        if (timestamp && timeSlot > 0) {
            if (timeSlot < hourMS) {
                s = '刚刚';
            } else if (timeSlot < dayMS) {
                s = Math.floor(timeSlot / hourMS) + '小时前';
            } else if (timeSlot < weekMS) {
                s = Math.floor(timeSlot / dayMS) + '天前';
            } else if (timeSlot < monthMS) {
                s = Math.floor(timeSlot / weekMS) + '周前';
            } else if (timeSlot < yearMS) {
                s = Math.floor(timeSlot / monthMS) + '月前';
            } else {
                s = Math.floor(timeSlot / yearMS) + '年前';
            }

            return s;
        }

        return '';
    },

    // 9000 0:09.0
    // 毫秒转化时分秒
    // 精确到0.1秒
    // 0补齐 左侧第一位0省略

    formatMS: function (ms = 0) {

        let secondMS = 1000;
        let minuteMs = 60 * secondMS;

        let s = '';

        let minute = Math.floor(ms / minuteMs);

        let minuteSecond = ms % minuteMs;

        let second = (minuteSecond / secondMS).toFixed(1);
        if (second < 10)
            second = '0' + second;

        return `${minute}:${second}`;

    },

    togglePageIE: function (t) {
        BrowserDetect.init({ ie: '*' }, function () {
            // IE9
            $(window).off('hashchange.ieHack').on('hashchange.ieHack', function () {
                var currentPath = window.location.hash.slice(1);
                if (this.$route.path !== currentPath) {
                    this.$router.push(currentPath)
                }
            }.bind(t))
        })
    },

    matchNumber: function (str) {
        return Number(str.match(/\d+(\.\d+)?/)[0]) || 0
    },

    fullscreen:{
        launch: function(element){
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        },

        exit: function() {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        },

        getFullscreenElement: function(){
            return document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
        },
        
        checkFullscreenEnabled: function (){
            // !window.screenTop && !window.screenY
            return document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled;
        },

        watchFullscreenChange: function(fn){
            $(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange', function (e) {
                
                var fullscreenElement = this.getFullscreenElement();
                // console.log(fullscreenElement)
                if(fullscreenElement){
                    if(fullscreenElement.tagName == 'VIDEO'){
                        fn && fn();
                    }else if(fullscreenElement.tagName == 'HTML'){
                        console.log('xxx')
                    }
                }else{
                    tools.removeFullScreenMask()
                    $('video').height(400).parent().removeClass('fixed-center')
                }

            }.bind(this));
        }, 

    },

    addfullScreenMask: function(){
        var html = '<div class="fullscreen-mask" ></div>'
        this.removeFullScreenMask();
        $('body').append(html).css('overflow', 'hidden');
    },

    removeFullScreenMask: function(){
        $('.fullscreen-mask').remove();
    }
};

window.tools = tools;
