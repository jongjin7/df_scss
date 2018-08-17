const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackStringReplacePlugin = require ('html-webpack-string-replace-plugin');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    devtool: "inline-source-map", // css,js 소스맵 생성 허용
    context: path.resolve(__dirname, './src/assets/'),
    entry: {
        commons:[
            './js/vendor.1.js',
            './js/vendor.2.js',
            
            './scss/globals.scss',
            './scss/style.scss',
        ],
        main: ['./js/app.js',],
        admin: './js/admin.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist/'),
        filename: 'assets/js/[name].bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                loader: [
                    {
                        loader:'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: false,
                            sourceMap: true,
                        }
                    },
                    {
                        loader: 'resolve-url-loader',
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                        }
                    }
                ]
            },

            {
                test: /\.(png|jpg|gif|svg)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]?[hash]',
                    }
                }
            },
            {
                test: /\.(woff|woff2)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]?[hash]',
                    }
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use:[
                    {
                        loader:'babel-loader',
                        options: {
                            presets: [[
                                'env', {
                                    targets: {
                                        browsers: ['last 3 versions']
                                    }
                                }
                            ]],
                        }
                    }
                ]
            },
        ]
    },

    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),

        new UglifyJSPlugin({
            test: /\.js($|\?)/i,
            sourceMap: true
        }),

        new CopyWebpackPlugin(
            [
                {from:'../data_tmp/**/*', to:'data_tmp/'},
            ]
        ),

        //*HTML Template*
        new HtmlWebpackPlugin({
            template: '../index.html',
            filename: 'index.html',
            chunks:['commons', 'main'],
            //inject: false,
            //chunksSortMode:'manual',

        }),
        new HtmlWebpackPlugin({
            template: '../html/admin.html',
            filename: 'admin.html',
            chunks:['commons','admin'],
            //inject:false,
        }),

        new HtmlWebpackPlugin({
            template: '../html/404.html',
            filename: '404.html',
            inject:false,
        }),

        new HtmlWebpackPlugin({
            template: '../html/image_optimize.html',
            filename: 'image_optimize.html',
        }),

        new HtmlWebpackStringReplacePlugin({
            __LANG__:'ko',
        }),
    ],
    devServer: {
        hot: true,
        inline: true,
        contentBase: path.resolve(__dirname, 'dist/'),
        //compress: true,
        //port: 3002,
        open:true,
        //openPage:'index.html',
        //index:'index.html',
        //filename:'filename',
        //publicPath: '/',
        //historyApiFallback: true,
        // proxy: {
        //     "**": "http://localhost:3000"
        // }
    },

}

