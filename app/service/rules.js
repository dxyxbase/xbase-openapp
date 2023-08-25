/**
 * @Date: 2023-07-13 13:48:55
 * @LastEditTime: 2023-07-24 11:01:47
 * @FilePath: /openapi-demoapp/app/service/rules.js
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
  // 构件规则列表：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/component-rule/component-rule-list
  async rule_member_list(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/standardization/rule/component`, {
      params: query,
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 添加规则：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/component-rule/component-rule-create
  async rule_member_add(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/standardization/rule/component`, body, {
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 编辑规则：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/component-rule/component-rule-update
  async rule_member_edit(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/standardization/rule/component/update`, body, {
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 删除规则：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/component-rule/component-rule-delete
  async rule_member_del(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/standardization/rule/component/delete`, body, {
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 恢复默认规则：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/component-rule/component-rule-reset
  async rule_member_reset(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/standardization/rule/component/reset`, body, {
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 编辑规则执行顺序：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/component-rule/component-rule-move
  async rule_member_move(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/standardization/rule/component/move`, body, {
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 校验是否存在规则：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/component-rule/component-rule-check-exist
  async rule_member_check(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/standardization/rule/component/check-exist`, {
      params: query,
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 标准规则列表：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/standard-rule/standard-rule-list
  async rule_standard_list(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/standardization/rule/standard`, {
      params: query,
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  //标准添加规则：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/standard-rule/standard-rule-create
  async rule_standard_add(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/standardization/rule/standard`, body, {
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 编辑标准映射规则：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/standard-rule/standard-rule-update
  async rule_standard_edit(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/standardization/rule/standard/update`, body, {
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 删除标准规则：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/standard-rule/standard-rule-delete
  async rule_standard_del(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/standardization/rule/standard/delete`, body, {
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 恢复默认标准规则：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/standard-rule/standard-rule-reset
  async rule_standard_reset(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/standardization/rule/standard/reset`, body, {
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 编辑标准规则执行顺序：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/standard-rule/standard-rule-move
  async rule_standard_move(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/standardization/rule/standard/move`, body, {
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 检验标准规则是否存在：https://xbase.daxiangyun.com/doc/api#/services/data-standardization/apidocs/standard-rule/standard-rule-check-exist
  async rule_standard_check(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/standardization/rule/standard/check-exist`, {
      params: query,
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
}
