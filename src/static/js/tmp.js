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
/******/ 	return __webpack_require__(__webpack_require__.s = 336);
/******/ })
/************************************************************************/
/******/ ({

/***/ 336:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


temp.uploadAdmin = '\n    <div class="upload-wrapper">\n        <h2>\u89C6\u9891\u4E0A\u4F20</h2>\n\n        <el-row>\n            <el-col :span="4">\n                <label>\u8FD0\u52A8</label>\n            </el-col>\n\n            <el-col :span="10">\n                <el-select \n                :disabled="!videoEditable"\n                v-model="sport_id" \n                clearable \n                placeholder="\u8BF7\u9009\u62E9" \n                @change="handleChooseSport">\n                    <el-option\n                        v-for="item in sports"\n                        :key="item.id"\n                        :label="item.name"\n                        :value="item.id">\n                    </el-option>\n                </el-select>\n            </el-col>\n            \n            <el-button v-show="videoEditable" @click="newSportConfig.visibility=true" class="new-sport-btn">\u65B0\u5EFA\u8FD0\u52A8</el-button>\n        </el-row>\n\n        <el-row ng-show="sport_id">\n            <el-col :span="4">\n                <label>\u4E13\u8F91</label>\n            </el-col>\n\n            <el-col :span="10">\n                <el-select \n                :disabled="!videoEditable"\n                v-model="SO.albumId" \n                clearable \n                placeholder="\u8BF7\u9009\u62E9" \n                @command="chooseAlbumHandler">\n                    <el-option\n                        v-for="item in albums"\n                        :key="item.id"\n                        :label="item.name"\n                        :value="item.id">\n                    </el-option>\n                </el-select>\n            </el-col>\n            \n            <el-button v-show="videoEditable" @click="openAlbumDialog();" class="new-album-btn">\u65B0\u5EFA\u4E13\u8F91</el-button>\n        </el-row>\n\n        <el-row v-if="selectedMaker">\n            <el-col :span="4">\n                <label>\u4E13\u8F91\u4F5C\u8005</label>\n            </el-col>\n            <el-col :span="10">\n                <el-input v-model="selectedMaker" :disabled="!!selectedMaker" placeholder="\u8BF7\u8F93\u5165\u4F5C\u8005"></el-input>\n            </el-col>\n        </el-row>\n\n        <el-row>\n            <el-col :span="4">\n                <label>\u6807\u9898</label>\n            </el-col>\n\n            <el-col :span="10">\n                <el-input :disabled="!videoEditable" v-model="SO.headline" placeholder="\u8BF7\u8F93\u5165\u6807\u9898"></el-input>\n            </el-col>\n        </el-row>\n\n        <el-row>\n            <el-col :span="4">\n                <label>\u82F1\u6587\u6807\u9898</label>\n            </el-col>\n\n            <el-col :span="10">\n                <el-input :disabled="!videoEditable" v-model="SO.headlineEng" placeholder="\u8BF7\u8F93\u5165\u82F1\u6587\u6807\u9898"></el-input>\n            </el-col>\n        </el-row>\n\n        <el-row>\n            <el-col :span="4">\n                <label>\u6807\u7B7E</label>\n            </el-col>\n            <el-col :span="10">\n                <el-select v-model="SO.tag"\n                    :disabled="!videoEditable" \n                    clearable\n                    multiple\n                    filterable\n                    placeholder="\u8BF7\u9009\u62E9tag">\n                    <el-option\n                        v-for="item in tags"\n                        :key="item.id"\n                        :label="item.name"\n                        :value="item.id">\n                    </el-option>\n                </el-select>\n            </el-col>\n            \n            <el-button v-show="videoEditable" v-on:click="" @click="tagConfig.visibility = true" class="new-tag-btn">\u65B0\u5EFA\u6807\u7B7E</el-button>\n        </el-row>\n\n        <el-row>\n            <el-col :span="4">\n                <label>\u89C6\u9891</label>\n            </el-col>\n\n            <el-col :span="10">\n                <el-upload\n                    v-show="videoEditable"\n                    class="upload-demo"\n                    action="/upload"\n                    accept="video/*"\n                    :data="{type:\'video\'}"\n                    :on-preview="handlePreview"\n                    :on-remove="handleVideoRemove"\n                    :on-success="handleVideoSuccess"\n                    :limit="1"\n                    :on-exceed="handleExceed"\n                    :file-list="videoFileList"\n                    >\n                    <el-button size="small" type="primary">\u4E0A\u4F20\u89C6\u9891</el-button>\n                </el-upload>\n                <el-input v-show="!videoEditable" :value="vId+videoInfo.video_ext" disabled/>\n            </el-col>\n        </el-row>\n\n        <el-row>\n            <el-col :span="4">\n                <label>\u5B57\u5E55</label>\n            </el-col>\n\n            <el-col :span="10">\n                <el-upload\n                    v-show="videoEditable"\n                    class="upload-demo"\n                    action="/upload"\n                    accept=".srt"\n                    :data="{type:\'subtitle\'}"\n                    :on-remove="handleSubtitleRemove"\n                    :on-success="handleSubtitleSuccess"\n                    :limit="1"\n                    :on-exceed="handleExceed"\n                    :file-list="subtitleFileList"\n                    >\n                    <el-button size="small" type="primary">\u4E0A\u4F20\u5B57\u5E55</el-button>\n                </el-upload>\n                <el-input v-show="!videoEditable" :value="vId+\'.srt\'" disabled/>\n            </el-col>\n        </el-row>\n\n        <el-row>\n            <el-col :span="4">&nbsp;</el-col>\n            <el-col :span="10">\n                <el-button v-show="videoEditable && (vId || SO.videoAbsPath)" v-on:click="vId?putVideo(): postVideo()" class="new-video-btn">\u63D0\u4EA4</el-button>\n                <el-button v-show="!videoEditable" v-on:click="videoEditable=true;" class="new-video-btn">\u7F16\u8F91</el-button>\n            </el-col>\n        </el-row>\n\n        <el-dialog v-bind:title="newSportConfig.title" :visible.sync="newSportConfig.visibility" @close="newSportConfig.visibility=true">\n            <el-form class="newTagDialog">\n                <el-form-item label="\u8FD0\u52A8\u540D\u79F0">\n                    <el-input v-model="newSport.name" auto-complete="off"></el-input>\n                </el-form-item>\n            </el-form>\n            <div slot="footer" class="dialog-footer" v-show="!sId">\n                <el-button @click="newSportConfig.visibility = false">\u53D6 \u6D88</el-button>\n                <el-button type="primary" @click="newSportConfig.visibility = false; postSport();">\u786E \u5B9A</el-button>\n            </div>\n\n            <div slot="footer" class="dialog-footer" v-show="sId">\n                <el-button type="primary" @click="newSportConfig.visibility = false; putSport()">\u786E \u5B9A</el-button>\n                <el-button @click="backToSportList()">\u8FD4 \u56DE</el-button>\n            </div>\n        </el-dialog>\n\n        <el-dialog v-bind:title="albumConfig.title" :visible.sync="albumConfig.visibility" @close="dealCloseDialog">\n            <el-form class="newAlbumDialog">\n                <el-form-item label="\u8FD0\u52A8\u9879\u76EE">\n                    <el-select v-model="newAlbum.sportId" \n                        :disabled="!albumEditable"\n                        clearable\n                        filterable\n                        placeholder="\u8BF7\u9009\u62E9">\n                        <el-option\n                            v-for="item in sports"\n                            :key="item.id"\n                            :label="item.name"\n                            :value="item.id">\n                        </el-option>\n                    </el-select>\n                </el-form-item>\n                <el-form-item label="\u5236\u4F5C\u8005">\n                    <el-select v-model="newAlbum.maker" \n                        :disabled="!albumEditable"\n                        clearable\n                        filterable\n                        placeholder="\u8BF7\u9009\u62E9">\n                        <el-option\n                            v-for="item in makers"\n                            :key="item.id"\n                            :label="item.name"\n                            :value="item.id">\n                        </el-option>\n                    </el-select>\n                    <el-button @click="makerConfig.visibility=true" v-show="!aId || (aId && albumEditable)">\u521B\u5EFA</el-button>\n                </el-form-item>\n                <el-form-item label="\u6807\u7B7E">\n                    <el-select v-model="newAlbum.tag" \n                        :disabled="!albumEditable"\n                        clearable\n                        filterable\n                        placeholder="\u8BF7\u9009\u62E9">\n                        <el-option\n                            v-for="item in tags"\n                            :key="item.id"\n                            :label="item.name"\n                            :value="item.id">\n                        </el-option>\n                    </el-select>\n                </el-form-item>\n                <el-form-item label="\u4E13\u8F91\u540D\u79F0">\n                    <el-input v-model="newAlbum.name" :disabled="!albumEditable" auto-complete="off" style="width: 217px;"></el-input>\n                </el-form-item>\n                <el-form-item label="" v-if="!aId">\n                    <el-upload\n                        class="album-cover-uploader"\n                        action="/upload"\n                        :data="{type:\'img\'}"\n                        :on-remove="handleAlbumCoverRemove"\n                        :on-success="handleAlbumCoverSuccess"\n                        :limit="1"\n                        :on-exceed="handleExceed"\n                        :file-list="albumCoverfileList"\n                        >\n                        <el-button size="" type="primary">\u4E0A\u4F20\u5C01\u9762</el-button>\n                    </el-upload>\n                </el-form-item>\n                <el-form-item label="" v-if="aId">\n                    <el-upload\n                        v-show="albumEditable"\n                        class="album-cover-uploader"\n                        action="/upload"\n                        :data="{type:\'img\'}"\n                        :on-remove="handleAlbumCoverRemove"\n                        :on-success="handleAlbumCoverSuccess"\n                        :limit="1"\n                        :on-exceed="handleExceed"\n                        :file-list="albumCoverfileList"\n                        >\n                        <el-button size="" type="primary">\u4E0A\u4F20\u5C01\u9762</el-button>\n                    </el-upload>\n                    <img v-show="!albumEditable" :src="\'/img/cover/album/\' + aId + \'.jpg\'"/>\n                </el-form-item>\n            </el-form>\n            <div slot="footer" class="dialog-footer" v-show="!aId">\n                <el-button @click="albumConfig.visibility = false">\u53D6 \u6D88</el-button>\n                <el-button type="primary"  @click="albumConfig.visibility = false; postAlbum();">\u786E \u5B9A</el-button>\n            </div>\n\n            <div slot="footer" class="dialog-footer" v-show="aId">\n                <el-button type="primary" v-show="albumEditable" @click="albumConfig.visibility = false; putAlbum()">\u786E \u5B9A</el-button>\n                <el-button type="primary" @click="albumEditable=true" v-show="!albumEditable">\u7F16\u8F91</el-button>\n                <el-button @click="backToAlbumList()">\u8FD4 \u56DE</el-button>\n            </div>\n        </el-dialog>\n\n        <el-dialog v-bind:title="tagConfig.title" :visible.sync="tagConfig.visibility">\n            <el-form class="newTagDialog">\n                <el-form-item label="\u6807\u7B7E\u540D\u79F0">\n                    <el-input v-model="newTag.name" auto-complete="off"></el-input>\n                </el-form-item>\n                <el-form-item label="\u8FD0\u52A8\u9879\u76EE">\n                    <el-select v-model="newTag.sportId" \n                        clearable\n                        filterable\n                        placeholder="\u8BF7\u9009\u62E9">\n                        <el-option\n                            v-for="item in sports"\n                            :key="item.id"\n                            :label="item.name"\n                            :value="item.id">\n                        </el-option>\n                    </el-select>\n                </el-form-item>\n            </el-form>\n            <div slot="footer" class="dialog-footer">\n                <el-button @click="tagConfig.visibility = false">\u53D6 \u6D88</el-button>\n                <el-button type="primary" @click="tagConfig.visibility = false; postTag();">\u786E \u5B9A</el-button>\n            </div>\n        </el-dialog>\n\n        <el-dialog v-bind:title="makerConfig.title" :visible.sync="makerConfig.visibility">\n            <el-form class="newTagDialog">\n                <el-form-item label="\u540D\u5B57">\n                    <el-input v-model="newMaker.name" auto-complete="off"></el-input>\n                </el-form-item>\n                <el-form-item label="\u63CF\u8FF0">\n                    <el-input v-model="newMaker.desc" type="textarea" style="width: 300px;"></el-input>\n                </el-form-item>\n            </el-form>\n            <div slot="footer" class="dialog-footer">\n                <el-button @click="makerConfig.visibility = false">\u53D6 \u6D88</el-button>\n                <el-button type="primary" @click="makerConfig.visibility = false; postMaker();">\u786E \u5B9A</el-button>\n            </div>\n        </el-dialog>\n    </div>\n';

COMPONENTS.UploadAdmin = {
    props: ['vId', 'aId', 'sId'],
    data: function data() {
        var newSportConfig = {
            visibility: false,
            title: '新建运动'
        };

        var tagConfig = {
            visibility: false,
            title: '新建标签'
        };

        var albumConfig = {
            visibility: false,
            title: '新建专辑'
        };

        var makerConfig = {
            visibility: false,
            title: '新建制作者'
        };

        var d = {
            sport_id: null,
            SO: {
                albumId: '',
                headline: '',
                tag: '',
                videoAbsPath: '',
                subtitleAbsPath: ''
            },
            albums: [],
            tags: [],
            sports: [],
            makers: [],
            newSportConfig: newSportConfig,
            tagConfig: tagConfig,
            albumConfig: albumConfig,
            makerConfig: makerConfig,

            newSport: {},
            newTag: {},
            newAlbum: { sportId: '', maker: '', tag: '', name: '', cover: '' }, // 必须要给默认值？
            newMaker: {},
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

        if (this.vId) {
            d.videoEditable = false;
        } else if (this.aId) {
            d.albumEditable = false;
        } else if (this.sId) {
            d.newSportConfig = {
                title: '编辑运动',
                visibility: true
            };
        }

        d.fileList = [];

        return d;
    },
    methods: {
        dealCloseDialog: function dealCloseDialog() {
            if (this.aId) {
                this.albumConfig.visibility = true;
            }
        },

        backToAlbumList: function backToAlbumList() {
            location.href = "#/albumsAdmin";
        },

        backToSportList: function backToSportList() {
            location.href = "#/sportsAdmin";
        },

        handleVideoRemove: function handleVideoRemove(file, fileList) {
            this.SO.videoAbsPath = '';
        },
        handleSubtitleRemove: function handleSubtitleRemove(file, fileList) {
            this.SO.subtitleAbsPath = '';
        },
        handleAlbumCoverRemove: function handleAlbumCoverRemove(file, fileList) {
            this.newAlbum.cover = '';
        },
        handlePreview: function handlePreview(file) {
            console.log(file);
        },

        // 只能传一个文件，视频、字幕、专辑封面
        handleExceed: function handleExceed(files, fileList) {
            this.$message.warning('\u53EA\u80FD\u4F20\u4E00\u4E2A\u6587\u4EF6');
            // this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        handleVideoSuccess: function handleVideoSuccess(res) {
            // console.log(res);
            this.SO.videoAbsPath = res.absPath;
        },
        handleSubtitleSuccess: function handleSubtitleSuccess(res) {
            this.SO.subtitleAbsPath = res.absPath;
        },
        handleAlbumCoverSuccess: function handleAlbumCoverSuccess(res) {
            this.newAlbum.cover = res.relPath;
        },


        handleChooseSport: function handleChooseSport(sportId) {
            if (sportId) this.queryAlbums(sportId);
        },

        postVideo: function postVideo() {
            var so = Object.assign({}, this.SO);
            so.tag = this.SO.tag.join(',');

            tools.xhr('/video', function () {
                var vId = this.vId;
                var action = this.vId ? '更新' : '创建';
                var message = '\u89C6\u9891' + action + '\u6210\u529F';

                this.$message({
                    message: message,
                    type: 'success'
                });

                this.SO.videoAbsPath = '';
                this.SO.subtitleAbsPath = '';

                this.videoFileList = [];
                this.subtitleFileList = [];
            }.bind(this), 'post', so);
        },
        postSport: function postSport() {

            tools.xhr('/sport', function () {
                this.$message({
                    message: '新建成功',
                    type: 'success'
                });
                this.querySports();
            }.bind(this), 'post', this.newSport);
        },
        postTag: function postTag() {

            tools.xhr('/tag', function () {
                console.log(arguments);
            }, 'post', this.newTag);
        },
        postMaker: function postMaker() {
            tools.xhr('/maker', function () {
                console.log(arguments);
                this.$message({
                    message: '制作者创建成功',
                    type: 'success'
                });
                this.queryMakers();
            }.bind(this), 'post', this.newMaker);
        },
        openAlbumDialog: function openAlbumDialog() {
            this.albumConfig.visibility = true;
            this.queryMakers();
        },
        postAlbum: function postAlbum() {
            tools.xhr('/album', function () {
                // console.log(arguments);
                this.$message({
                    message: '专辑创建成功',
                    type: 'success'
                });

                this.queryAlbums(this.sport_id);
            }.bind(this), 'post', this.newAlbum);
        },
        queryAlbums: function queryAlbums(sportId) {
            if (!sportId) return;

            tools.xhr('/sports/' + sportId + '/albums', function (resData) {
                this.albums = resData;
            }.bind(this));
        },
        queryTags: function queryTags() {
            tools.xhr('/tags', function (resData) {
                this.tags = resData;
            }.bind(this));
        },
        querySports: function querySports() {
            tools.xhr('/sports', function (resData) {
                this.sports = resData;
            }.bind(this));
        },
        queryMakers: function queryMakers() {
            tools.xhr('/makers', function (resData) {
                this.makers = resData;
            }.bind(this));
        },
        chooseAlbumHandler: function chooseAlbumHandler() {
            console.log('chooseAlbumHandler', arguments);
        },
        queryMaker: function queryMaker(makerId) {
            tools.xhr('/maker/' + makerId, function (resData) {
                var makerInfo = resData[0];
                if (makerInfo) {
                    this.selectedMaker = resData[0].name;
                } else {
                    this.selectedMaker = '';
                }
            }.bind(this));
        },
        fetchVideoInfo: function fetchVideoInfo(fn) {
            tools.xhr('/videoInfo/' + this.vId, function (resData) {
                this.videoInfo = resData;

                this.sport_id = resData.sport_id;

                this.SO.albumId = resData.album_id;
                this.SO.headline = resData.headline;
                this.SO.headlineEng = resData.headline_eng;
                this.SO.tag = resData.tag ? resData.tag.split(',').map(function () {
                    return Number(arguments[0]);
                }) : [];

                fn && fn(resData.sport_id);
            }.bind(this));
        },


        fetchAlbumInfo: function fetchAlbumInfo() {
            tools.xhr('/albumInfo/' + this.aId, function (resData) {
                this.newAlbum.sportId = resData.sport_id;
                this.newAlbum.maker = Number(resData.author_id);
                this.newAlbum.tag = Number(resData.tag);
                this.newAlbum.name = resData.name;
            }.bind(this));
        },

        fetchSportInfo: function fetchSportInfo() {
            tools.xhr('/sportInfo/' + this.sId, function (resData) {
                this.newSport.name = resData.name;
            }.bind(this));
        },

        putVideo: function putVideo() {
            var so = Object.assign({}, this.SO);
            so.tag = this.SO.tag.join(',');

            tools.xhr('/video/' + this.vId, function () {
                console.log(arguments);
                this.$message({
                    message: '视频更新成功',
                    type: 'success'
                });
                this.videoEditable = false;

                this.SO.videoAbsPath = '';
                this.SO.subtitleAbsPath = '';

                this.videoFileList = [];
                this.subtitleFileList = [];
            }.bind(this), 'put', so, function () {
                this.SO.subtitleAbsPath = '';
                this.SO.videoAbsPath = '';
            });
        },


        putAlbum: function putAlbum() {
            tools.xhr('/album/' + this.aId, function () {
                this.$message({
                    message: '更新成功',
                    type: 'success'
                });
                this.albumEditable = false;
                location.href = "#/albumsAdmin";
            }.bind(this), 'put', this.newAlbum, function () {
                this.$message({
                    message: '更新出错',
                    type: 'success'
                });
            });
        },

        putSport: function putSport() {
            tools.xhr('/sport/' + this.sId, function () {
                this.$message({
                    message: '更新成功',
                    type: 'success'
                });
                location.href = "#/sportsAdmin";
            }.bind(this), 'put', this.newSport, function () {
                this.$message({
                    message: '更新出错',
                    type: 'success'
                });
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

    mounted: function mounted() {

        tools.togglePageIE(this);
        if (this.vId) {
            this.fetchVideoInfo(function (sId) {
                this.queryAlbums(sId);
            }.bind(this));
        } else if (this.aId) {
            this.fetchAlbumInfo();
            this.queryMakers();
            this.albumConfig.visibility = true;
            this.albumConfig.title = '更新专辑';
        } else if (this.sId) {
            this.fetchSportInfo();
        }

        this.querySports();
        this.queryTags();
    },

    template: temp.uploadAdmin
};

routeConfig.push({ path: '/uploadAdmin', component: COMPONENTS.UploadAdmin, props: function props(route) {
        return { vId: route.query.vId, aId: route.query.aId, sId: route.query.sId };
    } });

temp.feedbacksAdmin = '\n    <div>\n        <h2>\u53CD\u9988\u5217\u8868</h2>\n\n        <el-table\n        :data="feedbacks"\n        style="width: 100%">\n            <el-table-column\n                prop="id"\n                label="\u7F16\u53F7">\n            </el-table-column>\n            <el-table-column\n                prop="ip"\n                label="ip">\n            </el-table-column>\n            <el-table-column\n                prop="usr_id"\n                label="\u7528\u6237id">\n            </el-table-column>\n            <el-table-column\n                prop="description"\n                label="\u63CF\u8FF0">\n            </el-table-column>\n            <el-table-column\n                prop="site"\n                label="\u7F51\u5740">\n            </el-table-column>\n            <el-table-column\n                prop="wechat"\n                label="\u5FAE\u4FE1">\n            </el-table-column>\n            <el-table-column\n                prop="email"\n                label="\u90AE\u4EF6">\n            </el-table-column>\n            <el-table-column\n                prop="files"\n                label="\u6587\u4EF6">\n            </el-table-column>\n            <el-table-column\n                fixed="right"\n                label="\u64CD\u4F5C"\n                width="100">\n                <template slot-scope="scope">\n                    <el-button @click="deleteFeedback(scope.row.id)" type="text" size="small">\u5220\u9664</el-button>\n                    <el-button v-if="!scope.row.black_usr_id_record && !scope.row.black_ip_record" @click="blockUsr(scope.row.ip, scope.row.usr_id, $event)" type="text" size="small">\u52A0\u9ED1</el-button>\n                </template>\n            </el-table-column>\n        </el-table>\n\n        <el-pagination\n            layout="prev, pager, next"\n            :total="total"\n            :page-size="pageSize"\n            @current-change="fetchFeedbacks">\n        </el-pagination>\n    </div>\n';

COMPONENTS.FeedbacksAdmin = {
    data: function data() {

        var d = {
            pageSize: 10,
            curPage: 0,
            total: 0,
            feedbacks: []
        };

        return d;
    },
    methods: {
        postTag: function postTag() {

            tools.xhr('/tag', function () {
                console.log(arguments);
            }, 'post', this.newTag);
        },
        fetchFeedbacks: function fetchFeedbacks(pageNum) {
            tools.xhr('/feedbacks', function (resData) {
                this.feedbacks = resData.datalist;
                this.total = resData.total;
                this.curPage = pageNum;
            }.bind(this), 'get', {
                pageNum: pageNum - 1,
                pageSize: this.pageSize
            });
        },


        deleteFeedback: function deleteFeedback(id) {
            this.$confirm('确定删除', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function () {
                tools.xhr('/feedback/' + id, function (resData) {
                    this.fetchFeedbacks(this.curPage);
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                }.bind(this), 'delete');
            }.bind(this)).catch(function () {});
        },

        blockUsr: function blockUsr(ip, usrId, e) {
            this.$confirm('确认加黑？').then(function () {
                tools.xhr('/blockedUsr', function (resData) {
                    this.$message({
                        message: '加黑成功',
                        type: 'success'
                    });

                    // $(e.target).remove();
                }.bind(this), 'post', {
                    ip: ip,
                    usrId: usrId
                });
            }.bind(this)).catch(function () {});
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

    mounted: function mounted() {

        tools.togglePageIE(this);
        this.fetchFeedbacks(1);
    }
};

routeConfig.push({ path: '/feedbacksAdmin', component: COMPONENTS.FeedbacksAdmin });

temp.videosAdmin = '\n    <div>\n        <h2>\u89C6\u9891\u5217\u8868</h2>\n\n        <el-table\n        :data="videos"\n        style="width: 100%">\n            <el-table-column\n                prop="id"\n                label="id">\n            </el-table-column>\n            \n            <el-table-column\n                prop="album_id"\n                label="album_id">\n            </el-table-column>\n            <el-table-column\n                prop="headline"\n                label="headline">\n            </el-table-column>\n            <el-table-column\n                prop="tag"\n                label="tag">\n            </el-table-column>\n\n            <el-table-column\n                fixed="right"\n                label="\u64CD\u4F5C"\n                width="200">\n                <template slot-scope="scope">\n                    <el-button @click="patchVideo(scope.row.id)" type="text" size="small">\u66F4\u65B0</el-button>\n                    <el-button @click="deleteVideo(scope.row.id)" type="text" size="small">\u5220\u9664</el-button>\n                    <el-button @click="redirect(scope.row.id)" type="text" size="small">\u67E5\u770B</el-button>\n                </template>\n            </el-table-column>\n        </el-table>\n\n        <el-pagination\n            layout="prev, pager, next"\n            :total="total"\n            :page-size="pageSize"\n            @current-change="fetchVideos">\n        </el-pagination>\n    </div>\n';

COMPONENTS.VideosAdmin = {
    data: function data() {

        var d = {
            pageSize: 10,
            curPage: 0,
            total: 0,
            videos: []
        };

        return d;
    },
    methods: {
        fetchVideos: function fetchVideos(pageNum) {
            tools.xhr('/pageVideos', function (resData) {
                this.videos = resData.datalist;
                this.total = resData.total;
                this.curPage = pageNum;
            }.bind(this), 'get', {
                pageNum: pageNum - 1,
                pageSize: this.pageSize
            });
        },


        patchVideo: function patchVideo(id) {
            location.href = '#/uploadAdmin?vId=' + id;
        },

        deleteVideo: function deleteVideo(id) {
            this.$confirm('确定删除', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function () {
                tools.xhr('/video/' + id, function (resData) {
                    this.fetchVideos(this.curPage);
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                }.bind(this), 'delete');
            }.bind(this)).catch(function () {});
        },

        redirect: function redirect(id) {
            location.href = "#/videos/" + id;
        }
    },

    template: temp.videosAdmin,

    mounted: function mounted() {
        tools.togglePageIE(this);
        this.fetchVideos(1);
    }
};

routeConfig.push({ path: '/videosAdmin', component: COMPONENTS.VideosAdmin });

temp.albumsAdmin = '\n    <div>\n        <h2>\u4E13\u8F91\u5217\u8868</h2>\n\n        <el-table\n        :data="albums"\n        style="width: 100%">\n            <el-table-column\n                prop="id"\n                label="id">\n            </el-table-column>\n            \n            <el-table-column\n                prop="sport_id"\n                label="\u8FD0\u52A8">\n            </el-table-column>\n            <el-table-column\n                prop="author_id"\n                label="\u5236\u4F5C\u8005\u7F16\u53F7">\n            </el-table-column>\n            <el-table-column\n                prop="name"\n                label="\u6807\u9898">\n            </el-table-column>\n            <el-table-column\n                prop="tag"\n                label="\u6807\u7B7E">\n            </el-table-column>\n            <el-table-column\n                prop="impression"\n                label="\u89C2\u770B\u6B21\u6570">\n            </el-table-column>\n            <el-table-column\n                prop="update_time"\n                label="\u66F4\u65B0\u65F6\u95F4">\n            </el-table-column>\n\n            <el-table-column\n                fixed="right"\n                label="\u64CD\u4F5C"\n                width="200">\n                <template slot-scope="scope">\n                    <el-button @click="patchAlbum(scope.row.id)" type="text" size="small">\u66F4\u65B0</el-button>\n                    <el-button @click="deleteAlbum(scope.row.id)" type="text" size="small">\u5220\u9664</el-button>\n                    <el-button @click="redirect(scope.row.id)" type="text" size="small">\u67E5\u770B</el-button>\n                </template>\n            </el-table-column>\n        </el-table>\n\n        <el-pagination\n            layout="prev, pager, next"\n            :total="total"\n            :page-size="pageSize"\n            @current-change="fetchAlbums">\n        </el-pagination>\n    </div>\n';

COMPONENTS.AlbumsAdmin = {
    data: function data() {

        var d = {
            pageSize: 10,
            curPage: 0,
            total: 0,
            albums: []
        };

        return d;
    },
    methods: {
        fetchAlbums: function fetchAlbums(pageNum) {
            // 分页专辑
            tools.xhr('/albums', function (resData) {
                this.albums = resData.datalist;
                this.total = resData.total;
                this.curPage = pageNum;
            }.bind(this), 'get', {
                pageNum: pageNum - 1,
                pageSize: this.pageSize
            });
        },


        patchAlbum: function patchAlbum(id) {
            location.href = '#/uploadAdmin?aId=' + id;
        },

        deleteAlbum: function deleteAlbum(id) {
            this.$confirm('确定删除', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function () {
                tools.xhr('/album/' + id, function (resData) {
                    this.fetchAlbums(this.curPage);
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                }.bind(this), 'delete');
            }.bind(this)).catch(function () {});
        },

        redirect: function redirect(id) {
            location.href = "#/albums/" + id;
        }
    },

    template: temp.albumsAdmin,

    mounted: function mounted() {
        tools.togglePageIE(this);
        this.fetchAlbums(1);
    }
};

routeConfig.push({ path: '/albumsAdmin', component: COMPONENTS.AlbumsAdmin });

temp.sportsAdmin = '\n    <div>\n        <h2>\u8FD0\u52A8\u5217\u8868</h2>\n\n        <el-table\n        :data="sports"\n        style="width: 100%">\n            <el-table-column\n                prop="id"\n                label="id">\n            </el-table-column>\n            \n            <el-table-column\n                prop="name"\n                label="\u540D\u79F0">\n            </el-table-column>\n\n            <el-table-column\n                prop="impression"\n                label="\u89C2\u770B\u6B21\u6570">\n            </el-table-column>\n\n            <el-table-column\n                prop="update_time"\n                label="\u66F4\u65B0\u65F6\u95F4">\n            </el-table-column>\n\n            <el-table-column\n                fixed="right"\n                label="\u64CD\u4F5C"\n                width="200">\n                <template slot-scope="scope">\n                    <el-button @click="patchSport(scope.row.id)" type="text" size="small">\u66F4\u65B0</el-button>\n                    <el-button @click="deleteSport(scope.row.id)" type="text" size="small">\u5220\u9664</el-button>\n                    <el-button @click="redirect(scope.row.id)" type="text" size="small">\u67E5\u770B</el-button>\n                </template>\n            </el-table-column>\n        </el-table>\n\n        <el-pagination\n            layout="prev, pager, next"\n            :total="total"\n            :page-size="pageSize"\n            @current-change="fetchSports">\n        </el-pagination>\n    </div>\n';

COMPONENTS.SportsAdmin = {
    data: function data() {

        var d = {
            pageSize: 10,
            curPage: 0,
            total: 0,
            sports: []
        };

        return d;
    },
    methods: {
        fetchSports: function fetchSports(pageNum) {
            // 分页专辑
            tools.xhr('/sports', function (resData) {
                this.sports = resData.datalist;
                this.total = resData.total;
                this.curPage = pageNum;
            }.bind(this), 'get', {
                pageNum: pageNum - 1,
                pageSize: this.pageSize
            });
        },


        patchSport: function patchSport(id) {
            location.href = '#/uploadAdmin?sId=' + id;
        },

        deleteSport: function deleteSport(id) {
            this.$confirm('确定删除', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function () {
                tools.xhr('/sport/' + id, function (resData) {
                    this.fetchSports(this.curPage);
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                }.bind(this), 'delete');
            }.bind(this)).catch(function () {});
        },

        redirect: function redirect(id) {
            location.href = "#/sports/" + id;
        }
    },

    template: temp.sportsAdmin,

    mounted: function mounted() {
        tools.togglePageIE(this);
        this.fetchSports(1);
    }
};

routeConfig.push({ path: '/sportsAdmin', component: COMPONENTS.SportsAdmin });

/***/ })

/******/ });
$(function(){

	var navInstance = new Vue(COMPONENTS.HeaderComponent);

	var asideInstance = new Vue(COMPONENTS.AsideComponent);

	var mainRouter = new VueRouter({
		routes: routeConfig
	});
	
	mainRouter.beforeEach(function (to, from, next) {
		console.log(from.fullPath, '==>', to.fullPath);
		next();
	});
	
	var mainInstance = new Vue({
		router: mainRouter
	});

	mainInstance.$mount('#main-router-view');

});