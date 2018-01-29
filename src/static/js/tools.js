let tools = {
    xhr: function xhr(api, sfn, type, params){
        type = type || 'get';
    
        axios[type](api, params)
        .then(function (response) {
           sfn && sfn(response.data)
        })
        .catch(function (error) {
            console.log(arguments);
        });
    },
    
    /**
     * [1,2] ['tag', 'innerHtml']
     * 文档中插入脚本
     */
    insertScriptTag: function(type, str, attrs){
        let id = attrs.id;
        if(id && $('script#' + id).length){
            $('script#' + id).remove();
        }

        let script = document.createElement('script');
        for(let i in attrs){
            script[i] = attrs[i];
        }

        if(type == 1){
            script.setAttribute('src', str);
        }else if (type == 2) {
            script.innerHTML = str;
        }

        // console.log(script);

        document.body.appendChild(script);
    },

    // 给视频绑定字幕
    // 通过轮询的方式 每x秒检测一次
    // 根据SRT DATA中的start time 和end time 定位字幕
    attachSubtile: function(video, srts, interval, fn){
        interval = interval || 500;

        let lastSrtId;
        let lastSrtIndex;// 上个匹配到的srt id，用于优化查找速度
        let curSubtitle;

        setInterval(function(){
            let curVtime = video.currentTime;
            curVtime = curVtime * 1000;// 微秒
            let srt, srtId, subtitle;
            let st, et;// 微秒

            let i = 0;
            l = srts.length;

            if(lastSrtIndex){
                i = lastSrtIndex;
            }

            for(; i<l; i++){
                srt = srts[i];
                st = srt.startTime;
                et = srt.endTime;
                srtId = srt.id;

                if(curVtime >= st && curVtime <= et){
                    lastSrtId = srtId;
                    
                    curSubtitle = subtitle = srt.text;
                    // console.log(/* '循环次数 '+Z, */ subtitle)
                    if(i != lastSrtIndex){
                        fn(subtitle);
                        lastSrtIndex = i;
                    }
                    
                    break;
                }else{
                    if(i == l-1){
                        lastSrtIndex = undefined;
                    }
                }
            }

        }, interval)
    },

    // 将时间戳转换 “周、月、年”
    formatTimeSlot: function (timestamp){
        let now = + new Date();
        let timeSlot = now - timestamp;

        // 1天 1周 1月 1年
        const hourMS = 60 * 60 * 1000;
        const dayMS = 24 * hourMS;
        const weekMS = dayMS * 7;
        const monthMS = dayMS * 30;
        const yearMS = dayMS * 365;
        
        let s = '';

        if(timestamp && timeSlot > 0){
            if(timeSlot < hourMS){
                s = '刚刚';
            }else if(timeSlot < dayMS){
                s = Math.floor(timeSlot / hourMS) + '小时前';
            }else if(timeSlot < weekMS){
                s = Math.floor(timeSlot / dayMS) + '天前';
            }else if(timeSlot < monthMS){
                s = Math.floor(timeSlot / weekMS) + '周前';
            }else if(timeSlot < yearMS){
                s = Math.floor(timeSlot / monthMS) + '月前';
            }else{
                s = Math.floor(timeSlot / yearMS) + '年前';
            }

            return s;
        }

        return '';
    }
};
