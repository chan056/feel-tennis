module.exports = function(){
    var temp = {
        header: `
            <div id="header">
                <el-row>
                    <el-col :span="4">
                        <i class="el-icon-menu aside-menu-btn"></i>
                        <a href="#/sports" id="logo">
                            <img src="../img/logo.png" width="60px" alt="logo"/>
                        </a>
                        
                    </el-col>
    
                    <el-col :span="10" id="search-form-wrapper">
                        <el-form :model="searchForm" :rules="searchFormRules" ref="searchForm"  class="" id="searchForm">
                            <el-row>
                                <el-col :span=20>
                                    <el-form-item label="" prop="name">
                                        <el-input v-model="searchForm.name"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span=4 class="header-search-btn">
                                    <el-button style="width: 100%;" icon="el-icon-search" @click="submitForm('searchForm')"></el-button>
                                </el-col>
                            </el-row>
                        </el-form>
                    </el-col>
    
                    <el-col :span="6" class="masthead fr">
                        <el-dropdown id="usr-btns" class="item" @command="handleUsrBtns">
                            <i v-bind:class="loginUsrInfo.name? 'el-icon-setting': 'el-icon-view'" title="" @click=""></i>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-if="!loginUsrInfo.name" command="login" id="header-btn-login">登录</el-dropdown-item>
                                <el-dropdown-item v-if="!loginUsrInfo.name" command="regist" id="header-btn-regist">注册</el-dropdown-item>
                                <el-dropdown-item v-if="loginUsrInfo.name" command="datum" id="header-btn-profile">资料</el-dropdown-item>
                                <el-dropdown-item v-if="loginUsrInfo.name"command="logout" id="header-btn-logout">登出</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
    
                        <el-badge is-dot class="item item">
                            <i class="fa fa-bell-o" title="消息"></i>
                        </el-badge>
    
                        <el-popover
                            ref="popover1"
                            placement="top-start"
                            title=""
                            width="200"
                            trigger="hover">
                            123
                        </el-popover>
                        
                        <i v-popover:popover1 class="fa fa-money item" title="投币"></i>
                    </el-col>
                </el-row>
    
                <el-dialog title="注册" :visible.sync="registForm.visible">
                    <el-form status-icon ref="registForm" :model="registForm" :rules="registFormRule">
                        <el-form-item label="用户名" :label-width="registForm.formLabelWidth" prop="name">
                            <el-input v-model="registForm.name" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" :label-width="registForm.formLabelWidth" prop="psw">
                            <el-input type="password" v-model="registForm.psw" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" :label-width="registForm.formLabelWidth" prop="email">
                            <el-input type="email" v-model="registForm.email" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="" :label-width="registForm.formLabelWidth" prop="captcha">
                            <input v-model="registForm.captcha" class="jCaptcha" placeholder="请输入计算结果"/>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="resetForm('registForm');">重 置</el-button>
                        <el-button id="regist-btn" type="primary" @click="registForm.visible = true; regist();">注 册</el-button>
                    </div>
                </el-dialog>
    
                <el-dialog title="登录" :visible.sync="loginForm.visible" id="login-dialog">
                    <el-form :model="loginForm">
                        <el-form-item label="用户名" :label-width="loginForm.formLabelWidth">
                            <el-input v-model="loginForm.name" auto-complete="on"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" :label-width="loginForm.formLabelWidth">
                            <el-input type="password" id="last-login-iput" v-model="loginForm.psw" auto-complete="off" clearable></el-input>
                        </el-form-item>
                        <p class="btns">
                            <el-button @click="resetPswForm.visible = true; loginForm.visible = false;" class="rst-psw-btn">修改密码</el-button>
                            <el-button @click="handlerRegist(); loginForm.visible = false;" class="rgst-btn">注册</el-button>
                        </p>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="loginForm.visible = false;">取 消</el-button>
                        <el-button type="primary" @click="loginForm.visible = true; login();">登 录</el-button>
                    </div>
                </el-dialog>
    
                <el-dialog title="修改密码" :visible.sync="resetPswForm.visible">
                    <el-form :model="resetPswForm" ref="resetPswForm" :rules="resetPswForm.rules">
                        <el-form-item label="用户名" :label-width="resetPswForm.formLabelWidth" prop="name">
                            <el-input v-model="resetPswForm.name" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="旧密码" :label-width="resetPswForm.formLabelWidth">
                            <el-input type="password" v-model="resetPswForm.opsw" auto-complete="off" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="" :label-width="resetPswForm.formLabelWidth">
                            <!--避免恶意发邮件 todo-->
                            <i class="el-icon-question" @click="retrievePswEmail();" title="点击发送密码重置邮件"></i>
                        </el-form-item>
                        
                        <el-form-item label="新密码" :label-width="resetPswForm.formLabelWidth">
                            <el-input type="password" id="last-login-iput" v-model="resetPswForm.npsw" auto-complete="off" clearable></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="resetPswForm.visible = false;">取 消</el-button>
                        <el-button type="primary" @click="resetPsw();">确 认</el-button>
                    </div>
                </el-dialog>
    
                <el-dialog title="重置密码" :visible.sync="retrievePswForm.visible">
                    <el-form :model="retrievePswForm" ref="retrievePswForm" :rules="retrievePswForm.rules">
                        <el-form-item label="新密码" :label-width="retrievePswForm.formLabelWidth" prop="npsw">
                            <el-input type="password" id="" v-model="retrievePswForm.npsw" auto-complete="off" clearable></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="retrievePswForm.visible = false;">取 消</el-button>
                        <el-button type="primary" @click="retrievePsw();">确 认</el-button>
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
                    <div class="guide-entry">
                        <a href="#/sports" class="guide-entry-renderer">
                            <i class="icon fa fa-home"></i>
                            <span class="text">首页</span>
                        </a>
                    </div>
                    <div v-if="(loginUsrInfo && loginUsrInfo.name)"  class="guide-entry">
                        <a href="#/stars" class="guide-entry-renderer">
                            <i class="icon fa fa-star"></i>
                            <span class="text">收藏</span>
                        </a>
                    </div>
                </div>
                <div class="guide-section">
                    <div v-if="loginUsrInfo && loginUsrInfo.name" class="guide-entry" id="upload-entry" >
                        <div class="guide-entry-renderer">
                            <a href="#/compete" class="guide-entry-renderer">
                                <i class="fa fa-paw icon"></i>
                                <span class="text">竞赛</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="guide-section">
                    <div v-if="(loginUsrInfo && loginUsrInfo.name)" class="guide-entry">
                        <a href="#/voteNext" class="guide-entry-renderer">
                            <i class="fa fa-hand-paper-o icon"></i>
                            <span class="text">投票</span>
                        </a>
                    </div>
                    <div class="guide-entry" id="feedback-entry">
                        <a href="#/feedback" class="guide-entry-renderer">
                            <i class="el-icon-service icon"></i>
                            <span class="text">反馈</span>
                        </a>
                    </div>
                </div>
                <div class="guide-section" v-if="loginUsrInfo && loginUsrInfo.is_admin == 1">
                    <div class="guide-entry" id="upload-entry" >
                        <a href="#/feedbacksAdmin" class="guide-entry-renderer">
                            <i class="fa fa-coffee icon"></i>
                            <span class="text">反馈列表</span>
                        </a>
                    </div>
                    <div class="guide-entry" id="upload-entry" >
                        <a href="#/uploadAdmin" class="guide-entry-renderer">
                            <i class="el-icon-upload icon"></i>
                            <span class="text">上传视频</span>
                        </a>
                    </div>
                    <div class="guide-entry" id="upload-entry" >
                        <a href="#/videosAdmin" class="guide-entry-renderer">
                            <i class="fa fa-video-camera icon"></i>
                            <span class="text">视频列表</span>
                        </a>
                    </div>
                    <div class="guide-entry" id="upload-entry" >
                        <a href="#/albumsAdmin" class="guide-entry-renderer">
                            <i class="fa fa-book icon"></i>
                            <span class="text">专辑列表</span>
                        </a>
                    </div>
                    <div class="guide-entry" id="upload-entry" >
                        <a href="#/sportsAdmin" class="guide-entry-renderer">
                            <i class="fa fa-soccer-ball-o icon"></i>
                            <span class="text">运动列表</span>
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
    
        sports: `
            <div id="album-list">
                <div class="el-breadcrumb">
                    <span>运动</span>
                </div>
                <ul class="block-list">
                    <li class="" v-for="sport in sports">
                        <router-link :to="{path: '/sports/'+ sport.id }" :title="sport.name">
                            <img :src="'/img/cover/sport/' + sport.id + '.jpg'" class="block-thumb spt-thumb" alt="sport"/>
                            <p class="clearfix block-info">
                                <span class="play-count">{{sport.impression}}次观看</span>
                                <span class="update-time">
                                    <UpdateTime :timestamp="sport.update_time"></UpdateTime>
                                </span>
                            </p>
                        </router-link>
                    </li>
                </ul>
                <el-pagination
                    layout="prev, pager, next"
                    :total="total"
                    :page-size="pageSize"
                    @current-change="handlePageChange">
                </el-pagination>
            </div>
        `,
        
        albumList: `
            <div id="album-list">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/sports/' + crumb.id }">{{crumb.name}}</el-breadcrumb-item>
                </el-breadcrumb>
                <ul id="video-container" class="block-list">
                    <li v-for="album in albumList">
                        <router-link :to="{path: '/albums/'+ album.id }">
                            <img :src="'/img/cover/album/' + album.id + '.jpg'" class="block-thumb album-thumb" alt="album"/>
                        </router-link>
                        <h3 class="block-title album-title">
                            {{ album.name }}
                        </h3>
                        
                        <div class="author">
                            <a target="_blank" :href="album.author_link">{{album.author_name}}</a>
                        </div>
                        <p class="clearfix block-info">
                            <span class="play-count">{{album.impression}}次观看</span>
                            <span class="update-time">
                                <UpdateTime :timestamp="album.update_time"></UpdateTime>
                            </span>
                        </p>
                    </li>
                </ul>
                <el-pagination
                    layout="prev, pager, next"
                    :total="total"
                    :page-size="pageSize"
                    @current-change="handlePageChange">
                </el-pagination>
            </div>
        `,
    
        album: `
            <div>
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/sports/' + crumb.sId }">{{crumb.sName}}</el-breadcrumb-item>
                    <el-breadcrumb-item :to="{ path: '/albums/' + crumb.aId }">{{crumb.aName}}</el-breadcrumb-item>
                </el-breadcrumb>
                <div class="tags">
                    <el-tag type="info" v-for="tag in tags" :key="tag.id">
                        <router-link :to="{path: '/searchedvideos?tagId=' + tag.id}">{{tag.name}}</router-link>
                    </el-tag>
                </div>
                <ul class="block-list video-list">
                    <li v-for="video in albumVideoList">
                        <router-link :to="{path: '/videos/'+ video.id }">
                            <img @mouseover="dynamivePreview($event);" @mouseout="staticPreview($event);" 
                                :src="'/multimedia/ts/'+video.id+'/cover.jpg'" class="block-thumb video-thumb" alt="video"/>
                            <h3 class="block-title video-title ellipsis">
                                <a href="javascript:;" :title="video.headline">{{ video.headline }}</a>
                            </h3>
                            <!-- <div class="author">author</div> -->
                            <p class="clearfix block-info">
                                <span class="play-count">{{video.impression}}次观看</span>
                                <span class="update-time">
                                    <UpdateTime :timestamp="video.update_time"></UpdateTime>
                                </span>
                            </p>
                        </router-link>
                    </li>
                </ul>
    
                <el-pagination
                    layout="prev, pager, next"
                    :total="total"
                    :page-size="pageSize"
                    @current-change="handlePageChange">
                </el-pagination>
            </div>
        `,
    
        video: `
            <div>
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/sports/' + crumb.sId }">{{crumb.sName}}</el-breadcrumb-item>
                    <el-breadcrumb-item :to="{ path: '/albums/' + crumb.aId }">{{crumb.aName}}</el-breadcrumb-item>
                    <el-breadcrumb-item :to="{ path: '/videos/' + crumb.vId }">{{crumb.vHeadline}}</el-breadcrumb-item>
                </el-breadcrumb>
                <div class="tags">
                    <el-tag type="info" v-for="tag in tags" :key="tag.id">
                        <router-link :to="{path: '/searchedvideos?tagId=' + tag.id}">{{tag.name}}</router-link>
                    </el-tag>
                </div>
                <div id="palyer-wrapper">

                    <video id="video" controls="controls" height="400">
                        <!--<track kind="subtitles" :src="'/multimedia/ts/'+videoId+'/subtitle.vtt'" srclang="zh" label="中文" default >-->
                        请使用现代浏览器，如Chrome Firefox Safari Edge
                    </video>

                    <p class="subtitle"></p>
                </div>
                <div v-if="video" id="usr-operation-desk">
                    <div class="fl">{{video.impression}}次观看</div>
                    <ul class="fr block-list ovv">
                        <li id="support-btn" @click="vote(1)">
                            <i v-bind:class="{ 'fa-thumbs-up': like==1, 'fa': 1, 'fa-thumbs-o-up': 1}"></i>
                            <em>{{video.support_time}}</em>
                        </li>
                        <li id="degrade-btn" @click="vote(-1)">
                            <i v-bind:class="{ 'fa-thumbs-down': like==-1, 'fa': 1, 'fa-thumbs-o-down': 1}"></i>
                            <em>{{video.degrade_time}}</em>
                        </li>
                        <li id="share-btn"><i class="fa fa-share"></i>分享</li>
                        <li id="enshrine-btn">
                            <i class="fa fa-plus" @click.stop="diplayStarSection();"></i>
                            <div id="star-section" class="hidden" @click.stop>
                                <h5>添加到...</h5>
                                <el-checkbox-group
                                    id="stared-list"
                                    v-model="selectedStars">
                                    <div v-for="star in stars" class="star">
                                        <el-checkbox :label="star.name" v-bind:sid="star.id" @change="toggleStar($event, star.id)"></el-checkbox>
                                        <i class="icon fa fa-star hidden">共有还是私有</i>
                                    </div>
                                </el-checkbox-group>
                                <h5 @click="newStarForm.visible = true;">新建收藏夹</h5>
                                <el-form v-show="newStarForm.visible" :model="newStarForm" ref="newStarForm" label-width="0" class="demo-ruleForm">
                                    <el-form-item
                                        label=""
                                        prop="starName"
                                        :rules="[
                                            { required: true, message: '名称不能为空'},
                                        ]"
                                    >
                                        <el-input type="starName" v-model="newStarForm.starName" auto-complete="off"></el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button type="primary" @click.stop="submitNewStarForm('newStarForm')">提交</el-button>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </li>
                    </ul>
                    <br class="clr">
                </div>
                <div v-if="video">
                    <input type="button" value="开始截图" @click="captureCountdown()" id="capture-btn" class="el-button el-button--default"/>
                    <el-button v-if="gifLink && !shooting" @click="preview()">预览截图</el-button>
                    <el-button v-if="shooting" :loading="true">预览截图</el-button>
                    <el-button @click="remarker.visible = true; this.vEle.pause();">标注</el-button>
                </div>
    
                <div id="remark-wrapper" v-if="video">
                    <h3>
                        <el-dropdown id="usr-btns" class="fr" @command="handleRemarkListBtns" trigger="click" :hide-on-click="false">
                            <i class="el-icon-more-outline" title="标注显示设置"></i>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-if="remarkPlaySetting.enable" command="close" id="header-btn-login">关闭</el-dropdown-item>
                                <el-dropdown-item v-if="!remarkPlaySetting.enable" command="open" id="header-btn-regist">开启</el-dropdown-item>
                                <el-dropdown-item v-if="remarkPlaySetting.all" command="showSelf" id="header-btn-profile">显示自己</el-dropdown-item>
                                <el-dropdown-item v-if="!remarkPlaySetting.all"command="showAll" id="header-btn-logout">显示所有</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </h3>
                    <p v-for="rmk in rmks" class="rmk">
                        {{rmk.remark}}
                    </p>
                </div>
                <el-dialog
                    title="动态截图预览"
                    :visible.sync="previewerVisible"
                    >
                    <p v-if="gifLink" id="shoot-container">
                        <img v-bind:src="gifLink" alt="gif"/>
                    </p>
                    <span slot="footer" class="dialog-footer">
                        <el-popover
                            ref="qrcodePop"
                            placement="top"
                            title="标题"
                            width="200"
                            trigger="click"
                            >
                            <div id="qrcode-shoot"></div>
                            <button type="button"
                                class="el-button el-button--default"
                                v-clipboard:copy="gifFullLink"
                                v-clipboard:success="copySuccess"
                                v-clipboard:error="">复制链接</button>
                            </button>
                        </el-popover>
                        <el-button v-popover:qrcodePop @click="popShow()">分享</el-button>
    
                        <a :href="gifLink" download="视频截图.gif">
                            <el-button type="primary" @click="">下载</el-button>
                        </a>
                        
                        <el-button type="primary" @click="previewerVisible = false;">确 定</el-button>
                    </span>
                </el-dialog>
    
                <el-dialog 
                    title="标注"
                    :visible.sync="remarker.visible"
                    width="30%">
                    <el-form ref="remarkerForm" :rules="remarker.rules" label-width="80px" :model="remarker">
                        <el-form-item label="内容" prop="content">
                            <el-input type="textarea" autosize v-model="remarker.content"></el-input>
                        </el-form-item>
    
                        <el-form-item>
                            <el-button class="fr" type="primary" @click="submitRemarkForm()">发送</el-button>
                        </el-form-item>
                    </el-form>
                </el-dialog>
    
                <img id="kick-off-ball" src="/img/tennis_ball.png" @load="opening($event)" alt="loading"/>
            </div>
        `,
    
        searchedvideos: `
            <div>
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/sports' }">视频</el-breadcrumb-item>
                </el-breadcrumb>
                <ul class="block-list video-list">
                    <li v-for="video in videos">
                        <router-link :to="{path: '/videos/' + video.id}">
                            <img :src="'/multimedia/ts/' + video.id + '/cover.jpg'" class="block-thumb video-thumb" alt="video"/>
                            <h3 class="block-title video-title ellipsis">
                                <a href="javascript:;" :title="video.headline">{{ video.headline }}</a>
                            </h3>
                            <!-- <div class="author">author</div> -->
                            <p class="clearfix block-info">
                                <span class="play-count">{{video.impression}}次观看</span>
                                <span class="update-time">
                                    <UpdateTime :timestamp="video.update_time"></UpdateTime>
                                </span>
                            </p>
                        </router-link>
                    </li>
                </ul>
    
                <el-pagination
                    layout="prev, pager, next"
                    :total="total"
                    :page-size="pageSize"
                    @current-change="handlePageChange">
                </el-pagination>
            </div>
        `,
    
        stars: `
            <div class="star-list">
                <h2>视频收藏夹</h2>
                <ul class="block-list v-star-list">
                    <li class="" v-for="vStar in vStars">
                        <router-link :to="{path: '/vStar/'+ vStar.id }" :title="vStar.name">
                            {{vStar.name}}
                        </router-link>
                    </li>
                </ul>
                <el-pagination
                    layout="prev, pager, next"
                    :total="starTotal"
                    :page-size="pageSize"
                    @current-change="handleVideoStarPageChange">
                </el-pagination>
    
                <h2>截图过的视频</h2>
                <ul class="block-list v-list">
                    <li class="" v-for="video in shotVideos">
                        <router-link :to="{path: '/usrVshoots?vId='+ video.id }">
                            <img :src="'/multimedia/ts/'+video.id+'/cover.jpg'" class="block-thumb spt-thumb" alt="video"/>
                            <h3 class="block-title video-title ellipsis">
                                <a href="javascript:;" :title="video.headline">{{ video.headline }}</a>
                            </h3>
                        </router-link>
                    </li>
                </ul>
    
                <el-pagination
                    layout="prev, pager, next"
                    :total="videoTotal"
                    :page-size="pageSize"
                    @current-change="handleShootVideoPageChange">
                </el-pagination>
            </div>
        `,
    
        vStar: `
            <div id="video-list" class="main-model">
                <h2>视频列表</h2>
                <ul class="block-list video-list">
                    <li v-for="video in starVideos">
                        <router-link :to="{path: '/videos/'+ video.id }">
                            <img @mouseover="dynamivePreview($event);" @mouseout="staticPreview($event);" 
                            :src="'/multimedia/ts/'+video.id+'/cover.jpg'" class="block-thumb" alt="video"/>
                            <h3 class="block-title video-title ellipsis">
                                <a href="javascript:;" :title="video.headline">{{ video.headline }}</a>
                            </h3>
                        </router-link>
                    </li>
                </ul>
    
                <el-pagination
                    layout="prev, pager, next"
                    :total="total"
                    :page-size="pageSize"
                    @current-change="handlePageChange">
                </el-pagination>
            </div>
        `,
    
        usrVshoots: `
            <div id="" class="main-model">
                <h2>截图列表</h2>
                <ul class="block-list" id="video-shoot-list">
                    <li class="" v-for="shoot in shoots">
                        <img :data-src="'/multimedia/gif/'+shoot.screenshot" 
                        :src="'/multimedia/gif/'+shoot.screenshot + '.jpg'" 
                        class="block-thumb video-thumb"
                        alt="screenshot"/>
                    </li>
                </ul>
    
                <el-pagination
                    layout="prev, pager, next"
                    :total="total"
                    :page-size="pageSize"
                    @current-change="handlePageChange">
                </el-pagination>
            </div>
        `,
    
        datum: `
            <div>
                <div style="width: 300px; margin: auto; padding: 10px 20px;">
                    <el-form ref="datum-form" :rules="datumForm.rules" :model="datumForm.unstableDatum" label-width="80px" >
                        <el-form-item label="昵称" prop="nickname">
                            <el-input v-model="datumForm.unstableDatum.nickname" v-bind:disabled="!datumForm.editable"></el-input>
                        </el-form-item>
    
                        <el-form-item label="微信" prop="wechat">
                            <el-input v-model="datumForm.unstableDatum.wechat" v-bind:disabled="!datumForm.editable"></el-input>
                        </el-form-item>
    
                        <el-form-item label="等级" prop="level" @change="showLevelTip()">
                            <el-select
                            v-model="datumForm.unstableDatum.level"
                            placeholder="" 
                            v-bind:disabled="!datumForm.editable">
                                <el-option
                                    v-for="level in levels"
                                    :key="level"
                                    :label="level"
                                    :value="level">
                                </el-option>
                            </el-select>
                        </el-form-item>
    
                        <el-form-item label="状态" prop="status">
                            <el-select
                            v-model="datumForm.unstableDatum.status"
                            placeholder="" 
                            v-bind:disabled="!datumForm.editable">
                                <el-option
                                    v-for="status in statuses"
                                    :key="status.id"
                                    :label="status.name"
                                    :value="status.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
    
                        <el-form-item label="性别" prop="sex">
                            <el-select
                            v-model="datumForm.unstableDatum.sex"
                            placeholder="" 
                            v-bind:disabled="!datumForm.editable">
                                <el-option
                                    v-for="sex in sexes"
                                    :key="sex.id"
                                    :label="sex.name"
                                    :value="sex.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
    
                        <el-form-item label="头像" prop="avatar">
                            <img v-if="!datumForm.editable" :src="datumForm.unstableDatum.avatar" alt="avatar"></img>
                            <el-upload
                                v-if="datumForm.editable"
                                class=""
                                action="/upload"
                                :data="{type:'img'}"
                                :on-success="handleUploadSuccess"
                                v-model="datumForm.unstableDatum.avatar"
                                >
                                <el-button size="small" type="primary">点击上传</el-button>
                                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                            </el-upload>
                            <div v-if="datumForm.editable" class="default-avatar-list">
                                <img @click="selectDefaultAvatar($event)" src="/img/avatar/default/male.png" alt="default male"/>
                                <img @click="selectDefaultAvatar($event)" src="/img/avatar/default/female.png" alt="default female"/>
                            </div>
                        </el-form-item>
    
                        <el-form-item>
                            <el-button  type="primary" @click="datumForm.editable=true;" v-if="!datumForm.editable">编辑</el-button>
                            <el-button  type="primary" @click="submitForm('datum-form')" v-if="datumForm.editable">确认</el-button>
                            <el-button  type="primary" @click="datumForm.editable=false; cancelUpdateUsrDatum()" v-if="datumForm.editable">取消</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        `,
    
    
        voteNext: `
            <div>
                <div style="width: 300px; margin: auto; padding: 10px 20px;">
                    <el-form ref="vote-next-form" :rules="voteNextFormRules" :model="voteNextForm" label-width="80px" >
                        <el-form-item label="运动">
                            <el-select
                            v-model="voteNextForm.sport"
                            placeholder="请选择运动项目">
                                <el-option
                                    v-for="item in sports"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
    
                        <el-form-item label="技术">
                            <el-select 
                            filterable
                            clearable
                            v-model="voteNextForm.skill" 
                            placeholder="请选择技术">
                                <el-option
                                    v-for="item in skills"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id" class="">
                                </el-option>
                            </el-select>
                        </el-form-item>
    
                        <el-form-item label="运动员">
                            <el-select
                            filterable
                            clearable
                            v-model="voteNextForm.athlete" 
                            placeholder="请选择运动员"
                            >
                                <el-option
                                    v-for="item in athletes"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
    
                        <el-form-item>
                            <el-button class="fr" type="primary" @click="submitForm('vote-next-form')">发送</el-button>
                            <el-button class="fr" style="margin-right: 10px;" @click="resetForm('vote-next-form')">重置</el-button>
                        </el-form-item>
    
                        <el-form-item>
                            <el-button class="fr" type="primary" @click="fetchVoteResult()">投票结果</el-button>
    
                        </el-form-item>
                        
                    </el-form>
                </div>
                <div style="width:75%;" id="chart-container">
                    <canvas id="myChart"></canvas>
                </div>
            </div>
        `,
    
        feedback: `
            <div class="feedback-wrapper">
                <h2 class="ovh">
                    <span class="fl">发生了什么</span>
                    <i class="fr el-icon-back" @click="goback()" style="cursor: pointer;"></i>
                </h2>
    
                <el-form ref="feedback-form" :rules="rules" :model="form" label-width="80px" >
                    <el-form-item label="" label-width="0" prop="desc">
                        <el-input type="textarea" v-model="form.desc"></el-input>
                    </el-form-item>
    
                    <h3>其他信息（选填）</h3>
                    <el-form-item label="网址" prop="site">
                        <el-input v-model="form.site"></el-input>
                    </el-form-item>
                    <el-form-item label="微信" prop="email">
                        <el-input v-model="form.wechat"></el-input>
                    </el-form-item>
                    <el-form-item label="电子邮件" prop="email">
                        <el-input v-model="form.email"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-upload
                            class="upload-demo"
                            action="/upload"
                            :data="{type:'img'}"
                            :on-remove="handleRemove"
                            :on-success="handleSuccess"
                            multiple
                            :limit="3"
                            :on-exceed="handleExceed"
                            :before-upload="beforeAvatarUpload"
                            :file-list="fileList"
                            drag
                            >
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过2M</div>
                            <!-- <el-button size="" type="primary">上传截图</el-button> -->
                        </el-upload>
                    </el-form-item>
                    
                    <el-form-item>
                        <el-button class="fr" type="primary" @click="submitForm('feedback-form')">发送</el-button>
                        <el-button class="fr" style="margin-right: 10px;" @click="resetForm('feedback-form')">重置</el-button>
                    </el-form-item>
                </el-form>
                <!-- {{form}}
                {{files}} -->
            </div>
        `,
    
        about: `<div>
            <div id="about">
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
            </div>
        </div>`,
    
        aboutMake: '',
        emailConfirm: '<div></div>',
    
        compete: `<div class="map-container">
            <div class="close-btn">返回</div>
    
            <div id="match-list">
                <p v-for="(match, index) in matches" :key="match.id" class="match" @click="showMatchDetail(match, index)">
                    <a href="javascript: ;" class="nodec" :title="'对手编号：' + (match.offensive? match.defense: match.offense)">
                        VS {{ match.offensive
                            ? match.defense_nickname + ' ' + (match.defense_wechat || '')
                            : match.offense_nickname + ' ' + (match.offense_wechat || '')
                        }}
                    </a>
                </p>
    
                <div id="matchPanel" v-show="matchPanelVisible">
                    <el-select v-model="matchResult" placeholder="请选择">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"> 
                        </el-option>
                    </el-select>
                    <div class="">
                        <el-button type="primary" @click="confirmMathcResult();">确定</el-button>
                        <el-button @click="matchPanelVisible = false;">取消</el-button>
                    </div>
                </div>
    
                <el-dialog
                title="提示"
                :visible.sync="matchResultdialogVisible"
                :append-to-body="true"
                width="30%"
                >
                    <span>确认无误？</span>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="matchResultdialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="matchResultdialogVisible = false">确 定</el-button>
                    </span>
                </el-dialog>
    
                <el-dialog
                title="提示"
                :visible.sync="defenseDialogVisible"
                :append-to-body="true"
                width="30%"
                >
                    <span>是否应战？</span>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="defenseDialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="defense()">确 定</el-button>
                    </span>
                </el-dialog>
            </div>
    
            <div id="baidu-map"></div>
            <div id="img-loader"></div>
        </div>`,
    };

    window.temp = temp;
}