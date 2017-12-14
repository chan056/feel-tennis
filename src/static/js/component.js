const Sports = {
	data: function () {
		var d = {sports: []};

		tools.xhr('/sports', function(resData){
			d.sports = resData;
		});

		return d;
	},

	template: temp.sports,
};

const AlbumList = {
	props: ['sportId'],
	data: function () {
		var propsData = this.$options.propsData;
		var d = {albumList: [], crumb: {}};
		tools.xhr('/sports/' + propsData.sportId + '/albums', function(resData){
			d.albumList = resData;
		});

		tools.xhr('/navInfo/1/' + propsData.sportId, function(resData){
			d.crumb = resData[0];
		});

		return d;
	},

	template: temp.albumList,

	methods: {
		
	},

	computed: {
		// albumList: function(){
			
		// }
	}
};

const Album = {
	props: ['albumId'],
	data: function () {
		var d = {albumVideoList: [], crumb: {},};
		var propsData = this.$options.propsData;
		tools.xhr('/albums/' + propsData.albumId + '/videos', function(resData){
			d.albumVideoList = resData;
		});

		tools.xhr('/navInfo/2/' + propsData.albumId, function(resData){
			d.crumb = resData[0];
		});

		return d;
	},
	template: temp.album
};

const Video = {
	props: ['videoId'],
	data: function () {
		var d = {video: [], crumb: {}, src: ''};
		var propsData = this.$options.propsData;
		let videoDir = "../upload/";

		tools.xhr('/videos/' + propsData.videoId, function(resData){
			d.video = resData[0];
			d.src =  videoDir + d.video.id + ".mp4";
		});

		tools.xhr('/navInfo/3/' + propsData.videoId, function(resData){
			d.crumb = resData[0];
		});

		return d;
	},
	template: temp.video,
	created() {
		tools.insertScriptTag(1, "https://cdn.jsdelivr.net/npm/hls.js@latest", {onload: function(){
			tools.insertScriptTag(2, FRAGMENTS.playHLS);
		}});
	}
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

		tools.xhr('/albums', function(resData){
			d.albums = resData;
		});

		tools.xhr('/tags', function(resData){
			d.tags = resData;
		});
		
		tools.xhr('/sports', function(resData){
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

			tools.xhr('/video', function(){
				console.log(arguments)
			}, 'post', so);
		},

		postTag(){

			tools.xhr('/tag', function(){
				console.log(arguments)
			}, 'post', this.newTag);
			
		}
	},
	template: temp.upload
};