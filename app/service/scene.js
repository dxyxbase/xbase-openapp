/**
 * @Date: 2023-06-06 15:28:41
 * @LastEditTime: 2023-06-29 13:50:30
 * @FilePath: /openapi-demoapp/app/service/scene.js
 * @Description:j
 */
'use strict'
const egg = require('egg')
const axios = require('axios')
const baseConfig = require('./baseConfig')
let lodash = require('lodash')
const Controller = require('../controller/base-controller')
module.exports = class Sceneervice extends Controller {
  constructor(ctx) {
    super(ctx)
    this.ctx = ctx
  }
  async query_uid(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/model/ds/property/uid`, {
      params: query,
      headers: {
        Authorization: header.authorization,
        contentType: 'application/json'
      }
    })
    return data.data
  }
  async lists(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/scene/scenes`, {
      params: query,
      headers: {
        Authorization: header.authorization
      }
    })
    return data.data
  }

  async edit(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/scene/scene`, body, {
      headers: {
        Authorization: header.authorization,
        contentType: 'application/json'
      }
    })
    return data.data
  }

  async check(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/scene/check-name`, {
      params: query,
      headers: {
        Authorization: header.authorization
      }
    })
    return data.data
  }

  async del(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/scene/delete`, body, {
      headers: {
        Authorization: header.authorization,
        contentType: 'application/json'
      }
    })
    return data.data
  }
  async rename(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/scene/rename`, body, {
      headers: {
        Authorization: header.authorization,
        contentType: 'application/json'
      }
    })
    return data.data
  }
  async detail(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/scene/detail`, {
      params: query,
      headers: {
        Authorization: header.authorization
      }
    })
    return data.data
  }

  async assets(header) {
    let assetObj = {
      1: '影像',
      2: '地形'
      // 4: '倾斜摄影（模型）'
    }
    const data = await axios.get(`${baseConfig.url}/api/open/v1/asset/assets`, {
      params: {
        page_num: 1,
        page_size: 1000
      },
      headers: {
        Authorization: header.authorization
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
  async load_list(header) {
    let assetObj = {
      1: 'imageries',
      2: 'terrains',
      4: 'obliquePhotography'
    }
    // /api/xbase/v1/scene/load-list
    // imageries 影像资产   terrains 地形资产    oblique_photography 倾斜摄影    models 含有瓦片数据的模型
    try {
      const assetData = await axios.get(`${baseConfig.url}/api/open/v1/asset/assets`, {
        params: {
          page_num: 1,
          page_size: 1000
        },
        headers: {
          Authorization: header.authorization
        }
      })
      const modelData = await axios.get(`${baseConfig.url}/api/open/v1/model/models`, {
        params: {
          page_num: 1,
          page_size: 1000
        },
        headers: {
          Authorization: header.authorization
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
      this.ctx.logger.info(objAsset)
      return this.success({ ...objAsset, models: modelArr.filter(item => item.has_cim_data === true && item.tiles_path) || [] })
    } catch (error) {
      this.error500({})
    }
  }

  async searchLocation() {
    return this.success({})
  }
}
