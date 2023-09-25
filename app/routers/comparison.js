/**
 * @Date: 2023-07-11 14:21:52
 * @LastEditTime: 2023-07-11 14:22:46
 * @FilePath: /openapi-demoapp/app/routers/clash.js
 * @Description:
 */
module.exports = app => {
    const { router, controller } = app
    
    router.post('/api/open/v1/model-diff/create', controller.openApiComparison.comparison_create)
  
    router.post('/api/open/v1/model-diff/delete', controller.openApiComparison.comparison_del)
  
    router.post('/api/open/v1/model-diff/cancel', controller.openApiComparison.comparison_cancel)

    router.post('/api/open/v1/model-diff/export', controller.openApiComparison.comparison_export)
  
    router.get('/api/open/v1/model-diff/list', controller.openApiComparison.comparison_lists)
  
    router.get('/api/open/v1/model-diff/content', controller.openApiComparison.comparison_content)

    router.get('/api/open/v1/model-diff/content/property', controller.openApiComparison.comparison_content_property)
  }
  