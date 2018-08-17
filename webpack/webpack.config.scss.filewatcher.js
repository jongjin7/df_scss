const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackStringReplacePlugin = require ('html-webpack-string-replace-plugin') ;
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');


module.exports = {
    devtool: 'inline-source-map',
    context: path.resolve(__dirname, './src/assets/'),
    entry: {
        app: './js/app.js',
        admin: './js/admin.js',
    },
    output: {
        path: path.resolve(__dirname, './dist/assets/'),
        filename: './js/[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'src'),
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['es2015', {modules: false}]
                        ]
                    }
                }]
            },
        ]
    },

    plugins: [
        new CleanWebpackPlugin(['./dist']), // 사용하고자할때는 해당 프로젝트에 맞게 설정
        new UglifyJSPlugin({
            test: /\.js($|\?)/i,
            sourceMap: true
        }),
        new CopyWebpackPlugin(
            [
               {from:'../assets/css/*'},
               {from:'../assets/images/*'},
               {from:'../assets/fonts/*'},
            ]
        ),

        //*HTML Template*
        new HtmlWebpackPlugin({
            filename: '../index.html',
            template: '../index.html',
            inject: false,
        }),
        new HtmlWebpackStringReplacePlugin({
            __LANG__:'kr',
        }),
    ],
};