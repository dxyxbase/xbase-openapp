<template>
  <a-modal
    wrapClassName="previewMember"
    centered
    :destroyOnClose="true"
    :title="fileName"
    :visible="visible"
    :footer="null"
    :maskClosable="false"
    :keyboard="false"
    :width="'calc(100% - 48px)'"
    :height="'calc(100% - 48px)'"
    class="pop-ui"
    @cancel="handleCancel"
  >
    <div class="view-box">
      <div class="contenter">
        <div id="contenter_map" ref="contenter_map"></div>
      </div>
    </div>
  </a-modal>
</template>
<script>
import { view_token } from '@/apis/model.js'
import { ResponseStatus } from '@/framework/network/util.js'
import { viewerToken } from '@/utils/setting.js'
export default {
  name: 'viewMember',
  // eslint-disable-next-line vue/require-prop-types
  props: ['visible', 'renderPath', 'fileName', 'fileType'],
  data() {
    return {
      drawVisible: false,
      fileId: sessionStorage.getItem('component_id'),
      viewer: null,
      engine: 'BME',
      app: null
    }
  },
  methods: {
    handleCancel() {
      this.$emit('handlePreviewMember', null, false)
      if (this.app) {
        this.app.destroy()
      }
    },
    // 获取viewer_token
    async getViewerToken() {
      // model（模型）、component（构件）、asset（资产）、scene（场景）
      const result = await view_token({ file_id: this.fileId, viewer_type: 'component' })
      if (result.code !== ResponseStatus.success) return this.$message.error('获取viewerToken失败')
      const {
        data: { token }
      } = result
      return {
        Authorization: viewerToken(token)
      }
    },
    async init() {
      let options = new DX.DefaultConfigs()
      options.staticHost = window.DXYP.sdkServer.staticHost
      options.serverHost = window.DXYP.sdkServer.serverHost
      options.accessToken = await this.getViewerToken()
      options.engine = this.engine === 'BME' ? DX.mode.WEBGL : DX.mode.SME
      options.mainToolbar = []
      window.app = this.app = new DX.GlobalViewer3D('contenter_map')
      this.app.init(options).then(async () => {
        this.viewer = app.getViewer()
        await this.app.mainWindow.openFile(this.renderPath)
        window.mapApp = this.app
        this.viewer.setLanguage(DX.lang.ZH_CN)
        this.viewer.on(DX.Events.SCENE_READY, data => {
          console.log('member  ready')
        })
      })
    }
  },
  mounted() {
    this.init()
  }
}
</script>
<style lang="less" scoped>
pre {
  padding: 12px 24px;
  margin: 0;
  white-space: pre-wrap; /* css-3 */
  white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word; /* Internet Explorer 5.5+ */
  overflow: auto;
  word-break: break-all;
  word-wrap: break-word;
}
.view-box {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.contenter {
  flex-grow: 1;
  overflow: hidden;
  height: 0;
}
#contenter_map {
  height: 100% !important;
  box-sizing: border-box;
  border-top: 1px solid #e8e8e8;
}
::v-deep .ant-modal {
  padding-bottom: 0;
  .ant-modal-title {
    text-align: left !important;
    font-weight: 600;
    color: #333333;
  }
  .ant-modal-close {
    color: #333333;
    &:hover,
    &:focus {
      color: #333333;
    }
  }
  .ant-modal-content {
    height: 100% !important;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .ant-modal-body {
    width: 100%;
    flex: 1;
    overflow: hidden;
    padding: 0 !important;
  }
}
.viewMember {
  min-width: 1366px;
  min-height: 768px;
}
</style>
