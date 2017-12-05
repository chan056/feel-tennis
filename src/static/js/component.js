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
		let videoDir = "../uploads/";

		xhr('/videos/' + propsData.videoId, function(resData){
			d.video = resData[0];
			d.src =  videoDir + d.video.id + ".mp4";
		});

		return d;
	},
	template: temp.video
};

const Upload = {
	props: [''],
	data: function () {
		let newTagDialogConfig = {
			visibility: false,
			title: '新建标签',
		};

		var d = {
			SO: {}, 
			albums: [], 
			tags: [], 
			sports: [], 
			newTagDialogConfig: newTagDialogConfig, 
			newTag: {},
		};

		d.fileList = [];

		xhr('/albums', function(resData){
			d.albums = resData;
		});

		xhr('/tags', function(resData){
			d.tags = resData;
		});
		
		xhr('/sports', function(resData){
			d.sports = resData;
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
		},
		handleSuccess(file){
			console.log(file);
		},

		postVedio(){
			let so = Object.assign({}, this.SO);
			so.tag = this.SO.tag.join(',');

			xhr('/video', function(){
				console.log(arguments)
			}, 'post', so);
		},

		postTag(){

			xhr('/tag', function(){
				console.log(arguments)
			}, 'post', this.newTag);
			
		}
	},
	template: temp.upload
};