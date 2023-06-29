/**
 * @Date: 2023-06-27 16:41:34
 * @LastEditTime: 2023-06-29 10:26:38
 * @FilePath: /openapi-demoapp/app/middleware/auth.js
 * @Description:
 */
module.exports = app => {
  return async function jwt(ctx, next) {
    var token = ctx.headers.authorization ? ctx.headers.authorization : ''
    try {
      // 解码token
      let decode = ctx.app.jwt.verify(token, ctx.app.config.jwt.secret)
      ctx.logger.info('header：/n', ctx.headers, '解码结果：/n', decode)
      await next()
    } catch (error) {
      ctx.status = 401
      ctx.body = {
        code: 401,
        message: 'token失效或解析错误',
        data: null
      }
      return
    }
  }
}
