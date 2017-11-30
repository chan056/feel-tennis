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

		d.fileList = [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}];

		xhr('/albums', function(resData){
			d.albums = resData;
		});

		return d;
	},
	methods: {
		alert: function(){
			console.log(arguments);
		},
		handleRemove(file, fileList) {
			console.log(file, fileList);
		},
		handlePreview(file) {
			console.log(file);
		},
		handleExceed(files, fileList) {
			this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
		}
	},
	template: temp.upload
};