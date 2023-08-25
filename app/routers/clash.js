/**
 * @Date: 2023-07-11 14:21:52
 * @LastEditTime: 2023-07-11 14:22:46
 * @FilePath: /openapi-demoapp/app/routers/clash.js
 * @Description:
 */
module.exports = app => {
  const { router, controller } = app
  
  router.post('/api/open/v1/clash/clash', controller.openApiClash.clash_create)

  router.post('/api/open/v1/clash/delete', controller.openApiClash.clash_del)

  router.post('/api/open/v1/clash/cancel', controller.openApiClash.clash_cancel)

  router.get('/api/open/v1/clash/list', controller.openApiClash.clash_lists)

  router.get('/api/open/v1/clash/content', controller.openApiClash.clash_content)
}
