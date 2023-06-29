/**
 * @Date: 2023-06-05 19:10:35
 * @LastEditTime: 2023-06-29 13:46:54
 * @FilePath: /openapi-demoapp/config/config.default.js
 * @Description:
 */
'use strict'
const path = require('path')
const fs = require('fs')
module.exports = app => {
  const exports = {
    keys: 'i1uf981!0102c,18hf&3^10p'
  }
  exports.multipart = {
    fileSize: '100000mb',
    files: 1,
    mode: 'file',
    fileExtensions: ['.ifc', '.rvt', '.dgn', '.skp', '.glb', '.fbx', '.stl', '.dwg', '.3diles', '.obj', '.zip', '.tiff', '.tif'] // 增加对扩展名的文件支持
  }
  exports.siteFile = {
    '/favicon.ico': fs.readFileSync(path.join(app.baseDir, 'app/web/asset/images/logo.png'))
  }
  exports.middleware = []
  exports.vuessr = {
    layout: path.join(app.baseDir, 'app/web/view/layout.html')
  }
  exports.static = {
    prefix: '/public/',
    dir: path.join(app.baseDir, 'public')
  }
  exports.keys = '123456'
  // exports.jwt = {
  //   secret: 'daxiangyun'
  // }
  // exports.middleware = ['locals', 'access']
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
