<template>
  <div class="viewModel_">
    <el-dialog :modal-append-to-body="false" width="100%" custom-class="center-dialog" wrapClassName="previewModal_1" :destroyOnClose="true" :title="fileName" :visible="visible" :footer="null" :maskClosable="false" :keyboard="false" @close="handleCancel">
      <div class="contenter">
        <div id="contenter_map" class="contenter_map" ref="contenter_map">
          <Attribute
            v-show="showAttribute"
            :attributeData="attributeData"
            :position="{
              top: '0',
              left: '0'
            }"
            resizeLimitClass="contenter_map"
            dragLimitClass="contenter_map"
            class="popDom"
            @closePop="closePop"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { model_view_token } from '@/apis/model.js'
import { ResponseStatus } from '@/framework/network/util.js'
import { getResourceUrl } from '@/utils/layerManager.js'
import { sence_detail, query_uid_byAsset } from '@/apis/sence.js'
import dealProperties from './dealProperties'
import Attribute from './Attribute.vue'
import { viewerToken } from '@/utils/setting.js'
const showPanels = []
let previewData = {}
export default {
  components: { Attribute },
  name: 'viewModel',
  // eslint-disable-next-line vue/require-prop-types
  props: ['visible', 'renderPath', 'fileName', 'fileType'],
  data() {
    const validateDesc = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入视点描述'))
      } else {
        callback()
      }
    }
    return {
      drawVisible: false,
      fileId: sessionStorage.getItem('scene_id'),
      loaded: false,
      viewer: null,
      defaultCimMutexCommands: {
        ['show_draw_panel']: ['show_add_shape_panel', 'show_draw_options'],
        ['show_add_shape_panel']: ['show_draw_panel', 'show_draw_options'],
        ['show_draw_options']: ['show_add_shape_panel', 'show_draw_panel']
      },
      viewPreImg: false,
      imgName: null,
      loading: false,
      previewModels: [],
      thumbnail: '',
      attributeKey: 'CUSTOM_BTN',
      showAttribute: false, // 是否展示自定义的属性弹框
      attributeData: {}, // 自定义弹框的属性值
      modelStatus: '',
      page_num: 1,
      page_size: 10,
      portList: [],
      total: 0,
      activeItem: {},
      sceneConfig: null,
      form: {
        desc: ''
      },
      rules: {
        desc: [{ validator: validateDesc, trigger: 'blur' }]
      },
      engine: 'CESIUM',
      app: null,
      // TWOD    ,WEBGL,SME,    HYBRID,CESUIM
      engineList: [
        {
          label: 'CESIUM', //DX.mode.CESIUM
          value: 'CESIUM'
        }
      ],
      visiblePort: false
    }
  },

  watch: {
    path(path) {
      if (!path) return
      this.destory().initApp()
    },
    showAttribute(newVal) {
      if (newVal) {
        const ele = window.document.getElementsByClassName('attributeCus')[0]
        let className = ele.getAttribute('class')
        className = className.replace('attributeCus', 'attributeCus_click')
        ele.setAttribute('class', className)
      } else {
        const ele = window.document.getElementsByClassName('attributeCus_click')[0]
        let className = ele.getAttribute('class')
        className = className.replace('attributeCus_click', 'attributeCus')
        ele.setAttribute('class', className)
      }
    }
  },
  methods: {
    // 关闭自定义属性弹框
    closePop(modelType) {
      this.app.execute(modelType)
    },
    // 设置模型的属性属性
    setModelCode(selectIds, modelId) {
      if (!selectIds || !modelId.length || !selectIds.length) {
        this.attributeData = {}
        return
      }
      const _this = this
      // get请求selectIds
      const params = {
        uid: selectIds[0],
        asset_id: modelId
      }
      query_uid_byAsset(params).then(res => {
        if (res.code === ResponseStatus.success) {
          if (!res.data) return
          const propertyArr = [res.data.categories] || []
          const file_type = res.data.path.split('.').pop()
          if (propertyArr.length === 0) return
          _this.attributeData = {
            categories: dealProperties(propertyArr, file_type),
            name: res.data.name,
            path: res.data.path,
            tag: res.data.tag,
            uid: res.data.uid
          }
        }
      })
    },

    viewImg(item) {
      this.activeItem = item
      this.viewPreImg = true
      this.imgName = item.desc
    },

    cancel(e) {},

    // 改变每页数量
    changePageSize(current, pageSize) {
      this.page_num = 1
      this.page_size = pageSize
      this.getPortList()
    },
    textareaLimit(val) {
      const reg = /[`~!#$%^&*()_\-\+=<>?:"'{}|~！#￥%……&*（）={}|《》？：“”【】；‘’]/g
      return val.replace(reg, '')
    },

    onChange() {
      this.form.desc = this.textareaLimit(this.form.desc)
    },
    handleCancel() {
      if (this.app) {
        this.app.destroy()
      }
      this.$emit('handlePreviewModel', null, false)
    },
    changeEngine(e) {
      if (this.app) {
        this.app.destroy()
      }
      this.init()
    },

    // 获取viewer_token
    async getViewerToken() {
      // model（模型）、component（构件）、asset（资产）、scene（场景）
      const result = await model_view_token({ file_id: this.fileId, viewer_type: 'scene' })
      if (result.code !== ResponseStatus.success) return this.$message.error('获取viewerToken失败')
      const {
        data: { token }
      } = result
      return {
        Authorization: viewerToken(token)
      }
    },

    setMutexCommands(engine) {
      switch (engine) {
        case 'cesium':
          Object.keys(this.defaultCimMutexCommands).forEach(key => {
            this.app.commandManager.setMutexCommands(key, this.defaultCimMutexCommands[key])
          })
          break
        default:
          break
      }
    },
    setIndex(className) {
      const popDoms = Array.from(document.getElementsByClassName(className))
      if (popDoms.length) {
        popDoms.forEach(item => {
          item.style.zIndex = this.getNowIndex()
        })
      }
    },
    getNowIndex() {
      let defaultZIndex = 30
      let zIndex = Math.floor(defaultZIndex + Date.now() / 500 - this.zIndex)
      return zIndex < 5 ? 5 : zIndex
    },
    updateModelBimPreview(data, state) {
      data.toggled = undefined
      app.execute('DX_COMMAND_UPDATE_CIM_MODEL_BIM_PREVIEW', {
        ...data,
        state
      })
    },
    async init() {
      let options = new DX.DefaultConfigs()
      // 设置静态资源域的地址
      options.staticHost = window.DXYP.sdkServer.staticHost + '/'
      options.serverHost = window.DXYP.sdkServer.serverHost
      options.signalHost = window.DXYP.sdkServer.signalServer
      options.gravityEnabled = false
      options.extendsSelfAdaption = true
      options.cim.scene.moon = false
      options.isPreview = true
      options.accessToken = await this.getViewerToken()
      // options.previewToken = await this.getViewerToken()
      // 渲染模式
      // options.engine = this.engine === 'CESIUM' ? window.DX.mode.CESIUM : DX.mode.SME
      options.engine = window.DX.mode.CESIUM

      // 设置默认的toolbar功能
      options.mainToolbar = []
      //创建app实例
      window.app = this.app = new DX.Application('contenter_map')
      //初始化应用
      this.setMutexCommands(options.engine)
      // 添加自定义的按钮
      let that = this
      options.mainToolbar.splice(2, 0, this.attributeKey)
      const filterArr = ['show_properties']
      const customButtonArr = [
        {
          key: this.attributeKey,
          hasActive: true,
          title: '属性',
          update: true,
          index: 2,
          className: 'attributeCus',
          handle: function () {
            that.showAttribute = !that.showAttribute
            that.showAttribute && that.setIndex('attributePop')
          }
        }
      ]
      // 去掉模型树和属性
      options.mainToolbar = options.mainToolbar.flatMap(item => (filterArr.includes(item) ? [] : [item]))
      this.app.init(options).then(async () => {
        // 获取viewer实例
        const mutexCommands = ['roaming_sub', 'DX_COMMAND_SHOW_FREE_ROAMING_TOOLBAR', 'ShowPathRoaming', 'ShowFreeRoamingCommand', 'ShowPathRoaming', 'show_layer', 'show_viewpoint_list', 'enable_measure', 'analysis_sub', 'DX_COMMAND_ENABLE_VISIBLE_ANALYSIS', 'DX_COMMAND_ENABLE_VIEWSHED_ANALYSIS', 'DX_COMMAND_ENABLE_HEIGHT_ANALYSIS', 'DX_COMMAND_ENABLE_SKYLINE_ANALYSIS', 'DX_COMMAND_ENABLE_INUNDATION_ANALYSIS', 'DX_COMMAND_ENABLE_VOLUME_ANALYSIS', 'DX_COMMAND_ENABLE_SLOP_ANALYSIS', 'DX_COMMAND_ENABLE_CONTOUR_LINE', 'DX_COMMAND_ENABLE_WEATHER', 'show_setting']
        this.viewer = this.app.getViewer()
        // 处理按钮互斥
        const commandManagerMap = this.app.commandManager.mutexCommands
        const commandManagerObj = {}
        const createBtnKeys = [this.attributeKey]
        commandManagerMap.forEach((value, key) => {
          commandManagerObj[key] = []
          value.forEach(item => {
            commandManagerObj[key].push(item.id)
          })
          if (mutexCommands.includes(key)) {
            commandManagerObj[key] = commandManagerObj[key].concat(createBtnKeys)
          }
        })
        createBtnKeys.forEach(item => {
          commandManagerObj[item] = mutexCommands
        })
        // 向sdk添加自定义按钮
        customButtonArr.forEach(item => {
          this.viewer.createCustomButton(item)
        })
        this.viewer.setToolbarItems(this.fileId ? options.mainToolbar : [])
        this.app.commandManager.updateMutexCommads(commandManagerObj)
        // 上传之后拿到对应路径（1.通过上传接口的返回结果拿到对应path，2.通过管理界面上传之后更多中渲染路径获取）
        // this.renderPath
        await this.app.mainWindow.openFile()

        app.mainWindow.update()

        this.app.mainWindow.update()
        this.viewer.setLanguage(DX.lang.ZH_CN)

        // var items = this.viewer.getToolbarItems()
        // this.viewer.setToolbarItems(items.slice(0, 8))
        this.initScene()
        // debugger
        window.mapApp = this.app
        // this.viewer.on(DX.Events.SCENE_READY, () => {
        //   console.log('loaded sence')
        //   this.initScene()
        // })
        this.viewer.on(window.DX.Events.SELECT_LAYER, function (response) {
          const selectionIds = this.app.viewer.getSelectionIds()
          // console.log('选中模型',response,selectionIds)
          that.setModelCode(selectionIds, response || [])
        })
      })
    },
    initScene() {
      sence_detail(this.fileId).then(result => {
        if (result.code !== ResponseStatus.success) return this.$message.error('获取详情失败')
        this.sceneConfig = result.data.source ? JSON.parse(result.data.source) : null
        app.execute('DX_COMMAND_SET_SCENE_CONFIG', {
          sceneConfig: this.sceneConfig,
          options: {
            baseUrl: `${window.DXYP.sdkServer.baseUrl}viewer/model/`
          }
        })
        app.viewer.enableDepthTestAgainstTerrain(true)
        app.execute('DX_COMMAND_ENABLE_CIM_MODEL_BIM_PREVIEW')
        let modelList = this.sceneConfig.layer.models || []
        modelList = modelList.filter(item => {
          return item.type !== 1
        })
        this.previewModels = modelList.map(model => {
          return model.id
        })
        app.execute('DX_COMMAND_ENABLE_CIM_MODEL_BIM_PREVIEW', { toggled: true, models: this.previewModels })
        app.viewer.on(DX.Events.ADD_MODEL_PREVIEW, data => {
          if (!modelList || previewData.id === data.id) return
          if (previewData.bimApp) previewData.bimApp.destroy()
          previewData = {
            id: data.id,
            data
          }

          const modelIndex = modelList.findIndex(item => item.id === data.id)
          if (modelIndex < 0) return
          const modelData = modelList[modelIndex]
          data.name = modelData.name.substring(0, modelData.name.lastIndexOf('.'))

          let bimApp = this.addBimViewer(app.viewer, modelData.bim_url, () => {
            if (previewData.id === data.id) {
              app.execute('DX_COMMAND_UPDATE_CIM_MODEL_BIM_PREVIEW', {
                ...data,
                state: 'loaded'
              })
            }
          })
          previewData.bimApp = bimApp
        })

        app.viewer.on(DX.Events.REMOVE_MODEL_PREVIEW, id => {
          if (previewData.id === id) {
            if (previewData.bimApp) {
              const domElement = previewData.bimApp.mainWindow.dom
              previewData.bimApp.destroy()
              domElement.remove()
            }
            previewData = {}
          }
        })

        app.viewer.on(DX.Events.SHOW_MODEL_PREVIEW, id => {
          previewData.id === id && this.showBimViewer(id, previewData)
        })

        app.viewer.on('EVENT_FREE_ROAMING_MODE_CHANGED', ({ id, type }) => {
          if (!modelList) return
          const modelIndex = modelList.findIndex(item => item.id === id)
          if (modelIndex < 0) return
          const modelData = modelList[modelIndex]

          let url
          if (modelData.hierarchy.length === 2) {
            url = modelData.hierarchy[type === 'indoor_mode' ? 0 : 1].value
          } else if (modelData.hierarchy.length === 1) {
            url = modelData.hierarchy[0].value
          } else {
            url = modelData.url
          }
          app.viewer.updateModelPath(id, getResourceUrl(url, app.viewer))
        })
        let freeRoamingPanel
        for (let panel of app.mainWindow.panelManager.panels.values()) {
          if (panel.name === 'DX_PANEL_FREE_ROAMING_TOOLBAR') {
            freeRoamingPanel = panel
            break
          }
        }
        freeRoamingPanel &&
          freeRoamingPanel.on(DX.Events.PANEL_VISIBLE_CHANGED, visible => {
            app.execute('DX_COMMAND_ENABLE_CIM_MODEL_BIM_PREVIEW', { toggled: !visible })
            if (visible) {
              if (previewData.bimApp) previewData.bimApp.destroy()
              previewData = {}
            }
          })
      })
    },
    showBimViewer(id, data) {
      app.viewer.visibleLayer(id, false)
      app.execute('DX_COMMAND_ENABLE_CIM_MODEL_BIM_PREVIEW')
      let bimApp = data.bimApp
      bimApp.viewer.domElement.parentElement.style.display = 'unset'
      bimApp.viewer.domElement.style.background = ' rgba(0,0,0,.5)'
      //更新界面
      bimApp.mainWindow.resize()

      showPanels.length = 0
      app.mainWindow.panelManager.panels.forEach(panel => {
        if (panel.visibled) {
          showPanels.push(panel)
          panel.visibled = false
        }
      })
      bimApp.mainWindow.mainToolbarEntity.showExit(true)
      !data.initClick &&
        bimApp.mainWindow.mainToolbarEntity.secondToolbarExit.onClick(() => {
          bimApp.viewer.domElement.parentElement.style.display = 'none'
          app.viewer.visibleLayer(id, true)
          showPanels.forEach(panel => {
            panel.visibled = true
          })
          showPanels.length = 0
          app.execute('DX_COMMAND_ENABLE_CIM_MODEL_BIM_PREVIEW')
        })
      data.initClick = true
    },
    addBimViewer(viewer, url, callback) {
      let options = new DX.DefaultConfigs()
      options.staticHost = viewer.options.staticHost
      options.serverHost = window.DXYP.sdkServer.serverHost
      options.mainToolbar = [...new Set([...options.mainToolbar])]
      options.engine = 'webgl'
      let container = document.createElement('div')
      container.class = 'bimViewer'
      container.style.cssText = `
          top: -100%;
          overflow: hidden;
          display: none;
          z-index: 999;
      `
      viewer.domElement.parentElement.appendChild(container)
      var bimApp = new DX.Application(container)
      //初始化应用
      bimApp.init(options).then(() => {
        //打开模型
        bimApp.mainWindow.openFile(url).then(() => {
          callback && callback()
        })
        //更新界面
        bimApp.mainWindow.update()
      })
      return bimApp
    },
    observerClick() {
      // 监听鼠标点下事件
      this.zIndex = Date.now() / 500
      const popDoms = Array.from(document.getElementsByClassName('popDom'))
      if (popDoms.length) {
        popDoms.forEach(item => {
          item.addEventListener(
            'mousedown',
            () => {
              this.mouseDown(item)
            },
            { signal: controller.signal }
          )
        })
      }
    }
  },
  mounted() {
    this.init()
    this.observerClick()
  }
}
</script>
<style lang="less" scoped>
::v-deep .free-roaming-tip {
  left: 0 !important;
}
::v-deep .ant-modal-body {
  padding: 0 !important;
}

.center-dialog {
  // top: 50%;
  // transform: translateY(-50%);
}
// 自定义按钮样式
::v-deep .attributeCus {
  background: url('~@/asset/attributePop/attribute.svg') !important;
}

::v-deep .attributeCus_click {
  background-image: url('~@/asset/attributePop/attribute-click.svg') !important;
}
.attributeCus,
.attributeCus_click {
  background-repeat: no-repeat !important;
  background-position: center !important;
  background-size: 1.5rem !important;
}
</style>
<style lang="less" scoped>
.img-box {
  width: 100%;
  > div,
  img {
    width: 100%;
  }
}
.pagination {
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep .ant-card-body {
  padding: 12px 12px 0;
}
::v-deep .ant-card-actions {
  height: 30px;
  display: flex;
  gap: 12px;
  justify-content: flex-start;
  align-items: center;
  font-size: 18px;
  border-top: none;
  margin: 0;
  margin-top: 12px;
  > i:hover {
    color: #267ef0;
  }
}
.drawList {
  height: 100%;
  overflow: auto;
}
::v-deep .ant-drawer-wrapper-body {
  height: 100%;
  display: flex;
  flex-direction: column;
  .ant-drawer-header {
    padding: 12px 6px;
  }
  .ant-drawer-body {
    padding: 12px 6px;
    height: 0;
    overflow: hidden;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    .drawBox {
      display: flex;
      gap: 12px;
      flex-direction: column;
    }
    .drawBox,
    .drawContent {
      height: 0;
      overflow: hidden;
      flex-grow: 1;
    }
  }
}
.viewport {
  padding: 24px;
}
.view-box {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0px;
}

.top-change {
  // padding: 2px 24px;

  .right-opr {
    display: flex;
    justify-content: flex-end;
    text-align: right;
  }
}
.contenter {
  width: 100%;
  height: 100%;
}
#contenter_map {
  height: 100% !important;
  box-sizing: border-box;
  border-top: 1px solid #e8e8e8;
}
::v-deep .el-dialog {
  height: 100%;
  margin: 0 !important;
  display: flex;
  flex-direction: column;
  .el-dialog__header {
    flex-grow: 0;
    flex-shrink: 0;
    position: relative;
    padding: 10px 10px;
  }
  .el-dialog__headerbtn {
    top: 50%;
    transform: translateY(-50%);
  }
  .el-dialog__body {
    flex-grow: 1;
    padding: 0 !important;
    height: calc(100% - 50px) !important;
    position: relative;
  }
}
.viewModel_ {
  position: absolute;
  width: 93% !important;
  height: 93% !important;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  margin: auto;

  .previewTop {
    height: 40px;
    background: #f8f8f8;
    border: 1px solid #e7e7e7;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 24px;
    .ant-divider {
      background: rgba(7, 15, 26, 0.2) !important;
      margin: 0 10px;
      height: 18px;
    }
    .disabled {
      color: #cccccc;
      cursor: not-allowed;
    }
    .openViewPoint {
      color: #267ef0 !important;
    }
    & > span {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #10141a;
      svg {
        font-size: 14px;
        margin-right: 7px;
        position: relative;
        top: 1px;
      }
      .btn {
        font-size: 12px !important;
      }
    }
    & > span:hover:not(.disabled) {
      color: #267ef0;
      cursor: pointer;
    }
  }
  .modelView {
    height: 100%;
  }
  .modelViewPoint {
    height: calc(100% - 40px);
  }
}
.createDialog {
  .textarea {
    resize: none;
    height: 80px !important;
    width: 339px !important;
    margin: 0 !important;
  }
  .ant-modal-header {
    padding: 13px 24px;
  }
  .ant-modal-title {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: #10141a;
  }
  .ant-modal-body {
    padding: 22px 36px 24px;
  }
  .ant-modal-footer {
    border: none;
    padding-top: 0;
    padding-bottom: 24px;
    button {
      min-width: 72px;
      height: 30px;
    }
    button + button {
      margin-left: 12px;
    }
    & > div {
      text-align: center;
    }
  }
  .ant-form-item-required::before {
    display: none;
  }
  .ant-form-item {
    margin-bottom: 18px;
  }
  .ant-form-explain {
    margin: 0;
    font-size: 12px;
    min-height: auto;
  }
  .ant-form-item-with-help {
    margin: 0;
  }
  .ant-form-item-label {
    line-height: 28px !important;
    & > label {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #282828 !important;
      white-space: pre-line;
    }
  }
  .pointImg {
    width: 100%;
    height: 236px;
    border-radius: 2.69px;
    object-fit: contain;
    border: 1px solid #e7e7e7;
    &.loading-wrp {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: 98px;
      p {
        margin-top: 25px;
        margin-bottom: 0px;
        font-size: 12px;
      }
    }
  }
}
</style>
