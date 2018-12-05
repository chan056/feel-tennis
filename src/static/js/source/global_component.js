module.exports = function(){
    // CUSTOMIZED COMPONENT EXAMPLE
    /*  Vue.component('Sortor', {
        template: '<div></div>',
        props: ['config'],
        data: function(){
            console.log(this.config);
            return {};
        },
        mounted(){

        },
        methods: {
            
        }
    }); */

    // 操作引导的配置
    let guideRoute = require('./guide_routes.js');
    
    // 时间的转换 如 2周之前 1天之前
    Vue.component('UpdateTime', {
        template: '<em>{{timeSlot}}</em>',
        props: ['timestamp'],
        data: function(){
            var propsData = this.$options.propsData;
            return {
                timeSlot: tools.formatTimeSlot(propsData.timestamp)
            };
        }
    });

    Vue.component('AppGuide',{
        data: function(){
            return {
                guideDialogVisible: false,

                routeName: '',
                route: null,
                routeIndex : 0,
                routeTitle: '',
                routes: guideRoute,
            }
        },

        template: `
            <div v-if="guideDialogVisible">
                <i id="guide-cursor" class="fa fa-hand-o-left" style="display:none;"></i>

                <el-dialog
                    id="guide-dialog"
                    :title="routeTitle"
                    :visible="guideDialogVisible"
                    :close-on-click-modal="false"
                    :close-on-press-escape="false"
                    :show-close="false"
                    width="500px"
                    center
                    >

                    <span v-html="route?route[routeIndex].lines: ''"></span>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="skipGuide">跳过引导</el-button>
                        <el-button type="primary" @click="onNext">下一步</el-button>
                    </span>
                </el-dialog>
            </div>
        `,

        mounted: function(){
            const t = this;

            const guideEvtInfo = guideRoute.evtInfo;

            guideEvtInfo.forEach((item)=>{
                bidnGuideEvent(item);
            });

            this.$bus.on('dismiss-guider', function(info){
				this.guideDialogVisible = false;
			}.bind(this));

            function bidnGuideEvent(item){
                let guider = getGuider();
                if(guider.indexOf(item.name) == -1){
                    if(item.tar){
                        let triggerType = item.triggerType || 'click';
                        if(item.delegator){
                            $(item.delegator).one(triggerType, item.tar, evt);
                        }else{
                            $(item.tar).one(triggerType, evt);
                        }
                    }else{
                        evt();
                    }
                }

                function evt(){
                    // 在dismiss-guider触发之后执行
                    setTimeout(()=>{
                        t.guideDialogVisible = true;
                    }, 200)

                    t.routeTitle = item.title;
                    t.routeName = item.name;

                    setTimeout(function(){
                        t.guide();
                    }, 300)

                    let guider = getGuider();
                    guider.push(item.name)
                    guider = JSON.stringify(guider);
                    window.localStorage.guider = guider;
                }

                function getGuider(){
                    let guider = window.localStorage.guider || JSON.stringify([]);
                    guider = JSON.parse(guider); 
                    return guider;
                }
            }
        },

        methods: {
            onNext: function(){
                let routeStep = this.route[this.routeIndex];

                this.routeIndex ++;
                if(this.routeIndex < this.route.length){
                    this.guide();
                }else{
                    this.routeName ='';
                    this.route = null;
                    this.routeIndex = 0;
                    this.routeTitle ='';
                    this.guideDialogVisible = false;
                }
            },

            skipGuide(){
                this.guideDialogVisible = false; 
                this.route = null;
                this.routeIndex = 0;
            },

            guide: function(){

                const t = this;

                t.route = t['routes'][t.routeName];

                let routeStep = t.route[t.routeIndex];
                t.guideCursor = $('#guide-cursor');

                if(!routeStep.direction){
                    t.guideCursor.hide();
                    return;
                }else{
                    t.guideCursor.show();
                }
                    
                let offset;
                let translation = {};

                let selector = routeStep.selector;// 光标的位置
                if(typeof selector == 'string'){
                    offset = $(selector).offset();
                }else{
                    t.guideCursor.hide();
                    return;
                }

                t.guideCursor.attr('class', 'fa fa-hand-o-' + routeStep.direction)

                let cursorSize = {
                    w: t.guideCursor.width(),
                    h: t.guideCursor.height()
                }
                
                // console.log(routeStep.direction)
                // ↓←↑→
                switch (routeStep.direction) {
                    case 'down':
                        translation = {
                            top: -cursorSize.h,
                            left: (offset.width - cursorSize.w)/2
                        };
                        break;
                    case 'left':
                        translation = {
                            top: (offset.height - cursorSize.h)/2,
                            left: offset.width
                        };
                        break;
                    
                    case 'up':
                        translation = {
                            top: offset.height,
                            left: (offset.width - cursorSize.w)/2
                        };
                        break;

                    case 'right':
                        translation = {
                            top: (offset.height - cursorSize.h)/2,
                            left: -cursorSize.width
                        };
                        break;
                }

                let pos = {
                    left: offset.left + translation.left,
                    top: offset.top + translation.top
                }

                t.guideCursor.css(pos);

            }
        }
    })

    // Vue.component('TimeScale', {
    //     template: '<canvas id="time-scale" height=20></canvas>',
    //     props: ['duration', 'fn'],
    //     mounted: function(){
    //         var c = document.querySelector('#time-scale');
    //         var context = c.getContext('2d');
    //         context.lineWidth = 1;          //设置线宽状态
    //         context.strokeStyle = "#222" ;  //设置线的颜色状态

    //         var duration = this.duration;
    //         var totalIndex = duration * 10;// 0 -> 1000
    //         var intervalX = 6;
    //         var short = 5;
    //         var tall = 10;

    //         console.log(totalIndex)

    //         c.width = totalIndex * intervalX;

    //         for(var i=0; i <=totalIndex; i ++){
    //             drawLine(i)
    //         }

    //         this.fn && this.fn()

    //         function drawLine(scaleIndex){
    //             context.moveTo (intervalX * scaleIndex,0);       //设置起点状态
    //             context.lineTo (intervalX * scaleIndex, scaleIndex%5 ? short : tall);       //设置末端状态
    //             context.stroke();  

    //             if(!(scaleIndex % 10)){
    //                 var second = scaleIndex / 10;
    //                 context.fillText(
    //                     second, 
    //                     intervalX *scaleIndex - second.toString().length / 2 * 6,// 6=>1个数字的宽度 
    //                     20
    //                 )
    //             }
    //         }
    //     },
    // });



    Vue.component('Sortor', {
        template: '<div>\
            排序:&nbsp;&nbsp;\
            <el-button v-for="item in config" :key="item.name" icon="fa" size="small" :data-by="item.value" @click="sortVideo($event, config.callback, config.parentData)">{{item.name}} </el-button>\
        </div>',
        props: ['config'],
        mounted(){

        },
        methods: {
            sortVideo: function(e, callback, parentData){
				let t = e.target;
				t = $(t);
				if(!t.is('button')){
					t = t.parents('button');
                }

				let sortBy = t.data('by');
				parentData.sortBy = sortBy;

				if(!t.is('.active')){
					t.addClass('active el-button--primary').children('.fa').addClass('fa-chevron-down');
					t.siblings().removeClass('active el-button--primary').children('.fa').removeClass('fa-chevron-up fa-chevron-down')
					parentData.sortOrd = 'desc';
				}else if(t.children('.fa').is('.fa-chevron-down')){
					t.children('.fa').removeClass('fa-chevron-down').addClass('fa-chevron-up');
					parentData.sortOrd = 'asc';
				}else if(t.children('.fa').is('.fa-chevron-up')){
					t.children('.fa').removeClass('fa-chevron-up').addClass('fa-chevron-down')	
					parentData.sortOrd = 'desc';
				}

				callback();
			},
        }
    });
}