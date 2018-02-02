temp.upload =  `
    <div>
        <h2>视频上传页面</h2>

        <el-row>
            <el-col :span="4">
                <label>专辑</label>
            </el-col>

            <el-col :span="4">
                <el-select v-model="SO.albumId" clearable placeholder="请选择" @command="chooseAlbumHandler">
                    <el-option
                        v-for="item in albums"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-col>
            
            <el-button @click="openAlbumDialog();" class="new-album-btn">新建Album</el-button>
        </el-row>

        <el-row v-if="selectedMaker">
            <el-col :span="4">
                <label>专辑作者</label>
            </el-col>
            <el-col :span="4">
                <el-input v-model="selectedMaker" :disabled="!!selectedMaker" placeholder="请输入标题"></el-input>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="4">
                <label>Headline</label>
            </el-col>

            <el-col :span="4">
                <el-input v-model="SO.headline" placeholder="请输入标题"></el-input>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="4">
                <label>Tag</label>
            </el-col>

            <el-col :span="4">
                <el-select v-model="SO.tag" 
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
            
            <el-button v-on:click="" @click="tagConfig.visibility = true" class="new-tag-btn">新建Tag</el-button>
        </el-row>

        <el-row>
            <el-col :span="4">
                <label>视频</label>
            </el-col>

            <el-col :span="4">
                <el-upload
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
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="4">
                <label>字幕</label>
            </el-col>

            <el-col :span="4">
                <el-upload
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
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="4">&nbsp;</el-col>
            <el-col :span="4">
                <el-button v-on:click="postVedio" class="new-video-btn">提交</el-button>
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

		let makerConfig = {
			visibility: false,
			title: '新建制作者',
		};

		var d = {
			SO: {}, 
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

		handleAlbumCoverSuccess(res){
			debugger;
			this.newAlbum.cover = res.relPath;
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

	},

	watch: {'SO.albumId': function(to, from){
		if(to){
			this.queryMaker(to)
		}else{
			this.selectedMaker = '';
		}
	}},

	template: temp.upload
};

routeConfig.push(
    { path: '/upload', component: Upload, props: true, },
);
    