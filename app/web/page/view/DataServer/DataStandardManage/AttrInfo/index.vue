<template>
  <div class="model-class">
    <div class="head-btn">
      <a-button @click="handle('add')" type="primary">新增标准</a-button>
    </div>
    <div class="table-box">
      <div v-if="lists.length === 0" class="noData" style="text-align: center">
        <img :src="require('@/asset/images/nodata.png')" alt="暂无数据" />
        <p>暂无内容</p>
      </div>
      <a-table v-else :columns="columns" :data-source="lists" :pagination="false" :rowKey="record => record.standard_id" class="table-ui">
        <div slot="name" slot-scope="text, record" class="file-name">
          <a-button class="tdName" key="name" type="link" @click="goDetail(record)">
            <span>{{ text }}</span>
          </a-button>
        </div>
        <div slot="type" key="type" slot-scope="text">
          <span>{{ parseInt(text) === 1 ? '公共标准' : '自定义标准' }}</span>
        </div>

        <div slot="Action" slot-scope="text, record" class="action-box">
          <a-button key="detail" type="link" class="actionBtn" @click="handleDetail(record)">
            <span>详情</span>
          </a-button>
          <a-button @click="handle('edit', record)" key="edit" type="link" class="actionBtn">
            <span>编辑</span>
          </a-button>
          <!-- <a-button @click="handle('copy', record)" key="copy" type="link" class="actionBtn">
            <span>复制</span>
          </a-button> -->
          <a-button @click="del(record)" key="del" type="link" class="actionBtn">
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
          <span>描述信息 ：</span>
          <span>{{ details.description || '-' }}</span>
        </div>
        <div>
          <span>修改时间 ：</span>
          <span>{{ details.update_time }}</span>
        </div>
        <div>
          <span>创建时间 ：</span>
          <span>{{ details.create_time }}</span>
        </div> -->
      </div>
    </a-modal>
    <a-modal :title="type === 'add' ? '新增' : type === 'edit' ? '编辑' : '复制'" :visible="visibleEdit" :destroyOnClose="true" :footer="null" centered class="pop-ui" width="30rem" :maskClosable="false" @cancel="visibleEdit = false">
      <template v-if="visibleEdit">
        <span>标准名称：</span>
        <a-input style="margin-top: 4px" key="inputa" v-model="name" placeholder="请输入标准名称" />
        <span>描述：</span>
        <a-textarea :auto-size="{ minRows: 3, maxRows: 5 }" style="margin-top: 4px" placeholder="请输入描述" allow-clear v-model="description" />
        <br />
        <div style="margin-top: 20px; text-align: center">
          <a-button type="primary" @click="sureEdit">确定</a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>
<script>
import { standard_attr_add, standard_attr_list, standard_attr_del, standard_attr_edit, standard_attr_check, standard_attr_copy } from '@/apis/data.js'
import { ResponseStatus } from '@/framework/network/util.js'
export default {
  data() {
    return {
      lists: [],
      page_size: 10,
      page_num: 1,
      selectedRowKeys: [],
      total: 0,
      visibleDetail: false,
      details: {},
      visibleEdit: false,
      name: null,
      description: null,
      standard_id: null,
      type: 'add'
    }
  },
  mounted() {
    this.getList()
    this.$bus.off('updata/attrlist')
    this.$bus.on('updata/attrlist', () => {
      this.getList()
    })
  },

  methods: {
    handle(type, item) {
      this.type = type
      this.visibleEdit = true
      if (type === 'edit') {
        this.name = item.name
        this.standard_id = item.standard_id
        this.description = item.description
      } else if (type === 'copy') {
        this.name = null
        this.description = null
        this.standard_id = item.standard_id
      } else {
        this.name = null
        this.description = null
      }
    },
    // 编辑
    async sureEdit() {
      let params = {
        name: this.name,
        description: this.description
      }
      let res = null
      if (this.type === 'add') {
        if (await this.check(this.name)) return this.$message.warning('名称不可重复')
        res = await standard_attr_add(params)
      } else if (this.type === 'edit') {
        res = await standard_attr_edit({ ...params, standard_id: this.standard_id })
      } else if (this.type === 'copy') {
        // copy
        if (await this.check(this.name)) return this.$message.warning('名称不可重复')
        res = await standard_attr_copy({ ...params, standard_id: this.standard_id })
      }
      if (res.code !== ResponseStatus.success) return
      this.$message.success('操作成功')
      this.visibleEdit = false
      this.getList()
    },
    async check(name) {
      const result = await standard_attr_check({ name: name })
      if (result.code !== ResponseStatus.success) return true
      const {
        data: { is_exist }
      } = result
      return is_exist
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
            standard_id: item.standard_id
          }
          standard_attr_del(params).then(res => {
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
    goDetail(item) {
      this.$router.push({ name: 'DataStandardManageAttrClassInfo', params: { name: item.name, standard_id: item.standard_id } })
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
      const res = await standard_attr_list(params)
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
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '标准类别',
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' },
          key: 'type',
          width: '140px'
        },
        // {
        //   title: '描述',
        //   width: '200px',
        //   key: 'description',
        //   dataIndex: 'description',
        //   scopedSlots: { customRender: 'description' },
        //   ellipsis: true
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
