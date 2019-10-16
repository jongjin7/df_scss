const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackStringReplacePlugin = require ('html-webpack-string-replace-plugin');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    devtool: "inline-source-map",
    context: path.resolve(__dirname, './src/assets/'),
    entry: {
        commons:[
            './js/vendor.1.js',
            './js/vendor.2.js',
            './scss/globals.scss',
            './scss/custom.scss',
        ],
        main: ['./js/app.js'],
        admin: './js/admin.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist/dev/assets'),
        filename: 'js/[name].bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: false,
                                sourceMap: true,
                            }
                        },
                        {
                            loader: 'resolve-url-loader',
                            // ExtractTextPlugin을 이용하여 SCSS로더 컴파일할때 생성되는 소스맵 경로가 유실되므로,
                            // 이 로더를 이용하여 SCSS로더에 넘어오는 소스맵 경로를 재설정함
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true,
                            }
                        }
                    ],
                }),

            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]?[hash]',
                        publicPath: '../',
                    }
                }
            },
            {
                test: /\.(woff|woff2)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]?[hash]',
                        publicPath: '../',
                    }
                }
            },
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
        new CleanWebpackPlugin(['./dist/dev']),
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'commons',
        //     filename: './js/commons.js'
        // }),


        new ExtractTextPlugin({
            filename:  function(getPath){
                return getPath('css/app.bundle.css');
            },
            allChunks: true
        }),
        new CopyWebpackPlugin(
            [
                {from:'../data_tmp/**/*'},
            ]
        ),

        //*HTML Template*
        new HtmlWebpackPlugin({
            template: '../index.html',
            filename: '../index.html',
            chunks:['commons', 'main'],
            //inject: false,
            //chunksSortMode:'manual',

        }),
        new HtmlWebpackPlugin({
            template: '../html/admin.html',
            filename: '../html/admin.html',
            chunks:['commons','admin'],
            //inject:false,
        }),

        new HtmlWebpackPlugin({
            template: '../html/404.html',
            filename: '../404.html',
            inject:false,
        }),

        new HtmlWebpackPlugin({
            template: '../html/image_optimize.html',
            filename: '../html/image_optimize.html',
        }),

        new HtmlWebpackStringReplacePlugin({
            __LANG__:'ko',
        }),
    ],
    devServer: {
        open: true,
        //writeToDisk: true,
        //contentBase: path.join(__dirname, '/'),
        //watchContentBase: true,
        port: 8999,
        // historyApiFallback: {
        //     historyApiFallback: true
        // }
    }
}

