<template>
  <div class="viewModel">
    <a-modal
      wrapClassName="previewModal"
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
        <div class="top-change" v-if="!isHidden">
          <a-row type="flex" justify="space-between" align="top">
            <a-col :span="6">
              <div class="left-opr">
                <a-radio-group @change="changeEngine" :default-value="engine" button-style="solid">
                  <a-radio-button v-for="item in engineList" :key="item.value" :value="item.value">
                    {{ item.label }}
                  </a-radio-button>
                </a-radio-group>
              </div>
            </a-col>
            <a-col :span="6">
              <div class="right-opr">
                <a-button type="primary" @click="showPort">视点</a-button>
              </div>
            </a-col>
          </a-row>
        </div>
        <div class="contenter">
          <div id="contenter_map" ref="contenter_map"></div>
          <a-drawer
            width="22rem"
            title="视点列表"
            placement="right"
            :closable="false"
            :visible="drawVisible"
            :get-container="false"
            :wrap-style="{ position: 'absolute' }"
            @close="drawVisible = false"
          >
            <div class="drawBox">
              <div class="drawHeader"><a-button type="primary" @click="addPort">新增</a-button></div>
              <div class="drawContent">
                <div class="drawList">
                  <div class="card_" v-for="item in portList" :key="item.viewport_id">
                    <a-card hoverable style="width: 100%">
                      <div class="img-box">
                        <div v-viewer>
                          <img slot="cover" :alt="item.desc" :src="item.image" />
                        </div>
                      </div>

                      <a-card-meta>
                        <template slot="description">{{ item.desc }}</template>
                      </a-card-meta>
                      <div class="ant-card-actions">
                        <a-popconfirm
                          title="确定删除此视点吗？"
                          ok-text="确定"
                          cancel-text="取消"
                          @confirm="confirm(item)"
                          @cancel="cancel"
                        >
                          <a-icon type="delete" />
                        </a-popconfirm>
                        <a-icon type="file-text" @click="viewImg(item)" />
                        <a-icon type="environment" @click="setSelect(item)" />
                      </div>
                    </a-card>
                  </div>
                </div>
              </div>
              <div class="pagination">
                <a-pagination
                  size="small"
                  hideOnSinglePage
                  show-quick-jumper
                  show-size-changer
                  :current="page_num"
                  :total="total"
                  :pageSize="page_size"
                  @change="handlePaging"
                  @showSizeChange="changePageSize"
                />
              </div>
            </div>
          </a-drawer>
        </div>
      </div>
    </a-modal>
    <div class="createDialog">
      <a-modal
        v-model="visiblePort"
        centered
        title="创建视点"
        width="30rem"
        class="createDialog"
        :keyboard="false"
        :destroyOnClose="true"
        :maskClosable="false"
        :okButtonProps="{ props: { disabled: loading } }"
        @cancel="handleCancelPort"
        @ok="handleOk"
      >
        <!-- :confirmLoading="loading" -->
        <div class="viewport">
          <a-form-model
            ref="ruleForm"
            :model="form"
            :rules="rules"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 19 }"
            labelAlign="left"
          >
            <a-form-model-item label="视点描述" :colon="false" prop="desc">
              <a-input
                ref="descRef"
                v-model="form.desc"
                :maxLength="200"
                type="textarea"
                placeholder="请输入备注"
                class="textarea"
                :disabled="loading"
                @change="onChange"
              />
            </a-form-model-item>
            <img v-show="thumbnail" class="pointImg" :src="thumbnail" alt="err" />
            <div v-show="!thumbnail" class="pointImg loading-wrp">
              <span class="dot dot-spin">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
              </span>
              <p>加载中，请等待</p>
            </div>
          </a-form-model>
        </div>
      </a-modal>
    </div>
    <a-modal
      v-model="viewPreDetail"
      centered
      title="视点详情"
      width="30rem"
      :footer="null"
      class="createDialog"
      :keyboard="false"
      :destroyOnClose="true"
      :maskClosable="false"
      @cancel="viewPreDetail = false"
    >
      <pre>
    {{ activeItem }}
   </pre
      >
    </a-modal>
  </div>
</template>
<script>
import { view_token } from '@/apis/model.js'
import { port_add, port_list, port_del, scene_detail } from '@/apis/port.js'
import { ResponseStatus } from '@/framework/network/util.js'
import { viewerToken } from '@/utils/setting.js'
export default {
  name: 'viewModel',
  // eslint-disable-next-line vue/require-prop-types
  props: ['visible', 'renderPath', 'fileName', 'fileType'],
  data() {
    const validateDesc = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入视点描述'))
      } else {
        callback()
      }
    }
    return {
      drawVisible: false,
      fileId: sessionStorage.getItem('model_id'),
      loaded: false,
      viewer: null,
      viewPreDetail: false,
      imgName: null,
      loading: false,
      thumbnail: '',
      modelStatus: '',
      page_num: 1,
      page_size: 10,
      portList: [],
      total: 0,
      activeItem: {},
      seleteItem: {},
      form: {
        desc: ''
      },
      rules: {
        desc: [{ validator: validateDesc, trigger: 'blur' }]
      },
      // ,WEBGL,SME
      engine: 'BME',
      app: null,
      isHidden: false,
      // TWOD    ,WEBGL,SME,    HYBRID,CESUIM
      engineList: [
        {
          label: 'BME', //DX.mode.WEBGL
          value: 'BME'
        },
        {
          label: 'SME', // DX.mode.SME
          value: 'SME'
        }
      ],
      visiblePort: false
    }
  },
  methods: {
    viewImg(item) {
      // 查询视点详情
      scene_detail({ viewport_id: item.viewport_id }).then(res => {
        if (res.code !== ResponseStatus.success) return this.$message.error('查询失败')
        this.activeItem = item
        this.viewPreDetail = true
      })
    },
    confirm(e) {
      let params = {
        viewport_ids: [e.viewport_id]
      }
      port_del(params).then(res => {
        if (res.code !== ResponseStatus.success) return
        this.getPortList()
        this.$message.success('删除成功')
      })
    },
    cancel(e) {},
    showPort() {
      this.drawVisible = true
      this.getPortList()
    },
    // 切换页码
    handlePaging(pageNum) {
      this.page_num = pageNum
      this.getPortList()
    },
    getPortList() {
      let params = {
        file_id: this.fileId,
        page_num: this.page_num,
        page_size: this.page_size
      }
      port_list(params).then(res => {
        if (res.code !== ResponseStatus.success) return
        this.portList = res.data.list || []
        this.total = res.data.total || 0
      })
    },
    // 改变每页数量
    changePageSize(current, pageSize) {
      this.page_num = 1
      this.page_size = pageSize
      this.getPortList()
    },
    textareaLimit(val) {
      const reg = /[`~!#$%^&*()_\-\+=<>?:"'{}|~！#￥%……&*（）={}|《》？：“”【】；‘’]/g
      return val.replace(reg, '')
    },
    handleCancelPort() {
      this.form.desc = ''
      this.visiblePort = false
      this.modelStatus = ''
    },
    onChange() {
      this.form.desc = this.textareaLimit(this.form.desc)
    },
    handleCancel() {
      this.$emit('handlePreviewModel', null, false)
      if (this.app) {
        this.app.destroy()
        this.app = null
        this.viewer = null
      }
    },
    changeEngine(e) {
      this.engine = e.target.value
      if (this.app) {
        this.app.destroy()
        this.app = null
        this.viewer = null
      }
      this.init()
    },
    addPort() {
      this.visiblePort = true
      this.thumbnail = ''
      this.loading = true
      setTimeout(() => {
        this.viewer.takeSnapshotAsync('viewPoint', res => {
          const { image, status } = res
          this.thumbnail = image
          this.modelStatus = status
          this.loading = false
          this.$nextTick(() => {
            this.$refs.descRef.focus()
          })
        })
      }, 50)
    },
    async setSelect(item) {
      const { code, data } = await scene_detail({ viewport_id: item.viewport_id })
      if (code !== 0) {
        return
      }
      if (!data.params) return
      this.drawVisible = false
      const snapshot = { status: JSON.parse(data.params) }
      this.viewer.viewSnapshot(snapshot)
    },
    // 新增视点
    handleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loading = true
          const params = {
            file_id: this.fileId,
            file_type: 1, //视点源文件类型： 1模型 2资产 3场景 4构件(暂只支持模型)
            params: JSON.stringify(this.modelStatus),
            desc: this.form.desc,
            image: this.thumbnail
          }
          port_add(params)
            .then(response => {
              const { code } = response
              if (code !== ResponseStatus.success) return
              this.$message.success('视点新建成功')
              this.getPortList()
              this.handleCancelPort()
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    },
    // 获取viewer_token
    async getViewerToken() {
      // model（模型）、component（构件）、asset（资产）、scene（场景）
      const result = await view_token({ file_id: this.fileId, viewer_type: 'model' })
      if (result.code !== ResponseStatus.success) return this.$message.error('获取viewerToken失败')
      const {
        data: { token }
      } = result
      return {
        Authorization: viewerToken(token)
      }
    },
    async init() {
      await new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, 300)
      })
      let options = new window.DX.DefaultConfigs()
      // 设置静态资源域的地址
      options.staticHost = window.DXYP.sdkServer.staticHost
      // 设置服务域的地址
      options.serverHost = window.DXYP.sdkServer.serverHost
      // 添加token
      options.accessToken = await this.getViewerToken()
      options.engine = this.engine === 'BME' ? DX.mode.WEBGL : DX.mode.SME
      if (/dwg/i.test(this.fileType)) {
        options.engine = window.DX.mode.TWOD
        this.isHidden = true
      }
      options.mainToolbar = []
      //创建app实例
      window.app = this.app = new window.DX.GlobalViewer3D('contenter_map')
      //初始化应用
      this.app.init(options).then(async () => {
        // 获取viewer实例
        this.viewer = this.app.getViewer()
        // 上传模型之后拿到对应模型路径（1.通过上传接口的返回结果拿到对应path，2.通过模型管理界面上传之后更多中渲染路径获取）
        await this.app.mainWindow.openFile(this.renderPath)
        window.mapApp = this.app
        // this.viewer.enableFullScreen(true)
        // this.viewer.setLanguage(DX.lang.EN_US)
        // 切换简体版本
        this.viewer.setLanguage(DX.lang.ZH_CN)
        // 点击模型构件，选中构件后孤立
        // this.viewer.on(DX.Events.ENTITY_SELECTED, data => {
        //   if (data.selectionIds[0]) {
        //     this.viewer.aloneEntities(data.selectionIds[0])
        //   }
        // })
        this.viewer.on(DX.Events.SCENE_READY, data => {
          console.log('model  ready')
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
.img-box {
  width: 100%;
  > div,
  img {
    width: 100%;
  }
}
.pagination {
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep .ant-card-body {
  padding: 12px 12px 0;
}
::v-deep .ant-card-actions {
  height: 30px;
  display: flex;
  gap: 12px;
  justify-content: flex-start;
  align-items: center;
  font-size: 18px;
  border-top: none;
  margin: 0;
  margin-top: 12px;
  > i:hover {
    color: #267ef0;
  }
}
.drawList {
  height: 100%;
  overflow: auto;
}
::v-deep .ant-drawer-wrapper-body {
  height: 100%;
  display: flex;
  flex-direction: column;
  .ant-drawer-header {
    padding: 12px 6px;
  }
  .ant-drawer-body {
    padding: 12px 6px;
    height: 0;
    overflow: hidden;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    .drawBox {
      display: flex;
      gap: 12px;
      flex-direction: column;
    }
    .drawBox,
    .drawContent {
      height: 0;
      overflow: hidden;
      flex-grow: 1;
    }
  }
}
.viewport {
  padding: 24px;
}
.view-box {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.top-change {
  padding: 12px 24px;

  .right-opr {
    display: flex;
    justify-content: flex-end;
    text-align: right;
  }
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
    //height: 90%;
    width: 100%;
    flex: 1;
    overflow: hidden;
    padding: 0 !important;
  }
}
.viewModel {
  min-width: 1366px;
  min-height: 768px;
  position: absolute;
  .previewTop {
    height: 40px;
    background: #f8f8f8;
    border: 1px solid #e7e7e7;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 24px;
    .ant-divider {
      background: rgba(7, 15, 26, 0.2) !important;
      margin: 0 10px;
      height: 18px;
    }
    .disabled {
      color: #cccccc;
      cursor: not-allowed;
    }
    .openViewPoint {
      color: #267ef0 !important;
    }
    & > span {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #10141a;
      svg {
        font-size: 14px;
        margin-right: 7px;
        position: relative;
        top: 1px;
      }
      .btn {
        font-size: 12px !important;
      }
    }
    & > span:hover:not(.disabled) {
      color: #267ef0;
      cursor: pointer;
    }
  }
  .modelView {
    height: 100%;
  }
  .modelViewPoint {
    height: calc(100% - 40px);
  }
}
.createDialog {
  .textarea {
    resize: none;
    height: 80px !important;
    width: 339px !important;
    margin: 0 !important;
  }
  .ant-modal-header {
    padding: 13px 24px;
  }
  .ant-modal-title {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: #10141a;
  }
  .ant-modal-body {
    padding: 22px 36px 24px;
  }
  .ant-modal-footer {
    border: none;
    padding-top: 0;
    padding-bottom: 24px;
    button {
      min-width: 72px;
      height: 30px;
    }
    button + button {
      margin-left: 12px;
    }
    & > div {
      text-align: center;
    }
  }
  .ant-form-item-required::before {
    display: none;
  }
  .ant-form-item {
    margin-bottom: 18px;
  }
  .ant-form-explain {
    margin: 0;
    font-size: 12px;
    min-height: auto;
  }
  .ant-form-item-with-help {
    margin: 0;
  }
  .ant-form-item-label {
    line-height: 28px !important;
    & > label {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #282828 !important;
      white-space: pre-line;
    }
  }
  .pointImg {
    width: 100%;
    height: 236px;
    border-radius: 2.69px;
    object-fit: contain;
    border: 1px solid #e7e7e7;
    &.loading-wrp {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: 98px;
      p {
        margin-top: 25px;
        margin-bottom: 0px;
        font-size: 12px;
      }
    }
  }
}
</style>
