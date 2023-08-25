<template>
  <div class="step1">
    <a-form
      ref="formRef"
      class="treeSelectOpt"
      :model="clashFormState"
      name="basic"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
    >
      <a-form-item
        label="模型A"
        name="modelA"
        width="360px"
        :rules="[{ trigger: ['change', 'blur'], required: true, message: '请选择' }]"
      >
        <a-tree-select
          v-model="value"
          dropdownClassName="treeSelectOpt"
          :dropdown-style="{ maxHeight: '360px', overflow: 'auto' }"
          placeholder="请选择"
          allow-clear
          tree-default-expand-all
          :treeData="treeData"
          :replaceFields="{label: 'name', value: 'model_id'}"
          tree-node-filter-prop="name"
          @select="onSelect"
        >
        </a-tree-select>
      </a-form-item>
    </a-form>
    <div class="colAddBtns">
      <a-space :size="12">
        <a-button type="primary" :disabled="!clashFormState.modelA" @click="handleNext">下一步</a-button>
      </a-space>
    </div>
  </div>
</template>

<script>
import { model_list } from '@/apis/model'
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
        status:"[0]",
        has_bim_data: true
      },
      treeData: [],
      modelList: []
    }
  },
  methods: {
    onSelect(value, node, extra) {
      this.clashFormState = {
        ...this.clashFormState,
        modelA: value
      }
      const selected = extra.selectedNodes[0].data.props
      this.modelList = [{
        model_id: selected.model_id,
        name: selected.name,
        render_path: selected.render_path,
        code: '0'
      }]
      Bus.$emit('handleList', this.modelList)
    },
    getModelList() {
      model_list(this.searchForm).then(res => {
        if (res.code !== ResponseStatus.success) return
        res.data.list.forEach(model => {
            this.treeData.push(model)
        })
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
// :deep(.dsd-select-selector){
//   height: 36px !important;
// }
// :deep(.dsd-select-single .dsd-select-selector .dsd-select-selection-item){
//   line-height: 34px !important;
// }
// :deep(.dsd-select-selection-placeholder){
//   line-height: 34px !important;
// }
// :deep(.dsd-select-selection-search-input){
//   height: 34px !important;
//   line-height: 34px !important;
// }
// :deep(.dsd-form-item-label > label){
//   height: 36px !important;
//   width: 20% !important;
// }
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
</style>