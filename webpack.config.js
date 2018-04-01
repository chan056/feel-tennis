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
//4 配置HTML 模板 ,插件
var HtmlWebpackPlugin = require('html-webpack-plugin');
//6 把css抽离
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const path=require("path");

module.exports={
    //1 配置入口
    entry:'./src/js/entry.js',
    // 1.1 如果有多个入口
    //entry: ['./src/js/serch.js','./src/index.js'],
    //1.2 入口以对象的话，称为chunks，
    // 对象行形式 filename不能是一个了
    //entry:{
    //    app:'./src/js/index.js',
    //    serch:'./src/js/serch.js'
    //},
    //output:{
    //    path:__dirname+'/build',
    //    //3.1 如何配置版本号，清除缓存
    //    //filename:'[name]_[hash].js'
    //    filename:'[name]_[chunkhash].js'
    //},
    //2 配置出口（打包的输出路径）
    output:{
        path:__dirname+'/build',
        //filename:'bundle.js',
        // filename:'app_[hash].js'
        filename:'app_[chunkhash].js'
    },
    //3 配置服务器
    // devServer:{
    //     // contentBase:'./build',
    //     contentBase:path.join(__dirname, "build"),
    //     inline: true,
    //     port:8000,
    //     // host: "http://localhost",
    //     //9.1配置后台接口
    //     proxy:{//代理属性
    //         //路由映射
    //         "/api":{
    //             target:'http://localhost:9000/',
    //             pathRewrite: {"^/api":""}
    //         }
    //     }
    // },
    //5 引入loaders
    module:{
        rules:[
            //5.1 解析css,css-loader
            {
                test:/\.css$/,
                //loader:'style-loader!css-loader'
                // 6.2 想抽离出来得
                use:ExtractTextPlugin.extract({
                    fallback:'style-loader',
                    use:[
                      {
                        loader: 'css-loader',
                        // 压缩CSS
                        options:{
                          minimize: true
                        }
                      }
                    ]
                })
            },
            { //5.2.SASS的.scss 文件使用 style-loader、css-loader 和 sass-loader 来编译处理
                test: /\.scss$/,
                //loader: 'style-loader!css-loader!sass-loader'
                // 6.2 想抽离出来得
                use:ExtractTextPlugin.extract({
                    fallback:'style-loader',
                    use:[
                        "css-loader",
                        "sass-loader"
                    ]
                })
            },
            //11 处理图片
            {
                test:/\.(jpg|png|gif)$/,
                use:{
                    loader:'url-loader',
                    options: {
                        limit: 8192
                  }
                }
            },
            {
                test:/\.(woff|woff2|eot|ttf|svg)$/,
                use:{
                    loader:'url-loader',
                    options: {
                        limit: 100000
                  }
                }
            },
            //8 编译es6
            {
                test:'/\.js$/',
                exclude:/node_modules/,
                use:'babel-loader'
                //8.2在根目录创建.babelrc文件，并输入配置
                // use: [{
                //     loader: 'babel-loader',
                //     options: {
                //         presets: ['es2015']
                //     }
                // }]
            }
        ]
    },
    //4 配置HTML模板插件
    // 这样 webpack 编译的时候回自动在output目录下生成index.html
    plugins:[
        new HtmlWebpackPlugin({
            //4.1配置参数,html的title
            title:'webpack的配置',
            abc:'自定义输出',
            // 4.2 输出后html的名字，可以自定义
            filename:'index.html',
            //4.3 html的模板,也可以是xxx.html
            template:'webpack.temp.html'
        }),
        //7 代码优化：合并以及压缩代码
        // 开发环境暂时不需要
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            //7.1输出不显示警告
            compress:{
                warnings:false
            },
            //7.2 输出去掉注释
            output:{
                comments:false
            }
        }),

        //6.1 css抽离
        new ExtractTextPlugin({
            filename:'app_[hash].css',
            // filename:'app_[chunkhash].css',
            disable:false,
            allChunks:true
        })
    ],
    //10 项目依赖的外部文件，如jQuery
    /*10.1 这样配置之后，最后就不会把jquery打包到build.js里，而且
    * var $=require('jquery');这样仍然可以用
    *
    * */
    externals:{
       jquery:'window.jQuery'
    }
};