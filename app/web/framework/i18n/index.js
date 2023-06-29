/**
 * @Date: 2023-06-05 19:10:35
 * @LastEditTime: 2023-06-16 11:08:35
 * @FilePath: /openapi-demoapp/app/web/framework/i18n/index.js
 * @Description:
 */
import VueI18n from 'vue-i18n'
import cn from './cn'
import en from './en'
export default function createI18n(locale) {
  return new VueI18n({
    locale,
    messages: {
      en,
      cn
    }
  })
}
