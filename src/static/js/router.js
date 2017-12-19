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
	},

	{ path: '/upload', component: Upload, props: true, },
];

const router = new VueRouter({
	routes
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

const nav = new Vue({
	el: '#header',

	data: {
		ruleForm: {
			name: '',
		},
		rules: {
			name: [
			  { required: true, message: '请输入活动名称', trigger: 'blur' },
			  { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
			],
		}
	},

	methods: {
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
			if (valid) {
				alert('submit!');
			} else {
				console.log('error submit!!');
				return false;
			}
			});
		},
		resetForm(formName) {
			this.$refs[formName].resetFields();
		}
	}
	// component
});

// Vue.set( target, key, value )