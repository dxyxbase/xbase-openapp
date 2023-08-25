<template>
  <a-modal width="800px" centered ok-text="确认" cancel-text="取消" @ok="autoMatch" title="绑定" :visible="isHandle" :destroyOnClose="true" class="pop-ui" :maskClosable="false" @cancel="closeDia">
    <div class="bind-model">
      <div class="left">
        <div class="publish-list"></div>
        <!-- 模型标准分类 -->
        <div class="model-table">
          <div>
            <a-form-item label="映射范围" :labelCol="{ span: 5 }" :wrapperCol="{ span: 19 }">
              <a-select style="width: 100%" placeholder="请选择" @change="changeModel" v-model="standard_id">
                <a-select-option v-for="val in publishList" :key="val.standard_id" :value="val.standard_id">{{ val.name }}/{{ val.version }}</a-select-option>
              </a-select>
            </a-form-item>
          </div>

          <div>
            <a-table :customRow="rowSelection.rowClick" :rowClassName="rowSelection.setRowClassName" :scroll="{ y: 480 }" rowKey="child_id" :columns="columns" :pagination="false" :data-source="lists"></a-table>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="attr-table">
          <p>映射属性</p>
          <div class="items" v-for="(item, index) in listsAttr_" :key="index">
            <div class="checked"><a-checkbox :checked="item.checked" @change="changeItem(item)"></a-checkbox></div>
            <div class="rightAtrr">
              <div class="content">
                <p>标准映射名称：{{ item.mapping_standard_info.mapping_name }}</p>
                <p>映射标准：{{ item.mapping_standard_info.target_standard_name }}</p>
              </div>
              <div class="content_info">
                <div class="titleTag">属性信息（属性组/属性名称）：</div>
                <div class="tagBox">
                  <span v-for="(i, j) in item.content_info" :key="j">{{ i.group + '/' + i.key }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>
<script>
import { standard_publish_list, map_content_result, standard_model_bind } from '@/apis/standard.js'
import { model_child_list } from '@/apis/data.js'
import { ResponseStatus } from '@/framework/network/util.js'
export default {
  data() {
    let that = this
    const rowSelection = {
      rowClick: record => ({
        on: {
          click: () => {
            const { child_count, child_id } = record
            if (child_count === 0) {
              this.sourceItem = record
              that.activeId = child_id
              that.getRightList(child_id)
            }
          }
        }
      }),
      setRowClassName(record, index) {
        const { child_count, child_id } = record
        return child_count === 0 && that.activeId === child_id ? 'clickRowStyl' : '' //赋予点击行样式
      }
    }
    return {
      publishList: [],
      rowSelection,
      lists: [],
      activeId: '',
      standard_id: '',
      version_id: '',
      listsAttr_: [],
      sourceItem: {} //已选中模型分类标准
    }
  },
  mounted() {
    this.getPublishList()
  },
  methods: {
    async autoMatch() {
      let mapping_id = []
      // mapping_id.push(item.mapping_id)
      const selected = this.listsAttr_.filter(item => item.checked)
      mapping_id = selected.map(item => {
        return item.mapping_standard_info.mapping_id
      })
      let params = {
        model_id: this.handleData[0].model_id,
        model_path: this.handleData[0].model_path,
        code_id: this.activeId,
        standard_id: this.standard_id,
        // version_id: this.version_id,
        mapping_list: mapping_id,
        is_merge: true,
        components: { component_list: [], categories: '' },
        categories: this.handleData[0].node_type === 1 ? [this.handleData[0].id] : []
      }
      if (this.handleType === 'type') {
        // 类别绑定
        // params.components = []
      } else {
        //节点绑定 单个或多个构件批量绑定根据传入 handleData  遍历操作
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
      const result = await standard_model_bind(params)
      if (result.code !== ResponseStatus.success) return
      this.$message.success('绑定成功')
      this.closeDia()
      this.$bus.emit('updata/member')
    },
    closeDia() {
      this.$emit('close')
    },
    changeItem(item) {
      this.$set(item, 'checked', !item.checked)
      this.$forceUpdate()
    },
    async getRightList(standard_item) {
      let params = {
        version_id: this.version_id,
        standard_item: standard_item
      }
      let result = await map_content_result(params)
      if (result.code !== ResponseStatus.success) return
      this.listsAttr_ = result.data.list || []
      this.listsAttr_.map(item => {
        item.checked = true
      })
    },
    changeModel(val) {
      const obj = this.publishList.filter(item => item.standard_id === val)[0]
      this.version_id = obj.version_id || ''
      this.getChildList()
    },
    // 获取模型规则列表
    async getPublishList() {
      const result = await standard_publish_list()
      if (result.code !== ResponseStatus.success) return
      const {
        data: { list = [] }
      } = result
      this.publishList = list
    },
    // 获取子集
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
      })
      let data_ = JSON.parse(JSON.stringify(data))
      this.lists = this.toTree(data_)
    },
    toTree(data) {
      const tree = []
      const otherObj = {}
      data.forEach(item => {
        if (item.child_count) item.children = []
        otherObj[item.child_id] = item
      })
      data.forEach(item => {
        if (item.parent_id) {
          otherObj[item.parent_id].children.push(item)
        } else {
          tree.push(item)
        }
      })
      // 5.返回树状结构
      return tree
    }
  },
  computed: {
    columns() {
      return [
        {
          title: '分类编码',
          dataIndex: 'code',
          ellipsis: true,
          key: 'code'
        },
        {
          title: '分类名称',
          dataIndex: 'name',
          width: '250px',
          ellipsis: true,
          key: 'name'
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
<style lang="less" scoped>
.items {
  display: flex;
  gap: 6px;
  * {
    margin: 0;
  }
  .content_info {
    // border-top: 1px solid #ccc;
    padding: 4px 4px 4px 0;
    margin-top: 4px;

    .tagBox {
      display: flex;
      gap: 4px;
      padding-top: 2px;
      > span {
        font-size: 12px;
        padding: 1px 2px;
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
  }

  margin-bottom: 12px;
  .checked {
    width: 6%;
    flex-shrink: 1;
  }
  .rightAtrr {
    flex-grow: 1;
  }
}
::v-deep .clickRowStyl,
::v-deep .clickRowStyl.ant-table-row-selected {
  background-color: #bbbbff !important ;
}
::v-deep .ant-table-tbody > tr.clickRowStyl:hover:not(.ant-table-expanded-row) > td {
  background: #bbbbff !important ;
}
::v-deep .ant-modal {
  font-size: 12px !important;
  height: 75% !important;
  min-height: 400px;
  .ant-modal-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    .ant-modal-body {
      height: 0;
      overflow: hidden;
      flex-grow: 1;
      box-sizing: border-box;
    }
  }
}
.bind-model {
  font-size: 12px !important;
  box-sizing: border-box;
  height: 100%;
  display: flex;
  gap: 12px;
  .left {
    width: 60%;
  }
  .right {
    width: 40%;
  }
}
</style>
