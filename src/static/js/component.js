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
		xhr('/sports/' + propsData.sportId + '/albums', function(resData){
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
		xhr('/albums/' + propsData.albumId + '/videos', function(resData){
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
		xhr('/videos/' + propsData.videoId, function(resData){
			d.video = resData[0];
			d.src = "../video/" + d.video.id + ".mp4";
		});

		return d;
	},
	template: temp.video
};

const Upload = {
	props: [''],
	data: function () {
		var d = {SO: {}, albums: []};

		xhr('/albums', function(resData){
			d.albums = resData;
			console.log(resData)
		});

		return d;
	},
	methods: {
		alert: function(){
			console.log(arguments);
		}
	},
	template: temp.upload
};