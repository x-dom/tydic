const path = require('path');

module.exports = {
  //解决Critical dependency: require function is used in a way in which dependencies cannot be statically extracted的问题
  unknownContextCritical : false,
  rules: [
      {
          test: /\.vue$/, 
          loader: 'vue-loader',
          exclude: /node_modules/    
      },
      {
          test: /\.css$/,   // 正则匹配以.css结尾的文件
          exclude:/\.module\.css$/,
          use: ['style-loader', 'css-loader']  // 需要用的loader，一定是这个顺序，因为调用loader是从右往左编译的
      },
      {
        test: /\.less$/,
        use:[
            {
                loader: "style-loader"
            },
            {
                loader: "css-loader"
            },
            {
                loader: "less-loader"
            }
        ]
      },
      {
          test: /\.(png|gif|jpg|jpeg|svg|xml|json)$/,
          use: ['url-loader']
      },
      {
          test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
          loader: 'file-loader'
      },
      {
              test: /\.js$/,
              exclude: /node_modules/, 
              use:[{
                  loader: "babel-loader",
                  options:{
                  presets:["@babel/preset-env"]
                  }
              }]
      },
      {
          test: /\.js$/,
          loader: 'eslint-loader',
          enforce: "pre",
          include: [path.resolve(__dirname, 'DMap')], // 指定检查的目录
          options: { // 这里的配置项参数将会被传递到 eslint 的 CLIEngine 
              formatter: require('eslint-friendly-formatter') // 指定错误报告的格式规范
          }
      },
      {
          test: /\.jsx$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
              plugins: ['react-hot-loader/babel'], // 热更新插件
              presets: ['@babel/preset-env', '@babel/preset-react'] // jsx转为js函数
          },
      },
      {
          test: require.resolve('jquery'),
          use: [
              {
                  loader: 'expose-loader',
                  options: '$'
              },
              {
                  loader: 'expose-loader',
                  options: 'jQuery'
              }
          ]
      },
      {

        test: /\.json$/i,

        type: 'javascript/auto',

        loader: 'json-loader'

    }
  ]
}