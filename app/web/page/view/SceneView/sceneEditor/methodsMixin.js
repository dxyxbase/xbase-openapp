/* eslint-disable */
import { setTopPanelIds, compassPanelId, locationAddedSuccess, panelIds, limitedSecondToolbarPanelIds, zoomPanelId } from './constant'
import { GET_REDLINES } from '@/store/actions-types'
import { handleLayer, getLayerEnum } from '@/utils/scene'
import { getPoint, getLine, getPolygon, getBodys, setPoint, setPolyline, setPolygon, setBody } from '@/utils/editFormat'
import { CimEngines } from '@/utils/const'
import cloneDeep from 'lodash.clonedeep'
import { getTerrainLayerJson, isCesium } from '@/utils/layerManager'
import { getTerrainJson } from '@/api/map'
import { menuPanels } from './menuPanels'

const DragRestrictionsHeight = 0
export default {
  methods: {
    getPanel(app, panelId) {
      return app.mainWindow.panelManager.panels.get(panelId)
    },
    setPanelsPosition(app) {
      for (let id of setTopPanelIds) {
        this.getPanel(app, id)?.element.setTop('86px')
      }
    },
    checkIsHasPosition(filename, app) {
      const { models } = this.getStore().sceneSource
      const model = models.find(i => i.file_name === filename)
      if (!model) return this.updateIsHasPosition(app, false)
      this._getModelProperty(model.render_path, 0, -1, ['定位点'], ['or']).then(props => {
        if (props?.count) this.updateIsHasPosition(app, true)
        else this.updateIsHasPosition(app, false)
      })
    },
    updateIsHasPosition(app, isExist) {
      app.execute('DX_COMMAND_UPDATE_IS_HAS_POSITION', { isExist })
    },
    deleteLayer({ uid }) {
      const { layer } = this.getStore().sceneSource
      let deleteSource = data => {
        for (let key in data) {
          if (key === 'Name') continue
          if (Array.isArray(data[key])) {
            data[key] = data[key].filter(item => item.id !== uid)
          } else if (typeof data[key] === 'object') {
            deleteSource(data[key])
          }
        }
      }
      deleteSource(layer)
      this.getLayer(layer, true)
      if (this.selectedLayer?.id === uid) {
        this.modelSelected()
      }

      // 移除绘制
      let drawData = this.getStore().drawData
      if (!drawData) return

      Object.keys(drawData).forEach(key => {
        if (!drawData[key]) return
        drawData[key] = drawData[key].filter(item => item.id != uid)
      })

      this.$store.commit('updateSceneDrawData', drawData)
    },

    visibleLayer({ uid, checked }) {
      const { layer } = this.getStore().sceneSource
      let visibleSource = data => {
        for (let key in data) {
          if (typeof key === 'Name') continue
          if (Array.isArray(data[key])) {
            let index = data[key].findIndex(item => item.id === uid)
            if (data[key][index]) {
              data[key][index].is_visible = checked ? 1 : 0
              break
            }
          } else if (typeof data[key] === 'object') {
            visibleSource(data[key])
          }
        }
      }
      visibleSource(layer)
      this.getLayer(layer, true)

      // 修改绘制visible状态
      let drawData = this.getStore().drawData
      if (!drawData) return

      Object.keys(drawData).forEach(key => {
        if (!drawData[key]) return
        drawData[key].forEach(item => {
          if (item.id == uid) {
            item.is_visible = checked ? 1 : 0
          }
        })
      })
      this.$store.commit('updateSceneDrawData', drawData)
    },

    handleDBClickLayer(uid, app) {
      if (!isCesium(app.viewer)) return
      // 地形定位
      const { layer } = this.getStore().sceneSource

      if (layer && layer.Terrains) {
        // 定位地形
        let item = layer.Terrains.find(item => item.id == uid)
        if (item) {
          let { url } = item
          let tmpUrl = getTerrainLayerJson(url, app.viewer)

          getTerrainJson(tmpUrl).then(res => {
            if (res) {
              let { bounds } = res
              app.viewer.flyTo({
                destination: Cesium.Rectangle.fromDegrees(...bounds)
              })
            }
          })
        }
      }
    },
    sortLayer(params, app) {
      const engine = app.viewer.engineType
      if (CimEngines.includes(engine)) {
        if (params && params.length == 2) {
          let layerId = params[1].assetId
          let beforeId = params[0].assetId
          if (engine == 'cesium') {
            // console.log(layerId,beforeId)
            this.app.getViewer().moveLayer(layerId, beforeId)
          } else {
            const type = getLayerEnum(params[0].type)
            this.app.getViewer().moveLayer(layerId, beforeId, type)
          }
        }
      }
      _.debounce(this.moveLayer, 1000)(params)
    },

    // 图层排序
    moveLayer(params) {
      const layerIds = [params[0].id, params[1].id]
      const { layer } = this.getStore().sceneSource
      let pre = { key: null, data: null, i: null }
      let next = { key: null, data: null, i: null }
      for (let key in layer) {
        const target = layer[key]
        if (!target || typeof target === 'string') continue
        let isBreak = false
        for (let i = 0, len = target.length; i < len; i++) {
          if (!layerIds.includes(target[i].id)) continue
          if (!pre.key) {
            pre = { key, data: target[i], i }
            continue
          }
          if (!next.key) {
            next = { key, data: target[i], i }
            isBreak = true
            break
          }
        }
        if (isBreak) break
      }
      if (pre.key && next.key && pre.key === next.key) {
        layer[pre.key][pre.i] = next.data
        layer[next.key][next.i] = pre.data
        this.getLayer(layer)
      }
    },
    selectLayer(id) {
      let layer = this.getStore().sceneSource.layer
      Object.keys(layer).forEach(key => {
        if (Array.isArray(layer[key])) {
          let item = layer[key].find(item => item.id == id)
          if (item) {
            this.modelSelected(item)
          }
        }
      })
      // this.modelSelected(this.getStore().sceneSource.layer.ThreeDTiles.find(item => item.assetId === id))
    },
    saveSceneEvent(status) {
      if (status) {
        this.$store.commit(GET_REDLINES, red_lines => {
          this.$store.dispatch('saveScene', { red_lines, scene_id: this.sceneId, project_id: this.projectId })
        })
      } else {
        this.$store.dispatch('saveFailed')
      }
    },
    addPanelToggledListener(app) {
      const loopArr = [
        ['toolbarPanels', 'toolbarActiveId'],
        ['secondToolbarPanels', 'secondToolbarActiveId']
      ]

      for (let [panelId, toolbarId] of loopArr) {
        for (let item of Object.entries(panelIds[panelId])) {
          const panel = this.getPanel(app, item[0])
          if (!panel) continue
          panel.on(window.DX.Events.PANEL_VISIBLE_CHANGE, visible => {
            if (!visible && item[1] === this[toolbarId]) this[toolbarId] = ''
            // console.log(visible, item[0], item[1], this[toolbarId])
          })
        }
      }
    },
    setInitData2Viewer(progress, app) {
      if (progress < 100) return
      if (!app) return
      const {
        // layer,
        configs: { observation_mode },
        preset_positions
      } = this.getStore().sceneSource

      // const params = {
      //     Imageries: layer.Imageries || [],
      //     Terrains: layer.Terrains || [],
      //     ThreeDTiles: layer.ThreeDTiles || []
      // }

      // 初始化数据 设置、预设位置， 图层暂时通过rs获取
      app.execute('set_observe_mode', '' + observation_mode)
      app.execute('update_viewpoint_list', preset_positions)
      app.execute('goto_default_viewpoint')

      // app.execute('update_layer', params)
      // app.viewer.updateScene(params)

      this.setPanelsPosition(app)
      this.addPanelToggledListener(app)
      this.handleToolbarStatus(window.localStorage.getItem('DX_STATE_IS_SHOW_OPERATION_TIP_NEXT_TIME') === 'false')
    },
    updateLayer(layer, app) {
      const cloneLayer = _.cloneDeep(layer)
      const { deletedLayer } = this.getStore().sceneData
      let isUpdate = false
      let params = {
        Name: cloneLayer.Name
      }
      let nextParams = {
        Name: cloneLayer.Name
      }
      for (let key in cloneLayer) {
        if (['Imageries', 'Terrains', 'ThreeDTiles'].includes(key)) {
          const { nextLayer, deletedArr } = handleLayer(cloneLayer[key], deletedLayer[key])
          nextParams[key] = nextLayer
          if (deletedArr && deletedArr.length) {
            params[key] = deletedArr
            isUpdate = true
          }
        }
      }

      if (isUpdate) {
        setTimeout(() => {
          app.execute('update_layer', nextParams)
          app.viewer.removeLayer(params)
        }, 500)
      }
    },
    clearViewpoints(app) {
      this.$store.commit('clearViewpoints')
      app.execute('update_viewpoint_list', [])
    },
    createViewpoint(app, viewpoint) {
      //创建视点
      const newViewpoint = {
        longitude: viewpoint.longitude,
        is_default: viewpoint.is_default || 0,
        cover: viewpoint.img,
        height: viewpoint.height,
        yaw_angle: viewpoint.heading,
        scene_id: this.sceneId,
        pitch_angle: viewpoint.pitch,
        name: viewpoint.name,
        latitude: viewpoint.latitude,
        distance: viewpoint.range,
        img_path: '',
        roll: viewpoint.roll || 0,
        distance: 0
      }
      this.$store.dispatch('createViewpoint', newViewpoint).then(data => {
        app.execute('add_message', { id: 'createViewpointSuccess', content: locationAddedSuccess })
        app.execute('update_viewpoint_list', data)
      })
    },
    setDefaultViewpoint(app, viewpoint) {
      this.$store.dispatch('setDefaultViewpoint', viewpoint).then(data => app.execute('update_viewpoint_list', data))
    },
    cancelDefaultViewpoint(app, viewpoint) {
      this.$store.dispatch('cancelDefaultViewpoint', viewpoint).then(data => app.execute('update_viewpoint_list', data))
    },
    deleteViewpoint(app, viewpoint) {
      this.$store.dispatch('deleteViewpoint', viewpoint).then(data => app.execute('update_viewpoint_list', data))
    },
    getConfig(setting) {
      this.$store.dispatch('setSetting', setting)
    },
    modelSelected(data) {
      if (data) {
        this.selectedLayer = data
        this.toolbarRight[1].disabled = false
      } else {
        this.selectedLayer = null
        this.toolbarRight[1].disabled = true
      }
    },

    getModelType(id) {
      const models = this.getStore().sceneSource?.layer?.ThreeDTiles
      if (!models) return
      let model = models.find(item => item.id == id)
      if (model) return model.type
    },
    editModel(position) {
      if (!position) return
      let { height, id, latitude, longitude, pitch, roll, heading, relativeHeight } = position
      const {
        sceneSource: { models },
        nextSceneSource: { model_positions }
      } = this.getStore()

      let tmpModelPostions = cloneDeep(model_positions)
      if (!tmpModelPostions) tmpModelPostions = []
      let index = tmpModelPostions.findIndex(item => item.file_id == id)

      let modelType = this.getModelType(id)
      if (!modelType) return
      let updateItem = {
        type: modelType,
        file_id: id,
        longitude: +longitude.toFixed(6),
        latitude: +latitude.toFixed(6),
        height: +height.toFixed(2),
        azimuth: heading,
        pitch_angle: pitch,
        roll_angle: roll,
        elevation: relativeHeight
      }
      if (index > -1) {
        tmpModelPostions.splice(index, 1)
      }
      tmpModelPostions.push(updateItem)

      this.$store.commit('updateModelPosition', tmpModelPostions)
    },

    //排序会走这
    getLayer(initLayer, isFromCimRs = false) {
      let { Imageries, Terrains, ThreeDTiles } = initLayer
      const layer = {
        Imageries,
        Terrains,
        ThreeDTiles
      }
      const layerParams = {
        imageries: Imageries,
        terrains: Terrains,
        three_d_tiles: ThreeDTiles
      }
      // console.log(initLayer,layerParams, layer)
      // if (!isFromCimRs) this.app.viewer.updateScene(layer)
      this.$store.commit('updateLayer', { layerParams, layer })
    },

    getConfiguration(data, app) {
      //  'observation_mode':'observeMode'
      this.settingConfig = data
    },
    setSecondMenuActiveId() {
      if (!this.app) return

      let menuItem = menuPanels.find(item =>
        item.panels.some(name => {
          let panel = this.app.mainWindow.panelManager.get(name)
          let res = panel && panel.visibled
          if (item.checkFiled) {
            res = res && item.checkFiled(panel)
          }
          return res
        })
      )

      this.secondToolbarActiveId = menuItem && menuItem.id
    },
    panelsVisibleChange(visible) {
      this.setSecondMenuActiveId()
      if (!visible) {
        let menuNames = ['draw', 'analysis', 'terrainEdit', 'roaming']
        if (menuNames.includes(this.toolbarActiveId)) return

        this.toolbarActiveId = ''
      }
    },

    offPanelsVisibleChange(app) {
      let panels = app.mainWindow.panelManager.panels
      panels.forEach(panel => {
        panel.off(DX.Events.PANEL_VISIBLE_CHANGED, this.panelsVisibleChange)
      })
    },

    onPanelsVisibleChange(app) {
      let panels = app.mainWindow.panelManager.panels
      panels.forEach(panel => {
        panel.on(DX.Events.PANEL_VISIBLE_CHANGED, this.panelsVisibleChange)
      })
    },

    initSettingPanel() {
      this.settingConfig = this.getStore().sceneSource.configs
      this.app.execute(DX.Commands.OBSERVE_MODE, '' + this.settingConfig.observation_mode)
    },

    settingVisibleChange(visible) {
      if (this.settingConfig) {
        let { observation_mode } = this.settingConfig
        this.app.execute(DX.Commands.OBSERVE_MODE, '' + observation_mode)
      }
    },

    saveConfig(config) {
      if (!this.settingConfig) return

      this.settingConfig.observation_mode = +config.observeMode
    },
    reSetConfig(config) {
      if (!this.settingConfig) return

      this.settingConfig.observation_mode = +config.observeMode
    },

    onSettingVisibleChange(app) {
      let settingPanel = this.getSettingPanel(app)
      if (settingPanel) {
        settingPanel.on(DX.Events.PANEL_VISIBLE_CHANGE, this.settingVisibleChange)

        app.viewer.on(DX.Events.GET_CONFIGURATION, this.saveConfig)
        app.viewer.on(DX.Events.RESET_CONFIGURATION, this.reSetConfig)
      }
    },
    offSettingVisibleChange(app) {
      let settingPanel = this.getSettingPanel(app)
      if (settingPanel) {
        settingPanel.off(DX.Events.PANEL_VISIBLE_CHANGE, this.settingVisibleChange)
        app.viewer.off(DX.Events.GET_CONFIGURATION, this.saveConfig)
        app.viewer.off(DX.Events.RESET_CONFIGURATION, this.reSetConfig)
      }
    },

    onSecondToolbarPanelDrag(app) {
      limitedSecondToolbarPanelIds.forEach(id => {
        let panel = this.getPanel(app, id)
        panel && panel.setXY(this.panelPosition.left, this.panelPosition.top)
        panel && panel.on(DX.Events.PANEL_POSITION_CHANGED, this.handelDragRestrictions)
      })
    },

    offSecondToolbarPanelDrag(app) {
      limitedSecondToolbarPanelIds.forEach(id => {
        let panel = this.getPanel(app, id)
        panel && panel.off(DX.Events.PANEL_POSITION_CHANGED, this.handelDragRestrictions)
      })
    },

    handelDragRestrictions(panels, data) {
      // 二级工具栏展开时，拖拽限制
      data.y < DragRestrictionsHeight && panels.element.setTop(DragRestrictionsHeight)
      data.x < this.secondToolbarWidth && panels.element.setLeft(this.secondToolbarWidth)
    },

    getSettingPanel(app) {
      let panels = app.mainWindow.panelManager.panels
      let settingPanel = panels.get('DX_PANEL_SETTING')
      return settingPanel
    },
    hidePanels(panelList, app) {
      let panels = app.mainWindow.panelManager.panels
      panels.forEach(function (panel, key) {
        if (panelList.includes(key)) {
          panel.visibled = false
        }
      })
    },

    addDrawFeature(feature, app) {
      let visible = 1

      let addFeature = (list, point) => {
        let index = list.findIndex(item => item.id == point.id)
        if (index > -1) {
          let { is_visible } = list[index]
          visible = is_visible
          list[index] = point
          list[index]['is_visible'] = is_visible
        } else {
          point.create_time = Date.now()
          point['is_visible'] = 1
          list.unshift(point)
        }

        return list
      }

      let drawData = this.getStore().drawData
      let { bodys, flats, lines, points } = drawData

      let { type, data } = feature

      switch (type) {
        case DX.DrawTypes.POINT:
          if (!points) {
            points = []
          }
          let point = getPoint(data)
          drawData.points = addFeature(points, point)
          break

        case DX.DrawTypes.LINE:
          if (!lines) {
            lines = []
          }
          let line = getLine(data)
          drawData.lines = addFeature(lines, line)
          break

        case DX.DrawTypes.POLYGON_FACE:
          if (!flats) {
            flats = []
          }
          let polygon = getPolygon(data)
          drawData.flats = addFeature(flats, polygon)
          break

        case DX.DrawTypes.VOXEL:
          if (!bodys) {
            bodys = []
          }
          let body = getBodys(data)
          drawData.bodys = addFeature(bodys, body)
          break
      }
      this.$store.commit('updateSceneDrawData', drawData)

      if (!visible) {
        this.app.execute('DX_COMMAND_TOGGLE_SHAPE_COMMAND', { id: data.id, visible: visible })
      }
    },

    removeDrawFeature(data, app) {
      let { type, ids } = data
      let drawData = this.getStore().drawData
      let { bodys, flats, lines, points } = drawData
      switch (type) {
        case DX.DrawTypes.POINT:
          points = points.filter(item => !ids.includes(item.id))
          drawData.points = points
          break

        case DX.DrawTypes.LINE:
          lines = lines.filter(item => !ids.includes(item.id))
          drawData.lines = lines
          break

        case DX.DrawTypes.POLYGON_FACE:
          flats = flats.filter(item => !ids.includes(item.id))
          drawData.flats = flats
          break

        case DX.DrawTypes.VOXEL:
          bodys = bodys.filter(item => !ids.includes(item.id))
          drawData.bodys = bodys
          break
      }
      this.$store.commit('updateSceneDrawData', drawData)
    },

    changeWeather(data) {
      this.$store.commit('updateSceneWeather', data)
    },

    changeTerrainFlattenings(data) {
      this.$store.commit('updateTerrainFlattenings', data)
    },

    changeTerrainExcavation(data) {
      this.$store.commit('updateTerrainExcavation', data)
    },

    changePathRoaming(data) {
      this.$store.commit('updatePathRoaming', data)
    },

    handleModelSelect(data, app) {
      if (data && data.id) {
        app.viewer.selectLayer([data.id])
        this.modelSelected(data)
      } else {
        app.viewer.selectLayer([])
        this.modelSelected()
      }
    },

    checkSceneChanged() {
      if (!this.app) return false
      const CHECK_MODULES = ['draw', 'editorModel', 'layer', 'viewpoint', 'weather', 'terrainFlatten', 'terrainExcavation']
      const modules = this.app.store.modules
      let flag = false
      Object.keys(modules).map(key => {
        if (CHECK_MODULES.includes(key)) {
          if (this.checkMap.get(key).call(this, key)) {
            flag = true
            if (flag) return
          }
        }
      })
      return flag
    },

    initCheckMap() {
      this.checkMap.set('draw', this.checkDraw)
      this.checkMap.set('editorModel', this.checkModel)
      this.checkMap.set('layer', this.checkLayer)
      this.checkMap.set('viewpoint', this.checkViewpoint)
      this.checkMap.set('setting', this.checkSetting)
      this.checkMap.set('weather', this.checkWeather)
      this.checkMap.set('terrainFlatten', this.checkTerrainFlatten)
      this.checkMap.set('terrainExcavation', this.checkTerrainExcavation)
    },

    checkWeather(key) {
      const { backupWeather } = this.getStore()
      const stateData = this.app.store.modules[key]?.state
      const keys = ['sunny', 'lightIntensity', 'rain', 'raindropSize', 'rainfallSpeed', 'snow', 'snowExtent', 'snowfallSpeed', 'snowflakeSize', 'wind', 'windIntensity', 'fog', 'fogNear', 'fogFar', 'isInitWeather']
      for (let key of keys) {
        if (backupWeather[key] !== stateData[key]) {
          return true
        }
      }
      return false
    },

    checkTerrainFlatten(key) {
      return this.checkTerrainEdit(key, 'backupTerrainFlatten')
    },

    checkTerrainExcavation(key) {
      return this.checkTerrainEdit(key, 'backupTerrainExcavation')
    },

    checkTerrainEdit(key, backupKey) {
      const { [backupKey]: backupData } = this.getStore()
      const stateData = this.app.store.modules[key]?.state.area

      if (stateData.length !== backupData.length) return true
      for (let i = 0; i < stateData.length; i++) {
        let data = backupData[i]
        for (let _key in data) {
          let value1 = backupData[i][_key]
          let value2 = stateData[i][_key]
          if (Array.isArray(value1)) {
            value1 = value1.toString()
            value2 = value2.toString()
          }
          if (_key !== 'checked' && value1 !== value2) {
            return true
          }
        }
      }
      return false
    },

    checkModel(key) {
      const { model_positions } = this.getStore().nextSceneSource
      return !!model_positions?.length
      // const { layer } = this.getStore().sceneSource
      // const stateData = this.app.store.modules[key]?.state
      // const {
      //   altitude, editLayer, heading, latitude, longitude, pitch, roll
      // } = stateData
      // const model = layer.ThreeDTiles.find(item => item.id === editLayer)
      // if (!model) return false
      // const { id, lon, lat, height, yaw } = model
      // if (lon !== Number(longitude) || lat !== Number(latitude) || height !== Number(altitude) || Number(heading) !== yaw || Number(pitch) !== model.pitch || Number(roll) !== model.roll) {
      //   return true
      // }
    },

    checkLayer(key) {
      const { layer } = this.getStore().sceneSource
      const backupSceneSource = this.getStore().backupSceneSource
      if (this.checkLayerSort(layer, backupSceneSource.layer)) return true
      const stateData = this.app.store.modules[key]?.state
      const { renderTreeData } = stateData
      let checkFlag = false
      const length = renderTreeData ? renderTreeData.length : 0
      for (let i = 0; i < length; i++) {
        let item = renderTreeData[i]
        if (item.rank === 2) {
          switch (item.type) {
            case 'I':
              checkFlag = this.checkLayerItem(layer.Imageries, item.children)
              break
            case 'T':
              checkFlag = this.checkLayerItem(layer.Terrains, item.children)
              break
            case '3D':
              checkFlag = this.checkLayerItem(
                layer.ThreeDTiles.filter(t => t.type !== 1),
                item.children
              )
              break
            case 'QX3D':
              checkFlag = this.checkLayerItem(
                layer.ThreeDTiles.filter(t => t.type === 1),
                item.children
              )
              break
          }
        }
        return checkFlag
      }
    },

    checkLayerSort(layer, subLayer) {
      const keys = ['Imageries', 'Terrains', 'ThreeDTiles']
      let flag = false
      keys.map(key => {
        if (JSON.stringify(layer[key]) !== JSON.stringify(subLayer[key])) {
          flag = true
          return
        }
      })
      return flag
    },

    checkLayerItem(originArr, compareArr) {
      if (!originArr || !compareArr) return true
      if (originArr.length !== compareArr.length) return true
      for (let i = 0; i < compareArr.length; i++) {
        if (originArr[i].id !== compareArr[i].id) {
          return true
        }
      }
    },

    checkViewpoint(key) {
      let { preset_positions } = this.getStore().backupSceneSource
      const stateData = this.app.store.modules[key]?.state
      let { viewpointList } = stateData
      viewpointList = viewpointList ? viewpointList : []
      preset_positions = preset_positions ? preset_positions : []

      if (preset_positions.length !== viewpointList.length) return true
      for (let i = 0; i < preset_positions.length; i++) {
        if (preset_positions[i].id !== viewpointList[i].id || preset_positions[i].is_default !== viewpointList[i].is_default) {
          return true
        }
      }
    },

    checkSetting(key) {
      const { configs } = this.getStore().sceneSource
      const stateData = this.app.store.modules[key]?.state

      if (configs.observation_mode !== Number(stateData.observeMode)) {
        return true
      }
    },

    checkDraw(key) {
      const { backupDrawData } = this.getStore()
      const drawData = this.initDrawData(backupDrawData)
      const stateData = this.app.store.modules[key]?.state
      const skdDrawData = stateData.drawData
      let flag = false
      const keysArr = {
        bodys: 'voxel',
        flats: 'polygonFace',
        points: 'point',
        lines: 'line'
      }

      if (drawData.bodys.length !== skdDrawData.voxel.length || drawData.flats.length !== skdDrawData.polygonFace.length || drawData.points.length !== skdDrawData.point.length || drawData.lines.length !== skdDrawData.line.length) {
        return true
      }
      Object.keys(drawData).map(key => {
        if (flag) return
        for (let i = 0; i < drawData[key].length && !flag; i++) {
          flag = this.checkDrawItem(key, drawData[key][i], skdDrawData[keysArr[key]][i])
        }
      })
      return flag
    },

    checkDrawItem(key, item, sdkItem) {
      let flag = false
      switch (key) {
        case 'points':
          item = setPoint(item)
          if (item.description !== sdkItem.description || item.infoType !== sdkItem.infoType || item.name !== sdkItem.name || item.color !== sdkItem.color || item.transparency !== sdkItem.transparency || item.coordinates.toString() !== sdkItem.coordinates.toString() || item.label !== sdkItem.label) {
            flag = true
          }
          break
        case 'lines':
          item = setPolyline(item)
          if (item.description !== sdkItem.description || item.infoType !== sdkItem.infoType || item.name !== sdkItem.name || item.lineColor !== sdkItem.lineColor || item.isClose !== sdkItem.isClose || item.coordinates.toString() !== sdkItem.coordinates.toString() || item.clampToGround !== sdkItem.clampToGround || item.width !== sdkItem.width || item.lineType.toString() !== sdkItem.lineType.toString()) {
            flag = true
          }
          break
        case 'flats':
          item = setPolygon(item)
          if (item.description !== sdkItem.description || item.infoType !== sdkItem.infoType || item.name !== sdkItem.name || item.color !== sdkItem.color || item.coordinates.toString() !== sdkItem.coordinates.toString() || item.clampToGround !== sdkItem.clampToGround || item.transparency !== sdkItem.transparency || item.elevation !== sdkItem.elevation) {
            flag = true
          }
          break
        case 'bodys':
          item = setBody(item)
          if (item.description !== sdkItem.description || item.infoType !== sdkItem.infoType || item.name !== sdkItem.name || item.color !== sdkItem.color || item.thikness !== sdkItem.thikness || item.coordinates.toString() !== sdkItem.coordinates.toString() || item.clampToGround !== sdkItem.clampToGround || item.transparency !== sdkItem.transparency || item.elevation !== sdkItem.elevation) {
            flag = true
          }
          break
      }
      return flag
    },

    initDrawData(data) {
      return {
        bodys: data.bodys || [],
        flats: data.flats || [],
        points: data.points || [],
        lines: data.lines || []
      }
    },
    cimAnalysisStatueChanged(data) {
      // 'start':开始分析，禁用菜单
      // 'complete':完成分析，开启菜单
      this.disableClick = data?.state == 'start'
    }
  }
}
