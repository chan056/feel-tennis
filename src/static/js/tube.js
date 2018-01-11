$(function(){
	const mainRouter = new VueRouter({
		routes: routeConfig
	});
	
	mainRouter.beforeEach((to, from, next) => {
		console.log(from.fullPath, '==>', to.fullPath);
		next();
	})
	
	const mainInstance = new Vue({
		router: mainRouter,
	}).$mount('#main-router');
	
	const navInstance = new Vue(HeaderComponent);

	const asideInstance = new Vue();
})