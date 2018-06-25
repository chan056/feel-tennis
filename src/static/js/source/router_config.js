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
			meta: {title: '视频列表'},
			beforeRouteUpdate(to, from, next) {
				console.log(to, from)
				next();
			}
		},
		{ 
			path: 'datum', 
			component: COMPONENTS.Datum
		},
		{ 
			path: 'voteNext', 
			component: COMPONENTS.VoteNext
		},
		{ 
			path: 'feedback', 
			component: COMPONENTS.Feedback,
		},
		{ 
			path: 'about',
			component: COMPONENTS.About,
		},
		{ 
			path: 'emailConfirm', 
			component: COMPONENTS.EmailConfirm
		},
		{ 
			path: 'retrievePsw', 
			component: COMPONENTS.RetrievePsw
		},
		{ 
			path: 'stars', 
			component: COMPONENTS.Stars
		},
		{ 
			path: 'vStar/:vStarId', 
			component: COMPONENTS.Vstar,
			props: true,
		},
		{ 
			path: 'usrVshoots', 
			component: COMPONENTS.UsrVshoots,
		},
		{ 
			path: 'compete', 
			component: COMPONENTS.Compete,
		},
		{ 
			path: 'translator/:videoId', 
			component: COMPONENTS.Translator,
			props: true,
		},
		{ 
			path: 'translator/:videoId/:usrId', 
			component: COMPONENTS.Translator,
			props: true,
		},
	];

	window.routeConfig = routeConfig;
};