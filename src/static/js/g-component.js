let tagCreatorConstructor = Vue.extend({
    template: `
        <el-dialog v-bind:title="config.title" :visible.sync="config.visibility">
            <el-form>
                
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="config.visibility = false">取 消</el-button>
                <el-button type="primary" @click="config.visibility = false">确 定</el-button>
            </div>
        </el-dialog>`,
    data: function () {
        return {
            
        }
    },
    props:['config'],
});

Vue.component('tagCreator', tagCreatorConstructor);

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