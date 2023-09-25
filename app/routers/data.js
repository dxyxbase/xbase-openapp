/**
 * @Date: 2023-07-05 11:18:53
 * @LastEditTime: 2023-07-21 13:34:03
 * @FilePath: /openapi-demoapp/app/routers/data.js
 * @Description:
 */
module.exports = app => {
  const { router, controller } = app
  //模板文件下载
  router.get('/api/open/v1/template/download', controller.openApiData.template_download)
  // 导入
  router.post('/api/open/v1/standardization/standard/upload', controller.openApiData.standard_model_import)
  //模型校验标准名称
  router.get('/api/open/v1/standardization/standard/check-name', controller.openApiData.check)
  //模型标准列表
  router.get('/api/open/v1/standardization/standard', controller.openApiData.standard_model_list)
  //模型删除标准
  router.post('/api/open/v1/standardization/standard/delete', controller.openApiData.standard_model_del)
  //模型编辑标准
  router.post('/api/open/v1/standardization/standard/update', controller.openApiData.standard_model_edit)
  //属性标准列表
  router.get('/api/open/v1/standardization/property', controller.openApiData.standard_attr_list)
  //新增属性标准
  router.post('/api/open/v1/standardization/property', controller.openApiData.standard_attr_add)
  //属性删除自定义标准
  router.post('/api/open/v1/standardization/property/delete', controller.openApiData.data_standard_attr_del)
  //属性编辑标准
  router.post('/api/open/v1/standardization/property/update', controller.openApiData.data_standard_attr_edit)
  //属性校验标准名称
  router.get('/api/open/v1/standardization/property/check-name', controller.openApiData.standard_attr_check)
  //复制属性标准
  router.post('/api/open/v1/standardization/property/copy', controller.openApiData.standard_attr_copy)
  //标准内容条目列表
  router.post('/api/open/v1/standardization/standard/children/list', controller.openApiData.model_child_list)
  //检查标准是否已经发布
  router.post('/api/open/v1/standardization/standard/is-publish', controller.openApiData.model_is_publish)
  //标准发布/卸载
  router.post('/api/open/v1/standardization/standard/publish', controller.openApiData.model_publish)
  //新增标准条目
  router.post('/api/open/v1/standardization/standard/children', controller.openApiData.model_child_add)
  //编辑标准条目
  router.post('/api/open/v1/standardization/standard/children/update', controller.openApiData.model_child_edit)
  //删除标准条目
  router.post('/api/open/v1/standardization/standard/children/delete', controller.openApiData.model_child_del)
  //编辑条目顺序
  router.post('/api/open/v1/standardization/standard/children/move', controller.openApiData.model_child_move)
  //校验属性信息标准条目名称
  router.get('/api/open/v1/standardization/property/children/check-name', controller.openApiData.attr_child_check)
  //属性信息标准内容列表
  router.get('/api/open/v1/standardization/property/children', controller.openApiData.attr_child_list)
  //属性新增条目
  router.post('/api/open/v1/standardization/property/children', controller.openApiData.attr_child_add)
  //属性编辑条目
  router.post('/api/open/v1/standardization/property/children/update', controller.openApiData.attr_child_edit)
  //属性删除/批量删除条目
  router.post('/api/open/v1/standardization/property/children/delete', controller.openApiData.attr_child_del)
  //属性编辑条目顺序
  router.post('/api/open/v1/standardization/property/children/move', controller.openApiData.attr_child_move)
  //构件映射规则列表
  router.get('/api/open/v1/standardization/rule/component', controller.openApiData.rule_model_components_list)
  //添加构件映射规则
  router.post('/api/open/v1/standardization/rule/component', controller.openApiData.rule_components_add)
  //编辑构件映射规则
  router.post('/api/open/v1/standardization/rule/component/update', controller.openApiData.rule_components_edit)
  //删除构件映射规则
  router.post('/api/open/v1/standardization/rule/component/delete', controller.openApiData.rule_model_components_del)
  //恢复构件映射规则
  router.post('/api/open/v1/standardization/rule/component/reset', controller.openApiData.rule_components_reset)
  //编辑构件映射规则执行顺序
  router.post('/api/open/v1/standardization/rule/component/move', controller.openApiData.rule_components_move)
  //校验是否存在构件映射规则
  router.get('/api/open/v1/standardization/rule/component/check-exist', controller.openApiData.rule_components_check)
  //标准映射规则列表
  router.get('/api/open/v1/standardization/rule/standard', controller.openApiData.rule_standard_list)
  //添加标准映射规则
  router.post('/api/open/v1/standardization/rule/standard', controller.openApiData.rule_standard_add)
  //编辑标准映射规则
  router.post('/api/open/v1/standardization/rule/standard/update', controller.openApiData.rule_standard_edit)
  //删除标准映射规则
  router.post('/api/open/v1/standardization/rule/standard/delete', controller.openApiData.rule_standard_del)
  //恢复标准映射规则
  router.post('/api/open/v1/standardization/rule/standard/reset', controller.openApiData.rule_standard_reset)
  //编辑标准映射规则执行顺序
  router.post('/api/open/v1/standardization/rule/standard/move', controller.openApiData.rule_standard_move)
  //校验是否存在标准映射规则
  router.get('/api/open/v1/standardization/rule/standard/check-exist', controller.openApiData.rule_standard_check)
  // 标准映射列表
  router.get('/api/open/v1/standardization/mapping', controller.openApiData.standard_map_list)
  // 新增标准映射
  router.post('/api/open/v1/standardization/mapping', controller.openApiData.standard_map_add)
  // 编辑标准映射
  router.post('/api/open/v1/standardization/mapping/update', controller.openApiData.standard_map_edit)
  // 删除标准映射
  router.post('/api/open/v1/standardization/mapping/delete', controller.openApiData.standard_map_del)
  // 校验标准映射名称
  router.get('/api/open/v1/standardization/mapping/check-name', controller.openApiData.standard_map_check)
  // 获取发布标准列表
  router.get('/api/open/v1/standardization/standard/publish', controller.openApiData.standard_publish_list)
  // 自动匹配映射条目
  router.post('/api/open/v1/standardization/mapping/auto-match', controller.openApiData.standard_map_auto_match)
  // 获取映射源
  router.get('/api/open/v1/standardization/mapping/content/standard', controller.openApiData.standard_publish_source_list)
  // 映射标准列表
  router.get('/api/open/v1/standardization/mapping/content/mapping/standard', controller.openApiData.standard_publish_map_list)
  // 绑定条目映射
  router.post('/api/open/v1/standardization/mapping/content/bind', controller.openApiData.standard_map_match_bind)
  // 移除条目映射
  router.post('/api/open/v1/standardization/mapping/content/unbind', controller.openApiData.standard_map_match_unbind)
  // 获取条目映射结果
  router.get('/api/open/v1/standardization/mapping/content', controller.openApiData.standard_publish_map_right_list)
  // 获取条目映射结果
  router.get('/api/open/v1/standardization/model/components', controller.openApiData.standard_model_components)
  // 获取绑定进度
  router.post('/api/open/v1/standardization/model/processing-info', controller.openApiData.standard_model_processing_info)
  // 获取绑定进度
  router.post('/api/open/v1/standardization/model/auto-match', controller.openApiData.standard_model_autoMatch)
  // 获取绑定数据
  router.post('/api/open/v1/standardization/model/components/bind-data', controller.openApiData.standard_model_bind_data)
  // 模型构件解绑分类编码
  router.post('/api/open/v1/standardization/model/components/unbind', controller.openApiData.standard_model_unbind)
  // 模型构件绑定分类编码
  router.post('/api/open/v1/standardization/model/components/bind', controller.openApiData.standard_model_bind)
  // 获取映射源
  router.get('/api/open/v1/standardization/mapping/content/result', controller.openApiData.map_content_result)
  // 获取构件绑定的分类标准信息
  router.post('/api/open/v1/standardization/model/bind-standard', controller.openApiData.standard_model_bind_standard)
}
