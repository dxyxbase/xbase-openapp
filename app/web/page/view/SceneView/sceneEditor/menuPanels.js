// 配置二级菜单，对应的panels，用于控制二级菜单的激活状态(在插件含有多个面板的时候)
export const menuPanels = [
  {
    id: 'point',
    name: '绘制点',
    panels: [
      "DX_PANEL_ADD_SHAPE", "DX_PANEL_EDIT_DRAW_OPTIONS"
    ],
    checkFiled: (panel) => {
      return panel.store.state.drawType.type == 'point'
    }
  },
  {
    id: 'line',
    name: '线',
    panels: [
      "DX_PANEL_ADD_SHAPE", "DX_PANEL_EDIT_DRAW_OPTIONS"
    ],
    checkFiled: (panel) => {
      return panel.store.state.drawType.type == 'line'
    }
  },
  {
    id: 'face',
    name: '面',
    panels: [
      "DX_PANEL_ADD_SHAPE", "DX_PANEL_EDIT_DRAW_OPTIONS"
    ],

    checkFiled: (panel) => {
      return panel.store.state.drawType.type == 'polygonFace'
    }

  },
  {
    id: 'body',
    name: '体',
    panels: [
      "DX_PANEL_ADD_SHAPE", "DX_PANEL_EDIT_DRAW_OPTIONS"
    ],
    checkFiled: (panel) => {
      return panel.store.state.drawType.type == 'voxel'
    }
  },
  {
    id: 'terrainExcavate',
    name: '地形开挖',
    panels: [
      "DX_PANEL_TERRAIN_EXCAVATION_SETTING", "DX_PANEL_TERRAIN_EXCAVATION", 'DX_PANEL_TERRAIN_EXCAVATION_DRAW'
    ]
  }
  ,
  {
    id: 'inundation',
    name: '淹没分析',
    panels: [
      "DX_PANEL_INUNDATION_ANALYSIS", "DX_PANEL_START_INUNDATION_UPDATE_ANALYSIS", 'DX_PANEL_START_INUNDATION_DRAW'
    ]
  },
  {
    id: 'slop',
    name: '坡度坡向分析',
    panels: [
      "DX_PLUGIN_SLOP_ANALYSIS", "DX_PANEL_SLOP_ANALYSIS_EDIT", 'DX_PANEL_SLOP_ANALYSIS_DRAW'
    ]
  }
  ,
  {
    id: 'freeRoaming',
    name: '自由漫游',
    panels: [
      "DX_PANEL_FREE_ROAMING_TIP", "DX_PANEL_FREE_ROAMING_TOOLBAR"
    ]
  },
  {
    id: 'pathRoaming',
    name: '路径漫游',
    panels: [
      "DX_PANEL_PATH_ROAMING", "DX_PANEL_PATH_SETTINGS", 'DX_PANEL_PATH_POINT_SETTINGS'
    ]
  }
  ,
  {
    id: 'skyline',
    name: '天际线',
    panels: [
      "DX_PANEL_SKYLINE_ANALYSIS", "DX_PANEL_SHOW_SKYLINE_ANALYSIS",
    ]
  }


]