$(function(){

	var navInstance = new Vue(COMPONENTS.HeaderComponent);

	var asideInstance = new Vue(COMPONENTS.AsideComponent);

	var mainRouter = new VueRouter({
		routes: routeConfig
	});
	
	mainRouter.beforeEach(function (to, from, next) {
		console.log(from.fullPath, '==>', to.fullPath);
		next();
	});
	
	var mainInstance = new Vue({
		router: mainRouter,
	}).$mount('#main-router-view');

});