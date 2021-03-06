function renderScores(){
    var events = tournament.events;
    var pIdReg = /\/(\d+)\//;
    var s = '';

    events.forEach(function(event){
        var status = event.status;
        var statusCn = {
            'Not started': '未开始',
            'In progress': '进行中',
            'Happening': '进行中',
            'interrupted': '中止',
            'Finished': '已结束',
            'Cancelled': '被取消'
        }[status] || '';
        var p1id = event.players[0].url.match(pIdReg);
        var p2id = event.players[1].url.match(pIdReg);
        p1id = p1id? p1id[1] : '';
        p2id = p2id? p2id[1] : '';

        s += `<div class="score">
            <div class="status">${statusCn}</div>

            <div class="players">
                ${renderPlayers(event.players)}
            </div>
            <div class="box-score tar">
                <!-- 
                    未开始 预测
                    已结束 查看对战统计
                    正在进行 分数直播
                    -->
                <a target="_blank" href="${(p1id && p2id) ? `/tennis/player/${p1id}/vs/${p2id}.ssr`: 'javascript:void(0);'}" target="_blank">
                    ${
                        {
                         'Finished': '对战统计',
                         'Happening': '分数直播',
                         'In progress': '分数直播'}[status]
                         || '预测'
                    }
                </a>
            </div>
        </div>`
    })

    $('#scores').html(s);

    function renderPlayers(players){
        var s = '';
        players.forEach(function(player){
            var id = player.url.match(pIdReg);
            if(id){
                id = id[1];
            }
            
            s += `<div class="player clearfix${player.is_winner? ' is_winner': ''}">
                <i class="fa fa-check fl"></i>
                <i class="fl flag flags-${player.country}"></i>
                <a target="_blank" href="${id? `/tennis/player/${id}/stat.ssr`: 'javascript: void(0);'}" 
                    class="fl name">${player.name}</a>
                `
                    + (player.seed? `<em class="seed">(${player.seed})</em>`: '') +
                `
                <ul class="player-score">
                    ${renderGames(player.set_games)}
                </ul>
            </div>`
        })

        return s;

        function renderGames(games){
            var s = '';
            games.forEach(function(game){
                s += `<li>${game}</li>`
            })

            return s;
        }
    }
}

function tournamentDailySchedule(){
    $('#score-wrapper').addClass('loading');
    // $('.fa-spinner-wrapper').show();
    // $('#scores').css('opacity', 0);

    $.ajax({
        type: 'get',
        url: '/api/tournamentDailySchedule',
        data: {
            sid: tournament.sid,
            offset: baseOffset
        },
        contentType: 'text/json',
        success: function(data){
            $('#score-wrapper').removeClass('loading');
            // $('.fa-spinner-wrapper').hide();
            // $('#scores').css('opacity', 1);


            if(!data){
                return $('#scores').html('没有数据');
            }

            tournament = JSON.parse(data);
            // console.log(tournament)

            renderScores();

            translate(false, $('#scores'));
		    translate(true, $('#scores'));
        },
        error: function(xhr, type){
            console.error('Ajax error!')
        }
    })
}

// 创建日期选择器
function createDateSel(){
    
    var domBase = $('#days');
    var minDate = tournament.startdate;
    var maxDate = tournament.enddate;

    var curDate = getDate(0);
    var prevDate = getDate(-1);
    var nextDate = getDate(1);

    // 标记最后一天或第一天
    var meetBoundary = false;

    domBase.html(`
        <div class="fl prev">
            <
            <span class="day">${prevDate}</span>
        </div>
        <span class="day cur">${curDate}</span>
        <div class="fr next">
            <span class="day">${nextDate}</span>
            >
        </div>
        <br class="clr">
    `);

    if(curDate == prevDate){
        domBase.find('.prev').hide();
        meetBoundary = true;
    }else{
        domBase.find('.prev').show()
    }

    if(curDate == nextDate){
        domBase.find('.next').hide();
        meetBoundary = true;
    }else{
        domBase.find('.next').show()
    }

    domBase.off('click').on('click', '.prev', function(){
        if(!$('#score-wrapper.loading').length){
            var meetBoundry = createDateSel(--baseOffset)            
            tournamentDailySchedule();
            if(meetBoundry){
                console.log('meet boundry first')
                // baseOffset ++
            }
        }
    }).on('click', '.next', function(){
        if(!$('#score-wrapper.loading').length){
            var meetBoundry = createDateSel(++baseOffset);
            tournamentDailySchedule();
            if(meetBoundry){
                console.log('meet boundry last')
                // baseOffset --;
            }
        }
    });

    return meetBoundary;

    function getDate(dayOffset){
        dayOffset = (dayOffset || 0) + (baseOffset || 0);

        var now = new Date(+new Date() + dayOffset * dayMilli) ,
            min = new Date(minDate.split(' ')[0]),
            max = new Date(maxDate.split(' ')[0]);

        if(now.getTime() < min.getTime()){
            now = min
        }

        if(now.getTime() > max.getTime()){
            now = max
        }

        var m = now.getMonth() + 1;
        var d = now.getDate();

        return zeroFill(m) + '/' + zeroFill(d)

        function zeroFill(n){
            return n >9? n: ('0' + n);
        }
    }
}