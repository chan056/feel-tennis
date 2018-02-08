var temp = {
    header: `
        <div id="header">
            <el-row>
                <el-col :span="4">
                    <i class="el-icon-menu aside-menu-btn"></i>
                    <a href="#/sports" id="logo"></a>
                </el-col>

                <el-col :span="9">
                    <el-form :model="searchForm" :rules="rules" ref="searchForm"  class="" id="searchForm">
                        <el-row>
                            <el-col :span=20>
                                <el-form-item label="" prop="name">
                                    <el-input v-model="searchForm.name"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span=4>
                                <el-button style="width: 100%;" icon="el-icon-search" @click="submitForm('searchForm')"></el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>

                <el-col :span="6" :offset="5" class="masthead">
                    <el-dropdown id="usr-btns" class="fr" @command="handleUsrBtns">
                        <i class="el-icon-view" title="" @click=""></i>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-if="!loginUsrInfo.name" command="login">登录</el-dropdown-item>
                            <el-dropdown-item v-if="!loginUsrInfo.name" command="regist">注册</el-dropdown-item>
                            <el-dropdown-item v-if="loginUsrInfo.name" command="datum">资料</el-dropdown-item>
                            <el-dropdown-item v-if="loginUsrInfo.name"command="logout">登出</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>

                    <i class="el-icon-news" title="消息"></i>
                </el-col>
            </el-row>

            <el-dialog title="注册" :visible.sync="registForm.visible">
                <el-form :model="registForm">
                    <el-form-item label="用户名" :label-width="registForm.formLabelWidth">
                        <el-input v-model="registForm.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" :label-width="registForm.formLabelWidth">
                        <el-input v-model="registForm.psw" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="registForm.visible = false">取 消</el-button>
                    <el-button type="primary" @click="registForm.visible = true; regist();">注 册</el-button>
                </div>
            </el-dialog>

            <el-dialog title="登录" :visible.sync="loginForm.visible">
                <el-form :model="loginForm">
                    <el-form-item label="用户名" :label-width="loginForm.formLabelWidth">
                        <el-input v-model="loginForm.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" :label-width="loginForm.formLabelWidth">
                        <el-input v-model="loginForm.psw" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="loginForm.visible = false;">取 消</el-button>
                    <el-button type="primary" @click="loginForm.visible = true; login();">登 录</el-button>
                </div>
            </el-dialog>

            <el-dialog
                title="登出"
                :visible.sync="logoutForm.visible"
                width="30%"
                :before-close="beforeLogout">
                <span>确认登出</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="logoutForm.visible = false">取 消</el-button>
                    <el-button type="primary" @click="logoutForm.visible = false; logout();">确 定</el-button>
                </span>
                </el-dialog>
        </div>
    `,

    aside: `
        <div id="aside">
            <div class="guide-section">
                <div class="guide-entry" id="feedback-entry">
                    <a href="#/feedback" class="guide-entry-renderer">
                        <i class="el-icon-service icon"></i>
                        <span class="text">发送反馈</span>
                    </a>
                </div>

                <div class="guide-entry hidden" id="upload-entry">
                    <a href="#/upload" class="guide-entry-renderer">
                        <i class="el-icon-upload icon"></i>
                        <span class="text">上传</span>
                    </a>
                </div>
            </div>
            
            <div id="footer">
                <a class="guide-links-primary" href="#/about">关于</a>
                
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
                        <p class="clearfix block-info">
                            <span class="play-count">{{sport.impression}}次观看</span>
                            <span class="update-time">
                                <UpdateTime :timestamp="sport.update_time"></UpdateTime>
                            </span>
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
                        <img :src="album.cover" class="block-thumb album-thumb"/>
                        <h3 class="block-title album-title">
                            {{ album.name }}
                        </h3>
                        <div class="author">author</div>
                        <p class="clearfix block-info">
                            <span class="play-count">{{album.impression}}次观看</span>
                            <span class="update-time">
                                <UpdateTime :timestamp="album.update_time"></UpdateTime>
                            </span>
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
            <div class="tags">
                <el-tag type="info" v-for="tag in tags" >
                    <router-link :to="{path: '/videos?tagId=' + tag.id}">{{tag.name}}</router-link>
                </el-tag>
            </div>
            <ul class="block-list">
                <li v-for="video in albumVideoList">
                    <router-link :to="{path: '/video/'+ video.id }">
                        <img :src="'/multimedia/ts/'+video.id+'/cover.jpg'" class="block-thumb video-thumb"/>
                        <h3 class="block-title video-title">
                            {{ video.headline }}
                        </h3>
                        <div class="author">author</div>
                        <p class="clearfix block-info">
                            <span class="play-count">{{video.impression}}次观看</span>
                            <span class="update-time">
                                <UpdateTime :timestamp="video.update_time"></UpdateTime>
                            </span>
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
                <el-tag type="info" v-for="tag in tags" >
                    <router-link :to="{path: '/videos?tagId=' + tag.id}">{{tag.name}}</router-link>
                </el-tag>
            </div>
            <div id="palyer-wrapper">
                <video id="video" controls="controls" height="400">Not support this browser, please use Chrome.</video>
                <p class="subtitle"></p>
            </div>
            <div id="usr-operation-desk">
                <div class="fl">{{video.impression}}次观看</div>
                <ul class="fr block-list">
                    <li id="support-btn" @click="vote(1)"><i class="fa fa-thumbs-o-up"></i><em>{{video.support_time}}</em></li>
                    <li id="degrade-btn" @click="vote(-1)"><i class="fa fa-thumbs-o-down"></i><em>{{video.degrade_time}}</em></li>
                    <li id="share-btn"><i class="fa fa-share"></i>分享</li>
                    <li id="enshrine-btn"><i class="fa fa-plus"></i></li>
                </ul>
                <br class="clr">
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
            <!-- <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/sports' }">首页</el-breadcrumb-item>
            </el-breadcrumb> -->
            
            <ul class="block-list">
                <li v-for="video in videos">
                    <router-link :to="{path: '/video/' + video.id}">
                        <img src="/img/logo.jpg" class="block-thumb video-thumb"/>
                        <h3 class="block-title video-title">
                            {{ video.headline }}
                        </h3>
                        <div class="author">author</div>
                        <p class="clearfix block-info">
                            <span class="play-count">{{video.impression}}次观看</span>
                            <span class="update-time">
                                <UpdateTime :timestamp="video.update_time"></UpdateTime>
                            </span>
                        </p>
                    </router-link>
                </li>
            </ul>
        </div>
    `,

    feedback: `
        <div style="width: 600px; margin: auto; border: 1px solid #999; padding: 10px 20px;">
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
                        <el-button size="" type="primary">上传截图</el-button>
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
    `,

    about: `
    <div><div id="about">
    <!--不知道为什么外面要套两层-->
        <pre>
        为什么做这网站？

            1. 喜欢网球
                &nbsp;&nbsp;17年初，在老同学的引导下，开始打网球，顶多是个新手，不过每个星期必打，除非下雨天。没人催我，来回路上1个半小时，就这样打了1年。我想肯定是喜欢在场上奔跑挥拍的感觉。碰到很多喜欢网球的年轻人，我能为大家做什么？

            2. 资料太少而且凌乱
                &nbsp;&nbsp;像我一样走“野路子”的不少，选个"好看的"基础拍就开始在场上瞎挥，一小戳人坚持了下来，技术日渐长进，动作也开始定型，想进一步肯定需要有前人指导，不然等于做无用功。大多请不起教练的“野路子”选择去网上找视频，但是非常凌乱、稀少、古老，我想是否能用我所学的给大家一个学习网球或者其他技能的一个平台。

            3. 工作原因
                &nbsp;&nbsp;有不少球友年龄可能和我差不多，在职场几年，前途不见明朗，做的重复的事让自己逐渐消沉、迷失自我。我一直在思考，对什么感兴趣，怎样才能影响别人，帮助别人，帮助自己。

                
        意见和建议尽管提（左侧有反馈按钮），甚至喜欢的明星或者内容都可以提，很有可能出现在下一次更新中 :）
        </pre>
    </div></div>
    `,

    aboutMake: ''
}