const Sports = {
	data: function () {
		var d = {sports: []};

		xhr('/sports', function(resData){
			d.sports = resData;
		});

		return d;
	},

	template: `
			<div id="album-list">
				<ol>
					<li v-for="sport in sports">
						<router-link :to="{path: '/sports/'+ sport.id }">{{ sport.name }}</router-link> 
					</li>
				</ol>
			</div>
    `,
};

const AlbumList = {
	props: ['sportId'],
	data: function () {
		var d = {albumList: []};
		var propsData = this.$options.propsData;
		xhr('/albumList/' + propsData.sportId, function(resData){
			d.albumList = resData;
		});

		return d;
	},

	template: `
			<div id="album-list">
				<ol>
					<li v-for="album in albumList">
						<router-link :to="{path: '/album/'+ album.album_id }">{{ album.album_name }}</router-link> 
					</li>
				</ol>
			</div>
    `,
};

const Album = {
	props: ['albumId'],
	data: function () {
		var d = {albumVideoList: []};
		var propsData = this.$options.propsData;
		xhr('/album/' + propsData.albumId, function(resData){
			d.albumVideoList = resData;
		});

		return d;
	},
	template: `
		<div>
			<h2>Feel Tennis</h2>
			<ul class="list">
				<li v-for="video in albumVideoList">
					<router-link :to="{path: '/video/'+ video.album_video_id }">{{ video.headline }}</router-link>
				</li>
			</ul>
		</div>
	`
};

const Video = {
	props: ['videoId'],
	data: function () {
		var d = {video: [], src: ''};
		var propsData = this.$options.propsData;
		xhr('/video/' + propsData.videoId, function(resData){
			d.video = resData[0];
			d.src = "../video/" + d.video.album_id + '_' + d.video.album_video_id + ".mp4";
		});

		return d;
	},
	template: `
		<div>
			<h2>{{video.headline}}</h2>
			<video v-bind:src="src" controls="controls" >
				Not support this browser, please use Chrome.
			</video>
		</div>
	`
};

const routes = [
	{ path: '/sports', component: Sports },
	{ path: '/sports/:sportId', component: AlbumList, props: true, },
	{ path: '/album/:albumId', component: Album, props: true, },
	{ path: '/video/:videoId', component: Video, props: true, },
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
