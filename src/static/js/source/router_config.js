module.exports = function(){
	const routeConfig = [
		{ 
			path: '/', 
			redirect: '/sports' 
		},
		{ 
			path: 'sports', 
			component: COMPONENTS.Sports, 
			meta: {title: '首页'},
		},
		{ 
			path: 'sports/:sportId', 
			component: COMPONENTS.AlbumList,
			meta: {title: '专辑列表'},
			props: function(route){
				return {sportId: route.params.sportId}
			},
		},
		{ 
			path: 'albums/:albumId', 
			component: COMPONENTS.Album, 
			props: true, 
			meta: {title: '视频列表'},
		},
		{ 
			path: 'videos/:videoId', 
			component: COMPONENTS.Video, 
			meta: {title: '视频'},
			props: true,
		},
		{ 
			path: 'searchedvideos', 
			component: COMPONENTS.searchedvideos, 
			meta: {title: '视频列表搜素结果'},
			beforeRouteUpdate(to, from, next) {
				next();
			}
		},
		{ 
			name: 'datum',
			path: 'datum', 
			component: COMPONENTS.Datum,
			meta: {title: '个人资料'},
		},
		{ 
			path: 'voteNext', 
			component: COMPONENTS.VoteNext,
			meta: {title: '投票'},
		},
		{ 
			path: 'feedback', 
			component: COMPONENTS.Feedback,
			meta: {title: '反馈'},
		},
		{ 
			path: 'about',
			component: COMPONENTS.About,
			meta: {title: '关于作者'},
		},
		{ 
			path: 'emailConfirm', 
			component: COMPONENTS.EmailConfirm,
			meta: {title: '邮件确认'},
		},
		{ 
			path: 'retrievePsw', 
			component: COMPONENTS.RetrievePsw,
			meta: {title: '找回密码'},
		},
		{ 
			path: 'stars', 
			component: COMPONENTS.Stars,
			meta: {title: '我的收藏'},
		},
		{ 
			path: 'vStar/:vStarId', 
			component: COMPONENTS.Vstar,
			meta: {title: '视频收藏'},
			props: true,
		},
		{ 
			path: 'usrVshoots', 
			component: COMPONENTS.UsrVshoots,
			meta: {title: '截图收藏'},
		},
		{ 
			path: 'compete', 
			component: COMPONENTS.Compete,
			meta: {title: '竞技场'},
		},
		{ 
			path: 'translator/:videoId', 
			component: COMPONENTS.Translator,
			meta: {title: '字幕翻译'},
			props: true,
		},
		// { 
		// 	path: 'translator/:videoId/:usrId', 
		// 	component: COMPONENTS.Translator,
		//  meta: {title: '翻译'},
		// 	props: true,
		// },
	];

	window.routeConfig = routeConfig;
};