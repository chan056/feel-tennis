
const Sports = {
	data: function () {
		var d = {sports: []};

		xhr('/sports', function(resData){
			d.sports = resData;
		});

		return d;
	},

	template: temp.sports,
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

	template: temp.albumList,
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
	template: temp.album
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
	template: temp.video
};

const routes = [
	// 获取所有‘运动’项目
	{ path: '/sports', component: Sports },
	// 获取‘某运动项目’下的‘专辑列表’
	{ path: '/sports/:sportId/albums', component: AlbumList, props: true, },
	// 获取‘某专辑’下的‘视频列表’
	{ path: '/albums/:albumId', component: Album, props: true, },
	// 获取‘某视频’的信息
	{ path: '/videos/:videoId', component: Video, props: true, },
]

const router = new VueRouter({
	routes
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
