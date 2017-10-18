/* Vue.component('todo-item', {
    props: ['todo'],
    template: '<li><a :href="todo.link">{{ todo.text }}</a></li>'
})

var app = new Vue({
    el: '#app',
    data: {
        albums: [
            { id: 0, text: 'feel tennis', link: ''},
            { id: 1, text: '奶酪' },
            { id: 2, text: '随便其他什么人吃的东西' }
        ]
    }
}) */

var data = {a: 1};
var vm = new Vue({
    el: '#example',
    data: data
});

console.log(vm.$data === data, vm.$el);

vm.$watch('a', function(){
    console.log('a change from '+arguments[1]+' to ' + arguments[0]);
});