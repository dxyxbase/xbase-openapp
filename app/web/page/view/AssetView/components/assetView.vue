<template>
  <div class="assetView">
    <a-modal wrapClassName="assetView" centered :destroyOnClose="true" :title="previewName" :visible="visible" :footer="null" :maskClosable="false" :keyboard="false" :width="'calc(100% - 48px)'" :height="'calc(100% - 48px)'" class="pop-ui" @cancel="handleCancel">
      <div id="contenter_map"></div>
    </a-modal>
  </div>
</template>
<script type="text/babel">
import { model_view_token } from '@/apis/model.js'
import { ResponseStatus } from '@/framework/network/util.js'
import { viewerToken } from '@/utils/setting.js'
export default {
  props: {
    previewName: {
      type: String,
      default: '模型预览'
    },
    visible: {
      type: Boolean,
      default: false
    },
    renderPath: {
      type: String,
      default: ''
    },
    asset_type: {
      type: Number,
      default: 0
    },
    wsTransInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      app: null,
      viewer: null
    }
  },
  mounted() {
    this.initMap()
  },
  methods: {
    handleCancel() {
      this.$emit('handlePreviewModel', null, false)
    },

    async getViewerToken() {
      // model（模型）、component（构件-暂无）、asset（资产）、scene（场景）
      // 获取viewer_token 预览加载均需要
      const result = await model_view_token({ file_id: this.wsTransInfo.id, viewer_type: 'asset' })
      if (result.code !== ResponseStatus.success) return this.$message.error('获取viewerToken失败')
      const {
        data: { token }
      } = result
      return {
        Authorization: viewerToken(token)
      }
    },
    async initMap() {
      let options = new DX.DefaultConfigs()
      // 静态资源地址
      options.staticHost = window.DXYP.sdkServer.staticHost
      options.serverHost = window.DXYP.sdkServer.serverHost
      options.accessToken = await this.getViewerToken()
      options.cim.scene.moon = false
      // 渲染模式，根据支持情况切换
      options.engine = window.DX.mode.CESIUM

      options.mainToolbar = []
      // contenter_map 为id，渲染容器
      window.app = this.app = new DX.Application('contenter_map')
      let type = 0
      try {
        type = parseInt(this.asset_type)
      } catch (e) {
        console.log(e)
      }
      // BIM资产
      if (type === 5 || type === 6) {
        options.isPreview = true
        options.cim.scene = {
          sun: false,
          skybox: false,
          global: false,
          backgroundColor: '#000'
        }
      } else {
        options.isPreview = false
        options.cim.scene = {
          sun: true,
          skybox: true,
          global: true,
          backgroundColor: '#000'
        }
      }
      //初始化应用
      this.app.init(options).then(async () => {
        // 获取viewer实例
        this.viewer = this.app.getViewer()
        window.mapApp = this.app
        this.viewer.on(window.DX.Events.SCENE_READY, () => {
          console.log('加载完成')
          // 根据资产类型不同进行对应操作
          if (type == 4 || type === 5 || type === 6) {
            //倾斜摄影
            const m = this.app.viewer.addLayer({
              type: DX.LayerTypes.Cesium3DTileset,
              options: {
                id: this.wsTransInfo.id,
                url: this.getResourceUrl(this.renderPath, this.app.viewer)
              }
            })
            // app.viewer.flyTo(m)
            if (!m) {
              console.error('加载资产失败')
              return
            }
            m.then(() => {
              this.app.viewer.gotoLayer(this.wsTransInfo.id, 0)
            }).catch(err => {
              console.error('加载资产失败')
            })
          } else if (type === 1) {
            //影像
            this.app.viewer.addLayer({
              type: DX.LayerTypes.TileMapService,
              options: {
                id: this.wsTransInfo.id,
                url: this.getResourceUrl(this.renderPath, this.viewer)
              }
            })
          } else if (type === 2) {
            //地形
            let url = this.getResourceUrl(this.renderPath, this.viewer)
            this.app.viewer.setTerrain({
              type: DX.TerrainProviderTypes.CesiumTerrain,
              options: {
                id: this.wsTransInfo.id,
                url: url
              }
            })
            this.app.viewer.addLayer({
              type: DX.LayerTypes.TileMapService,
              options: {
                id: 'ffc42f684e304f688e2234f89e0c0535',
                url: this.getResourceUrl('paas-gis-base/imagery/global/World/Imagery/tilemapresource.xml', this.app.viewer)
              }
            })
          } else if (type === 3) {
            this.app.viewer
              .addLayer({
                type: DX.LayerTypes.GeoJsonLayer,
                options: {
                  url: this.getResourceUrl(this.renderPath, this.viewer),
                  id: this.wsTransInfo.id
                }
              })
              .then(() => {
                this.app.viewer.gotoLayer(this.wsTransInfo.id)
              })

            //矢量
          }
        })

        await this.app.mainWindow.openFile()
        // 设置语言
        this.viewer.setLanguage(DX.lang.ZH_CN)
        var items = this.viewer.getToolbarItems()
        this.viewer.setToolbarItems(items.slice(0, 8))
      })
    },
    // 提取资源地址
    getResourceUrl(url, viewer) {
      if (/^(http|https):\/\/\S*/.test(url)) return url
      if (url.endsWith('layer.json') && this.isCesium(viewer)) {
        let urlArr = url.split('/')
        urlArr.pop()
        url = urlArr.join('/')
      }
      return `${window.DXYP.sdkServer.baseUrl}viewer/model/` + url
      // return `${location.origin}/viewer/model/` + url
    },
    isCesium(viewer) {
      return viewer.engineType === 'cesium'
    }
  }
}
</script>
<style lang="less" scoped>
#contenter_map {
  height: 100% !important;
}
::v-deep .ant-modal {
  padding-bottom: 0;
  .ant-modal-title {
    text-align: left !important;
    font-weight: 600;
    color: #333333;
  }
  .ant-modal-close {
    color: #333333;
    &:hover,
    &:focus {
      color: #333333;
    }
  }
  .ant-modal-content {
    height: 100% !important;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .ant-modal-body {
    //height: 90%;
    width: 100%;
    flex: 1;
    overflow: hidden;
    padding: 0 !important;
  }
}
</style>
