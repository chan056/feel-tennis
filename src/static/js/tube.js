
$(function () {
	let AppHeader = COMPONENTS.HeaderComponent,
		AppAside = COMPONENTS.AsideComponent;

		const GlobalSetting = {
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
		}
	}

	const router = new VueRouter({
		// mode: 'history',
		routes: [
			{
				path: '/',
				component: GlobalSetting,
				children: routeConfig
			}
		]
	})

	new Vue({
		router,
		el: '#app'
	})
});