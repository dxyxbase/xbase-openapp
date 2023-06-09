/**
 * @Date: 2023-06-05 19:10:35
 * @LastEditTime: 2023-06-28 11:50:25
 * @FilePath: /openapi-demoapp/config/config.local.js
 * @Description:
 */
const path = require('path')
const ip = require('ip')
module.exports = app => {
  const exports = {}

  exports.view = {
    cache: false
  }

  exports.static = {
    maxAge: 0 // maxAge 缓存，默认 1 年
  }

  exports.development = {
    watchDirs: [], // 指定监视的目录（包括子目录），当目录下的文件变化的时候自动重载应用，路径从项目根目录开始写
    ignoreDirs: ['app/web', 'public', 'config/manifest.json'] // 指定过滤的目录（包括子目录）
  }

  exports.logview = {
    dir: path.join(app.baseDir, 'logs')
  }

  exports.vuessr = {
    injectCss: true
  }

  exports.webpack = {
    webpackConfigList: require('easywebpack-vue').getWebpackConfig()
  }

  const localIP = ip.address()
  const domainWhiteList = []
  ;[9040, 9000, 9001].forEach(port => {
    domainWhiteList.push(`http://localhost:${port}`)
    domainWhiteList.push(`http://127.0.0.1:${port}`)
    domainWhiteList.push(`http://${localIP}:${port}`)
  })

  // exports.cluster = {
  //   listen: {
  //     path: '',
  //     open:true,
  //     port: 9040, // 这里就是你要修改的端口号
  //     hostname: localIP // 0.0.0.0
  //   }
  // }
  exports.cors = {
    enable: true,
    package: 'egg-cors'
  }

  exports.security = { domainWhiteList }

  return exports
}
