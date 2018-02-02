const HeaderComponent = {
	el: 'app-header',

	template: temp.header,

	data: {
		searchForm: {
			name: '',
		},

		rules: {
			name: [
			//   { required: true, message: ' '/* , trigger: 'blur'  */},
				{ min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
			],
		},

		registForm: {
			formLabelWidth:'100px',
			visible: false,
			name: '',
			psw: ''
		},

		loginForm: {
			formLabelWidth: '100px',
			visible: false,
			name: '',
			psw: ''
		},

		logoutForm: {
			visible: false
		},

		loginUsrInfo: {}
		// message: 'xxx'
	},

	methods: {
		submitForm(formName) {
			let name = $.trim(this.searchForm.name);
			if(!name)
				return;

			this.$refs[formName].validate((valid) => {
				if (valid) {
					location.hash = "#/videos?headline=" + this.searchForm.name;
					// this.searchForm.name = '';
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		resetForm(formName) {
			this.$refs[formName].resetFields();
		},

		handleUsrBtns(index){
			let t = this;
			let o = {
				'login': function(){
					t.loginForm.visible = true;
				},
				'regist': function(){
					t.registForm.visible = true;
				},
				'datum': function(){
					// t.logoutForm.visible=true;
				},
				'logout': function(){
					t.logoutForm.visible=true;
				}
			};

			o[index] && o[index]();
		},

		login(){
			tools.xhr('/login', function(){
				// this.fetchUsrLoginInfo();

				this.$message({
					message: '登录成功',
					type: 'success'
				});

				location.reload();

				// this.loginForm.visible = false;
			}.bind(this), 'post', {
				name: this.loginForm.name,
				psw: this.loginForm.psw
			}, function(res){
				let status = res.status;
				let statusText = res.statusText;

				if(status == 401){
					this.$message({
						message: '登录失败，请检查用户名、密码',
						type: 'error'
					});
				}
			}.bind(this));
		},

		regist(){
			tools.xhr('/regist', function(){
				this.$message({
					message: '注册成功',
					type: 'success'
				});

				this.registForm.visible = false;
			}.bind(this), 'post', {
				name: this.registForm.name,
				psw: this.registForm.psw
			});
		},

		logout(){
			tools.xhr('/logout', function(){
				this.$message({
					message: '登出成功',
					type: 'success'
				});

				this.fetchUsrLoginInfo();
			}.bind(this), 'post');
		},

		handleSelect(){
			console.log('handleSelect', arguments);
		},

		beforeLogout(){
			this.$confirm('确认关闭？')
			.then(function(){
				this.logoutForm.visible = false;
				done();
			})
			.catch(function(){

			});
		},

		fetchUsrLoginInfo(){
			// 首次打开时 获取用户信息
			tools.xhr('/loginInfo', function(loginUsrInfo){
				this.loginUsrInfo = loginUsrInfo || {};

				let name = loginUsrInfo.name;
				$('#header .el-icon-view').attr('title', name).addClass('usr');

				if(this.loginUsrInfo.isAdmin == 1){
					// location.reload();
					$('#upload-entry').show();
				}else{
					$('#upload-entry').hide();
				}
			}.bind(this));
		}
	},
	mounted: function () {
		// 用户管理
		var tmpUsr = Cookies.get('tmpUsr');
		var tmpUsrPsw = Cookies.get('tmpUsrPsw');
		
		if(tmpUsr){
			tmpUsr = tmpUsr.substr(3, 10);
			// console.log($('#header .el-icon-view'), $('#header .el-icon-view').length);
			$('#header .el-icon-view').attr('title', tmpUsr).addClass('tmp-usr');
		}

		this.fetchUsrLoginInfo();
	},
	// beforeCreate: function () {
	// 	console.group('beforeCreate 创建前状态===============》');
	//    console.log("%c%s", "color:red" , "el     : " + this.$el); //undefined
	//    console.log("%c%s", "color:red","data   : " + this.$data); //undefined 
	//    console.log("%c%s", "color:red","message: " + this.message)  
	// },
	// created: function () {
	// 	console.group('created 创建完毕状态===============》');
	// 	console.log("%c%s", "color:red","el     : " + this.$el); //undefined
	// 	console.log("%c%s", "color:red","data   : " + this.$data); //已被初始化 
	// 	console.log("%c%s", "color:red","message: " + this.message); //已被初始化
	// },
	// beforeMount: function () {
	// 	console.group('beforeMount 挂载前状态===============》');
	// 	console.log("%c%s", "color:red","el     : " + (this.$el)); //已被初始化
	// 	console.log(this.$el);
	// 	console.log("%c%s", "color:red","data   : " + this.$data); //已被初始化  
	// 	console.log("%c%s", "color:red","message: " + this.message); //已被初始化  
	// },
	// mounted: function () {
	// 	console.group('mounted 挂载结束状态===============》');
	// 	console.log("%c%s", "color:red","el     : " + this.$el); //已被初始化
	// 	console.log(this.$el);    
	// 	console.log("%c%s", "color:red","data   : " + this.$data); //已被初始化
	// 	console.log("%c%s", "color:red","message: " + this.message); //已被初始化 
	// },
	// beforeUpdate: function () {
	// 	console.group('beforeUpdate 更新前状态===============》');
	// 	console.log("%c%s", "color:red","el     : " + this.$el);
	// 	console.log(this.$el);   
	// 	console.log("%c%s", "color:red","data   : " + this.$data); 
	// 	console.log("%c%s", "color:red","message: " + this.message); 
	// },
	// updated: function () {
	// 	console.group('updated 更新完成状态===============》');
	// 	console.log("%c%s", "color:red","el     : " + this.$el);
	// 	console.log(this.$el); 
	// 	console.log("%c%s", "color:red","data   : " + this.$data); 
	// 	console.log("%c%s", "color:red","message: " + this.message); 
	// },
	// beforeDestroy: function () {
	// 	console.group('beforeDestroy 销毁前状态===============》');
	// 	console.log("%c%s", "color:red","el     : " + this.$el);
	// 	console.log(this.$el);    
	// 	console.log("%c%s", "color:red","data   : " + this.$data); 
	// 	console.log("%c%s", "color:red","message: " + this.message); 
	// },
	// destroyed: function () {
	// 	console.group('destroyed 销毁完成状态===============》');
	// 	console.log("%c%s", "color:red","el     : " + this.$el);
	// 	console.log(this.$el);  
	// 	console.log("%c%s", "color:red","data   : " + this.$data); 
	// 	console.log("%c%s", "color:red","message: " + this.message)
	// }
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
			video.onpause = function(){
				// console.log('pause');
				// 停止匹配字幕 todo
			}

			video.onended = function(){
				// console.log('ended');
				$('.subtitle').text('');
			}
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

const About = {
	data: function () {
		var d = {};
		return d;
	},

	methods:{
		
	},

	template: temp.about,
};