const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
var webpack = require('webpack')

module.exports=merge(baseWebpackConfig,{
  mode:'development',
  plugins:[
    new webpack.HotModuleReplacementPlugin()  
  ],
  devServer: {
    //contentBase: path.resolve(__dirname, '../dist'),
    watchContentBase: true,
    host: 'localhost',
    compress: true, //服务端是否启用压缩
    port: 8080,
    hot:true,
    //openPage:'morningPaper/index.html',
    proxy: {
      '/api': {
        target: 'https://m.nz86.com',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    }
  }
})