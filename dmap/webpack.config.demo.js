const path = require('path');
const webpack = require('webpack');

const cesiumSource = 'node_modules/cesium/Source';
const webpackModuleConfig = require("./webpack-config/webpack-module-config.js");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
.BundleAnalyzerPlugin;
module.exports = {
    context: __dirname,
    entry: './src/demo.js',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, './dist'),
        //因为某些版本的webpack默认在输出时在每行之前添加\ t制表符。
        sourcePrefix: ''
    },
    amd: {
        // Enable webpack-friendly use of require in cesium
        toUrlUndefined: true
    },
    node: {
        // Resolve node module use of fs
        fs: "empty"
    },
    resolve: {
        mainFields: ['jsnext:main', 'main'],
        alias: {
            //确定vue的构建版本
            cesium: path.resolve(__dirname, cesiumSource)
        },
        extensions: ['*','.js','.vue','.json']
    },
    mode:"development",
    // devtool: 'cheap-module-eval-source-map', // source-map
    devServer: {
        contentBase: "./dist", // 本地服务器所加载文件的目录
        host:'localhost',
        port: "8701",   // 设置端口号为8701
        inline: true, // 文件修改后实时刷新
        historyApiFallback: true, //不跳转
    },
    plugins: [
        // new BundleAnalyzerPlugin(),
        new webpack.DefinePlugin({
            CESIUM_BASE_URL: JSON.stringify('./cesium')
        }),
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: "cesium",
                    chunks: "initial",
                    minChunks: 2
                }
            }
        }
    },
    module: webpackModuleConfig,
}