var webpack = require('webpack');

module.exports = {
    entry: __dirname+'/src/static/page/entry.js',
    output: {
        path: __dirname,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {test: /\.css$/,loader: 'style-loader!css-loader'},
            // {test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=8192'},
            // {test: /\.svg/, loader: 'svg-url-loader'}
        ]
    }
};