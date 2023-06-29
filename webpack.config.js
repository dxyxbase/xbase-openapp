/**
 * @Date: 2023-06-05 19:10:35
 * @LastEditTime: 2023-06-28 15:56:34
 * @FilePath: /openapi-demoapp/webpack.config.js
 * @Description:
 */
'use strict'
// 简化, 详情：https://www.yuque.com/easy-team/easywebpack/v4
require('babel-polyfill')
let path = require('path')
module.exports = {
  // imageHash: true,
  plugins: {
    imagemini: false
  },
  loaders: {
    css: {
      importLoaders: 1
    }
  },
  devtool: 'eval',
  target: 'web',
  alias: {
    '@': './app/web',
    '@base': './'
  },
  entry: {
    main: path.join(__dirname, './app/web/page/index.js')
  },
  use: {
    loader: 'babel-loader',
    options: {
      plugins: ['@babel/plugin-transform-runtime']
    }
  },

  module: {
    rules: [
      {
        test: /\.less$/i,
        use: [
          // compiles Less to CSS
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      }
      // { eslint: { options: { fix: false } } }
    ]
  },
  cssExtract: true,
  dll: ['vue', 'vue-router', 'vuex', 'axios', 'vuex-router-sync', 'vue-i18n']
}
