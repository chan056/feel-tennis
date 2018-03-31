temp.uploadAdmin =  `
    <div class="upload-wrapper">
        <h2>视频上传页面</h2>

        <el-row>
            <el-col :span="4">
                <label>专辑</label>
            </el-col>

            <el-col :span="10">
                <el-select 
                :disabled="!editable"
                v-model="SO.albumId" 
                clearable 
                placeholder="请选择" 
                @command="chooseAlbumHandler">
                    <el-option
                        v-for="item in albums"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-col>
            
            <el-button v-show="editable" @click="openAlbumDialog();" class="new-album-btn">新建Album</el-button>
        </el-row>

        <el-row v-if="selectedMaker">
            <el-col :span="4">
                <label>专辑作者</label>
            </el-col>
            <el-col :span="10">
                <el-input v-model="selectedMaker" :disabled="!!selectedMaker" placeholder="请输入标题"></el-input>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="4">
                <label>标题</label>
            </el-col>

            <el-col :span="10">
                <el-input :disabled="!editable" v-model="SO.headline" placeholder="请输入标题"></el-input>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="4">
                <label>标签</label>
            </el-col>
            <el-col :span="10">
                <el-select v-model="SO.tag"
                    :disabled="!editable" 
                    clearable
                    multiple
                    filterable
                    placeholder="请选择tag">
                    <el-option
                        v-for="item in tags"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-col>
            
            <el-button v-show="editable" v-on:click="" @click="tagConfig.visibility = true" class="new-tag-btn">新建Tag</el-button>
        </el-row>

        <el-row>
            <el-col :span="4">
                <label>视频</label>
            </el-col>

            <el-col :span="10">
                <el-upload
                    v-show="editable"
                    class="upload-demo"
                    action="/upload"
                    :data="{type:'video'}"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-success="handleSuccess"
                    multiple
                    :limit="3"
                    :on-exceed="handleExceed"
                    :file-list="fileList"
                    >
                    <el-button size="small" type="primary">上传视频</el-button>
                </el-upload>
                <el-input v-show="!editable" :value="vId+videoInfo.video_ext" disabled/>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="4">
                <label>字幕</label>
            </el-col>

            <el-col :span="10">
                <el-upload
                    v-show="editable"
                    class="upload-demo"
                    action="/upload"
                    :data="{type:'subtitle'}"
                    :on-remove="handleRemove"
                    :on-success="handleSubtitleSuccess"
                    multiple
                    :limit="1"
                    :on-exceed="handleExceed"
                    :file-list="fileList"
                    >
                    <el-button size="small" type="primary">上传字幕</el-button>
                </el-upload>
                <el-input v-show="!editable" :value="vId+'.srt'" disabled/>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="4">&nbsp;</el-col>
            <el-col :span="10">
                <el-button v-show="editable" v-on:click="vId?putVideo(): postVideo()" class="new-video-btn">提交</el-button>
                <el-button v-show="!editable" v-on:click="editable=true;" class="new-video-btn">编辑</el-button>
            </el-col>
        </el-row>

        <el-dialog v-bind:title="albumConfig.title" :visible.sync="albumConfig.visibility">
            <el-form class="newAlbumDialog">
                <el-form-item label="运动项目">
                    <el-select v-model="newAlbum.sportId" 
                        clearable
                        filterable
                        placeholder="请选择">
                        <el-option
                            v-for="item in sports"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="制作者">
                    <el-select v-model="newAlbum.maker" 
                        clearable
                        filterable
                        placeholder="请选择">
                        <el-option
                            v-for="item in makers"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                    <el-button @click="makerConfig.visibility=true">创建</el-button>
                </el-form-item>
                <el-form-item label="标签">
                    <el-select v-model="newAlbum.tag" 
                        clearable
                        filterable
                        placeholder="请选择">
                        <el-option
                            v-for="item in tags"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="专辑名称">
                    <el-input v-model="newAlbum.name" auto-complete="off" style="width: 217px;"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-upload
                        class="album-cover-uploader"
                        action="/upload"
                        :data="{type:'img'}"
                        :on-remove="handleRemove"
                        :on-success="handleAlbumCoverSuccess"
                        multiple
                        :limit="1"
                        :on-exceed="handleExceed"
                        :file-list="fileList"
                        >
                        <el-button size="" type="primary">上传封面</el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="albumConfig.visibility = false">取 消</el-button>
                <el-button type="primary" @click="albumConfig.visibility = false; postAlbum();">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog v-bind:title="tagConfig.title" :visible.sync="tagConfig.visibility">
            <el-form class="newTagDialog">
                <el-form-item label="标签名称">
                    <el-input v-model="newTag.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="运动项目">
                    <el-select v-model="newTag.sportId" 
                        clearable
                        filterable
                        placeholder="请选择">
                        <el-option
                            v-for="item in sports"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="tagConfig.visibility = false">取 消</el-button>
                <el-button type="primary" @click="tagConfig.visibility = false; postTag();">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog v-bind:title="makerConfig.title" :visible.sync="makerConfig.visibility">
            <el-form class="newTagDialog">
                <el-form-item label="名字">
                    <el-input v-model="newMaker.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="newMaker.desc" type="textarea" style="width: 300px;"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="makerConfig.visibility = false">取 消</el-button>
                <el-button type="primary" @click="makerConfig.visibility = false; postMaker();">确 定</el-button>
            </div>
        </el-dialog>
    </div>
`;

COMPONENTS.UploadAdmin = {
	props: ['vId'],
	data: function () {
        // console.log(this.vId);

		let tagConfig = {
			visibility: false,
			title: '新建标签',
		};

		let albumConfig = {
			visibility: false,
			title: '新建专辑',
		};

		let makerConfig = {
			visibility: false,
			title: '新建制作者',
		};

		var d = {
            SO: {
                albumId: '',
                headline: '',
                tag: '',
                videoAbsPath: '',
                subtitleAbsPath: ''
            }, 
            videoInfo: {},
            editable: this.vId ? false: true,
			albums: [], 
			tags: [], 
			sports: [], 
			makers: [],
			tagConfig: tagConfig, 
			albumConfig: albumConfig,
			makerConfig: makerConfig,
			newTag: {},
			newAlbum: {},
			newMaker:{},
			selectedMaker: ''
		};

		d.fileList = [];

		this.queryAlbums();
		this.queryTags();
		this.querySports();

		return d;
	},
	methods: {
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

		handleAlbumCoverSuccess(res){
			debugger;
			this.newAlbum.cover = res.relPath;
		},

		postVideo(){
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

		postMaker(){
			tools.xhr('/maker', function(){
				console.log(arguments);
				this.$message({
					message: '制作者创建成功',
					type: 'success'
				});
				this.queryMakers();
			}.bind(this), 'post', this.newMaker);
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
            // 某项运动下的专辑列表 选定运动后 获取专辑数据 todo
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
		},

		chooseAlbumHandler(){
			console.log('chooseAlbumHandler', arguments);
		},

		queryMaker(makerId){
			tools.xhr('/maker/' + makerId, function(resData){
				let makerInfo = resData[0];
				if(makerInfo){
					this.selectedMaker = resData[0].name;
				}else{
					this.selectedMaker = '';
				}
			}.bind(this));
		},

        fetchVideoInfo(){
			tools.xhr('/vInfo/' + this.vId, function(resData){
                this.videoInfo = resData;

                this.SO.albumId = resData.album_id;
                this.SO.headline = resData.headline;
                this.SO.tag = resData.tag? resData.tag.split(',').map(function(){
                    return Number(arguments[0])
                }): [];
			}.bind(this));
        },
        
        putVideo(){
			let so = Object.assign({}, this.SO);
			so.tag = this.SO.tag.join(',');

			tools.xhr('/video/' + this.vId, function(){
				console.log(arguments);
				this.$message({
					message: '视频更新成功',
					type: 'success'
                });
                this.editable = false;

                this.SO.subtitleAbsPath = '';
                this.SO.videoAbsPath = '';
			}.bind(this), 'put', so, function(){
                this.SO.subtitleAbsPath = '';
                this.SO.videoAbsPath = '';
            });
		},
	},

	// watch: {'SO.albumId': function(to, from){
	// 	if(to){
	// 		this.queryMaker(to)
	// 	}else{
	// 		this.selectedMaker = '';
	// 	}
    // }},
    
    mounted: function(){
        if(this.vId){
            this.fetchVideoInfo();
        }
    },

	template: temp.uploadAdmin
};

routeConfig.push(
    { path: '/uploadAdmin', component: COMPONENTS.UploadAdmin, props: function(route){return {vId: route.query.vId}} },
);

temp.feedbacksAdmin =  `
    <div>
        <h2>反馈列表</h2>

        <el-table
        :data="feedbacks"
        style="width: 100%">
            <el-table-column
                prop="id"
                label="编号">
            </el-table-column>
            <el-table-column
                prop="ip"
                label="ip">
            </el-table-column>
            <el-table-column
                prop="usr_id"
                label="用户id">
            </el-table-column>
            <el-table-column
                prop="description"
                label="描述">
            </el-table-column>
            <el-table-column
                prop="site"
                label="网址">
            </el-table-column>
            <el-table-column
                prop="wechat"
                label="微信">
            </el-table-column>
            <el-table-column
                prop="email"
                label="邮件">
            </el-table-column>
            <el-table-column
                prop="files"
                label="文件">
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                width="100">
                <template slot-scope="scope">
                    <el-button @click="deleteFeedback(scope.row.id)" type="text" size="small">删除</el-button>
                    <el-button v-if="!scope.row.black_usr_id_record && !scope.row.black_ip_record" @click="blockUsr(scope.row.ip, scope.row.usr_id, $event)" type="text" size="small">加黑</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            layout="prev, pager, next"
            :total="total"
            :page-size="pageSize"
            @current-change="fetchFeedbacks">
        </el-pagination>
    </div>
`;

COMPONENTS.FeedbacksAdmin = {
	data: function () {

		var d = {
            pageSize: 10,
            curPage: 0,
            total: 0,
			feedbacks: []
		};

		return d;
	},
	methods: {

		postTag(){

			tools.xhr('/tag', function(){
				console.log(arguments)
			}, 'post', this.newTag);
			
		},

		fetchFeedbacks(pageNum){
			tools.xhr('/feedbacks', function(resData){
                this.feedbacks = resData.datalist;
                this.total = resData.total;
                this.curPage = pageNum;
			}.bind(this), 'get', {
                pageNum: pageNum - 1,
                pageSize: this.pageSize
            });
        },
        
        deleteFeedback: function(id){
            this.$confirm('确定删除', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function(){
                tools.xhr('/feedback/' + id, function(resData){
                    this.fetchFeedbacks(this.curPage);
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                }.bind(this), 'delete');
            }.bind(this)).catch(function(){

            });
        },

        blockUsr: function(ip, usrId, e){
            this.$confirm('确认加黑？')
            .then(function(){
                tools.xhr('/blockedUsr', function(resData){
                    this.$message({
                        message: '加黑成功',
                        type: 'success'
                    });

                    // $(e.target).remove();
                }.bind(this), 'post', {
                    ip: ip,
                    usrId: usrId
                });
            }.bind(this)).catch(function(){

            });
        }
	},

	// watch: {'SO.albumId': function(to, from){
	// 	if(to){
	// 		this.queryMaker(to)
	// 	}else{
	// 		this.selectedMaker = '';
	// 	}
	// }},

    template: temp.feedbacksAdmin,
    
    mounted: function(){
        this.fetchFeedbacks(1);
    }
};

routeConfig.push(
    { path: '/feedbacksAdmin', component: COMPONENTS.FeedbacksAdmin},
);

temp.videosAdmin =  `
    <div>
        <h2>视频列表</h2>

        <el-table
        :data="videos"
        style="width: 100%">
            <el-table-column
                prop="id"
                label="id">
            </el-table-column>
            
            <el-table-column
                prop="album_id"
                label="album_id">
            </el-table-column>
            <el-table-column
                prop="headline"
                label="headline">
            </el-table-column>
            <el-table-column
                prop="tag"
                label="tag">
            </el-table-column>

            <el-table-column
                fixed="right"
                label="操作"
                width="200">
                <template slot-scope="scope">
                    <el-button @click="patchVideo(scope.row.id)" type="text" size="small">更新</el-button>
                    <el-button @click="deleteVideo(scope.row.id)" type="text" size="small">删除</el-button>
                    <el-button @click="redirect(scope.row.id)" type="text" size="small">查看</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            layout="prev, pager, next"
            :total="total"
            :page-size="pageSize"
            @current-change="fetchVideos">
        </el-pagination>
    </div>
`;

COMPONENTS.VideosAdmin = {
	data: function () {

		var d = {
            pageSize: 10,
            curPage: 0,
            total: 0,
			videos: []
		};

		return d;
	},
	methods: {

		fetchVideos(pageNum){
			tools.xhr('/pageVideos', function(resData){
                this.videos = resData.datalist;
                this.total = resData.total;
                this.curPage = pageNum;
			}.bind(this), 'get', {
                pageNum: pageNum - 1,
                pageSize: this.pageSize
            });
        },

        patchVideo: function(id){
            location.href = `#/uploadAdmin?vId=${id}`;
        },
        
        deleteVideo: function(id){
            this.$confirm('确定删除', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function(){
                tools.xhr('/video/' + id, function(resData){
                    this.fetchVideos(this.curPage);
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                }.bind(this), 'delete');
            }.bind(this)).catch(function(){
            });
        },

        redirect: function(id){
            location.href="#/videos/"+id;
        }
	},

    template: temp.videosAdmin,
    
    mounted: function(){
        this.fetchVideos(1);
    }
};

routeConfig.push(
    { path: '/videosAdmin', component: COMPONENTS.VideosAdmin},
);

temp.albumsAdmin =  `
    <div>
        <h2>视频列表</h2>

        <el-table
        :data="albums"
        style="width: 100%">
            <el-table-column
                prop="id"
                label="id">
            </el-table-column>
            
            <el-table-column
                prop="sport_id"
                label="运动">
            </el-table-column>
            <el-table-column
                prop="author_id"
                label="制作者编号">
            </el-table-column>
            <el-table-column
                prop="name"
                label="标题">
            </el-table-column>
            <el-table-column
                prop="tag"
                label="标签">
            </el-table-column>
            <el-table-column
                prop="impression"
                label="观看次数">
            </el-table-column>
            <el-table-column
                prop="update_time"
                label="更新时间">
            </el-table-column>

            <el-table-column
                fixed="right"
                label="操作"
                width="200">
                <template slot-scope="scope">
                    <el-button @click="patchVideo(scope.row.id)" type="text" size="small">更新</el-button>
                    <el-button @click="deleteVideo(scope.row.id)" type="text" size="small">删除</el-button>
                    <el-button @click="redirect(scope.row.id)" type="text" size="small">查看</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            layout="prev, pager, next"
            :total="total"
            :page-size="pageSize"
            @current-change="fetchAlbums">
        </el-pagination>
    </div>
`;

COMPONENTS.AlbumsAdmin = {
	data: function () {

		var d = {
            pageSize: 10,
            curPage: 0,
            total: 0,
			albums: []
		};

		return d;
	},
	methods: {

		fetchAlbums(pageNum){
            // 分页专辑
			tools.xhr('/albums', function(resData){
                this.albums = resData.datalist;
                this.total = resData.total;
                this.curPage = pageNum;
			}.bind(this), 'get', {
                pageNum: pageNum - 1,
                pageSize: this.pageSize
            });
        },

        patchVideo: function(id){
            location.href = `#/uploadAdmin?vId=${id}`;
        },
        
        deleteVideo: function(id){
            this.$confirm('确定删除', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function(){
                tools.xhr('/video/' + id, function(resData){
                    this.fetchAlbums(this.curPage);
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                }.bind(this), 'delete');
            }.bind(this)).catch(function(){
            });
        },

        redirect: function(id){
            location.href="#/videos/"+id;
        }
	},

    template: temp.albumsAdmin,
    
    mounted: function(){
        this.fetchAlbums(1);
    }
};

routeConfig.push(
    { path: '/albumsAdmin', component: COMPONENTS.AlbumsAdmin},
);

temp.sportsAdmin =  `
    <div>
        <h2>运动列表</h2>

        <el-table
        :data="sports"
        style="width: 100%">
            <el-table-column
                prop="id"
                label="id">
            </el-table-column>
            
            <el-table-column
                prop="name"
                label="名称">
            </el-table-column>

            <el-table-column
                prop="impression"
                label="观看次数">
            </el-table-column>

            <el-table-column
                prop="update_time"
                label="更新时间">
            </el-table-column>

            <el-table-column
                fixed="right"
                label="操作"
                width="200">
                <template slot-scope="scope">
                    <el-button @click="patchVideo(scope.row.id)" type="text" size="small">更新</el-button>
                    <el-button @click="deleteVideo(scope.row.id)" type="text" size="small">删除</el-button>
                    <el-button @click="redirect(scope.row.id)" type="text" size="small">查看</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            layout="prev, pager, next"
            :total="total"
            :page-size="pageSize"
            @current-change="fetchSports">
        </el-pagination>
    </div>
`;

COMPONENTS.SportsAdmin = {
	data: function () {

		var d = {
            pageSize: 10,
            curPage: 0,
            total: 0,
			sports: []
		};

		return d;
	},
	methods: {

		fetchSports(pageNum){
            // 分页专辑
			tools.xhr('/sports', function(resData){
                this.sports = resData.datalist;
                this.total = resData.total;
                this.curPage = pageNum;
			}.bind(this), 'get', {
                pageNum: pageNum - 1,
                pageSize: this.pageSize
            });
        },

        patchVideo: function(id){
            location.href = `#/uploadAdmin?vId=${id}`;
        },
        
        deleteVideo: function(id){
            this.$confirm('确定删除', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function(){
                tools.xhr('/video/' + id, function(resData){
                    this.fetchSports(this.curPage);
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                }.bind(this), 'delete');
            }.bind(this)).catch(function(){
            });
        },

        redirect: function(id){
            location.href="#/videos/"+id;
        }
	},

    template: temp.sportsAdmin,
    
    mounted: function(){
        this.fetchSports(1);
    }
};

routeConfig.push(
    { path: '/sportsAdmin', component: COMPONENTS.SportsAdmin},
);$(function(){

	var navInstance = new Vue(COMPONENTS.HeaderComponent);

	var asideInstance = new Vue(COMPONENTS.AsideComponent);

	var mainRouter = new VueRouter({
		routes: routeConfig
	});
	
	mainRouter.beforeEach((to, from, next) => {
		console.log(from.fullPath, '==>', to.fullPath);
		next();
	});
	
	var mainInstance = new Vue({
		router: mainRouter,
	}).$mount('#main-router-view');

});