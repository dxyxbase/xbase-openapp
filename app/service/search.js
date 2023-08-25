/**
 * @Date: 2023-06-06 15:28:41
 * @LastEditTime: 2023-06-30 09:30:07
 * @FilePath: /openapi-demoapp/app/service/search.js
 * @Description:j
 */
'use strict'
const egg = require('egg')
const axios = require('axios')
const baseConfig = require('./baseConfig')
let fs = require('fs')
let path = require('path')
// 数据高级管理通用错误码：https://xbase.daxiangyun.com/doc/api#/services/componentsearch/error_code
module.exports = class UserService extends egg.Service {
  constructor(ctx) {
    super(ctx)
    this.ctx = ctx
  }

  // 搜索：https://xbase.daxiangyun.com/doc/api#/services/componentsearch/apidocs/componentsearch-search
  async search(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/componentsearch/search`, body, {
      headers: {
        Authorization: header.authorization,
        contentType: 'application/json'
      }
    })
    return data.data
  }
  
  // 保存搜索记录：https://xbase.daxiangyun.com/doc/api#/services/componentsearch/apidocs/componentsearch-add
  async save_search_record(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/componentsearch/add`, body, {
      headers: {
        Authorization: header.authorization,
        contentType: 'multipart/json'
      }
    })
    return data.data
  }

    // 获取搜索记录列表：https://xbase.daxiangyun.com/doc/api#/services/componentsearch/apidocs/componentsearch-list
  async search_record_list(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/componentsearch/list`, {
        params: query,
        headers: {
        Authorization: header.authorization
        }
    })
    return data.data
  }

  //  搜索记录编辑：https://xbase.daxiangyun.com/doc/api#/services/componentsearch/apidocs/componentsearch-edit
  async edit_search_record(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/componentsearch/edit`, body, {
      headers: {
        Authorization: header.authorization,
        contentType: 'multipart/json'
      }
    })
    return data.data
  }

  




  //  获取搜索记录中的模型文件列表：https://xbase.daxiangyun.com/doc/api#/services/componentsearch/apidocs/componentsearch-file-list
  async search_model_list(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/componentsearch/file/list`, {
      params: query,
      headers: {
        Authorization: header.authorization
      }
    })
    return data.data
  }


  // 获取搜索记录中的构件列表：https://xbase.daxiangyun.com/doc/api#/services/componentsearch/apidocs/componentsearch-component-list
  async search_component_list(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/componentsearch/component/list`, {
      params: query,
      headers: {
        Authorization: header.authorization
      }
    })
    return data.data
  }

  

  // 导出搜索记录：https://xbase.daxiangyun.com/doc/api#/services/componentsearch/apidocs/componentsearch-export
  async record_output(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/componentsearch/export`, body, {
      headers: {
        Authorization: header.authorization,
        contentType: 'application/json'
      }
    })
    return data.data
  }

  // 导出搜索记录中的文件列表：https://xbase.daxiangyun.com/doc/api#/services/componentsearch/apidocs/componentsearch-file-export
  async record_model_output(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/componentsearch/file/export`, body, {
      headers: {
        Authorization: header.authorization,
        contentType: 'application/json'
      }
    })
    return data.data
  }
  //  删除搜索记录：https://xbase.daxiangyun.com/doc/api#/services/componentsearch/apidocs/componentsearch-delete
  async search_record_delete(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/componentsearch/delete`, body, {
      headers: {
        Authorization: header.authorization,
        contentType: 'application/json'
      }
    })
    return data.data
  }

  // 查看当前应用是否有正在搜索的进程：https://xbase.daxiangyun.com/doc/api#/services/componentsearch/apidocs/componentsearch-search-state
  async is_search(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/componentsearch/search-state`, {
      params: query,
      headers: {
        Authorization: header.authorization
      }
    })
    return data.data
  }
  
  // 取消搜索：https://xbase.daxiangyun.com/doc/api#/services/componentsearch/apidocs/componentsearch-cancel
  async search_cancel(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/componentsearch/cancel`, body, {
      headers: {
        Authorization: header.authorization,
        contentType: 'application/json'
      }
    })
    return data.data
  }

  // 根据模型路径获取模型构件属性名称：https://xbase.daxiangyun.com/doc/api#/services/componentset/apidocs/componentset-property
  async component_property(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/componentset/property`, body, {
      headers: {
        Authorization: header.authorization,
        contentType: 'application/json'
      }
    })
    return data.data
  }

  // 根据模型路径获取模型构件属性名称：https://xbase.daxiangyun.com/doc/api#/services/componentset/apidocs/componentset-property
  async component_category(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/componentset/category`, body, {
      headers: {
        Authorization: header.authorization,
        contentType: 'application/json'
      }
    })
    return data.data
  }

}
