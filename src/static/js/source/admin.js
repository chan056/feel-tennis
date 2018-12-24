temp.uploadAdmin =  `
    <div class="upload-wrapper">
        <h2>视频上传</h2>

        <el-row v-if="!vId && !aId && !sId">
            <el-col :span="4">
            </el-col>

            <el-col :span="10">
                <el-checkbox v-model="isTutorial">教程视频</el-checkbox>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="4">
                <label>运动</label>
            </el-col>

            <el-col :span="10">
                <el-select 
                :disabled="!videoEditable"
                v-model="sportId" 
                clearable 
                placeholder="请选择" 
                @change="handleChooseSport">
                    <el-option
                        v-for="item in sports"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-col>
            
            <el-button v-show="videoEditable" @click="newSportConfig.visibility=true" class="new-sport-btn">新建运动</el-button>
        </el-row>

        <el-row v-if="isTutorial">
            <el-col :span="4">
                <label>专辑</label>
            </el-col>

            <el-col :span="10">
                <el-select 
                :disabled="!videoEditable"
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
            
            <el-button v-show="videoEditable" @click="openAlbumDialog();" class="new-album-btn">新建专辑</el-button>
        </el-row>

        <el-row v-if="selectedMaker">
            <el-col :span="4">
                <label>专辑作者</label>
            </el-col>
            <el-col :span="10">
                <el-input v-model="selectedMaker" :disabled="!!selectedMaker" placeholder="请输入作者"></el-input>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="4">
                <label>标题</label>
            </el-col>

            <el-col :span="10">
                <el-input :disabled="!videoEditable" v-model="SO.headline" placeholder="请输入标题"></el-input>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="4">
                <label>英文标题</label>
            </el-col>

            <el-col :span="10">
                <el-input :disabled="!videoEditable" v-model="SO.headlineEng" placeholder="请输入英文标题"></el-input>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="4">
                <label>标签</label>
            </el-col>
            <el-col :span="10">
                <el-select v-model="SO.tag"
                    :disabled="!videoEditable" 
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
            
            <el-button v-show="videoEditable" v-on:click="" @click="tagConfig.visibility = true" class="new-tag-btn">新建标签</el-button>
        </el-row>

        <el-row>
            <el-col :span="4">
                <label>视频</label>
            </el-col>

            <el-col :span="10">
                <el-upload
                    v-show="videoEditable"
                    class="upload-demo"
                    action="/api/upload"
                    accept="video/*"
                    :data="{type:'video'}"
                    :on-preview="handlePreview"
                    :on-remove="handleVideoRemove"
                    :on-success="handleVideoSuccess"
                    :before-upload="handleBeforeUpload"
                    :limit="1"
                    :on-exceed="handleExceed"
                    :file-list="videoFileList"
                    >
                    <el-button size="small" type="primary">上传视频</el-button>
                </el-upload>
                <el-input v-show="!videoEditable" :value="vId+videoInfo.video_ext" disabled/>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="4">
                <label>字幕</label>
            </el-col>

            <el-col :span="10">
                <el-upload
                    v-show="videoEditable"
                    class="upload-demo"
                    action="/api/upload"
                    accept=".srt"
                    :data="{type:'subtitle'}"
                    :on-remove="handleSubtitleRemove"
                    :on-success="handleSubtitleSuccess"
                    :limit="1"
                    :on-exceed="handleExceed"
                    :file-list="subtitleFileList"
                    >
                    <el-button size="small" type="primary">上传字幕</el-button>
                </el-upload>
                <el-input v-show="!videoEditable" :value="vId+'.srt'" disabled/>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="4">
                <label>翻译</label>
            </el-col>

            <el-col :span="10">
                <el-radio :disabled="!videoEditable" v-model="SO.needTranslated" label="1">需要</el-radio>
                <el-radio :disabled="!videoEditable" v-model="SO.needTranslated" label="0">不需要</el-radio>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="4">&nbsp;</el-col>
            <el-col :span="10">
                <el-button v-show="videoEditable && (vId || SO.videoAbsPath)" v-on:click="vId?putVideo(): postVideo()" class="new-video-btn">提交</el-button>
                <el-button v-show="!videoEditable" v-on:click="videoEditable=true;" class="new-video-btn">编辑</el-button>
            </el-col>
        </el-row>

        <el-dialog v-bind:title="newSportConfig.title" :visible.sync="newSportConfig.visibility" @close="sId && (newSportConfig.visibility=true)">
            <el-form class="newTagDialog">
                <el-form-item label="运动名称">
                    <el-input v-model="newSport.name" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" v-show="!sId">
                <el-button @click="newSportConfig.visibility = false">取 消</el-button>
                <el-button type="primary" @click="newSportConfig.visibility = false; postSport();">确 定</el-button>
            </div>

            <div slot="footer" class="dialog-footer" v-show="sId">
                <el-button type="primary" @click="newSportConfig.visibility = false; putSport()">确 定</el-button>
                <el-button @click="backToSportList()">返 回</el-button>
            </div>
        </el-dialog>

        <el-dialog v-bind:title="albumConfig.title" :visible.sync="albumConfig.visibility" @close="aId && (albumConfig.visibility = true)">
            <el-form class="newAlbumDialog">
                <el-form-item label="运动项目">
                    <el-select v-model="newAlbum.sportId" 
                        :disabled="!albumEditable"
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
                        :disabled="!albumEditable"
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
                    <el-button @click="makerConfig.visibility=true" v-show="!aId || (aId && albumEditable)">创建</el-button>
                </el-form-item>
                <el-form-item label="标签">
                    <el-select v-model="newAlbum.tag" 
                        :disabled="!albumEditable"
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
                    <el-input v-model="newAlbum.name" :disabled="!albumEditable" auto-complete="off" style="width: 217px;"></el-input>
                </el-form-item>
                <el-form-item label="" v-if="!aId">
                    <el-upload
                        class="album-cover-uploader"
                        action="/api/upload"
                        :data="{type:'img'}"
                        :on-remove="handleAlbumCoverRemove"
                        :on-success="handleAlbumCoverSuccess"
                        :limit="1"
                        :on-exceed="handleExceed"
                        :file-list="albumCoverfileList"
                        >
                        <el-button size="" type="primary">上传封面</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="" v-if="aId">
                    <el-upload
                        v-show="albumEditable"
                        class="album-cover-uploader"
                        action="/api/upload"
                        :data="{type:'img'}"
                        :on-remove="handleAlbumCoverRemove"
                        :on-success="handleAlbumCoverSuccess"
                        :limit="1"
                        :on-exceed="handleExceed"
                        :file-list="albumCoverfileList"
                        >
                        <el-button size="" type="primary">上传封面</el-button>
                    </el-upload>
                    <img v-show="!albumEditable" :src="'/img/cover/album/' + aId + '.jpg'"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" v-show="!aId">
                <el-button @click="albumConfig.visibility = false">取 消</el-button>
                <el-button type="primary"  @click="albumConfig.visibility = false; postAlbum();">确 定</el-button>
            </div>

            <div slot="footer" class="dialog-footer" v-show="aId">
                <el-button type="primary" v-show="albumEditable" @click="albumConfig.visibility = false; putAlbum()">确 定</el-button>
                <el-button type="primary" @click="albumEditable=true" v-show="!albumEditable">编辑</el-button>
                <el-button @click="backToAlbumList()">返 回</el-button>
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
	props: ['vId', 'aId', 'sId', 'isIntro'],
	data: function () {
        let newSportConfig = {
            visibility: false,
            title: '新建运动'
        };

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
            isTutorial: true,
            sportId: null,
            SO: {
                albumId: '',
                headline: '',
                headlineEng: '',
                tag: '',
                videoAbsPath: '',
                subtitleAbsPath: '',
                needTranslated: '1'
            }, 
			albums: [], 
			tags: [], 
			sports: [], 
            makers: [],
            newSportConfig: newSportConfig,
			tagConfig: tagConfig, 
			albumConfig: albumConfig,
            makerConfig: makerConfig,
            
            newSport:{},
			newTag: {},
            newAlbum: {sportId: '', maker: '', tag: '', name: '', cover: ''},// 必须要给默认值？
			newMaker:{},
            selectedMaker: '',

            videoInfo: {},
            // albumInfo: {},
            sportInfo: {},
            
            videoEditable: true,
            albumEditable: true,

            videoFileList: [],
            subtitleFileList: [],
            albumCoverfileList: []
        };
        
        if(this.vId){
            d.videoEditable = false;
        }else if(this.aId){
            d.albumEditable = false;
        }else if(this.sId){
            d.newSportConfig = {
                title: '编辑运动',
                visibility: true
            }
        }

		d.fileList = [];

		return d;
    },

	methods: {
        backToAlbumList: function(){
            this.$router.push({ path: 'albumsAdmin'})
        },
        
        backToSportList: function(){
            this.$router.push({ path: 'sportsAdmin'})
        },

		handleVideoRemove(file, fileList) {
            this.SO.videoAbsPath = '';
        },
        
        handleSubtitleRemove(file, fileList) {
            this.SO.subtitleAbsPath = '';
        },
        
        handleAlbumCoverRemove(file, fileList) {
            this.newAlbum.cover = '';
        },
        
		handlePreview(file) {
			console.log(file);
        },
        // 只能传一个文件，视频、字幕、专辑封面
		handleExceed(files, fileList) {
            this.$message.warning(`只能传一个文件`);
			// this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
		},
		handleVideoSuccess(res){
            this.SO.videoAbsPath = res.absPath;
            
        },
        handleBeforeUpload(file){
            this.SO.headlineEng = file.name.split(/\./).shift();
            console.log(arguments)
        },

		handleSubtitleSuccess(res){
			this.SO.subtitleAbsPath = res.absPath;
		},

		handleAlbumCoverSuccess(res){
			this.newAlbum.cover = res.relPath;
        },
        
        handleChooseSport: function(sportId){
            if(sportId)
                this.queryAlbums(sportId);
        },

		postVideo(){
            let so = Object.assign({}, this.SO);
            so.tag = this.SO.tag.join(',');
            
            so.isTutorial = Number(this.isTutorial);

			tools.xhr('/video', function(){
                var message  = `视频$创建成功`;
                
				this.$message({
					message: message,
					type: 'success'
                });

                this.SO.videoAbsPath = '';
                this.SO.subtitleAbsPath = '';
                this.SO.needTranslated = '1';//新建后重置“翻译”选项

                this.videoFileList = [];
                this.subtitleFileList = [];

			}.bind(this), 'post', so);
		},

        
        postSport(){

			tools.xhr('/sport', function(){
                this.$message({
                    message: '新建成功',
                    type: 'success'
                });
                this.querySports();
			}.bind(this), 'post', this.newSport);
			
		},
		postTag(){

			tools.xhr('/tag', function(){
                this.queryTags();
			}.bind(this), 'post', this.newTag);
			
		},

		postMaker(){
			tools.xhr('/maker', function(){
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

				this.queryAlbums(this.sportId);

			}.bind(this), 'post', this.newAlbum);
		},

		queryAlbums(sportId){
            if(!sportId)
                return;

			tools.xhr('/sports/'+sportId+'/albums', function(res){
				this.albums = res;
			}.bind(this));
		},

		queryTags(){
			tools.xhr('/tags', function(res){
				this.tags = res;
			}.bind(this));
		},

		querySports(){
			tools.xhr('/sports', function(res){
				this.sports = res;
			}.bind(this));
		},

		queryMakers(){
			tools.xhr('/makers', function(res){
				this.makers = res;
			}.bind(this));
		},

		chooseAlbumHandler(){
			console.log('chooseAlbumHandler', arguments);
		},

		queryMaker(makerId){
			tools.xhr('/maker/' + makerId, function(res){
				let makerInfo = res[0];
				if(makerInfo){
					this.selectedMaker = res[0].name;
				}else{
					this.selectedMaker = '';
				}
			}.bind(this));
		},

        fetchVideoInfo(fn){
			tools.xhr('/videoInfo/' + this.vId, function(res){
                this.videoInfo = res;

                this.sportId =  res.sport_id;

                this.SO.albumId = res.album_id;
                this.SO.headline = res.headline;
                this.SO.headlineEng = res.headline_eng;
                this.SO.tag = res.tag? res.tag.split(',').map(function(){
                    return Number(arguments[0])
                }): [];
                this.SO.needTranslated = String(res.need_translated);

                fn && fn(res.sportId);
			}.bind(this));
        },

        fetchVideoIntroInfo(){
			tools.xhr('/videoIntroInfo/' + this.vId, function(res){
                this.videoInfo = res;
                this.sportId =  res.sportId;
                this.SO.headline = res.headline;
                this.SO.headlineEng = res.headline_eng;
                this.SO.tag = res.tag? res.tag.split(',').map(function(){
                    return Number(arguments[0])
                }): [];
			}.bind(this));
        },

        fetchAlbumInfo: function(){
            tools.xhr('/albumInfo/' + this.aId, function(res){
                this.newAlbum.sportId = res.sportId;
                this.newAlbum.maker = Number(res.author_id);
                this.newAlbum.tag = Number(res.tag);
                this.newAlbum.name = res.name;
			}.bind(this));
        },

        fetchSportInfo: function(){
            tools.xhr('/sportInfo/' + this.sId, function(res){
                this.newSport.name = res.name;
			}.bind(this));
        },
        
        putVideo(){
			let so = Object.assign({}, this.SO);
            so.tag = this.SO.tag.join(',');

            if(this.isTutorial){
                so.isTutorial = 1;
            }else{
                so.isTutorial = 0;
                so.sportId = this.sportId
            }

			tools.xhr('/video/' + this.vId, function(){
				this.$message({
					message: '视频更新成功',
					type: 'success'
                });
                this.videoEditable = false;

                this.SO.videoAbsPath = '';
                this.SO.subtitleAbsPath = '';

                this.videoFileList = [];
                this.subtitleFileList = [];
			}.bind(this), 'put', so, function(){
                this.SO.subtitleAbsPath = '';
                this.SO.videoAbsPath = '';
            });
        },
        
        putAlbum: function(){
			tools.xhr('/album/' + this.aId, function(){
				this.$message({
					message: '更新成功',
					type: 'success'
                });
                this.albumEditable = false;
                
                this.$router.push({ path: 'albumsAdmin'})
			}.bind(this), 'put', this.newAlbum, function(){
                this.$message({
					message: '更新出错',
					type: 'success'
                });
            });
        },

        putSport: function(){
			tools.xhr('/sport/' + this.sId, function(){
				this.$message({
					message: '更新成功',
					type: 'success'
                });

                this.$router.push({ path: 'albumsAdmin'})
			}.bind(this), 'put', this.newSport, function(){
                this.$message({
					message: '更新出错',
					type: 'success'
                });
            });
        }
	},

	watch: {'vId': function(to, from){
		if(!to && from){
			location.reload();
		}
    }},
    
    mounted: function(){
        tools.togglePageIE(this);
        if(this.vId){
            if(this.isIntro){
                this.fetchVideoIntroInfo()
            }else{
                this.fetchVideoInfo(function(sId){
                    this.queryAlbums(sId);
                }.bind(this));
            }
        }else if(this.aId){
            this.fetchAlbumInfo();
            this.queryMakers();
            this.albumConfig.visibility = true;
            this.albumConfig.title = '更新专辑';
        }else if(this.sId){
            this.fetchSportInfo();
        }
        
        this.querySports();
        this.queryTags();
        
        if(this.isIntro){
            this.isTutorial = false;
        }
    },

	template: temp.uploadAdmin
};

routeConfig.push(
    { 
        path: '/uploadAdmin', 
        meta: {title: '上传'},
        component: COMPONENTS.UploadAdmin, 
        props: function(route){
            return {
                vId: route.query.vId, 
                aId: route.query.aId, 
                sId: route.query.sId, 
                isIntro: route.query.isIntroductory
            }
        },
    },
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
                label="描述"
                :show-overflow-tooltip="true"
                >
            </el-table-column>
            <el-table-column
                prop="site"
                label="网址"
                :show-overflow-tooltip="true"
                >
            </el-table-column>
            <el-table-column
                prop="wechat"
                label="微信"
                :show-overflow-tooltip="true"
                >
            </el-table-column>
            <el-table-column
                prop="email"
                label="邮件"
                :show-overflow-tooltip="true"
                >
            </el-table-column>
            <el-table-column
                prop="files"
                label="文件"
                :show-overflow-tooltip="true"
                >
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                width="100">
                <template slot-scope="scope">
                    <el-button @click="deleteFeedback(scope.row.id)" type="text" size="small">删除</el-button>
                    <!-- <el-button v-if="!scope.row.black_usr_id_record && !scope.row.black_ip_record" @click="blockUsr(scope.row.ip, scope.row.usr_id, $event)" type="text" size="small">加黑</el-button> -->
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
			tools.xhr('/feedbacks', function(res){
                this.feedbacks = res.datalist;
                this.total = res.total;
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
                tools.xhr('/feedback/' + id, function(res){
                    this.fetchFeedbacks(this.curPage);
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                }.bind(this), 'delete');
            }.bind(this)).catch(function(){

            });
        },

       /*  blockUsr: function(ip, usrId, e){
            this.$confirm('确认加黑？')
            .then(function(){
                tools.xhr('/blockedUsr', function(res){
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
        } */
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

        tools.togglePageIE(this);
        this.fetchFeedbacks(1);
    }
};

routeConfig.push(
    { 
        path: '/feedbacksAdmin',
        meta: {title: '反馈管理'},
        component: COMPONENTS.FeedbacksAdmin
    },
);

temp.videosAdmin =  `
    <div class="admin-video-list">
        <h2>教程类</h2>

        <el-table
        :data="videos"
        :row-class-name="tableRowStatus"
        :highlight-current-row=true
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
                label="headline"
                :show-overflow-tooltip="true"
                >
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
                    <el-button @click="toggle(scope.row.id, scope.row.hidden, $event)" type="text" size="small">{{scope.row.hidden? '显示': '隐藏'}}</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            layout="prev, pager, next"
            :total="total"
            :page-size="pageSize"
            :current-page="Number(curPage)"
            @current-change="fetchVideos">
        </el-pagination>

        <h2>运动介绍类</h2>

        <el-table
        :data="videosIntro"
        style="width: 100%">
            <el-table-column
                prop="id"
                label="id">
            </el-table-column>

            <el-table-column
                prop="headline"
                label="headline"
                :show-overflow-tooltip="true"
                >
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
                    <el-button @click="patchVideo(scope.row.id, 1)" type="text" size="small">更新</el-button>
                    <el-button @click="deleteIntroVideo(scope.row.id)" type="text" size="small">删除</el-button>
                    <el-button @click="redirect(scope.row.id, 1)" type="text" size="small">查看</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            layout="prev, pager, next"
            :total="totalIntro"
            :page-size="pageSizeIntro"
            :current-page="Number(curPageIntro)"
            @current-change="fetchIntroVideos">
        </el-pagination>
    </div>
`;

COMPONENTS.VideosAdmin = {
	data: function () {

		var d = {
            pageSize: 10,
            total: 0,
            curPage: 1,
            videos: [],
            
            pageSizeIntro: 10,
            totalIntro: 0,
            curPageIntro: 1,
			videosIntro: []
		};

		return d;
	},
	methods: {

		fetchVideos(pageNum){
			tools.xhr('/videosAdmin', function(res){
                this.videos = res.datalist;
                this.total = res.total;
                this.curPage = pageNum;

                this.$router.push({ path: 'videosAdmin', query: { p1: this.curPage, p2: this.curPageIntro }})
			}.bind(this), 'get', {
                pageNum: pageNum - 1,
                pageSize: this.pageSize
            });
        },

        tableRowStatus({row, rowIndex}){
            if(row.hidden){
                return 'row-disabled'
            }

            return ''
        },

        fetchIntroVideos(pageNum){
			tools.xhr('/videosIntroAdmin', function(res){
                this.videosIntro = res.datalist;
                this.totalIntro = res.total;
                this.curPageIntro = pageNum;

                this.$router.push({ path: 'videosAdmin', query: { p1: this.curPage, p2: this.curPageIntro }})
			}.bind(this), 'get', {
                pageNum: pageNum - 1,
                pageSize: this.pageSizeIntro
            });
        },

        patchVideo: function(id, isIntroductory){
            if(!isIntroductory){
                this.$router.push({ path: 'uploadAdmin', query: { vId: id }})
            }else{
                this.$router.push({ path: 'uploadAdmin', query: { vId: id, isIntroductory: isIntroductory }})
            }
        },
        
        deleteVideo: function(id){
            let t = this;
            t.$confirm('确定删除', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function(){
                tools.xhr('/video/' + id, function(res){
                    t.fetchVideos(t.curPage);
                    t.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                }, 'delete');
            }).catch(function(){

            });
        },

        deleteIntroVideo: function(id){
            let t = this;
            t.$confirm('确定删除', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function(){
                tools.xhr('/video_introductory/' + id, function(res){
                    t.fetchIntroVideos(t.curPageIntro);
                    t.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                }, 'delete');
            }).catch(function(){
                
            });
        },

        redirect: function(id, isIntroductory){
            if(!isIntroductory){
                this.$router.push({path: `/videos/${id}`})
            }else{
                location.href = '/page/intro_tennis.html'
            }
        },

        toggle: function(id, hidden, e){
            tools.xhr('/toggleVideo', function(res){
                this.fetchVideos(this.curPage)
            }.bind(this), 'patch', {
                vId: id,
                hidden: hidden
            });
        }
	},

    template: temp.videosAdmin,
    
    mounted: function(){
        let p1 = this.$route.query.p1 || 1;
        let p2 = this.$route.query.p2 || 1;

        // this.curPage = p1 || 1;
        // this.curPageIntro = p2 || 1;

        tools.togglePageIE(this);
        this.fetchVideos(p1);
        this.fetchIntroVideos(p2);
    }
};

routeConfig.push(
    { 
        path: '/videosAdmin', 
        meta: {title: '视频管理'},
        component: COMPONENTS.VideosAdmin
    },
);

temp.albumsAdmin =  `
    <div>
        <h2>专辑列表</h2>

        <el-table
        :data="albums"
        style="width: 100%">
            <el-table-column
                prop="id"
                label="id">
            </el-table-column>
            
            <el-table-column
                prop="sportId"
                label="运动">
            </el-table-column>
            <el-table-column
                prop="author_id"
                label="制作者编号">
            </el-table-column>
            <el-table-column
                prop="name"
                label="标题"
                :show-overflow-tooltip="true"
                >
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
                    <el-button @click="patchAlbum(scope.row.id)" type="text" size="small">更新</el-button>
                    <el-button @click="deleteAlbum(scope.row.id)" type="text" size="small">删除</el-button>
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
			tools.xhr('/albums', function(res){
                this.albums = res.datalist;
                this.total = res.total;
                this.curPage = pageNum;
			}.bind(this), 'get', {
                pageNum: pageNum - 1,
                pageSize: this.pageSize
            });
        },

        patchAlbum: function(id){
            this.$router.push({ path: 'uploadAdmin', query: { aId: id } })
        },
        
        deleteAlbum: function(id){
            this.$confirm('确定删除', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function(){
                tools.xhr('/album/' + id, function(res){
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
            this.$router.push({ path: "/albums/" + id })
        }
	},

    template: temp.albumsAdmin,
    
    mounted: function(){
        tools.togglePageIE(this);
        this.fetchAlbums(1);
    }
};

routeConfig.push(
    { 
        path: '/albumsAdmin', 
        meta: {title: '专辑管理'},
        component: COMPONENTS.AlbumsAdmin
    },
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
                    <el-button @click="patchSport(scope.row.id)" type="text" size="small">更新</el-button>
                    <el-button @click="deleteSport(scope.row.id)" type="text" size="small">删除</el-button>
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
			tools.xhr('/sports', function(res){
                this.sports = res.datalist;
                this.total = res.total;
                this.curPage = pageNum;
			}.bind(this), 'get', {
                pageNum: pageNum - 1,
                pageSize: this.pageSize
            });
        },

        patchSport: function(id){
            this.$router.push({ path: `/uploadAdmin?sId=${id}`, query: { sId: id }})
        },
        
        deleteSport: function(id){
            this.$confirm('确定删除', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function(){
                tools.xhr('/sport/' + id, function(res){
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
            this.$router.push({ path: 'sports/' + id})
        }
	},

    template: temp.sportsAdmin,
    
    mounted: function(){
        tools.togglePageIE(this);
        this.fetchSports(1);
    }
};

routeConfig.push(
    { 
        path: '/sportsAdmin', 
        meta: {title: '运动管理'},
        component: COMPONENTS.SportsAdmin
    },
);