/**
 * @Date: 2023-06-07 10:18:37
 * @LastEditTime: 2023-08-23 15:12:40
 * @FilePath: /openapi-demoapp/app/service/asset.js
 * @Description:
 */
'use strict'
const egg = require('egg')
const axios = require('axios')
const baseConfig = require('./baseConfig')
let fs = require('fs')
let path = require('path')
// 资产通用错误码：https://xbase.daxiangyun.com/doc/api#/services/assets/error_code
module.exports = class AssetService extends egg.Service {
  constructor(ctx) {
    super(ctx)
    this.ctx = ctx
  }
  // 资产列表：https://xbase.daxiangyun.com/doc/api#/services/assets/apidocs/asset-list
  async lists(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/asset/assets`, {
      params: query,
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 普通资产上传：https://xbase.daxiangyun.com/doc/api#/services/assets/apidocs/upload-asset
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
        Authorization: header.Authorization,
        'Content-Type': 'application/json'
      }
    })
    await fs.unlinkSync(file.filepath)
    await fs.unlinkSync(toBase)
    return result.data
  }
  //删除资产：https://xbase.daxiangyun.com/doc/api#/services/assets/apidocs/asset-delete
  async del(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/asset/delete`, body, {
      headers: {
        Authorization: header.Authorization,
        contentType: 'application/json'
      }
    })
    return data.data
  }
  // 资产详情：https://xbase.daxiangyun.com/doc/api#/services/assets/apidocs/asset-detail
  async detail(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/asset/detail`, {
      params: query,
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 资产格式转换：https://xbase.daxiangyun.com/doc/api#/services/assets/apidocs/asset-trans
  async translation(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/asset/translation`, body, {
      headers: {
        Authorization: header.Authorization,
        contentType: 'application/json'
      }
    })
    return data.data
  }
  // 终止资产格式转换：https://xbase.daxiangyun.com/doc/api#/services/assets/apidocs/cancel-trans
  async translation_cancel(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/asset/translation/cancel`, body, {
      headers: {
        Authorization: header.Authorization,
        contentType: 'application/json'
      }
    })
    return data.data
  }
  // 创建资产 https://xbase.daxiangyun.com/doc/api#/services/assets/apidocs/create-asset
  async upload_one_tus(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/asset/asset`, body, {
      headers: {
        Authorization: header.Authorization,
        contentType: 'application/json'
      }
    })
    return data.data
  }
  // bim资产装配及编辑 https://xbase.daxiangyun.com/doc/api#/services/assets/apidocs/bim-asset-asm-edit
  async asset_assembly(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/asset/assembly`, body, {
      headers: {
        Authorization: header.Authorization,
        contentType: 'application/json'
      }
    })
    return data.data
  }
  // 获取装配文件关联资产 https://xbase.daxiangyun.com/doc/api#/services/assets/apidocs/asm-list-by-sub-ids
  async getAsset_by_asm(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/asset/get-by-asm`, body, {
      headers: {
        Authorization: header.Authorization,
        contentType: 'application/json'
      }
    })
    return data.data
  }
  // 获取资产关联装配文件 https://xbase.daxiangyun.com/doc/api#/services/assets/apidocs/asset-list-by-asm-ids
  async getAsm_by_asset(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/asset/get-by-asset`, body, {
      headers: {
        Authorization: header.Authorization,
        contentType: 'application/json'
      }
    })
    return data.data
  }
}
