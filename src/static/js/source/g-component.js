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

    Vue.component('AppGuide',{
        // v-bind="guideRoutes"// 传入guideRoutes所有属性 如 fundSteps
        data: function(){
            return {
                guideDialogVisible: false,

                routName: '',
                route: null,
                routeIndex : 0,
                routeTitle: '',
                fundSteps: [
                    {
                        selector: '[title=投币]', 
                        
                        lines: `
                            站长要搭建网站、收集并翻译视频,<br/>
                            需要极大的精力投入,<br/>
                            如果喜欢这个平台请支持我们<br/>
                            <i class="fa fa-handshake-o"></i>
                        `,
                        direction: 'up'
                    },

                    {
                        selector: '[title=投币]', 
                        
                        lines: `
                            站长要搭建网站、收集并翻译视频,<br/>
                            需要极大的精力投入,<br/>
                            如果喜欢这个平台请支持我们<br/>
                            <i class="fa fa-handshake-o"></i>
                        `,
                        direction: 'left'
                    }
                ],
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
                    width="30%"
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
            // if(!window.localStorage.guided){
                const t = this;
                
                window.localStorage.guided = 1;

                $("[title=投币]").one('click', function(){
                    t.guideDialogVisible = true;

                    t.routeTitle = '资助入口';
                    t.routName = 'fundSteps'

                    setTimeout(function(){
                        t.guide();
                    }, 100)
                })
            // }
        },

        methods: {
            onNext: function(){
                this.routeIndex ++;
                if(this.routeIndex < this.route.length){
                    this.guide();
                }else{
                    this.routName ='';
                    this.route = null;
                    this.routeIndex = 0;
                    this.routeTitle ='';
                }
            },

            guide: function(){
                const t = this;

                t.route = t[t.routName];
                t.guideCursor = $('#guide-cursor');

                let mileStone = t.route[t.routeIndex];
                let selector = mileStone.selector;
                let offset;
                let translation = {};

                if(typeof selector == 'string'){
                    offset = $(selector).offset();
                }

                t.guideCursor.attr('class', 'fa fa-hand-o-' + mileStone.direction)

                let cursorSize = {
                    w: t.guideCursor.width(),
                    h: t.guideCursor.height()
                }
                
                // console.log(mileStone.direction)
                // ↓←↑→
                switch (mileStone.direction) {
                    case 'down':
                        translation = {
                            top: -cursorSize.h,
                            left: (offset.width - cursorSize.w)/2
                        };
                        break;
                    case 'left':
                        translation = {
                            top: (offset.height - cursorSize.h)/2,
                            left: cursorSize.w
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

                t.guideCursor.css(pos)
            }
        }
    })
}