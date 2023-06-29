/**
 * @Date: 2023-06-06 15:28:41
 * @LastEditTime: 2023-06-29 10:08:42
 * @FilePath: /openapi-demoapp/app/service/model.js
 * @Description:j
 */
'use strict'
const egg = require('egg')
const axios = require('axios')
const baseConfig = require('./baseConfig')
let fs = require('fs')
let path = require('path')
module.exports = class UserService extends egg.Service {
  constructor(ctx) {
    super(ctx)
    this.ctx = ctx
  }
  async lists(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/model/models`, {
      params: query,
      headers: {
        Authorization: header.authorization
      }
    })
    return data.data
  }

  async del(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/model/delete`, body, {
      headers: {
        Authorization: header.authorization,
        contentType: 'multipart/json'
      }
    })
    return data.data
  }
  async translation(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/model/translation`, body, {
      headers: {
        Authorization: header.authorization,
        contentType: 'multipart/json'
      }
    })
    return data.data
  }
  async detail(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/model/model`, {
      params: query,
      headers: {
        Authorization: header.authorization
      }
    })
    return data.data
  }
  async transform_detail(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/model/transform/info`, {
      params: query,
      headers: {
        Authorization: header.authorization
      }
    })
    return data.data
  }
  // 终止转换
  async cancel_translation(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/model/cancel/translation`, body, {
      headers: {
        Authorization: header.authorization,
        contentType: 'multipart/json'
      }
    })
    return data.data
  }

  async down(query, header, response) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/model/download`, {
      params: query,
      headers: {
        Authorization: header.authorization
      }
    })
    return data.data
  }
  async status(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/model/fs/status`, {
      params: query,
      headers: {
        Authorization: header.authorization
      }
    })
    return data.data
  }

  async attr(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/model/ds/property`, {
      params: query,
      headers: {
        Authorization: header.authorization
      }
    })
    return data.data
  }
  async attr_query(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/model/ds/property/query`, {
      params: query,
      headers: {
        Authorization: header.authorization
      }
    })
    return data.data
  }

  async tree_get(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/model/fs/modeltree`, {
      params: query,
      headers: {
        Authorization: header.authorization
      }
    })
    return data.data
  }
  async tree_query(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/model/fs/modeltree/query`, {
      params: query,
      headers: {
        Authorization: header.authorization
      }
    })
    return data.data
  }
  async view_token(body, header) {
    const data = await axios.post(
      `${baseConfig.url}/api/open/v1/viewer/token`,
      {
        app_id: baseConfig.app_id,
        app_key: baseConfig.app_key,
        ...body
      },
      {
        headers: {
          Authorization: header.authorization,
          contentType: 'multipart/json'
        }
      }
    )
    return data.data
  }

  async assembly(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/model/assembly`, body, {
      headers: {
        Authorization: header.authorization
      }
    })
    return data.data
  }
  async assembly_edit(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/model/assembly/edit`, body, {
      headers: {
        Authorization: header.authorization
      }
    })
    return data.data
  }

  async upload_one_tus(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/model/model`, body, {
      headers: {
        Authorization: header.authorization
      }
    })
    return data.data
  }

  async upload_one(file, header) {
    const { ctx } = this
    const toBase = path.dirname(file.filepath) + '/' + file.filename
    ctx.logger.info('普通上传文件', file, '/n', toBase)
    await fs.copyFileSync(file.filepath, toBase)
    const result = await ctx.curl(`${baseConfig.url}/api/open/v1/model/upload`, {
      method: 'POST',
      dataType: 'multipart/form-data',
      files: path.resolve(toBase),
      // 创建连接超时 1 秒，接收响应超时 10分钟，用于响应比较大的场景
      timeout: [1000, 10 * 60 * 1000],
      headers: {
        Authorization: header.authorization,
        processData: false,
        contentType: 'multipart/form-data'
      }
    })
    await fs.unlinkSync(file.filepath)
    await fs.unlinkSync(toBase)
    return result.data
  }
}
