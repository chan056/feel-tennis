var temp = {
    header: `
        <div id="header">
            <el-row>
                <el-col :span="3">
                    <i class="el-icon-menu aside-menu-btn"></i>
                    <a href="#/sports" id="logo"></a>
                    
                </el-col>

                <el-col :span="9">
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm"  class="">
                        <el-row>
                            <el-col :span=20>
                                <el-form-item label="" prop="name">
                                    <el-input v-model="ruleForm.name"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span=4>
                                <el-button style="width: 100%;" icon="el-icon-search" @click="submitForm('ruleForm')"></el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>

                <el-col :span="6" :offset="6" class="masthead">
                    <i class="el-icon-view"></i>
                    <i class="el-icon-news"></i>
                </el-col>
            </el-row>
        </div>
    `,

    aside: `
        <div id="aside">
            <div class="guide-section">
                <div class="guide-entry">
                    <a href="#/feedback" class="guide-entry-renderer">
                        <i class="el-icon-service icon"></i>
                        <span class="text">发送反馈</span>
                    </a>
                </div>
            </div>
            
            <div id="footer">
                <a class="guide-links-primary" href="#/feedback">关于</a>
                <a class="guide-links-primary" href="#/feedback">1</a>
                <a class="guide-links-primary" href="#/feedback">2</a>
            </div>
            <div id="llc">
                <span class="">2018 ChanTube</span>
            </div>
        </div>
    `,
    // VISITOR
    sports: `
        <div id="album-list">
            <ul class="block-list spt-list">
                <li class="" v-for="sport in sports">
                    <router-link :to="{path: '/sports/'+ sport.id }" :title="sport.name">
                        <img src="/img/logo.jpg" class="block-thumb spt-thumb"/>
                        <p class="clearfix">
                            <span class="play-count fl">100次观看</span>
                            <span class="update-time fr">1周前</span>
                        </p>
                    </router-link>
                </li>
            </ul>
        </div>
    `,
    
    albumList: `
        <div id="album-list">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/sports/' + crumb.id }">{{crumb.name}}</el-breadcrumb-item>
            </el-breadcrumb>
            <ul class="block-list">
                <li v-for="album in albumList">
                    <router-link v-on:click="alert(album.name)" :to="{path: '/albums/'+ album.id }">
                        <img src="/img/logo.jpg" class="block-thumb album-thumb"/>
                        <h3 class="block-title album-title">
                            {{ album.name }}
                        </h3>
                        <div>author 关于作者</div>
                        <p class="clearfix">
                            <span class="play-count fl">10次观看</span>
                            <span class="update-time fr">1周前</span>
                        </p>
                    </router-link>
                </li>
            </ul>
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
            <ul class="block-list">
                <li v-for="video in albumVideoList">
                    <router-link :to="{path: '/video/'+ video.id }">
                        <img src="/img/logo.jpg" class="block-thumb video-thumb"/>
                        <h3 class="block-title video-title">
                            {{ video.headline }}</router-link>
                        </h3>
                        <div>author</div>
                        <p class="clearfix">
                            <span class="play-count fl">5次观看</span>
                            <span class="update-time fr">2周前</span>
                        </p>
                    </router-link>
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
            
            <ul class="block-list">
                <li v-for="video in videos">
                    <router-link :to="{path: '/video/' + video.id}">
                        <img src="/img/logo.jpg" class="block-thumb video-thumb"/>
                        <h3 class="block-title video-title">
                            {{ video.headline }}
                        </h3>
                        <div>author</div>
                        <p class="clearfix">
                            <span class="play-count fl">1次观看</span>
                            <span class="update-time fr">2周前</span>
                        </p>
                    </router-link>
                </li>
            </ul>
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