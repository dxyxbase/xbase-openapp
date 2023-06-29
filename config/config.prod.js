/**
 * @Date: 2023-06-05 19:10:35
 * @LastEditTime: 2023-06-25 10:41:44
 * @FilePath: /openapi-demoapp/config/config.prod.js
 * @Description:
 */
const path = require('path')
// const ip = require('ip')
module.exports = app => {
  const exports = {}

  exports.static = {
    maxAge: 0 // maxAge 缓存，默认 1 年
  }

  exports.cluster = {
    listen: {
      path: '',
      port: 9040, // 这里就是你要修改的端口号
      hostname: '0.0.0.0' // 0.0.0.0
    }
  }

  return exports
}
