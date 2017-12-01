var temp = {
    sports: `
        <div id="album-list">
            <ol>
                <li v-for="sport in sports">
                    <router-link :to="{path: '/sports/'+ sport.id }">{{ sport.name }}</router-link> 
                </li>
            </ol>
        </div>
    `,
    albumList: `
        <div id="album-list">
            <ol>
                <li v-for="album in albumList">
                    <router-link :to="{path: '/albums/'+ album.id }">{{ album.name }}</router-link> 
                </li>
            </ol>
        </div>
    `,
    album: `
        <div>
            <h2>Feel Tennis</h2>
            <ul class="list">
                <li v-for="video in albumVideoList">
                    <router-link :to="{path: '/videos/'+ video.album_id }">{{ video.headline }}</router-link>
                </li>
            </ul>
        </div>
    `
    ,
    video: `
        <div>
            <h2>{{video.headline}}</h2>
            <video v-bind:src="src" controls="controls" >
                Not support this browser, please use Chrome.
            </video>
        </div>
     `,

     upload: `
        <div>
            <h2>视频上传页面</h2>

            <el-row>
                <el-col :span="4">
                    <label>专辑</label>
                </el-col>

                <el-col :span="4">
                    <el-select v-model="SO.albumId" clearable placeholder="请选择">
                        <el-option
                            v-for="item in albums"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
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
                
                <el-button v-on:click="">新建Tag</el-button>
            </el-row>

            <el-row>
                <el-col :span="4">
                    <label>文件</label>
                </el-col>

                <el-col :span="4">
                    <el-upload
                        class="upload-demo"
                        action="/upload/video"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :on-success="handleSuccess"
                        multiple
                        :limit="3"
                        :on-exceed="handleExceed"
                        :file-list="fileList"
                        >
                        <el-button size="small" type="primary">点击上传</el-button>
                        <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
                    </el-upload>
                </el-col>
            </el-row>

            <el-row>
                <el-button v-on:click="alert" >提交</el-button>
            </el-row>

            {{SO}}
        </div>
     `
     
}