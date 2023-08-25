<template>
  <div class="handle-map-rule">
    <div class="header-back">
      <div>
        <span class="back" @click="$router.back(-1)">
          <a-icon type="left" />
          {{ mapping_name }}
        </span>
      </div>
    </div>
    <div class="map-rule-box">
      <div class="map-rule-left">
        <div class="handle-btn">
          <div class="handle-name">模型分类标准：{{ source_standard_name }}</div>
          <div class="btns">
            <a-button :disabled="!hasSelected" type="primary" @click="openList('patch')">映射</a-button>
            <a-button :disabled="!hasSelected" @click="unBind('patch')">移除</a-button>
          </div>
        </div>
        <div class="map-rule-left-box">
          <div class="rule-left" ref="ruleLeft">
            <a-table
              :row-selection="{
                selectedRowKeys: selectedRowKeys,
                onChange: onSelectChange
              }"
              rowKey="standard_item"
              :scroll="{ y: height }"
              :columns="columns"
              :pagination="false"
              :data-source="lists"
              :expanded-row-keys.sync="expandedRowKeys"
              :customRow="rowSelection.rowClick"
              :rowClassName="rowSelection.setRowClassName"
            >
              <div slot="Action" slot-scope="text, record" class="action-box">
                <a-button type="link" class="actionBtn" @click="openList('single', record)">
                  <span>映射</span>
                </a-button>
                <a-button @click="unBind('single', record)" type="link" class="actionBtn">
                  <span>移除</span>
                </a-button>
              </div>
            </a-table>
          </div>
        </div>
      </div>
      <div class="map-rule-right">
        <div class="handle-btn">
          <div class="handle-name">映射标准：{{ target_standard_name }}</div>
        </div>
        <div class="map-rule-right-box">
          <div class="rule-right" ref="ruleRight">
            <a-table rowKey="child_id" :scroll="{ y: height }" :columns="columnsAttr" :pagination="false" :data-source="listsAttr_"></a-table>
          </div>
        </div>
      </div>
    </div>
    <!-- 映射列表 -->
    <a-modal width="500px" centered ok-text="确认" cancel-text="取消" @ok="autoMatch" title="映射" :visible="visibleAutoMatch" :destroyOnClose="true" class="pop-ui" :maskClosable="false" @cancel="close">
      <template>
        <a-alert message="映射必须选中对应属性组下面子节点！！！" banner />
        <a-table
          style="margin-top: 20px"
          :row-selection="{
            selectedRowKeys: selectedRowKeysAttr,
            onChange: onSelectChangeAttr,
            onSelectAll: onSelectAll,
            onSelect: onSelectRow
          }"
          rowKey="id"
          :columns="columnsAttr"
          :pagination="false"
          :data-source="listsAttr"
        ></a-table>
      </template>
    </a-modal>
  </div>
</template>
<script>
import { standard_publish_map_right_list, standard_map_match_bind, standard_map_match_unbind, standard_publish_source_list, standard_publish_map_list } from '@/apis/standard.js'
import { ResponseStatus } from '@/framework/network/util.js'
const lodash = require('lodash')
export default {
  data() {
    let that = this
    const rowSelection = {
      rowClick: record => ({
        on: {
          click: () => {
            const { child_count, standard_item } = record
            if (child_count === 0) {
              that.activeId = standard_item
              that.getRightList(standard_item)
            }
          }
        }
      }),
      setRowClassName(record, index) {
        const { child_count, standard_item } = record
        return child_count === 0 && that.activeId === standard_item ? 'clickRowStyl' : '' //赋予点击行样式
      }
    }
    return {
      lists: [],
      listsAttr: [],
      listsAttr_: [],
      rowSelection,
      activeId: '',
      visibleAutoMatch: false,
      selectedRowKeys: [],
      expandedRowKeys: [],
      selectedRowKeysAttr: [],
      height: window.innerHeight - 240
    }
  },
  mounted() {
    window.onresize = () => {
      this.resizeWind()
    }
    this.getSourceList()
  },
  destroyed() {
    window.onresize = null
  },
  methods: {
    onSelectAll(selected) {
      if (selected) {
        const tabData = this.listsAttr
        const arr = []
        setVal(tabData, arr)
        this.selectedRowKeysAttr = arr
      } else {
        this.selectedRowKeysAttr = []
      }
      function setVal(list, arr) {
        list.forEach(v => {
          arr.push(v.id)
          if (v.children) {
            setVal(v.children, arr)
          }
        })
      }
    },
    onSelectRow(record, selected) {
      const set = new Set(this.selectedRowKeysAttr)
      const tabData = this.listsAttr
      const key = record.id
      if (selected) {
        set.add(key)
        record.children && setChildCheck(record.children)
      } else {
        set.delete(key)
        record.children && setChildUncheck(record.children)
      }
      this.selectedRowKeysAttr = Array.from(set)
      function setChildCheck(list) {
        list.forEach(function (v) {
          set.add(v.id)
          v.children && setChildCheck(v.children)
        })
      }
      function setChildUncheck(list) {
        list.forEach(function (v) {
          set.delete(v.id)
          v.children && setChildUncheck(v.children)
        })
      }
    },
    close() {
      this.visibleAutoMatch = false
      this.selectedRowKeysAttr = []
    },
    // 获取映射标准列表
    async getDialogtList() {
      let params = {
        mapping_id: this.mapping_id
      }
      let result = await standard_publish_map_list(params)
      if (result.code !== ResponseStatus.success) return
      this.listsAttr = result.data.mapping_standard_list || []
    },
    async getRightList(source_standard_item) {
      let params = {
        mapping_id: this.mapping_id,
        source_standard_item: source_standard_item
      }
      let result = await standard_publish_map_right_list(params)
      if (result.code !== ResponseStatus.success) return
      this.listsAttr_ = result.data.list || []
    },
    openList(flag, item) {
      this.visibleAutoMatch = true
      if (flag === 'single') {
        this.selectedRowKeys = [item.standard_item]
      }
      this.getDialogtList()
    },
    async autoMatch() {
      let params = {
        mapping_id: this.mapping_id,
        source_standard_items: this.selectedRowKeys,
        target_standard_items: this.selectedRowKeysAttr
      }
      const result = await standard_map_match_bind(params)
      if (result.code !== ResponseStatus.success) return
      this.getSourceList()
      this.$message.success('操作成功')
      this.visibleAutoMatch = false
      this.selectedRowKeys = []
    },
    resizeWind: lodash.throttle(function () {
      this.height = this.$refs.ruleLeft.offsetHeight - 60
    }, 200),
    onSelectChangeAttr(selectedRowKeys) {
      this.selectedRowKeysAttr = selectedRowKeys
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    unBind(flag, item) {
      if (flag === 'single') {
        this.selectedRowKeys = [item.standard_item]
      }
      this.$confirm({
        content: '此操作不可恢复，是否继续？',
        okText: '确认',
        okType: 'primary',
        cancelText: '取消',
        class: 'comfirm-pop',
        centered: true,
        onOk: () => {
          const params = {
            mapping_id: this.mapping_id,
            source_standard_items: this.selectedRowKeys
          }
          standard_map_match_unbind(params).then(res => {
            if (res.code === ResponseStatus.success) {
              this.$message.success('移除成功')
              this.selectedRowKeys = []
              this.getSourceList()
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

    async getSourceList() {
      const result = await standard_publish_source_list({ mapping_id: this.mapping_id })
      if (result.code !== ResponseStatus.success) return
      let data = result.data.list || []
      this.activeId = ''
      let data_ = JSON.parse(JSON.stringify(data))
      this.lists = this.toTree(data_)
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
        otherObj[item.standard_item] = item
      })
      // 4.再次遍历数组内所有对象
      data.forEach(item => {
        // 4.1.判断每个当前对象的 parent_id, 如当前对象 parent_id 不为空, 则说明不是最上级的根对象
        if (item.parent_id) {
          // 4.3.利用当前对象的 otherObj[parent_id] 找到 otherObj[standard_item] 中对应当前对象的父级对象, 将当前对象添加到其对应的父级对象的 children 属性中
          otherObj[item.parent_id].children.push(item)
        } else {
          // 4.3.当前对象 parent_id 如果为空, 则为树状结构的根对象
          tree.push(item)
        }
      })
      // 5.返回树状结构
      return tree
    }
  },
  computed: {
    hasSelectedAttr() {
      return this.selectedRowKeysAttr.length > 0
    },
    hasSelected() {
      return this.selectedRowKeys.length > 0
    },
    columnsAttr() {
      return [
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name'
        }
      ]
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
        },
        {
          title: '映射结果',
          dataIndex: 'mapping_num',
          key: 'mapping_num'
        },
        {
          title: '操作',
          key: 'action',
          dataIndex: 'action',
          width: '160px',
          scopedSlots: { customRender: 'Action' }
        }
      ]
    },
    mapping_name() {
      return this.$route.query.mapping_name || ''
    },
    mapping_id() {
      return this.$route.query.mapping_id || ''
    },
    source_standard_name() {
      return this.$route.query.source_standard_name || ''
    },
    target_standard_name() {
      return this.$route.query.target_standard_name || ''
    },
    target_standard_id() {
      return this.$route.query.target_standard_id || ''
    }
  }
}
</script>
<style lang="less" scoped>
::v-deep .clickRowStyl,
::v-deep .clickRowStyl.ant-table-row-selected {
  background-color: #bbbbff !important ;
}
::v-deep .ant-table-tbody > tr.clickRowStyl:hover:not(.ant-table-expanded-row) > td {
  background: #bbbbff !important ;
}
.map-rule-left-box,
.map-rule-right-box {
  height: 0;
  overflow: hidden;
  flex-grow: 1;
}
.rule-left,
.rule-right {
  height: 100%;
}
.map-rule-left {
  border-right: 2px solid #e0e6ed;
}
.handle-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0 12px 18px;
  height: 56px;
  .handle-name {
    font-size: 14px;
    font-weight: bold;
  }
  .btns {
    display: flex;
    gap: 24px;
    margin-right: 24px;
  }
}
.handle-map-rule {
  display: flex;
  flex-direction: column;
  height: 100%;
  .map-rule-box {
    height: 0;
    flex-grow: 1;
    overflow: hidden;
    box-sizing: border-box;
    display: flex;
    > div {
      box-sizing: border-box;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .map-rule-left {
      width: 60%;
    }
    .map-rule-right {
      width: 40%;
    }
  }
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
}
</style>
