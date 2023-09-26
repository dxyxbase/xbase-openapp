/**
 * @Date: 2023-06-05 15:44:38
 * @LastEditTime: 2023-09-19 15:38:17
 * @FilePath: /openapi-demoapp/app/router.js
 * @Description:
 */
'use strict'
module.exports = app => {
  const { router, controller, middleware } = app
  // const { auth } = middleware
  // 需要校验token的路由添加app.jwt, auth,
  router.get('/', controller.openApi.home)
  // login
  router.post('/api/v1/login', controller.openApi.getToken)
  // 获取viewer token
  router.post('/api/open/v1/viewer/token', controller.openApi.view_token)
  //模型管理列表
  router.get('/api/open/v1/model/models', controller.openApi.model_list)
  //语义模型列表
  router.get('/api/open/v1/semantic-model/list', controller.openApi.semantic_model_list)
  //转换语义模型列表
  router.get('/api/open/v1/semantic-model/translation/list', controller.openApi.trans_semantic_model_list)
  router.post('/api/open/v1/semantic-model/create', controller.openApi.semantic_model_add)
  router.post('/api/open/v1/semantic-model/translation', controller.openApi.semantic_model_transfrom)
  router.post('/api/open/v1/semantic-model/translation/cancel', controller.openApi.semantic_model_transfromCancel)
  router.get('/api/open/v1/semantic-model/info', controller.openApi.semantic_model_info)
  router.get('/api/open/v1/semantic-model/translation/info', controller.openApi.semantic_model_infoTrans)
  router.post('/api/open/v1/semantic-model/delete', controller.openApi.semantic_model_del)
  //模型上传
  router.post('/api/open/v1/model/upload', controller.openApi.model_upload)
  // 模型删除
  router.post('/api/open/v1/model/delete', controller.openApi.model_del)
  // 转换模型
  router.post('/api/open/v1/model/translation', controller.openApi.model_translation)
  // 终止转换模型
  router.post('/api/open/v1/model/cancel/translation', controller.openApi.model_cancel_translation)
  // 模型详情
  router.get('/api/open/v1/model/model', controller.openApi.model_detail)
  // 模型转换详情
  router.get('/api/open/v1/model/transform/info', controller.openApi.model_transform_detail)
  // 模型下载  避免auth中间键过滤
  router.get('/router/model/download', controller.openApi.model_down)
  // 获取模型状态
  // router.get('/api/open/v1/model/fs/status', controller.openApi.model_status)
  // 获取模型属性
  router.get('/api/open/v1/model/ds/property', controller.openApi.model_attr)
  // 查找模型属性
  router.get('/api/open/v1/model/ds/property/query', controller.openApi.model_attr_query)
  // 获取模型构件树
  // router.get('/api/open/v1/model/fs/property/tree', controller.openApi.model_tree_get)
  router.get('/api/open/v1/model/fs/modeltree', controller.openApi.model_tree_get)
  // 查找模型构件树
  router.get('/api/open/v1/model/fs/modeltree/query', controller.openApi.model_tree_query)

  // 模型装配
  router.post('/api/open/v1/model/assembly', controller.openApi.model_assembly)
  // 模型装配编辑
  router.post('/api/open/v1/model/assembly/edit', controller.openApi.model_assembly_edit)
  // 获取模型构件属性
  //模型分片上传
  // router.post('/api/open/v1/model/model', controller.openApi.model_upload_tus)

  // 资产分片上传
  router.post('/api/open/v1/asset/asset', controller.openApi.asset_upload_tus)
  // 资产列表
  router.get('/api/open/v1/asset/assets', controller.openApi.asset_list)
  // 资产上传
  router.post('/api/open/v1/asset/upload', controller.openApi.asset_upload)
  // 资产删除
  router.post('/api/open/v1/asset/delete', controller.openApi.asset_del)
  // 资产详情
  router.get('/api/open/v1/asset/detail', controller.openApi.asset_detail)
  // 资产发起转换
  router.post('/api/open/v1/asset/translation', controller.openApi.asset_translation)
  // 资产终止转换
  router.post('/api/open/v1/asset/translation/cancel', controller.openApi.asset_translation_cancel)

  // 场景列表
  router.get('/api/open/v1/scene/scenes', controller.openApi.scene_list)
  // 场景新增/编辑
  router.post('/api/open/v1/scene/scene', controller.openApi.scene_edit)
  // 场景名称校验
  router.get('/api/open/v1/scene/check-name', controller.openApi.scene_check)
  // 场景删除
  router.post('/api/open/v1/scene/delete', controller.openApi.scene_del)
  // 场景重命名
  router.post('/api/open/v1/scene/rename', controller.openApi.scene_rename)
  // 场景详情
  router.get('/api/open/v1/scene/detail', controller.openApi.scene_detail)
  router.get('/api/xbase/v1/scene/load-list', controller.openApi.scene_load_list)
  // 场景新增/编辑
  router.post('/api/xbase/v1/scene/scene', controller.openApi.scene_edit)
  // 根据关键词联想搜索地址
  router.get('/api/open/v1/scene/locations', controller.openApi.searchLocation)

  // 查询场景资产树
  router.get('/api/open/v1/sence/assets', controller.openApi.scene_assets)

  // 视点新增
  router.post('/api/open/v1/viewport/add', controller.openApi.port_add)
  // 视点删除
  router.post('/api/open/v1/viewport/delete', controller.openApi.port_del)
  // 视点列表
  router.get('/api/open/v1/viewport/viewports', controller.openApi.port_list)
  // 视点详情
  router.get('/api/open/v1/viewport/viewport', controller.openApi.port_detail)
  // 查询构件属性
  router.get('/api/open/v1/model/ds/property/uid', controller.openApi.query_uid)
  // asset查询构件属性
  router.get('/api/open/v1/asset/ds/property/uid', controller.openApi.query_uid_byAsset)
  // 分片上传
  // router.post('/api/open/v1/tus/upload', controller.openApi.tus_upload)
  // BIM资产装配
  router.post('/api/open/v1/asset/assembly', controller.openApi.asset_assembly)
  // 查询装配文件关联资产
  router.post('/api/open/v1/asset/get-by-asm', controller.openApi.getAsset_by_asm)
  // 查询资产关联的装配
  router.post('/api/open/v1/asset/get-by-asset', controller.openApi.getAsm_by_asset)
  router.get('/api/open/v1/graph-service/cim/category', controller.openApi.getCimCategory)

  router.post('/api/xbase/v1/graph-service/cim/update', controller.openApi.updateSemantic)
  router.post('/api/open/v1/graph-service/cim/save', controller.openApi.saveSemantic)
  router.get('/api/open/v1/graph-service/cim', controller.openApi.getElementSemanticProperty)
  router.post('/api/open/v1/graph-service/cim/delete', controller.openApi.deleteSemantic)
  router.get('/api/open/v1/graph-service/cim/nodes', controller.openApi.getCimNodeSemantic)
  router.get('/api/open/v1/component/components', controller.openApi.model_components_list)
  router.get('/api/open/v1/component/component', controller.openApi.model_components_detail)
  router.get('/api/open/v1/component/transform/info', controller.openApi.model_components_info)
  router.post('/api/open/v1/component/upload', controller.openApi.model_components_upload)
  router.post('/api/open/v1/component/component', controller.openApi.model_components_save)
  router.post('/api/open/v1/component/translation', controller.openApi.model_components_transfer_start)
  router.post('/api/open/v1/component/cancel/translation', controller.openApi.model_components_transfer_cancel)
  router.post('/api/open/v1/component/delete', controller.openApi.model_components_del)
  // 路由拆分
  // 数据标准化服务
  require('./routers/data')(app)
  // 碰撞检查服务
  require('./routers/clash')(app)
  // 数据高级管理服务
  require('./routers/search')(app)
  // 模型检查服务
  // require('./routers/check')(app)
  // 模型对比服务
  require('./routers/comparison')(app)
}
