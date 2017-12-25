const routes = [
	// { path: '/', redirect: '/sports' },
	// 获取所有‘运动’项目
	{ 
		path: '/sports', 
		component: Sports, 
		/* alias: '/', */
	},
	// 获取‘某运动项目’下的‘专辑列表’
	{ 
		path: '/sports/:sportId', 
		component: AlbumList, 
		// props: true, 
		props: function(route){
			return {sportId: route.params.sportId}
		},
	},
	// 获取‘某专辑’下的‘视频列表’
	{ path: '/albums/:albumId', component: Album, props: true, },
	// 获取‘某视频’的信息
	{ 
		path: '/video/:videoId', 
		component: Video, 
		props: true,
	},

	// 根据标签列出视频
	{ 
		path: '/videos', 
		component: videos, 
		// name: 'videos',
		// props: true,
		beforeRouteUpdate(to, from, next) {
			// react to route changes...
			// don't forget to call next()
			console.log(to, from)
			next();
		}
	},

	{ path: '/upload', component: Upload, props: true, },
	{ path: '/feedback', component: Feedback,},
];

const router = new VueRouter({
	routes: routes
});

router.beforeEach((to, from, next) => {
	console.log(from.fullPath, '==>', to.fullPath);
	next();
})

const app = new Vue({
	el: '#router',
	router: router,
	mounted: function () {
		// console.log(this.$breadcrumbs)
	},
})/* .$mount('#router') */;

const nav = new Vue(HeaderComponent);

// Vue.set( target, key, value )