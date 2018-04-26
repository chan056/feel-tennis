/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// <script src="../js/constant.js"></script>
// <script src="../js/tools.js"></script>

// <script src="../js/template.js"></script>
// <script src="../js/g-component.js"></script>
// <script src="../js/component.js"></script>
// <script src="../js/fragment.js"></script>
// <script src="../js/router_config.js"></script>
// <script src="../js/global_hide.js"></script>


__webpack_require__(1);
__webpack_require__(2);

var template = __webpack_require__(3);
var gComponent = __webpack_require__(4);
var component = __webpack_require__(5);
var fragment = __webpack_require__(6);
var routeConfig = __webpack_require__(7);
var globalEvent = __webpack_require__(8);

template();
gComponent();
component();
fragment();
routeConfig();
globalEvent();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var CONSTANT = {
    erroMsg: { 401: '请登录后操作', 402: '账户未激活' },
    PAGESIZE: 10
};

window.CONSTANT = CONSTANT;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var tools = {
    // POST 才有 params
    xhr: function xhr(api, sfn, type, params, errorHandle) {
        type = type || 'get';
        if (type == 'get') {
            params = { params: params }; // 加到链接后面?a=1&b=2
        }

        axios[type](api, params).then(function (response) {
            sfn && sfn(response.data);
        }).catch(function (error) {
            var response = error.response;
            if (!response) return;

            var statusCode = response.status;

            // 自定义错误处理
            errorHandle && errorHandle(response);

            // 统一错误处理
            setTimeout(function () {
                Vue.prototype.$notify({
                    title: response.statusText,
                    message: CONSTANT.erroMsg[statusCode] || '',
                    type: 'warning',
                    position: 'bottom-right',
                    onClose: function onClose() {
                        console.log('close');
                    }
                });
            }, 100);
        });
    },

    /**
     * [1,2] ['tag', 'innerHtml']
     * 文档中插入脚本
     */
    insertScriptTag: function insertScriptTag(type, str, attrs) {
        var id = attrs.id;
        if (id && $('script#' + id).length) {
            // ? return
            if (type == 1) {
                return attrs.onload && attrs.onload();
            }

            $('script#' + id).remove();
        }

        var script = document.createElement('script');
        for (var i in attrs) {
            script[i] = attrs[i];
        }

        if (type == 1) {
            script.setAttribute('src', str);
        } else if (type == 2) {
            script.innerHTML = str;
        }

        document.body.appendChild(script);
    },

    // 给视频绑定字幕
    // 通过轮询的方式 每x秒检测一次
    // 根据SRT DATA中的start time 和end time 定位字幕
    attachSubtile: function attachSubtile(video, srts, interval, fn) {
        interval = interval || 500;

        var lastSrtId = void 0;
        var lastSrtIndex = void 0; // 上个匹配到的srt id，用于优化查找速度
        var curSubtitle = void 0;

        setInterval(function () {
            var curVtime = video.currentTime;
            curVtime = curVtime * 1000; // 微秒
            var srt = void 0,
                srtId = void 0,
                subtitle = void 0;
            var st = void 0,
                et = void 0; // 微秒

            var i = 0;
            var l = srts.length;

            if (lastSrtIndex) {
                i = lastSrtIndex;
            }

            for (; i < l; i++) {
                srt = srts[i];
                st = srt.startTime;
                et = srt.endTime;
                srtId = srt.id;

                if (curVtime >= st && curVtime <= et) {
                    lastSrtId = srtId;

                    curSubtitle = subtitle = srt.text;
                    // console.log(/* '循环次数 '+Z, */ subtitle)
                    if (i != lastSrtIndex) {
                        fn(subtitle);
                        lastSrtIndex = i;
                    }

                    break;
                } else {
                    if (i == l - 1) {
                        lastSrtIndex = undefined;
                    }
                }
            }
        }, interval);
    },

    // 给视频绑定用户备注
    attachRemark: function attachRemark(video, rmks, interval, fn) {
        interval = interval || 500;

        var len = rmks.length;

        window.remarkIntervalId = setInterval(function () {
            var curVtime = video.currentTime;
            var rmkMoment = void 0;
            var curRmks = [];

            for (var i = 0; i < len; i++) {
                rmkMoment = rmks[i].moment;
                if (Math.abs(curVtime - rmkMoment) < 2) {
                    curRmks.push(rmks[i]);
                }
            }

            fn(curRmks);
        }, interval);
    },

    // 将时间戳转换 “周、月、年”
    formatTimeSlot: function formatTimeSlot(timestamp) {
        var now = +new Date();
        var timeSlot = now - timestamp;

        // 1天 1周 1月 1年
        var hourMS = 60 * 60 * 1000;
        var dayMS = 24 * hourMS;
        var weekMS = dayMS * 7;
        var monthMS = dayMS * 30;
        var yearMS = dayMS * 365;

        var s = '';

        if (timestamp && timeSlot > 0) {
            if (timeSlot < hourMS) {
                s = '刚刚';
            } else if (timeSlot < dayMS) {
                s = Math.floor(timeSlot / hourMS) + '小时前';
            } else if (timeSlot < weekMS) {
                s = Math.floor(timeSlot / dayMS) + '天前';
            } else if (timeSlot < monthMS) {
                s = Math.floor(timeSlot / weekMS) + '周前';
            } else if (timeSlot < yearMS) {
                s = Math.floor(timeSlot / monthMS) + '月前';
            } else {
                s = Math.floor(timeSlot / yearMS) + '年前';
            }

            return s;
        }

        return '';
    }
};

window.tools = tools;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function () {
    var temp = {
        header: '\n            <div id="header">\n                <el-row>\n                    <el-col :span="4">\n                        <i class="el-icon-menu aside-menu-btn"></i>\n                        <a href="#/sports" id="logo">\n                            <img src="../img/logo.png" width="60px" alt="logo"/>\n                        </a>\n                        \n                    </el-col>\n    \n                    <el-col :span="10" id="search-form-wrapper">\n                        <el-form :model="searchForm" :rules="searchFormRules" ref="searchForm"  class="" id="searchForm">\n                            <el-row>\n                                <el-col :span=20>\n                                    <el-form-item label="" prop="name">\n                                        <el-input v-model="searchForm.name"></el-input>\n                                    </el-form-item>\n                                </el-col>\n                                <el-col :span=4 class="header-search-btn">\n                                    <el-button style="width: 100%;" icon="el-icon-search" @click="submitForm(\'searchForm\')"></el-button>\n                                </el-col>\n                            </el-row>\n                        </el-form>\n                    </el-col>\n    \n                    <el-col :span="6" class="masthead fr">\n                        <el-dropdown id="usr-btns" class="item" @command="handleUsrBtns">\n                            <i v-bind:class="loginUsrInfo.name? \'el-icon-setting\': \'el-icon-view\'" title="" @click=""></i>\n                            <el-dropdown-menu slot="dropdown">\n                                <el-dropdown-item v-if="!loginUsrInfo.name" command="login" id="header-btn-login">\u767B\u5F55</el-dropdown-item>\n                                <el-dropdown-item v-if="!loginUsrInfo.name" command="regist" id="header-btn-regist">\u6CE8\u518C</el-dropdown-item>\n                                <el-dropdown-item v-if="loginUsrInfo.name" command="datum" id="header-btn-profile">\u8D44\u6599</el-dropdown-item>\n                                <el-dropdown-item v-if="loginUsrInfo.name"command="logout" id="header-btn-logout">\u767B\u51FA</el-dropdown-item>\n                            </el-dropdown-menu>\n                        </el-dropdown>\n    \n                        <el-badge is-dot class="item item">\n                            <i class="fa fa-bell-o" title="\u6D88\u606F"></i>\n                        </el-badge>\n    \n                        <el-popover\n                            ref="popover1"\n                            placement="top-start"\n                            title=""\n                            width="200"\n                            trigger="hover">\n                            123\n                        </el-popover>\n                        \n                        <i v-popover:popover1 class="fa fa-money item" title="\u6295\u5E01"></i>\n                    </el-col>\n                </el-row>\n    \n                <el-dialog title="\u6CE8\u518C" :visible.sync="registForm.visible">\n                    <el-form status-icon ref="registForm" :model="registForm" :rules="registFormRule">\n                        <el-form-item label="\u7528\u6237\u540D" :label-width="registForm.formLabelWidth" prop="name">\n                            <el-input v-model="registForm.name" auto-complete="off"></el-input>\n                        </el-form-item>\n                        <el-form-item label="\u5BC6\u7801" :label-width="registForm.formLabelWidth" prop="psw">\n                            <el-input type="password" v-model="registForm.psw" auto-complete="off"></el-input>\n                        </el-form-item>\n                        <el-form-item label="\u90AE\u7BB1" :label-width="registForm.formLabelWidth" prop="email">\n                            <el-input type="email" v-model="registForm.email" auto-complete="off"></el-input>\n                        </el-form-item>\n                        <el-form-item label="" :label-width="registForm.formLabelWidth" prop="captcha">\n                            <input v-model="registForm.captcha" class="jCaptcha" placeholder="\u8BF7\u8F93\u5165\u8BA1\u7B97\u7ED3\u679C"/>\n                        </el-form-item>\n                    </el-form>\n                    <div slot="footer" class="dialog-footer">\n                        <el-button type="primary" @click="resetForm(\'registForm\');">\u91CD \u7F6E</el-button>\n                        <el-button id="regist-btn" type="primary" @click="registForm.visible = true; regist();">\u6CE8 \u518C</el-button>\n                    </div>\n                </el-dialog>\n    \n                <el-dialog title="\u767B\u5F55" :visible.sync="loginForm.visible" id="login-dialog">\n                    <el-form :model="loginForm">\n                        <el-form-item label="\u7528\u6237\u540D" :label-width="loginForm.formLabelWidth">\n                            <el-input v-model="loginForm.name" auto-complete="on"></el-input>\n                        </el-form-item>\n                        <el-form-item label="\u5BC6\u7801" :label-width="loginForm.formLabelWidth">\n                            <el-input type="password" id="last-login-iput" v-model="loginForm.psw" auto-complete="off" clearable></el-input>\n                        </el-form-item>\n                        <p class="btns">\n                            <el-button @click="resetPswForm.visible = true; loginForm.visible = false;" class="rst-psw-btn">\u4FEE\u6539\u5BC6\u7801</el-button>\n                            <el-button @click="handlerRegist(); loginForm.visible = false;" class="rgst-btn">\u6CE8\u518C</el-button>\n                        </p>\n                    </el-form>\n                    <div slot="footer" class="dialog-footer">\n                        <el-button type="primary" @click="loginForm.visible = false;">\u53D6 \u6D88</el-button>\n                        <el-button type="primary" @click="loginForm.visible = true; login();">\u767B \u5F55</el-button>\n                    </div>\n                </el-dialog>\n    \n                <el-dialog title="\u4FEE\u6539\u5BC6\u7801" :visible.sync="resetPswForm.visible">\n                    <el-form :model="resetPswForm" ref="resetPswForm" :rules="resetPswForm.rules">\n                        <el-form-item label="\u7528\u6237\u540D" :label-width="resetPswForm.formLabelWidth" prop="name">\n                            <el-input v-model="resetPswForm.name" auto-complete="off"></el-input>\n                        </el-form-item>\n                        <el-form-item label="\u65E7\u5BC6\u7801" :label-width="resetPswForm.formLabelWidth">\n                            <el-input type="password" v-model="resetPswForm.opsw" auto-complete="off" clearable></el-input>\n                        </el-form-item>\n                        <el-form-item label="" :label-width="resetPswForm.formLabelWidth">\n                            <!--\u907F\u514D\u6076\u610F\u53D1\u90AE\u4EF6 todo-->\n                            <i class="el-icon-question" @click="retrievePswEmail();" title="\u70B9\u51FB\u53D1\u9001\u5BC6\u7801\u91CD\u7F6E\u90AE\u4EF6"></i>\n                        </el-form-item>\n                        \n                        <el-form-item label="\u65B0\u5BC6\u7801" :label-width="resetPswForm.formLabelWidth">\n                            <el-input type="password" id="last-login-iput" v-model="resetPswForm.npsw" auto-complete="off" clearable></el-input>\n                        </el-form-item>\n                    </el-form>\n                    <div slot="footer" class="dialog-footer">\n                        <el-button type="primary" @click="resetPswForm.visible = false;">\u53D6 \u6D88</el-button>\n                        <el-button type="primary" @click="resetPsw();">\u786E \u8BA4</el-button>\n                    </div>\n                </el-dialog>\n    \n                <el-dialog title="\u91CD\u7F6E\u5BC6\u7801" :visible.sync="retrievePswForm.visible">\n                    <el-form :model="retrievePswForm" ref="retrievePswForm" :rules="retrievePswForm.rules">\n                        <el-form-item label="\u65B0\u5BC6\u7801" :label-width="retrievePswForm.formLabelWidth" prop="npsw">\n                            <el-input type="password" id="" v-model="retrievePswForm.npsw" auto-complete="off" clearable></el-input>\n                        </el-form-item>\n                    </el-form>\n                    <div slot="footer" class="dialog-footer">\n                        <el-button type="primary" @click="retrievePswForm.visible = false;">\u53D6 \u6D88</el-button>\n                        <el-button type="primary" @click="retrievePsw();">\u786E \u8BA4</el-button>\n                    </div>\n                </el-dialog>\n    \n                <el-dialog\n                    title="\u767B\u51FA"\n                    :visible.sync="logoutForm.visible"\n                    width="30%"\n                    :before-close="beforeLogout">\n                    <span>\u786E\u8BA4\u767B\u51FA</span>\n                    <span slot="footer" class="dialog-footer">\n                        <el-button @click="logoutForm.visible = false">\u53D6 \u6D88</el-button>\n                        <el-button type="primary" @click="logoutForm.visible = false; logout();">\u786E \u5B9A</el-button>\n                    </span>\n                    </el-dialog>\n            </div>\n        ',

        aside: '\n            <div id="aside">\n                <div class="guide-section">\n                    <div class="guide-entry">\n                        <a href="#/sports" class="guide-entry-renderer">\n                            <i class="icon fa fa-home"></i>\n                            <span class="text">\u9996\u9875</span>\n                        </a>\n                    </div>\n                    <div v-if="(loginUsrInfo && loginUsrInfo.name)"  class="guide-entry">\n                        <a href="#/stars" class="guide-entry-renderer">\n                            <i class="icon fa fa-star"></i>\n                            <span class="text">\u6536\u85CF</span>\n                        </a>\n                    </div>\n                </div>\n                <div class="guide-section">\n                    <div v-if="loginUsrInfo && loginUsrInfo.name" class="guide-entry" id="upload-entry" >\n                        <div class="guide-entry-renderer">\n                            <a href="#/compete" class="guide-entry-renderer">\n                                <i class="fa fa-paw icon"></i>\n                                <span class="text">\u7ADE\u8D5B</span>\n                            </a>\n                        </div>\n                    </div>\n                </div>\n                <div class="guide-section">\n                    <div v-if="(loginUsrInfo && loginUsrInfo.name)" class="guide-entry">\n                        <a href="#/voteNext" class="guide-entry-renderer">\n                            <i class="fa fa-hand-paper-o icon"></i>\n                            <span class="text">\u6295\u7968</span>\n                        </a>\n                    </div>\n                    <div class="guide-entry" id="feedback-entry">\n                        <a href="#/feedback" class="guide-entry-renderer">\n                            <i class="el-icon-service icon"></i>\n                            <span class="text">\u53CD\u9988</span>\n                        </a>\n                    </div>\n                </div>\n                <div class="guide-section" v-if="loginUsrInfo && loginUsrInfo.is_admin == 1">\n                    <div class="guide-entry" id="upload-entry" >\n                        <a href="#/feedbacksAdmin" class="guide-entry-renderer">\n                            <i class="fa fa-coffee icon"></i>\n                            <span class="text">\u53CD\u9988\u5217\u8868</span>\n                        </a>\n                    </div>\n                    <div class="guide-entry" id="upload-entry" >\n                        <a href="#/uploadAdmin" class="guide-entry-renderer">\n                            <i class="el-icon-upload icon"></i>\n                            <span class="text">\u4E0A\u4F20\u89C6\u9891</span>\n                        </a>\n                    </div>\n                    <div class="guide-entry" id="upload-entry" >\n                        <a href="#/videosAdmin" class="guide-entry-renderer">\n                            <i class="fa fa-video-camera icon"></i>\n                            <span class="text">\u89C6\u9891\u5217\u8868</span>\n                        </a>\n                    </div>\n                    <div class="guide-entry" id="upload-entry" >\n                        <a href="#/albumsAdmin" class="guide-entry-renderer">\n                            <i class="fa fa-book icon"></i>\n                            <span class="text">\u4E13\u8F91\u5217\u8868</span>\n                        </a>\n                    </div>\n                    <div class="guide-entry" id="upload-entry" >\n                        <a href="#/sportsAdmin" class="guide-entry-renderer">\n                            <i class="fa fa-soccer-ball-o icon"></i>\n                            <span class="text">\u8FD0\u52A8\u5217\u8868</span>\n                        </a>\n                    </div>\n                </div>\n                \n                <div id="footer">\n                    <a class="guide-links-primary" href="#/about">\u5173\u4E8E</a>\n                </div>\n                <div id="llc">\n                    <span class="">2018 ChanTube</span>\n                </div>\n            </div>\n        ',

        sports: '\n            <div id="album-list">\n                <div class="el-breadcrumb">\n                    <span>\u8FD0\u52A8</span>\n                </div>\n                <ul class="block-list">\n                    <li class="" v-for="sport in sports">\n                        <router-link :to="{path: \'/sports/\'+ sport.id }" :title="sport.name">\n                            <img :src="\'/img/cover/sport/\' + sport.id + \'.jpg\'" class="block-thumb spt-thumb" alt="sport"/>\n                            <p class="clearfix block-info">\n                                <span class="play-count">{{sport.impression}}\u6B21\u89C2\u770B</span>\n                                <span class="update-time">\n                                    <UpdateTime :timestamp="sport.update_time"></UpdateTime>\n                                </span>\n                            </p>\n                        </router-link>\n                    </li>\n                </ul>\n                <el-pagination\n                    layout="prev, pager, next"\n                    :total="total"\n                    :page-size="pageSize"\n                    @current-change="handlePageChange">\n                </el-pagination>\n            </div>\n        ',

        albumList: '\n            <div id="album-list">\n                <el-breadcrumb separator="/">\n                    <el-breadcrumb-item :to="{ path: \'/sports/\' + crumb.id }">{{crumb.name}}</el-breadcrumb-item>\n                </el-breadcrumb>\n                <ul id="video-container" class="block-list">\n                    <li v-for="album in albumList">\n                        <router-link :to="{path: \'/albums/\'+ album.id }">\n                            <img :src="\'/img/cover/album/\' + album.id + \'.jpg\'" class="block-thumb album-thumb" alt="album"/>\n                        </router-link>\n                        <h3 class="block-title album-title">\n                            {{ album.name }}\n                        </h3>\n                        \n                        <div class="author">\n                            <a target="_blank" :href="album.author_link">{{album.author_name}}</a>\n                        </div>\n                        <p class="clearfix block-info">\n                            <span class="play-count">{{album.impression}}\u6B21\u89C2\u770B</span>\n                            <span class="update-time">\n                                <UpdateTime :timestamp="album.update_time"></UpdateTime>\n                            </span>\n                        </p>\n                    </li>\n                </ul>\n                <el-pagination\n                    layout="prev, pager, next"\n                    :total="total"\n                    :page-size="pageSize"\n                    @current-change="handlePageChange">\n                </el-pagination>\n            </div>\n        ',

        album: '\n            <div>\n                <el-breadcrumb separator="/">\n                    <el-breadcrumb-item :to="{ path: \'/sports/\' + crumb.sId }">{{crumb.sName}}</el-breadcrumb-item>\n                    <el-breadcrumb-item :to="{ path: \'/albums/\' + crumb.aId }">{{crumb.aName}}</el-breadcrumb-item>\n                </el-breadcrumb>\n                <div class="tags">\n                    <el-tag type="info" v-for="tag in tags" :key="tag.id">\n                        <router-link :to="{path: \'/searchedvideos?tagId=\' + tag.id}">{{tag.name}}</router-link>\n                    </el-tag>\n                </div>\n                <ul class="block-list video-list">\n                    <li v-for="video in albumVideoList">\n                        <router-link :to="{path: \'/videos/\'+ video.id }">\n                            <img @mouseover="dynamivePreview($event);" @mouseout="staticPreview($event);" \n                                :src="\'/multimedia/ts/\'+video.id+\'/cover.jpg\'" class="block-thumb video-thumb" alt="video"/>\n                            <h3 class="block-title video-title ellipsis">\n                                <a href="javascript:;" :title="video.headline">{{ video.headline }}</a>\n                            </h3>\n                            <!-- <div class="author">author</div> -->\n                            <p class="clearfix block-info">\n                                <span class="play-count">{{video.impression}}\u6B21\u89C2\u770B</span>\n                                <span class="update-time">\n                                    <UpdateTime :timestamp="video.update_time"></UpdateTime>\n                                </span>\n                            </p>\n                        </router-link>\n                    </li>\n                </ul>\n    \n                <el-pagination\n                    layout="prev, pager, next"\n                    :total="total"\n                    :page-size="pageSize"\n                    @current-change="handlePageChange">\n                </el-pagination>\n            </div>\n        ',

        video: '\n            <div>\n                <el-breadcrumb separator="/">\n                    <el-breadcrumb-item :to="{ path: \'/sports/\' + crumb.sId }">{{crumb.sName}}</el-breadcrumb-item>\n                    <el-breadcrumb-item :to="{ path: \'/albums/\' + crumb.aId }">{{crumb.aName}}</el-breadcrumb-item>\n                    <el-breadcrumb-item :to="{ path: \'/videos/\' + crumb.vId }">{{crumb.vHeadline}}</el-breadcrumb-item>\n                </el-breadcrumb>\n                <div class="tags">\n                    <el-tag type="info" v-for="tag in tags" :key="tag.id">\n                        <router-link :to="{path: \'/searchedvideos?tagId=\' + tag.id}">{{tag.name}}</router-link>\n                    </el-tag>\n                </div>\n                <div id="palyer-wrapper">\n                    <video id="video" controls="controls" height="400">Not support this browser, please use Chrome.</video>\n                    <p class="subtitle"></p>\n                </div>\n                <div v-if="video" id="usr-operation-desk">\n                    <div class="fl">{{video.impression}}\u6B21\u89C2\u770B</div>\n                    <ul class="fr block-list ovv">\n                        <li id="support-btn" @click="vote(1)">\n                            <i v-bind:class="{ \'fa-thumbs-up\': like==1, \'fa\': 1, \'fa-thumbs-o-up\': 1}"></i>\n                            <em>{{video.support_time}}</em>\n                        </li>\n                        <li id="degrade-btn" @click="vote(-1)">\n                            <i v-bind:class="{ \'fa-thumbs-down\': like==-1, \'fa\': 1, \'fa-thumbs-o-down\': 1}"></i>\n                            <em>{{video.degrade_time}}</em>\n                        </li>\n                        <li id="share-btn"><i class="fa fa-share"></i>\u5206\u4EAB</li>\n                        <li id="enshrine-btn">\n                            <i class="fa fa-plus" @click.stop="diplayStarSection();"></i>\n                            <div id="star-section" class="hidden" @click.stop>\n                                <h5>\u6DFB\u52A0\u5230...</h5>\n                                <el-checkbox-group\n                                    id="stared-list"\n                                    v-model="selectedStars">\n                                    <div v-for="star in stars" class="star">\n                                        <el-checkbox :label="star.name" v-bind:sid="star.id" @change="toggleStar($event, star.id)"></el-checkbox>\n                                        <i class="icon fa fa-star hidden">\u5171\u6709\u8FD8\u662F\u79C1\u6709</i>\n                                    </div>\n                                </el-checkbox-group>\n                                <h5 @click="newStarForm.visible = true;">\u65B0\u5EFA\u6536\u85CF\u5939</h5>\n                                <el-form v-show="newStarForm.visible" :model="newStarForm" ref="newStarForm" label-width="0" class="demo-ruleForm">\n                                    <el-form-item\n                                        label=""\n                                        prop="starName"\n                                        :rules="[\n                                            { required: true, message: \'\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A\'},\n                                        ]"\n                                    >\n                                        <el-input type="starName" v-model="newStarForm.starName" auto-complete="off"></el-input>\n                                    </el-form-item>\n                                    <el-form-item>\n                                        <el-button type="primary" @click.stop="submitNewStarForm(\'newStarForm\')">\u63D0\u4EA4</el-button>\n                                    </el-form-item>\n                                </el-form>\n                            </div>\n                        </li>\n                    </ul>\n                    <br class="clr">\n                </div>\n                <div v-if="video">\n                    <input type="button" value="\u5F00\u59CB\u622A\u56FE" @click="captureCountdown()" id="capture-btn" class="el-button el-button--default"/>\n                    <el-button v-if="gifLink && !shooting" @click="preview()">\u9884\u89C8\u622A\u56FE</el-button>\n                    <el-button v-if="shooting" :loading="true">\u9884\u89C8\u622A\u56FE</el-button>\n                    <el-button @click="remarker.visible = true; this.vEle.pause();">\u6807\u6CE8</el-button>\n                </div>\n    \n                <div id="remark-wrapper" v-if="video">\n                    <h3>\n                        <el-dropdown id="usr-btns" class="fr" @command="handleRemarkListBtns" trigger="click" :hide-on-click="false">\n                            <i class="el-icon-more-outline" title="\u6807\u6CE8\u663E\u793A\u8BBE\u7F6E"></i>\n                            <el-dropdown-menu slot="dropdown">\n                                <el-dropdown-item v-if="remarkPlaySetting.enable" command="close" id="header-btn-login">\u5173\u95ED</el-dropdown-item>\n                                <el-dropdown-item v-if="!remarkPlaySetting.enable" command="open" id="header-btn-regist">\u5F00\u542F</el-dropdown-item>\n                                <el-dropdown-item v-if="remarkPlaySetting.all" command="showSelf" id="header-btn-profile">\u663E\u793A\u81EA\u5DF1</el-dropdown-item>\n                                <el-dropdown-item v-if="!remarkPlaySetting.all"command="showAll" id="header-btn-logout">\u663E\u793A\u6240\u6709</el-dropdown-item>\n                            </el-dropdown-menu>\n                        </el-dropdown>\n                    </h3>\n                    <p v-for="rmk in rmks" class="rmk">\n                        {{rmk.remark}}\n                    </p>\n                </div>\n                <el-dialog\n                    title="\u52A8\u6001\u622A\u56FE\u9884\u89C8"\n                    :visible.sync="previewerVisible"\n                    >\n                    <p v-if="gifLink" id="shoot-container">\n                        <img v-bind:src="gifLink" alt="gif"/>\n                    </p>\n                    <span slot="footer" class="dialog-footer">\n                        <el-popover\n                            ref="qrcodePop"\n                            placement="top"\n                            title="\u6807\u9898"\n                            width="200"\n                            trigger="click"\n                            >\n                            <div id="qrcode-shoot"></div>\n                            <button type="button"\n                                class="el-button el-button--default"\n                                v-clipboard:copy="gifFullLink"\n                                v-clipboard:success="copySuccess"\n                                v-clipboard:error="">\u590D\u5236\u94FE\u63A5</button>\n                            </button>\n                        </el-popover>\n                        <el-button v-popover:qrcodePop @click="popShow()">\u5206\u4EAB</el-button>\n    \n                        <a :href="gifLink" download="\u89C6\u9891\u622A\u56FE.gif">\n                            <el-button type="primary" @click="">\u4E0B\u8F7D</el-button>\n                        </a>\n                        \n                        <el-button type="primary" @click="previewerVisible = false;">\u786E \u5B9A</el-button>\n                    </span>\n                </el-dialog>\n    \n                <el-dialog \n                    title="\u6807\u6CE8"\n                    :visible.sync="remarker.visible"\n                    width="30%">\n                    <el-form ref="remarkerForm" :rules="remarker.rules" label-width="80px" :model="remarker">\n                        <el-form-item label="\u5185\u5BB9" prop="content">\n                            <el-input type="textarea" autosize v-model="remarker.content"></el-input>\n                        </el-form-item>\n    \n                        <el-form-item>\n                            <el-button class="fr" type="primary" @click="submitRemarkForm()">\u53D1\u9001</el-button>\n                        </el-form-item>\n                    </el-form>\n                </el-dialog>\n    \n                <img id="kick-off-ball" src="/img/tennis_ball.png" @load="opening($event)" alt="loading"/>\n            </div>\n        ',

        searchedvideos: '\n            <div>\n                <el-breadcrumb separator="/">\n                    <el-breadcrumb-item :to="{ path: \'/sports\' }">\u89C6\u9891</el-breadcrumb-item>\n                </el-breadcrumb>\n                <ul class="block-list video-list">\n                    <li v-for="video in videos">\n                        <router-link :to="{path: \'/videos/\' + video.id}">\n                            <img :src="\'/multimedia/ts/\' + video.id + \'/cover.jpg\'" class="block-thumb video-thumb" alt="video"/>\n                            <h3 class="block-title video-title ellipsis">\n                                <a href="javascript:;" :title="video.headline">{{ video.headline }}</a>\n                            </h3>\n                            <!-- <div class="author">author</div> -->\n                            <p class="clearfix block-info">\n                                <span class="play-count">{{video.impression}}\u6B21\u89C2\u770B</span>\n                                <span class="update-time">\n                                    <UpdateTime :timestamp="video.update_time"></UpdateTime>\n                                </span>\n                            </p>\n                        </router-link>\n                    </li>\n                </ul>\n    \n                <el-pagination\n                    layout="prev, pager, next"\n                    :total="total"\n                    :page-size="pageSize"\n                    @current-change="handlePageChange">\n                </el-pagination>\n            </div>\n        ',

        stars: '\n            <div class="star-list">\n                <h2>\u89C6\u9891\u6536\u85CF\u5939</h2>\n                <ul class="block-list v-star-list">\n                    <li class="" v-for="vStar in vStars">\n                        <router-link :to="{path: \'/vStar/\'+ vStar.id }" :title="vStar.name">\n                            {{vStar.name}}\n                        </router-link>\n                    </li>\n                </ul>\n                <el-pagination\n                    layout="prev, pager, next"\n                    :total="starTotal"\n                    :page-size="pageSize"\n                    @current-change="handleVideoStarPageChange">\n                </el-pagination>\n    \n                <h2>\u622A\u56FE\u8FC7\u7684\u89C6\u9891</h2>\n                <ul class="block-list v-list">\n                    <li class="" v-for="video in shotVideos">\n                        <router-link :to="{path: \'/usrVshoots?vId=\'+ video.id }">\n                            <img :src="\'/multimedia/ts/\'+video.id+\'/cover.jpg\'" class="block-thumb spt-thumb" alt="video"/>\n                            <h3 class="block-title video-title ellipsis">\n                                <a href="javascript:;" :title="video.headline">{{ video.headline }}</a>\n                            </h3>\n                        </router-link>\n                    </li>\n                </ul>\n    \n                <el-pagination\n                    layout="prev, pager, next"\n                    :total="videoTotal"\n                    :page-size="pageSize"\n                    @current-change="handleShootVideoPageChange">\n                </el-pagination>\n            </div>\n        ',

        vStar: '\n            <div id="video-list" class="main-model">\n                <h2>\u89C6\u9891\u5217\u8868</h2>\n                <ul class="block-list video-list">\n                    <li v-for="video in starVideos">\n                        <router-link :to="{path: \'/videos/\'+ video.id }">\n                            <img @mouseover="dynamivePreview($event);" @mouseout="staticPreview($event);" \n                            :src="\'/multimedia/ts/\'+video.id+\'/cover.jpg\'" class="block-thumb" alt="video"/>\n                            <h3 class="block-title video-title ellipsis">\n                                <a href="javascript:;" :title="video.headline">{{ video.headline }}</a>\n                            </h3>\n                        </router-link>\n                    </li>\n                </ul>\n    \n                <el-pagination\n                    layout="prev, pager, next"\n                    :total="total"\n                    :page-size="pageSize"\n                    @current-change="handlePageChange">\n                </el-pagination>\n            </div>\n        ',

        usrVshoots: '\n            <div id="" class="main-model">\n                <h2>\u622A\u56FE\u5217\u8868</h2>\n                <ul class="block-list" id="video-shoot-list">\n                    <li class="" v-for="shoot in shoots">\n                        <img :data-src="\'/multimedia/gif/\'+shoot.screenshot" \n                        :src="\'/multimedia/gif/\'+shoot.screenshot + \'.jpg\'" \n                        class="block-thumb video-thumb"\n                        alt="screenshot"/>\n                    </li>\n                </ul>\n    \n                <el-pagination\n                    layout="prev, pager, next"\n                    :total="total"\n                    :page-size="pageSize"\n                    @current-change="handlePageChange">\n                </el-pagination>\n            </div>\n        ',

        datum: '\n            <div>\n                <div style="width: 300px; margin: auto; padding: 10px 20px;">\n                    <el-form ref="datum-form" :rules="datumForm.rules" :model="datumForm.unstableDatum" label-width="80px" >\n                        <el-form-item label="\u6635\u79F0" prop="nickname">\n                            <el-input v-model="datumForm.unstableDatum.nickname" v-bind:disabled="!datumForm.editable"></el-input>\n                        </el-form-item>\n    \n                        <el-form-item label="\u5FAE\u4FE1" prop="wechat">\n                            <el-input v-model="datumForm.unstableDatum.wechat" v-bind:disabled="!datumForm.editable"></el-input>\n                        </el-form-item>\n    \n                        <el-form-item label="\u7B49\u7EA7" prop="level" @change="showLevelTip()">\n                            <el-select\n                            v-model="datumForm.unstableDatum.level"\n                            placeholder="" \n                            v-bind:disabled="!datumForm.editable">\n                                <el-option\n                                    v-for="level in levels"\n                                    :key="level"\n                                    :label="level"\n                                    :value="level">\n                                </el-option>\n                            </el-select>\n                        </el-form-item>\n    \n                        <el-form-item label="\u72B6\u6001" prop="status">\n                            <el-select\n                            v-model="datumForm.unstableDatum.status"\n                            placeholder="" \n                            v-bind:disabled="!datumForm.editable">\n                                <el-option\n                                    v-for="status in statuses"\n                                    :key="status.id"\n                                    :label="status.name"\n                                    :value="status.id">\n                                </el-option>\n                            </el-select>\n                        </el-form-item>\n    \n                        <el-form-item label="\u6027\u522B" prop="sex">\n                            <el-select\n                            v-model="datumForm.unstableDatum.sex"\n                            placeholder="" \n                            v-bind:disabled="!datumForm.editable">\n                                <el-option\n                                    v-for="sex in sexes"\n                                    :key="sex.id"\n                                    :label="sex.name"\n                                    :value="sex.id">\n                                </el-option>\n                            </el-select>\n                        </el-form-item>\n    \n                        <el-form-item label="\u5934\u50CF" prop="avatar">\n                            <img v-if="!datumForm.editable" :src="datumForm.unstableDatum.avatar" alt="avatar"></img>\n                            <el-upload\n                                v-if="datumForm.editable"\n                                class=""\n                                action="/upload"\n                                :data="{type:\'img\'}"\n                                :on-success="handleUploadSuccess"\n                                v-model="datumForm.unstableDatum.avatar"\n                                >\n                                <el-button size="small" type="primary">\u70B9\u51FB\u4E0A\u4F20</el-button>\n                                <div slot="tip" class="el-upload__tip">\u53EA\u80FD\u4E0A\u4F20jpg/png\u6587\u4EF6\uFF0C\u4E14\u4E0D\u8D85\u8FC7500kb</div>\n                            </el-upload>\n                            <div v-if="datumForm.editable" class="default-avatar-list">\n                                <img @click="selectDefaultAvatar($event)" src="/img/avatar/default/male.png" alt="default male"/>\n                                <img @click="selectDefaultAvatar($event)" src="/img/avatar/default/female.png" alt="default female"/>\n                            </div>\n                        </el-form-item>\n    \n                        <el-form-item>\n                            <el-button  type="primary" @click="datumForm.editable=true;" v-if="!datumForm.editable">\u7F16\u8F91</el-button>\n                            <el-button  type="primary" @click="submitForm(\'datum-form\')" v-if="datumForm.editable">\u786E\u8BA4</el-button>\n                            <el-button  type="primary" @click="datumForm.editable=false; cancelUpdateUsrDatum()" v-if="datumForm.editable">\u53D6\u6D88</el-button>\n                        </el-form-item>\n                    </el-form>\n                </div>\n            </div>\n        ',

        voteNext: '\n            <div>\n                <div style="width: 300px; margin: auto; padding: 10px 20px;">\n                    <el-form ref="vote-next-form" :rules="voteNextFormRules" :model="voteNextForm" label-width="80px" >\n                        <el-form-item label="\u8FD0\u52A8">\n                            <el-select\n                            v-model="voteNextForm.sport"\n                            placeholder="\u8BF7\u9009\u62E9\u8FD0\u52A8\u9879\u76EE">\n                                <el-option\n                                    v-for="item in sports"\n                                    :key="item.id"\n                                    :label="item.name"\n                                    :value="item.id">\n                                </el-option>\n                            </el-select>\n                        </el-form-item>\n    \n                        <el-form-item label="\u6280\u672F">\n                            <el-select \n                            filterable\n                            clearable\n                            v-model="voteNextForm.skill" \n                            placeholder="\u8BF7\u9009\u62E9\u6280\u672F">\n                                <el-option\n                                    v-for="item in skills"\n                                    :key="item.id"\n                                    :label="item.name"\n                                    :value="item.id" class="">\n                                </el-option>\n                            </el-select>\n                        </el-form-item>\n    \n                        <el-form-item label="\u8FD0\u52A8\u5458">\n                            <el-select\n                            filterable\n                            clearable\n                            v-model="voteNextForm.athlete" \n                            placeholder="\u8BF7\u9009\u62E9\u8FD0\u52A8\u5458"\n                            >\n                                <el-option\n                                    v-for="item in athletes"\n                                    :key="item.id"\n                                    :label="item.name"\n                                    :value="item.id">\n                                </el-option>\n                            </el-select>\n                        </el-form-item>\n    \n                        <el-form-item>\n                            <el-button class="fr" type="primary" @click="submitForm(\'vote-next-form\')">\u53D1\u9001</el-button>\n                            <el-button class="fr" style="margin-right: 10px;" @click="resetForm(\'vote-next-form\')">\u91CD\u7F6E</el-button>\n                        </el-form-item>\n    \n                        <el-form-item>\n                            <el-button class="fr" type="primary" @click="fetchVoteResult()">\u6295\u7968\u7ED3\u679C</el-button>\n    \n                        </el-form-item>\n                        \n                    </el-form>\n                </div>\n                <div style="width:75%;" id="chart-container">\n                    <canvas id="myChart"></canvas>\n                </div>\n            </div>\n        ',

        feedback: '\n            <div class="feedback-wrapper">\n                <h2 class="ovh">\n                    <span class="fl">\u53D1\u751F\u4E86\u4EC0\u4E48</span>\n                    <i class="fr el-icon-back" @click="goback()" style="cursor: pointer;"></i>\n                </h2>\n    \n                <el-form ref="feedback-form" :rules="rules" :model="form" label-width="80px" >\n                    <el-form-item label="" label-width="0" prop="desc">\n                        <el-input type="textarea" v-model="form.desc"></el-input>\n                    </el-form-item>\n    \n                    <h3>\u5176\u4ED6\u4FE1\u606F\uFF08\u9009\u586B\uFF09</h3>\n                    <el-form-item label="\u7F51\u5740" prop="site">\n                        <el-input v-model="form.site"></el-input>\n                    </el-form-item>\n                    <el-form-item label="\u5FAE\u4FE1" prop="email">\n                        <el-input v-model="form.wechat"></el-input>\n                    </el-form-item>\n                    <el-form-item label="\u7535\u5B50\u90AE\u4EF6" prop="email">\n                        <el-input v-model="form.email"></el-input>\n                    </el-form-item>\n                    <el-form-item label="">\n                        <el-upload\n                            class="upload-demo"\n                            action="/upload"\n                            :data="{type:\'img\'}"\n                            :on-remove="handleRemove"\n                            :on-success="handleSuccess"\n                            multiple\n                            :limit="3"\n                            :on-exceed="handleExceed"\n                            :before-upload="beforeAvatarUpload"\n                            :file-list="fileList"\n                            drag\n                            >\n                            <i class="el-icon-upload"></i>\n                            <div class="el-upload__text">\u5C06\u6587\u4EF6\u62D6\u5230\u6B64\u5904\uFF0C\u6216<em>\u70B9\u51FB\u4E0A\u4F20</em></div>\n                            <div class="el-upload__tip" slot="tip">\u53EA\u80FD\u4E0A\u4F20jpg/png\u6587\u4EF6\uFF0C\u4E14\u4E0D\u8D85\u8FC72M</div>\n                            <!-- <el-button size="" type="primary">\u4E0A\u4F20\u622A\u56FE</el-button> -->\n                        </el-upload>\n                    </el-form-item>\n                    \n                    <el-form-item>\n                        <el-button class="fr" type="primary" @click="submitForm(\'feedback-form\')">\u53D1\u9001</el-button>\n                        <el-button class="fr" style="margin-right: 10px;" @click="resetForm(\'feedback-form\')">\u91CD\u7F6E</el-button>\n                    </el-form-item>\n                </el-form>\n                <!-- {{form}}\n                {{files}} -->\n            </div>\n        ',

        about: '<div>\n            <div id="about">\n                <pre>\n                \u4E3A\u4EC0\u4E48\u505A\u8FD9\u7F51\u7AD9\uFF1F\n    \n                    1. \u559C\u6B22\u7F51\u7403\n                        &nbsp;&nbsp;17\u5E74\u521D\uFF0C\u5728\u8001\u540C\u5B66\u7684\u5F15\u5BFC\u4E0B\uFF0C\u5F00\u59CB\u6253\u7F51\u7403\uFF0C\u9876\u591A\u662F\u4E2A\u65B0\u624B\uFF0C\u4E0D\u8FC7\u6BCF\u4E2A\u661F\u671F\u5FC5\u6253\uFF0C\u9664\u975E\u4E0B\u96E8\u5929\u3002\u6CA1\u4EBA\u50AC\u6211\uFF0C\u6765\u56DE\u8DEF\u4E0A1\u4E2A\u534A\u5C0F\u65F6\uFF0C\u5C31\u8FD9\u6837\u6253\u4E861\u5E74\u3002\u6211\u60F3\u80AF\u5B9A\u662F\u559C\u6B22\u5728\u573A\u4E0A\u5954\u8DD1\u6325\u62CD\u7684\u611F\u89C9\u3002\u78B0\u5230\u5F88\u591A\u559C\u6B22\u7F51\u7403\u7684\u5E74\u8F7B\u4EBA\uFF0C\u6211\u80FD\u4E3A\u5927\u5BB6\u505A\u4EC0\u4E48\uFF1F\n    \n                    2. \u8D44\u6599\u592A\u5C11\u800C\u4E14\u51CC\u4E71\n                        &nbsp;&nbsp;\u50CF\u6211\u4E00\u6837\u8D70\u201C\u91CE\u8DEF\u5B50\u201D\u7684\u4E0D\u5C11\uFF0C\u9009\u4E2A"\u597D\u770B\u7684"\u57FA\u7840\u62CD\u5C31\u5F00\u59CB\u5728\u573A\u4E0A\u778E\u6325\uFF0C\u4E00\u5C0F\u6233\u4EBA\u575A\u6301\u4E86\u4E0B\u6765\uFF0C\u6280\u672F\u65E5\u6E10\u957F\u8FDB\uFF0C\u52A8\u4F5C\u4E5F\u5F00\u59CB\u5B9A\u578B\uFF0C\u60F3\u8FDB\u4E00\u6B65\u80AF\u5B9A\u9700\u8981\u6709\u524D\u4EBA\u6307\u5BFC\uFF0C\u4E0D\u7136\u7B49\u4E8E\u505A\u65E0\u7528\u529F\u3002\u5927\u591A\u8BF7\u4E0D\u8D77\u6559\u7EC3\u7684\u201C\u91CE\u8DEF\u5B50\u201D\u9009\u62E9\u53BB\u7F51\u4E0A\u627E\u89C6\u9891\uFF0C\u4F46\u662F\u975E\u5E38\u51CC\u4E71\u3001\u7A00\u5C11\u3001\u53E4\u8001\uFF0C\u6211\u60F3\u662F\u5426\u80FD\u7528\u6211\u6240\u5B66\u7684\u7ED9\u5927\u5BB6\u4E00\u4E2A\u5B66\u4E60\u7F51\u7403\u6216\u8005\u5176\u4ED6\u6280\u80FD\u7684\u4E00\u4E2A\u5E73\u53F0\u3002\n    \n                    3. \u5DE5\u4F5C\u539F\u56E0\n                        &nbsp;&nbsp;\u6709\u4E0D\u5C11\u7403\u53CB\u5E74\u9F84\u53EF\u80FD\u548C\u6211\u5DEE\u4E0D\u591A\uFF0C\u5728\u804C\u573A\u51E0\u5E74\uFF0C\u524D\u9014\u4E0D\u89C1\u660E\u6717\uFF0C\u505A\u7684\u91CD\u590D\u7684\u4E8B\u8BA9\u81EA\u5DF1\u9010\u6E10\u6D88\u6C89\u3001\u8FF7\u5931\u81EA\u6211\u3002\u6211\u4E00\u76F4\u5728\u601D\u8003\uFF0C\u5BF9\u4EC0\u4E48\u611F\u5174\u8DA3\uFF0C\u600E\u6837\u624D\u80FD\u5F71\u54CD\u522B\u4EBA\uFF0C\u5E2E\u52A9\u522B\u4EBA\uFF0C\u5E2E\u52A9\u81EA\u5DF1\u3002\n    \n                        \n                \u610F\u89C1\u548C\u5EFA\u8BAE\u5C3D\u7BA1\u63D0\uFF08\u5DE6\u4FA7\u6709\u53CD\u9988\u6309\u94AE\uFF09\uFF0C\u751A\u81F3\u559C\u6B22\u7684\u660E\u661F\u6216\u8005\u5185\u5BB9\u90FD\u53EF\u4EE5\u63D0\uFF0C\u5F88\u6709\u53EF\u80FD\u51FA\u73B0\u5728\u4E0B\u4E00\u6B21\u66F4\u65B0\u4E2D :\uFF09\n                </pre>\n            </div>\n        </div>',

        aboutMake: '',
        emailConfirm: '<div></div>',

        compete: '<div class="map-container">\n            <div class="close-btn">\u8FD4\u56DE</div>\n    \n            <div id="match-list">\n                <p v-for="(match, index) in matches" :key="match.id" class="match" @click="showMatchDetail(match, index)">\n                    <a href="javascript: ;" class="nodec" :title="\'\u5BF9\u624B\u7F16\u53F7\uFF1A\' + (match.offensive? match.defense: match.offense)">\n                        VS {{ match.offensive\n                            ? match.defense_nickname + \' \' + (match.defense_wechat || \'\')\n                            : match.offense_nickname + \' \' + (match.offense_wechat || \'\')\n                        }}\n                    </a>\n                </p>\n    \n                <div id="matchPanel" v-show="matchPanelVisible">\n                    <el-select v-model="matchResult" placeholder="\u8BF7\u9009\u62E9">\n                        <el-option\n                        v-for="item in options"\n                        :key="item.value"\n                        :label="item.label"\n                        :value="item.value"> \n                        </el-option>\n                    </el-select>\n                    <div class="">\n                        <el-button type="primary" @click="confirmMathcResult();">\u786E\u5B9A</el-button>\n                        <el-button @click="matchPanelVisible = false;">\u53D6\u6D88</el-button>\n                    </div>\n                </div>\n    \n                <el-dialog\n                title="\u63D0\u793A"\n                :visible.sync="matchResultdialogVisible"\n                :append-to-body="true"\n                width="30%"\n                >\n                    <span>\u786E\u8BA4\u65E0\u8BEF\uFF1F</span>\n                    <span slot="footer" class="dialog-footer">\n                        <el-button @click="matchResultdialogVisible = false">\u53D6 \u6D88</el-button>\n                        <el-button type="primary" @click="matchResultdialogVisible = false">\u786E \u5B9A</el-button>\n                    </span>\n                </el-dialog>\n    \n                <el-dialog\n                title="\u63D0\u793A"\n                :visible.sync="defenseDialogVisible"\n                :append-to-body="true"\n                width="30%"\n                >\n                    <span>\u662F\u5426\u5E94\u6218\uFF1F</span>\n                    <span slot="footer" class="dialog-footer">\n                        <el-button @click="defenseDialogVisible = false">\u53D6 \u6D88</el-button>\n                        <el-button type="primary" @click="defense()">\u786E \u5B9A</el-button>\n                    </span>\n                </el-dialog>\n            </div>\n    \n            <div id="baidu-map"></div>\n            <div id="img-loader"></div>\n        </div>'
    };

    window.temp = temp;
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function () {
    var tagCreatorConstructor = Vue.extend({
        template: '\n            <el-dialog v-bind:title="config.title" :visible.sync="config.visibility">\n                <el-form>\n                    \n                </el-form>\n                <div slot="footer" class="dialog-footer">\n                    <el-button @click="config.visibility = false">\u53D6 \u6D88</el-button>\n                    <el-button type="primary" @click="config.visibility = false">\u786E \u5B9A</el-button>\n                </div>\n            </el-dialog>',
        data: function data() {
            return {};
        },
        props: ['config']
    });

    Vue.component('tagCreator', tagCreatorConstructor);

    // 时间的转换 如 2周之前 1天之前
    Vue.component('UpdateTime', {
        template: '<em>{{timeSlot}}</em>',
        props: ['timestamp'],
        data: function data() {
            var propsData = this.$options.propsData;
            return {
                timeSlot: tools.formatTimeSlot(propsData.timestamp)
            };
        }
    });
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function () {
	var COMPONENTS = {};

	COMPONENTS.HeaderComponent = {
		el: 'app-header',

		template: temp.header,

		data: {
			searchForm: {
				name: ''
			},

			searchFormRules: {
				name: [
				//   { required: true, message: ' '/* , trigger: 'blur'  */},
				{ min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }]
			},

			registForm: {
				formLabelWidth: '100px',
				visible: false,
				name: '',
				psw: '',
				email: ''
			},

			registFormRule: {
				name: [{ required: true, message: '请输入用户名', trigger: 'blur' }, { min: 5, max: 30, message: '长度在 5-30', trigger: 'blur' }, { validator: function validator(rule, value, callback) {
						tools.xhr('/checkUsernameExist?name=' + value, function (d) {
							if (d) {
								return callback(new Error('用户名已存在'));
							} else {
								return callback();
							}
						});
					}, trigger: 'blur' }],
				psw: [{ required: true, message: '请输入密码', trigger: 'blur' }],
				email: [{ type: 'email', required: true, message: '请输入正确格式邮箱', trigger: 'change' }, { validator: function validator(rule, value, callback) {
						tools.xhr('/checkEmailExist?email=' + value, function (d) {
							if (d) {
								return callback(new Error('邮箱已存在'));
							} else {
								return callback();
							}
						});
					}, trigger: 'blur' }],
				captcha: [{ required: true, message: '请输入计算结果', trigger: 'blur' }]
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
					name: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
				}
			},

			retrievePswForm: {
				formLabelWidth: '100px',
				visible: false,
				npsw: '',
				rules: {
					name: [{ required: true, message: '请输入新密码', trigger: 'blur' }]
				}
			},

			logoutForm: {
				visible: false
			},

			loginUsrInfo: {}
		},

		methods: {
			submitForm: function submitForm(formName) {
				var _this2 = this;

				var name = $.trim(this.searchForm.name);
				if (!name) return;

				this.$refs[formName].validate(function (valid) {
					if (valid) {
						location.hash = "#/searchedVideos?headline=" + _this2.searchForm.name;
						// this.searchForm.name = '';
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			resetForm: function resetForm(formName) {
				this.$refs[formName].resetFields();
			},

			handleUsrBtns: function handleUsrBtns(index) {
				var o = {
					'login': this.handlerLogin,
					'regist': this.handlerRegist,
					'datum': function datum() {
						console.log(this, this.$location);
						location.href = "#/datum";
					},
					'logout': this.handlerLogout
				};

				o[index] && o[index]();
			},

			handlerLogin: function handlerLogin() {
				this.loginForm.visible = true;

				setTimeout(function () {
					$('#last-login-iput').off('keyup.login').on('keyup.login', function (e) {
						var keyCode = e.keyCode;
						if (keyCode == 13) {
							this.login();
						}
					}.bind(this));
				}.bind(this), 500);

				tools.insertScriptTag(1, '../lib/md5.js', 'md5');
			},

			handlerRegist: function handlerRegist() {
				this.registForm.visible = true;

				tools.insertScriptTag(1, "../lib/captcha.js", { onload: function () {
						tools.insertScriptTag(2, FRAGMENTS.captcha, { id: 'captcha-frag' });
					}.bind(this), id: 'captcha' });

				tools.insertScriptTag(1, '../lib/md5.js', 'md5');
			},

			handlerLogout: function handlerLogout() {
				this.logoutForm.visible = true;
			},

			login: function login() {
				var trim = $.trim;

				tools.xhr('/login', function () {
					// this.fetchUsrLoginInfo();

					// this.$message({
					// 	message: '登录成功',
					// 	type: 'success'
					// });

					location.reload();

					// this.loginForm.visible = false;
				}.bind(this), 'post', {
					name: trim(this.loginForm.name),
					psw: md5(trim(this.loginForm.psw)),
					ip: CURPOS.ip,
					city: this.cityZH,
					coords: CURPOS.longitude + ',' + CURPOS.latitude
				}, function (res) {
					var status = res.status;
					var statusText = res.statusText;

					if (status == 401) {
						this.$message({
							message: '登录失败，请检查用户名、密码',
							type: 'error'
						});
					}
				}.bind(this));
			},

			regist: function regist() {
				var t = this;
				this.$refs['registForm'].validate(function (valid) {
					if (valid) {
						var trim = $.trim;

						tools.xhr('/regist', function (res) {
							t.registForm.visible = false;

							t.$alert('注册成功,' + res, '提示', {
								confirmButtonText: '确定',
								callback: function callback() {
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

			// 找回密码邮件
			retrievePswEmail: function retrievePswEmail() {
				var t = this;

				this.$refs['resetPswForm'].validateField('name', function (err) {
					if (!err) {
						var name = $.trim(t.resetPswForm.name);

						t.$alert('\u786E\u8BA4\u91CD\u7F6E\u5BC6\u7801?', '注意', {
							confirmButtonText: '确定',
							callback: function callback(action) {
								tools.xhr('/retrievePswEmail', function (res) {
									t.$message({
										type: 'info',
										message: res
									});

									// t.resetPswForm.visible = false; 
								}, 'patch', {
									usrname: name
								}, function () {
									t.$message({
										type: 'warning',
										message: '\u5BC6\u7801\u91CD\u7F6E\u90AE\u4EF6\u53D1\u9001\u5931\u8D25'
									});
								});
							}
						});
					}
				});
			},

			// 重置密码
			retrievePsw: function retrievePsw() {
				var t = this;
				tools.xhr('/retrievePsw', function (res) {
					t.$message({
						type: 'info',
						message: '\u5BC6\u7801\u91CD\u7F6E\u6210\u529F'
					});

					setTimeout(function () {
						location.href = location.origin + '/#/';
					}, 1000);

					t.retrievePswForm.visible = false;
				}, 'patch', {
					code: this.retrievePswCode,
					npsw: md5($.trim(this.retrievePswForm.npsw))
				}, function () {
					t.$message({
						type: 'warning',
						message: '\u5BC6\u7801\u91CD\u7F6E\u5931\u8D25'
					});
				});
			},

			// 密码修改
			resetPsw: function resetPsw() {
				var t = this;
				var trim = $.trim;

				this.$alert('\u786E\u8BA4\u5C06\u5BC6\u7801\u4FEE\u6539\u4E3A' + t.resetPswForm.npsw + '?', '注意', {
					confirmButtonText: '确定',
					callback: function callback(action) {
						tools.xhr('/resetPsw', function (res) {
							t.$message({
								type: 'info',
								message: '\u5BC6\u7801\u4FEE\u6539\u6210\u529F'
							});

							t.resetPswForm.visible = false;
						}, 'patch', {
							name: trim(t.resetPswForm.name),
							opsw: md5(trim(t.resetPswForm.opsw)),
							npsw: md5(trim(t.resetPswForm.npsw))
						}, function () {
							t.$message({
								type: 'warning',
								message: '\u5BC6\u7801\u4FEE\u6539\u5931\u8D25'
							});
						});
					}
				});
			},

			logout: function logout() {
				tools.xhr('/logout', function () {
					this.$message({
						message: '登出成功',
						type: 'success'
					});

					this.fetchUsrLoginInfo();
				}.bind(this), 'post');
			},

			handleSelect: function handleSelect() {
				console.log('handleSelect', arguments);
			},

			beforeLogout: function beforeLogout() {
				this.$confirm('确认关闭？').then(function () {
					this.logoutForm.visible = false;
					done();
				}).catch(function () {});
			},

			fetchUsrLoginInfo: function fetchUsrLoginInfo() {
				// 首次打开时 获取用户信息
				tools.xhr('/loginInfo', function (loginUsrInfo) {
					// 登陆状态在各组件共享 todo
					this.loginUsrInfo = loginUsrInfo || {};
					window.loginUsrInfo = loginUsrInfo;

					var name = loginUsrInfo.name;
					$('#header .el-icon-view').attr('title', name).addClass('usr');

					this.$bus.emit('update-login-info', this.loginUsrInfo);
				}.bind(this));
			}
		},

		mounted: function mounted() {
			// 用户管理
			var tmpUsr = Cookies.get('tmpUsr');

			if (tmpUsr) {
				tmpUsr = tmpUsr.substr(3, 10);
				$('#header .el-icon-view').attr('title', tmpUsr).addClass('tmp-usr');
			}

			this.fetchUsrLoginInfo();

			$('.aside-menu-btn').on('click', function () {
				$('#root-container').toggleClass('brief');
			});

			var retrievePswCode = '';
			if (location.search.match(/\?retrievePswCode/)) {
				retrievePswCode = location.search.match(/retrievePswCode=([^&#]+)/);
				retrievePswCode && (retrievePswCode = retrievePswCode[1]);

				tools.insertScriptTag(1, '../lib/md5.js', 'md5');

				this.retrievePswCode = retrievePswCode;
				this.retrievePswForm.visible = true;
			}
		},

		created: function created() {
			try {
				new BMap.LocalCity().get(function (city) {
					this.cityZH = city.name;
				}.bind(this));
			} catch (e) {}
		}

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

		created: function created() {
			this.$bus.on('update-login-info', function (info) {
				this.loginUsrInfo = info;
			}.bind(this));
		},

		mounted: function mounted() {
			this.getCurPos();
		},

		beforeDestroy: function beforeDestroy() {
			this.$bus.off('update-login-info', this.addTodo);
		},

		methods: {
			getCurPos: function getCurPos(fn) {
				$.getJSON('//freegeoip.net/json/?callback=?', function (data) {
					window.CURPOS = data;
					var coord = { lng: data.longitude, lat: data.latitude };
					fn && fn(coord);
				});
			}
		}
	};

	COMPONENTS.Sports = {
		data: function data() {
			var d = {
				pageSize: CONSTANT.PAGESIZE,
				total: 0,
				sports: []
			};

			return d;
		},

		template: temp.sports,

		mounted: function mounted() {
			this.fetchSports(0);
		},

		methods: {
			fetchSports: function fetchSports(pageNum) {
				tools.xhr('/sports', function (resData) {
					this.sports = resData.datalist;
					this.total = resData.total;
				}.bind(this), 'get', {
					pageNum: pageNum,
					pageSize: this.pageSize
				});
			},

			handlePageChange: function handlePageChange(i) {
				this.fetchSports(i - 1);
			}

		}
	};

	COMPONENTS.AlbumList = {
		props: ['sportId'],
		data: function data() {
			var d = {
				albumList: [],
				crumb: {},
				pageSize: CONSTANT.PAGESIZE,
				total: 0
			};

			tools.xhr('/navInfo/1/' + this.sportId, function (resData) {
				d.crumb = resData[0];
			});

			return d;
		},

		template: temp.albumList,

		methods: {
			fetchAlbumList: function fetchAlbumList(pageNum) {
				// 某项运动下的所有专辑
				tools.xhr('/sports/' + this.sportId + '/albums', function (resData) {
					this.albumList = resData.datalist;
					this.total = resData.total;
				}.bind(this), 'get', {
					pageNum: pageNum,
					pageSize: this.pageSize
				});
			},

			handlePageChange: function handlePageChange(i) {
				this.fetchAlbumList(i - 1);
			}
		},

		mounted: function mounted() {
			this.fetchAlbumList(0);
		}
	};

	COMPONENTS.Album = {
		props: ['albumId'],
		data: function data() {
			var d = {
				albumVideoList: [],
				crumb: {},
				tags: [],
				total: 0,
				pageSize: CONSTANT.PAGESIZE
			};

			tools.xhr('/navInfo/2/' + this.albumId, function (resData) {
				d.crumb = resData[0];
			});

			tools.xhr('/albumTags/' + this.albumId, function (resData) {
				d.tags = resData;
			});

			return d;
		},
		template: temp.album,
		methods: {
			fetchAlbumVideo: function fetchAlbumVideo(pageNum) {
				tools.xhr('/albums/' + this.albumId + '/videos', function (resData) {
					this.albumVideoList = resData.datalist;
					this.total = resData.total;
				}.bind(this), 'get', {
					pageNum: pageNum,
					pageSize: this.pageSize
				});
			},

			handlePageChange: function handlePageChange(i) {
				this.fetchAlbumVideo(i - 1);
			},

			dynamivePreview: function dynamivePreview(e) {
				$(e.target).attr('src', function () {
					// console.log(arguments);
					return arguments[1].replace('cover.jpg', 'd_cover.gif');
				});
			},

			staticPreview: function staticPreview(e) {
				$(e.target).attr('src', function () {
					return arguments[1].replace('d_cover.gif', 'cover.jpg');
				});
			}
		},

		mounted: function mounted() {
			this.fetchAlbumVideo(0);
		}
	};

	COMPONENTS.Video = {
		props: ['videoId'],
		data: function data() {
			var d = {
				video: null,
				crumb: {},
				tags: [],
				captureParams: {},
				previewerVisible: false,
				gifLink: '',
				gifFullLink: '',
				shooting: false,
				like: 0,
				likeLocking: false
			};
			var propsData = this.$options.propsData;
			var videoId = propsData.videoId;

			d.captureParams.vId = videoId;
			tools.xhr('/videos/' + videoId, function (resData) {
				// console.log(resData)
				if (resData) {
					d.video = resData;
					d.captureParams.ext = d.video.video_ext;

					var dayViewLeft = resData.dayViewLeft;
					if (dayViewLeft) {
						if (dayViewLeft <= 5) {
							this.$message({ message: '\u5F53\u5929\u5269\u4F59\u64AD\u653E\u6B21\u6570 ' + (resData.dayViewLeft || 0) + '\u6B21', type: 'warning' });
						}

						tools.insertScriptTag(1, "../lib/hls.js", { onload: function () {
								tools.insertScriptTag(2, FRAGMENTS.attachVideo(this.videoId), { id: 'hls-frag' });

								vEle.onended = function () {
									$('.subtitle').text('');
								};
							}.bind(this), id: 'hls' });
					}
				} else {
					this.$message({
						dangerouslyUseHTMLString: true,
						message: '\u5F53\u5929\u5269\u4F59\u64AD\u653E\u6B21\u6570 0\u6B21\uFF0C<br/>\u70B9\u51FB\u53F3\u4E0A\u89D2\u6CE8\u518C\u6216\u767B\u5F55\u67E5\u770B\u66F4\u591A\u89C6\u9891',
						type: 'warning'
					});
				}
			}.bind(this));

			tools.xhr('/navInfo/3/' + videoId, function (resData) {
				d.crumb = resData[0];
			});

			tools.xhr('/videoTags/' + videoId, function (resData) {
				d.tags = resData;
			});

			tools.xhr('/srt/' + videoId, function (resData) {
				if (!resData) return;

				var playerWrapper = $('#palyer-wrapper');

				tools.attachSubtile(window.vEle, resData, 500, function (subtitle) {
					playerWrapper.find('.subtitle').text(subtitle).css({});
				});
			});

			d.newStarForm = { starName: '', visible: false };
			d.stars = [];
			d.checkList = [];
			d.selectedStars = [];
			d.starSectionVisible = false;

			d.loginUsrInfo = {};

			d.rmks = [];
			d.remarker = {
				visible: false,
				content: '',
				rules: {
					content: [{ required: true, message: '内容不能为空' }]
				}
			};

			d.remarkPlaySetting = {
				enable: true,
				all: true
			};

			return d;
		},
		template: temp.video,
		mounted: function mounted() {
			var t = this;

			window.vEle = document.querySelector('#video');

			if (window.loginUsrInfo) {
				t.loginUsrInfo = window.loginUsrInfo;
				afterLogin();
			} else {
				t.$bus.on('update-login-info', function (info) {
					t.loginUsrInfo = info;
					if (info.name) {
						afterLogin();
					}
				});
			}

			function afterLogin() {
				t.queryVoteComment();
				t.queryStar(t.queryUsrVideoStars);
				t.queryRemark(1);
			};
		},
		beforeDestroy: function beforeDestroy() {
			this.$bus.off('update-login-info', this.addTodo);
		},


		methods: {
			captureCountdown: function captureCountdown() {
				var _this = this;
				var captureBtn = $('#capture-btn');
				var counting = captureBtn.data('counting');

				if (!counting) {
					captureBtn.data('counting', true);
					_this.captureParams.st = _this.getVideoTime();
					_this.captureParams.vId = _this.videoId;

					countdown();
				} else {
					clearCountdown();
					_this.capture();
				}

				// 倒计时
				function countdown() {
					var t = 10;
					_this.intervalId = setInterval(function () {
						t--;
						captureBtn.val('截图中 ' + t);

						if (t == 0) {
							clearCountdown();
						}
					}, 1000);
				};

				function clearCountdown() {
					clearInterval(_this.intervalId);
					captureBtn.data('counting', false);
					captureBtn.val('开始截图');
				}
			},

			capture: function capture() {
				this.captureParams.et = this.getVideoTime();
				if (this.captureParams.et <= this.captureParams.st) {
					return;
				}

				this.shooting = true;

				tools.xhr('/gifLink?' + $.param(this.captureParams), function (resData) {
					this.gifLink = resData;
					this.shooting = false;
				}.bind(this), null, null, function (ret) {
					this.$message.warning({
						message: '视频截图出错'
					});

					this.shooting = false;
				}.bind(this));

				vEle.pause();
			},

			// 点击分享时
			popShow: function popShow() {
				tools.insertScriptTag(1, "../lib/qrcode.js", { onload: function () {
						if (this.gifLink) {
							this.gifFullLink = location.origin + this.gifLink;
							var qrcode = new QRCode($('#qrcode-shoot').empty()[0], {
								text: this.gifFullLink,
								width: 128,
								height: 128,
								colorDark: "#000000",
								colorLight: "#ffffff",
								correctLevel: QRCode.CorrectLevel.H
							});
						}

						// qrcode.clear(); // clear the code.
						// qrcode.makeCode("http://naver.com"); // make another code.
					}.bind(this), id: 'qrcode' });
				// tools.insertScriptTag(1, "../lib/clipboard.min.js", {onload: function(){
				// console.log(ClipboardJS, $('#copy-shoot-link-btn').length)
				// new ClipboardJS('#copy-shoot-link-btn');
				// }.bind(this), id: 'clipboard'});
			},

			copySuccess: function copySuccess() {
				this.$message({
					message: '复制成功',
					type: 'success'
				});
			},

			remark: function remark() {
				tools.xhr('/video/' + this.videoId + '/remark', function (resData) {
					this.$message({
						message: '标注成功',
						type: 'success'
					});

					window.vEle.play();
				}.bind(this), 'post', { remark: this.remarker.content, moment: this.getVideoTime() });
			},

			submitRemarkForm: function submitRemarkForm() {
				this.$refs['remarkerForm'].validate(function (valid) {
					if (valid) {
						this.remarker.visible = false;
						this.remark();
					} else {
						return false;
					}
				}.bind(this));
			},

			getVideoTime: function getVideoTime() {
				return window.vEle.currentTime;
			},

			preview: function preview() {
				this.previewerVisible = true;
			},

			// ==需要重写==
			// 赞 贬
			// 新增 移出
			// 赞过 再贬 赞-1 贬+1

			// 用户 和 赞/贬 视频的对应关系  需要新建
			vote: function vote(type, e) {
				if (this.likeLocking) {
					return;
				}

				var t = this;

				// 投票状态 0 -1 1
				var voteStatus;
				var needClearOther = 0;

				collectVoteStatus();
				tools.xhr('/voteVideo', function (res) {
					t.queryVoteComment();

					$('#support-btn em').text(res.support_time);
					$('#degrade-btn em').text(res.degrade_time);

					t.likeLocking = false;
				}, 'patch', { voteStatus: voteStatus, type: type, vId: this.videoId, needClearOther: needClearOther }, function (res) {
					if (res.status == 401) {
						this.$message.error('请登录后再操作'); // todo 在公共部分处理
					}
					t.likeLocking = false;
				}.bind(this));

				function collectVoteStatus() {
					var cmt = t.like; // 点击之前的like
					if (type == 1) {
						// 点了“赞”
						if (cmt == 0) {
							voteStatus = 1;
						} else if (cmt == 1) {
							voteStatus = 0;
						} else if (cmt == -1) {
							voteStatus = 1;
							needClearOther = 1;
						}
					} else if (type == -1) {
						if (cmt == 0) {
							voteStatus = -1;
						} else if (cmt == 1) {
							voteStatus = -1;
							needClearOther = 1;
						} else if (cmt == -1) {
							voteStatus = 0;
						}
					}
				}
			},

			queryVoteComment: function queryVoteComment() {
				tools.xhr('/queryVoteComment/' + this.videoId, function (res) {
					var like = res.comment || 0;
					// console.log(like);
					this.like = like;
				}.bind(this));
			},

			// 开场动画
			opening: function opening(e) {
				var t = $(e.target);
				t.css({ opacity: 0, transform: 'translate(-50%, -50%) scale(5)' });
				setTimeout(function () {
					t.hide();
				}, 700);
			},

			submitNewStarForm: function submitNewStarForm(formName) {
				this.$refs[formName].validate(function (valid) {
					if (valid) {
						this.newStar();
						this.newStarForm.visible = false;
					} else {
						console.log('error submit!!');
						return false;
					}
				}.bind(this));
			},

			queryStar: function queryStar(fn) {
				tools.xhr('/vStars', function (res) {
					this.stars = res;
					fn && fn();
				}.bind(this));
			},

			queryUsrVideoStars: function queryUsrVideoStars() {
				tools.xhr('/queryUsrVideoStars/' + this.videoId, function (res) {
					var selectedStars = [];

					res.forEach(function (item) {
						selectedStars.push(item.name);
					});

					this.selectedStars = selectedStars;
				}.bind(this));
			},

			newStar: function newStar() {
				tools.xhr('/star', function (res) {
					this.$message({
						message: '收藏夹新建成功',
						type: 'success'
					});

					this.queryStar();

					// 创建之后 添加视频到收藏夹
					// todo 执行顺序也许有问题，必须在queryStar之后
					this.starVideo(res, this.queryUsrVideoStars);
				}.bind(this), 'post', { name: this.newStarForm.starName });
			},

			starVideo: function starVideo(starId, fn) {
				if (!starId) return;

				tools.xhr('/star/' + starId, function (res) {
					if (!res) this.$message({
						message: '视频收藏成功',
						type: 'success'
					});

					fn && fn();
				}.bind(this), 'post', { vId: this.video.id });
			},

			toggleStar: function toggleStar(e) {
				// console.log(arguments);
				var sid = arguments[1];

				this.starVideo(sid);
			},

			diplayStarSection: function diplayStarSection() {
				$('#star-section').show();
			},

			// 查询视频的“用户标记”
			// type 1 所有用户 2 自己
			queryRemark: function queryRemark(type) {
				var t = this;
				type || (type = 1);

				if (type == 1) {
					if (this.allRemarks) {
						return attachRemark(this.allRemarks);
					}
				} else if (type == 2) {
					if (this.selfRemarks) {
						return attachRemark(this.selfRemarks);
					}
				}

				tools.xhr('/video/' + this.videoId + '/remarks?type=' + type, function (res) {
					if (type == 1) {
						t.allRemarks = res;
					} else if (type == 2) {
						t.selfRemarks = res;
					}

					attachRemark(res);
				});

				function attachRemark(data) {
					tools.attachRemark(window.vEle, data, 500, function (rmks) {
						t.rmks = rmks;
					});
				}
			},

			handleRemarkListBtns: function handleRemarkListBtns(cmd) {
				var t = this;
				var o = {
					'close': function close() {
						t.rmks = [];
						t.remarkPlaySetting.enable = false;
						clearInterval(window.remarkIntervalId);
					},
					'open': function open() {
						var rmkType = t.remarkPlaySetting.all ? 1 : 2;
						t.queryRemark(rmkType);
						t.remarkPlaySetting.enable = true;
					},
					'showSelf': function showSelf() {
						clearInterval(window.remarkIntervalId);
						t.rmks = [];
						t.remarkPlaySetting.all = false;

						t.queryRemark(2);
					},
					'showAll': function showAll() {
						clearInterval(window.remarkIntervalId);
						t.rmks = [];
						t.remarkPlaySetting.all = true;

						t.queryRemark(1);
					}
				};

				o[cmd] && o[cmd]();
			}
		}
	};

	COMPONENTS.searchedvideos = {
		data: function data() {
			var d = {
				videos: [],
				total: 0,
				pageSize: CONSTANT.PAGESIZE
			};

			return d;
		},
		template: temp.searchedvideos,
		created: function created() {},
		mounted: function mounted(to, from, next) {
			this.fetchVideolist(0);
		},


		methods: {
			fetchVideolist: function fetchVideolist(pageNum) {
				var params = this.$route.query || {};
				params.pageSize = this.pageSize;
				params.pageNum = pageNum;

				tools.xhr('/videos', function (resData) {
					this.videos = resData.datalist;
					this.total = resData.total;
				}.bind(this), 'get', params);
			},

			handlePageChange: function handlePageChange(index) {
				this.fetchVideolist(index);
			}
		}
	};

	COMPONENTS.Datum = {
		data: function data() {
			return {
				datumForm: {
					unstableDatum: {
						nickname: '',
						wechat: '',
						level: '',
						status: '1',
						avatar: '',
						sex: ''
					},
					rules: {
						nickname: [{ required: true, message: '昵称不能为空' }],
						wechat: [{ required: true, message: '微信不能为空' }],
						level: [{ required: true, message: '水平不能为空' }],
						status: [{ required: true, message: '状态不能为空' }],
						avatar: [{ required: true, message: '头像必填' }],
						sex: [{ required: true, message: '性别必填' }]
					},
					editable: false
				},

				usrDatum: {}, // 真实信息

				// 目前只考虑网球
				levels: ['1.0', '1.5', '2.0', '2.5', '3.0', '3.5', '4.0', '4.5', '5.0', '5.5', '6.0', '7.0'],

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
				}, {
					id: '2',
					name: '修整中'
				}]
			};
		},

		methods: {
			fetchUsrDatum: function fetchUsrDatum() {
				tools.xhr('/usrDatum', function (res) {
					this.usrDatum.nickname = this.datumForm.unstableDatum.nickname = res.nickname;
					this.usrDatum.wechat = this.datumForm.unstableDatum.wechat = res.wechat;
					this.usrDatum.level = this.datumForm.unstableDatum.level = res.level;
					this.usrDatum.status = this.datumForm.unstableDatum.status = res.status;
					this.usrDatum.avatar = this.datumForm.unstableDatum.avatar = res.avatar;
					this.usrDatum.sex = this.datumForm.unstableDatum.sex = res.sex;
					// console.log(this.usrDatum);
				}.bind(this));
			},

			submitForm: function submitForm(formName) {
				this.$refs[formName].validate(function (valid) {
					if (valid) {
						this.updateUsrDatum();
					} else {
						console.log('error submit!!');
						return false;
					}
				}.bind(this));
			},

			updateUsrDatum: function updateUsrDatum() {
				tools.xhr('/usrDatum', function (res) {
					this.$message({
						message: '资料更新成功',
						type: 'success'
					});

					this.fetchUsrDatum();
					this.datumForm.editable = false;
				}.bind(this), 'patch', this.datumForm.unstableDatum, function (res) {
					if (res.status == 401) {}
				}.bind(this));
			},

			cancelUpdateUsrDatum: function cancelUpdateUsrDatum() {
				this.datumForm.unstableDatum.nickname = this.usrDatum.nickname;
				this.datumForm.unstableDatum.wechat = this.usrDatum.wechat;
				this.datumForm.unstableDatum.level = this.usrDatum.level;
				this.datumForm.unstableDatum.status = this.usrDatum.status;
				this.datumForm.unstableDatum.avatar = this.usrDatum.avatar;
				this.datumForm.unstableDatum.sex = this.usrDatum.sex;

				$('.default-avatar-list img').removeClass('selected');
			},

			showLevelTip: function showLevelTip() {},

			handleUploadSuccess: function handleUploadSuccess(res) {
				// return console.log(res);
				this.datumForm.avatar = res.relPath;
			},

			selectDefaultAvatar: function selectDefaultAvatar(e) {
				var t = $(e.target);
				this.datumForm.unstableDatum.avatar = this.datumForm.avatar = t.attr('src');
				t.addClass('selected').siblings().removeClass('selected');
			}
		},

		template: temp.datum,

		mounted: function mounted() {
			this.fetchUsrDatum();
		}
	};

	COMPONENTS.VoteNext = {
		data: function data() {
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

			var voteNextFormRules = {
				sport: [{ required: true, message: '请选择运动项目' }],
				skill: [{ required: true, message: '请选择技能' }],
				athlete: [{ required: true, message: '请选择运动员' }]
			};

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
					labels: ["1", "2", "3", "4", "5", "6"], // 前6名
					datasets: [{
						label: '技术',
						data: {},
						backgroundColor: d.chartColors.green,
						borderColor: d.chartColors.green,
						borderWidth: 1,
						fill: false
					}, {
						label: '运动员',
						data: {},
						backgroundColor: d.chartColors.blue,
						borderColor: d.chartColors.blue,
						borderWidth: 1,
						fill: false
					}]
				},
				options: {
					responsive: true,
					title: {
						display: true,
						text: '网球投票结果'
					},
					tooltips: {
						mode: 'nearest',
						intersect: false,
						callbacks: {
							title: function title(tooltipItems, data) {
								// point, line
								var poll = tooltipItems[0].yLabel;
								return '票数：' + poll;
							},
							label: function label() {
								return '';
							},
							footer: function (tooltipItems, data) {
								var s = '';

								tooltipItem = tooltipItems[0];
								var datasetIndex = tooltipItem.datasetIndex,
								    itemIndex = tooltipItem.index;

								if (datasetIndex == 1) {
									s = this.playerData[0][itemIndex];
								} else if (datasetIndex == 0) {
									s = this.skillData[0][itemIndex];
								}

								return s;
							}.bind(this),

							afterFooter: function (tooltipItems, data) {
								var s = '';

								tooltipItem = tooltipItems[0];
								var datasetIndex = tooltipItem.datasetIndex,
								    itemIndex = tooltipItem.index;

								if (this.playerData[1][itemIndex] == this.skillData[1][itemIndex]) {
									s = this.playerData[0][itemIndex];
									return s;
								}
							}.bind(this)
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

		methods: {
			querySports: function querySports() {
				tools.xhr('/sports', function (resData) {
					this.sports = resData;
					this.voteNextForm.sport = this.sports[0].id;
				}.bind(this));
			},
			querySKills: function querySKills() {
				tools.xhr('/skills/' + this.voteNextForm.sport, function (resData) {
					this.skills = resData;
				}.bind(this));
			},
			queryAthletes: function queryAthletes() {
				tools.xhr('/athletes/' + this.voteNextForm.sport, function (resData) {
					this.athletes = resData;
				}.bind(this));
			},


			submitForm: function submitForm(formName) {
				var _this3 = this;

				this.$refs[formName].validate(function (valid) {
					if (valid) {
						tools.xhr('/voteNext', function (resData) {
							this.fetchVoteResult();
							this.$message({
								message: '感谢您的投票',
								type: 'success'
							});
						}.bind(_this3), 'post', _this3.voteNextForm, function (res) {
							var statusCode = res.status;
							if (statusCode == 401) {
								$('#header-btn-login').trigger('click');
							} else if (statusCode == 402) {
								this.$message({
									message: '请隔天再投',
									type: 'warning'
								});
							}
						}.bind(_this3));
					} else {
						return false;
					}
				});
			},

			resetForm: function resetForm(formName) {
				this.$refs[formName].resetFields();
				this.voteNextForm = {
					sport: '',
					skill: '',
					athlete: ''
				};
			},

			fetchVoteResult: function fetchVoteResult() {
				tools.xhr('/videoVoteResult', function (resData) {
					// this.resetForm('form');
					this.updateChart(resData);
				}.bind(this));
			},

			updateChart: function updateChart(data) {
				// $('#chart-container').html('<canvas id="myChart"></canvas>');

				// 重新new chart，替换canvas
				var $chart = $('#myChart');
				var ctx = $chart[0].getContext('2d');

				var skillData = this.skillData = processData(data['skill']);
				var playerData = this.playerData = processData(data['athlete']);

				this.config.data.datasets[0].data = skillData[1];
				this.config.data.datasets[1].data = playerData[1];

				if (!this.chartInstance) {
					this.chartInstance = new Chart(ctx, this.config);
				} else {
					this.chartInstance.update();
				}

				// [{tag: 1, count: 2}]
				// ['skill-1', 'skill-2'] 和 [1, 2]
				// ['athlete-1', 'athlete-2'] 和 [1, 2]
				function processData(data) {
					var ary = [[], []];
					data.forEach(function (item) {
						if (item['tag']) {
							ary[0].push(item['tag']);
							ary[1].push(item['count']);
						}
					});

					return ary;
				}
			}
		},

		mounted: function mounted() {
			tools.insertScriptTag(1, "../lib/Chart.js", { onload: function () {}.bind(this), id: 'chartjs' });
		},

		watch: {
			// 运动更新后 更新技术、运动员
			'voteNextForm.sport': function voteNextFormSport(n, o) {
				var sportId = n;
				var type = typeof sportId === 'undefined' ? 'undefined' : _typeof(sportId);

				if (sportId) {
					if (type == 'number') {
						// 选择运动
						this.querySKills(sportId);
						this.queryAthletes(sportId);
					}
				}
			}
		},

		template: temp.voteNext
	};

	COMPONENTS.Feedback = {
		data: function data() {
			var d = { files: [], fileList: [] };
			d.form = {
				desc: '',
				site: '',
				wechat: '',
				email: ''
			};

			var rules = {
				desc: [{ required: true, message: '请填写问题描述' }, { min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur' }],
				site: [{ message: '请填写相关网址', trigger: 'blur' }],
				email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }]
			};

			d.rules = rules;

			return d;
		},

		methods: {
			submitForm: function submitForm(formName) {
				var _this4 = this;

				this.$refs[formName].validate(function (valid) {
					var d = Object.assign({}, _this4.form);
					d.files = _this4.files.join(',');

					if (valid) {
						tools.xhr('/feedback', function (resData) {
							// this.resetForm('form');
							this.$message({
								message: '感谢您的反馈',
								type: 'success'
							});
						}.bind(_this4), 'post', d);
					} else {
						return false;
					}
				});
			},
			resetForm: function resetForm(formName) {
				this.$refs[formName].resetFields();
				this.files = [];
				this.fileList = [];
			},
			handleRemove: function handleRemove(file, fileList) {
				this.files = [];
				// 从fileList从提取files
				fileList.forEach(function (f) {
					var relPath = f.response.relPath;
					this.files.push(relPath);
				}.bind(this));
			},
			handleExceed: function handleExceed(files, fileList) {
				this.$message.warning('\u5F53\u524D\u9650\u5236\u9009\u62E9 3 \u4E2A\u6587\u4EF6\uFF0C\u672C\u6B21\u9009\u62E9\u4E86 ' + files.length + ' \u4E2A\u6587\u4EF6\uFF0C\u5171\u9009\u62E9\u4E86 ' + (files.length + fileList.length) + ' \u4E2A\u6587\u4EF6');
			},
			handleSuccess: function handleSuccess(res, file) {
				this.files.push(res.relPath);
				// d.filePath = res.relPath;
			},

			// handleAvatarSuccess(res, file) {
			// 	this.imageUrl = URL.createObjectURL(file.raw);
			// },

			beforeAvatarUpload: function beforeAvatarUpload(file) {
				console.log(file.type);

				var isJPG = file.type === 'image/jpeg';
				var isPNG = file.type === 'image/png';
				var isLt2M = file.size / 1024 / 1024 < 2;

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

			goback: function goback() {
				history.back();
			}
		},

		template: temp.feedback
	};

	COMPONENTS.About = {
		data: function data() {
			var d = {};
			return d;
		},

		methods: {},

		template: temp.about
	};

	COMPONENTS.EmailConfirm = {
		data: function data() {
			var d = {};

			this.sendConfirmData();

			return d;
		},

		methods: {
			sendConfirmData: function sendConfirmData() {
				tools.xhr('/emailConfirm' + location.search, function (resData) {
					this.$alert('账号已激活', '提示', {
						confirmButtonText: '确定',
						callback: function callback() {
							setTimeout(function () {
								location.href = location.origin + '/#/';
							}, 1000);
						}
					});
				}.bind(this), '', {}, function () {
					// 重新激活
					// location.href = location.origin + '/#/';
				});
			}
		},

		template: temp.emailConfirm
	};

	COMPONENTS.Stars = {
		data: function data() {
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

		mounted: function mounted() {
			this.fetchVideoStar(0);
			this.fetchShootVideo(0);
		},

		methods: {
			fetchVideoStar: function fetchVideoStar(pageNum) {
				tools.xhr('/vStars', function (resData) {
					this.vStars = resData.datalist;
					this.starTotal = resData.total;
				}.bind(this), 'get', {
					pageNum: pageNum,
					pageSize: this.pageSize
				});
			},

			fetchShootVideo: function fetchShootVideo(pageNum) {
				tools.xhr('/usrShotVideos', function (resData) {
					this.shotVideos = resData.datalist;
					this.videoTotal = resData.total;
				}.bind(this), 'get', {
					pageNum: pageNum,
					pageSize: this.pageSize
				});
			},

			handleVideoStarPageChange: function handleVideoStarPageChange(i) {
				this.fetchVideoStar(i - 1);
			},

			handleShootVideoPageChange: function handleShootVideoPageChange(i) {
				this.fetchShootVideo(i - 1);
			}
		}
	};

	COMPONENTS.Vstar = {
		props: ['vStarId'],
		data: function data() {
			console.log(this.vStarId);
			var d = {
				starVideos: [],
				total: 0,
				pageSize: CONSTANT.PAGESIZE
			};

			// tools.xhr('/starVideo/' + this.vStarId, function(resData){
			// 	d.starVideos = resData;
			// });

			return d;
		},

		template: temp.vStar,

		mounted: function mounted() {
			this.fetchStarVideo(0);
		},

		methods: {
			fetchStarVideo: function fetchStarVideo(pageNum) {
				tools.xhr('/starVideo/' + this.vStarId, function (resData) {
					this.starVideos = resData.datalist;
					this.total = resData.total;
				}.bind(this), 'get', {
					pageNum: pageNum,
					pageSize: this.pageSize
				});
			},

			handlePageChange: function handlePageChange(i) {
				this.fetchStarVideo(i - 1);
			},

			dynamivePreview: function dynamivePreview(e) {

				$(e.target).attr('src', function () {
					// console.log(arguments);
					return arguments[1].replace('cover.jpg', 'd_cover.gif');
				});
			},

			staticPreview: function staticPreview(e) {

				$(e.target).attr('src', function () {
					return arguments[1].replace('d_cover.gif', 'cover.jpg');
				});
			}
		}
	};

	COMPONENTS.UsrVshoots = {
		data: function data() {
			// console.log(this.$route.query.vId)
			var d = {
				shoots: [],
				total: 0,
				pageSize: CONSTANT.PAGESIZE
			};

			return d;
		},

		template: temp.usrVshoots,

		methods: {
			fetchVideoShoot: function fetchVideoShoot(pageNum) {
				tools.xhr('/usrVshoot?vId=' + this.$route.query.vId, function (resData) {
					this.shoots = resData.datalist;
					this.total = resData.total;
				}.bind(this), 'get', {
					pageNum: pageNum,
					pageSize: this.pageSize
				});
			},

			handlePageChange: function handlePageChange(i) {
				this.fetchVideoShoot(i - 1);
			}
		},

		mounted: function mounted() {
			this.fetchVideoShoot(0);

			$('#video-shoot-list').on('mouseover click', '.video-thumb', function () {
				var src = $(this).data('src');
				this.src = src + '.gif';
			}).on('mouseout', function () {
				// console.log(this)
				// this.src = src + '.jpg';
			});
		}
	};

	COMPONENTS.Compete = {
		data: function data() {
			var d = {
				MAPINDEX: 1000,
				options: [{ label: '赢', value: 1 }, { label: '输', value: 2 }, { label: '胜负未分', value: 3 }],
				matchResult: 3,
				matchPanelVisible: false,
				matchResultdialogVisible: false,
				defenseDialogVisible: false,

				matches: window.matches || [],
				match: {},
				usrDatumIntegrity: 0
			};

			return d;
		},

		template: temp.compete,

		methods: {
			fetchRelatedMatches: function fetchRelatedMatches() {
				tools.xhr('/relatedMatches', function (res) {
					this.matches = res;
					window.matches = Object.assign([], res);
				}.bind(this));
			},

			// 发起比赛
			foundMatch: function foundMatch(defenseId) {
				if (!usrDatumIntegrity) {
					return;
				}

				if (this.matches.length >= 1) {
					this.$message({
						message: '请先关闭之前的比赛',
						type: 'warning'
					});
				} else {
					tools.xhr('/match', function (res) {
						this.fetchRelatedMatches();
						this.$message({
							messgae: '比赛发起成功',
							type: 'success'
						});
					}.bind(this), 'post', {
						matchId: this.match.id
					});
				}
			},

			// 接受比赛
			acceptChallenge: function acceptChallenge() {
				if (!usrDatumIntegrity) {
					return;
				}

				tools.xhr('/match', function (res) {
					this.fetchRelatedMatches();

					this.$message({
						messgae: '应战成功',
						type: 'success'
					});
				}.bind(this), 'patch', {
					matchId: this.match.id
				});
			},

			// 接收比赛
			defense: function defense() {
				this.defenseDialogVisible = false;
				this.acceptChallenge();
			},

			// 确认比赛结果
			confirmMathcResult: function confirmMathcResult() {
				this.matchResultdialogVisible = false;
				this.markMatchResult();
			},

			// 记录比赛结果
			markMatchResult: function markMatchResult() {
				tools.xhr('/matchResult', function (res) {
					this.fetchRelatedMatches();

					this.$message({
						message: '记录成功',
						type: 'success'
					});

					this.matchPanelVisible = false;
					this.matchResult = 3;
				}.bind(this), 'patch', {
					matchId: this.match.id,
					result: this.matchResult
				}, function (res) {
					if (res.status == 400) {
						this.$message({
							message: '一天后才可以提交比赛结果',
							type: 'warning'
						});
					}
				}.bind(this));
			},

			showMatchDetail: function showMatchDetail(match, index) {
				this.match = match;

				if (match.stage == 1) {
					if (match.defensive) {
						// 是否接收
						this.defenseDialogVisible = true;
					} else {
						// 提示 “等待应答”
						this.$message({
							message: '等待对方应答',
							type: 'info'
						});
					}

					this.matchPanelVisible = false;
					this.matchResult = 3;
				} else if (match.stage == 2) {
					// 标记“胜负”
					this.matchPanelVisible = true;
				}
			},

			checkUsrDatumIntegrity: function checkUsrDatumIntegrity() {
				tools.xhr('/usrDatumIntegrity', function (res) {
					this.usrDatumIntegrity = res;
					if (!res) {
						this.$confirm('请完善资料', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(function () {
							location.href = "#/datum";
						}).catch(function () {
							location.href = "#/datum";
						});
					}
				}.bind(this));
			}
		},

		mounted: function mounted() {
			$('#map-script').remove();
			tools.insertScriptTag(1, '../js/map.js', { onload: function () {
					var mapConstainer = $('.map-container');

					mapConstainer.find('.close-btn').one('click', function () {
						// mapConstainer.hide();
						this.$router.go(-1);
					}.bind(this));
				}.bind(this), id: 'map-script' });

			this.fetchRelatedMatches();

			window.foundMatch = this.foundMatch;
		},

		created: function created() {
			this.checkUsrDatumIntegrity();
		}
	};

	window.COMPONENTS = COMPONENTS;
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function () {
    var fragment = {
        attachVideo: function attachVideo(vId) {
            return "{\n                if(Hls.isSupported()) {\n                    var video = $('video')[0];\n                    // window.vEle = video;\n                    \n                    var hls = new Hls({\n                        maxBufferLength: 20,\n                        maxMaxBufferLength: 20,\n                    });\n    \n                    hls.loadSource('/multimedia/ts/" + vId + "/_.m3u8');\n                    \n                    hls.attachMedia(video);\n    \n                    hls.on(Hls.Events.MANIFEST_PARSED,function() {\n                        // video.play();\n                        video.volume = .6;\n                    });\n                }\n            }";
        },

        attachSubtitle: "\n            console.log('attachSubtitle loaded')\n        ",

        captcha: "\n            {\n                if(!$('.jCaptcha').siblings('.jCaptchaText').length){\n                    var myCaptcha = new jCaptcha({\n                        callback: function(response, $captchaInputElement) {\n                            if (response == 'success') {\n                                $('#regist-btn').show();\n                            }else if (response == 'error') {\n                                $('#regist-btn').hide();\n                            }\n                        },\n                        focusOnError: false\n                    });\n            \n                    $('.jCaptcha').on('blur', function(e) {\n                        e.preventDefault();\n                        myCaptcha.validate();\n                    });\n                }\n            }\n        "
    };

    window.FRAGMENTS = fragment;
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function () {
	var routeConfig = [{
		path: '/',
		redirect: '/sports'
	}, {
		path: '/sports',
		component: COMPONENTS.Sports,
		meta: { title: '首页' }
	}, {
		path: '/sports/:sportId',
		component: COMPONENTS.AlbumList,
		meta: { title: '专辑列表' },
		props: function props(route) {
			return { sportId: route.params.sportId };
		}
	}, {
		path: '/albums/:albumId',
		component: COMPONENTS.Album,
		props: true,
		meta: { title: '视频列表' }
	}, {
		path: '/videos/:videoId',
		component: COMPONENTS.Video,
		meta: { title: '视频' },
		props: true
	}, {
		path: '/searchedvideos',
		component: COMPONENTS.searchedvideos,
		meta: { title: '视频列表' },
		beforeRouteUpdate: function beforeRouteUpdate(to, from, next) {
			console.log(to, from);
			next();
		}
	}, {
		path: '/datum',
		component: COMPONENTS.Datum
	}, {
		path: '/voteNext',
		component: COMPONENTS.VoteNext
	}, {
		path: '/feedback',
		component: COMPONENTS.Feedback
	}, {
		path: '/about',
		component: COMPONENTS.About
	}, {
		path: '/emailConfirm',
		component: COMPONENTS.EmailConfirm
	}, {
		path: '/retrievePsw',
		component: COMPONENTS.RetrievePsw
	}, {
		path: '/stars',
		component: COMPONENTS.Stars
	}, {
		path: '/vStar/:vStarId',
		component: COMPONENTS.Vstar,
		props: true
	}, {
		path: '/usrVshoots',
		component: COMPONENTS.UsrVshoots
	}, {
		path: '/compete',
		component: COMPONENTS.Compete
	}];

	window.routeConfig = routeConfig;
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function () {
    // setInterval(function(){debugger;}, 1000)

    // 视频播放页 收藏夹
    $('body').on('click', function () {
        $('#star-section').hide();
    });
};

/***/ })
/******/ ]);