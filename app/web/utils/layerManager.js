/**
 * @Date: 2023-06-09 21:06:05
 * @LastEditTime: 2023-06-09 21:06:06
 * @FilePath: /openapi-demoapp/app/web/component/Public/ModelPreview/layerManager.js
 * @Description:
 */
/* eslint-disable*/
import { CIM_ASSET_TYPE } from './asset'

function isDevelopment() {
  return process.env.NODE_ENV === 'development'
}

function getResourceUrl(url, viewer) {
  if (/^(http|https):\/\/\S*/.test(url)) return url
  // 待提取
  if (url.endsWith('layer.json') && isCesium(viewer)) {
    let urlArr = url.split('/')
    urlArr.pop()
    url = urlArr.join('/')
  }
  if (isDevelopment()) {
    return `${'https://xbasedev.dxbim.com:8333'}/viewer/model/` + url
  }

  return `${location.origin}/viewer/model/` + url
}

export function isCesium(viewer) {
  return viewer.engineType === 'cesium'
}

function hideLayer(viewer, id, is_visible) {
  is_visible !== undefined && !is_visible && viewer.visibleLayer(id, false)
}

function addImagesLayer(viewer, images) {
  if (!images) return
  images.forEach(image => {
    let { id, url, maximumLevel, scope_type } = image

    const resourceUrl = getResourceUrl(url, viewer)

    if (isCesium(viewer)) {
      viewer.addLayer({
        type: DX.LayerTypes.TileMapService,
        options: {
          url: getResourceUrl(url, viewer),
          maximumLevel: getGlobalImageMaximumLevel(url),
          id: id
        }
      })
    } else {
      viewer.addLayer({
        type: DX.CimStreamingLayerType.Image,
        layer: {
          id,
          url: resourceUrl,
          scopeType: scope_type
        }
      })
    }
    hideLayer(viewer, id, image.is_visible)
  })
}

function addTerrains(viewer, terrains) {
  if (!terrains || (terrains && terrains.length <= 0)) return
  // 地形只能设置一个
  let terrin = terrains[0]
  let { id, url, scope_type } = terrin
  if (url.endsWith('layer.json') && isCesium(viewer)) {
    let urlArr = url.split('/')
    urlArr.pop()
    url = urlArr.join('/')
  }
  const resourceUrl = getResourceUrl(url, viewer)
  if (isCesium(viewer)) {
    viewer.setTerrain({
      type: DX.TerrainProviderTypes.CesiumTerrain,
      options: {
        url: resourceUrl,
        id: id
      }
    })
  } else {
    viewer.setTerrain({
      type: DX.CimStreamingLayerType.Terrain,
      options: {
        url: resourceUrl,
        id: id,
        scopeType: scope_type
      }
    })
  }
  hideLayer(viewer, id, terrin.is_visible)
}

function add3Dtiles(viewer, threeDTiles, callback) {
  if (!threeDTiles) return
  threeDTiles.forEach((item, index) => {
    let { id, url, type, lon, lat, height, scalex, scaley, scalez, yaw, pitch, roll, scope_type, elevation } = item
    const resourceUrl = getResourceUrl(url, viewer)
    if (isCesium(viewer)) {
      let tileset = viewer.addLayer({
        type: DX.LayerTypes.Cesium3DTileset,
        options: {
          id: id,
          url: resourceUrl
        }
      })
      if (tileset) {
        let edited3Dtiles = () => {
          let fields = [lon, lat, height, scalex, scaley, scalez, yaw, pitch, roll]
          return !fields.every(field => +field == 0)
        }
        if (type == 2 || (type == 1 && edited3Dtiles())) {
          tileset.readyPromise
            .then(() => {
              viewer.transformModel(tileset, {
                lon,
                lat,
                height,
                scaleX: scalex || 1,
                scaleY: scaley || 1,
                scaleZ: scalez || 1,
                heading: yaw,
                pitch,
                roll,
                relativeHeight: elevation || 0
              })
              if (typeof callback === 'function') callback(CIM_ASSET_TYPE.TILES, threeDTiles, index)
            })
            .catch(err => {
              console.error('加载模型失败', url)
            })
        }
      }
    } else {
      // rme暂不支持scale属性
      viewer.addLayer({
        type: DX.CimStreamingLayerType.ThreeDTiles,
        layer: {
          id,
          url: resourceUrl,
          externalRef: '',
          type, //0 undefined 1 倾斜摄影数据 2 fbx 3 ifc 4 rvt 5 dgn
          lon: lon || 0,
          lat: lat || 0,
          alt: height || 0,
          yaw: yaw || 0,
          pitch: pitch || 0,
          roll: roll || 0,
          scopeType: scope_type
          // scalex: scalex || 1,
          // scaley: scaley || 1,
          // scalez: scalez || 1
        }
      })
    }
    hideLayer(viewer, id, item.is_visible)
  })
}

// todo:控制台打印影响测试性能，根据全球数据下载情况调整
function getGlobalImageMaximumLevel(url) {
  let result = undefined
  if (!url) return result
  if (url.indexOf('/World/ImageryLabel/') > -1) {
    result = 8
  }
  if (url.indexOf('/World/Imagery/') > -1) {
    result = 14
  }
  return result
}

function addLayer(viewer, { Imageries, Terrains, ThreeDTiles }, cb) {
  addImagesLayer(viewer, Imageries)
  addTerrains(viewer, Terrains)
  add3Dtiles(viewer, ThreeDTiles, cb)
}

function removeLayer(viewer, ids) {
  for (let id of ids) {
    viewer.removeLayer(id)
  }
}

function getTerrainLayerJson(url, viewer) {
  if (!url) return
  let host = `${location.origin}/viewer/model/`
  url = getResourceUrl(url, viewer)
  if (url.endsWith('layer.json') && isCesium(viewer)) {
    return url
  }

  if (url.endsWith('/')) {
    return url + 'layer.json'
  } else {
    return url + '/layer.json'
  }
}

export { addImagesLayer, addTerrains, add3Dtiles, addLayer, getResourceUrl, getGlobalImageMaximumLevel, removeLayer, getTerrainLayerJson }
