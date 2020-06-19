var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var { CleanWebpackPlugin } = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const { getEntry, getHtmlConfig } = require('./utils')
const { subdirectory } = require('./config')
const baseConfig = {
  context: path.resolve(__dirname, '../'),
  entry: getEntry(),
  output: {
    path: path.join(__dirname, '../dist'),
    filename: subdirectory + "js/[name].js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', "postcss-loader", "sass-loader"]
        })
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', "postcss-loader"]
        })
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name][hash:5].[ext]',//设置抽离打包图片的名称--[ext]用来获取图片的后缀
              limit: 5000,//限制图片大小 <= 100kb 进行base64编码（小于100kb打包进js文件）--测试时根据图片的大小调整
              outputPath: subdirectory + 'images/',//设置输出文件夹名称，这个文件夹会与主入口文件在同一路径下
              publicPath: 'images/',
              esModule: false,
              useRelativePath: false,
            }
          },
        ]
      },
      {
        test: /\.html$/,
        use: ['html-withimg-loader']
      }
    ]
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   filename: "morningPaper/index.html",
    //   template: "./src/pages/index/index.html",
    //   chunks: ["index"],
    // }),
    // new HtmlWebpackPlugin({
    //   filename: "morningPaper/list.html",
    //   template: "./src/pages/list/list.html",
    //   chunks: ["list"],
    // }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      'window.Jquery': "jquery"
    }),
    new ExtractTextPlugin({
      filename: subdirectory + 'css/[name].css',
    }),

    new CleanWebpackPlugin(),
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          output: {
            comments: false
          },
          compress: {
            drop_debugger: true,
            drop_console: true
          }
        }
      })
    ],
    splitChunks: {
      cacheGroups: {
        commons: {
          name: "vendor",
          chunks: 'initial',
          minChunks: 2
        }
      }
    }
  },
}
//插入htmlWebpackPlugin
const entryObj = getEntry();
//存储路径和chunks
const htmlArray = [];
for (let key in entryObj) {
  htmlArray.push({
    html: key,
    chunks: [key]
  })
}
//自动生成html模板
htmlArray.forEach((element) => {
  baseConfig.plugins.push(new HtmlWebpackPlugin(getHtmlConfig(element.html, element.chunks)));
});
module.exports = baseConfig