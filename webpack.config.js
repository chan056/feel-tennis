var webpack = require('webpack');

module.exports = {
    entry: [
        __dirname+'/src/static/lib/v.js',
        __dirname+'/src/static/lib/vue-bus.js',
        __dirname+'/src/static/lib/vue-router.js',
        __dirname+'/src/static/lib/axios.min.js',
        __dirname+'/src/static/lib/zepto.js',
        __dirname+'/src/static/lib/js.cookie.min.js',
        __dirname+'/src/static/lib/element/index.js',
        __dirname+'/src/static/lib/vue-clipboard.min.js',
        __dirname+'/src/static/js/constant.js',
        __dirname+'/src/static/js/tools.js',
        __dirname+'/src/static/js/template.js',
        __dirname+'/src/static/js/g-component.js',
        __dirname+'/src/static/js/component.js',
        __dirname+'/src/static/js/fragment.js',
        __dirname+'/src/static/js/router_config.js'],

    output: {
        path: __dirname,
        filename: 'bundle.js'
    },
    // module: {
    //     loaders: [
    //         {test: /\.css$/,loader: 'style-loader!css-loader'},
    //         // {test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=8192'},
    //         // {test: /\.svg/, loader: 'svg-url-loader'}
    //     ]
    // }
};