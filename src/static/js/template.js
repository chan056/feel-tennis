var temp = {
    header: `
        <el-row>
            <el-col :span="6">
                <a href="#/sports">
                    <img src="/img/logo.jpg" alt="">
                </a>

                <a href="#/feedback">意见&建议</a>
                
                <!-- <router-link :to="{path: '/sports/1' }">xxx</router-link>  -->
            </el-col>

            <el-col :span="6" :offset="12">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-row>
                        <el-col :span=16>
                            <el-form-item label="" prop="name">
                                <el-input v-model="ruleForm.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span=6 :offset=2>
                                <el-button type="primary" @click="submitForm('ruleForm')">查询</el-button>
                        </el-col>
                    </el-row>

                </el-form>
            </el-col>
        </el-row>
    `,
    // VISITOR
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
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/sports/' + crumb.id }">{{crumb.name}}</el-breadcrumb-item>
            </el-breadcrumb>
            <ol>
                <li v-for="album in albumList">
                    <router-link v-on:click="alert(album.name)" :to="{path: '/albums/'+ album.id }">{{ album.name }}</router-link> 
                </li>
            </ol>
        </div>
    `,

    album: `
        <div>
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/sports/' + crumb.sId }">{{crumb.sName}}</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/albums/' + crumb.aId }">{{crumb.aName}}</el-breadcrumb-item>
            </el-breadcrumb>
            <h2>Feel Tennis</h2>
            <div class="tags">
                <el-button round v-for="tag in tags" >
                    <router-link :to="{path: '/videos?tagId=' + tag.id}">{{tag.name}}</router-link>
                </el-button>
            </div>
            <ul class="list">
                <li v-for="video in albumVideoList">
                    <router-link :to="{path: '/video/'+ video.id }">{{ video.headline }}</router-link>
                </li>
            </ul>
        </div>
    `,

    video: `
        <div>
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/sports/' + crumb.sId }">{{crumb.sName}}</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/albums/' + crumb.aId }">{{crumb.aName}}</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/video/' + crumb.vId }">{{crumb.vHeadline}}</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="tags">
                <el-button round v-for="tag in tags" >
                    <router-link :to="{path: '/videos?tagId=' + tag.id}">{{tag.name}}</router-link>
                </el-button>
            </div>
            <div id="palyer-wrapper">
                <video id="video" controls="controls" height="400">Not support this browser, please use Chrome.</video>
                <p class="subtitle"></p>
            </div>
            <div>
                <input type="button" value="开始截图" @click="captureCountdown()" id="capture-btn" class=""/>
                <!--<el-button @click="captureCountdown()">开始截图</el-button>-->
                <!--<el-button @click="capture()">暂停截图</el-button>-->
                <el-button v-if="gifLink" @click="preview()">预览</el-button>
            </div>

            <el-dialog
                title="动态截图预览"
                :visible.sync="previewerVisible"
                width="30%"
                >
                <p v-if="gifLink" style="text-align: center;">
                    <img v-bind:src="gifLink" />
                </p>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="previewerVisible = false">确 定</el-button>
                </span>
            </el-dialog>

        </div>
    `,

    videos: `
        <div>
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/sports' }">首页</el-breadcrumb-item>
            </el-breadcrumb>
            
            <el-row :gutter="20">
                <el-col :span="6" v-for="video in videos">
                    <div class="grid-content bg-purple">
                        <el-card :body-style="{ padding: '0px' }">
                            <router-link :to="{path: '/video/' + video.id}">
                                <img src="/img/logo.jpg" class="image">
                            </router-link>
                            <div style="padding: 14px;">
                                <span>{{video.headline}}</span>
                                <div class="bottom clearfix">
                                    <time class="time">date</time>
                                    <el-button type="text" class="button">操作按钮</el-button>
                                </div>
                            </div>
                        </el-card>
                    </div>
                </el-col>
            </el-row>
        </div>
    `,
    
    // ADMIN
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
                
                <el-button v-on:click="" @click="newTagDialogConfig.visibility = true">新建Tag</el-button>
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
                        <el-button size="small" type="primary">点击上传</el-button>
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
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-col>
            </el-row>

            <el-row>
                <el-button v-on:click="postVedio" >提交</el-button>
            </el-row>

            <el-dialog v-bind:title="newTagDialogConfig.title" :visible.sync="newTagDialogConfig.visibility">
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
                    <el-button @click="newTagDialogConfig.visibility = false">取 消</el-button>
                    <el-button type="primary" @click="newTagDialogConfig.visibility = false; postTag();">确 定</el-button>
                </div>
            </el-dialog>
        </div>
     `,

    feedback: `
        <div style="width: 600px; margin: auto; border: 1px solid; padding: 10px 20px;">
            <h2 class="ovh" style="border-bottom: 1px solid;">
                <span class="fl">发生了什么</span>
                <i class="fr el-icon-back" @click="goback()" style="cursor: pointer;"></i>
            </h2>

            <el-form ref="form" :rules="rules" :model="form" label-width="80px" >
                <el-form-item label="" label-width="0" prop="desc">
                    <el-input type="textarea" v-model="form.desc"></el-input>
                </el-form-item>

                <h3>其他信息（选填）</h3>
                <el-form-item label="网址" prop="site">
                    <el-input v-model="form.site"></el-input>
                </el-form-item>
                <el-form-item label="电子邮件" prop="email">
                    <el-input v-model="form.email"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-upload
                        class="upload-demo"
                        action="/upload"
                        :data="{type:'feedback'}"
                        :on-remove="handleRemove"
                        :on-success="handleSuccess"
                        multiple
                        :limit="3"
                        :on-exceed="handleExceed"
                        :file-list="fileList"
                        >
                        <el-button size="" type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item>
                
                <el-form-item>
                    <el-button class="fr" type="primary" @click="submitForm('form')">发送</el-button>
                    <el-button class="fr" style="margin-right: 10px;" @click="resetForm('form')">重置</el-button>
                </el-form-item>
            </el-form>
            <!-- {{form}}
            {{files}} -->
        </div>
        
    `
}