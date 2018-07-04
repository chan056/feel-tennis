//模块化思想
//1 启动server webpack-dev-server
//2 模块化开发commonjs
//3 版本号控制 hash或者chunkhash
//4 css，sass引入
//5 html自定义模板
//6 抽离css
//7 压缩合并JS
//8 用babel编译es6,需要创建.babelrc文件
//10 external外部配置文件(开发依赖)，例如项目用到jQuery
//11 file-loader处理图片

var webpack=require('webpack');

const path=require("path");

const env = process.env.NODE_ENV;

module.exports={
    mode: 'development',
    entry:{
        app: './src/static/js/source/entry.js',
        admin: './src/static/js/source/admin.js',
        sport_intro: './src/static/js/source/entry_sport_intro.js'// 运动介绍页
    },

    output:{
        path:__dirname + '/src/static/js/',
        filename: '[name].js'
    },

    module: {
        rules: [
            { 
                test: /\.js$/, 
                exclude: /node_modules/, 
                loader: "babel-loader"
            }
        ]
    },
    //4 配置HTML模板插件
    // 这样 webpack 编译的时候回自动在output目录下生成index.html
    plugins:[
     
    ],
    //10 项目依赖的外部文件，如jQuery
    /*10.1 这样配置之后，最后就不会把jquery打包到build.js里，而且
    * var $=require('jquery');这样仍然可以用
    *
    * */
    externals:{
       jquery:'window.jQuery'
    },

};