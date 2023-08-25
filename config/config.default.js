/**
 * @Date: 2023-06-05 19:10:35
 * @LastEditTime: 2023-08-22 14:04:30
 * @FilePath: /openapi-demoapp/config/config.default.js
 * @Description:
 */
'use strict'
const path = require('path')
const fs = require('fs')
module.exports = app => {
  const exports = {
    // keys: 'i1uf981!0102c,18hf&3^10p'
  }
  exports.multipart = {
    fileSize: '100000mb',
    files: 1,
    mode: 'file',
    fileExtensions: ['.geojson', '.ifc', '.csv', '.rvt', '.dgn', '.skp', '.glb', '.fbx', '.stl', '.dwg', '.3diles', '.obj', '.zip', '.tiff', '.tif'] // 增加对扩展名的文件支持
  }
  exports.siteFile = {
    '/favicon.ico': fs.readFileSync(path.join(app.baseDir, 'app/web/asset/images/logo.png'))
  }

  exports.middleware = ['auth']
  exports.auth = {
    // enable: true, // 是否开启该中间件，不写默认开启
    match: ['/api/open/v1'] // 只匹配指定路由，反之如果只忽略指定路由，可以用ignore
    // ignore: ['/login', '/api/v1/login', '/api/open/v1/viewer/token', '/'] // 不要与match一起使用，避免冲突
  }
  exports.vuessr = {
    layout: path.join(app.baseDir, 'app/web/view/layout.html')
  }
  exports.static = {
    prefix: '/public/',
    dir: path.join(app.baseDir, 'public')
  }
  exports.keys = 'daxiangyun'
  exports.jwt = {
    secret: 'daxiangyun'
  }
  exports.logger = {
    consoleLevel: 'ERROR',
    dir: path.join(app.baseDir, 'logs')
  }
  exports.security = {
    csrf: {
      enable: false,
      ignoreJSON: false,
      cookieName: 'csrfToken'
    },
    xframe: {
      enable: false
    }
  }

  exports.cors = {
    origin: '*',
    credentials: true,
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  }

  return exports
}
