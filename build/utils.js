const glob = require('glob')
const {subdirectory} = require('./config')

//读取所有.js文件,动态设置多入口
exports.getEntry = function() {
  var entry = {};
  //读取src目录下page下的所有.js文件
  glob.sync('./src/pages/**/*.js')
      .forEach(function (name) {
          let start = name.indexOf('src/') + 10,
              end = name.length - 3;
          let n = name.slice(start, end);
          let key = n.slice(0, n.lastIndexOf('/')); //保存各个组件的入口
          // console.log(key);
          entry[key] = name;
      });
  return entry;
};
// 设置html-webpack-plugin参数，返回参数对象
exports.getHtmlConfig = function (name, chunks) {
  var _template = `./src/pages/${name}/${name}.html`;
  var _filename = `${subdirectory}${name}.html`;
  //index单独处理
  // if (name === "index") {
  //     _filename = `index.html`;
  // }
  let config = {
      template: _template,
      filename: _filename,
      // favicon: './favicon.ico',
      // title: title,
      inject: true, //设置为true插入的元素放入body元素的底部
      hash: true, //开启hash  ?[hash]
      chunks: chunks,
      minify: process.env.NODE_ENV === "development" ? false : {
          removeComments: true, //移除HTML中的注释
          collapseWhitespace: true, //折叠空白区域 也就是压缩代码
          removeAttributeQuotes: true, //去除属性引用
      }
  };
  return config;
};