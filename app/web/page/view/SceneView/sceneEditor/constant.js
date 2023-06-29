/* eslint-disable */
import { body, goback as gobackIcon, heightLimit, terrainFlatten, line, noodles, spot, visibility, buildingHeight, coordinateQuery, buildingGap, viewable, skyline, inundation, slop, volume, contour, pathRoaming } from '@/assets/sceneEdit'
const toolbarLeft = () => [
  {
    id: 'layer',
    name: '图层',
    defaultIcon: 'icon-cim-tuceng',
    activeIcon: 'icon-cim-tuceng2'
  },
  {
    id: 'presePosition',
    name: '预留位置',
    defaultIcon: 'icon-cim-yuzhiweizhi',
    activeIcon: 'icon-cim-yuzhiweizhi2',
    disabled: false
  },
  {
    id: 'draw',
    defaultIcon: 'icon-cim-huizhi',
    activeIcon: 'icon-cim-huizhi2',
    name: '绘制'
  },
  {
    id: 'measure',
    name: '测量',
    defaultIcon: 'icon-cim-celiang',
    activeIcon: 'icon-cim-celiang2',
    disabled: false
  },
  {
    id: 'section',
    defaultIcon: '',
    activeIcon: '',
    name: '剖切',
    disabled: true,
    hidden: true
  },
  {
    id: 'modelEdit',
    name: '模型编辑',
    defaultIcon: 'icon-cim-moxingbianji',
    activeIcon: 'icon-cim-moxingbianji2'
  },
  {
    id: 'terrainEdit',
    name: '地形编辑',
    defaultIcon: 'icon-cim-dixingbianji',
    activeIcon: 'icon-cim-dixingbianji2'
  },
  {
    id: 'structManage',
    defaultIcon: '',
    activeIcon: '',
    name: '构件管理',
    disabled: true,
    hidden: true
  },
  {
    id: 'structProperty',
    defaultIcon: '',
    activeIcon: '',
    name: '构件属性',
    disabled: true,
    hidden: true
  },
  {
    id: 'query',
    defaultIcon: '',
    activeIcon: '',
    name: '查询',
    disabled: true,
    hidden: true
  },
  {
    id: 'analysis',
    name: '分析',
    defaultIcon: 'icon-cim-fenxi',
    activeIcon: 'icon-cim-fenxi2',
    disabled: false
  },
  {
    id: 'weather',
    defaultIcon: '',
    activeIcon: '',
    name: '天气模拟',
    disabled: false,
    hidden: true
  },
  {
    id: 'roaming',
    name: '漫游',
    defaultIcon: 'icon-cim-manyou',
    activeIcon: 'icon-cim-manyou2'
  },
  {
    id: 'material',
    name: '材质库',
    defaultIcon: 'icon-cim-caizhiku',
    activeIcon: 'icon-cim-caizhiku2'
  },
  {
    id: 'setting',
    name: '设置',
    defaultIcon: 'icon-cim-shezhi',
    activeIcon: 'icon-cim-shezhi2'
  }
]
const toolbarRight = () => [
  {
    id: 'load',
    name: '加载',
    defaultIcon: 'icon-openline',
    activeIcon: ''
  },
  {
    id: 'uninstall',
    name: '卸载',
    defaultIcon: 'icon-xiezai',
    activeIcon: '',
    disabled: true
  },
  {
    id: 'saveScene',
    name: '保存场景',
    defaultIcon: 'icon-save',
    activeIcon: ''
  },
  {
    id: 'saveSceneAs',
    name: '另存场景',
    defaultIcon: 'icon-save2',
    activeIcon: ''
  }
]

const drawToolbar = () => [
  {
    id: 'point',
    name: '点',
    icon: spot,
    defaultIcon: 'icon-dian',
    activeIcon: '',
    disabled: false
  },
  {
    id: 'line',
    name: '线',
    icon: line,
    defaultIcon: 'icon-xian',
    activeIcon: '',
    disabled: false
  },
  {
    id: 'face',
    name: '面',
    defaultIcon: 'icon-mian',
    activeIcon: '',
    icon: noodles,
    disabled: false
  },
  {
    id: 'body',
    name: '体',
    defaultIcon: 'icon-ti',
    activeIcon: '',
    icon: body,
    disabled: false
  }
]

const terrainEditToolbar = () => [
  {
    id: 'terrainFlatten',
    name: '地形压平',
    icon: terrainFlatten,
    defaultIcon: 'icon-dixingyaping',
    activeIcon: ''
  },
  {
    id: 'terrainExcavate',
    name: '地形开挖',
    icon: '',
    defaultIcon: 'icon-dixingkaiwa'
  }
]
const roamingToolbar = () => [
  {
    id: 'freeRoaming',
    name: '自由漫游',
    icon: '',
    defaultIcon: 'icon-ziyoumanyou'
  },
  {
    id: 'pathRoaming',
    name: '路径漫游',
    icon: pathRoaming,
    defaultIcon: 'icon-lujingmanyou'
  }
]

const analysisToolbar = () => [
  {
    id: 'visibilityAnalysis',
    name: '通视分析',
    icon: visibility,
    defaultIcon: 'icon-tongshifenxi'
  },
  {
    id: 'viewable',
    name: '可视域分析',
    icon: viewable,
    defaultIcon: 'icon-keshiyufenxi'
    // disabled: true
  },
  {
    id: 'heightLimitAnalysis',
    name: '限高分析',
    icon: heightLimit,
    defaultIcon: 'icon-xiangaofenxi'
  },
  {
    id: 'skyline',
    name: '天际线分析',
    icon: skyline,
    defaultIcon: 'icon-tianjixianfenxi'
    // disabled: true
  },
  {
    id: 'inundation',
    name: '淹没线分析',
    icon: inundation,
    defaultIcon: 'icon-yanmofenxi'
    // disabled: true
  },
  {
    id: 'volume',
    name: '填挖方分析',
    icon: volume,
    defaultIcon: 'icon-tianwafangfenxi'
    // disabled: true
  },
  {
    id: 'slop',
    name: '坡度坡向分析',
    icon: slop,
    defaultIcon: 'icon-podupoxiang'
    // disabled: true
  },
  {
    id: 'contour',
    name: '等高线分析',
    icon: contour,
    defaultIcon: 'icon-denggaoxian'
    // disabled: true
  }
]

// toolbarId对应commandId

const queryToolbar = () => [
  {
    id: 'buildingHeight',
    name: '建筑高度',
    icon: buildingHeight
  },
  {
    id: 'coordinateQuery',
    name: '场地坐标',
    icon: coordinateQuery
  },
  {
    id: 'buildingGapQuery',
    name: '建筑间距',
    icon: buildingGap,
    disabled: true
  }
]

const commands = {
  layer: 'show_layer',
  presePosition: 'show_viewpoint_list',
  modelEdit: 'DX_COMMAND_ENABLE_EDIT_MODEL',
  setting: 'show_setting',

  visibilityAnalysis: 'DX_COMMAND_ENABLE_VISIBLE_ANALYSIS',
  heightLimitAnalysis: 'DX_COMMAND_ENABLE_HEIGHT_ANALYSIS',
  fallbackAnalysis: 'show_back_line_analysis',
  sunshineAnalysis: 'DX_COMMAND_SHOW_SUNLIGHT_ANALYSIS',
  redLine: 'DX_COMMAND_START_REDLINE',
  buildingHeight: 'DX_COMMAND_SHOW_HEIGHT_QUERY',
  buildingHeightQuery: 'DX_COMMAND_HEIGHT_QUERY',
  coordinateQuery: 'DX_COMMAND_SHOW_COORDINATES_QUERY',
  initBackLine: 'DX_COMMAND_INIT_BACKLINE_ANALYSIS',
  weather: 'DX_COMMAND_ENABLE_WEATHER',
  measure: 'enable_measure',

  terrainFlatten: 'DX_COMMAND_ENABLE_TERRAIN_FLATTEN',
  terrainExcavate: 'DX_COMMAND_ENABLE_TERRAIN_EXCAVATION',
  freeRoaming: 'DX_COMMAND_SHOW_FREE_ROAMING_TOOLBAR',
  pathRoaming: 'ShowPathRoaming',

  viewable: 'DX_COMMAND_ENABLE_VIEWSHED_ANALYSIS',
  skyline: 'DX_COMMAND_ENABLE_SKYLINE_ANALYSIS',
  inundation: 'DX_COMMAND_ENABLE_INUNDATION_ANALYSIS',
  volume: 'DX_COMMAND_ENABLE_VOLUME_ANALYSIS',
  slop: 'DX_COMMAND_ENABLE_SLOP_ANALYSIS',
  contour: 'DX_COMMAND_ENABLE_CONTOUR_LINE',

  material: 'ShowMaterialLibrary'
}

// 需要设置top的panelId
const setTopPanelIds = ['DX_PANEL_VISIBLE_ANALYSIS', 'DX_PANEL_HEIGHT_ANALYSIS', 'back_line_analysis_panel', 'DX_REDLINE_PANEL', 'DX_SUNLIGHT_ANALYSIS_PANEL']

// panelId对应toolbarId
const panelIds = {
  toolbarPanels: {
    DX_LAYER: 'layer',
    DX_VIEWPOINT_LIST: 'presePosition',
    DX_PANEL_CIM_MODEL_EDITOR: 'modelEdit',
    DX_PANEL_CIM_WEATHER: 'weather',
    DX_PANEL_SETTING: 'setting'
  },
  secondToolbarPanels: {
    DX_REDLINE_PANEL: 'redLine',
    back_line_analysis_panel: 'fallbackAnalysis',
    DX_PANEL_HEIGHT_ANALYSIS: 'heightLimitAnalysis',
    DX_PANEL_VISIBLE_ANALYSIS: 'visibilityAnalysis',
    DX_PANEL_TERRAIN_FLATTEN: 'terrainFlatten',
    DX_PANEL_TERRAIN_EXCAVATION: 'terrainExcavate',
    DX_PANEL_PATH_ROAMING: 'pathRoaming',
    DX_PANEL_FREE_ROAMING_TOOLBAR: 'freeRoaming',
    DX_SUNLIGHT_ANALYSIS_PANEL: 'sunshineAnalysis',
    DX_PANEL_INUNDATION_ANALYSIS: 'inundation',
    DX_PANEL_VOLUME_ANALYSIS: 'volume',
    DX_PANEL_SKYLINE_ANALYSIS: 'skyline',
    DX_PANEL_VIEWSHED_ANALYSIS: 'viewable',
    DX_PANEL_SLOP_ANALYSIS_DRAW: 'slop'
  }
}

// 一级且没有二级toolbar的panelName
const onlyFirstToolbarPanel = {
  layer: 'DX_LAYER', // 图层
  presePosition: 'DX_VIEWPOINT_LIST', // 预设位置
  measure: 'DX_PANEL_MEASURE', // 测量
  modelEdit: 'DX_PANEL_CIM_MODEL_EDITOR', // 模型编辑
  weather: 'DX_PANEL_CIM_WEATHER', // 天气
  material: 'DX_PANEL_MATERIAL_LIBRARY', // 材质库
  setting: 'DX_PANEL_SETTING' // 设置
}

const limitedSecondToolbarPanelIds = [
  'DX_PANEL_DRAW',
  'DX_PANEL_ADD_SHAPE',
  'DX_PANEL_EDIT_DRAW_OPTIONS',
  'DX_PANEL_HEIGHT_ANALYSIS',
  'DX_PANEL_VISIBLE_ANALYSIS',
  'DX_PANEL_INUNDATION_ANALYSIS',
  'DX_PANEL_VIEWSHED_ANALYSIS',
  'DX_PANEL_SKYLINE_ANALYSIS',
  // 'DX_PANEL_SHOW_SKYLINE_ANALYSIS',
  'DX_PANEL_START_INUNDATION_DRAW',
  'DX_PANEL_START_INUNDATION_UPDATE_ANALYSIS',
  'DX_PANEL_SLOP_ANALYSIS_DRAW',
  'DX_PANEL_SLOP_ANALYSIS_EDIT',
  'DX_PANEL_TERRAIN_FLATTEN',
  'DX_PANEL_TERRAIN_FLATTEN_DRAW',
  'DX_PANEL_TERRAIN_FLATTEN_SETTING',
  'DX_PANEL_CONTOUR_LINE',
  'DX_PANEL_VOLUME_ANALYSIS',

  'DX_PANEL_PATH_ROAMING',
  'DX_PANEL_PATH_SETTINGS',
  'DX_PANEL_PATH_POINT_SETTINGS',
  'DX_PANEL_TERRAIN_EXCAVATION',
  'DX_PANEL_TERRAIN_EXCAVATION_DRAW',
  'DX_PANEL_TERRAIN_EXCAVATION_SETTING'
]

// 罗盘panelId
const compassPanelId = 'DX_PANEL_COMPASS'
const zoomPanelId = 'DX_PANEL_ZOOM'

const platformName = 'X-Base'
const sceneEdit = () => '场景编辑'
const groundMode ='地上模式'
const undergroundMode = '地下模式'

const loadLayerSuccess = '加载图层成功'
const locationAddedSuccess = '添加位置成功'

const toolbarPanelCoexistRelate = {
  uninstall: ['DX_LAYER']
}

const supportSpecialChar = ['@ 、，-。——（）【】！~+=#￥%……& @ ,-._()[]!~+=#$%^&']

export { toolbarLeft, toolbarRight, drawToolbar, analysisToolbar, terrainEditToolbar, roamingToolbar, queryToolbar, platformName, sceneEdit, groundMode, undergroundMode, loadLayerSuccess, locationAddedSuccess, gobackIcon, commands, setTopPanelIds, compassPanelId, zoomPanelId, panelIds, onlyFirstToolbarPanel, toolbarPanelCoexistRelate, limitedSecondToolbarPanelIds, supportSpecialChar }
