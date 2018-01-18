const HeaderComponent = {
	el: 'app-header',

	template: temp.header,

	data: {
		ruleForm: {
			name: '',
		},
		rules: {
			name: [
			//   { required: true, message: ' '/* , trigger: 'blur'  */},
				{ min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
			],
		}
	},

	methods: {
		submitForm(formName) {
			let name = $.trim(this.ruleForm.name);
			if(!name)
				return;

			this.$refs[formName].validate((valid) => {
				if (valid) {
					location.hash = "#/videos?headline=" + this.ruleForm.name;
					// this.ruleForm.name = '';
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		resetForm(formName) {
			this.$refs[formName].resetFields();
		}
	}
	// component
};

const AsideComponent = {
	el: 'app-aside',

	template: temp.aside,

	data: {
		
	},

	methods: {
		
	}
};

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
		let d = {albumVideoList: [], crumb: {}, tags:[]};
		let propsData = this.$options.propsData;
		let albumId = propsData.albumId;

		tools.xhr('/albums/' + albumId + '/videos', function(resData){
			d.albumVideoList = resData;
		});

		tools.xhr('/navInfo/2/' + albumId, function(resData){
			d.crumb = resData[0];
		});

		tools.xhr('/navInfo/2/' + albumId, function(resData){
			d.crumb = resData[0];
		});

		tools.xhr('/albumTags/' + albumId, function(resData){
			d.tags = resData;
		});

		return d;
	},
	template: temp.album
};

const Video = {
	props: ['videoId'],
	data: function () {
		let d = {video: [], crumb: {}, tags: [], captureParams: {}, previewerVisible: false, gifLink: ''};
		let propsData = this.$options.propsData;
		let videoId = propsData.videoId;
		// d.videoId = videoId;

		d.captureParams.vId = videoId;

		tools.xhr('/videos/' + videoId, function(resData){
			d.video = resData[0];
			d.captureParams.ext = d.video.video_ext;
		});

		tools.xhr('/navInfo/3/' + videoId, function(resData){
			d.crumb = resData[0];
		});

		tools.xhr('/videoTags/' + videoId, function(resData){
			d.tags = resData;
		});
		
		tools.xhr('/srt/' + videoId, function(resData){
			// console.log(resData);
			let v = $('#video');
			let playerWrapper = $('#palyer-wrapper')

			tools.attachSubtile(v[0], resData, 500, function(subtitle){
				// console.log(subtite);

				playerWrapper.find('.subtitle').text(subtitle).css({

				});
			});
		});

		return d;
	},
	template: temp.video,
	created() {
		tools.insertScriptTag(1, "https://cdn.jsdelivr.net/npm/hls.js@latest", {onload: function(){
			tools.insertScriptTag(2, FRAGMENTS.attachVideo(this.videoId), {id: 'hls-frag'});
		}.bind(this), id: 'hls'});

		// var t = 0;
		// tools.insertScriptTag(1, "http://siloor.com/youtube.external.subtitle/static/youtube.external.subtitle/youtube.external.subtitle.js", {onload: function(){
		// 		tools.insertScriptTag(2, FRAGMENTS.attachSubtitle, {id: 'subtitle-frag'});
		// }, id: 'external-subtitle'});
	},
	methods: {
		captureCountdown: function(){
			let _this = this;
			let captureBtn = $('#capture-btn');
			let counting = captureBtn.data('counting');

			if(!counting){
				captureBtn.data('counting', true);
				_this.captureParams.st = _this.getVideoTime();
				_this.captureParams.vId = _this.videoId;

				countdown();
			}else{
				clearCountdown();
				_this.capture();
			}

			// 倒计时
			function countdown(){
				let t = 10;
				_this.intervalId = setInterval(function(){
					t--;
					captureBtn.val('截图中 ' + t);

					if(t == 0){
						clearCountdown();
					}
				}, 1000)
			};

			function clearCountdown(){
				clearInterval(_this.intervalId);
				captureBtn.data('counting', false);
				captureBtn.val('开始截图');
			}
		},

		capture: function(){
			this.captureParams.et = this.getVideoTime();

			if(!this.captureParams === undefined){
				return;
			}
			
			tools.xhr('/gifLink?' + $.param(this.captureParams), function(resData){
				console.log(resData);
				this.captureParams = {id: this.captureParams.id};

				var gifLink = resData;
				this.gifLink = gifLink;
				
			}.bind(this));
		},

		getVideoTime: function(){
			return $('#video')[0].currentTime;
		},

		preview: function(){
			this.previewerVisible = true;
		}
	}
};

const videos = {
	data: function () {
		var d = {videos: []};
		this.refreshVlist();

		return d;
	},
	template: temp.videos,
	created() {
		
	},
	beforeRouteUpdate(to, from, next) {
		console.log('update ........', to, this.$route)
		setTimeout(this.refreshVlist, 20);// ? 触发时， $route还未更新
		next();
	},

	methods: {
		refreshVlist: function(){
			var route = this.$route;
			
			// {a:1, b:2} 转化成 ?a=1&b=2
			let q = $.param(route.query);
			q = q? ('?' + q): '';

			_t = this;

			tools.xhr('/videos' + q, function(resData){
				_t.videos = resData;
			});
		} 
	}
};

const Upload = {
	props: [''],
	data: function () {
		let tagConfig = {
			visibility: false,
			title: '新建标签',
		};

		let albumConfig = {
			visibility: false,
			title: '新建专辑',
		};

		var d = {
			SO: {}, 
			albums: [], 
			tags: [], 
			sports: [], 
			makers: [],
			tagConfig: tagConfig, 
			albumConfig: albumConfig,
			newTag: {},
			newAlbum: {}
		};

		d.fileList = [];

		this.queryAlbums();
		this.queryTags();
		this.querySports();

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
		handleSuccess(res){
			// console.log(res);
			this.SO.videoAbsPath = res.absPath;
		},

		handleSubtitleSuccess(res){
			this.SO.subtitleAbsPath = res.absPath;
		},

		postVedio(){
			let so = Object.assign({}, this.SO);
			so.tag = this.SO.tag.join(',');

			tools.xhr('/video', function(){
				console.log(arguments);
				this.$message({
					message: '视频创建成功',
					type: 'success'
				});
			}.bind(this), 'post', so);
		},

		postTag(){

			tools.xhr('/tag', function(){
				console.log(arguments)
			}, 'post', this.newTag);
			
		},

		openAlbumDialog(){
			this.albumConfig.visibility = true;
			this.queryMakers();
		},

		postAlbum(){
			tools.xhr('/album', function(){
				// console.log(arguments);
				this.$message({
					message: '专辑创建成功',
					type: 'success'
				});

				this.queryAlbums();
			}.bind(this), 'post', this.newAlbum);
		},

		queryAlbums(){
			tools.xhr('/albums', function(resData){
				this.albums = resData;
			}.bind(this));
		},

		queryTags(){
			tools.xhr('/tags', function(resData){
				this.tags = resData;
			}.bind(this));
		},

		querySports(){
			tools.xhr('/sports', function(resData){
				this.sports = resData;
			}.bind(this));
		},

		queryMakers(){
			tools.xhr('/makers', function(resData){
				this.makers = resData;
			}.bind(this));
		}
	},
	template: temp.upload
};

const Feedback = {
	data: function () {
		var d = {files: [], fileList: []};
		d.form = {
			desc: '',
			site: '',
			email: '',
		};

		let rules = {
			desc: [
				{ required: true, message: '请填写问题描述',  },
				{ min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur' }
			],
			site: [
				{ message: '请填写相关网址', trigger: 'blur' }
			],
			email: [
				{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
			],
		}

		d.rules = rules;

		return d;
	},

	methods:{
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				let d = Object.assign({}, this.form);
				d.files = this.files.join(',');

				if (valid) {
					tools.xhr('/feedback', function(resData){
						this.resetForm('form');
					}.bind(this), 'post', d);
				} else {
					return false;
				}
			});
		},
		resetForm(formName) {
			this.$refs[formName].resetFields();
			this.files = [];
			this.fileList = [];
		},
		handleRemove(file, fileList) {
			this.files = [];
			// 从fileList从提取files
			fileList.forEach(function(f){
				let relPath = f.response.relPath;
				this.files.push(relPath);
			}.bind(this));
		},
		handleExceed(files, fileList) {
			this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
		},
		handleSuccess(res, file){
			this.files.push(res.relPath);
		},

		goback: function(){
			history.back();
		}
	},

	template: temp.feedback,
};