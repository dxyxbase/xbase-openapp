<template>
  <div class="standard-map-class">
    <div class="head-btn">
      <upload-tus
        type="primary"
        up_type="member"
        :is_slice="false"
        :is_free="true"
        style="display: inline-block"
        class="up"
        @refreshInit="upload"
      />
      <a-button :disabled="!hasSelected" type="primary" class="del" @click="handleDeletePatch('patch')">删除</a-button>
    </div>
    <div class="table-box">
      <div v-if="!lists.length" class="noData" style="text-align: center">
        <img :src="require('@/asset/images/nodata.png')" alt="暂无数据" />
        <p>暂无内容</p>
      </div>
      <a-table
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          getCheckboxProps: rowSelection.getCheckboxProps
        }"
        v-else
        :columns="columns"
        :data-source="lists"
        :pagination="false"
        :rowKey="record => record.component_id"
        class="table-ui"
      >
        <div slot="name" slot-scope="text" class="file-name">
          <span>{{ text }}</span>
        </div>
        <div slot-scope="text" slot="status">
          <div>{{ statuObj[text.toString()] }}</div>
        </div>
        <span slot="size" slot-scope="text">
          {{ text | renderSize }}
        </span>
        <div slot="Action" slot-scope="text, record" class="action-box">
          <a-button @click="openTrans(record)" v-if="startCode.includes(record.status)" type="link" class="actionBtn">
            <span>转换</span>
          </a-button>
          <a-button @click="openTrans(record)" v-if="reCode.includes(record.status)" type="link" class="actionBtn">
            <span>重新转换</span>
          </a-button>
          <a-button
            @click="cancelTransform(record)"
            v-if="cancelCode.includes(record.status)"
            type="link"
            class="actionBtn"
          >
            <span>停止转换</span>
          </a-button>
          <a-button @click="handlePre(record)" v-if="reCode.includes(record.status)" type="link" class="actionBtn">
            <span>预览</span>
          </a-button>
          <a-button @click="getInfo('member', '构件详情', record)" type="link" class="actionBtn">
            <span>详情</span>
          </a-button>
          <a-button
            @click="handleDeletePatch('single', record)"
            :disabled="record.status == 1 || record.status == 2"
            type="link"
            class="actionBtn"
          >
            <span>删除</span>
          </a-button>
          <a-button
            v-if="record.status === 0 || record.status === -1"
            @click="getInfo('member_trans', '转换详情', record)"
            type="link"
            class="actionBtn"
          >
            <span>转换详情</span>
          </a-button>
        </div>
      </a-table>
      <a-row type="flex" justify="end">
        <a-pagination
          v-if="!!lists.length"
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
    <!-- 格式转换 -->
    <a-modal
      width="650px"
      centered
      ok-text="确认"
      cancel-text="取消"
      @ok="startTransform"
      title="转换"
      :visible="visibleTransform"
      :destroyOnClose="true"
      class="pop-ui"
      :maskClosable="false"
      @cancel="closeTrans"
    >
      <template>
        <div>
          <div class="item">
            <span class="l">导出材质：</span>
            <a-radio-group v-model="export_material" class="radioGroup">
              <a-radio :value="1" style="margin-right: 20px">是</a-radio>
              <a-radio :value="2">否</a-radio>
            </a-radio-group>
          </div>
          <div class="item">
            <span class="l">导出二维视图：</span>
            <a-radio-group v-model="export_2d_views" class="radioGroup">
              <a-radio :value="1" style="margin-right: 20px">是</a-radio>
              <a-radio :value="2">否</a-radio>
            </a-radio-group>
          </div>
        </div>
      </template>
    </a-modal>
    <!-- 预览 -->
    <viewMember
      v-if="preVisible"
      :visible="preVisible"
      :fileType="previewFileType"
      :renderPath="previewPath"
      :fileName="previewName"
      :wsTransInfo="wsTransInfo"
      @handlePreviewMember="preVisible = false"
    ></viewMember>
  </div>
</template>
<script>
import uploadTus from '@/component/Public/upload_tus.vue'
import {
  model_components_list,
  model_components_detail,
  model_components_transfer_start,
  model_components_transfer_cancel,
  model_components_info,
  model_components_del
} from '@/apis/components.js'
import viewMember from './viewMember'
import { ResponseStatus } from '@/framework/network/util.js'
export default {
  components: { uploadTus, viewMember },
  data() {
    const rowSelection = {
      getCheckboxProps: record => ({
        props: {
          disabled: record.status === 1 || record.status === 2
        }
      })
    }
    return {
      // 文件状态； -7：转换中止，-3：上传成功，-1：转换失败，0：转换成功，1：转换中，2：等待中
      statuObj: {
        '-7': '转换中止',
        '-3': '上传成功',
        '-1': '转换失败',
        0: '转换成功',
        1: '转换中',
        2: '等待中'
      },
      startCode: [-7, -3, -1],
      cancelCode: [1, 2], //终止转换
      reCode: [0], //重新转换
      visibleDetail: false,
      title: '构件详情',
      model_components_info: '',
      rowSelection,
      wsTransInfo: {
        id: '',
        path: '',
        status: ''
      },
      lists: [],
      page_size: 10,
      page_num: 1,
      visibleTransform: false,
      selectedRowKeys: [],
      total: 0,
      form: null,
      preVisible: false,
      previewPath: '',
      previewName: '',
      component_id: null,
      export_material: 2, //导出材质 true:真实 false:着色
      export_2d_views: 2 //导出二维视图 true:是 false:否
    }
  },
  mounted() {
    this.getList()
  },
  created() {
    this.form = this.$form.createForm(this)
  },
  methods: {
    // 构件预览
    handlePre(item) {
      this.preVisible = true
      this.previewName = item.name
      this.previewPath = item.render_path
      this.previewFileType = item.file_type
      this.wsTransInfo = {
        id: item.component_id,
        path: item.render_path,
        status: item.status
      }
      sessionStorage.setItem('component_id', item.component_id)
    },
    closeTrans() {
      this.export_material = 2
      this.export_2d_views = 2
      this.visibleTransform = false
    },
    openTrans(item) {
      const { component_id } = item
      this.component_id = component_id
      this.visibleTransform = true
    },
    async startTransform() {
      const params = {
        component_id: this.component_id,
        export_material: this.export_material === 1,
        export_2d_views: this.export_2d_views === 1
      }
      const result = await model_components_transfer_start(params)
      if (result.code !== ResponseStatus.success) return
      this.closeTrans()
      this.$message.success('操作成功')
      this.getList()
    },
    async cancelTransform(item) {
      const { component_id } = item
      const result = await model_components_transfer_cancel({ component_id: component_id })
      if (result.code !== ResponseStatus.success) return
      this.$message.success('操作成功')
      this.getList()
    },
    // 详情
    async getInfo(type = 'member', title = '详情', item) {
      this.title = title
      let result = ''
      const params = {
        component_id: item.component_id
      }
      if (type === 'member') {
        result = await model_components_detail(params)
      } else {
        result = await model_components_info(params)
      }
      if (result.code !== ResponseStatus.success) return
      this.visibleDetail = true
      try {
        this.model_components_info = JSON.stringify(result.data, null, 4)
      } catch (error) {
        this.model_components_info = ''
      }
    },
    upload() {
      this.getList()
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    handleDeletePatch(flag, item) {
      if (flag === 'single') {
        this.selectedRowKeys = [item.component_id]
      }
      this.$confirm({
        content: '此删除操作不可恢复，是否继续？',
        okText: '确认',
        okType: 'primary',
        cancelText: '取消',
        class: 'comfirm-pop',
        centered: true,
        onOk: () => {
          const params = {
            component_ids: this.selectedRowKeys
          }
          model_components_del(params).then(res => {
            if (res.code === ResponseStatus.success) {
              this.$message.success('删除成功')
              this.selectedRowKeys = []
              this.getList()
            } else {
              this.selectedRowKeys = []
            }
          })
        },
        onCancel: () => {
          this.selectedRowKeys = []
        }
      })
    },
    handlePaging(pageNum) {
      this.page_num = pageNum
      this.getList()
    },
    changePageSize(current, pageSize) {
      this.page_num = 1
      this.page_size = pageSize
      this.getList()
    },
    async getList() {
      let params = {
        page_size: this.page_size,
        page_num: this.page_num
      }
      const res = await model_components_list(params)
      if (res.code !== ResponseStatus.success) return
      const {
        data: { list = [], total = 0 }
      } = res
      this.lists = list || []
      this.total = total
      if (this.page_num !== 1 && !list.length) {
        this.page_num = 1
        this.getList()
      }
    }
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0
    },
    columns() {
      return [
        {
          title: '构件名称',
          dataIndex: 'name',
          key: 'name',
          ellipsis: true,
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '格式',
          dataIndex: 'file_type',
          scopedSlots: { customRender: 'file_type' },
          key: 'file_type',
          width: '20%'
        },
        {
          title: '大小',
          width: '20%',
          key: 'size',
          dataIndex: 'size',
          scopedSlots: { customRender: 'size' },
          ellipsis: true
        },
        {
          title: '状态',
          width: '100px',
          key: 'status',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
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
  }
}
</script>
<style lang="less" scoped>
#textarea {
  width: 100% !important;
  border: none;
}
.item {
  margin-bottom: 12px;
  display: flex;
  gap: 20px;
  > span {
    width: 100px;
    flex-shrink: 0;
    text-align: right;
  }
}
.head-btn {
  border-bottom: 1px solid #f2f2f7;
  display: flex;
  justify-content: flex-start;
  gap: 18px;
  align-items: center;
  padding: 18px 0;
}
</style>
