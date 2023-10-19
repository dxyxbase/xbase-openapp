<template>
  <div class="colAddModal">
    <a-modal
      :title="id ? `${selectName}装配编辑` : '新增装配'"
      :visible="true"
      :destroyOnClose="true"
      :footer="null"
      centered
      class="pop-ui"
      width="40rem"
      :maskClosable="false"
      @cancel="handleAdd(false)"
    >
      <div class="colAddContent">
        <div class="step1">
          <a-form ref="formRef" class="treeSelectOpt" :model="clashFormState" name="basic" autocomplete="off">
            <a-form-item name="range" width="360px" required>
              <div class="searchScopeTree treeSelectOpt">
                <a-input-search
                  :value="searchValue"
                  allowClear
                  placeholder="请输入关键字搜索"
                  enter-button="搜索"
                  style="width: 100%"
                  @search="onSearch"
                  @change="handleChange"
                />
                <a-tree
                  :expanded-keys="expandedKeys"
                  :checkedKeys="checkedKeys"
                  checkable
                  :tree-data="treeData"
                  :auto-expand-parent="autoExpandParent"
                  :replaceFields="replaceFields"
                  @expand="onExpand"
                  @check="handleCheck"
                >
                  <template #title="{ name }">
                    <span v-if="name.indexOf(searchInputValue) > -1" class="treeNode">
                      <span>{{ name.substr(0, name.indexOf(searchInputValue)) }}</span>
                      <span style="color: #0e80e7">{{ searchInputValue }}</span>
                      {{ name.substr(name.indexOf(searchInputValue) + searchInputValue.length) }}
                    </span>
                    <span v-else class="treeNode">
                      {{ name }}
                    </span>
                  </template>
                </a-tree>
              </div>
            </a-form-item>

            <a-form-model-item
              label="装配名称"
              name="name"
              :rules="[{ required: true, message: '请输入装配名称' }]"
              required
            >
              <a-input
                class="inputStyle"
                :value="recordName"
                :maxlength="30"
                :disabled="id ? true : false"
                placeholder="请输入装配名称"
                @change="onNameChange"
              />
              <br />
              <!-- <span v-if="!recordName" style='position:absolute;color:red;'>请输入搜索记录名称</span> -->
            </a-form-model-item>
          </a-form>

          <div class="examinationBtn">
            <a-button class="Btn closeBtn" @click="handleCancel">取消</a-button>
            <a-button
              type="primary"
              :disabled="checkedKeys.length < 2 || !recordName"
              class="Btn modelManage"
              @click="handleSure"
            >
              确定
            </a-button>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import {
  trans_semantic_model_list,
  semantic_model_assembly,
  semantic_model_assembly_update,
  semantic_model_assembly_children
} from '@/apis/model'

import Bus from '../bus.js'
import { ResponseStatus } from '@/framework/network/util.js'

export default {
  props: {
    handleNext: Function,
    handleAdd: Function,
    id: {
      type: String,
      default: ''
    },
    selectName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      visible: true,
      clashFormState: {},

      value: undefined,
      searchForm: {
        page_num: 1,
        page_size: 100,
        has_asm: false
      },
      visible: false,
      current: 0,
      treeItemVisible: {
        show: { display: 'list-item' },
        hide: { display: 'none' }
      },
      replaceFields: {
        children: 'nodes',
        title: 'name',
        key: 'semantic_model_id'
      },
      treeData: [],
      modelList: [],
      searchValue: '',
      expandedKeys: [],
      checkedKeys: [],
      pathList: [],
      searchRange: [],
      autoExpandParent: true,
      searchInputValue: '',
      dataList: [],
      properties: [],
      recordName: '',
      selectedModels: []
    }
  },
  methods: {
    handleCancel() {
      this.handleAdd(false)
    },
    handleSure() {
      if (this.id) {
        let params = {
          sub_model_ids: this.checkedKeys,
          asm_model_id: this.id
        }
        semantic_model_assembly_update(params).then(res => {
          if (res.code !== ResponseStatus.success) return
          this.$message.success('装配编辑成功')
          this.$emit('cancel')
        })
      } else {
        let params = {
          sub_model_ids: this.checkedKeys,
          name: this.recordName
        }
        semantic_model_assembly(params).then(res => {
          if (res.code !== ResponseStatus.success) return
          this.$message.success('装配成功')
          this.$emit('cancel')
        })
      }
    },
    closeModal() {
      this.visible = false
      this.current = 0
    },
    getParentKey(key, tree) {
      let parentKey
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i]
        if (node.children) {
          if (node.children.some(item => item.model_id === key)) {
            parentKey = node.model_id
          } else if (getParentKey(key, node.children)) {
            parentKey = getParentKey(key, node.children)
          }
        }
      }
      return parentKey
    },
    goNext() {
      this.handleNext(), Bus.$emit('pathList', [this.pathList, this.recordName])
      Bus.$emit('modelList', this.selectedModels)
    },
    onNameChange(e) {
      this.recordName = e.target.value
    },
    generateList(data) {
      for (let i = 0; i < data.length; i++) {
        const node = data[i]
        const key = node.model_id
        this.dataList.push({ key, name: node.name })
        if (node.children) {
          generateList(node.children)
        }
      }
    },
    onExpand(keys) {
      this.expandedKeys = keys
      this.autoExpandParent = false
    },
    treeDataAssembly(treeData, searchFilter) {
      const { treeItemVisible } = this
      const node = []
      for (const t of treeData) {
        if (searchFilter === '') {
          t.style = treeItemVisible.show
        } else t.style = treeItemVisible.hide
        if (t.name.indexOf(searchFilter) !== -1 || searchFilter === '') {
          t.style = treeItemVisible.show
          node.push(t)
        } else {
          t.style = treeItemVisible.hide
        }
      }
      return node
    },
    onSearch(v) {
      const value = v.trim()
      this.searchValue = value
      this.treeDataAssembly(this.treeData, value, [])
      if (value === '') {
        this.expandedKeys = []
        return
      }
      const openKeys = []
      this.dataList.forEach(item => {
        if (item.title.indexOf(value) > -1) {
          this.getParentKey(item.key, this.treeData, openKeys)
        }
        return null
      })
      this.autoExpandParent = true
      this.expandedKeys = [...new Set(openKeys)]
    },

    handleCheck(checkedKeys, e) {
      this.selectedModels = []
      this.pathList = []
      const { checkedNodes, checkedNodesPositions } = e
      // 获取模型路径
      this.modelList = checkedNodes.map(item => item.data.props.model_id)
      this.pathList = checkedNodes.map(item => item.data.props.render_path)

      // 获取搜索范围（最外层name）
      // item.pos.split('-')[1]代表当前节点的层级
      const arr = new Set(
        checkedNodesPositions.map(item => {
          return item.pos.split('-')[1]
        })
      )
      const arrName = [...arr].map(item => {
        return this.treeData && this.treeData[item - 0].name
      })
      this.searchRange = arrName
      this.checkedKeys = checkedKeys
    },
    handleChange(e) {
      this.searchValue = e.target.value.trim()
    },
    getModelList() {
      trans_semantic_model_list(this.searchForm).then(res => {
        if (res.code !== ResponseStatus.success) return
        this.treeData = res.data.list
      })
    }
  },
  mounted: function () {
    this.getModelList()
    if (this.id) {
      this.recordName = this.selectName
      semantic_model_assembly_children({ asm_model_id: this.id }).then(res => {
        if (res.code !== ResponseStatus.success) return
        if (res.data.sub_model_list && res.data.sub_model_list.length) {
          this.checkedKeys = res.data.sub_model_list.map(item => {
            return item.semantic_model_id
          })
        } else {
          this.checkedKeys = []
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.ant-form-item-control {
  width: 360px;
}
.step1 {
  width: 100%;
  height: 100%;
  display: flex;
  // padding: 30px 233px !important;
  flex-direction: column;
  justify-content: center;
}
.colAddBtns {
  height: 77px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #e7e7e7;
  .subBtn {
    min-width: 100px;
  }
  button {
    min-width: 86px;
  }
}
.treeSelectSty {
  width: 360px !important;
}
.treeSelectOpt {
  padding-left: 0 !important;
  padding-right: 0 !important;
  .dsd-select-tree-node-content-wrapper {
    width: 360px;
    overflow: hidden;
  }
  .dsd-select-tree-title {
    // width: 100%;
    display: inline-block;
  }
  .dsd-select-tree-node-selected {
    background-color: unset !important;
    color: #0e80e7;
  }
  .dsd-select-tree .dsd-select-tree-node-content-wrapper:hover {
    background-color: unset !important;
  }
  .dsd-select-tree-treenode:hover {
    background-color: #f5f5f5;
  }
}

:deep(.dsd-tree-switcher_close) {
  transform: rotate(0) !important;
}

:deep(.dsd-tree-switcher_open) {
  transform: rotate(0deg) !important;
}

:deep(.dsd-input-group-addon) {
  width: 72px;

  .dsd-input-search-button {
    min-width: 72px;
  }
}

:deep(.dsd-tree-list) {
  margin-top: 18px;

  .dsd-tree-switcher_open {
    transform: rotate(180deg);
  }

  .dsd-tree-switcher_close {
    transform: rotate(90deg);
  }

  .treeTitle {
    font-size: 14px;
    font-weight: 400;
    color: #282828;
  }

  .treeContent {
    font-size: 14px;
    color: #666666;
  }

  :deep(.dsd-tree-title) {
    word-break: break-all;
  }
}

:deep(.dsd-input-affix-wrapper) {
  height: 36px;
}

:deep(.dsd-input-group-addon) {
  .dsd-btn {
    min-height: 36px;
  }
}

.searchScopeTree {
  height: 99%;

  :deep(.dsd-tree) {
    height: calc(100% - 120px);
    overflow: auto;

    .dsd-tree {
      align-items: center;
    }
  }
}

:deep(.dsd-tree-treenode) {
  max-width: 100%;

  .dsd-tree-node-content-wrapper {
    overflow: hidden;

    .dsd-tree-title {
      display: flex;
    }

    .treeNode {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
}
</style>
