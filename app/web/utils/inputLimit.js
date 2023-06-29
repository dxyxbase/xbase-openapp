/**
 * @Date: 2023-06-06 17:12:12
 * @LastEditTime: 2023-06-10 11:21:34
 * @FilePath: /openapi-demoapp/app/web/utils/inputLimit.js
 * @Description:
 */
/* eslint-disable no-control-regex */
export const inputLimitReg = /[\\/:：*?"<>|｜＼＜＞＊？\s]/gi

// 表情符号
export const utf8mb4Reg = /[^\u0000-\uFFFF]/g
export const emojiRegExp = /(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f])|(\ud83d[\ude80-\udeff])/g

// 中文字符
export const zhCNRegExp = /([\u4e00-\u9fa5]|[\ufe30-\uffa0])/g

// 英文字符
export const enUSRegExp = /[a-zA-Z]/g

// 仅英文与数字
export const onlyEnOrNumRegExp = /^[A-Za-z0-9]+$/g

// 空格匹配
export const spaceRegExp = /\s*/g

// 正整数
export const positiveIntegerRegExp = /^(0+)|[^\d]+/g

// 仅数字
export const onlyNumRegExp = /[^0-9]/g
export function inputLimit(txt) {
  return txt.replace(/[：：:：/／|｜|｜\\<>\(\)＼＜＞*＊？？?？”“（）\"＂/:*?\"<>：*？”《》＼／：？＊＂＜＞\\\\]/gi, '')
}

export function cimInputLimit(txt) {
  return txt.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\@\、\，\-\。\—\——\（\）\【\】\！\~\+\=\#\￥\%\…\.\&\@\,\-\.\_\(\)\[\]\!\~\+\=\#\$\%\^\&]/g, '')
}

// 单行输入框限制
export const textRegExp = /[^A-Za-z0-9-_\u4e00-\u9fa5]/g
export function replaceTextLimit(v = '') {
  return v.replace(textRegExp, '')
}

// 多行输入框 非法字符无法输入 可输入 空格 换行等
export function textareaLimit(val) {
  const reg = /[`~!#$%^&*()_\-\+=<>?:"'{}|~！#￥%……&*（）={}|《》？：“”【】；‘’]/g
  return val.replace(reg, '')
}

// 计算返回字符长度 中文及符号长度2 英文及符号长度1
export function countStrLength(val) {
  if (!val) return
  const length = val.length
  // 匹配中文和中文字符
  const reg = /[(\u4e00-\u9fa5)(\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3010|\u3011|\u007e)]+/g
  let cnLength = 0
  const cn = val.match(reg) || []
  cn.forEach(v => {
    cnLength += v.length
  })
  const enLength = length - cnLength
  const countLength = cnLength + enLength / 2
  return countLength
}
