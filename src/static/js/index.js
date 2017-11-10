// router
const Index = {
	data: function () {
		return { albums: [] }
	},

	// props: ['id'],

	template: `
        <div id="index">
            <a :href="n.link" v-for="n in albums">{{ n.name }}</a>
        </div>
    `,

	beforeRouteEnter(to, from, next) {
		console.log('beforeRouteEnter');
		next();
	},
	beforeRouteUpdate(to, from, next) {
		console.log('beforeRouteUpdate');
		next();
	},
	beforeRouteLeave(to, from, next) {
		console.log('beforeRouteLeave ');
		next();
	}
};

const Tennis = {
	template: `
    <div>
        <h2>Feel Tennis</h2>
        <ul class="list">
            <li>
                <a href="./video.html">How to play forehand stroke</a>
            </li>
        </ul>
    </div>
`};

const routes = [
	{
		path: '/index',
		component: Index,
		props: true,

	},
	{ path: '/tennis', component: Tennis },
]

const router = new VueRouter({
	routes // （缩写）相当于 routes: routes
})

// router.beforeEach((to, from, next) => {
// console.log(to, from, next)
// })

const app = new Vue({
	router
}).$mount('#router');


// XHR
// axios.get('/albums')
//     .then(function (response) {
//         console.table(response.data);
//         vm.albums = response.data;
//     })
//     .catch(function (error) {
//         console.log(error);
//     });