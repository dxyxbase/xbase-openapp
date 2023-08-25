/**
 * @Date: 2023-07-11 14:21:52
 * @LastEditTime: 2023-07-11 14:22:46
 * @FilePath: /openapi-demoapp/app/routers/clash.js
 * @Description:
 */
module.exports = app => {
    const { router, controller } = app
    
    router.post('/api/open/v1/componentsearch/search', controller.openApiSearch.search)
  
    router.post('/api/open/v1/componentsearch/add', controller.openApiSearch.save_search_record)
  
    router.post('/api/open/v1/componentsearch/edit', controller.openApiSearch.edit_search_record)
  
    router.get('/api/open/v1/componentsearch/list', controller.openApiSearch.search_record_list)
  
    router.get('/api/open/v1/componentsearch/file/list', controller.openApiSearch.search_model_list)

    router.get('/api/open/v1/componentsearch/component/list', controller.openApiSearch.search_component_list)

    router.post('/api/open/v1/componentsearch/export', controller.openApiSearch.record_output)
  
    router.post('/api/open/v1/componentsearch/file/export', controller.openApiSearch.record_model_output)

    router.post('/api/open/v1/componentsearch/delete', controller.openApiSearch.search_record_delete)
  
    router.post('/api/open/v1/componentsearch/cancel', controller.openApiSearch.search_cancel)
  
    router.get('/api/open/v1/componentsearch/search-state', controller.openApiSearch.is_search)

    router.post('/api/open/v1/componentset/property', controller.openApiSearch.component_property)

    router.post('/api/open/v1/componentset/category', controller.openApiSearch.component_category)
  
  }