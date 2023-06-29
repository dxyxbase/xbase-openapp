/**
 * @Date: 2023-06-07 10:18:37
 * @LastEditTime: 2023-06-29 11:10:10
 * @FilePath: /openapi-demoapp/app/service/asset.js
 * @Description:
 */
'use strict'
const egg = require('egg')
const axios = require('axios')
const baseConfig = require('./baseConfig')
let fs = require('fs')
let path = require('path')

module.exports = class AssetService extends egg.Service {
  constructor(ctx) {
    super(ctx)
    this.ctx = ctx
  }
  async lists(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/asset/assets`, {
      params: query,
      headers: {
        Authorization: header.authorization
      }
    })
    return data.data
  }
  async upload_one(file, header, body) {
    const { ctx } = this
    const toBase = path.dirname(file.filepath) + '/' + file.filename
    ctx.logger.info('普通上传文件', file, '/n', toBase)
    await fs.copyFileSync(file.filepath, toBase)
    const result = await ctx.curl(`${baseConfig.url}/api/open/v1/asset/upload`, {
      method: 'POST',
      files: path.resolve(toBase),
      dataType: 'json',
      data: body,
      timeout: [1000, 10 * 60 * 1000],
      dataAsQueryString: true,
      headers: {
        Authorization: header.authorization,
        'Content-Type': 'application/json'
      }
    })
    await fs.unlinkSync(file.filepath)
    await fs.unlinkSync(toBase)
    return result.data
  }

  async del(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/asset/delete`, body, {
      headers: {
        Authorization: header.authorization,
        contentType: 'application/json'
      }
    })
    return data.data
  }

  async detail(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/asset/detail`, {
      params: query,
      headers: {
        Authorization: header.authorization
      }
    })
    return data.data
  }

  async translation(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/asset/translation`, body, {
      headers: {
        Authorization: header.authorization,
        contentType: 'application/json'
      }
    })
    return data.data
  }

  async translation_cancel(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/asset/translation/cancel`, body, {
      headers: {
        Authorization: header.authorization,
        contentType: 'application/json'
      }
    })
    return data.data
  }
  async upload_one_tus(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/asset/asset`, body, {
      headers: {
        Authorization: header.authorization,
        contentType: 'application/json'
      }
    })
    return data.data
  }
}
