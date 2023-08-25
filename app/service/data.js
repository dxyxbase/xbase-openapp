/**
 * @Date: 2023-07-11 14:51:55
 * @LastEditTime: 2023-07-24 10:55:58
 * @FilePath: /openapi-demoapp/app/service/data.js
 * @Description:
 */
'use strict'
const egg = require('egg')
const axios = require('axios')
const baseConfig = require('./baseConfig')
const path = require('path')
const fs = require('fs')
// 数据标准化服务通用错误码：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/error_code
module.exports = class DataService extends egg.Service {
  constructor(ctx) {
    super(ctx)
    this.ctx = ctx
  }
  // 数据标准化校验标准名称：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/model-standard/model-standard-check-name
  async attr_child_check(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/standardization/property/children/check-name`, {
      params: query,
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 数据标准化属性信息标准内容：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/property-standard/property-standard-children-list
  async attr_child_list(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/standardization/property/children`, {
      params: query,
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 数据标准化新增条目：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/property-standard/property-standard-children-create
  async attr_child_add(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/standardization/property/children`, body, {
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 数据标准化编辑条目：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/property-standard/property-standard-children-update
  async attr_child_edit(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/standardization/property/children/update`, body, {
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 数据标准化删除/批量删除条目：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/property-standard/property-standard-children-delete
  async attr_child_del(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/standardization/property/children/delete`, body, {
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 数据标准化编辑条目顺序：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/property-standard/property-standard-children-move
  async attr_child_move(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/standardization/property/children/move`, body, {
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 数据标准化标准内容条目列表：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/model-standard/model-standard-children-list
  async model_child_list(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/standardization/standard/children/list`, body, {
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }

  // 数据标准化编辑标准：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/model-standard/model-standard-update
  async standard_model_edit(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/standardization/standard/update`, body, {
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 数据标准化删除标准：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/model-standard/model-standard-delete
  async standard_model_del(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/standardization/standard/delete`, body, {
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 数据标准化检查标准是否已经发布：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/model-standard/model-standard-is-publish
  async model_is_publish(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/standardization/standard/is-publish`, body, {
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 数据标准化标准的发版/卸载：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/model-standard/model-standard-publish
  async model_publish(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/standardization/standard/publish`, body, {
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 数据标准化：
  async model_child_add(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/standardization/standard/children`, body, {
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 数据标准化：
  async model_child_edit(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/standardization/standard/children/update`, body, {
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 数据标准化：
  async model_child_del(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/standardization/standard/children/delete`, body, {
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 数据标准化编辑条目顺序：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/model-standard/model-standard-children-move
  async model_child_move(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/standardization/standard/children/move`, body, {
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 数据标准化校验标准名称：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/model-standard/model-standard-check-name
  async check(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/standardization/standard/check-name`, {
      params: query,
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 数据标准化标准列表：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/model-standard/model-standard-list
  async standard_model_list(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/standardization/standard`, {
      params: query,
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  //属性信息标准列表：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/property-standard/property-standard-list
  async standard_attr_list(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/standardization/property`, {
      params: query,
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  //数据标准化属性新增自定义标准：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/property-standard/property-standard-create
  async standard_attr_add(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/standardization/property`, body, {
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 数据标准化属性信息标准复制：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/property-standard/property-standard-copy
  async standard_attr_copy(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/standardization/property/copy`, body, {
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 数据标准化编辑自定义标准：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/property-standard/property-standard-update
  async standard_attr_edit(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/standardization/property/update`, body, {
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 数据标准化删除自定义标准：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/property-standard/property-standard-delete
  async standard_attr_del(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/standardization/property/delete`, body, {
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 数据标准化校验属性信息标准名称：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/property-standard/property-standard-check-name
  async standard_attr_check(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/standardization/property/check-name`, {
      params: query,
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 数据标准化自定义标准导入：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/model-standard/model-standard-upload
  async standard_model_import(file, header, body) {
    const { ctx } = this
    const toBase = path.dirname(file.filepath) + '/' + file.filename
    ctx.logger.info('普通上传文件', file, '/n', toBase, header)
    await fs.copyFileSync(file.filepath, toBase)
    const result = await ctx.curl(`${baseConfig.url}/api/open/v1/standardization/standard/upload`, {
      method: 'POST',
      dataType: 'multipart/form-data',
      files: path.resolve(toBase),
      timeout: [1000, 10 * 60 * 1000],
      data: body,
      headers: {
        Authorization: header.Authorization,
        processData: false,
        contentType: 'multipart/form-data'
      }
    })
    await fs.unlinkSync(file.filepath)
    await fs.unlinkSync(toBase)
    ctx.logger.info(result.data)
    return result.data
  }
}
