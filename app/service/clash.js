/**
 * @Date: 2023-06-06 15:28:41
 * @LastEditTime: 2023-06-30 09:30:07
 * @FilePath: /openapi-demoapp/app/service/model.js
 * @Description:j
 */
'use strict'
const egg = require('egg')
const axios = require('axios')
const baseConfig = require('./baseConfig')
let fs = require('fs')
let path = require('path')
// 碰撞检查通用错误码：https://xbase.daxiangyun.com/doc/api#/services/clash/error_code
module.exports = class UserService extends egg.Service {
  constructor(ctx) {
    super(ctx)
    this.ctx = ctx
  }

  // 创建碰撞检查：https://xbase.daxiangyun.com/doc/api#/services/clash/apidocs/create-clash
  async clash_create(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/clash/clash`, body, {
      headers: {
        Authorization: header.authorization,
        contentType: 'application/json'
      }
    })
    return data.data
  }
  
  // 删除碰撞检查：https://xbase.daxiangyun.com/doc/api#/services/clash/apidocs/delete-clash
  async clash_del(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/clash/delete`, body, {
      headers: {
        Authorization: header.authorization,
        contentType: 'application/json'
      }
    })
    return data.data
  }

  // 取消碰撞检查：https://xbase.daxiangyun.com/doc/api#/services/clash/apidocs/cancel-clash
  async clash_cancel(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/clash/cancel`, body, {
      headers: {
        Authorization: header.authorization,
        contentType: 'application/json'
      }
    })
    return data.data
  }

  

  // 碰撞检查列表：https://xbase.daxiangyun.com/doc/api#/services/clash/apidocs/create-clash
  async clash_lists(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/clash/list`, {
      params: query,
      headers: {
        Authorization: header.authorization
      }
    })
    return data.data
  }


  // 碰撞检查结果：https://xbase.daxiangyun.com/doc/api#/services/models/apidocs/model-list
  async clash_content(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/clash/content`, {
      params: query,
      headers: {
        Authorization: header.authorization
      }
    })
    return data.data
  }
  
}
