/**
 * @Date: 2023-06-06 15:28:41
 * @LastEditTime: 2023-09-19 15:38:06
 * @FilePath: /openapi-demoapp/app/service/model.js
 * @Description:j
 */
'use strict'
const egg = require('egg')
const axios = require('axios')
const baseConfig = require('./baseConfig')
let fs = require('fs')
let path = require('path')
// 模型管理通用错误码：https://xbase.daxiangyun.com/doc/api#/services/models/error_code
module.exports = class UserService extends egg.Service {
  constructor(ctx) {
    super(ctx)
    this.ctx = ctx
  }
  // 模型列表：https://xbase.daxiangyun.com/doc/api#/services/models/apidocs/model-list
  async lists(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/model/models`, {
      params: query,
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 删除模型：https://xbase.daxiangyun.com/doc/api#/services/models/apidocs/model-delete
  async del(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/model/delete`, body, {
      headers: {
        Authorization: header.Authorization,
        contentType: 'multipart/json'
      }
    })
    return data.data
  }
  // 格式转换：https://xbase.daxiangyun.com/doc/api#/services/models/apidocs/model-transform
  async translation(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/model/translation`, body, {
      headers: {
        Authorization: header.Authorization,
        contentType: 'multipart/json'
      }
    })
    return data.data
  }
  // 模型详情：https://xbase.daxiangyun.com/doc/api#/services/models/apidocs/model-info
  async detail(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/model/model`, {
      params: query,
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 格式转换详情：https://xbase.daxiangyun.com/doc/api#/services/models/apidocs/model-transform-info
  async transform_detail(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/model/transform/info`, {
      params: query,
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 终止格式转换：https://xbase.daxiangyun.com/doc/api#/services/models/apidocs/model-transform-cancel
  async cancel_translation(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/model/cancel/translation`, body, {
      headers: {
        Authorization: header.Authorization,
        contentType: 'multipart/json'
      }
    })
    return data.data
  }
  // 模型下载：https://xbase.daxiangyun.com/doc/api#/services/models/apidocs/model-download
  // async down(query, header, response) {
  //   const data = await axios.get(`${baseConfig.url}/api/open/v1/model/download`, {
  //     params: query,
  //     headers: {
  //       Authorization: header.Authorization
  //     }
  //   })
  //   return data.data
  // }
  // 获取模型属性：https://xbase.daxiangyun.com/doc/api#/services/models/apidocs/model-ds-property
  async attr(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/model/ds/property`, {
      params: query,
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 查找模型属性：https://xbase.daxiangyun.com/doc/api#/services/models/apidocs/model-ds-property-query
  async attr_query(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/model/ds/property/query`, {
      params: query,
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 获取模型构件：https://xbase.daxiangyun.com/doc/api#/services/models/apidocs/model-fs-property-tree
  async tree_get(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/model/fs/modeltree`, {
      params: query,
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 查询模型构件树：https://xbase.daxiangyun.com/doc/api#/services/models/apidocs/model-fs-property-query
  async tree_query(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/model/fs/modeltree/query`, {
      params: query,
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 预览Token：https://xbase.daxiangyun.com/doc/api#/services/token/apidocs/viewtoken
  async view_token(body, header) {
    const data = await axios.post(
      `${baseConfig.url}/viewer/api/open/v1/viewer/token`,
      {
        app_id: baseConfig.app_id,
        app_key: baseConfig.app_key,
        ...body
      },
      {
        headers: {
          Authorization: header.Authorization,
          contentType: 'multipart/json'
        }
      }
    )
    return data.data
  }
  // 模型装配：https://xbase.daxiangyun.com/doc/api#/services/models/apidocs/model-assembly
  async assembly(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/model/assembly`, body, {
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 装配编辑：https://xbase.daxiangyun.com/doc/api#/services/models/apidocs/model-assembly-edit
  async assembly_edit(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/model/assembly/edit`, body, {
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }

  // async upload_one_tus(body, header) {
  //   const data = await axios.post(`${baseConfig.url}/api/open/v1/model/model`, body, {
  //     headers: {
  //       Authorization: header.Authorization
  //     }
  //   })
  //   return data.data
  // }
  // 普通模型上传：https://xbase.daxiangyun.com/doc/api#/services/models/apidocs/upload
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
        Authorization: header.Authorization,
        processData: false,
        contentType: 'multipart/form-data'
      }
    })
    await fs.unlinkSync(file.filepath)
    await fs.unlinkSync(toBase)
    return result.data
  }

  async semantic_model_list(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/semantic-model/list`, {
      params: query,
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }

  async semantic_model_add(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/semantic-model/create`, body, {
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  async semantic_model_transfrom(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/semantic-model/translation`, body, {
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  async semantic_model_transfromCancel(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/semantic-model/translation/cancel`, body, {
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }

  async semantic_model_info(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/semantic-model/info`, {
      params: query,
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  async semantic_model_infoTrans(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/semantic-model/translation/info`, {
      params: query,
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }

  async semantic_model_del(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/semantic-model/delete`, body, {
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
}
