$(function () {
	let AppHeader = COMPONENTS.HeaderComponent,
		AppAside = COMPONENTS.AsideComponent;
		
	let isMapper;// 是否SEOer/上传页面的人

	const GlobalSetting = {
		data: function(){
			return {
				guideRoutes: {}
			}
		},
		template: `
			<div>
				<AppHeader/>
				<div id="root-container">
					<AppAside/>
					<div id="main">
						<router-view id="main-router-view" class="view"></router-view>
					</div>
					<br class="clr">
				</div>
				<AppGuide/>
			</div>
		`,
		components: {
			AppHeader,
			AppAside
		},

		mounted(){
			$(window).trigger('resize');
		}
	}

	const router = new VueRouter({
		mode: 'history',
		fallback: true,
		routes: [
			{
				path: '/',
				component: GlobalSetting,
				children: routeConfig
			}
		]
	})

	let appInstance = new Vue({
		router,
		el: '#app'
	});

	router.beforeEach((to, from, next)=>{

		// 存储页面
		let curPath = router.history.current.path;
		if(curPath.toLowerCase().match('admin')){
			return next();
		}

		if(loginUsrInfo && isMapper){
			recordPage();
			sitePush();
		}else{
			document.title = to.meta.title + ' _一波教练';
		}

		next();

		function recordPage(){
			var pageContent = $('html')[0].outerHTML;
			if (to.meta.title) {
				document.title = to.meta.title + ' _一波教练';
			}

			tools.xhr('/pageRecoder', function(res){
			}, 'post', {
				pagePath: curPath,
				pageContent: pageContent
			});
		}

		function sitePush(){
			if(location.host === CONSTANT.HOSTNAME){
				tools.insertScriptTag(2, FRAGMENTS.baiduLinkPusher, {id: 'baidu-push-api'});
			}
		}
	});

	router.afterEach((to, from) => {
		appInstance.$bus.emit('dismiss-guider');// 页面切换，隐藏引导
	})

	tools.xhr('/isMapper', function(res){
		isMapper = res;
	});
});