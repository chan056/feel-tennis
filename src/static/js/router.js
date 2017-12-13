const routes = [
	// { path: '/', redirect: '/sports' },
	// 获取所有‘运动’项目
	{ path: '/sports', component: Sports, alias: '/'},
	// 获取‘某运动项目’下的‘专辑列表’
	{ path: '/sports/:sportId', component: AlbumList, props: true, },
	// 获取‘某专辑’下的‘视频列表’
	{ path: '/albums/:albumId', component: Album, props: true, },
	// 获取‘某视频’的信息
	{ 
		path: '/videos/:videoId', 
		component: Video, 
		props: true,
	},

	{ path: '/upload', component: Upload, props: true, },
];

const router = new VueRouter({
	routes
});

const app = new Vue({
	el: '#router',
	router: router
})/* .$mount('#router') */;

// const nav = new Vue({
// 	el: '#nav'
// });
