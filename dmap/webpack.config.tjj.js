const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require("html-webpack-plugin");//自动生成HTML页面插件
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const cesiumSource = 'node_modules/cesium/Source';
const cesiumWorkers = '../Build/Cesium/Workers';
const webpackModuleConfig = require("./webpack-config/webpack-module-config.js");
module.exports = {
    context: __dirname,
    entry: './src/tjj.js',
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
            'vue$':'vue/dist/vue.esm.js',
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
        new VueLoaderPlugin(),
        // new HtmlWebpackPlugin()
        // Copy Cesium Assets, Widgets, and Workers to a static directory
        new CopyWebpackPlugin([{from: path.join(cesiumSource, cesiumWorkers), to: 'Workers'}]),
        new CopyWebpackPlugin([{from: path.join(cesiumSource, 'Assets'), to: 'Assets'}]),
        new CopyWebpackPlugin([{from: path.join(cesiumSource, 'Widgets'), to: 'Widgets'}]),
        new UglifyJsPlugin(),
        new webpack.DefinePlugin({
            // Define relative base path in cesium for loading assets
            CESIUM_BASE_URL: JSON.stringify('')
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



// const babelPresets = [['@babel/preset-env', {
//     'targets': {
//       'browsers': ['last 2 versions', 'Firefox ESR', 'ie 11'],
//     },
//     'modules': false,
//     'loose': true,
//   }]];

//   const olRule = {
//     test: /ol\/.*\.js$/,
//     use: {
//       loader: 'babel-loader',
//       options: {
//         babelrc: false,
//         presets: babelPresets,
//       }
//     }
//   };
  
//   const olcsRule = {
//     test: /olcs\/.*\.js$/,
//     use: {
//       loader: 'babel-loader',
//       options: {
//         babelrc: false,
//         presets: babelPresets,
//       }
//     }
//   };

//   module.exports.module.rules.push(olRule);
//   module.exports.module.rules.push(olcsRule);