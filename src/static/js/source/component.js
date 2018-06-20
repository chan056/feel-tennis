module.exports = function(){
	var COMPONENTS = {};

	COMPONENTS.HeaderComponent = {
		// el: 'app-header',

		template: temp.header,

		data: function(){
			return  {
				searchForm: {
					name: '',
				},
	
				searchFormRules: {
					name: [
					//   { required: true, message: ' '/* , trigger: 'blur'  */},
						{ min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
					],
				},
	
				registForm: {
					formLabelWidth:'100px',
					visible: false,
					name: '',
					psw: '',
					email: ''
				},
	
				registFormRule: {
					name: [
						{ required: true, message: '请输入用户名', trigger: 'blur' },
						{ min: 5, max: 30, message: '长度在 5-30', trigger: 'blur' },
						{ validator: function(rule, value, callback){
							tools.xhr('/checkUsernameExist?name=' + value, function(d){
								if(d){
									return callback(new Error('用户名已存在'));
								}else{
									return callback();
								}
							});
						}, trigger: 'blur'}
					],
					psw: [
						{ required: true, message: '请输入密码', trigger: 'blur' },
					],
					email: [
						{ type: 'email', required: true, message: '请输入正确格式邮箱', trigger: 'change' },
						{ validator: function(rule, value, callback){
							tools.xhr('/checkEmailExist?email=' + value, function(d){
								if(d){
									return callback(new Error('邮箱已存在'));
								}else{
									return callback();
								}
							});
						}, trigger: 'blur'}
					],
					captcha: [
						{ required: true, message: '请输入计算结果', trigger: 'blur' },
					]
				},
	
				loginForm: {
					formLabelWidth: '100px',
					visible: false,
					name: '',
					psw: ''
				},
	
				resetPswForm: {
					formLabelWidth: '100px',
					visible: false,
					opsw: '',
					npsw: '',
					rules: {
						name: [
							{required: true, message: '请输入用户名', trigger: 'blur' },
						]
					}
				},
	
				retrievePswForm: {
					formLabelWidth: '100px',
					visible: false,
					npsw: '',
					rules: {
						name: [
							{required: true, message: '请输入新密码', trigger: 'blur' },
						]
					}
				},
	
				logoutForm: {
					visible: false
				},
	
				loginUsrInfo: {},
				inmails: []
			}
		},

		methods: {
			submitForm: function(formName) {
				let t = this;
				let name = $.trim(this.searchForm.name);
				if(!name)
					return;

				this.$refs[formName].validate((valid) => {
					if (valid) {
						location.hash = "#/searchedVideos?headline=" + this.searchForm.name;
						t.searchForm.name = '';
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			resetForm: function(formName) {
				this.$refs[formName].resetFields();
			},

			handleUsrBtns: function(index){
				let o = {
					'login': this.handlerLogin,
					'regist': this.handlerRegist,
					'datum': function(){
						console.log(this, this.$location)
						location.href = "#/datum";
					},
					'logout': this.handlerLogout
				};

				o[index] && o[index]();
			},

			handlerLogin: function(){
				this.loginForm.visible = true;

				setTimeout(function(){
					$('#last-login-iput').off('keyup.login').on('keyup.login', function(e){
						var keyCode = e.keyCode;
						if(keyCode == 13){
							this.login();
						}
					}.bind(this));
				}.bind(this), 500)

				tools.insertScriptTag(1, '../lib/md5.js', 'md5');
			},

			handlerRegist: function(){
				this.registForm.visible = true;

				tools.insertScriptTag(1, "../lib/captcha.js", {onload: function(){
					tools.insertScriptTag(2, FRAGMENTS.captcha, {id: 'captcha-frag'});
				}.bind(this), id: 'captcha'});

				tools.insertScriptTag(1, '../lib/md5.js', 'md5');
			},

			handlerLogout: function(){
				this.logoutForm.visible=true;
			},

			login: function(){
				let trim = $.trim;
				
				tools.xhr('/login', function(){
					// this.fetchUsrLoginInfo();

					// this.$message({
					// 	message: '登录成功',
					// 	type: 'success'
					// });

					location.reload();

					// this.loginForm.visible = false;
				}.bind(this), 'post', {
					name: trim(this.loginForm.name),
					psw: md5(trim(this.loginForm.psw)),
					ip: CURPOS.ip,
					city: this.cityZH,
					coords: CURPOS.longitude + ',' + CURPOS.latitude
				}, function(res){
					let status = res.status;
					let statusText = res.statusText;

					if(status == 401){
						this.$message({
							message: '登录失败，请检查用户名、密码',
							type: 'error'
						});
					}else{

					}
				}.bind(this));
			},

			regist: function(){
				let t = this;
				this.$refs['registForm'].validate(function(valid){
					if (valid) {
						let trim = $.trim;

						tools.xhr('/regist', function(res){
							t.registForm.visible = false;
			
							t.$alert('注册成功,' + res, '提示', {
								confirmButtonText: '确定',
								callback: function(){
									location.reload();
								}
							});

							t.resetRegistForm();
						}.bind(t), 'post', {
							name: trim(t.registForm.name),
							psw: md5(trim(t.registForm.psw)),
							email: trim(t.registForm.email)
						});
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},

			// 找回密码邮件
			retrievePswEmail: function(){
				const t = this;
				
				this.$refs['resetPswForm'].validateField('name', function(err){
					if(!err){
						var name = $.trim(t.resetPswForm.name);

						t.$alert(`确认重置密码?`, '注意', {
							confirmButtonText: '确定',
							callback: function (action) {
								tools.xhr('/retrievePswEmail', function(res){
									t.$message({
										type: 'info',
										message: res
									});

									// t.resetPswForm.visible = false; 
								}, 'patch', {
									usrname: name
								}, function(){
									t.$message({
										type: 'warning',
										message: `密码重置邮件发送失败`
									});
								});
							}
						});
					}
				})
			},

			// 重置密码
			retrievePsw: function(){
				var t = this;
				tools.xhr('/retrievePsw', function(res){
					t.$message({
						type: 'info',
						message: `密码重置成功`
					});

					setTimeout(function(){
						location.href=location.origin + '/#/';
					}, 1000);

					t.retrievePswForm.visible = false; 
				}, 'patch', {
					code: this.retrievePswCode,
					npsw: md5($.trim(this.retrievePswForm.npsw))
				}, function(){
					t.$message({
						type: 'warning',
						message: `密码重置失败`
					});
				});
			},

			// 密码修改
			resetPsw: function(){
				const t = this;
				let trim = $.trim;

				this.$alert(`确认将密码修改为${t.resetPswForm.npsw}?`, '注意', {
					confirmButtonText: '确定',
					callback: function (action) {
						tools.xhr('/resetPsw', function(res){
							t.$message({
								type: 'info',
								message: `密码修改成功`
							});

							t.resetPswForm.visible = false; 
						}, 'patch', {
							name: trim(t.resetPswForm.name),
							opsw: md5(trim(t.resetPswForm.opsw)),
							npsw: md5(trim(t.resetPswForm.npsw))
						}, function(){
							t.$message({
								type: 'warning',
								message: `密码修改失败`
							});
						});
					}
				});
			},

			logout: function(){
				tools.xhr('/logout', function(){
					this.$message({
						message: '登出成功',
						type: 'success'
					});

					this.fetchUsrLoginInfo();
				}.bind(this), 'post');
			},

			handleSelect: function(){
				console.log('handleSelect', arguments);
			},

			beforeLogout: function(){
				this.$confirm('确认关闭？')
				.then(function(){
					this.logoutForm.visible = false;
					done();
				})
				.catch(function(){

				});
			},

			fetchUsrLoginInfo: function(){
				tools.xhr('/loginInfo', function(loginUsrInfo){
					// 登陆状态在各组件共享 todo
					this.loginUsrInfo = loginUsrInfo || {};
					window.loginUsrInfo = loginUsrInfo;

					let name = loginUsrInfo.name;
					$('#header .el-icon-view').attr('title', name).addClass('usr');

					this.$bus.emit('update-login-info', this.loginUsrInfo);

					name && this.fetchInmails();
				}.bind(this));
			},

			fetchInmails: function(){
				tools.xhr('/inmails', function(data){
					this.inmails = data;
				}.bind(this));
			},

			showInmailDetail: function(inmail, key){
				this.$alert(inmail.content, '消息详情', {
					confirmButtonText: '确定',
					callback: function(){
						
					}
				});

				// 标记已读
				tools.xhr('/markAsRead', function(data){
					this.fetchInmails();	
				}.bind(this), 'patch', {inmailId: inmail.id});

			}
		},

		mounted: function () {
			// 用户管理
			var tmpUsr = Cookies.get('tmpUsr');
			
			if(tmpUsr){
				tmpUsr = tmpUsr.substr(3, 10);
				$('#header .el-icon-view').attr('title', tmpUsr).addClass('tmp-usr');
			}

			this.fetchUsrLoginInfo();

			$('.aside-menu-btn').on('click', function(){
				$('#root-container').toggleClass('brief');
			});

			var retrievePswCode = '';
			if(location.search.match(/\?retrievePswCode/)){
				retrievePswCode = location.search.match(/retrievePswCode=([^&#]+)/);
				retrievePswCode && (retrievePswCode = retrievePswCode[1]);

				tools.insertScriptTag(1, '../lib/md5.js', 'md5');

				this.retrievePswCode = retrievePswCode;
				this.retrievePswForm.visible = true;
			}

			
		},

		created: function(){
			try{(new BMap.LocalCity()).get(function(city){
				this.cityZH = city.name;
			}.bind(this))}
			catch(e){

			}

			this.$bus.on('update-inmails', function(){
				this.fetchInmails();
			}.bind(this));

			this.$bus.on('trigger-login', function(){
				this.handlerLogin();
			}.bind(this));
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

	COMPONENTS.AsideComponent = {
		// el: 'app-aside',

		template: temp.aside,

		data: function(){
			return {
				loginUsrInfo: {}
			}
		},

		created: function(){
			this.$bus.on('update-login-info', function(info){
				this.loginUsrInfo = info;
			}.bind(this));
		},

		mounted: function(){
			this.getCurPos();
			
		},

		beforeDestroy: function() {
			this.$bus.off('update-login-info', this.addTodo);
		},

		methods: {
			getCurPos: function(fn){
				$.getJSON('//freegeoip.net/json/?callback=?', function(data) {
					window.CURPOS = data;
					var coord = {lng: data.longitude, lat: data.latitude};
					fn && fn(coord);
				});
			},
		},
	};

	COMPONENTS.Sports = {
		data: function () {
			var d = {
				pageSize: CONSTANT.PAGESIZE,
				total: 0,
				sports: []
			};

			return d;
		},

		template: temp.sports,

		mounted: function(){
			this.fetchSports(0);
			
			tools.togglePageIE(this)
		},

		methods: {
			fetchSports: function(pageNum){
				tools.xhr('/sports', function(resData){
					this.sports = resData.datalist;
					this.total = resData.total;
				}.bind(this),'get',{
					pageNum: pageNum,
					pageSize: this.pageSize
				});
			},

			handlePageChange: function(i){
				this.fetchSports(i-1);
			},

		}
	};

	COMPONENTS.AlbumList = {
		props: ['sportId'],
		data: function () {
			var d = {
				albumList: [], 
				crumb: {}, 
				pageSize: CONSTANT.PAGESIZE,
				total: 0,
			};
			
			tools.xhr('/navInfo/1/' + this.sportId, function(resData){
				d.crumb = resData[0];
			});

			return d;
		},

		template: temp.albumList,

		methods: {
			fetchAlbumList: function(pageNum){
				// 某项运动下的所有专辑
				tools.xhr('/sports/' + this.sportId + '/albums', function(resData){
					this.albumList = resData.datalist;
					this.total = resData.total;
				}.bind(this),'get',{
					pageNum: pageNum,
					pageSize: this.pageSize
				});
			},

			handlePageChange: function(i){
				this.fetchAlbumList(i-1);
			}
		},

		mounted: function(){
			this.fetchAlbumList(0);

			tools.togglePageIE(this);
		},
	};

	COMPONENTS.Album = {
		props: ['albumId'],
		data: function () {
			let d = {
				albumVideoList: [], 
				crumb: {}, 
				tags:[],
				total: 0,
				pageSize: CONSTANT.PAGESIZE
			};

			tools.xhr('/navInfo/2/' + this.albumId, function(resData){
				d.crumb = resData[0];
			});

			tools.xhr('/albumTags/' + this.albumId, function(resData){
				d.tags = resData;
			});

			return d;
		},
		template: temp.album,
		methods: {
			fetchAlbumVideo: function(pageNum){
				tools.xhr('/albums/' + this.albumId + '/videos?sortBy=id&sort=desc', function(resData){
					this.albumVideoList = resData.datalist;
					this.total = resData.total;
				}.bind(this),'get',{
					pageNum: pageNum,
					pageSize: this.pageSize
				});
			},

			handlePageChange: function(i){
				this.fetchAlbumVideo(i-1);
			},

			dynamivePreview: function(e){
				$(e.target).attr('src', function(){
					// console.log(arguments);
					return arguments[1].replace('cover.jpg', 'd_cover.gif');
				});
			},

			staticPreview: function(e){
				$(e.target).attr('src', function(){
					return arguments[1].replace('d_cover.gif', 'cover.jpg');
				});
			},
		},

		mounted: function(){
			this.fetchAlbumVideo(0);

			tools.togglePageIE(this);
		},
	};

	COMPONENTS.Video = {
		props: ['videoId'],
		data: function () {
			let d = {
				video: null, 
				crumb: {}, 
				tags: [], 

				captureParams: {
					vId: this.videoId
				},
				previewerVisible: false,
				previewType: 1,// 1动态 2静态
				shortVideoLink: '', 
				shortVideoFullLink: '',
				screenshotLink: '',
				screenshotFullLink: '',
				shooting: false,

				like: 0, 
				likeLocking: false,
				newStarForm: {starName: '', visible: false},
				stars: [],
				checkList: [],
				selectedStars: [],
				starSectionVisible: false,
				loginUsrInfo: {},
				rmks:[],
				remarker: {
					visible: false,
					content: '',
					rules: {
						content: [
							{ required: true, message: '内容不能为空'},
						]
					}
				},
				remarkPlaySetting: {
					enable: true,
					all: true
				}
			};

			return d;
		},
		template: temp.video,
		mounted() {
			let t = this;

			this.fetchVideoInfo();

			this.fetchNavInfo();
			
			this.fetchVideoTags();
			
			this.bindSubtitle();

			tools.togglePageIE(this);

			window.vEle = document.querySelector('#video');

			if(window.loginUsrInfo){
				t.loginUsrInfo = window.loginUsrInfo;
				afterLogin();
			}else{
				t.$bus.on('update-login-info', function(info){
					t.loginUsrInfo = info;
					if(info.name){
						afterLogin();
					}
				});
			}

			function afterLogin (){
				t.queryVoteComment();
				t.queryStar(t.queryVideoStarsContainTheVideo);
				t.queryRemark(1);
			};
		},

		beforeDestroy() {
			this.$bus.off('update-login-info', this.addTodo);
		},

		methods: {
			fetchVideoInfo: function(){
				tools.xhr('/videos/' + this.videoId, function(resData){
					// console.log(resData)
					if(resData){
						this.video = resData;
						this.captureParams.ext = this.video.video_ext;
						
						let dayViewLeft = resData.dayViewLeft;
						if(dayViewLeft){
							if(dayViewLeft <= 5){
								this.$message({message: `当天剩余播放次数 ${resData.dayViewLeft || 0}次`, type: 'warning'});
							}
	
							this.bindVideo();
						}
					}else{
						this.$message({
							dangerouslyUseHTMLString: true,
							message: `当天剩余播放次数 0次，<br/>点击右上角注册或登录查看更多视频`, 
							type: 'warning'
						});
					}
	
				}.bind(this));
			},

			fetchNavInfo: function(){
				tools.xhr('/navInfo/3/' + this.videoId, function(resData){
					this.crumb = resData[0];
				}.bind(this));
			},

			fetchVideoTags: function(){
				tools.xhr('/videoTags/' + this.videoId, function(resData){
					this.tags = resData;
				}.bind(this));
			},

			bindVideo: function(){
				tools.insertScriptTag(1, "../lib/hls.js", {onload: function(){
					tools.insertScriptTag(2, FRAGMENTS.attachVideo(this.videoId), {id: 'hls-frag'});

					window.vEle.onended = function(){
						$('.subtitle').text('');
					}
				}.bind(this), id: 'hls'});
			},

			bindSubtitle: function(){
				tools.xhr('/srt/' + this.videoId, function(resData){
					if(!resData)
						return;
						
					let playerWrapper = $('#player-wrapper');

					tools.attachSubtile(window.vEle, resData, 500, function(subtitle){
						playerWrapper.find('.subtitle').text(subtitle)/* .css({

						}) */;
					});
				});
			},

			captureCountdown: function(){
				let _this = this;
				let captureBtn = $('#capture-btn');
				let counting = captureBtn.data('counting');

				if(!counting){
					captureBtn.data('counting', true);
					_this.captureParams.st = _this.getVideoTime();

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
						captureBtn.val('截取中 ' + t);

						if(t == 0){
							clearCountdown();
						}
					}, 1000)
				};

				function clearCountdown(){
					clearInterval(_this.intervalId);
					captureBtn.data('counting', false);
					captureBtn.val('截取小视频');
				}
			},

			capture: function(){
				this.captureParams.et = this.getVideoTime();
				
				if(this.captureParams.et <= this.captureParams.st){
					return;
				}

				this.shooting = true;
				
				tools.xhr('/shortVideoLink?' + $.param(this.captureParams), function(resData){
					this.shortVideoLink = resData;
					this.shortVideoFullLink = location.origin + this.shortVideoLink;
					this.shooting = false;
				}.bind(this), null, null, function(ret){ 
					this.shooting = false;
				}.bind(this));

				window.vEle.pause();
			},

			screenshot: function(){
				this.captureParams.st = this.getVideoTime();
				let params = Object.assign({}, this.captureParams);
				delete params.et;
				params.size = $(window.vEle).width() + 'x' + $(window.vEle).height();

				tools.xhr('/videoScreenshot?' + $.param(params), function(resData){
					this.screenshotLink = resData;
					this.screenshotFullLink = location.origin + this.screenshotLink;
				}.bind(this), null, null);

				window.vEle.pause();
			},

			// 点击分享时
			popShow: function(){
				tools.insertScriptTag(1, "../lib/qrcode.js", {onload: function(){
					if(this.shortVideoLink){
						
						var qrcode = new QRCode($('#qrcode-shoot').empty()[0], {
							text: this.shortVideoFullLink,
							width: 128,
							height: 128,
							colorDark : "#000000",
							colorLight : "#ffffff",
							correctLevel : QRCode.CorrectLevel.H
						});
					}

					// qrcode.clear(); // clear the code.
					// qrcode.makeCode("http://naver.com"); // make another code.
				}.bind(this), id: 'qrcode'});
				// tools.insertScriptTag(1, "../lib/clipboard.min.js", {onload: function(){
					// console.log(ClipboardJS, $('#copy-shoot-link-btn').length)
					// new ClipboardJS('#copy-shoot-link-btn');
				// }.bind(this), id: 'clipboard'});
			},

			copySuccess: function (){
				this.$message({
					message: '复制成功',
					type: 'success'
				});
			},

			remark: function(){
				tools.xhr(`/video/${this.videoId}/remark`, function(resData){
					this.$message({
						message: '标注成功',
						type: 'success'
					});
					
					window.vEle.play();
				}.bind(this), 'post', {remark: this.remarker.content, moment: this.getVideoTime()});
			},

			submitRemarkForm:function(){
				this.$refs['remarkerForm'].validate(function(valid){
					if (valid) {
						this.remarker.visible = false;
						this.remark();
					} else {
						return false;
					}
				}.bind(this));
			},

			getVideoTime: function(){
				return window.vEle.currentTime;
			},

			preview: function(){
				this.previewerVisible = true;
			},

			previewScreenshot: function(){

			},
			// ==需要重写==
			// 赞 贬
			// 新增 移出
			// 赞过 再贬 赞-1 贬+1

			// 用户 和 赞/贬 视频的对应关系  需要新建
			vote: function(type, e){
				if(this.likeLocking){
					return;
				}

				let t = this;

				// 投票状态 0 -1 1
				var voteStatus;
				var needClearOther = 0;

				collectVoteStatus();
				tools.xhr('/voteVideo', function(res){
					t.queryVoteComment();

					$('#support-btn em').text(res.support_time);
					$('#degrade-btn em').text(res.degrade_time);

					t.likeLocking = false;
				}, 'patch', {voteStatus: voteStatus, type: type, vId: this.videoId, needClearOther: needClearOther}, function(res){
					if(res.status == 401){
						this.$message.error('请登录后再操作');// todo 在公共部分处理
					}
					t.likeLocking = false;
				}.bind(this));

				function collectVoteStatus(){
					let cmt  = t.like;// 点击之前的like
					if(type == 1){// 点了“赞”
						if(cmt == 0){
							voteStatus = 1;
						}else if(cmt == 1){
							voteStatus = 0;
						}else if(cmt == -1){
							voteStatus = 1;
							needClearOther = 1;
						}
					}else if(type == -1){
						if(cmt == 0){
							voteStatus = -1;
						}else if(cmt == 1){
							voteStatus = -1;
							needClearOther = 1;
						}else if(cmt == -1){
							voteStatus = 0;
						}

					}
				}
			},

			queryVoteComment: function(){
				tools.xhr('/queryVoteComment/' + this.videoId, function(res){
					let like = res.comment || 0;
					// console.log(like);
					this.like = like;
				}.bind(this));
			},
			
			// 开场动画
			opening: function(e){
				var t = $(e.target);
				t.css({opacity: 0, transform: 'translate(-50%, -50%) scale(5)'});
				setTimeout(function(){
					t.hide()
				}, 700)
			},

			submitNewStarForm: function(formName){
				this.$refs[formName].validate(function(valid){
					if (valid) {
						this.newStar();
						this.newStarForm.visible = false;
					} else {
						console.log('error submit!!');
						return false;
					}
				}.bind(this));
			},

			queryStar: function(fn){
				tools.xhr('/vStars', function(res){
					this.stars = res;
					fn && fn();
				}.bind(this));
			},

			queryVideoStarsContainTheVideo: function(){
				tools.xhr('/videoStarsContainTheVideo/' + this.videoId, function(res){
					let selectedStars = [];// ['复选框1', '复选框2']
					res.forEach(function(item){
						selectedStars.push(item.name);
					});

					this.selectedStars = selectedStars;
				}.bind(this));
			},

			newStar: function(){
				tools.xhr('/star', function(res){
					this.$message({
						message: '收藏夹新建成功',
						type: 'success'
					});
					
					this.queryStar();

					// 创建之后 添加视频到收藏夹
					// todo 执行顺序也许有问题，必须在queryStar之后
					this.starVideo(res, this.queryVideoStarsContainTheVideo);
				}.bind(this), 'post', {name: this.newStarForm.starName});
			},

			starVideo: function(starId, fn){
				if(!starId)
					return;

				tools.xhr('/star/' + starId, function(res){
					if(!res)
						this.$message({
							message: '视频收藏成功',
							type: 'success'
						});

					fn && fn();
				}.bind(this), 'post', {vId: this.video.id});
			},

			toggleStar: function(e){
				// console.log(arguments);
				let sid = arguments[1];

				this.starVideo(sid);
			},

			diplayStarSection: function(){
				$('#star-section').show();
			},

			// 查询视频的“用户标记”
			// type 1 所有用户 2 自己
			queryRemark: function(type){
				let t =this;
				type || (type = 1);

				if(type == 1){
					if(this.allRemarks){
						return attachRemark(this.allRemarks);
					}
				}else if(type == 2){
					if(this.selfRemarks){
						return attachRemark(this.selfRemarks);
					}
				}

				tools.xhr(`/video/${this.videoId}/remarks?type=${type}`, function(res){
					if(type == 1){
						t.allRemarks = res;
					}else if(type == 2){
						t.selfRemarks = res;
					}

					attachRemark(res);
				});

				function attachRemark(data){
					tools.attachRemark(window.vEle, data, 500, function(rmks){
						t.rmks = rmks;
					});
				}
			},

			handleRemarkListBtns(cmd){
				let t = this;
				let o = {
					'close': function(){
						t.rmks = [];
						t.remarkPlaySetting.enable = false;
						clearInterval(window.remarkIntervalId);
					},
					'open': function(){
						let rmkType = t.remarkPlaySetting.all? 1: 2;
						t.queryRemark(rmkType);
						t.remarkPlaySetting.enable = true;
					},
					'showSelf': function(){
						clearInterval(window.remarkIntervalId);
						t.rmks = [];
						t.remarkPlaySetting.all = false;
						
						t.queryRemark(2);
					},
					'showAll': function(){
						clearInterval(window.remarkIntervalId);
						t.rmks = [];
						t.remarkPlaySetting.all = true;
						
						t.queryRemark(1);
					}
				};

				o[cmd] && o[cmd]();
			},
		}
	};

	COMPONENTS.searchedvideos = {
		data: function () {
			var d = {
				videos: [],
				total: 0,
				pageSize: CONSTANT.PAGESIZE
			};

			return d;
		},
		template: temp.searchedvideos,
		created() {
			
		},

		mounted(to, from, next) {
			this.fetchVideolist(0);
			tools.togglePageIE(this);
		},

		methods: {
			fetchVideolist: function(pageNum){
				let params = this.$route.query || {};
				params.pageSize = this.pageSize;
				params.pageNum = pageNum;

				tools.xhr('/videos', function(resData){
					this.videos = resData.datalist;
					this.total = resData.total;
				}.bind(this), 'get', params);
			},

			handlePageChange: function(index){
				this.fetchVideolist(index);
			}
		}
	};

	COMPONENTS.Datum = {
		data: function(){
			return {
				datumForm:{
					unstableDatum: {
						nickname: '',
						wechat: '',
						telephone: '',
						level : '',
						status: '1',
						avatar: '',
						sex: ''
					},
					rules: {
						nickname:[{required: true, message: '昵称不能为空'}],
						// wechat:[{required: true, message: '微信不能为空'}],
						telephone:[{required: true, message: '手机号不能为空'}, {validator: checkTel, trigger: 'blur'}],
						level:[{required: true, message: '水平不能为空'}],
						status:[{required: true, message: '状态不能为空'}],
						avatar: [{required: true, message: '头像必填'}],
						sex: [{required: true, message: '性别必填'}]
					},
					editable: false
				},

				usrDatum: {},// 真实信息
		
				// 目前只考虑网球
				levels: ['1.0','1.5','2.0','2.5','3.0','3.5','4.0','4.5','5.0','5.5','6.0','7.0'],

				sexes: [{
					id: 1,
					name: '男'
				}, {
					id: 2,
					name: '女'
				}],

				statuses: [{
					id: '1',
					name: '接受对战'
				},{
					id: '2',
					name: '修整中',
				}]
			}

			function checkTel(rule, value, callback) {
				let telReg = /^[1][3,4,5,7,8][0-9]{9}$/;
				if(telReg.test($.trim(value))){
					callback();
				}else{
					return callback(new Error('请输入正在使用的11位手机号码'));
				}
			};
		},

		methods: {
			fetchUsrDatum: function(){
				tools.xhr('/usrDatum', function(res){
					this.usrDatum.nickname = this.datumForm.unstableDatum.nickname = res.nickname;
					this.usrDatum.wechat = this.datumForm.unstableDatum.wechat = res.wechat;
					this.usrDatum.telephone = this.datumForm.unstableDatum.telephone = res.tel;
					this.usrDatum.level = this.datumForm.unstableDatum.level = res.level;
					this.usrDatum.status = this.datumForm.unstableDatum.status = res.status;
					this.usrDatum.avatar = this.datumForm.unstableDatum.avatar = res.avatar;
					this.usrDatum.sex = this.datumForm.unstableDatum.sex = res.sex;
					// console.log(this.usrDatum);
				}.bind(this));
			},

			submitForm: function(formName){
				this.$refs[formName].validate(function(valid){
					if (valid) {
						this.updateUsrDatum();
					} else {
						console.log('error submit!!');
						return false;
					}
				}.bind(this));
			},

			updateUsrDatum: function(){
				tools.xhr('/usrDatum', function(res){
					this.$message({
						message: '资料更新成功',
						type: 'success'
					})

					this.fetchUsrDatum();
					this.datumForm.editable = false;
				}.bind(this), 'patch', this.datumForm.unstableDatum, function(res){
					if(res.status == 401){
					}
				}.bind(this));
			},

			cancelUpdateUsrDatum: function(){
				this.datumForm.unstableDatum.nickname = this.usrDatum.nickname;
				this.datumForm.unstableDatum.wechat = this.usrDatum.wechat;
				this.datumForm.unstableDatum.telephone = this.usrDatum.telephone;
				this.datumForm.unstableDatum.level = this.usrDatum.level;
				this.datumForm.unstableDatum.status = this.usrDatum.status;
				this.datumForm.unstableDatum.avatar = this.usrDatum.avatar;
				this.datumForm.unstableDatum.sex = this.usrDatum.sex;

				$('.default-avatar-list img').removeClass('selected');
			},

			showLevelTip: function(){

			},

			handleUploadSuccess: function(res){
				// console.log(this.datumForm, res.relPath);
				this.datumForm.unstableDatum.avatar = res.relPath;
			},

			selectDefaultAvatar: function(e){
				var t = $(e.target);
				this.datumForm.unstableDatum.avatar = this.datumForm.avatar = t.attr('src');
				t.addClass('selected').siblings().removeClass('selected')
			},
		},

		template: temp.datum,

		mounted: function(){
			this.fetchUsrDatum();
			tools.togglePageIE(this);
		}
	};

	COMPONENTS.VoteNext = {
		data: function () {
			var d = {
				sports: [],
				skills: [],
				athletes: []
			};
			d.voteNextForm = {
				sport: '',
				skill: '',
				athlete: ''
			};

			this.querySports();

			let voteNextFormRules = {
				sport: [
					{ required: true, message: '请选择运动项目',  },
				],
				skill: [
					{ required: true, message: '请选择技能',  },
				],
				athlete: [
					{ required: true, message: '请选择运动员',  },
				],
			}

			d.voteNextFormRules = voteNextFormRules;

			// 图标配置
			d.chartInstance = null;
			d.skillData = [[], []];
			d.playerData = [[], []];
			d.chartColors = {
				red: 'rgb(255, 99, 132)',
				orange: 'rgb(255, 159, 64)',
				yellow: 'rgb(255, 205, 86)',
				green: 'rgb(75, 192, 192)',
				blue: 'rgb(54, 162, 235)',
				purple: 'rgb(153, 102, 255)',
				grey: 'rgb(201, 203, 207)'
			};
			d.config = {
				type: 'line',
				data: {
					labels: ["1", "2", "3", "4", "5", "6"],// 前3名
					datasets: [
						{
							label: '技术',
							data: {},
							backgroundColor: d.chartColors.green,
							borderColor: d.chartColors.green,
							borderWidth: 1,
							fill: false
						},
						{
							label: '运动员',
							data: {},
							backgroundColor: d.chartColors.blue,
							borderColor: d.chartColors.blue,
							borderWidth: 1,
							fill: false
						}
					],
				},
				options: {
					responsive: true,
					title:{
						display:true,
						text:'网球投票结果'
					},
					tooltips: {
						mode: 'nearest',
						intersect: false,
						callbacks: {
							title: function(tooltipItems, data){// point, line
								var poll = tooltipItems[0].yLabel;
								return '票数：'+poll;
							},
							label: function(){return ''},
							footer: function(tooltipItems, data) {
								var s = '';
		
								var tooltipItem = tooltipItems[0];
								var datasetIndex = tooltipItem.datasetIndex,
									itemIndex = tooltipItem.index;

								if(datasetIndex == 1){
									s = this.playerData[0][itemIndex];
								}else if(datasetIndex == 0){
									s = this.skillData[0][itemIndex];
								}

								return s;
							}.bind(this),

							afterFooter: function(tooltipItems, data) {
								var s = '';
		
								var tooltipItem = tooltipItems[0];
								var datasetIndex = tooltipItem.datasetIndex,
									itemIndex = tooltipItem.index;

								if(this.playerData[1][itemIndex] == this.skillData[1][itemIndex]){
									s = this.playerData[0][itemIndex];
									return s;
								}
							}.bind(this),
						},
						footerFontStyle: 'normal'
					},

					// hover: {
					// 	mode: 'nearest',
					// 	intersect: false
					// },
					scales: {
						xAxes: [{
							display: true,
							scaleLabel: {
								display: true,
								labelString: '排名'
							}
						}],
						yAxes: [{
							display: true,
							scaleLabel: {
								display: true,
								labelString: '票数'
							}
						}]
					}
				}
			};

			return d;
		},

		methods:{
			querySports(){
				tools.xhr('/sports', function(resData){
					this.sports = resData;
					this.voteNextForm.sport = this.sports[0].id
				}.bind(this));
			},

			querySKills(){
				tools.xhr('/skills/'+this.voteNextForm.sport, function(resData){
					this.skills = resData;
				}.bind(this));
			},

			queryAthletes(){
				tools.xhr('/athletes/'+this.voteNextForm.sport, function(resData){
					this.athletes = resData;
				}.bind(this));
			},

			submitForm: function(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						tools.xhr('/voteNext', function(resData){
							this.fetchVoteResult();
							this.$message({
								message: '感谢您的投票',
								type: 'success'
							});
						}.bind(this), 'post', this.voteNextForm, function(res){
							let statusCode = res.status;
							if(statusCode == 401){
								$('#header-btn-login').trigger('click')
							}else if(statusCode == 402){
								this.$message({
									message: '请隔天再投',
									type: 'warning'
								});
							}
						}.bind(this));
					} else {
						return false;
					}
				});
			},
			
			resetForm: function(formName) {
				this.$refs[formName].resetFields();
				this.voteNextForm = {
					sport: '',
					skill: '',
					athlete: ''
				};
			},

			fetchVoteResult: function(){
				tools.xhr('/videoVoteResult', function(resData){
					// this.resetForm('form');
					this.updateChart(resData);
				}.bind(this));
			},

			updateChart: function(data){
				// $('#chart-container').html('<canvas id="myChart"></canvas>');

				// 重新new chart，替换canvas
				var $chart = $('#myChart');
				var ctx = $chart[0].getContext('2d');

				var skillData = this.skillData = processData(data['skill']);
				var playerData = this.playerData = processData(data['athlete']);

				this.config.data.datasets[0].data = skillData[1];
				this.config.data.datasets[1].data = playerData[1];
				// Chart.defaults.global.defaultFontColor = 'red';
				Chart.defaults.global.defaultFontSize = 24;
				Chart.defaults.global.defaultFontStyle = 'bold';
				

				if(!this.chartInstance){
					this.chartInstance = new Chart(ctx, this.config);
				}else{
					this.chartInstance.update();
				}

				// [{tag: 1, count: 2}]
				// ['skill-1', 'skill-2'] 和 [1, 2]
				// ['athlete-1', 'athlete-2'] 和 [1, 2]
				function processData(data){
					var ary = [[], []];
					data.forEach(function(item){
						if(item['tag']){
							ary[0].push(item['tag']);
							ary[1].push(item['count']);
						}
					});

					return ary;
				}
			}
		},

		mounted: function(){
			tools.insertScriptTag(1, "../lib/Chart.js", {onload: function(){
			}.bind(this), id: 'chartjs'});

			tools.togglePageIE(this);
		},

		watch: {
			// 运动更新后 更新技术、运动员
			'voteNextForm.sport': function(n, o){
				let sportId = n;
				let type = typeof sportId;

				if(sportId){
					if(type == 'number'){// 选择运动
						this.querySKills(sportId);
						this.queryAthletes(sportId);
					}
				}
			}
		},

		template: temp.voteNext,
	};

	COMPONENTS.Feedback = {
		data: function () {
			var d = {files: [], fileList: []};
			d.form = {
				desc: '',
				site: '',
				wechat: '',
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
			submitForm: function(formName) {
				this.$refs[formName].validate((valid) => {
					let d = Object.assign({}, this.form);
					d.files = this.files.join(',');

					if (valid) {
						tools.xhr('/feedback', function(resData){
							// this.resetForm('form');
							this.$message({
								message: '感谢您的反馈',
								type: 'success'
							});
						}.bind(this), 'post', d);
					} else {
						return false;
					}
				});
			},
			resetForm: function(formName) {
				this.$refs[formName].resetFields();
				this.files = [];
				this.fileList = [];
			},
			handleRemove: function(file, fileList) {
				this.files = [];
				// 从fileList从提取files
				fileList.forEach(function(f){
					let relPath = f.response.relPath;
					this.files.push(relPath);
				}.bind(this));
			},
			handleExceed: function(files, fileList) {
				this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
			},
			handleSuccess: function(res, file){
				this.files.push(res.relPath);
				// d.filePath = res.relPath;
			},

			// handleAvatarSuccess(res, file) {
			// 	this.imageUrl = URL.createObjectURL(file.raw);
			// },

			beforeAvatarUpload: function(file){
				console.log(file.type);

				const isJPG = file.type === 'image/jpeg';
				const isPNG = file.type === 'image/png';
				const isLt2M = file.size / 1024 / 1024 < 2;

				if (!isJPG && !isPNG) {
					this.$message.error('上传头像图片只能是jpg或png格式!');
					return false;
				}
				if (!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!');
					return false;
				}
				return true;
			},

			goback: function(){
				history.back();
			}
		},

		template: temp.feedback,

		mounted: function(){
			tools.togglePageIE(this);
		}
	};

	COMPONENTS.About = {
		data: function () {
			var d = {};
			return d;
		},

		methods:{
			
		},

		template: temp.about,

		mounted: function(){
			tools.togglePageIE(this);
		}
	};

	COMPONENTS.EmailConfirm = {
		data: function () {
			var d = {};

			this.sendConfirmData();

			return d;
		},

		methods:{
			sendConfirmData: function(){
				tools.xhr('/emailConfirm' + location.search, function(resData){
					this.$alert('账号已激活', '提示', {
						confirmButtonText: '确定',
						callback: function(){
							setTimeout(function(){
								location.href = location.origin + '/#/';
							}, 1000);
						}
					});

				}.bind(this), '', {}, function(){
					// 重新激活
					// location.href = location.origin + '/#/';
				});
			}
		},

		template: temp.emailConfirm,

		mounted: function(){
			tools.togglePageIE(this);
		}
	}

	COMPONENTS.Stars = {
		data: function () {
			var d = {
				vStars: [],
				shotVideos: [],
				starTotal: 0,
				videoTotal: 0,
				pageSize: CONSTANT.PAGESIZE
			};

			return d;
		},

		template: temp.stars,

		mounted: function(){
			this.fetchVideoStar(0);
			this.fetchShootVideo(0);
			tools.togglePageIE(this);
		},

		methods: {
			fetchVideoStar: function(pageNum){
				tools.xhr('/vStars', function(resData){
					this.vStars = resData.datalist;
					this.starTotal = resData.total;
				}.bind(this),'get',{
					pageNum: pageNum,
					pageSize: this.pageSize
				});
			},

			fetchShootVideo: function(pageNum){
				tools.xhr('/usrShotVideos', function(resData){
					this.shotVideos = resData.datalist;
					this.videoTotal = resData.total;
				}.bind(this),'get',{
					pageNum: pageNum,
					pageSize: this.pageSize
				});
			},

			handleVideoStarPageChange: function(i){
				this.fetchVideoStar(i-1);
			},

			handleShootVideoPageChange: function(i){
				this.fetchShootVideo(i-1);
			},
		},
	};

	COMPONENTS.Vstar = {
		props: ['vStarId'],
		data: function () {
			var d = {
				starVideos: [],
				total: 0,
				pageSize: CONSTANT.PAGESIZE
			};

			// tools.xhr('/starVideo/' + this.vStarId, function(resData){
			// 	d.starVideos = resData;
			// });

			return d;
		},

		template: temp.vStar,

		mounted: function(){
			this.fetchStarVideo(0);
			tools.togglePageIE(this);
		},

		methods: {
			fetchStarVideo: function(pageNum){
				tools.xhr('/starVideo/' + this.vStarId, function(resData){
					this.starVideos = resData.datalist;
					this.total = resData.total;
				}.bind(this),'get',{
					pageNum: pageNum,
					pageSize: this.pageSize
				});
			},

			handlePageChange: function(i){
				this.fetchStarVideo(i-1);
			},

			dynamivePreview: function(e){

				$(e.target).attr('src', function(){
					// console.log(arguments);
					return arguments[1].replace('cover.jpg', 'd_cover.gif');
				});
				
			},

			staticPreview: function(e){

				$(e.target).attr('src', function(){
					return arguments[1].replace('d_cover.gif', 'cover.jpg');
				});
				
			},
		}
	};

	COMPONENTS.UsrVshoots = {
		data: function () {
			// console.log(this.$route.query.vId)
			var d = {
				dynamicShoots: [],
				dynamicTotal: 0,
				staticShoots: [],
				staticTotal: 0,
				pageSize: CONSTANT.PAGESIZE
			};

			return d;
		},

		template: temp.usrVshoots,

		methods: {
			fetchVideoShoot: function(pageNum, type){
				tools.xhr('/usrVshoot?vId=' + this.$route.query.vId, function(resData){
					if(type == 1){
						this.dynamicShoots = resData.datalist;
						this.dynamicTotal = resData.total;
					}else if(type == 2){
						this.staticShoots = resData.datalist;
						this.staticTotal = resData.total;
					}
				}.bind(this),'get',{
					pageNum: pageNum,
					pageSize: this.pageSize,
					type: type
				});
			},

			toggleShow: function(t, screenshot, status){
				let ext = ['gif', 'jpg'][status-1];
				t.src = `/multimedia/gif/${screenshot}.${ext}`
			},

			handleDynamicPageChange: function(i){
				this.fetchVideoShoot(i-1, 1);
			},

			handleStaticPageChange: function(i){
				this.fetchVideoShoot(i-1, 2);
			},
		},

		mounted: function(){
			this.fetchVideoShoot(0, 1);
			this.fetchVideoShoot(0, 2);

			tools.togglePageIE(this);
		}
	}

	COMPONENTS.Compete = {
		data: function () {
			var d = {
				MAPINDEX: 1000,
				options: [
					{label: '赢', value: 1},
					{label: '输', value: 2},
					{label: '胜负未分', value: 3},
				],
				matchResult: 3,
				matchPanelVisible: false,
				matchResultdialogVisible: false,
				defenseDialogVisible: false,
				evaluateDialogVisible: false,
				grade: 1,// 赛后评价 1 顶 2 贬
				evaluateDetail: '',

				matches: window.matches || [],
				match: {},
				usrDatumIntegrity: 0
			};

			return d;
		},

		template: temp.compete,

		methods: {
			fetchRelatedMatches: function (){
				tools.xhr('/relatedMatches', function(res){
					this.matches = res;
					window.matches = Object.assign([], res);
				}.bind(this));
			},

			// 发起比赛
			foundMatch: function(defenseId){
				if(!this.usrDatumIntegrity){
					return;
				}

				const t = this;

				if(t.matches.length >= 1){
					t.$message({
						message: '请先关闭之前的比赛',
						type: 'warning'
					});
				}else{
					t.$confirm('确定发起挑战？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(function(){
						tools.xhr('/match', function(res){
							t.fetchRelatedMatches();
							t.$message({
								message: '比赛发起成功',
								type: 'success',
								// duration: 0
							});
							refreshMapPlayer();
						}, 'post', {
							defenseId: defenseId,
						});
					}).catch(function(){
						
					});
				}
			},

			// 接受比赛
			responseChallenge: function(responseResult){
				if(!this.usrDatumIntegrity){
					return;
				}

				tools.xhr('/match', function(res){
					this.fetchRelatedMatches();

					this.$message({
						message: '操作成功',
						type: 'success',
					});

					refreshMapPlayer();

					responseResult == 2 && this.$bus.emit('update-inmails');
					
				}.bind(this), 'patch', {
					matchId: this.match.id,
					response: responseResult
				});
			},

			// 接收比赛
			defense: function(){
				this.defenseDialogVisible = false;
				this.responseChallenge(2);
			},

			// 拒绝比赛
			refuseCompete: function(){
				this.defenseDialogVisible = false;
				this.responseChallenge(3);
			},

			// 确认比赛结果
			confirmMathcResult: function(){
				this.$confirm('比赛结果无误？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					// type: 'warning'
				}).then(function(){
					this.matchResultdialogVisible = false;
					this.markMatchResult();
				}.bind(this)).catch(function(){
				});
			},

			// 记录比赛结果
			markMatchResult: function(){
				tools.xhr('/matchResult', function(data){
					this.fetchRelatedMatches();
				
					this.$message({
						message: '记录成功',
						type: 'success',
						onClose: function(){
							this.evaluateDialogVisible = true;
						}.bind(this)
					});

					// 双方已评 '1'
					data && refreshMapPlayer();

					this.resetMatchPanel();
				}.bind(this), 'patch', {
					matchId: this.match.id,
					result: this.matchResult,
				}, function(res){
					// console.log(res);
					if(res.status == 399){
						this.$message({
							message: '一天后才可以提交比赛结果',
							type: 'warning'
						});
					}else if(res.status == 398){
						let opponentRes = '';
						this.options.forEach(function(){
							if(arguments[0].value == res.data){
								opponentRes = arguments[0].label;
							}
						});

						this.$confirm(`对方记录的比赛结果是“${opponentRes}”,结果有误?`, '提示', {
							confirmButtonText: '将对方加入黑名单',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(function(){
							this.$confirm('确认加黑名单', '提示', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								type: 'warning'
							}).then(function(){
								this.addToCompetitionBlackList();
								this.resetMatchPanel();
							}.bind(this));
						}.bind(this)).catch(function(){
							// this.evaluateDialogVisible = true;
						}.bind(this));
					}
				}.bind(this));
			},

			addToCompetitionBlackList: function(){
				tools.xhr('/competeBlack', function(){
					this.fetchRelatedMatches();
					this.$message({
						message: '加黑名单成功',
						type: 'success',
						onClose: function(){
							this.evaluateDialogVisible = true;
						}.bind(this)
					});
				}.bind(this), 'post', {
					matchId: this.match.id
				});
			},

			evaluate: function(){
				tools.xhr('/competeEvaluate', function(){
					this.evaluateDialogVisible = false;
					this.grade = 1;
					this.evaluateDetail = '';

					this.$message({
						message: '评价成功',
						type: 'success',
					});
				}.bind(this), 'post', {
					matchId: this.match.id,
					evaluateResult: this.grade,
					evaluateDetail: this.evaluateDetail
				});
			},

			showMatchDetail: function(match, index){
				this.match = match;
				console.log(match);
				
				if(match.stage == 1){
					if(match.defensive){
						this.defenseDialogVisible = true;
					}else{
						this.$message({
							message: '等待对方应战',
							type: 'info'
						});
					}

					this.resetMatchPanel();
				}else if(match.stage == 2){
					this.matchPanelVisible = true;
				}
			},

			// 检测用户资料是否完善
			checkUsrDatumIntegrity: function(){
				tools.xhr('/usrDatumIntegrity', function(res){
					this.usrDatumIntegrity = res;
					if(!res){
						this.$confirm('请完善资料', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(function(){
							location.href="#/datum";
						}).catch(function(){
							location.href="#/datum";
						});
					}
				}.bind(this));
			},

			resetMatchPanel: function(){
				this.matchPanelVisible = false;// 默认隐藏
				this.matchResult = 3;// 默认“平”
			}
		},

		mounted: function(){
			tools.togglePageIE(this);

			$('#map-script').remove();
			tools.insertScriptTag(1, '../js/map.js', {onload: function(){
				var mapConstainer = $('.map-container');

				mapConstainer.find('.close-btn').one('click', function(){
					// mapConstainer.hide();
					this.$router.go(-1);
				}.bind(this));
			}.bind(this), id: 'map-script'});

			this.fetchRelatedMatches();

			window.foundMatch = this.foundMatch;
		},

		created: function(){
			this.checkUsrDatumIntegrity();
		}
	},

	COMPONENTS.Translator = {
		props: ['videoId'],
		data: function () {
			var d = {
				captions: [],
				formatMS: tools.formatMS

			};

			return d;
		},

		template: temp.translator,

		methods: {
			fetchRelatedMatches: function (){
				tools.xhr('/relatedMatches', function(res){
					this.matches = res;
					window.matches = Object.assign([], res);
				}.bind(this));
			},

			bindVideo: function(){
				tools.insertScriptTag(1, "../lib/hls.js", {onload: function(){
					tools.insertScriptTag(2, FRAGMENTS.attachVideo(this.videoId), {id: 'hls-frag'});

					this.vEle.onended = function(){
						$('.subtitle').text('');
					}

					this.vEle.onload = function(){
						this.duration = this.vEle.duration;
					}
				}.bind(this), id: 'hls'});
			},

			bindSubtitle: function(){
				tools.xhr('/srt/' + this.videoId, function(resData){
					if(!resData)
						return;
						
					let playerWrapper = $('#player-wrapper');

					tools.attachSubtile(this.vEle, resData, 500, function(subtitle){
						playerWrapper.find('.subtitle').text(subtitle)/* .css({

						}) */;
					});

					this.listCaptions(resData);
				}.bind(this));
			},

			listCaptions: function(captions){
				this.captions = captions;
			},

		},

		mounted: function(){
			let t = this.vEle = $('video')[0];
			let timeLineLength = 1000;

			tools.togglePageIE(this);
			this.bindVideo();
			this.bindSubtitle();

			$('#timeline').on("scroll", function(){
				let duration = t.duration;
				if(duration){
					let sl = $(this).scrollLeft();
					t.currentTime = (sl/timeLineLength * duration)/* .toFixed(1) */;
				}
			})

			$('#line-editor').on('click', '.caption-line', function(){
				if($(this).is('.selected')){
					return;
				}
				$(this).addClass('selected focused').siblings().removeClass('selected focused');
				$(this).find('.caption-ipt .el-textarea__inner').focus();

				let caption = $(this).data('caption');

				let st = caption.startTime;
				t.currentTime = st/1000;
			}).on('blur', '.caption-ipt .el-textarea__inner', function(){
				$(this).parents('.caption-line').removeClass('focused');
			}).on('click', '.caption-text', function(){
				$(this).parents('.caption-line').addClass('focused');
				$(this).siblings('.caption-ipt').find('.el-textarea__inner').focus();
			}).on('click', '.line-start-time', function(){

			}).on('click', '.line-end-time', function(){
				
			})
		}
	}

	window.COMPONENTS = COMPONENTS;
}