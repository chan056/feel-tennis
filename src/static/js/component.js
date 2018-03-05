var COMPONENTS = {};

COMPONENTS.HeaderComponent = {
	el: 'app-header',

	template: temp.header,

	data: {
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
					}, 'get');
				}, trigger: 'blur'}
			],
			psw: [
				{ required: true, message: '请输入密码', trigger: 'blur' },
			],
			email: [
				{ type: 'email', required: true, message: '请输入正确格式邮箱', trigger: 'change' }
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
			npsw: ''
		},

		logoutForm: {
			visible: false
		},

		loginUsrInfo: {}
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
			let o = {
				'login': this.handlerLogin,
				'regist': this.handlerRegist,
				'datum': function(){
				},
				'logout': this.handlerLogout
			};

			o[index] && o[index]();
		},

		handlerLogin(){
			this.loginForm.visible = true;
			// 回车提交事件
			// console.log($('#last-login-iput'))
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

		handlerRegist(){
			this.registForm.visible = true;

			tools.insertScriptTag(1, "../lib/captcha.js", {onload: function(){
				tools.insertScriptTag(2, FRAGMENTS.captcha, {id: 'captcha-frag'});
			}.bind(this), id: 'captcha'});

			tools.insertScriptTag(1, '../lib/md5.js', 'md5');
		},

		handlerLogout(){
			this.logoutForm.visible=true;
		},

		login(){
			let trim = $.trim;
			
			tools.xhr('/login', function(){
				// this.fetchUsrLoginInfo();

				this.$message({
					message: '登录成功',
					type: 'success'
				});

				location.reload();

				// this.loginForm.visible = false;
			}.bind(this), 'post', {
				name: trim(this.loginForm.name),
				psw: md5(trim(this.loginForm.psw))
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
			let t = this;
			this.$refs['registForm'].validate(function(valid){
				if (valid) {
					let trim = $.trim;

					tools.xhr('/regist', function(){
						t.registForm.visible = false;
		
						t.$alert('注册成功,请查收邮件激活账号', '提示', {
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

		resetPsw: function(){
			const t = this;
			let trim = $.trim;

			this.$alert(`确认将密码重置为${t.resetPswForm.npsw}?`, '注意', {
				confirmButtonText: '确定',
				callback: function (action) {
					tools.xhr('/resetPsw', function(res){
						t.$message({
							type: 'info',
							message: `密码重置成功`
						});

						t.resetPswForm.visible = false; 
					}, 'patch', {
						name: trim(t.resetPswForm.name),
						opsw: md5(trim(t.resetPswForm.opsw)),
						npsw: md5(trim(t.resetPswForm.npsw))
					}, function(){
						t.$message({
							type: 'warning',
							message: `密码重置失败`
						});
					});
				}
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
				// 登陆状态在各组件共享 todo
				this.loginUsrInfo = loginUsrInfo || {};

				let name = loginUsrInfo.name;
				$('#header .el-icon-view').attr('title', name).addClass('usr');

				this.$bus.emit('update-login-info', this.loginUsrInfo);

			}.bind(this));
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
	el: 'app-aside',

	template: temp.aside,

	data: {
		loginUsrInfo: {}
	},

	created: function(){
		this.$bus.on('update-login-info', function(info){
			this.loginUsrInfo = info;
		}.bind(this));
	},

	beforeDestroy() {
		this.$bus.off('update-login-info', this.addTodo);
	},

	methods: {
		
	},
};

COMPONENTS.Sports = {
	data: function () {
		var d = {sports: []};

		tools.xhr('/sports', function(resData){
			d.sports = resData;
		});

		return d;
	},

	template: temp.sports,
};

COMPONENTS.AlbumList = {
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

COMPONENTS.Album = {
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

		tools.xhr('/albumTags/' + albumId, function(resData){
			d.tags = resData;
		});

		return d;
	},
	template: temp.album,
	methods: {
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

COMPONENTS.Video = {
	props: ['videoId'],
	data: function () {
		let d = {video: null, crumb: {}, tags: [], captureParams: {}, previewerVisible: false, gifLink: '', like: 0, likeLocking: false};
		let propsData = this.$options.propsData;
		let videoId = propsData.videoId;

		d.captureParams.vId = videoId;
		tools.xhr('/videos/' + videoId, function(resData){
			console.log(resData)
			if(resData){
				d.video = resData;
				d.captureParams.ext = d.video.video_ext;
				
				let dayViewLeft = resData.dayViewLeft;
				if(dayViewLeft){
					if(dayViewLeft <= 5){
						this.$message({message: `当天剩余播放次数 ${resData.dayViewLeft || 0}次`, type: 'warning'});
					}

					tools.insertScriptTag(1, "../lib/hls.js", {onload: function(){
						tools.insertScriptTag(2, FRAGMENTS.attachVideo(this.videoId), {id: 'hls-frag'});

						$('#video').onended = function(){
							$('.subtitle').text('');
						}
					}.bind(this), id: 'hls'});
				}
			}else{
				this.$message({
					dangerouslyUseHTMLString: true,
					message: `当天剩余播放次数 0次，<br/>点击右上角注册或登录查看更多视频`, 
					type: 'warning'
				});
			}

		}.bind(this));

		tools.xhr('/navInfo/3/' + videoId, function(resData){
			d.crumb = resData[0];
		});

		tools.xhr('/videoTags/' + videoId, function(resData){
			d.tags = resData;
		});
		
		tools.xhr('/srt/' + videoId, function(resData){
			let v = $('#video');
			let playerWrapper = $('#palyer-wrapper')

			tools.attachSubtile(v[0], resData, 500, function(subtitle){
				playerWrapper.find('.subtitle').text(subtitle).css({

				});
			});
		});

		d.newStarForm = {starName: '', visible: false};
		d.stars = [];
		d.checkList = [];

		return d;
	},
	template: temp.video,
	created() {
		// tools.insertScriptTag(1, "https://cdn.jsdelivr.net/npm/hls.js@latest", {onload: function(){
		// 	tools.insertScriptTag(2, FRAGMENTS.attachVideo(this.videoId), {id: 'hls-frag'});
		// 	video.onpause = function(){
		// 		// console.log('pause');
		// 		// 停止匹配字幕 todo
		// 	}

		// 	video.onended = function(){
		// 		// console.log('ended');
		// 		$('.subtitle').text('');
		// 	}
		// }.bind(this), id: 'hls'});

		this.queryVoteComment();
		this.queryStars();
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
				this.captureParams = {id: this.captureParams.id};

				var gifLink = resData;
				this.gifLink = gifLink;
				
			}.bind(this), null, null, function(ret){
				console.log(ret)
				let status = ret.status;
				if(status == 402){
					this.$message.warning({
						message: '截图超出限制'
					});
				}
			}.bind(this));
		},

		getVideoTime: function(){
			return $('#video')[0].currentTime;
		},

		preview: function(){
			this.previewerVisible = true;
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
				} else {
					console.log('error submit!!');
					return false;
				}
			}.bind(this));
		},

		queryStars: function(){
			tools.xhr('/stars', function(res){
				this.stars = res;
			}.bind(this));
		},

		newStar: function(){
			tools.xhr('/star', function(res){
				this.$message({
					message: '收藏夹新建成功',
					type: 'success'
				});
				// 创建之后 添加视频到收藏夹
				this.starVideo(res);
				this.queryStars();
			}.bind(this), 'post', {name: this.newStarForm.starName});
		},

		starVideo: function(starId){
			tools.xhr('/star/' + starId, function(res){
				this.$message({
					message: '视频收藏成功',
					type: 'success'
				});
			}.bind(this), 'post', {vId: this.video.id});
		}
	}
};

COMPONENTS.videos = {
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
				labels: ["1", "2", "3", "4", "5", "6"],// 前6名
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
	
							tooltipItem = tooltipItems[0];
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
	
							tooltipItem = tooltipItems[0];
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
								message: '投票太频繁了',
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
};

COMPONENTS.About = {
	data: function () {
		var d = {};
		return d;
	},

	methods:{
		
	},

	template: temp.about,
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
						location.href = '/';
					}
				});

			}.bind(this));
		}
	},

	template: temp.emailConfirm
}