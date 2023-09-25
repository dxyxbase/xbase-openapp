<template>
  <a-config-provider :locale="zh_CN">
    <AdminLayout>
      <transition name="fade" mode="out-in">
        <router-view :key="$route.fullPath"></router-view>
      </transition>
    </AdminLayout>
  </a-config-provider>
</template>
<script type="text/babel">
import Vue from 'vue'
import { Menu, Submenu, MenuItem, MenuItemGroup, Dialog, DropdownMenu, DropdownItem } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Antd from 'ant-design-vue/es'
import 'ant-design-vue/dist/antd.less'
import '@/style/btn.less'
import '@/style/iconfont.css'
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN'
import 'babel-polyfill'

import VueBus from 'vue-bus'
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
import directives from '@/utils/directive.js'
const config = require('@base/xbase-config.json')
Vue.use(Viewer)
Viewer.setDefaults({
  zIndexInline: 9999
})
directives()
Vue.use(VueBus)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(Dialog)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Antd)
import AdminLayout from 'component/layout/index.vue'

export default {
  data() {
    return {
      zh_CN
    }
  },
  created() {
    if (typeof window !== 'undefined' && !window.DXYP) {
      window.DXYP = {
        sdkServer: {
          dx3dJs: `${config.url}${config.dx3dJs}`,
          dxSceneEditorJs: `${config.url}${config.dxSceneEditorJs}`,
          // 静态资源域的地址
          staticHost: `${config.url}${config.staticHost}`,
          // 设置服务域的地址
          serverHost: `${config.url}/viewer`,
          baseUrl: `${config.url}/`,
          cimServer: `${config.url}/viewer/cim`,
          signalServer: '${config.url}/signal',
          // 分片上传配置地址
          productionUploadURL: `${config.url}/upload/api/open/v1/tus`
        }
      }
      Object.freeze(window.DXYP.sdkServer)
      Object.defineProperty(window, 'DXYP', {
        configurable: false,
        writable: false
      })
      this.addJssdkScript(window.DXYP.sdkServer.dx3dJs).then(() => {
        this.addJssdkScript(window.DXYP.sdkServer.dxSceneEditorJs)
      })
    }
  },
  methods: {
    addJssdkScript(jssdk) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        const head = document.head || document.getElementsByTagName('head')[0]
        script.type = 'text/javascript'
        script.src = jssdk
        head.insertBefore(script, head.firstChild)
        script.onload = function () {
          console.log('jssdk successful')
          resolve()
        }
        script.onerror = function () {
          console.log('jssdk load failure')
          reject()
        }
      })
    }
  },
  components: {
    AdminLayout
  },
  computed: {},
  mounted() {}
}
</script>
<style lang="less" scoped>
::v-deep .ant-table-thead > tr > th,
::v-deep .ant-table-tbody > tr > td {
  padding: 16px 12px !important;
}
::v-deep .tdName {
  padding: 0 !important;
  font-size: 12px !important;
  font-weight: bold !important;
}
::v-deep .ant-table-tbody > tr > td {
  padding: 6px 12px !important;
  font-size: 12px !important;
  .actionBtn {
    font-size: 12px !important;
  }
}
::v-deep .actionBtn.ant-btn.ant-btn-link {
  padding-left: 0 !important;
}
</style>
