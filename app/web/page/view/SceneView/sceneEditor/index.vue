<template>
  <div class="boxs_">
    <span class="titleIcon" @click="go2Back">
      <a-icon type="left" />
    </span>
    <div :id="id"></div>
    <p class="render-type">渲染类型CME</p>
  </div>
</template>
<script>
import { model_view_token } from '@/apis/model.js'
import { load_list, sence_edit, sence_detail, searchLocation, getTilesetJson,getCimCategory ,getElementSemanticProperty,updateSemantic,saveSemantic,deleteSemantic,getCimNodeSemantic} from '@/apis/sence.js'
import { viewerToken } from '@/utils/setting.js'
export default {
  components: {
    // iconFontDX,
    // iconFontCIM
  },
  props: {},
  data() {
    return {
      id: 'sceneEditorWrapper',
      appId: '',
      sceneId: '',
      projectId: ''
    }
  },
  created() {},
  mounted() {
    this.initSceneEditor()
  },
  computed: {},

  methods: {
    queryURL(name) {
      const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
      const r = window.location.search.substr(1).match(reg)
      if (r != null) return decodeURI(r[2])
      return null
    },
    getSceneBaseUrl() {
      return `${window.DXYP.sdkServer.baseUrl}viewer/model/`
    },
    go2Back() {
      window.sceneEditor = null
      this.$router.push('/sceneView')
    },
    async getmodel_view_token() {
      // eslint-disable-next-line no-return-await
      return await model_view_token({
        file_id: this.sceneId,
        viewer_type: 'scene'
      }).then(res => {
        return res.data.token
      })
    },
    async initSceneEditor() {
      const isExist = await this.checkDX()
      if (!isExist) return
      const {
        sdkServer: { staticHost, cimServer, baseUrl, serverHost }
      } = window.DXYP
      const { DX } = window

      var options = {}

      options.rootDom = this.id
      options.sceneId = this.sceneId = this.$route.query.scene_id
      options.baseURL = baseUrl
      options.staticHost = staticHost
      options.serverHost = serverHost
      const model_view_token = await this.getmodel_view_token()
      // 视图 viewerToken
      options.previewToken = {
        Authorization: viewerToken(model_view_token)
      }
      options.sceneAssetsBaseUrl = this.getSceneBaseUrl()
      // debugger
      options.sceneApiConfig = {
        getSceneInfo: sence_detail, // 获取场景详情
        saveScene: sence_edit, // 保存、另存场景
        getLoadList: load_list, // 获取资产模型列表
        searchLocation: searchLocation, //根据关键词联想搜索地址
        saveAsScene: sence_edit, // 另存场景接口
        // 新增
        getCimCategory: getCimCategory,
        getElementSemanticProperty: getElementSemanticProperty,
        updateSemantic: updateSemantic, 
        saveSemantic: saveSemantic,
        deleteSemantic: deleteSemantic,
        getCimNodeSemantic: getCimNodeSemantic,
        getTilesetJson: url => {
          return getTilesetJson(url, { Headers: options.previewToken })
        }, // 获取3dtiles json数据
        resourceUrl: baseUrl, //资产路径根目录
        devResourceUrl: baseUrl //开发环境下资产路径根目录
      }
      // 初始化应用
      var scene = new DX.SceneEditor(options)
      window.sceneEditor = scene
      scene.init()
    },

    async checkDX() {
      // eslint-disable-next-line promise/param-names
      return new Promise((res, reject) => {
        let count = 0
        const timeout = setInterval(() => {
          if (!window.DX || !window.DX.SceneEditor) {
            count++
            console.log('%c DX is not exist, wait 0.03 seconds to try again', 'color: #0E80E7')
            if (count > 100) {
              console.log('%c DX is load failed, please try refrush the window', 'color: #0E80E7')
              clearInterval(timeout)
              res(false)
            }
          } else {
            clearInterval(timeout)
            res(true)
          }
        }, 30)
      })
    }
  }
}
</script>
<style lang="less" scoped>
.boxs_ {
  position: relative;
  width: 100%;
  height: 100%;
}
.titleIcon {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 2.125rem;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background: #4c5263;
  z-index: 1;
  top: 15px;
  cursor: pointer;
  .anticon {
    font-size: 0.875rem;
    color: #fff;
  }
  &:hover,
  &:active {
    background: #62697d;
  }
  &:active .anticon {
    color: #ccc;
  }
}
#sceneEditorWrapper {
  width: 100%;
  height: 100%;
}
.render-type {
  position: absolute;
  right: 0.4375rem;
  bottom: 2.25rem;
  font-size: 0.75rem;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
  margin: 0px;
  z-index: 100;
}
</style>
