const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackStringReplacePlugin = require ('html-webpack-string-replace-plugin');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    context: path.resolve(__dirname, './src/assets/'),
    entry: {
        commons:[
            './js/vendor.1.js',
            './js/vendor.2.js',
            './scss/globals.scss',
            './scss/style.scss',
        ],
        main: ['./js/app.js'],
        admin: './js/admin.js',
    },
    output: {
        path: path.resolve(__dirname, './dist/prod/assets/'),
        filename: 'js/[name].bundle.js'
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
                                url: true,
                                //minimize: true,
                            }
                        },
                        {
                            loader: 'resolve-url-loader',
                            // ExtractTextPlugin을 이용하여 SCSS로더 컴파일할때 생성되는 소스맵 경로가 유실되므로,
                            // 이 로더를 이용하여 SCSS로더에 넘어오는 소스맵 경로를 재설정함
                        },
                        {
                            loader: 'sass-loader',
                        }
                    ],
                }),

            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use:[
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]?[hash]',
                            //limit: 1 * 1024, //1kb
                            publicPath: '../',
                        },
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            disable: true,
                            mozjpeg: {
                                progressive: true,
                                quality: 80,
                            },
                            // optipng.enabled: false will disable optipng
                            optipng: {
                                enabled: false,
                                // bitDepthReduction:true,
                                // paletteReduction:true,
                                // optimizationLevel:3,
                                // colorTypeReduction:true
                            },
                            pngquant: {
                                //floyd:1, //level of dethering(0=none, 1=full)
                                quality: '65-80',
                                speed: 4,
                                strip:true //remove metadata
                            },
                            gifsicle: {
                                interlaced: false,
                                // colors:8,
                                // optimizationLevel:3,
                            },
                            // the webp option will enable WEBP
                            // 이 옵션 활성화시 png, jpg 최적화 프로세스에 관여한다.
                            // webp로 1차 인코딩이 되는 듯 하다.
                            /*webp: {
                                quality: 75
                            }*/
                        }
                    },
                ]
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
        new CleanWebpackPlugin(['./dist/prod']),
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'commons',
        //     filename: './js/commons.js'
        // }),
        new webpack.optimize.UglifyJsPlugin({
            mangle: {
                screw_ie8: true,
                keep_fnames: true,
                except: ['$super', '$', 'exports', 'require']
            },
            beautify: false,
            comments: false,

            debug:false,
            sourceMap:false,
            //compress: true,
            compress: {
                // remove warnings
                warnings: false,

                // Drop console statements
                drop_console: true,
                drop_debugger: true

            }
        }),


        new ExtractTextPlugin({
            filename:  function(getPath){
                return getPath('css/app.bundle.css');
            },
            allChunks: true
        }),
        new CopyWebpackPlugin(
            [
                {from:"../data_tmp/**/*"},
            ]
        ),

        //*HTML Template*
        new HtmlWebpackPlugin({
            filename: '../index.html',
            template: '../index.html',
            chunks:['commons', 'main'],
            //inject: false,
            //chunksSortMode:'manual',

        }),
        new HtmlWebpackPlugin({
            filename: '../html/admin.html',
            template: '../html/admin.html',
            chunks:['commons','admin'],
            //inject:false,
        }),

        new HtmlWebpackPlugin({
            template: '../html/image_optimize.html',
            filename: '../html/image_optimize.html',
            chunks:['commons'],
        }),

        new HtmlWebpackStringReplacePlugin({
            __LANG__:'ko-KR',
        }),
    ],

}

