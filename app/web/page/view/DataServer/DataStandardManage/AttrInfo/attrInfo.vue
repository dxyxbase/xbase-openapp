<template>
  <div class="attr-info" id="attr-info">
    <div class="header-back">
      <div>
        <span class="back" @click="$router.back(-1)">
          <a-icon type="left" />
          {{ standname }}
        </span>
      </div>
      <div class="handleBtn">
        <a-button type="primary" class="addAttr" @click="handleOpre('add', {})">新增属性组</a-button>
        <a-button :disabled="!hasSelected" type="primary" class="del" @click="handleDeletePatch('patch')">删除</a-button>
      </div>
    </div>
    <div class="table-box" id="tableBox" ref="tableBox">
      <div class="tables">
        <a-table
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
            getCheckboxProps: rowSelection.getCheckboxProps
          }"
          rowKey="child_id"
          :scroll="{ y: height }"
          :columns="columns"
          :pagination="false"
          :data-source="lists"
          :expanded-row-keys.sync="expandedRowKeys"
        >
          <div slot="type" key="type" slot-scope="text">
            <span>{{ parseInt(text) === 1 ? '属性组' : '属性名称' }}</span>
          </div>
          <div slot="Action" slot-scope="text, record" class="action-box">
            <!-- <a-button @click="move(1, record)" :disabled="len == 1 && record.type === 1" type="link" class="actionBtn">
              <span>上移</span>
            </a-button>
            <a-button @click="move(2, record)" :disabled="len == 1 && record.type === 1" type="link" class="actionBtn">
              <span>下移</span>
            </a-button> -->

            <a-button @click="handleOpre('edit', record)" type="link" class="actionBtn">
              <span>编辑</span>
            </a-button>
            <a-button @click="handleDeletePatch('single', record)" type="link" class="actionBtn">
              <span>删除</span>
            </a-button>
            <a-button v-if="record.type !== 2" @click="handleOpre('add', record)" type="link" class="actionBtn">
              <span>新增属性</span>
            </a-button>
          </div>
        </a-table>
      </div>
    </div>
    <!--  -->
    <a-modal :title="type === 'add' ? '新增' : '编辑'" :visible="visibleEdit" :destroyOnClose="true" :footer="null" centered class="pop-ui" width="30rem" :maskClosable="false" @cancel="visibleEdit = false">
      <template v-if="visibleEdit">
        <span>名称：</span>
        <a-input style="margin-top: 4px" v-model="name" placeholder="请输入名称" />

        <br />
        <div style="margin-top: 20px; text-align: center">
          <a-button type="primary" @click="sureEdit">确定</a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>
<script>
import { attr_child_list, attr_child_add, attr_child_check, attr_child_edit, attr_child_del, attr_child_move } from '@/apis/data.js'
import { ResponseStatus } from '@/framework/network/util.js'
const lodash = require('lodash')
export default {
  data() {
    const rowSelection = {
      getCheckboxProps: record => ({
        props: {
          disabled: record.disabled
        }
      })
    }
    return {
      lists: [],
      expandedRowKeys: [],
      height: window.innerHeight - 200,
      is_publish: false,
      parent: [],
      copyData: [],
      rowSelection,
      selectedRowKeys: [],
      selectedRows: [],
      type: 'add',
      visibleEdit: false,
      name: null,
      code: null,
      parent_id: null,
      len: 0
    }
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0
    },
    standard_id() {
      return this.$route.params.standard_id
    },

    standname() {
      return this.$route.params.name
    },
    columns() {
      // 标准结构 1属性组 2属性名称
      return [
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name' 
        },
        // {
        //   title: '标准结构',
        //   dataIndex: 'type',
        //   scopedSlots: { customRender: 'type' },
        //   key: 'type',
        //   width: '200px'
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
  },
  async mounted() {
    window.onresize = () => {
      this.resizeWind()
    }
    this.getChildList()
  },
  destroyed() {
    window.onresize = null
  },
  methods: {
    async check(name) {
      const result = await attr_child_check({ name: name })
      if (result.code !== ResponseStatus.success) return true
      const {
        data: { is_exist }
      } = result
      return is_exist
    },
    async move(type, item) {
      let params = {
        standard_id: this.standard_id,
        child_id: item.child_id,
        type: type
      }
      let result = await attr_child_move(params)
      if (result.code !== ResponseStatus.success) return
      this.$message.success('移动成功')
      this.getChildList()
    },
    handleDeletePatch(flag, item) {
      if (flag === 'single') {
        this.selectedRowKeys = [item.child_id]
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
            // standard_id: this.standard_id,
            children_ids: this.selectedRowKeys
          }
          attr_child_del(params).then(res => {
            if (res.code === ResponseStatus.success) {
              this.$message.success('删除成功')
              this.selectedRowKeys = []
              this.getChildList()
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
    handleOpre(type, item) {
      this.type = type
      this.visibleEdit = true
      if (item.child_id) {
        this.parent_id = item.child_id
      } else {
        this.parent_id = ''
      }
      if (this.type !== 'add') {
        this.name = item.name
      }
    },
    async sureEdit() {
      if (!this.name) return this.$message.warning('名称不能为空')
      let result = null
      let params = { name: this.name, standard_id: this.standard_id }
      if (this.type === 'add') {
        if (await this.check(this.name)) return this.$message.warning('名称不可重复')
        result = await attr_child_add({ ...params, parent_id: this.parent_id })
      } else {
        result = await attr_child_edit({ ...params, child_id: this.parent_id })
      }
      if (result.code !== ResponseStatus.success) return
      this.$message.success('操作成功')
      this.visibleEdit = false
      this.name = null
      this.getChildList()
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },

    resizeWind: lodash.throttle(function () {
      this.height = this.$refs.tableBox.offsetHeight - 54
    }, 200),
    async getChildList() {
      const params = {
        standard_id: this.standard_id
      }
      const result = await attr_child_list(params)
      if (result.code !== ResponseStatus.success) return
      let data = result.data.children || []
      data.map((item, index) => {
        item.key = index
      })
      let data_ = JSON.parse(JSON.stringify(data))
      this.lists = data_
      this.len = this.lists.length
    }
  }
}
</script>
<style lang="less" scoped>
.handleBtn {
  margin-right: 100px;
  display: flex;
  gap: 24px;
}
.header-back {
  border-bottom: 1px solid #f2f2f7;
  display: flex;
  justify-content: space-between;
  gap: 6px;
  align-items: center;
  padding: 18px 0;
  .back {
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    &:hover {
      text-decoration: underline;
      color: rgb(64, 158, 255);
    }
  }
  .is_publish {
    margin-left: 12px;
    color: rgb(64, 158, 255);
    font-size: 12px;
    font-weight: bolder;
  }
}
.attr-info {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 12px;
  .table-box {
    height: 0;
    overflow: hidden;
    flex-grow: 1;
    box-sizing: border-box;
  }
}
</style>
