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
				inmails: [],
				usrPosts: []
			}
		},

		methods: {
			search: function(e) {
				
				let t = this;
				let name = $.trim(this.searchForm.name);
				if(!name)
					return;

				this.$refs['searchForm'].validate((valid) => {
					if (valid) {
						this.$router.push({ path: '/searchedVideos', query: { headline: this.searchForm.name}})
					}
				});

				e && e.preventDefault();
			},

			focus(e){
				const t = e.target;
				$(t.parentNode).css({
					width: '100%',
					opacity: 1
				})
			},

			blur(e){
				const t = e.target;
				$(t.parentNode).css({
					width: '200px',
					opacity: .6
				})
			},

			resetForm: function(formName) {
				this.$refs[formName].resetFields();
			},

			handleUsrBtns: function(index){
				let o = {
					'login': this.handlerLogin,
					'regist': this.handlerRegist,
					'datum': ()=>{
						this.$router.push({name: 'datum'})
					},
					'logout': this.handlerLogout
				};

				o[index] && o[index]();
			},

			handlerLogin: function(){
				this.loginForm.visible = true;

				let t =  this;

				// 回车登录
				setTimeout(function(){
					$('#last-login-iput').off('keyup.login').on('keyup.login', function(e){
						var keyCode = e.keyCode;
						if(keyCode == 13){
							t.login();
						}
					});
				}, 500)

				// 获取当前位置信息
				// 给竞赛页添加脚本
				tools.insertScriptTag(1, CONSTANT.BAIDUMAPAPI, {id: 'map-api'});

				var intervalId = setInterval(()=>{
					if(window.BMap && window.BMap.Map){
						clearInterval(intervalId);

						try{
							t.getCurPos();
						}catch(e){
			
						}
					}
				}, 100)

				tools.insertScriptTag(1, '../lib/md5.js', 'md5');
			},

			handlerRegist: function(){
				this.registForm.visible = true;

				// tools.insertScriptTag(1, "../lib/captcha.js", {onload: function(){
				// 	tools.insertScriptTag(2, FRAGMENTS.captcha, {id: 'captcha-frag'});
				// }.bind(this), id: 'captcha'});

				tools.insertScriptTag(1, '../lib/md5.js', 'md5');
			},

			handlerLogout: function(){
				this.logoutForm.visible=true;
			},

			login: function(){
				let trim = $.trim;
				
				tools.xhr('/login', function(){
					location.reload();
				}.bind(this), 'post', {
					name: trim(this.loginForm.name),
					psw: md5(trim(this.loginForm.psw)),
					city: window.CURPOS? window.CURPOS.city: '',
					coords: window.CURPOS? window.CURPOS.lng + ',' + window.CURPOS.lat: ''
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
						// console.log('error submit!!');
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

						t.$confirm(`确认重置密码?`, '注意', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
						}).then(()=>{
							tools.xhr('/retrievePswEmail', function(res){
								t.$message({
									type: 'info',
									message: res
								});

							}, 'patch', {
								usrname: name
							}, function(){
								t.$message({
									type: 'warning',
									message: `密码重置邮件发送失败`
								});
							});
						}).catch(()=>{
							
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
						location.href = location.origin;
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

				this.$confirm(`确认将密码修改为${t.resetPswForm.npsw}?`, '注意', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(()=>{
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
				}).catch(()=>{

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
					this.loginUsrInfo = loginUsrInfo || {};
					window.loginUsrInfo = loginUsrInfo;

					let name = loginUsrInfo.name;
					$('#header .el-icon-view').attr('title', name).addClass('usr');

					this.$bus.emit('update-login-info', this.loginUsrInfo);

					name && this.fetchInmails();

					(this.loginUsrInfo.is_admin == 1) && !this.$route.path.match(/translator\/\d+$/) && this.fetchUsrPost();
				}.bind(this));
			},

			fetchInmails: function(){
				tools.xhr('/inmails', function(data){
					this.inmails = data;
				}.bind(this));
			},

			fetchUsrPost: function(){
				tools.xhr('/usrPosts', function(data){
					this.usrPosts = data;

					this.usrPosts.forEach((post, index) => {
						setTimeout(()=>{
							let	videoId = post.video_id, 
								usrId = post.usr_id,
								videoUrl = '/translator/' + videoId + '?draftId=' + usrId;

							let notify = this.$notify({
								title: `usr: ${usrId}, video: ${videoId}`,
								message: `<a class="post-detail-btn" target="_blank" href="${videoUrl}">查看</a>`,
								duration: 0,
								dangerouslyUseHTMLString: true,
								showClose: false
							});

							$(notify.dom).find('.post-detail-btn').on('click', function(){
								markUsrPostReader(post.id, this.href, notify);
								return false;
							})
						}, index * 1000)
					})

					function markUsrPostReader(id, href, notify){
						tools.xhr('/usrPostReader', ()=>{
							window.open(href);
							notify.close();
						}, 'patch', {
							postId: id
						});
					}
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

			},

			getCurPos: function(){
				let t = this;
				// 检查localstorage
				let localPos = localStorage.getItem('localPos')
				if(localPos){
					localPos = JSON.parse(localStorage.getItem('localPos'));
					let storageTime = localPos.storageTime;
					const day = 1 * 24 * 60 * 60 * 1000;

					if(Date.now() - storageTime < day){
						window.CURPOS = localPos;
						// console.log(window.CURPOS)
					}else{
						requestCoords()
					}
				}else{
					requestCoords()
				}

				function requestCoords(){
					var geolocation = new BMap.Geolocation();
					geolocation.getCurrentPosition(function(r){
						if(this.getStatus() == BMAP_STATUS_SUCCESS){
							console.log(r)
							window.CURPOS = Object.assign({}, r.point)
							window.CURPOS.storageTime = Date.now();
							window.CURPOS.city = r.address.city;
							localStorage.setItem('localPos', JSON.stringify(window.CURPOS));
						}
						else {
							alert('failed'+this.getStatus());
						}        
					},{enableHighAccuracy: true})
				}
			},
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
			
		},

		beforeDestroy: function() {
			this.$bus.off('update-login-info', this.addTodo);
		},

		methods: {
			
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
			
			tools.togglePageIE(this)

			this.fetchSports(0);
		},

		watch: {
			'$route.query.pageNum': function (pageNum) {
				this.fetchSports(pageNum? pageNum - 1 : 0);
			}
		},

		methods: {
			fetchSports: function(pageNum){
				tools.xhr('/sports', function(res){
					this.sports = res.datalist;
					this.total = res.total;
				}.bind(this),'get',{
					pageNum: pageNum,
					pageSize: this.pageSize
				});
			},

			handlePageChange: function(i){
				this.$router.push({path: `/sports`, query: {pageNum: i}});
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
			
			tools.xhr('/navInfo/1/' + this.sportId, function(res){
				d.crumb = res[0];
			});

			return d;
		},

		template: temp.albumList,

		methods: {
			fetchAlbumList: function(pageNum){
				// 某项运动下的所有专辑
				tools.xhr('/sports/' + this.sportId + '/albums', function(res){
					this.albumList = res.datalist;
					this.total = res.total;
				}.bind(this),'get',{
					pageNum: pageNum,
					pageSize: this.pageSize,
					sortBy: 'id',
					sortOrd: 'desc'
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
				headline: '',
				albumVideoList: [], 
				crumb: {}, 
				tags:[],
				total: 0,
				pageSize: CONSTANT.PAGESIZE,
				curPage: 1,// 1 第一页
				sortBy: 'id',
				sortOrd: 'desc',
				sortorConfig: [{
					name: '默认',
					value: 'id',
				},{
					name: '已翻译',
					value: 'translated',
				},{
					name: '播放数',
					value: 'impression',
				},{
					name: '点赞数',
					value: 'support_time',
				},{
					name: '更新时间',
					value: 'update_time',
				}]
			};

			tools.xhr('/navInfo/2/' + this.albumId, function(res){
				d.crumb = res[0];
			});

			tools.xhr('/albumTags/' + this.albumId, function(res){
				d.tags = res;
			});

			d.sortorConfig.callback = function(){
				this.curPage = 1;
				this.fetchAlbumVideo();
			}.bind(this)
			d.sortorConfig.parentData = d;

			return d;
		},
		template: temp.album,
		methods: {
			fetchAlbumVideo: function(){
				let api = '/albums/' + this.albumId + '/videos';
				var page = this.curPage;
				let req = {
					pageNum: page - 1,
					pageSize: this.pageSize,
					hidden: 0,
					sortBy: this.sortBy,
					sortOrd: this.sortOrd,
					
				};

				if(this.headline){
					req.headline = this.headline;
				}

				return tools.xhr(api, function(res){
					this.albumVideoList = res.datalist;
					
					this.total = res.total;

					var routeQueryObj = {page: page};
					routeQueryObj.headline = this.headline || undefined;
					routeQueryObj.sortBy = this.sortBy;
					routeQueryObj.sortOrd = this.sortOrd;
					this.$router.replace({ path: this.$route.path, query: routeQueryObj})

					this.curPage = page;// ?需要重新赋值一次 todo
				}.bind(this),'get', req);
			},

			handlePageChange: function(i){
				this.curPage = i;
				this.fetchAlbumVideo();
			},

			dynamivePreview: function(e){
				$(e.target).attr('src', function(){
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
			let routeQuery = this.$route.query;
			this.curPage = Number(routeQuery.page) || 1;
			routeQuery.headline && (this.headline = routeQuery.headline);
			routeQuery.sortBy && (this.sortBy = routeQuery.sortBy);
			routeQuery.sortOrd && (this.sortOrd = routeQuery.sortOrd);

			$('.sortor-wrapper button[data-by=' + this.sortBy + ']').addClass('active el-button--primary')
				.children('.fa').addClass(this.sortOrd == 'desc'? 'fa-chevron-down': 'fa-chevron-up')

			this.fetchAlbumVideo();
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
				},
				isMobile: window.isMobile,
				clipboardLoaded: false
			};

			return d;
		},
		template: temp.video,
		mounted() {
			let t = this;

			this.fetchVideoInfo();

			this.fetchNavInfo();
			
			this.fetchVideoTags();
			
			this.xSubtitle();

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

			$('#aside-controller').off('click').on('click', function(){
				var rootContainer = $('#root-container');
				rootContainer.toggleClass('brief')
				rootContainer.toggleClass('mobile-structure');

				rootContainer.find('#aside-controller .fa').toggleClass('fa-chevron-left fa-chevron-right')
			});
		},

		beforeDestroy() {
			this.$bus.off('update-login-info', this.addTodo);
		},

		methods: {
			fetchVideoInfo: function(){
				tools.xhr('/videos/' + this.videoId, function(res){
					// console.log(res)
					if(res){
						this.video = res;
						this.captureParams.ext = this.video.video_ext;
						
						let dayViewLeft = res.dayViewLeft;
						if(dayViewLeft){
							if(dayViewLeft <= 5){
								this.$message({message: `当天剩余播放次数 ${res.dayViewLeft || 0}次，点击右上角图标注册或登录查看更多视频`, type: 'warning'});
							}
	
							this.bindVideo();
						}
					}else{
						this.$message({
							dangerouslyUseHTMLString: true,
							message: `当天剩余播放次数 0次，<br/>点击右上角注册或登录查看更多视频，点击右上角图标注册或登录查看更多视频`, 
							type: 'warning'
						});
					}
	
				}.bind(this));
			},

			fetchNavInfo: function(){
				tools.xhr('/navInfo/3/' + this.videoId, function(res){
					this.crumb = res[0];
				}.bind(this));
			},

			fetchVideoTags: function(){
				tools.xhr('/videoTags/' + this.videoId, function(res){
					this.tags = res;
				}.bind(this));
			},

			xSubtitle: function(){
				tools.xhr('/caption/' + this.videoId, function(res){
					if(!res)
						return;

					let s = '';
					res.forEach((subtitle) => {
						s += `<p>${subtitle.text}</p>`
					})

					$('#subtitle-grave').append(s);
				});
			},

			bindVideo: function(){
				tools.insertScriptTag(1, "../lib/hls.js", {onload: function(){
					tools.insertScriptTag(2, FRAGMENTS.attachVideo(this.videoId), {id: 'hls-frag'});

					window.vEle.onended = function(){
						$('.subtitle').text('');
					}
				}.bind(this), id: 'hls'});
			},

			captureCountdown: function(){
				let _this = this;
				let captureBtn = $('#capture-btn');
				let counting = captureBtn.data('counting');

				if(!counting){
					captureBtn.data('counting', true);
					_this.captureParams.st = _this.getVideoTime();

					countdown();

					window.vEle.play();
				}else{
					clearCountdown();
					_this.capture();

					window.vEle.pause();
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
					captureBtn.val('截视频');
				}
			},

			capture: function(){
				this.captureParams.et = this.getVideoTime();
				
				if(this.captureParams.et <= this.captureParams.st){
					return;
				}

				this.shooting = true;
				
				tools.xhr('/shortVideoLink?' + $.param(this.captureParams), function(res){
					this.shortVideoLink = res;
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

				tools.xhr('/videoScreenshot?' + $.param(params), function(res){
					this.screenshotLink = res;
					this.screenshotFullLink = location.origin + this.screenshotLink;
				}.bind(this), null, null);

				window.vEle.pause();
			},

			// 点击分享时
			popShow: function(){
				tools.insertScriptTag(1, "../lib/qrcode.js", {onload: function(){
					let codeLink = [this.shortVideoFullLink, this.screenshotFullLink][this.previewType-1];
					if(codeLink){
						var qrcode = new QRCode($('#qrcode-shoot').empty()[0], {
							text: codeLink,
							width: 128,
							height: 128,
							colorDark : "#000000",
							colorLight : "#ffffff",
							correctLevel : QRCode.CorrectLevel.H
						});
					}
				}.bind(this), id: 'qrcode'});

				tools.insertScriptTag(1, "../lib/vue-clipboard.min.js", {onload: function(){
					this.clipboardLoaded = true;
				}.bind(this), id: 'clipboard'});
			},

			copySuccess: function (){
				this.$message({
					message: '复制成功',
					type: 'success'
				});
			},

			remark: function(){
				tools.xhr(`/video/${this.videoId}/remark`, function(res){
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

				setTimeout(()=>{
					t.css({opacity: 0, transform: 'translate(-50%, -50%) scale(5)'});
				}, 300)

				setTimeout(() => {
					t.hide()
				}, 300 + 800)
			},

			submitNewStarForm: function(formName){
				this.$refs[formName].validate(function(valid){
					if (valid) {
						this.newStar();
						this.newStarForm.visible = false;
					} else {
						// console.log('error submit!!');
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


		mounted(to, from, next) {
			this.fetchVideolist(0);
			tools.togglePageIE(this);
		},

		beforeRouteUpdate(to, from, next){
			this.$nextTick(()=>{
				this.fetchVideolist(0);
			})
			next();
		},

		methods: {
			fetchVideolist: function(pageNum){
				let params = this.$route.query || {};
				params.pageSize = this.pageSize;
				params.pageNum = pageNum;
				params.hidden = 0;

				tools.xhr('/videos', function(res){
					this.videos = res.datalist;
					this.total = res.total;
				}.bind(this), 'get', params);
			},

			handlePageChange: function(index){
				this.fetchVideolist(index - 1);
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
				}],

				tennisLevel: CONSTANT.level.tennis,
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
						// console.log('error submit!!');
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
				athletes: [],
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
				tools.xhr('/sports', function(res){
					this.sports = res;
					this.voteNextForm.sport = this.sports[0].id
				}.bind(this));
			},

			querySKills(){
				tools.xhr('/skills/'+this.voteNextForm.sport, function(res){
					this.skills = res;
				}.bind(this));
			},

			queryAthletes(){
				tools.xhr('/tennisRanking', function(res){
					this.athletes = res;
				}.bind(this));
			},

			submitForm: function(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						tools.xhr('/voteNext', function(res){
							this.fetchVoteResult();
							this.$message({
								message: '感谢您的投票',
								type: 'success'
							});
						}.bind(this), 'post', this.voteNextForm, function(res){
							let statusCode = res.status;
							if(statusCode == 401){
								$('#header-btn-login').trigger('click')
							}else if(statusCode == 403){
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
				tools.xhr('/videoVoteResult', function(res){
					// this.resetForm('form');
					this.updateChart(res);
				}.bind(this));
			},

			updateChart: function(data){
				// $('#chart-container').html('<canvas id="myChart"></canvas>');

				// 重新new chart，替换canvas
				var ctx = $('#myChart')[0].getContext('2d');

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
			tools.insertScriptTag(1, "../lib/Chart.min.js", {onload: function(){
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
						tools.xhr('/feedback', function(res){
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
				tools.xhr('/emailConfirm' + location.search, function(res){

					this.$message({
						showClose: true,
						message: '账号已激活',
						type: 'success',
						onClose: function(){
							location.href = location.origin;
						}
					});
				}.bind(this), '', {}, function(){
					// 重新激活
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
				tools.xhr('/vStars', function(res){
					this.vStars = res.datalist;
					this.starTotal = res.total;
				}.bind(this),'get',{
					pageNum: pageNum,
					pageSize: this.pageSize
				});
			},

			fetchShootVideo: function(pageNum){
				tools.xhr('/usrShotVideos', function(res){
					this.shotVideos = res.datalist;
					this.videoTotal = res.total;
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

			// tools.xhr('/starVideo/' + this.vStarId, function(res){
			// 	d.starVideos = res;
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
				tools.xhr('/starVideo/' + this.vStarId, function(res){
					this.starVideos = res.datalist;
					this.total = res.total;
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
				tools.xhr('/usrVshoot?vId=' + this.$route.query.vId, function(res){
					if(type == 1){
						this.dynamicShoots = res.datalist;
						this.dynamicTotal = res.total;
					}else if(type == 2){
						this.staticShoots = res.datalist;
						this.staticTotal = res.total;
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
						}).then(()=>{
							this.$router.push({name: 'datum'})
						}).catch(()=>{
							this.$router.push({name: 'datum'})
						});
					}
				}.bind(this));
			},

			resetMatchPanel: function(){
				this.matchPanelVisible = false;// 默认隐藏
				this.matchResult = 3;// 默认“平”
			}
		},

		beforeRouteEnter(to, from, next){
			tools.insertScriptTag(1, CONSTANT.BAIDUMAPAPI, {id: 'map-api'});

			var intervalId = setInterval(()=>{
				if(window.BMap && window.BMap.Map){
					clearInterval(intervalId);
					next();
				}
			}, 100)
		},

		mounted: function(){
			tools.togglePageIE(this);

			$('#map-script').remove();
			tools.insertScriptTag(1, '../js/map.js', {onload: function(){
				var mapConstainer = $('.map-container');

				mapConstainer.find('.close-btn').one('click', function(){
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
		// beforeRouteUpdate(to, from, next){
		// 	location.hash = to.fullPath
		// 	location.reload();
		// },
		data: function () {
			var d = {
				vEle: null,
				curCaptionBlock: null,// 选中的字幕快
				waveContainerWidth: 0,
				duration: 0,// 视频时长
				captions: [],// 当前字幕
				drafts: [],
				draft: '',// 字幕草稿/用户 编号
				updateType: 0,
				triggerScroll: false,
				timeOffset: 0,

				captionBlockLeftBoundryScope:{},// 字幕块左边界移动范围
				captionBlockRightBoundryScope:{},// 字幕块右边界移动范围
				draggingSign: {status: false},// 标记是否正在拖动 字幕块边界
				captionBlockLeftDraggerFns: [],
				captionBlockRightDraggerFns: [],

				loginInfo: {},// 登录信息
				videoInfo: {},// 视频信息

				captionIntervalId: 0,// 字幕循环ID
				wavesurfer: null,

				formatMS: tools.formatMS,
				defaultCaption: {
					id: '1',
					startTime: 0,
					endTime: 2000,
					text: ''
				},
				clear: true,// 标记 是否全部保存
			};

			return d;
		},

		computed: {
			timeLineLength: function(){
				// 1秒10刻度
				// 每刻度间距6像素
				return this.duration * 10 * 6;
			}
		},

		template: temp.translator,

		methods: {
			bindVideo: function(){
				let t = this;
				tools.insertScriptTag(1, "../lib/hls.js", {onload: function(){
					tools.insertScriptTag(2, FRAGMENTS.attachVideo(t.videoId, 480), {id: 'hls-frag'});

					t.vEle.onended = function(){
						$('.subtitle').text('');
					}

					t.vEle.oncanplay= function(){
						t.duration = t.vEle.duration;

						// t.$nextTick(function () {
							t.drawTimeScale();
							t.drawWave();
						// })

						t.trimCaption();

						t.vEle.oncanplay = null;

						let vEle = $(t.vEle);
						let videoWidth = vEle.width();
						let videoContainerWidth = $('#captions-player-colimn').width();

						if(videoWidth > videoContainerWidth){
							vEle.width(videoContainerWidth)
						}

						$('#captions-player-colimn').css({opacity: 1});
					}

					// 0 拖动视频 == 正常情况
					// 1 左侧点击	
					t.vEle.ontimeupdate= function(){
						if(t.updateType == 0){
							t.scrollTimeline();
							t.seekWaveProgress();
							t.positionLine();
						}if(t.updateType == 1){
							t.scrollTimeline();
							t.seekWaveProgress();
							t.updateType = 0;
						}

						t.drawTimeScale();
						// 显示caption-block
						// 时间点前后10块字幕


					}
				}, id: 'hls'});
			},

			bindSubtitle: function(fn, captions){
				if(captions){
					this.captionIntervalId = tools.attachSubtile(this.vEle, captions, 500, function(subtitle){
						$('#player-wrapper').find('.subtitle').text(subtitle)
					});
					return;
				}

				let captionAPI = '/caption/' + this.videoId;

				if(this.draft){
					captionAPI += '?draftId=' + this.draft;
				}else{
					captionAPI += '?ownDraft=1'
				}

				tools.xhr(captionAPI, function(res){
					if(!res || !res.length){
						res = [Object.assign({}, this.defaultCaption)];
						// console.log(res);
					}

					this.captionIntervalId = tools.attachSubtile(this.vEle, res, 500, function(subtitle){
						$('#player-wrapper').find('.subtitle').text(subtitle)
					});

					this.captions = res;

					fn && fn();
				}.bind(this));
			},

			saveSrt: function(isFinal, auto){
				if(isFinal){
					// 发布时 
					// 清空每一行两端的空字符 
					// 清空无汉字的行
					let captionCopy = [];
					const kanji = /[\u4e00-\u9fa5]/;

					for(var i = 0; i < this.captions.length; i++){
						var caption = this.captions[i];
						caption.text = caption.text.trim();

						if(
							caption.text &&
							caption.text.match(kanji)
						){
							captionCopy.push(caption)
						}
					}

					if(captionCopy.length < this.captions.length){
						setTimeout(()=>{
							this.$message({
								message: '字幕已清理',
								type: 'info'
							});
						}, 2000)
					}
					
					this.captions = captionCopy;
				}

				tools.xhr('/srt/' + this.videoId, function(){
					
					if(isFinal){
						this.listDrafts();

						tools.xhr('/recordUsrPost', function(){
							console.log('记录成功')
						}, 'post', {
							vId: this.videoId,
							type: 2,
						})
					}

					this.clear = true;

					let message = `${isFinal? '发布': '暂存'}成功`;
					if(auto){
						message = '自动' + message;
					}

					this.$message({
						message: message,
						type: 'success'
					});

				}.bind(this), 'post', {
					captions: this.captions,
					isFinal: isFinal
				});

				if(this.captions.length == 0){
					this.captions = [Object.assign({}, this.defaultCaption)];
				}

				clearInterval(this.captionIntervalId)
				this.bindSubtitle(null, this.captions);
			},

			// 继承当前查看的终稿
			inheritCaption: function(){
				this.$confirm('继承字幕会丢失之前的草稿和已经发布的终稿，确定继承？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(()=>{
					tools.xhr('/caption/inherition' , function(){
						this.$message({
							message: `字幕继承成功`,
							type: 'success'
						})

						this.listDrafts();
					}.bind(this), 'post', {
						vId: this.videoId,
						draft: this.draft
					});
				}).catch(()=>{

				});
			},

			// 审核当前查看的终稿
			auditCaption: function(){
				this.$confirm('审核通过？', '提示', {
					confirmButtonText: '通过',
					cancelButtonText: '否决',
					type: 'warning',
				}).then(()=>{
					if(confirm('确认通过？')){
						tools.xhr('/caption/audition' , function(res){
							if(!res){
								this.$message({
									message: `字幕已通过审核,会作为视频默认字幕`,
									type: 'success'
								})

								// 发送审核状态给用户 todo
								// if(this.draft != window.loginUsrInfo.is)
								tools.xhr('/usrPostNotifyier' , null, 'post', {
									receiver: this.draft,
									status: 1,
									videoTitle: this.videoInfo.headline
								});
							}else{
								this.$message({
									message: `已被用户ID为${res.checkor}的管理审核，不用重复审核`,
									type: 'info'
								})
							}
						}.bind(this), 'post', {
							vId: this.videoId,
							draft: this.draft,
							status: 1
						});
					}
				}).catch(() => {
					if(confirm('确认否决？')){
						tools.xhr('/caption/audition' , function(res){
							if(!res){
								this.$message({
									message: `否决成功，稍后会通知该用户`,
									type: 'success'
								})
								// 发送审核状态给用户 todo
							}else{
								this.$message({
									message: `已被用户ID为${res.checkor}的管理审核，不用重复审核`,
									type: 'info'
								})
							}
						}.bind(this), 'post', {
							vId: this.videoId,
							draft: this.draft,
							status: 2
						});
					}
				});

			},

			// 定位当前行
			positionLine: function(){
				let currentTime = this.vEle.currentTime;
				let captions = this.captions;
				let curLine;
				let lineBox = $('#line-editor');

				for(let i=0; i<captions.length; i++){
					let caption = captions[i];

					if(currentTime> caption.startTime / 1000 && currentTime < caption.endTime / 1000){
						// console.log(caption, i);
						curLine = lineBox.find('.caption-line').eq(i);
						curLine.addClass('current-line').siblings().removeClass('current-line');

						$('.caption-block').eq(i).addClass('current').siblings('.caption-block').removeClass('current');
						// curLine[0].scrollIntoView(true)

						// currentLine.marginTop < lineBox.scrollTop || currentLine.marginTop > lineBox.scrollTop + lineBox.height - curLineHeight
						let lineBoxScrollTop = lineBox.scrollTop();
						let lineBoxHeight = lineBox.height();
						let curLineHeight = curLine.height()
						let firstLineOffsetTop = lineBox.children().eq(0).offset().top;
						let curLineMarginTop = curLine.offset().top - firstLineOffsetTop;
						
						if(curLineMarginTop < lineBoxScrollTop){
							lineBox.scrollTop(curLineMarginTop)
						}else if(curLineMarginTop > lineBoxScrollTop + lineBoxHeight - curLineHeight - tools.matchNumber(curLine.css('margin-top'))){
							lineBox.scrollTop(curLineMarginTop - lineBoxHeight + curLineHeight + tools.matchNumber(curLine.css('margin-top')))
						}

						break;
					}
				}
			},

			// 滚动时间轴
			scrollTimeline: function(){
				let timePass = this.timeToPos(this.vEle.currentTime - this.timeOffset);
				$('#timeline').scrollLeft(timePass)
				this.triggerScroll = true;//触发scroll事件时 标记为“模拟事件”
				setTimeout(function(){this.triggerScroll = false;}.bind(this), 50)
			},

			seekWaveProgress(){
				let wavesurferProgress = this.vEle.currentTime / this.duration;
				if(wavesurferProgress > 1){
					wavesurferProgress = 1
				}else if(wavesurferProgress <= 0){
					wavesurferProgress = 0
				}
				this.wavesurfer && this.wavesurfer.seekTo(wavesurferProgress);
			},

			// 拖动“针头”
			handlerMovingNeedle: function(pos){
				this.timeOffset = this.posToTime(pos);
				$('#timeline').triggerHandler('scroll');// 模拟scroll 改变视频当前时间
			},

			// 拖动block dragger
			handlerMovingCaptionBlockLeftDragger: function(pos){
				pos = pos > 0? pos: 0;
				let curCaptionBlock = this.curCaptionBlock;
				let index = $('.caption-block').index(this.curCaptionBlock);
				let curCaptionBlockLeftBoundry = tools.matchNumber(curCaptionBlock.css('left'));
				let curCaptionBlockRightBoundry = curCaptionBlockLeftBoundry + curCaptionBlock.width();

				let prevCaptinBlock = curCaptionBlock.prev('.caption-block').length? curCaptionBlock.prev('.caption-block') : null;
				let prevCaptionBlockLeftBoundry = prevCaptinBlock? tools.matchNumber(prevCaptinBlock.css('left')): 0;
				let prevCaptionBlockRightBoundry = prevCaptinBlock? prevCaptionBlockLeftBoundry + prevCaptinBlock.width() : 0;

				curCaptionBlock.css('left', pos).width(curCaptionBlockRightBoundry-pos);

				if(index > - 1){
					this.captionBlockLeftDraggerFns[0] = ()=>{
						this.captions[index].startTime = this.posToTime(pos, true);
					}
				}else{
					this.captionBlockLeftDraggerFns[0] = null;
				}

				if(pos < prevCaptionBlockRightBoundry && prevCaptinBlock){
					prevCaptinBlock.width(pos - prevCaptionBlockLeftBoundry)

					if(index > 0){
						this.captionBlockLeftDraggerFns[1] = ()=>{
							this.captions[index-1].endTime = this.posToTime(pos, true);
						}
					}else{
						this.captionBlockLeftDraggerFns[1] = null;
					}
				}else{
					this.captionBlockLeftDraggerFns[1] = null;
				}
			},

			handlerMovingCaptionBlockRightDragger: function(pos){
				console.log(pos, this.timeLineLength)
				pos = pos < this.timeLineLength? pos: this.timeLineLength;
				let curCaptionBlock = this.curCaptionBlock;
				let index = $('.caption-block').index(this.curCaptionBlock);
				let curCaptionBlockLeftBoundry = tools.matchNumber(curCaptionBlock.css('left'));
				let curCaptionBlockRightBoundry = curCaptionBlockLeftBoundry + curCaptionBlock.width();

				let nextCaptinBlock = curCaptionBlock.next('.caption-block').length? curCaptionBlock.next('.caption-block') : null;
				let nextCaptionBlockLeftBoundry = nextCaptinBlock? tools.matchNumber(nextCaptinBlock.css('left')): this.timeLineLength;
				let nextCaptionBlockRightBoundry = nextCaptinBlock? nextCaptionBlockLeftBoundry + nextCaptinBlock.width(): this.timeLineLength;

				curCaptionBlock.width(pos - curCaptionBlockLeftBoundry);

				if(index > - 1){
					this.captionBlockRightDraggerFns[0] = ()=>{
						this.captions[index].endTime = this.posToTime(pos, true);
					}
				}else{
					this.captionBlockRightDraggerFns[0] = null;
				}

				if(pos > nextCaptionBlockLeftBoundry && nextCaptinBlock){
					nextCaptinBlock.width(nextCaptionBlockRightBoundry - pos).css('left', pos);

					if(index > - 1 && index < this.captions.length - 1){
						this.captionBlockRightDraggerFns[1] = ()=>{
							this.captions[index + 1].startTime = this.posToTime(pos, true)
						};
					}else{
						this.captionBlockRightDraggerFns[1] = null;
					}
				}else{
					this.captionBlockRightDraggerFns[1] = null;
				}
			},

			// 假如字幕超出视频时间长度
			trimCaption: function(){
				let captions = this.captions;
				let duration = this.duration;
				let cutSignal = false;

				for(var i=0, j=captions.length; i<j; i++){
					let caption = captions[i];

					let endTime = caption.endTime / 1000;
					if(endTime >  duration){
						caption.endTime = this.duration * 1000;
						captions.length = i + 1;
						break;
					}
				}
			},

			posToTime: function(pos, isMilli){
				let time = pos / this.timeLineLength * this.duration;
				if(isMilli){
					return time * 1000;
				}else{
					return time;
				}
			},

			timeToPos: function(time, isMilli){
				let pos = time / this.duration * this.timeLineLength;
				if(isMilli){
					return pos / 1000;
				}else{
					return pos;
				}
			},

			listDrafts: function(){
				tools.xhr('/captionDrafts/' + this.videoId, function(res){
					this.drafts = res;
				}.bind(this));
			},

			handleSlectDraft: function(draft){
				if(draft == this.$route.query.draftId)
					return;

				this.$router.push({path: `/translator/${this.videoId}`, query: {draftId: draft}});
				this.draft = draft;

				this.rstTranslator();
			},

			rstTranslator(){
				clearInterval(this.captionIntervalId)
				this.bindSubtitle();

				$('#line-editor').scrollTop(0);
				$('#timeline').scrollLeft(0);
				$('.playhead').css('left', 0);
				$('#line-editor').find('.selected, .current-line').removeClass('selected current-line')

				this.timeOffset = 0;
			},

			queryLoginInfo(){
				tools.xhr('/loginInfo', function(res){
					this.loginInfo = res;
				}.bind(this));
			},

			queryVideoInfo(){
				tools.xhr('/videoInfo/' + this.videoId, function(res){
					this.videoInfo = res;
				}.bind(this));
			},

			// [{}, {id:2}, {id:4}]
			// 整理captions的id
			standardizeCaption(){
				let i = 1;
				this.captions.forEach(function(caption){
					caption.id = i++;
				})
			},

			backtrack(){
				if(this.$route.query.draftId){

					this.$router.push({path: `/translator/${this.videoId}`});
					this.draft = '';

					this.bindSubtitle();

				}else{
					this.$router.push({path: `/videos/${this.videoId}`});
				}
			},

			drawWave(){
				tools.insertScriptTag(1, '/lib/wavesurfer.min.js', {onload: function(){
					// http://wavesurfer-js.org/docs/options.html
					var wavesurfer = WaveSurfer.create({
						container: '#waveform',
						interact: false,
						height: $('#waveform').height(),
						cursorWidth: 0,
						// barWidth: 8,
						// barHeight: 1.2
					});

					this.wavesurfer = wavesurfer;

					wavesurfer.load(`/multimedia/ts/${this.videoId}/audio.mp3`)
				}.bind(this), id: 'wavesurfer'});
			},

			drawTimeScale(){
				var c = document.querySelector('#time-scale');
				var ctx = c.getContext('2d');
				ctx.lineWidth = 1;          //设置线宽状态
				ctx.strokeStyle = "#222" ;  //设置线的颜色状态
	
				var duration = this.duration;
				var totalIndex = duration * 10;// 0 -> 1000
				var intervalX = 6;
				var short = 5;
				var tall = 10;
	
				let timeLineScrollLeft = $('#timeline').scrollLeft();

				c.width = this.waveContainerWidth;
				
				c.style.marginLeft = timeLineScrollLeft + 'px';
				ctx.translate(-timeLineScrollLeft, 0);
				// 绘制一部分
				const startTime = this.posToTime(timeLineScrollLeft);
				const endTime = this.posToTime(timeLineScrollLeft + this.waveContainerWidth);
				
				// console.log(startTime, endTime);
				let j=0;
	
				// ctx.clearRect(0,0,c.width,c.height);
				for(var i=0; i <=totalIndex + 1; i ++){
					let second = i/10;

					if(second > startTime && second < endTime){
						j++;
						drawLine(i)
					}
				}
				// console.log(j)
	
				function drawLine(scaleIndex){
					ctx.moveTo (intervalX * scaleIndex,0);       //设置起点状态
					ctx.lineTo (intervalX * scaleIndex, scaleIndex%5 ? short : tall);       //设置末端状态
					ctx.stroke();  
	
					if(!(scaleIndex % 10)){
						var second = scaleIndex / 10;
						ctx.fillText(
							second, 
							intervalX *scaleIndex - second.toString().length / 2 * 5.5,// 5.5 => 1个数字的宽度 
							20
						)
					}
				}
			}
		},

		mounted: function(){
			let t = this;
			t.draft = this.$route.query.draftId;

			let vEle = this.vEle = $('video')[0];
			t.waveContainerWidth = $('#timeline').width();

			t.startEditTime = Date.now();

			tools.togglePageIE(this);

			this.bindSubtitle(()=>{
				this.bindVideo();

				if(!this.draft){
					setTimeout(()=>{
						var kanjiLineIndex;
						this.captions.forEach((caption, i)=>{
							const kanji = /[\u4e00-\u9fa5]/;
	
							if(caption.text.match(kanji)){
								kanjiLineIndex = i;
							}
						})
	
						// console.log(kanjiLineIndex)
						if(kanjiLineIndex !== undefined){
							$('#captions-area').find('.caption-line').eq(kanjiLineIndex).get(0)
							.scrollIntoView({behavior: 'smooth'})
						}
					}, 1000)
				}
			});

			this.listDrafts();

			this.queryLoginInfo();
			this.queryVideoInfo();

			$('#timeline').on("scroll", function(e){
				let sl = $(this).scrollLeft();
				$('#playhead-container').css('left', sl);

				if(!t.triggerScroll){// 手动拖动字幕时间轴
					let duration = t.duration;
					if(duration){
						// 修改视频时间
						vEle.currentTime = t.posToTime(sl) + t.timeOffset;
					}
					t.vEle.pause()
				}
			}).on('mouseover click', '.caption-block', function(e){
				if(t.draggingSign.status){// 拖动操作
					return;
				}

				let block = $(e.target);
				t.curCaptionBlock = block;
				
				let blockLeft = tools.matchNumber(block.css('left')),
					blockWidth = block.width(),
					blockRight = blockLeft + blockWidth;

				$('.caption-block-dragger-min').css('left', blockLeft);
				$('.caption-block-dragger-max').css('left', blockRight);

				// min: prevBlock.left+30  max: nextBlock.right - 30
				let prevBlock = block.prev('.caption-block'),
					nextBlock = block.next('.caption-block');

				const blockMinWidth = 30;

				if(prevBlock.length){
					t.captionBlockLeftBoundryScope.min = tools.matchNumber(prevBlock.css('left')) + blockMinWidth;
				}else{
					t.captionBlockLeftBoundryScope.min = 0;
				}

				t.captionBlockLeftBoundryScope.max = blockLeft + blockWidth - blockMinWidth;

				t.captionBlockRightBoundryScope.min = blockLeft + blockMinWidth;

				if(nextBlock.length){
					t.captionBlockRightBoundryScope.max = tools.matchNumber(nextBlock.css('left')) + nextBlock.width() - blockMinWidth;
				}else{
					t.captionBlockRightBoundryScope.max = t.timeLineLength;
				}

				if(e.type == 'click'){
					let index = $('.caption-block').index(block);
					$('.caption-line').eq(index).find('.caption-text').trigger('click', {isTrigger: true});
					$(this).addClass('current').siblings().removeClass('current');
				}
			}).on('mouseleave', '.caption-block', function(e){
				if($('.playhead').find())
				if(!$(e.relatedTarget).is(`
					.caption-block-dragger,
					.caption-block-dragger > i,
					.playhead-triangle,
					.playhead-needle,
					.playhead-handle`)){
					$('.caption-block-dragger-min, .caption-block-dragger-max').css('left', -100);
				}
			})

			$('#line-editor').on('click', '.caption-line', function(e){
				if(!$(this).is('.selected')){
					let index= $('.caption-line').index(this);
					$(this).addClass('selected current-line').siblings().removeClass('selected current-line');
					$('.caption-block').eq(index).addClass('current').siblings().removeClass('current');
				}

				// 通过点击时间轴上的“字幕块”
				if(arguments[1] && arguments[1].isTrigger){
					return;
				}

				let caption = $(this).data('caption');

				let st = caption.startTime / 1000;
				st = st + 0.02;//确保点击后的字幕和视频上显示的字幕同步
				
				// 修改视频时间
				t.updateType = 1;
				vEle.currentTime = st;
				vEle.pause();

				// 指针处于时间轴容器中间
				let halfTimeOffset =  t.posToTime(t.waveContainerWidth / 2);
				if(st > halfTimeOffset){
					t.timeOffset = halfTimeOffset;
				}else{
					t.timeOffset = st;
				}

				$('.playhead').css({
					left: t.timeOffset/halfTimeOffset/2 * t.waveContainerWidth
				})

			}).on('blur', '.caption-ipt .el-textarea__inner', function(){
				$(this).parents('.caption-line').removeClass('focused');
				t.clear = false;
			}).on('click', '.caption-text', function(){
				$(this).parents('.caption-line').addClass('focused');
				$(this).siblings('.caption-ipt').find('.el-textarea__inner').focus();
			}).on('click', '.delete-segment-button', function(e){
				let curLine = $(this).parents('.caption-line').eq(0);
				let index = $('.caption-line').index(curLine);
				t.captions.splice(index, 1);

;				if(t.captions.length == 0){
					t.captions = [Object.assign({}, t.defaultCaption)];
				}
			}).on('click', '.add-segment-button', function(e){
				let curLine = $(this).parents('.caption-line').eq(0);
				let index = $('.caption-line').index(curLine);

				// 优先往后加 最长时间为2秒
				// 后方间隙不够（小于0.5秒），
				// 往前，0.5-2秒
				// 移动指针到拼接位置
				// 选中当前行

				let nextCaptionLine = curLine.next('.caption-line');
				let prevCaptionLine = curLine.prev('.caption-line');

				let prevLineData = {},
					nextLineData = {};

				let curLineData = curLine.data('caption');
				if(prevCaptionLine.length){
					prevLineData = prevCaptionLine.data('caption');
				}
				if(nextCaptionLine.length){
					nextLineData = nextCaptionLine.data('caption');
				}

				let newLineLength = 0;
				let newLineLocation = 0;// 1代表往后添加 2代表往前
				let newLineStartTime = 0,
					newLineEndTime = 0;
				
				let nextTimeGap = (nextLineData.startTime || t.duration * 1000) - curLineData.endTime;
				if(nextTimeGap > 2000){
					newLineLength = 2;
					newLineLocation = 1;
				}else if(nextTimeGap > 500){
					newLineLength = nextTimeGap / 1000;
					newLineLocation = 1;
				}else{
					let prevTimeGap = curLineData.startTime - (prevLineData.endTime || 0)
					if(prevTimeGap > 2000){
						newLineLength = 2;
						newLineLocation = 2;
					}else if(prevTimeGap > 500){
						newLineLength = prevTimeGap / 1000;
						newLineLocation = 2;
					}
				}

				let captions = t.captions;
				let newLineData = {};

				if(newLineLength){
					let needlePos = 0;

					if(newLineLocation === 1){
						needlePos = t.timeToPos(curLineData.endTime, true);

						newLineStartTime = curLineData.endTime;
						newLineEndTime = newLineStartTime + newLineLength * 1000;
						newLineData = { 
							startTime: newLineStartTime, 
							endTime: newLineEndTime, 
							text: '' 
						};

						captions.splice(index + 1, 0, newLineData)
					}else if(newLineLocation === 2){
						needlePos = t.timeToPos(curLineData.startTime, true);

						newLineEndTime = curLineData.startTime;
						newLineStartTime = newLineEndTime - newLineLength * 1000;
						newLineData = { 
							startTime: newLineStartTime, 
							endTime: newLineEndTime, 
							text: '' 
						};

						captions.splice(index, 0, newLineData)
					}
					t.standardizeCaption();

					let triggeredLineIndex = [index + 1, index][newLineLocation - 1];
					t.$nextTick(function () {
						$('.caption-line').eq(triggeredLineIndex).find('.caption-text').trigger('click');
					})
				}
			}).on('keydown', '.caption-ipt .el-textarea__inner', function(e){
				if(e.keyCode === 9){// tab
					let curLine = $(this).parents('.caption-line').eq(0);
					let nextLine = curLine.next('.caption-line');
					if(nextLine.length){
						nextLine.find('.caption-text').trigger('click');
					}
					e.preventDefault();
				}else if(e.keyCode == 27){
					this.blur();
					e.preventDefault();
				}
				e.stopPropagation();
			})

			// —— 32 ← 37 → 39
			$('body').off('keydown.videoKeyController').on('keydown.videoKeyController', function(e){
				// console.log(e.keyCode)
				const kc = e.keyCode;
				if(kc == 32){
					if(!$(document.activeElement).is('#video')){
						t.vEle.paused? t.vEle.play(): t.vEle.pause();
						e.preventDefault();
					}
				}else if(kc == 37){
					t.vEle.currentTime -= 2;
					if(t.vEle.currentTime < 0){
						t.vEle.currentTime = 0;
					}
					e.preventDefault();
				}else if(kc == 39){
					t.vEle.currentTime += 2;
					if(t.vEle.currentTime > t.duration){
						t.vEle.currentTime = t.duration
					}
					e.preventDefault();
				}
			})

			setInterval(()=>{
				if(!this.clear){
					this.saveSrt(0);
				}
			}, 5 * 60 * 1000)

			window.onfocus = ()=>{
				if(!window.loginUsrInfo){
					t.$message({
						message: '登录后再操作',
						type: 'warning'
					});
					Vue.bus.emit('trigger-login')
				}
			}
		},

		beforeDestroy(){
			this.wavesurfer.destroy();
			$('#wavesurfer').remove();
			$('body').off('keydown.videoKeyController');

		},

		beforeRouteLeave: function(to, from , next){
			if(this.clear){
				next();
			}else{
				this.$confirm('您还未保存草稿，确定需要提出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					// 选择确定
					next()
				})
			}
		}
	}

	window.COMPONENTS = COMPONENTS;
}