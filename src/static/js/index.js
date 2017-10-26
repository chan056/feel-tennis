// vue instance
var vm = new Vue({
    el: '#app',
    data: {
        visible: false,
        albums: []
    },
    computed: {
        now: {
            get: function () {
                return this.a;
            },
            set: function (v) {
                console.log(arguments)
                this.a = v;
            }
        },
        evenNumbers: function () {
            return this.numbers.filter(function (number) {
                return number % 2 === 0;
            })
        }
    },
    methods: {
        even: function (numbers) {
            return numbers.filter(function (number) {
                return number % 2 === 0;
            });
        }
    }
});

Vue.component

// router
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

const routes = [
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar }
]

const router = new VueRouter({
    routes // （缩写）相当于 routes: routes
})

const app = new Vue({
    router
}).$mount('#router');

// XHR
axios.get('/albums')
    .then(function (response) {
        console.table(response.data);
        vm.albums = response.data;
    })
    .catch(function (error) {
        console.log(error);
    });