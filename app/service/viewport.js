/**
 * @Date: 2023-06-13 09:51:34
 * @LastEditTime: 2023-06-30 09:49:10
 * @FilePath: /openapi-demoapp/app/service/viewport.js
 * @Description:
 */
'use strict'
const egg = require('egg')
const axios = require('axios')
const baseConfig = require('./baseConfig')
// 视点管理通用错误码：https://xbase.daxiangyun.com/doc/api#/services/viewports/error_code
module.exports = class PortService extends egg.Service {
  constructor(ctx) {
    super(ctx)
    this.ctx = ctx
  }
  // 视点列表：https://xbase.daxiangyun.com/doc/api#/services/viewports/apidocs/viewport-list
  async lists(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/viewport/viewports`, {
      params: query,
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 视点详情：https://xbase.daxiangyun.com/doc/api#/services/viewports/apidocs/viewport-detail
  async detail(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/viewport/viewport`, {
      params: query,
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 创建视点：https://xbase.daxiangyun.com/doc/api#/services/viewports/apidocs/create-viewport
  async add(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/viewport/add`, body, {
      headers: {
        Authorization: header.Authorization,
        contentType: 'application/json'
      }
    })
    return data.data
  }
  // 删除视点：https://xbase.daxiangyun.com/doc/api#/services/viewports/apidocs/viewport-delete
  async del(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/viewport/delete`, body, {
      headers: {
        Authorization: header.Authorization,
        contentType: 'application/json'
      }
    })
    return data.data
  }
}
