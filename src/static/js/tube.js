
$(function () {
	let AppHeader = COMPONENTS.HeaderComponent,
		AppAside = COMPONENTS.AsideComponent;

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
		// mode: 'history',
		routes: [
			{
				path: '/',
				component: GlobalSetting,
				children: routeConfig,
				beforeRouteUpdate(to, from, next){
					console.log(to)
					next();
				}
			}
		]
	})

	new Vue({
		router,
		el: '#app'
	})
});