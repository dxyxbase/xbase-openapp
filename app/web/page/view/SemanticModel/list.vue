<template>
  <div class="asset-box">
    <div class="head_opr">
      <a-button type="primary" @click="visibleAdd = true">添加</a-button>
      <a-button type="primary" @click="TransVisible = true">模型装配</a-button>
      <Transfer
        @cancel="cancel"
        :selectName="selectName"
        :handleAdd="handleAdd"
        :id="id"
        v-if="TransVisible"
      ></Transfer>
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
            getCheckboxProps: rowSelection.getCheckboxProps
          }"
          :columns="columns"
          :data-source="lists"
          :pagination="false"
          :rowKey="record => record.semantic_model_id"
          class="table-ui"
        >
          <div slot-scope="text" slot="status">
            <div>{{ statuObj[text.toString()] }}</div>
          </div>

          <span slot="size" slot-scope="text">
            {{ text | renderSize }}
          </span>

          <div slot="Action" slot-scope="text, record" class="action-box">
            <a-button
              v-if="record.status === -7 || record.status === -3 || record.status === -2"
              type="link"
              class="actionBtn"
              @click="transform(record)"
            >
              <span>转换</span>
            </a-button>
            <a-button v-if="record.status === -2" type="link" class="actionBtn" @click="transform(record)">
              <span>重新转换</span>
            </a-button>
            <a-button
              v-if="record.status === 1 || record.status === 4"
              type="link"
              class="actionBtn"
              @click="cancelTransform(record)"
            >
              <span>终止</span>
            </a-button>
            <a-button v-if="record.file_type === 'asm'" type="link" class="actionBtn" @click="edit(record)">
              <span>装配编辑</span>
            </a-button>
            <a-button type="link" class="actionBtn" @click="getInfo('model', '语义模型详情', record)">
              <span>语义模型详情</span>
            </a-button>
            <a-button type="link" class="actionBtn" @click="getInfo('model_trans', '语义转换详情', record)">
              <span>语义转换详情</span>
            </a-button>
            <a-button
              type="link"
              :disabled="record.status === 1 || record.status === 4"
              class="actionBtn"
              @click="handleDeletePatch('single', record)"
            >
              <span>删除</span>
            </a-button>
          </div>
        </a-table>
      </div>
      <a-row type="flex" justify="end">
        <a-pagination
          v-if="lists.length"
          style="margin: 12px 24px"
          class="page-ui"
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
      <textarea id="textarea" readonly="readonly" v-model="model_components_info" rows="10"></textarea>
    </a-modal>
    <a-modal
      title="添加模型"
      :visible="visibleAdd"
      :destroyOnClose="true"
      centered
      class="pop-ui"
      width="30rem"
      :maskClosable="false"
      @cancel="visibleAdd = false"
      @ok="sureAdd"
    >
      <a-select mode="multiple" style="width: 100%" placeholder="Please select" @change="handleChange">
        <a-select-option v-for="i in modelTree" :key="i.model_id">
          {{ i.name }}
        </a-select-option>
      </a-select>
    </a-modal>
  </div>
</template>
<script type="text/babel">
import {
  model_list,
  semantic_model_transfrom,
  semantic_model_transfromCancel,
  semantic_model_del,
  model_detail,
  semantic_model_list,
  semantic_model_add,
  semantic_model_info,
  semantic_model_infoTrans
} from '@/apis/model.js'
import { ResponseStatus } from '@/framework/network/util.js'
import Transfer from '../SemanticModel/views/transfer.vue'
export default {
  components: { Transfer },
  data() {
    const rowSelection = {
      getCheckboxProps: record => ({
        props: {
          disabled: record.review_status
        }
      })
    }
    return {
      wsTransInfo: {
        id: '',
        path: '',
        status: ''
      },
      preVisible: false,
      previewFileType: null,
      previewPath: '',
      previewName: '',
      visibleDetail: false,
      details: {},
      visibleRename: false,
      visibleAdd: false,
      TransVisible: false,
      // -7已终止，-3待转换，-2转换失败，0转换成功，1转换中，4排队中
      statuObj: {
        '-7': '已终止',
        '-3': '待转换',
        '-2': '转换失败',
        0: '转换成功',
        1: '转换中',
        4: '排队中'
      },
      is_free: true,
      rowSelection,
      page_num: 1,
      page_size: 10,
      searchForm: {
        page_num: 1,
        page_size: 10
      },
      total: 0,
      selectedRowKeys: [],
      lists: [],
      oldName: null,
      senceID: '',
      modelTree: [],
      selectModel: [],
      title: '',
      model_components_info: '',
      handleType: '',
      id: '',
      selectName: ''
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
  mounted() {
    this.getSenceList()
    this.getModelList()
  },
  methods: {
    cancel() {
      this.TransVisible = false
      this.getSenceList()
    },
    edit(item) {
      this.handleType = 'edit'
      this.selectName = item.name.split('.asm')[0]
      this.id = item.semantic_model_id
      this.TransVisible = true
    },
    handleAdd(visible) {
      this.handleType = 'add'
      this.id = ''
      this.selectName = ''
      this.TransVisible = visible
    },
    // 转换
    async cancelTransform(item) {
      const result = await semantic_model_transfromCancel({ semantic_model_id: item.semantic_model_id })
      if (result.code !== ResponseStatus.success) return
      this.getSenceList()
      this.$message.success('终止成功')
    },
    //  终止转换
    async transform(item) {
      const result = await semantic_model_transfrom({ semantic_model_id: item.semantic_model_id })
      if (result.code !== ResponseStatus.success) return
      this.getSenceList()
      this.$message.success('操作成功')
    },
    handleChange(e) {
      this.selectModel = e
    },
    async sureAdd() {
      if (!this.selectModel.length) return this.$message.error('请选择要添加的模型')
      const result = await semantic_model_add({ model_id_list: this.selectModel })
      if (result.code !== ResponseStatus.success) return
      this.getSenceList()
      this.visibleAdd = false
      this.$message.success('添加成功')
    },
    // 获取模型列表做语义模型源文件
    async getModelList() {
      const result = await model_list({ page_num: 1, page_size: 999 })
      if (result.code !== ResponseStatus.success) return
      this.modelTree = result.data.list.filter(item => {
        return item.file_type === 'rvt' || item.file_type === 'ifc'
      })
    },
    handlePreviewModel() {
      this.preVisible = false
    },
    handleAddAsset() {
      this.visibleAdd = true
    },
    handleAssembly() {
      this.selectAllTags = []
    },
    getSenceList() {
      let params = {
        page_num: this.page_num,
        page_size: this.page_size
      }
      semantic_model_list(params).then(res => {
        if (res.code !== ResponseStatus.success) return
        this.lists = res.data.semantic_model_list
        this.total = res.data.total
        if (this.searchForm.page_num !== 1 && this.lists.length === 0) {
          this.searchForm.page_num = 1
          this.getSenceList()
        }
      })
    },
    // 切换页码
    handlePaging(pageNum) {
      this.page_num = pageNum
      this.searchForm.page_num = pageNum
      this.getSenceList()
    },
    // 改变每页数量
    changePageSize(current, pageSize) {
      this.page_num = 1
      this.searchForm.page_num = 1
      this.page_size = pageSize
      this.searchForm.page_size = pageSize
      this.getSenceList()
    },
    async getInfo(type, title, item) {
      //     semantic_model_info,
      // semantic_model_infoTrans
      this.title = title
      let result = ''
      const params = {
        semantic_model_id: item.semantic_model_id
      }
      if (type === 'model') {
        // 语义模型详情
        result = await semantic_model_info(params)
      } else {
        // 模型转换详情
        result = await semantic_model_infoTrans(params)
      }
      if (result.code !== ResponseStatus.success) return
      this.visibleDetail = true
      try {
        this.model_components_info = JSON.stringify(result.data, null, 4)
      } catch (error) {
        this.model_components_info = ''
      }
    },

    viewPre(item) {
      this.preVisible = true
      this.previewName = item.name
      this.previewPath = item.render_path
      this.previewFileType = item.file_type
      this.wsTransInfo = {
        id: item.semantic_model_id,
        path: item.render_path,
        status: item.status
      }
      sessionStorage.setItem('semantic_model_id', item.semantic_model_id)
    },
    handleDeletePatch(flag, item) {
      if (flag === 'single') {
        this.selectedRowKeys = [item.semantic_model_id]
      }
      var that = this
      this.$confirm({
        content: '此删除操作不可恢复，是否继续？',
        okText: '确认',
        okType: 'primary',
        cancelText: '取消',
        class: 'comfirm-pop',
        centered: true,
        // icon: () => <span></span>,
        onOk: () => {
          const params = {
            semantic_model_ids: that.selectedRowKeys
          }
          semantic_model_del(params).then(res => {
            if (res.code === ResponseStatus.success) {
              this.$message.success('删除成功')
              this.selectedRowKeys = []
              this.getSenceList()
            } else {
              this.selectedRowKeys = []
            }
          })
        },
        onCancel: () => {
          that.selectedRowKeys = []
        }
      })
    }
  },

  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0
    },
    columns() {
      return [
        {
          title: '模型名称',
          dataIndex: 'name',
          key: 'name',
          ellipsis: true,
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '来源',
          dataIndex: 'source_path',
          key: 'source_path',
          width: '240px'
        },
        {
          title: '大小',
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
          title: '创建时间',
          dataIndex: 'create_time',
          key: 'create_time',
          width: '240px'
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
.asset-box {
  width: 100%;
  height: 100%;
  overflow: auto;
}
.asset-box {
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
#textarea {
  width: 100% !important;
  border: none;
}
</style>
