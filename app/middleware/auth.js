module.exports = secret => {
  return async function (ctx, next) {
    // ctx.logger.info('接口原始token', ctx.request)
    // 若是没有 token，返回的是 null 字符串
    const token = ctx.request.header.Authorization || ctx.request.header.authorization
    if (token != 'null' && token) {
      const myToken = token.substring(7)
      // ctx.logger.info('接口原始token', token)
      try {
        let decode = ctx.app.jwt.verify(myToken, ctx.app.config.jwt.secret)
        // ctx.logger.info('token 需要校验', decode, +new Date(), new Date())
        if (Date.now() >= decode.exp * 1000) {
          ctx.status = 200
          ctx.body = {
            code: 401,
            msg: 'token已过期'
          }
        }
        await next()
      } catch (error) {
        ctx.logger.info('error', error)
        ctx.status = 200
        ctx.body = {
          code: 401,
          msg: 'token失效或解析错误'
        }
      }
    } else {
      ctx.status = 200
      ctx.body = {
        code: 401,
        msg: 'token不存在'
      }
    }
  }
}
