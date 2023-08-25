/**
 * @Date: 2023-07-17 10:22:19
 * @LastEditTime: 2023-07-24 11:46:22
 * @FilePath: /openapi-demoapp/app/service/standard.js
 * @Description:
 */

'use strict'
const egg = require('egg')
const axios = require('axios')
const baseConfig = require('./baseConfig')
// 数据标准化服务通用错误码：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/error_code
module.exports = class DataService extends egg.Service {
  constructor(ctx) {
    super(ctx)
    this.ctx = ctx
  }
  // 标准映射列表：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/standard-mapping/mapping-list
  async standard_map_list(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/standardization/mapping`, {
      params: query,
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 新增标准映射：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/standard-mapping/mapping-create
  async standard_map_add(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/standardization/mapping`, body, {
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 编辑标准映射：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/standard-mapping/mapping-update
  async standard_map_edit(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/standardization/mapping/update`, body, {
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 删除标准映射：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/standard-mapping/mapping-delete
  async standard_map_del(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/standardization/mapping/delete`, body, {
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 校验标准映射名称：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/standard-mapping/mapping-check-name
  async standard_map_check(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/standardization/mapping/check-name`, {
      params: query,
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 数据标准化获取发布标准列表：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/model-standard/model-standard-publish-list
  async standard_publish_list(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/standardization/standard/publish`, {
      params: query,
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 自动匹配映射条目：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/standard-mapping/mapping-auto-match
  async standard_map_auto_match(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/standardization/mapping/auto-match`, body, {
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 获取映射源：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/standard-mapping/mapping-content-standard
  async standard_publish_source_list(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/standardization/mapping/content/standard`, {
      params: query,
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 映射标准列表：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/standard-mapping/mapping-content-mapping-standard
  async standard_publish_map_list(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/standardization/mapping/content/mapping/standard`, {
      params: query,
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 绑定条目映射：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/standard-mapping/mapping-bind
  async standard_map_match_bind(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/standardization/mapping/content/bind`, body, {
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 移除条目映射：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/standard-mapping/mapping-unbind
  async standard_map_match_unbind(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/standardization/mapping/content/unbind`, body, {
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }

  // 获取条目映射结果：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/standard-mapping/mapping-content
  async standard_publish_map_right_list(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/standardization/mapping/content`, {
      params: query,
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }

  // 模型标准化模型构件列表：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/model-standardization/model-components
  async standard_model_components(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/standardization/model/components`, {
      params: query,
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 模型标准化获取绑定进度：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/model-standardization/model-processing-info
  async standard_model_processing_info(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/standardization/model/processing-info`, body, {
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 模型标准化模型映射规则自动匹配：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/model-standardization/model-auto-match
  async standard_model_autoMatch(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/standardization/model/auto-match`, body, {
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 模型标准化获取绑定数据：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/model-standardization/model-components-bind-data
  async standard_model_bind_data(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/standardization/model/components/bind-data`, body, {
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }

  // 模型标准化模型构件解绑分类编码：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/model-standardization/model-components-unbind
  async standard_model_unbind(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/standardization/model/components/unbind`, body, {
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 模型标准化模型构件绑定分类编码：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/model-standardization/model-components-bind
  async standard_model_bind(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/standardization/model/components/bind`, body, {
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }

  // 获取标准所有条目映射结果：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/standard-mapping/mapping-content-result
  async map_content_result(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/standardization/mapping/content/result`, {
      params: query,
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }

  // 模型标准化获取构件绑定的分类标准信息：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/model-standardization/model-bind-standard
  async standard_model_bind_standard(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/standardization/model/bind-standard`, body, {
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
}
