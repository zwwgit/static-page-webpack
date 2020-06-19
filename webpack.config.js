var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var { CleanWebpackPlugin } = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const env = process.env.NODE_ENV
const autoprefixer = require("autoprefixer")

const ExtractTextPlugin = require('extract-text-webpack-plugin')
module.exports = {
  entry: {
    index: './src/pages/index/index.js',
    list: './src/pages/list/list.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "morningPaper/js/[name].js",
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
          use: ['css-loader',"postcss-loader","sass-loader"]
        })
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader',"postcss-loader"]
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
              outputPath: '/morningPaper/images/',//设置输出文件夹名称，这个文件夹会与主入口文件在同一路径下
              esModule: false,
              useRelativePath: true,
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
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: "morningPaper/index.html",
      template: "./src/pages/index/index.html",
      chunks: ["index"],
    }),
    new HtmlWebpackPlugin({
      filename: "morningPaper/list.html",
      template: "./src/pages/list/list.html",
      chunks: ["list"],
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      'window.Jquery': "jquery"
    }),
    new ExtractTextPlugin({
      filename: 'morningPaper/css/[name].css',
    }),
    
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
  //开发服务
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    watchContentBase: true,
    host: 'localhost',
    compress: true, //服务端是否启用压缩
    port: 8080,
    //openPage:'morningPaper/index.html',
    proxy: {
      '/api': {
        target: 'https://m.nz86.com',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    }
  }
}