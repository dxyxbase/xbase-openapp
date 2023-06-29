const { Controller } = require('egg')
class BaseController extends Controller {
  success(data) {
    return {
      code: 0,
      message: 'success',
      data: data
    }
  }

  error(code, message, data) {
    return {
      code,
      message,
      data: data
    }
  }

  error400(data) {
    return {
      code: 400,
      message: '参数不合法',
      data: data
    }
  }
  error500(data) {
    return {
      code: 500,
      message: '服务器出错',
      data: data
    }
  }
  notFound(msg) {
    msg = msg || 'not found'
    this.ctx.throw(404, msg)
  }
}
module.exports = BaseController
