<template>
  <div class="step1">
    <a-form
      ref="formRef"
      class="treeSelectOpt"
      :model="clashFormState"
      name="basic"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 10 }"
      autocomplete="off"
    >
      <a-form-model-item
        label="搜索记录名称"
        name="name"
        :rules="[{ required: true, message: '请输入搜索记录名称' }]"
        required
      >
        <a-input class="inputStyle" :value="recordName" :maxlength="40" placeholder="请输入搜索记录名称" @change="onNameChange" />
        <br/>
        <span v-if="!recordName" style='position:absolute;color:red;'>请输入搜索记录名称</span>
      </a-form-model-item>
      <a-form-item
        label="搜索范围"
        name="range"
        width="360px"
        required
      >
        <div class="searchScopeTree treeSelectOpt">
          <a-input-search :value="searchValue" allowClear placeholder="请输入关键字搜索" enter-button="搜索" style="width: 100%;"
            @search="onSearch" @change="handleChange" />
          <a-tree
            :expanded-keys="expandedKeys"
            :checkedKeys="checkedKeys"
            checkable
            :tree-data="treeData" 
            :auto-expand-parent="autoExpandParent" 
            @expand="onExpand" 
            @check="handleCheck"
          >
            <template #title="{ name }">
              <span v-if="name.indexOf(searchInputValue) > -1" class="treeNode">
                  <span>{{ name.substr(0, name.indexOf(searchInputValue)) }}</span>
                  <span style="color: #0E80E7">{{ searchInputValue }}</span>
                  {{ name.substr(name.indexOf(searchInputValue) + searchInputValue.length) }}
              </span>
              <span v-else class="treeNode">
                  {{ name }}
              </span>
            </template>
          </a-tree>
        </div>
      </a-form-item>
    </a-form>
    
    <div class="colAddBtns">
      <a-space :size="12">
        <a-button type="primary" :disabled="!checkedKeys.length || !recordName" @click="goNext">下一步</a-button>
      </a-space>
    </div>
  </div>
</template>

<script>
import { trans_semantic_model_list } from '@/apis/model'
import { component_category, component_property } from '@/apis/search'

import Bus from '../bus.js'
import { ResponseStatus } from '@/framework/network/util.js'

export default {
  props:{
    handleNext: Function
  },
  data() {
    return {
      visible:true,
      clashFormState: {},
      value:undefined,
      searchForm: {
        page_num: 1,
        page_size: 100,
        has_asm: true
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
      properties:[],
      recordName: '',
      selectedModels: [],
    }
  },
  methods: {
    getParentKey(key, tree){
      let parentKey;
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
          if (node.children.some(item => item.model_id === key)) {
            parentKey = node.model_id;
          } else if (getParentKey(key, node.children)) {
            parentKey = getParentKey(key, node.children);
          }
        }
      }
      return parentKey;
    },
    goNext() {
      this.handleNext(),
      Bus.$emit('pathList', [this.pathList, this.recordName])
      Bus.$emit('modelList', this.selectedModels)

    },
    onNameChange(e) {
        this.recordName = e.target.value
    },
    generateList(data) {
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const key = node.model_id;
        this.dataList.push({ key, name: node.name })
        if (node.children) {
          generateList(node.children);
        }
      }
    },
    onExpand(keys) {
      this.expandedKeys = keys
      this.autoExpandParent = false
    },
    onSearch (value) {
      this.searchInputValue = value
      const expanded = this.dataList
        .map((item) => {
          if (item.name.indexOf(value.trim()) > -1) {
            return getParentKey(item.key, this.treeData);
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
      this.expandedKeys = expanded;
      this.searchValue = value;
      this.autoExpandParent = true;
    },

    handleCheck(checkedKeys, e) {
      this.selectedModels = []
      this.pathList = []
      const { checkedNodes, checkedNodesPositions } = e
      // 获取模型路径
      this.modelList = checkedNodes.map(item => item.data.props.model_id);
      this.pathList = checkedNodes.map(item => item.data.props.render_path);
      
      // 获取搜索范围（最外层name）
      // item.pos.split('-')[1]代表当前节点的层级
      const arr = new Set(checkedNodesPositions.map(item => {
        return item.pos.split('-')[1]
      }))
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
    },
  },
  mounted: function (){
    this.getModelList()
  }
}
</script>

<style lang="less" scoped>
.ant-form-item-control {
  width:360px;
}
.step1{
  width: 100%;
  height: 100%;
  display: flex;
  // padding: 30px 233px !important;
  flex-direction: column;
  justify-content: center;
}
.colAddBtns{
  height: 77px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #E7E7E7;
  .subBtn{
    min-width: 100px;
  }
  button{
    min-width: 86px;
  }
}
.treeSelectSty{
  width: 360px !important;
}
.treeSelectOpt{
  padding-left: 0 !important;
  padding-right: 0 !important;
  .dsd-select-tree-node-content-wrapper{
    width:360px;
    overflow: hidden;
  }
  .dsd-select-tree-title{
    // width: 100%;
    display: inline-block;
  }
  .dsd-select-tree-node-selected{
    background-color: unset !important;
    color: #0E80E7;
  }
  .dsd-select-tree .dsd-select-tree-node-content-wrapper:hover{
    background-color: unset !important;
  }
  .dsd-select-tree-treenode:hover{
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