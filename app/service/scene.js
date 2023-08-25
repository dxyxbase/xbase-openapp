/**
 * @Date: 2023-06-06 15:28:41
 * @LastEditTime: 2023-08-23 15:43:15
 * @FilePath: /openapi-demoapp/app/service/scene.js
 * @Description:j
 */
'use strict'
const axios = require('axios')
const baseConfig = require('./baseConfig')
let lodash = require('lodash')
const Controller = require('../controller/base-controller')
// 场景通用错误码：https://xbase.daxiangyun.com/doc/api#/services/scenes/error_code
module.exports = class Sceneervice extends Controller {
  constructor(ctx) {
    super(ctx)
    this.ctx = ctx
  }
  // 查找模型构件属性：https://xbase.daxiangyun.com/doc/api#/services/models/apidocs/model-ds-property-uid
  async query_uid(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/model/ds/property/uid`, {
      params: query,
      headers: {
        Authorization: header.Authorization,
        contentType: 'application/json'
      }
    })
    return data.data
  }
  //获取BIM资产的源模型构件属性 https://xbase.daxiangyun.com/doc/api#/services/assets/apidocs/asset-original-file-component-property
  async query_uid_byAsset(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/asset/ds/property/uid`, {
      params: query,
      headers: {
        Authorization: header.Authorization,
        contentType: 'application/json'
      }
    })
    return data.data
  }
  // 场景列表：https://xbase.daxiangyun.com/doc/api#/services/scenes/apidocs/scene-list
  async lists(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/scene/scenes`, {
      params: query,
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 场景编辑/创建：https://xbase.daxiangyun.com/doc/api#/services/scenes/apidocs/scene-edit
  async edit(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/scene/scene`, body, {
      headers: {
        Authorization: header.Authorization,
        contentType: 'application/json'
      }
    })
    return data.data
  }
  // 校验场景名称是否存在：https://xbase.daxiangyun.com/doc/api#/services/scenes/apidocs/scene-check-name
  async check(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/scene/check-name`, {
      params: query,
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 场景删除：https://xbase.daxiangyun.com/doc/api#/services/scenes/apidocs/scene-delete
  async del(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/scene/delete`, body, {
      headers: {
        Authorization: header.Authorization,
        contentType: 'application/json'
      }
    })
    return data.data
  }
  // 场景重命名：https://xbase.daxiangyun.com/doc/api#/services/scenes/apidocs/scene-rename
  async rename(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/scene/rename`, body, {
      headers: {
        Authorization: header.Authorization,
        contentType: 'application/json'
      }
    })
    return data.data
  }
  // 场景详情：https://xbase.daxiangyun.com/doc/api#/services/scenes/apidocs/scene-detail
  async detail(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/scene/detail`, {
      params: query,
      headers: {
        Authorization: header.Authorization
      }
    })
    return data.data
  }
  // 创建场景资产树形图（根据资产列表处理）
  async assets(header) {
    let assetObj = {
      1: '影像',
      2: '地形',
      3: '矢量',
      4: '倾斜摄影（模型）',
      5: 'BIM资产'
    }
    const data = await axios.get(`${baseConfig.url}/api/open/v1/asset/assets`, {
      params: {
        page_num: 1,
        page_size: 1000,
        type: 2
      },
      headers: {
        Authorization: header.Authorization
      }
    })
    try {
      let arr = data.data.data.list || []
      this.ctx.logger.info(arr)
      let obj = lodash.groupBy(arr, 'asset_type')
      const newArr = []
      Object.keys(obj).forEach(key => {
        newArr.push({
          AssetType: parseInt(key),
          TypeName: assetObj[key],
          Assets: lodash.compact(
            obj[key].map(item => {
              if (parseInt(item.status) === 0 || parseInt(item.asset_type) === 2)
                return {
                  AssetId: item.asset_id,
                  Name: item.name.slice(0, item.name.lastIndexOf('.')),
                  size: item.size,
                  ProcessPath: parseInt(item.asset_type) === 2 ? 'paas-gis-base/terrain/Cesium/layer.json' : item.render_path
                }
            })
          )
        })
      })
      this.ctx.logger.info(newArr)
      const sendArr = []
      newArr.map(item => {
        if (item.Assets && item.Assets.length > 0) {
          sendArr.push(item)
        }
      })
      return this.success(sendArr)
    } catch (error) {
      return this.error500([])
    }
  }
  // 模型编辑中加载资产/影像/地形/倾斜摄影数据获取（根据模型/资产列表处理）
  async load_list(header) {
    let assetObj = {
      1: 'imageries',
      2: 'terrains',
      3: 'vectors',
      4: 'obliquePhotography'
    }
    // imageries 影像资产   terrains 地形资产    oblique_photography 倾斜摄影    models 含有瓦片数据的模型
    try {
      const assetData = await axios.get(`${baseConfig.url}/api/open/v1/asset/assets`, {
        params: {
          page_num: 1,
          page_size: 1000,
          type: 2
        },
        headers: {
          Authorization: header.Authorization
        }
      })
      const modelData = await axios.get(`${baseConfig.url}/api/open/v1/asset/assets`, {
        params: {
          page_num: 1,
          page_size: 1000,
          type: 1
        },
        headers: {
          Authorization: header.Authorization
        }
      })
      let assetArr = assetData.data.data.list || []
      let modelArr = modelData.data.data.list || []
      let obj = lodash.groupBy(
        assetArr.filter(item => item.status === 0),
        'asset_type'
      )
      let objAsset = {}
      if (Object.keys(obj).length > 0) {
        Object.keys(obj).forEach(key => {
          objAsset[assetObj[key]] = obj[key]
        })
      }
      let arr0 = objAsset.imageries || []
      if (arr0.length > 0) {
        arr0.map(item => {
          item.process_path = item.render_path
        })
      }
      let arr1 = objAsset.vectors || []
      if (arr1.length > 0) {
        arr1.map(item => {
          item.process_path = item.render_path
        })
      }
      modelArr.map(item => {
        item.tiles_path = item.render_path
      })
      this.ctx.logger.info(objAsset)
      return this.success({ ...objAsset, models: modelArr.filter(item => item.status === 0) || [] })
    } catch (error) {
      this.error500({})
    }
  }
  // 模型编辑检索使用（保留）
  async searchLocation() {
    return this.success({})
  }

  // 获取场景领域及分类信息 https://xbase.daxiangyun.com/doc/api#/services/graph/apidocs/getCimDomainCategory
  async getCimCategory(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/graph-service/cim/category`, {
      params: query,
      headers: {
        Authorization: header.Authorization,
        contentType: 'application/json'
      }
    })
    let arr = data.data
    try {
      const {
        data: { domain_list = [] }
      } = arr
      if (domain_list && domain_list.length > 0) {
        arr.data.domain_list.map(item => {
          if (!item.categorys) {
            item.categorys = item.categories || []
          }
        })
      }
    } catch (error) {}
    return arr
  }
  //更新 暂无
  async updateSemantic(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/xbase/v1/graph-service/cim/update`, body, {
      headers: {
        Authorization: header.Authorization,
        contentType: 'application/json'
      }
    })
    return data.data
  }
  // 场景语义化保存 https://xbase.daxiangyun.com/doc/api#/services/graph/apidocs/saveCimElementsData
  async saveSemantic(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/graph-service/cim/save`, body, {
      headers: {
        Authorization: header.Authorization,
        contentType: 'application/json'
      }
    })
    return data.data
  }
  // 获取场景元素属性 https://xbase.daxiangyun.com/doc/api#/services/graph/apidocs/getCimData
  async getElementSemanticProperty(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/graph-service/cim?id=${query.id}`, {
      params: query,
      headers: {
        Authorization: header.Authorization,
        contentType: 'application/json'
      }
    })
    return data.data
  }
  // 场景语义化删除https://xbase.daxiangyun.com/doc/api#/services/graph/apidocs/deleteCimElement
  async deleteSemantic(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/graph-service/cim/delete`, body, {
      headers: {
        Authorization: header.Authorization,
        contentType: 'application/json'
      }
    })
    return data.data
  }
  // 获取场景CIM节点信息 https://xbase.daxiangyun.com/doc/api#/services/graph/apidocs/getCimSceneNodes
  async getCimNodeSemantic(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/graph-service/cim/nodes?scene_id=${query.id}&page_num=1&page_size=999`, {
      params: query,
      headers: {
        Authorization: header.Authorization,
        contentType: 'application/json'
      }
    })
    return data.data
  }
}
