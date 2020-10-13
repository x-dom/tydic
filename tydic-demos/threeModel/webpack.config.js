const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HappyPack = require('happypack')
const os = require('os')
const happyThreadPool = HappyPack.ThreadPool({size:os.cpus().length})
const copyWebpackPlugin = require('copy-webpack-plugin');
var config = {
    entry: {
        main: ["@babel/polyfill",path.resolve(__dirname,'./gismap/js/indexGIS')],
    },

    output: {

        path: path.join(__dirname, './dist'),
        filename: 'index.js'

    },
    plugins:[
      new HtmlWebpackPlugin({
          chunks: ['main'],
          filename: 'index.html',
          inject:'body',
          template: path.resolve(__dirname,'./index.html'),
      }),
      new HtmlWebpackPlugin({
          chunks: ['main'],
          filename: 'problem.html',
          inject:'body',
          template:path.resolve(__dirname,'./problem.html'),
      }),
      new CleanWebpackPlugin(),
      new HappyPack({
        id:"happyBabel",
        loaders:[
          {
            loader:"babel-loader",
            options:{
              presets:[
                ['@babel/preset-env', { modules: false }]
              ],
              cacheDirectory:true
            }
          }
        ],
        threadPool:happyThreadPool  //共享进程池
      }),
      new copyWebpackPlugin([{
        from:path.resolve(__dirname+'/expamle'),// 打包的静态资源目录地址
        to:'expamle' // 打包到dist下面的static
    }]),
    ],
    module:{
      rules:[
        {
          test:/\.js$/,
          use:[{
            loader:'happypack/loader?id=happyBabel'
          }],
          exclude:/node_modules/
        }
      ]
    }
}

module.exports = config;