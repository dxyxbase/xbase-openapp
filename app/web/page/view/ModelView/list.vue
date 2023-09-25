<template>
  <div class="model-box">
    <div class="head_opr">
      <upload-tus
        type="primary"
        up_type="model"
        :is_slice="false"
        :is_free="is_free"
        style="display: inline-block"
        class="up"
        @refreshInit="upload"
      />
      <!-- <upload-tus type="primary" up_type="model" :is_slice="true" :is_free="is_free" style="display: inline-block" class="up" @refreshInit="upload" /> -->
      <a-button type="primary" class="btn1" @click="handleAssembly(false, {})">模型装配</a-button>
      <a-button :disabled="!hasSelected" class="del" @click="handleDeletePatch('patch')">删除</a-button>
    </div>
    <div class="sceneTableOutContent">
      <div>
        <div v-if="lists.length === 0" class="noData" style="text-align: center">
          <img :src="require('@/asset/images/nodata.png')" alt="暂无数据" />
          <p>暂无内容</p>
        </div>
        <a-table
          v-else
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
            getCheckboxProps: rowSelection.getCheckboxProps
          }"
          :columns="columns"
          :data-source="lists"
          :pagination="false"
          :rowKey="record => record.model_id"
          class="table-ui"
        >
          <div slot="name" slot-scope="text" class="file-name">
            <img :src="require('@/asset/images/scene.png')" alt="" />
            <span key="preview" type="link" class="actionBtn">
              {{ text }}
            </span>
          </div>
          <span slot="size" slot-scope="text">
            {{ text | renderSize }}
          </span>
          <div slot-scope="text" slot="status">
            <div>{{ statuObj[text.toString()] }}</div>
          </div>
          <!-- 操作 -->
          <div slot="Action" slot-scope="text, record" class="action-box">
            <a-button
              v-if="record.status * 1 !== 1 && record.file_type !== 'asm' && record.status * 1 !== 4"
              key="preview"
              type="link"
              class="actionBtn"
              @click="transfer(record)"
            >
              <span>{{ record.status * 1 === 0 ? '重新转换' : '转换' }}</span>
            </a-button>
            <a-button
              v-if="record.file_type === 'asm'"
              type="link"
              class="actionBtn"
              @click="handleAssembly(true, record)"
            >
              <span>编辑装配</span>
            </a-button>
            <a-button
              v-show="record.status * 1 === 1 || record.status * 1 === 4"
              key="stop"
              type="link"
              class="actionBtn"
              @click="cancelTranslation(record)"
            >
              <span>终止转换</span>
            </a-button>

            <a-tooltip>
              <template slot="title">
                模型预览之前请先确认此应用已具有对应的渲染服务权限，否则可能会出现token无效，无法预览的情况！
              </template>
              <a-button v-show="record.status * 1 === 0" type="link" class="actionBtn" @click="handlePre(record)">
                <span>预览</span>
              </a-button>
            </a-tooltip>

            <a-button type="link" class="actionBtn" @click="handleDetail(record, 'detail')">
              <span>详情</span>
            </a-button>

            <a-dropdown placement="bottomCenter">
              <a-button key="more" type="link" class="actionBtn">
                <span>更多</span>
              </a-button>
              <a-menu slot="overlay" class="action-drop">
                <a-menu-item
                  v-show="record.status * 1 === 0 && record.file_type !== 'asm'"
                  :style="record.status !== 0 ? 'color:#ccc!important;cursor:not-allowed' : ''"
                >
                  <a href="javascript:;" @click="handleDetail(record, 'transformdetail')">转换详情</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;" @click="downLoad(record)">模型下载</a>
                </a-menu-item>
                <!-- <a-menu-item>
                <a href="javascript:;" @click="handleDetail(record, 'status')">模型状态</a>
              </a-menu-item> -->

                <a-menu-item>
                  <a href="javascript:;" @click="handleDetail(record, 'attr')">模型属性</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;" @click="queryAttr(record)">查找模型属性</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;" @click="getTree(record)">模型构件树</a>
                </a-menu-item>
                <a-menu-item v-if="record.status !== 1 && record.status !== 4">
                  <a
                    href="javascript:;"
                    :class="{ notAllowed: record.review_status }"
                    @click="handleDeletePatch('single', record)"
                  >
                    删除
                  </a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </a-table>
      </div>
      <a-row type="flex" justify="end">
        <a-pagination
          style="margin: 12px 24px"
          v-if="lists.length"
          size="small"
          show-quick-jumper
          show-size-changer
          :current="page_num"
          :total="total"
          :pageSize="page_size"
          @change="handlePaging"
          @showSizeChange="changePageSize"
        />
      </a-row>
    </div>
    <!-- 转换 -->

    <transfer
      v-if="visibleTransfer"
      :visible="visibleTransfer"
      :tempItem="tempItem"
      :disabled="transferDisabled"
      @closeTransfer="closeTransfer"
      @fetchTransfer="fetchTransfer"
    ></transfer>
    <a-modal
      :title="title"
      :visible="visibleDetail"
      :destroyOnClose="true"
      :footer="null"
      centered
      class="pop-ui"
      width="40rem"
      :maskClosable="false"
      @cancel="visibleDetail = false"
    >
      <detail v-if="visibleDetail" :title="title" :visible="visibleDetail" :tempItem="detailTemp"></detail>
    </a-modal>
    <a-modal
      title="查找模型属性"
      :visible="visiblequeryAttr"
      :destroyOnClose="true"
      :footer="null"
      centered
      class="pop-ui"
      width="40rem"
      :maskClosable="false"
      @cancel="visiblequeryAttr = false"
    >
      <queryAttr v-if="visiblequeryAttr" :item="queryItem" :visible="visiblequeryAttr"></queryAttr>
    </a-modal>

    <a-modal
      title="查找模型属性"
      :visible="visiblequeryModel"
      :destroyOnClose="true"
      :footer="null"
      centered
      class="pop-ui"
      width="40rem"
      :maskClosable="false"
      @cancel="visiblequeryModel = false"
    >
      <queryModel v-if="visiblequeryModel" :item="queryModel" :visible="visiblequeryModel"></queryModel>
    </a-modal>
    <!-- 模型预览 -->
    <viewModel
      v-if="preVisible"
      :visible="preVisible"
      :fileType="previewFileType"
      :renderPath="previewPath"
      :fileName="previewName"
      :wsTransInfo="wsTransInfo"
      @handlePreviewModel="handlePreviewModel"
    ></viewModel>
    <!-- 模型装配 -->
    <assembly
      v-if="visibleAssembly"
      :isEdit="isEdit"
      :visible="visibleAssembly"
      :assItem="assItem"
      @assemblyClose="assemblyClose"
    ></assembly>
  </div>
</template>
<script type="text/babel">
import transfer from './components/transfer.vue'
import viewModel from './viewModel/index.vue'
import assembly from './components/assembly.vue'
import {
  model_list,
  model_del,
  model_translation,
  model_detail,
  model_cancel_translation,
  model_transform_detail,
  model_attr
} from '@/apis/model.js'
import { ResponseStatus } from '@/framework/network/util.js'
import detail from './components/detail.vue'
import queryAttr from './components/queryAttr.vue'
import queryModel from './components/queryModel.vue'
import uploadTus from '@/component/Public/upload_tus.vue'
import { fileModel } from '@/utils/setting.js'
export default {
  components: { viewModel, transfer, detail, queryAttr, queryModel, assembly, uploadTus },
  data() {
    const rowSelection = {
      getCheckboxProps: record => ({
        props: {
          disabled: record.status === 1 || record.status === 4
        }
      })
    }

    return {
      isEdit: false,
      assItem: {},
      visibleAssembly: false,
      preVisible: false,
      previewFileType: null,
      previewPath: '',
      previewName: '',
      wsTransInfo: {
        id: '',
        path: '',
        status: ''
      },
      visibleDetail: false,
      visiblequeryModel: false,
      queryModel: {},
      detailTemp: null,
      visibleTransfer: false,
      tempItem: {},
      queryItem: null,
      transferDisabled: false,
      title: '-',
      visiblequeryAttr: false,
      rowSelection,
      searchForm: {
        page_num: 1,
        page_size: 10,
        order: 4,
        sort: 0
      },
      // 文件状态； -7：转换中止，-3：上传成功，-2：转换失败，0：转换成功，1：转换中，4：等待中
      statuObj: {
        '-7': '转换中止',
        '-3': '上传成功',
        '-2': '转换失败',
        0: '转换成功',
        1: '转换中',
        4: '等待中'
      },
      total: 0,
      page_num: 1,
      page_size: 10,
      selectedRowKeys: [],
      lists: [],
      selectAllTags: [],

      isPatchDelete: false,
      isPatch: true,
      is_free: true,
      content: {
        parent_id: '123'
      }
    }
  },
  filters: {
    renderSize(value) {
      if (!value) {
        return '—'
      }
      if (value == null) {
        return '0 Bytes'
      }
      // eslint-disable-next-line no-array-constructor
      var unitArr = new Array('Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB')
      var index = 0
      var srcsize = parseFloat(value)
      index = Math.floor(Math.log(srcsize) / Math.log(1024))
      var size = srcsize / Math.pow(1024, index)
      size = size.toFixed(2) // 保留的小数位数
      return size + unitArr[index]
    }
  },
  methods: {
    assemblyClose() {
      this.visibleAssembly = false
      this.getModelList()
    },
    handleAssembly(type, item) {
      this.isEdit = type
      if (type) {
        this.assItem = item
      }
      this.visibleAssembly = true
    },
    // 模型预览
    handlePre(item) {
      this.preVisible = true
      this.previewName = item.name
      this.previewPath = item.render_path
      this.previewFileType = item.file_type
      this.wsTransInfo = {
        id: item.model_id,
        path: item.render_path,
        status: item.status
      }
      sessionStorage.setItem('model_id', item.model_id)
    },
    handlePreviewModel() {
      this.preVisible = false
    },
    getTree(item) {
      this.visiblequeryModel = true
      this.queryModel = item
    },
    // 查找模型属性
    queryAttr(item) {
      this.visiblequeryAttr = true
      this.queryItem = item
    },
    // 模型下载
    async downLoad(item) {
      const tempLink = document.createElement('a')
      tempLink.style.display = 'none'
      tempLink.href = `/router/model/download?model_id=${item.model_id}`
      if (typeof tempLink.download === 'undefined') {
        tempLink.setAttribute('target', '_blank')
      }
      document.body.appendChild(tempLink)
      tempLink.click()
      document.body.removeChild(tempLink)
    },
    // 终止转换
    cancelTranslation(item) {
      model_cancel_translation({ model_id: item.model_id })
        .then(res => {
          if (res.code !== ResponseStatus.success) return
          this.$message.success('终止转换成功')
          this.getModelList()
        })
        .catch(() => {
          this.$message.error('终止失败')
        })
    },
    transfer(text, flag) {
      this.tempItem = text
      if (fileModel.indexOf(this.tempItem.file_type) !== -1) {
        this.visibleTransfer = true
      } else {
        this.$message.warning('格式出错')
      }
    },
    //模型转换
    fetchTransfer(params, close) {
      if (close) {
        this.transferDisabled = true
      }
      model_translation(params)
        .then(res => {
          if (res.code === ResponseStatus.success) {
            this.$message.success('操作成功')
            this.getModelList()
          }
        })
        .finally(() => {
          if (close) {
            this.transferDisabled = false
            this.closeTransfer()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    closeTransfer(flag) {
      if (flag === 'sure') {
        this.getModelList()
      }
      this.visibleTransfer = false
    },
    // 删除
    handleDeletePatch(flag, item) {
      this.deleteFlag = flag
      this.isPatch = true
      if (flag === 'single') {
        this.selectedRowKeys = [item.model_id]
      }
      this.isPatchDelete = false

      var that = this
      this.$confirm({
        content: '此删除操作不可恢复，是否继续？',
        okText: '确认',
        okType: 'primary',
        cancelText: '取消',
        class: 'comfirm-pop',
        centered: true,
        onOk: () => {
          const params = {
            model_ids: that.selectedRowKeys
          }
          model_del(params).then(res => {
            if (res.code === ResponseStatus.success) {
              this.$message.success('删除成功')
              this.selectedRowKeys = []
              this.getModelList()
            } else {
              this.selectedRowKeys = []
            }
          })
        },
        onCancel: () => {
          that.isPatch = true
          that.selectedRowKeys = []
        }
      })
    },

    upload() {
      this.getModelList()
    },
    getModelList() {
      model_list(this.searchForm).then(res => {
        if (res.code !== ResponseStatus.success) return
        this.lists = res.data.list
        this.total = res.data.total

        if (this.searchForm.page_num !== 1 && res.data.list.length === 0) {
          this.searchForm.page_num = 1
          this.getModelList()
        }
      })
    },
    // 表格选择发生变化
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    // 切换页码
    handlePaging(pageNum) {
      this.page_num = pageNum
      this.searchForm.page_num = pageNum
      this.getModelList()
    },
    // 改变每页数量
    changePageSize(current, pageSize) {
      this.page_num = 1
      this.searchForm.page_num = 1
      this.page_size = pageSize
      this.searchForm.page_size = pageSize
      this.getModelList()
    },
    handleDetail(modelInfo, msg) {
      this.visibleDetail = false

      if (msg === 'detail') {
        this.title = `${modelInfo.name}详情`
        model_detail({ model_id: modelInfo.model_id })
          .then(res => {
            if (res.code !== ResponseStatus.success) return
            this.detailTemp = res.data
            this.visibleDetail = true
          })
          .catch(() => {
            this.$message.error('查询详情失败')
          })
      } else if (msg === 'transformdetail') {
        this.title = `${modelInfo.name}转换详情`
        model_transform_detail({ model_id: modelInfo.model_id })
          .then(res => {
            if (res.code !== ResponseStatus.success) return
            this.detailTemp = res.data
            this.visibleDetail = true
          })
          .catch(() => {
            this.$message.error('查询转换详情失败')
          })
      } else if (msg === 'status') {
        this.title = `${modelInfo.name}状态`
        // model_status({ path: modelInfo.render_path }).then(res => {
        //   if (res.code !== ResponseStatus.success) return
        //   this.detailTemp = res.data
        //   this.visibleDetail = true
        // })
      } else if (msg === 'attr') {
        this.title = `${modelInfo.name}属性`
        let query = { path: modelInfo.render_path, page_num: 1, page_size: 20 }
        model_attr(query).then(res => {
          if (res.code !== ResponseStatus.success) return
          this.detailTemp = res.data
          this.visibleDetail = true
        })
      }
    }
  },
  mounted() {
    this.getModelList()
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0
    },
    columns() {
      return [
        {
          title: '文件名称',
          dataIndex: 'name',
          key: 'name',
          ellipsis: true,
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '文件扩展名',
          dataIndex: 'file_type',
          key: 'file_type',
          width: '140px'
        },
        {
          title: '文件大小',
          width: '140px',
          key: 'size',
          dataIndex: 'size',
          scopedSlots: { customRender: 'size' },
          ellipsis: true
        },

        {
          title: '文件状态',
          width: '140px',
          key: 'status',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
          ellipsis: true
        },
        {
          title: '操作',
          key: 'action',
          dataIndex: 'action',
          width: '400px',
          scopedSlots: { customRender: 'Action' }
        }
      ]
    }
  }
}
</script>
<style lang="less" scoped>
.model-box {
  width: 100%;
  height: 100%;
  .head_opr {
    border-bottom: 1px solid #f2f2f7;
    display: flex;
    justify-content: flex-start;
    gap: 18px;
    align-items: center;
    padding: 18px 0;
  }
  .sceneTableOutContent {
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    // min-height: 100% !important;
    .noData {
      width: 240px;
      margin: 0 auto;
      margin-top: 10%;
      img {
        width: 240px;
        height: 200px;
      }
      p {
        margin-top: 18px !important;
        margin-bottom: 0;
        font-size: 16px;
        font-family: SourceHanSansSC-Normal, SourceHanSansSC;
        font-weight: 400;
        color: #666666;
      }
    }
    .sceneTable {
      height: 100%;
      color: #000;
      /deep/ .ant-table-thead {
        tr > th {
          background: #f5f8fd;
        }
      }
    }
  }
  .sceneIcon {
    display: inline-block;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #f5f8fd;
    margin-right: 14px;
    i {
      color: #0e80e7;
      font-size: 24px;
      margin: 3px;
    }
  }
  .nameTitle {
    cursor: pointer;
    display: flex;
    align-items: center;
    // 名称图标
    .name-icon {
      margin-right: 6px;
      width: 24px;
      height: 24px;
    }
  }
}
</style>
