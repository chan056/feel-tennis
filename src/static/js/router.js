const routes = [
	// { path: '/', redirect: '/sports' },
	// 获取所有‘运动’项目
	{ 
		path: '/sports', 
		component: Sports, 
		/* alias: '/', */
		meta: {title: '首页'}
	},
	// 获取‘某运动项目’下的‘专辑列表’
	{ 
		path: '/sports/:sportId', 
		component: AlbumList,
		meta: {title: '专辑列表'},
		// props: true, 
		props: function(route){
			return {sportId: route.params.sportId}
		},
	},
	// 获取‘某专辑’下的‘视频列表’
	{ 
		path: '/albums/:albumId', 
		component: Album, 
		props: true, 
		meta: {title: '视频列表'},
	},
	// 获取‘某视频’的信息
	{ 
		path: '/video/:videoId', 
		component: Video, 
		meta: {title: '视频'},
		props: true,
	},

	// 根据标签列出视频
	{ 
		path: '/videos', 
		component: videos, 
		meta: {title: '视频列表'},
		beforeRouteUpdate(to, from, next) {
			// react to route changes...
			// don't forget to call next()
			console.log(to, from)
			next();
		}
	},

	{ 
		path: '/upload', 
		component: Upload, 
		meta: {title: '视频上传页'},
		props: true, 
	},
	{ 
		path: '/feedback', 
		component: Feedback,
		meta: {title: '反馈'},
	},
];

const router = new VueRouter({
	routes: routes
});

router.beforeEach((to, from, next) => {
	if(to.meta.title){
		document.title = to.meta.title
	}

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