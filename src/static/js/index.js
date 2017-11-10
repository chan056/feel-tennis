const Sports = {
	data: function () {
		var d = {sports: []};

		xhr('/sports', function(resData){
			d.sports = resData;
			console.log(resData)
		});

		return d;
	},

	template: `
			<div id="album-list">
				<ol>
					<li v-for="sport in sports">
						<a :href="sport.id">{{ sport.name }}</a>
					</li>
				</ol>
			</div>
    `,
};

const AlbumList = {
	props: ['sportId', 'pid'],
	data: function () {
		var d = {albumList: []};
		var propsData = this.$options.propsData;
		xhr('/albumList/'+propsData.sportId+'/'+propsData.pid, function(resData){
			d.albumList = resData;
		});

		return d;
	},

	template: `
			<div id="album-list">
				<ol>
					<li v-for="album in albumList">
						<a :href="album.album_id">{{ album.album_name }}</a>
					</li>
				</ol>
			</div>
    `,
};

const Tennis = {
	template: `
    <div>
        <h2>Feel Tennis</h2>
        <ul class="list">
            <li>
                <a href="./video.html">How to play forehand stroke</a>
            </li>
        </ul>
    </div>
`};

const routes = [
	{ path: '/sports', component: Sports },
	{ path: '/sports/:sportId/:pid', component: AlbumList, props: true, },
	{ path: '/tennis', component: Tennis },
]

const router = new VueRouter({
	routes // （缩写）相当于 routes: routes
})

const app = new Vue({
	router
}).$mount('#router');

function xhr(api, sfn){
	axios.get(api)
    .then(function (response) {
			sfn && sfn(response.data)
    })
    .catch(function (error) {
        console.log(error);
    });
}
