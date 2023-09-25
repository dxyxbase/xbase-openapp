/**
 * @Date: 2023-09-12 15:00:29
 * @LastEditTime: 2023-09-19 14:24:00
 * @FilePath: /openapi-demoapp/app/service/modelComponents.js
 * @Description:
 */
'use strict'
const egg = require('egg')
const axios = require('axios')
const baseConfig = require('./baseConfig')
let fs = require('fs')
let path = require('path')
// 构件管理通用错误码：https://xbase.daxiangyun.com/doc/api#/services/components/error_code
module.exports = class UserService extends egg.Service {
  constructor(ctx) {
    super(ctx)
    this.ctx = ctx
  }
  // 构件列表：https://xbase.daxiangyun.com/doc/api#/services/components/apidocs/component-list
  async model_components_list(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/component/components`, {
      params: query,
      headers: {
        Authorization: header.Authorization
      }
    })
    console.log(data.data)
    return data.data
  }
  // 保存构件：https://xbase.daxiangyun.com/doc/api#/services/components/apidocs/tusd-upload
  async model_components_save(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/component/component`, body, {
      headers: {
        Authorization: header.Authorization,
        contentType: 'multipart/json'
      }
    })
    return data.data
  }
  // 构件详情：https://xbase.daxiangyun.com/doc/api#/services/components/apidocs/component-info
  async model_components_detail(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/component/component`, {
      params: query,
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 构件格式转换：https://xbase.daxiangyun.com/doc/api#/services/components/apidocs/component-transform
  async model_components_transfer_start(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/component/translation`, body, {
      headers: {
        Authorization: header.Authorization,
        contentType: 'multipart/json'
      }
    })
    return data.data
  }
  // 终止构件格式转换：https://xbase.daxiangyun.com/doc/api#/services/components/apidocs/component-transform-cancel
  async model_components_transfer_cancel(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/component/cancel/translation`, body, {
      headers: {
        Authorization: header.Authorization,
        contentType: 'multipart/json'
      }
    })
    return data.data
  }
  //格式转换详情：https://xbase.daxiangyun.com/doc/api#/services/components/apidocs/component-transform-info
  async model_components_info(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/component/transform/info`, {
      params: query,
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 构件删除：https://xbase.daxiangyun.com/doc/api#/services/components/apidocs/component-delete
  async model_components_del(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/component/delete`, body, {
      headers: {
        Authorization: header.Authorization,
        contentType: 'multipart/json'
      }
    })
    return data.data
  }
  // 上传构件(非分片)：https://xbase.daxiangyun.com/doc/api#/services/components/apidocs/upload
  async model_components_upload(file, header) {
    const { ctx } = this
    const toBase = path.dirname(file.filepath) + '/' + file.filename
    ctx.logger.info('普通上传文件', file, '/n', toBase)
    await fs.copyFileSync(file.filepath, toBase)
    const result = await ctx.curl(`${baseConfig.url}/api/open/v1/component/upload`, {
      method: 'POST',
      dataType: 'multipart/form-data',
      files: path.resolve(toBase),
      // 创建连接超时 1 秒，接收响应超时 10分钟，用于响应比较大的场景
      timeout: [1000, 10 * 60 * 1000],
      headers: {
        Authorization: header.Authorization,
        processData: false,
        contentType: 'multipart/form-data'
      }
    })
    await fs.unlinkSync(file.filepath)
    await fs.unlinkSync(toBase)
    return result.data
  }
}
