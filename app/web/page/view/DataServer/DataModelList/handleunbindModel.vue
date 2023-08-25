<template>
  <a-modal :okButtonProps="{ props: { disabled: !hasSelected } }" width="800px" centered ok-text="确认" cancel-text="取消" @ok="unbind" title="解绑" :visible="isHandle" :destroyOnClose="true" class="pop-ui" :maskClosable="false" @cancel="closeDia">
    <div class="bind-model">
      <a-table
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          getCheckboxProps: rowSelection.getCheckboxProps
        }"
        :columns="columns"
        :data-source="lists"
        :pagination="false"
        :rowKey="record => record.code_id"
        class="table-ui"
      >
        <div slot="name" slot-scope="text" class="file-name">
          <a-button key="name" type="link">
            <span>{{ text }}</span>
          </a-button>
        </div>
      </a-table>
    </div>
  </a-modal>
</template>
<script>
import { standard_model_unbind, standard_model_bind_standard } from '@/apis/standard.js'
import { ResponseStatus } from '@/framework/network/util.js'
const lodash = require('lodash')
export default {
  data() {
    // let that = this
    const rowSelection = {
      getCheckboxProps: record => ({
        props: {
          disabled: record.disabled
        }
      })
    }
    return {
      rowSelection,
      lists: [],
      listsAttr_: [],
      selectedRowKeys: [],
      sourceItem: {}, //已选中模型分类标准
      standard_list: []
    }
  },
  mounted() {
    this.getList()
  },
  watch: {
    selectedRowKeys: {
      handler(newVal) {
        let arr = []
        this.lists.map(item => {
          if (newVal.includes(item.code_id)) {
            arr.push(item)
          }
        })
        let standardArr = lodash.uniq(arr)
        this.standard_list = standardArr.map(item => {
          return {
            standard_id: item.standard_id,
            version_id: item.version_id,
            code_id: item.code_id
          }
        })
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    async unbind() {
      let params = {
        model_path: this.handleData[0].model_path,
        model_id: this.handleData[0].model_id,
        categories: this.handleData[0].node_type === 1 ? this.handleData[0].id : '',
        components: { component_list: [], categories: '' },
        standard_list: this.standard_list
      }
      if (this.handleType === 'type') {
        console.log(params)
      } else {
        //节点解绑 单个或多个构件批量解绑根据传入 handleData  遍历操作
        let component_list = []
        this.handleData.map(item => {
          component_list.push({
            id: item.id,
            category_id: item.parent_id,
            render_path: item.model_path
          })
        })
        params.components = {
          component_list: component_list,
          categories: this.handleData[0].parent_id
        }
      }
      const result = await standard_model_unbind(params)
      if (result.code !== ResponseStatus.success) return
      this.$message.success('解绑成功')
      this.closeDia()
      this.$bus.emit('updata/member')
    },
    async getList() {
      let params = {
        model_path: this.handleData[0].model_path,
        categories: '',
        guids: []
      }
      console.log(this.handleData[0])
      if (this.handleType === 'type') {
        params.categories = this.handleData[0].id
      } else {
        params.guids = [this.handleData[0].id]
        params.categories =this.handleData[0].parent_id
      }
      const result = await standard_model_bind_standard(params)
      if (result.code !== ResponseStatus.success) return
      const {
        data: { bind_info = [] }
      } = result
      this.lists = bind_info
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },

    closeDia() {
      this.$emit('close')
    }
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0
    },
    columns() {
      return [
        {
          title: '模型分类标准',
          dataIndex: 'standard_name',
          ellipsis: true,
          key: 'standard_name'
        },
        {
          title: '分类编码',
          dataIndex: 'code',
          width: '250px',
          ellipsis: true,
          key: 'code'
        },
        {
          title: '分类名称',
          dataIndex: 'categories_name',
          width: '250px',
          ellipsis: true,
          key: 'categories_name'
        }
      ]
    }
  },
  props: {
    isHandle: {
      type: Boolean,
      default: false
    },
    handleType: {
      type: String,
      default: ''
    },
    handleData: {
      type: Array,
      default: () => {
        return []
      }
    }
  }
}
</script>
<style lang="less" scoped></style>
