<template>
  <div class="model-class">
    <div class="head-btn">
      <a-button @click="downLoad" type="primary">模板下载</a-button>
      <importTemplate></importTemplate>
    </div>
    <div class="table-box">
      <div v-if="lists.length === 0" class="noData" style="text-align: center">
        <img :src="require('@/asset/images/nodata.png')" alt="暂无数据" />
        <p>暂无内容</p>
      </div>

      <a-table v-else :columns="columns" :data-source="lists" :pagination="false" :rowKey="record => record.standard_id" class="table-ui">
        <div slot="name" slot-scope="text, record" class="file-name">
          <a-button key="name" class="tdName" type="link" @click="goDetail(record)">
            <span>{{ text }}</span>
          </a-button>
        </div>
        <div slot="type" key="type" slot-scope="text">
          <span>{{ parseInt(text) === 1 ? '公共标准' : '自定义标准' }}</span>
        </div>
        <div slot="status" key="status" slot-scope="text, record">
          <span>{{ record.version_list.length > 0 ? standardStatu[record.version_list[0].status] : '-' }}</span>
        </div>
        <div slot="description" key="description" slot-scope="text, record">
          <span>{{ record.version_list.length > 0 ? record.version_list[0].description || '-' : '-' }}</span>
        </div>
        <div slot="update_time" key="update_time" slot-scope="text, record">
          <span>{{ record.version_list.length > 0 ? record.version_list[0].update_time : '-' }}</span>
        </div>
        <div slot="Action" slot-scope="text, record" class="action-box">
          <a-button type="link" class="actionBtn" @click="handleDetail(record)">
            <span>详情</span>
          </a-button>
          <a-button :disabled="record.type === 1" v-if="[2, 3].includes(record.version_list[0].status)" type="link" class="actionBtn" @click="model_publish(record)">
            <span>{{ record.version_list[0].status === 2 ? '发布' : '卸载' }}</span>
          </a-button>
          <!-- <a-button @click="handleEdit(record)" :disabled="record.version_list[0].status === 3" key="edit" type="link" class="actionBtn">
            <span>编辑</span>
          </a-button> -->
          <a-button @click="del(record)" :disabled="record.version_list[0].status === 3" key="del" type="link" class="actionBtn">
            <span>删除</span>
          </a-button>
        </div>
      </a-table>
      <a-row type="flex" justify="end">
        <a-pagination v-if="lists.length" style="margin: 12px 24px" class="page-ui" size="small" show-quick-jumper show-size-changer :current="page_num" :total="total" :pageSize="page_size" @change="handlePaging" @showSizeChange="changePageSize" />
      </a-row>
    </div>
    <!-- 详情 -->
    <a-modal title="详情" :visible="visibleDetail" :destroyOnClose="true" :footer="null" centered class="pop-ui" width="30rem" :maskClosable="false" @cancel="visibleDetail = false">
      <div class="details" v-if="visibleDetail">
        <pre>{{ details }}</pre>
        <!-- <div>
          <span>标准名称 ：</span>
          <span>{{ details.name }}</span>
        </div>
        <div>
          <span>标准类别 ：</span>
          <span>{{ parseInt(details.type) === 1 ? '公共标准' : '自定义标准' }}</span>
        </div>
        <div>
          <span>版本 ：</span>
          <span>{{ details.version_list[0].version }}</span>
        </div>
        <div>
          <span>描述信息 ：</span>
          <span>{{ details.version_list[0].description || '-' }}</span>
        </div>
        <div>
          <span>修改时间 ：</span>
          <span>{{ details.version_list[0].update_time }}</span>
        </div>
        <div>
          <span>大小 ：</span>
          <span>{{ details.version_list[0].size || 0 }}KB</span>
        </div>
        <div>
          <span>创建时间 ：</span>
          <span>{{ details.version_list[0].create_time }}</span>
        </div> -->
      </div>
    </a-modal>
    <a-modal title="编辑" :visible="visibleEdit" :destroyOnClose="true" :footer="null" centered class="pop-ui" width="30rem" :maskClosable="false" @cancel="visibleEdit = false">
      <template v-if="visibleEdit">
        <span>标准名称：</span>
        <a-input style="margin-top: 4px" key="inputa" v-model="name" placeholder="请输入标准名称" />
        <span>描述：</span>
        <a-textarea :auto-size="{ minRows: 3, maxRows: 5 }" style="margin-top: 4px" placeholder="请输入描述" allow-clear v-model="description" />
        <div style="margin-top: 20px; text-align: center">
          <a-button type="primary" @click="sureEdit">确定</a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>
<script>
import { template_download, standard_model_list, standard_model_del, standard_model_edit, model_publish } from '@/apis/data.js'
import importTemplate from '../components/importTemplate.vue'
import { ResponseStatus } from '@/framework/network/util.js'
import { convertRes2Blob, standardStatu } from '@/utils/common.js'
export default {
  components: { importTemplate },
  data() {
    return {
      lists: [],
      page_size: 10,
      page_num: 1,
      selectedRowKeys: [],
      standardStatu,
      total: 0,
      visibleDetail: false,
      details: {},
      visibleEdit: false,
      name: null,
      description: null,
      standard_id: null
    }
  },
  mounted() {
    this.getList()
    this.$bus.off('updata/datalist')
    this.$bus.on('updata/datalist', () => {
      this.getList()
    })
  },

  methods: {
    goDetail(item) {
      this.$router.push({ name: 'DataStandardManageModelClassInfo', params: { name: item.name, standard_id: item.standard_id, version_id: item.version_list[0].version_id } })
    },
    async model_publish(item) {
      let params = {
        standard_id: item.standard_id,
        type: item.version_list[0].status === 2 ? 1 : 2,
        version_id: item.version_list[0].version_id
      }
      const result = await model_publish(params)
      if (result.code !== ResponseStatus.success) return
      this.$message.success('操作成功')
      this.getList()
    },
    // 编辑
    async sureEdit() {
      let params = {
        standard_id: this.standard_id,
        name: this.name,
        description: this.description
      }
      const res = await standard_model_edit(params)
      if (res.code !== ResponseStatus.success) return
      this.visibleEdit = false
      this.$message.success('操作成功')
      this.getList()
    },
    handleEdit(item) {
      this.visibleEdit = true
      this.standard_id = item.standard_id
      this.$set(this, 'name', item.name)
      this.description = item.version_list[0].description
    },
    del(item) {
      this.$confirm({
        content: '此删除操作不可恢复，是否继续？',
        okText: '确认',
        okType: 'primary',
        cancelText: '取消',
        class: 'comfirm-pop',
        centered: true,
        onOk: () => {
          const params = {
            standard_id: item.standard_id,
            version_id: item.version_list[0].version_id
          }
          standard_model_del(params).then(res => {
            if (res.code === ResponseStatus.success) {
              this.$message.success('删除成功')
              this.getList()
            }
          })
        },
        onCancel: () => {}
      })
    },
    handleDetail(item) {
      this.details = item
      this.visibleDetail = true
    },

    // 切换页码
    handlePaging(pageNum) {
      this.page_num = pageNum
      this.getList()
    },
    // 改变每页数量
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
      const res = await standard_model_list(params)
      if (res.code !== ResponseStatus.success) return
      const {
        data: { list = [], total = 0 }
      } = res
      this.lists = list
      this.total = total
      if (this.page_num !== 1 && list.length === 0) {
        this.page_num = 1
        this.getList()
      }
    },
    async downLoad() {
      template_download().then(res => {
        if (!res) this.$message.error('下载模板出错')
        convertRes2Blob(res, { name: '模型分类编码模板.csv' })
      })
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
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0
    },
    columns() {
      return [
        {
          title: '标准名称',
          dataIndex: 'name',
          key: 'name',
          ellipsis: true,
          scopedSlots: { customRender: 'name' },
          ellipsis: true
        },
        {
          title: '标准类别',
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' },
          key: 'type',
          width: '140px'
        },
        {
          title: '状态',
          width: '140px',
          key: 'status',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },

        // {
        //   title: '描述',
        //   width: '300px',
        //   key: 'description',
        //   dataIndex: 'description',
        //   scopedSlots: { customRender: 'description' }
        // },
        // {
        //   title: '修改时间',
        //   width: '200px',
        //   key: 'update_time',
        //   dataIndex: 'update_time',
        //   scopedSlots: { customRender: 'update_time' }
        // },
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
.details {
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 14px;
  > div {
    display: flex;
    gap: 10px;
    > span:nth-of-type(1) {
      width: 92px;
    }
    > span:nth-of-type(2) {
      width: 100%;
    }
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
