/**
 * @Date: 2023-06-06 14:28:17
 * @LastEditTime: 2023-06-26 10:24:31
 * @FilePath: /openapi-demoapp/app/service/baseConfig.js
 * @Description:
 */

let path = require('path')
const config = require(path.join(__dirname, '../../xbase-config.json'))
module.exports = {
  url: config.url,
  app_id: config.app_id,
  app_key: config.app_key
}
