
$(function () {
	let AppHeader = COMPONENTS.HeaderComponent,
		AppAside = COMPONENTS.AsideComponent;
		
	let isMapper;

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
				<AppGuide v-bind="guideRoutes"/>
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

		if(isMapper == undefined){
			tools.xhr('/isMapper', function(res){
				isMapper = res;
				if(isMapper){
					recordPage();
				}
			});
		}else if(isMapper){
			recordPage();
		}

		function recordPage(){
			// 修改标题
			console.log(from.meta.title)
			if (from.meta.title) {
				document.title = from.meta.title;
			}

			console.log('isMapper')
			var pageContent = $('html')[0].outerHTML;

			tools.xhr('/pageRecoder', function(res){
			}, 'post', {
				pagePath: curPath,
				pageContent: pageContent
			});

			next()
		}
	});

	router.afterEach((to, from) => {
		appInstance.$bus.emit('dismiss-guider');// 页面切换，隐藏引导
	})
});