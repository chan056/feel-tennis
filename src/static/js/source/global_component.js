module.exports = function(){
    // let tagCreatorConstructor = Vue.extend({
    //     template: `
    //         <el-dialog v-bind:title="config.title" :visible.sync="config.visibility">
    //             <el-form>
                    
    //             </el-form>
    //             <div slot="footer" class="dialog-footer">
    //                 <el-button @click="config.visibility = false">取 消</el-button>
    //                 <el-button type="primary" @click="config.visibility = false">确 定</el-button>
    //             </div>
    //         </el-dialog>`,
    //     data: function () {
    //         return {
                
    //         }
    //     },
    //     props:['config'],
    // });
    
    // Vue.component('tagCreator', tagCreatorConstructor);
    
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

    let guideRoute = require('./guide_routes.js');

    Vue.component('AppGuide',{
        // v-bind="guideRoutes"// 传入guideRoutes所有属性 如 fundSteps
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
                <i id="guide-cursor" class="fa fa-hand-o-left"></i>

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
                        <el-button @click="guideDialogVisible = false">跳过引导</el-button>
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

            function bidnGuideEvent(item){
                let guider = getGuider();
                if(guider.indexOf(item.name) == -1){
                    if(item.delegator){
                        $(item.delegator).one('click', item.tar, evt);
                    }else{
                        $(item.tar).one('click', evt);
                    }
                }

                function evt(){
                    t.guideDialogVisible = true;

                    t.routeTitle = item.title;
                    t.routeName = item.name;

                    setTimeout(function(){
                        t.guide();
                    }, 100)

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
                routeStep.trigger && $(routeStep.selector).trigger('click');

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

            guide: function(){
                const t = this;

                t.route = t['routes'][t.routeName];

                let routeStep = t.route[t.routeIndex];
                t.guideCursor = $('#guide-cursor');
                let selector = routeStep.selector;
                if(!routeStep.direction){
                    t.guideCursor.hide();
                    return;
                }else{
                    t.guideCursor.show();
                }
                    
                let offset;
                let translation = {};

                if(typeof selector == 'string'){
                    offset = $(selector).offset();
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

    Vue.component('TimeScale', {
        template: '<canvas id="time-scale" height=80></canvas>',
        props: ['duration'],
        mounted: function(){
            var c = document.querySelector('#time-scale');
            var context = c.getContext('2d');
            context.lineWidth = 1;          //设置线宽状态
            context.strokeStyle = "#222" ;  //设置线的颜色状态

            var duration = this.duration;
            var totalIndex = duration * 10;// 0 -> 1000
            var intervalX = 6;
            var short = 5;
            var tall = 10;

            c.width = totalIndex * intervalX;

            for(var i=0; i <=totalIndex; i ++){
                drawLine(i)
            }

            function drawLine(scaleIndex){
                context.moveTo (intervalX * scaleIndex,0);       //设置起点状态
                context.lineTo (intervalX * scaleIndex, scaleIndex%5?short:tall);       //设置末端状态
                context.stroke();  

                if(!(scaleIndex % 10)){
                    var second = scaleIndex / 10;
                    context.fillText(
                        second, 
                        intervalX *scaleIndex - second.toString().length / 2 * 6,// 6=>1个数字的宽度 
                        20
                    )
                }
            }
        }
    });
}