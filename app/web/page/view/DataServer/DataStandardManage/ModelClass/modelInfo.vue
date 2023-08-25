<template>
  <div class="model-info" id="model-info">
    <div class="header-back">
      <div>
        <span class="back" @click="$router.back(-1)">
          <a-icon type="left" />
          {{ standname }}
        </span>
        <!-- <span class="is_publish">{{ is_publish ? '已发布' : '未发布' }}</span> -->
      </div>
      <!-- <div class="handleBtn">
        <a-button :disabled="is_publish" type="primary" class="addAttr" @click="handleOpre('add', {})">新增节点</a-button>
        <a-button :disabled="is_publish || !hasSelected" type="primary" class="del" @click="handleDeletePatch('patch')">删除</a-button>
      </div> -->
    </div>
    <div class="table-box" id="tableBox" ref="tableBox">
      <div class="tables">
        <a-table
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
            getCheckboxProps: rowSelection.getCheckboxProps,
            onSelectAll: onSelectAll,
            onSelect: onSelectRow
          }"
          indeterminate
          rowKey="child_id"
          :scroll="{ y: height }"
          :columns="columns"
          :pagination="false"
          :data-source="lists"
          :expanded-row-keys.sync="expandedRowKeys"
        >
          <div slot="Action" slot-scope="text, record" class="action-box">
            <a-button @click="move(1, record)" :disabled="is_publish || (len == 1 && !record.parent_id)" type="link" class="actionBtn">
              <span>上移</span>
            </a-button>
            <a-button @click="move(2, record)" :disabled="is_publish || (len == 1 && !record.parent_id)" type="link" class="actionBtn">
              <span>下移</span>
            </a-button>
            <a-button @click="handleOpre('add', record)" :disabled="is_publish" type="link" class="actionBtn">
              <span>新增下级</span>
            </a-button>
            <!-- <a-button @click="handleOpre('edit', record)" :disabled="is_publish" type="link" class="actionBtn">
              <span>编辑</span>
            </a-button> -->
            <a-button @click="handleDeletePatch('single', record)" :disabled="is_publish" type="link" class="actionBtn">
              <span>删除</span>
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
        <span>code：</span>
        <a-input style="margin-top: 4px" v-model="code" placeholder="请输入code" />
        <br />
        <div style="margin-top: 20px; text-align: center">
          <a-button type="primary" @click="sureEdit">确定</a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>
<script>
import { model_child_list, model_is_publish, model_child_add, model_child_edit, model_child_del, model_child_move } from '@/apis/data.js'
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
    version_id() {
      return this.$route.params.version_id
    },
    standname() {
      return this.$route.params.name
    },
    columns() {
      return [
        {
          title: '分类编码',
          dataIndex: 'code',
          width: '30%',
          key: 'code'
        },
        {
          title: '分类名称',
          dataIndex: 'name',
          key: 'name'
        }
        // {
        //   title: '操作',
        //   key: 'action',
        //   dataIndex: 'action',
        //   width: '400px',
        //   scopedSlots: { customRender: 'Action' }
        // }
      ]
    }
  },
  async mounted() {
    window.onresize = () => {
      this.resizeWind()
    }
    await this.checkIsPublish()
    this.getChildList()
  },
  destroyed() {
    window.onresize = null
  },
  methods: {
    async move(type, item) {
      let params = {
        standard_id: this.standard_id,
        child_id: item.child_id,
        type: type
      }
      let result = await model_child_move(params)
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
            standard_id: this.standard_id,
            children_id_list: this.selectedRowKeys
          }
          model_child_del(params).then(res => {
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
        this.code = item.code
      }
    },
    async sureEdit() {
      if (!this.name || !this.code) return this.$message.warning('名称或者code不能为空')
      let result = null
      let params = { name: this.name, code: this.code, standard_id: this.standard_id }
      if (this.type === 'add') {
        result = await model_child_add({ ...params, parent_id: this.parent_id })
      } else {
        result = await model_child_edit({ ...params, child_id: this.parent_id })
      }
      if (result.code !== ResponseStatus.success) return

      this.$message.success('操作成功')
      this.visibleEdit = false
      this.name = null
      this.code = null
      this.getChildList()
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    async checkIsPublish() {
      const result = await model_is_publish({ standard_id: this.standard_id })
      if (result.code !== ResponseStatus.success) return false
      this.is_publish = result.data.is_publish
    },
    resizeWind: lodash.throttle(function () {
      this.height = this.$refs.tableBox.offsetHeight - 54
    }, 200),
    async getChildList() {
      const params = {
        type: 1,
        standard_id: this.standard_id,
        version_id: this.version_id
      }
      const result = await model_child_list(params)
      if (result.code !== ResponseStatus.success) return
      let data = result.data.list || []
      data.map((item, index) => {
        item.key = index
        item.disabled = this.is_publish
        item.checkFlag = false
      })
      let data_ = JSON.parse(JSON.stringify(data))
      this.lists = this.toTree(data_)
      this.len = this.lists.length
    },
    toTree(data) {
      // 1.定义最外层的数组
      const tree = []
      // 2.定义一个空对象
      const otherObj = {}
      // 3.遍历数组内所有对象
      data.forEach(item => {
        // 3.1.给每个当前对象添加一个 children 属性, 以便存放子级对象
        if (item.child_count) item.children = []
        // item.children = []
        // 3.2 将当前对象的 child_id 作为键, 与当前对象自身形成键值对
        otherObj[item.child_id] = item
      })
      // 4.再次遍历数组内所有对象
      data.forEach(item => {
        // 4.1.判断每个当前对象的 parent_id, 如当前对象 parent_id 不为空, 则说明不是最上级的根对象
        if (item.parent_id) {
          // 4.3.利用当前对象的 otherObj[parent_id] 找到 otherObj[child_id] 中对应当前对象的父级对象, 将当前对象添加到其对应的父级对象的 children 属性中
          otherObj[item.parent_id].children.push(item)
        } else {
          // 4.3.当前对象 parent_id 如果为空, 则为树状结构的根对象
          tree.push(item)
        }
      })
      // 5.返回树状结构
      return tree
    },

    onSelectAll(selected) {
      if (selected) {
        const tabData = this.lists
        const arr = []
        setVal(tabData, arr)
        this.selectedRowKeys = arr
      } else {
        this.selectedRowKeys = []
      }
      function setVal(list, arr) {
        list.forEach(v => {
          arr.push(v.key)
          if (v.children) {
            setVal(v.children, arr)
          }
        })
      }
    },
    onSelectRow(record, selected) {
      const set = new Set(this.selectedRowKeys)
      const tabData = this.lists
      const key = record.child_id
      if (selected) {
        set.add(key)
        record.children && setChildCheck(record.children)
      } else {
        set.delete(key)
        record.children && setChildUncheck(record.children)
      }
      this.selectedRowKeys = Array.from(set)
      function setChildCheck(list) {
        list.forEach(function (v) {
          set.add(v.child_id)
          v.children && setChildCheck(v.children)
        })
      }
      function setChildUncheck(list) {
        list.forEach(function (v) {
          set.delete(v.child_id)
          v.children && setChildUncheck(v.children)
        })
      }
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
.model-info {
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
