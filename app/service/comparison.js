/**
 * @Date: 2023-06-06 15:28:41
 * @LastEditTime: 2023-06-30 09:30:07
 * @FilePath: /openapi-demoapp/app/service/comparison.js
 * @Description:j
 */
'use strict'
const egg = require('egg')
const axios = require('axios')
const baseConfig = require('./baseConfig')
let fs = require('fs')
let path = require('path')
// 模型对比通用错误码：https://xbase.daxiangyun.com/doc/api#/services/modeldiff/error_code
module.exports = class UserService extends egg.Service {
  constructor(ctx) {
    super(ctx)
    this.ctx = ctx
  }

  // 创建模型对比：https://xbase.daxiangyun.com/doc/api#/services/modeldiff/apidocs/create-model-diff
  async comparison_create(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/model-diff/create`, body, {
      headers: {
        Authorization: header.authorization,
        contentType: 'application/json'
      }
    })
    return data.data
  }
  
  // 删除模型对比：https://xbase.daxiangyun.com/doc/api#/services/modeldiff/apidocs/delete-model-diff
  async comparison_del(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/model-diff/delete`, body, {
      headers: {
        Authorization: header.authorization,
        contentType: 'application/json'
      }
    })
    return data.data
  }

  // 取消模型对比：https://xbase.daxiangyun.com/doc/api#/services/modeldiff/apidocs/cancel-model-diff
  async comparison_cancel(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/model-diff/cancel`, body, {
      headers: {
        Authorization: header.authorization,
        contentType: 'application/json'
      }
    })
    return data.data
  }


  // 导出模型对比：https://xbase.daxiangyun.com/doc/api#/services/modeldiff/apidocs/model-diff-export
  async comparison_export(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/model-diff/export`, body, {
      headers: {
        Authorization: header.authorization,
        contentType: 'application/json'
      }
    })
    return data.data
  }

  

  // 模型对比列表：https://xbase.daxiangyun.com/doc/api#/services/modeldiff/apidocs/model-diff-list
  async comparison_lists(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/model-diff/list`, {
      params: query,
      headers: {
        Authorization: header.authorization
      }
    })
    return data.data
  }


  // 模型对比结果：https://xbase.daxiangyun.com/doc/api#/services/modeldiff/apidocs/model-diff-content
  async comparison_content(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/model-diff/content`, {
      params: query,
      headers: {
        Authorization: header.authorization
      }
    })
    return data.data
  }


  // 模型对比结果属性详情：https://xbase.daxiangyun.com/doc/api#/services/modeldiff/apidocs/model-diff-content-property
  async comparison_content_property(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/model-diff/content/property`, {
      params: query,
      headers: {
        Authorization: header.authorization
      }
    })
    return data.data
  }
  
}
