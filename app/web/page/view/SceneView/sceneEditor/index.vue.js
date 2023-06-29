/* eslint-disable */
import IconFont from '@/components/IconFont'
import ViewerApp from '@/components/ViewerApp'
import Title from './Title'
import Toolbar from './Toolbar'
import SecondToolbar from './SecondToolbar'
import { getExtraPlugins } from './getExtraPlugins'
import { mapState } from 'vuex'
import { queryURL } from '@/utils/util'
import { CIM_ASSET_TYPE } from '@/utils/asset'
import _ from 'lodash'

import ModelPosition from '@/components/ModelView/plugins/modelPosition'
import { MODEL_POSITION_ID } from '@/components/ModelView/plugins/modelPosition/constants'
import { GET_REDLINES } from '@/store/actions-types'
import { SUNLIGHT_ANALYSIS_ID } from '@/components/ModelView/plugins/sunlightAnalysis/constants'
import { HEIGHT_QUERY_ID } from '@/components/ModelView/plugins/heightQuery/constants'
import { getSceneModelHeight } from '@/api/modelHeight'
import { addLayer, removeLayer } from '@/untils/layerManager'

import { cimInputLimit, inputLimit } from '@/utils/inputLimit'
import { toolbarLeft, toolbarRight, drawToolbar, analysisToolbar, terrainEditToolbar, queryToolbar, groundMode, undergroundMode, commands, loadLayerSuccess, toolbarPanelCoexistRelate, roamingToolbar, onlyFirstToolbarPanel } from './constant'

import methodsMixin from './methodsMixin'

import { ALL_PANEL, MUTEX_PANEL } from './panels'
import { transformPoint } from '@/components/ModelView/plugins/transformPoint'
import { getRenderMode } from '@/utils/viewer'
import mytransition from '@/components/MyTransition'
// 数据导出时mm, 项目应用是m.
const unit = 1000

export default {
  components: {
    IconFont,
    ViewerApp,
    Title,
    Toolbar,
    SecondToolbar,

    ModelPosition,
    mytransition
  },
  data() {
    return {
      sceneId: '',
      appId: '',
      app: null,
      modeType: groundMode,
      pathMapProperty: new Map(),
      pathMapPositionProperty: new Map(),
      pathMapPickPointProperty: new Map(),

      toolbarActiveId: '',
      toolbarLeft: [],
      toolbarRight: [],

      secondToolbarActiveId: '',
      secondToolbar: [],

      showLoad: false,
      showSave: false,

      activeKey: '模型',
      modelsCheckedKeys: [],
      imageriesCheckedKeys: [],
      terrainsCheckedKeys: [],
      threeDTilesCheckedKeys: [],

      selectedLayer: null,

      saveAsSceneName: '',

      listenerFns: {},
      modelHeightList: [],
      backlineList: [],

      isRemoveLocalStorage: true,
      modal: null,
      isLoading: false,
      settingConfig: null,
      checkMap: new Map(),
      currentRenderMode: '',

      saveSceneLoading: false,
      saveAsSceneLoading: false,
      isToggleing: false,
      disableClick: false,
      haveSecondToolbar: false,
      panelPosition: {}, // 面板位置，因页面是rem布局，所以需要动态计算位置
      secondToolbarWidth: 0 // 二级工具栏宽度 因会隐藏，所以需要动态计算
    }
  },
  computed: {
    toolbarLeftComputed() {
      return toolbarLeft()
    },
    toolbarRightComputed() {
      return toolbarRight()
    },
    // todo  修改接口接入数据
    ...mapState({
      title: state => state.sceneEdit.sceneSource.scene_name,
      path: state => state.sceneEdit.sceneSource.render_path,
      treeData: state => state.sceneEdit.sceneData.treeData,
      layer: state => state.sceneEdit.sceneSource.layer
    })
  },
  mixins: [methodsMixin],
  created() {
    this.handleToolbarStatus(true)
  },
  mounted() {
    this.appId = window.localStorage.getItem('appId')
    this.sceneId = decodeURIComponent(queryURL('scene_id'))
    this.projectId = decodeURIComponent(queryURL('project_id'))
    this.currentRenderMode = decodeURIComponent(queryURL('alias'))
    if (!this.path || this.path === 'null') {
      this.$store.dispatch('updateSceneInfo', this.sceneId)
    } else {
      this.setCheckedKeys(this.layer)
    }
    this._getModelHeight(this.sceneId)
    this._getBacklineData(this.projectId)

    localStorage.setItem('sceneId', `${this.sceneId}?t=${Date.now()}`)
    setTimeout(() => window.addEventListener('storage', this.sendMessage), 1000)
    this.initCheckMap()
    this.domResize()
    window.addEventListener('resize', this.domResize)
  },
  beforeDestroy() {
    window.removeEventListener('storage', this.sendMessage)
    window.removeEventListener('resize', this.domResize)
    if (this.isRemoveLocalStorage) {
      localStorage.removeItem('sceneId')
    }
    this.$store.commit('clearSceneInfo')
  },

  watch: {
    // secondToolbar(secondToolbar) {
    //   if (!this.app) return
    //   if (secondToolbar.length) {
    //     this.setCompassPosition(this.app)
    //     this.setZoomPosition(this.app)
    //   } else {
    //     this.resetCompassPosition(this.app)
    //     this.resetZoomPosition(this.app)
    //   }
    // },
    layer(layer = {}) {
      this.setCheckedKeys(layer)
    }
  },

  methods: {
    setCheckedKeys({ Imageries, Terrains, ThreeDTiles } = {}) {
      const { assets, models } = this.getStore().sceneSource

      const imageriesIds = (Imageries || []).map(item => item.id)
      const terrainsIds = (Terrains || []).map(item => item.id)
      const threeDTilesIds = (ThreeDTiles || []).map(item => item.id)

      let modelsCheckedKeys = []
      let imageriesCheckedKeys = []
      let terrainsCheckedKeys = []
      let threeDTilesCheckedKeys = []

      for (let { file_type, personal_assets, public_assets } of assets) {
        const assetsArr = [...(personal_assets || []), ...(public_assets || [])]
        switch (file_type) {
          case '影像':
            for (let { asset_id } of assetsArr) {
              if (imageriesIds.includes(asset_id)) {
                imageriesCheckedKeys.push(asset_id)
              }
            }
            break
          case '地形':
            for (let { asset_id } of assetsArr) {
              if (terrainsIds.includes(asset_id)) {
                terrainsCheckedKeys.push(asset_id)
              }
            }
            break
          case '倾斜摄影模型':
            for (let { asset_id } of assetsArr) {
              if (threeDTilesIds.includes(asset_id)) {
                threeDTilesCheckedKeys.push(asset_id)
              }
            }
            break
        }
      }

      let recursion = node => {
        if (threeDTilesIds.includes(node.id)) {
          modelsCheckedKeys.push(node.id)
        }
        if (node.children && node.children.length) {
          node.children.forEach(item => {
            recursion(item)
          })
        }
      }

      for (let model of models) {
        recursion(model)
      }

      this.modelsCheckedKeys = modelsCheckedKeys
      this.imageriesCheckedKeys = imageriesCheckedKeys
      this.terrainsCheckedKeys = terrainsCheckedKeys
      this.threeDTilesCheckedKeys = threeDTilesCheckedKeys

      //处理选中之后disabled的状态
      this.$store.dispatch('updateTreeData', {
        modelsCheckedKeys,
        imageriesCheckedKeys,
        // terrainsCheckedKeys,
        threeDTilesCheckedKeys
      })
    },
    sendMessage(e) {
      if (e.key !== 'sceneId') return
      if (this.modal) this.destroyModal()
      this.modal = this.$warning({
        content: this.$t('scene.editTip'),
        onOk: resolve => {
          this.isRemoveLocalStorage = false
          this.$refs.sceneTitle?.go2Back()
          this.destroyModal()
          resolve()
        }
      })
    },
    destroyModal() {
      this.modal.destroy()
      this.modal = null
    },
    stopPropagation(e) {
      e.stopPropagation()
    },
    getStore() {
      return _.cloneDeep(this.$store.state.sceneEdit)
    },
    addPlugins(app) {
      if (!DX) return
      this.app = app
      getExtraPlugins(app).forEach(Plugin => app.pluginManager.install(new Plugin(app, this.$store, this.$refs)))
    },

    getProperties(resolve, mapType, page, pageSize, name, logicop, path) {
      if (this[mapType].has(path)) {
        resolve(this[mapType].get(path))
      } else {
        this.app.viewer
          .getDataManager()
          .getModelPropertyByNameAsync(page, pageSize, name, logicop, path)
          .then(data => {
            this[mapType].set(path, data.property)
            resolve(data.property)
          })
      }
    },

    _getModelProperty(path, page = 0, pageSize = -1, name, logicop) {
      return new Promise(resolve => {
        if (name.length === 5) {
          this.getProperties(resolve, 'pathMapProperty', page, pageSize, name, logicop, path)
        } else if (name[0] === '拾取点') {
          this.getProperties(resolve, 'pathMapPickPointProperty', page, pageSize, name, logicop, path)
        } else if (name[0] === '定位点') {
          this.getProperties(resolve, 'pathMapPositionProperty', page, pageSize, name, logicop, path)
        }
      })
    },

    _getModelPositionContainer() {
      return document.querySelector(`#${MODEL_POSITION_ID}`)
    },

    _getRedlineContainer() {
      return document.querySelector(`#${REDLINE_ID}`)
    },

    _getSunlightAnalysisContainer() {
      return document.querySelector(`#${SUNLIGHT_ANALYSIS_ID}`)
    },

    _getHeightQueryContainer() {
      return document.querySelector(`#${HEIGHT_QUERY_ID}`)
    },

    handleToolbarStatus(enabled) {
      if (enabled) {
        this.toolbarLeft = _.cloneDeep(this.filterUnvisibleToolbar(this.toolbarLeftComputed))
        this.toolbarRight = _.cloneDeep(this.filterUnvisibleToolbar(this.toolbarRightComputed))
      }
    },

    redLinesChange(data, isFromModel) {
      if (isFromModel && !analysisToolbar[2].disabled) return
      if (data?.length > 0) {
        analysisToolbar[2].disabled = false
      } else {
        analysisToolbar[2].disabled = true
      }
    },

    changeMode(type) {
      // 地上模式
      if (type === undergroundMode) {
        this.modeType = undergroundMode
      } else {
        this.modeType = groundMode
      }
    },

    changeEngine(type) {
      this.isToggleing = true
      this.$nextTick(() => {
        this.isToggleing = false
      })
      this.currentRenderMode = type
    },

    hideAllPanel(extraPanels) {
      if (!extraPanels) extraPanels = []
      const allPanel = ALL_PANEL.filter(key => !extraPanels.includes(key))
      this.hidePanels(allPanel, this.app)
      this.hidePanels(MUTEX_PANEL, this.app)
    },
    toolbarClick(id) {
      // 面板位置
      onlyFirstToolbarPanel[id] && window.app.mainWindow.panelManager.panels.get(onlyFirstToolbarPanel[id]).setXY(this.panelPosition.left, this.panelPosition.top)
      let extraPanelArr = toolbarPanelCoexistRelate[id]
      // 目前需求全部互斥

      if (id == this.toolbarActiveId) {
        this.toolbarActiveId = ''
        this.secondToolbarActiveId = ''
        this.secondToolbar = []
        this.hideAllPanel(extraPanelArr)
        return
      }
      this.hideAllPanel(extraPanelArr)
      const onlyFirstToolbarPanelArr = Object.keys(onlyFirstToolbarPanel)
      this.haveSecondToolbar = !onlyFirstToolbarPanelArr.includes(id)
      switch (id) {
        case 'draw':
          this.secondToolbar = drawToolbar()
          break
        case 'analysis':
          this.secondToolbar = analysisToolbar()
          break
        case 'terrainEdit':
          this.secondToolbar = terrainEditToolbar()
          break
        case 'roaming':
          this.secondToolbar = roamingToolbar()
          break
        case 'query':
          this.secondToolbar = queryToolbar()
          break
        default:
          this.secondToolbar = []
          break
      }
      switch (id) {
        case 'load':
          this.showLoad = true
          break
        case 'saveScene':
          this.toolbarActiveId = ''
          this.saveScene()
          break
        case 'saveSceneAs':
          this.showSave = true
          break
        case 'uninstall':
          this.toolbarActiveId = ''
          this.uninstall()
          break
        default:
          break
      }
      if (commands[id]) {
        this.app.execute(commands[id], { toggled: true })
      }
      this.toolbarActiveId = id
    },

    secondToolbarClick(id) {
      let toggled = true
      if (id == this.secondToolbarActiveId) {
        toggled = false
      }
      this.hidePanels(ALL_PANEL, this.app)
      this.app.execute(commands[id], { toggled })

      switch (id) {
        case 'point':
          this.app.execute(DX.Commands.SHOW_DRAW_PANEL, { type: DX.DrawTypes.POINT, toggled })

          break
        case 'line':
          this.app.execute(DX.Commands.SHOW_DRAW_PANEL, { type: DX.DrawTypes.LINE, toggled })
          break

        case 'face':
          this.app.execute(DX.Commands.SHOW_DRAW_PANEL, { type: DX.DrawTypes.POLYGON_FACE, toggled })
          break

        case 'body':
          this.app.execute(DX.Commands.SHOW_DRAW_PANEL, { type: DX.DrawTypes.VOXEL, toggled })
          break
      }

      this.app.mainWindow.panelManager.update(true /** isWindowResize */)

      this.secondToolbarActiveId = toggled ? id : ''
    },

    handleBtnStatus(type, id) {
      const preId = this[type]
      let nextId = ''
      if (this[type] === id) {
        nextId = this[type] = ''
      } else {
        nextId = this[type] = id
      }
      return { preId, nextId }
    },

    _mapProperty(source, execute, isDone) {
      // 查询定位点需要定制execute和isdone方法.
      for (let i = 0, ii = source.length; i < ii; i++) {
        for (let j = 0, jj = source[i].categories.length; j < jj; j++) {
          for (let k = 0, kk = source[i].categories[j].properties.length; k < kk; k++) {
            execute(source[i].categories[j].properties[k])
            if (isDone()) break
          }
          if (isDone()) break
        }
        if (isDone()) break
      }
    },

    async searchModelsPosition(arr) {
      if (!arr.length) return
      const propertyNames = ['定位点']
      const logicop = ['or']

      for (let item of arr) {
        const props = await this._getModelProperty(item.render_path, 0, -1, propertyNames, logicop)
        if (!props) continue
        const source = props.pageItems || []
        let doneLocation = false
        const isDone = () => doneLocation

        const execute = ({ name, value }) => {
          if (!value) return
          if (!doneLocation && name === propertyNames[0]) {
            const locationPoint = JSON.parse(value)
            if (!locationPoint || !Object.keys(locationPoint).length) return
            if (isNaN(+locationPoint.X) || isNaN(+locationPoint.Y)) return
            const { lon, lat, alt: height } = transformPoint(locationPoint.X / unit, locationPoint.Y / unit)
            item = { ...item, lon, lat, height }
            doneLocation = true
          }
        }
        this._mapProperty(source, execute, isDone)
      }
      return arr
    },

    async searchModelsProprties(arr) {
      if (!arr.length) return
      let doneLine = false
      let coordinates = []
      let basePoint = null
      const propertyNames = ['用地红线', '项目基点', '定位点', '定位点正北夹角', '拾取点']
      const logicop = ['or', 'or', 'or', 'or', 'or']

      for (const item of arr) {
        const props = await this._getModelProperty(item.render_path, 0, -1, propertyNames, logicop)
        if (!props) continue
        const source = props.pageItems || []
        let doneLocation = false
        let doneAngle = false
        let donePickPoint = false
        let donePoint = false

        const isDone = () => {
          return doneLine && donePoint && doneLocation && doneAngle && donePickPoint
        }

        const execute = ({ name, value }) => {
          if (!value) return
          switch (true) {
            case !doneLine && name === propertyNames[0]:
              // 默认取第一条红线
              const rdPoints = JSON.parse(value)
              if (!rdPoints.length) break
              coordinates = (rdPoints[0].Points || []).map(p => ({
                x: +(p.X / unit).toFixed(2),
                y: +(p.Y / unit).toFixed(2)
              }))
              doneLine = true
              break
            case !donePoint && name === propertyNames[1]:
              const point = JSON.parse(value)
              if (!point || !Object.keys(point).length) break
              if (isNaN(+point.X) || isNaN(+point.Y) || isNaN(+point.Y)) break
              if (!basePoint) basePoint = point
              if (isNaN(item.x) || isNaN(item.y)) {
                item.x = point.X / unit
                item.y = point.Y / unit
                item.z = point.Z / unit
              }
              donePoint = true
              break
            case !doneLocation && name === propertyNames[2]:
              const locationPoint = JSON.parse(value)
              if (!locationPoint || !Object.keys(locationPoint).length) break
              if (isNaN(+locationPoint.X) || isNaN(+locationPoint.Y)) break
              item.x = locationPoint.X / unit
              item.y = locationPoint.Y / unit
              delete item.z
              doneLocation = true
              break
            case !doneAngle && name === propertyNames[3]:
              if (isNaN(+value)) break
              item.angle = value
              doneAngle = true
              break
            case !donePickPoint && name === propertyNames[4]:
              const pickPoint = JSON.parse(value)
              if (!pickPoint || !Object.keys(pickPoint).length) break
              if (isNaN(+pickPoint.X) || isNaN(+pickPoint.Y) || isNaN(+pickPoint.Z)) break
              item.pickPoint = {
                X: pickPoint.X / unit,
                Y: pickPoint.Y / unit,
                Z: pickPoint.Z / unit
              }
              donePickPoint = true
              break
            default:
              break
          }
        }

        this._mapProperty(source, execute, isDone)
        // console.log({'红线':coordinates, '项目基点':basePoint, '拾取点':item.pickPoint, '夹角':item.angle, '模型':item,})
      }

      if (basePoint) {
        coordinates.forEach(coord => {
          coord.x = (coord.x + basePoint.X / unit).toFixed(2)
          coord.y = (coord.y + basePoint.Y / unit).toFixed(2)
        })
      }
      this.$refs.redline?.setPoints(coordinates)
      this.redLinesChange(coordinates, true)

      return arr
    },

    async loadFile() {
      //加载数据到图层
      this.isLoading = true
      const { layer, assets, models } = this.getStore().sceneSource
      let locateArr = []
      const addLayerParams = {
        Imageries: [],
        Terrains: [],
        ThreeDTiles: []
      }
      let isUpdate = false
      let isUpdateAssets = false
      let terrainDisableIds = []

      if (!layer.Imageries) layer.Imageries = []
      if (!layer.Terrains) layer.Terrains = []
      if (!layer.ThreeDTiles) layer.ThreeDTiles = []

      let recursion = children => {
        for (let item of children) {
          const { id } = item

          if (!item.is_dir && this.modelsCheckedKeys.includes(id) && !this.findIsExist(layer.ThreeDTiles, id)) {
            locateArr.push(item)
            isUpdate = true
          }

          if (item.children && item.children.length) {
            recursion(item.children)
          }
        }
      }
      if (models && models.length) {
        recursion(models)
      }

      if (locateArr.length) {
        locateArr = await this.searchModelsPosition(locateArr)
        // locateArr = await this.searchModelsProprties(locateArr)
      }
      for (const { file_type, personal_assets, public_assets } of assets || []) {
        const assetsArr = [...(personal_assets || []), ...(public_assets || [])]
        switch (file_type) {
          case '影像':
            for (let { asset_id, file_path, process_path, scope_type, name } of assetsArr) {
              // file_type === 1
              if (!this.imageriesCheckedKeys.includes(asset_id)) continue
              if (this.findIsExist(layer.Imageries, asset_id)) continue
              const imageries = {
                name,
                // url: scope_type == 1 ? file_path : `paas-storage/${this.appId}/${asset_id}/${asset_id}/tms.xml`,
                url: process_path,
                id: asset_id,
                is_visible: 1,
                scope_type
              }
              layer.Imageries.push(imageries)
              addLayerParams.Imageries.push(imageries)
              isUpdate = true
              isUpdateAssets = true
            }
            break
          case '地形':
            if (this.terrainsCheckedKeys.length) {
              for (let { asset_id, file_path, scope_type, process_path, name } of assetsArr) {
                // file_type === 2
                if (!this.terrainsCheckedKeys.includes(asset_id)) continue
                if (this.findIsExist(layer.Terrains, asset_id)) continue
                const terrains = {
                  name,
                  // url: scope_type == 1 ? file_path : `paas-storage/${this.appId}/${asset_id}/`,
                  url: process_path,
                  id: asset_id,
                  is_visible: 1,
                  scope_type
                }

                if (layer.Terrains.length) {
                  terrainDisableIds = layer.Terrains.map(i => i.id)
                }
                layer.Terrains = [terrains]
                addLayerParams.Terrains.push(terrains)
                isUpdate = true
                isUpdateAssets = true
              }
            } else {
              if (layer.Terrains.length) {
                terrainDisableIds = layer.Terrains.map(i => i.id)
              }
              if (terrainDisableIds.length) {
                layer.Terrains = []
                isUpdate = true
                isUpdateAssets = true
              }
            }
            break
          case '倾斜摄影模型':
            for (let { asset_id, file_path, process_path, scope_type, name } of assetsArr) {
              // file_type === 4
              if (!this.threeDTilesCheckedKeys.includes(asset_id)) continue
              if (this.findIsExist(layer.ThreeDTiles, asset_id)) continue
              const threeDTiles = {
                name,
                url: process_path, //scope_type == 1 ? file_path : `paas-storage/${this.appId}/${asset_id}/${asset_id}_tiles/tileset.json`,
                type: 1,
                id: asset_id,
                is_visible: 1,
                scope_type
              }
              layer.ThreeDTiles.push(threeDTiles)
              addLayerParams.ThreeDTiles.push(threeDTiles)
              isUpdate = true
              isUpdateAssets = true
            }
            break
        }
      }

      if (isUpdate) {
        // 更新图层
        const layerParams = {
          imageries: layer.Imageries,
          terrains: layer.Terrains,
          three_d_tiles: layer.ThreeDTiles
        }
        if (isUpdateAssets) {
          removeLayer(this.app.viewer, terrainDisableIds)
          addLayer(this.app.viewer, addLayerParams, this.addTilesetCallback.bind(this))
          this.app.execute('update_layer', layer)
          this.app.execute('add_message', { content: loadLayerSuccess })
        }
        this.$store.commit('updateLayer', { layerParams, layer })
        if (locateArr.length > 0) {
          const defaultModelPosition = []
          const handleModelPosition = []
          for (const item of locateArr) {
            if (typeof item.x === 'undefined' && typeof item.y === 'undefined') {
              handleModelPosition.push(item)
            } else {
              defaultModelPosition.push(item)
            }
          }
          if (handleModelPosition.length) {
            window.app.mainWindow.panelManager.panels.get('DX_MODEL_POSITION_PANEL').setXY(this.panelPosition.left, this.panelPosition.top)
            this.app.execute('DX_COMMAND_SHOW_MODEL_POSITION', {
              toggled: true,
              locateArr: handleModelPosition,
              defaultArr: defaultModelPosition
            })
          } else {
            this.$refs.modelPosition.confirm(defaultModelPosition)
          }
        }
      }
      this.cancelLoadFile()
    },

    addTilesetCallback(type, tilesets, index) {
      if (!tilesets || type !== CIM_ASSET_TYPE.TILES) return
      if (tilesets.length - 1 === index) {
        this.locateLayer(tilesets)
      }
    },
    locateLayer(layers) {
      if (!layers || layers.length === 0) return
      let params
      if (layers.length > 1) {
        params = layers.map(l => l.id)
      } else {
        params = layers[0].id
      }
      this.app.viewer.gotoLayer(params)
    },

    _getModelHeight(id) {
      getSceneModelHeight(id).then(data => {
        if (data && data.list) {
          this.modelHeightList = data.list
        }
      })
    },

    _getBacklineData(id) {
      // 没有红线属性暂时注释
      // getBackLineResult(id).then(data => {
      //   this.backlineList = data || []
      // })
    },

    _initBackLine() {
      if (this.backlineList && this.backlineList.length > 0) {
        this.app.execute(commands.initBackLine, this.backlineList)
      }
    },
    _buildingHeightQuery() {
      if (this.modelHeightList && this.modelHeightList.length > 0) {
        const modelHeightParam = []
        this.modelHeightList.map(item => {
          const param = {
            layer_name: item.name,
            building_name: item.building_name,
            height: item.height
          }
          modelHeightParam.push(param)
        })
        this.app.execute(commands.buildingHeightQuery, modelHeightParam)
      }
    },

    findIsExist(arr, id) {
      return (arr || []).findIndex(i => i.id === id) !== -1
    },

    cancelLoadFile() {
      this.showLoad = false
      this.toolbarActiveId = ''
      this.isLoading = false
    },

    saveScene() {
      if (this.saveSceneLoading) return
      this.$store.commit(GET_REDLINES, red_lines => {
        this.saveSceneLoading = true
        let response = this.$store.dispatch('saveScene', {
          red_lines,
          scene_id: this.sceneId,
          app_id: this.appId
        })
        response.then(success => {
          this.toolbarActiveId = ''
          setTimeout(() => {
            this.saveSceneLoading = false
          }, 2000)
        })
      })
      // this.app.viewer.saveScene()
    },

    saveAsScene() {
      if (this.saveAsSceneLoading) return
      if (!this.saveAsSceneName.trim()) {
        return this.$message.warn(this.$t('scene.sceneNotEmpty'))
      }
      this.$store.commit(GET_REDLINES, red_lines => {
        this.saveAsSceneLoading = true
        let response = this.$store.dispatch('saveAsScene', {
          red_lines,
          scene_id: this.sceneId,
          scene_name: this.saveAsSceneName,
          project_id: this.projectId,
          app_id: this.appId
        })
        response.then(success => {
          if (success) {
            this.cancelSaveAsScene()
          }
          this.saveAsSceneLoading = false
        })
      })
    },

    cancelSaveAsScene() {
      this.showSave = false
      this.toolbarActiveId = ''
      this.saveAsSceneName = ''
    },

    saveAsSceneChange(e) {
      this.saveAsSceneName = inputLimit(this.saveAsSceneName)
    },

    onModelsCheck(checkedKeys) {
      this.modelsCheckedKeys = checkedKeys
    },

    onImageriesCheck(checkedKeys) {
      this.imageriesCheckedKeys = checkedKeys
    },

    onTerrainsCheck(checkedKeys) {
      if (checkedKeys?.length > 1) {
        checkedKeys.splice(checkedKeys.indexOf(this.terrainsCheckedKeys[0]), 1)
      }
      this.terrainsCheckedKeys = checkedKeys
    },

    onThreeDTilesCheck(checkedKeys) {
      this.threeDTilesCheckedKeys = checkedKeys
    },

    uninstall() {
      new Promise((resolve, reject) => {
        this.app.viewer.emit(DX.Events.REMOVE_SELECTED_TREENODE)
        resolve()
      }).then(() => {
        this.toolbarActiveId = ''
      })
    },

    uninstallLayer() {
      // const { layer } = this.getStore().sceneSource
      // const params = layer.ThreeDTiles.filter(i => i.name === (this.selectedLayer.layer_name || this.selectedLayer.name))
      // layer.ThreeDTiles = layer.ThreeDTiles.filter(i => i.name !== (this.selectedLayer.layer_name || this.selectedLayer.name))
      // const layerParams = {
      //     imageries: layer.Imageries,
      //     terrains: layer.Terrains,
      //     three_d_tiles: layer.ThreeDTiles
      // }

      // // this.app.viewer.updateScene(layer)
      // this.app.viewer.removeLayer({ ThreeDTiles: params })
      // this.app.execute('update_layer', layer)
      // this.$store.commit('updateLayer', { layerParams, layer })

      // this.selectedLayer = null
      // this.toolbarRight[1].disabled = true

      if (!this.selectedLayer) return
      const { layer } = this.getStore().sceneSource

      Object.keys(layer).forEach(key => {
        if (Array.isArray(layer[key])) {
          layer[key] = layer[key].filter(item => item.id != this.selectedLayer.id)
        }
      })

      this.app.viewer.removeLayer(this.selectedLayer.id)
      const layerParams = {
        imageries: layer.Imageries,
        terrains: layer.Terrains,
        three_d_tiles: layer.ThreeDTiles
      }
      this.$store.commit('updateLayer', { layerParams, layer })
      this.selectedLayer = null
      this.toolbarRight[1].disabled = true

      this.app.viewer.emit(DX.Events.LAYERS_EVENT, layer)
    },

    sceneLoaded(app) {
      this.setInitData2Viewer(100, app)
    },

    addListener(viewer) {
      // this.listenerFns.setInitData2Viewer = (progress) => this.setInitData2Viewer(progress, this.app)
      this.listenerFns.closeOperationTip = () => this.handleToolbarStatus(true)
      this.listenerFns.clearViewpoints = () => this.clearViewpoints(this.app)
      this.listenerFns.createViewpoint = viewpoint => this.createViewpoint(this.app, viewpoint)
      this.listenerFns.setDefaultViewpoint = viewpoint => this.setDefaultViewpoint(this.app, viewpoint)
      this.listenerFns.cancelDefaultViewpoint = viewpoint => this.cancelDefaultViewpoint(this.app, viewpoint)
      this.listenerFns.deleteViewpoint = viewpoint => this.deleteViewpoint(this.app, viewpoint)
      this.listenerFns.getConfig = setting => this.getConfig(setting)
      this.listenerFns.modelSelected = model => this.modelSelected(model)
      this.listenerFns.editModel = position => this.editModel(position)
      this.listenerFns.deleteLayer = params => this.deleteLayer(params)
      this.listenerFns.visibleLayer = params => this.visibleLayer(params)
      this.listenerFns.moveLayer = params => this.sortLayer(params, this.app)
      this.listenerFns.selectLayer = params => this.selectLayer(params)
      this.listenerFns.saveSceneEvent = params => this.saveSceneEvent(params)
      this.listenerFns.updateLayer = params => this.updateLayer(params, this.app)
      this.listenerFns.checkIsHasPosition = data => this.checkIsHasPosition(data, this.app)
      this.listenerFns.getConfiguration = data => this.getConfiguration(data, this.app)

      this.listenerFns.addDrawFeature = data => this.addDrawFeature(data, this.app)
      this.listenerFns.removeDrawFeature = data => this.removeDrawFeature(data, this.app)

      this.listenerFns.handleModelSelect = data => this.handleModelSelect(data, this.app)
      this.listenerFns.changeWeather = data => this.changeWeather(data, this.app)
      this.listenerFns.changeTerrainFlattenings = data => this.changeTerrainFlattenings(data, this.app)
      this.listenerFns.changeTerrainExcavation = data => this.changeTerrainExcavation(data, this.app)
      this.listenerFns.changePathRoaming = data => this.changePathRoaming(data, this.app)
      this.listenerFns.handleDBClickLayer = data => this.handleDBClickLayer(data, this.app)
      this.listenerFns.cimAnalysisStatueChanged = data => this.cimAnalysisStatueChanged(data)

      const Events = window.DX.Events
      // viewer.on(Events.PROGRESS_CHANGE, this.listenerFns.setInitData2Viewer)
      viewer.on(Events.CLOSE_OPERATION_TIP, this.listenerFns.closeOperationTip)
      viewer.on(Events.CLEAR_VIEWPOINT_LIST, this.listenerFns.clearViewpoints)
      viewer.on(Events.CREATE_VIEWPOINT, this.listenerFns.createViewpoint)
      viewer.on(Events.SET_DEFAULT_VIEWPOINT, this.listenerFns.setDefaultViewpoint)
      viewer.on(Events.CANCEL_DEFAULT_VIEWPOINT, this.listenerFns.cancelDefaultViewpoint)
      viewer.on(Events.DELETE_VIEWPOINT, this.listenerFns.deleteViewpoint)
      viewer.on(Events.GET_CONFIGURATION, this.listenerFns.getConfig)
      viewer.on(Events.LAYER_POSITION_EVENT, this.listenerFns.modelSelected)
      viewer.on(Events.UPDATE_EDIT_MODEL, this.listenerFns.editModel)
      viewer.on(Events.DELETE_LAYER, this.listenerFns.deleteLayer)
      viewer.on(Events.VISIBLE_LAYER, this.listenerFns.visibleLayer)
      viewer.on(Events.MOVE_LAYER, this.listenerFns.moveLayer)
      viewer.on(Events.SELECT_LAYER, this.listenerFns.selectLayer)
      viewer.on(Events.SCENE_SAVE_EVENT, this.listenerFns.saveSceneEvent)
      viewer.on(Events.LAYERS_EVENT, this.listenerFns.updateLayer)
      viewer.on(Events.CHECK_IS_HAS_POSITION, this.listenerFns.checkIsHasPosition)
      viewer.on(Events.GET_CONFIGURATION, this.listenerFns.getConfiguration)
      viewer.on(Events.MODEL_SELECTED, this.listenerFns.handleModelSelect)
      viewer.on(Events.DBCLICK_LAYER, this.listenerFns.handleDBClickLayer)

      viewer.on(Events.ADD_DRAE_FEATURE, this.listenerFns.addDrawFeature)
      viewer.on(Events.REMOVE_DRAE_FEATURES, this.listenerFns.removeDrawFeature)

      viewer.on(Events.CHANGE_WEATHER, this.listenerFns.changeWeather)
      viewer.on(Events.CHANGE_TERRAIN_FLATTEN, this.listenerFns.changeTerrainFlattenings)
      viewer.on(Events.CHANGE_TERRAIN_EXCAVATION, this.listenerFns.changeTerrainExcavation)
      viewer.on(Events.CHANGE_PATH_ROAMING, this.listenerFns.changePathRoaming)
      viewer.on(Events.CIM_ANALYSIS_STATE_CHANGED, this.listenerFns.cimAnalysisStatueChanged)

      // panel关闭事件
      this.onPanelsVisibleChange(this.app)
      this.onSettingVisibleChange(this.app)
      this.onSecondToolbarPanelDrag(this.app)

      this.initSettingPanel()
      // viewer.app.execute(DX.Commands.DX_COMMAND_OBSERVE_MODE, 0)
    },
    removeListener(viewer) {
      const Events = window.DX.Events

      if (!viewer) return
      // viewer.off(Events.PROGRESS_CHANGE, this.listenerFns.setInitData2Viewer)
      viewer.off(Events.CLOSE_OPERATION_TIP, this.listenerFns.closeOperationTip)
      viewer.off(Events.CLEAR_VIEWPOINT_LIST, this.listenerFns.clearViewpoints)
      viewer.off(Events.CREATE_VIEWPOINT, this.listenerFns.createViewpoint)
      viewer.off(Events.SET_DEFAULT_VIEWPOINT, this.listenerFns.setDefaultViewpoint)
      viewer.off(Events.CANCEL_DEFAULT_VIEWPOINT, this.listenerFns.cancelDefaultViewpoint)
      viewer.off(Events.DELETE_VIEWPOINT, this.listenerFns.deleteViewpoint)
      viewer.off(Events.GET_CONFIGURATION, this.listenerFns.getConfig)
      viewer.off(Events.LAYER_POSITION_EVENT, this.listenerFns.modelSelected)
      viewer.off(Events.UPDATE_EDIT_MODEL, this.listenerFns.editModel)
      viewer.off(Events.DELETE_LAYER, this.listenerFns.deleteLayer)
      viewer.off(Events.VISIBLE_LAYER, this.listenerFns.visibleLayer)
      viewer.off(Events.MOVE_LAYER, this.listenerFns.moveLayer)
      viewer.off(Events.SELECT_LAYER, this.listenerFns.selectLayer)
      viewer.off(Events.LAYERS_EVENT, this.listenerFns.updateLayer)
      viewer.off(Events.SCENE_SAVE_EVENT, this.listenerFns.saveSceneEvent)
      viewer.off(Events.CHECK_IS_HAS_POSITION, this.listenerFns.checkIsHasPosition)

      viewer.off(Events.CHANGE_WEATHER, this.listenerFns.changeWeather)
      viewer.off(Events.CHANGE_TERRAIN_FLATTEN, this.listenerFns.changeTerrainFlattenings)
      viewer.off(Events.CHANGE_TERRAIN_EXCAVATION, this.listenerFns.changeTerrainExcavation)
      viewer.off(Events.DBCLICK_LAYER, this.listenerFns.handleDBClickLayer)
      viewer.off(Events.CIM_ANALYSIS_STATE_CHANGED, this.listenerFns.cimAnalysisStatueChanged)
      this.offPanelsVisibleChange(this.app)
      this.offSettingVisibleChange(this.app)
      this.offSecondToolbarPanelDrag(this.app)
      this.listenerFns = {}
    },
    filterUnvisibleToolbar(arr) {
      return arr.filter(item => !item.hidden)
    },
    domResize() {
      // 面板位置= 二级 + 24px
      // 侧边栏一级 = 5.75rem
      // 侧边栏二级 = 3rem
      // toolbar 一级侧边栏
      // 获取一级侧边栏宽度
      let toolbarDomStyle = {}
      toolbarDomStyle = this.$refs.toolbar.$el.getBoundingClientRect()
      const { width: firstToolbarWidth } = toolbarDomStyle
      this.secondToolbarWidth = (3 / 5.75) * firstToolbarWidth
      const left = this.secondToolbarWidth + 24
      this.panelPosition = {
        left: left,
        top: 24
      }
    }
  }
}
