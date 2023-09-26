<template>
  <div class="colAddModal">
    <a-modal title="新建模型对比" :visible="true" :destroyOnClose="true" :footer="null" centered class="pop-ui" width="30rem" :maskClosable="false" @cancel="handleAdd(false)">
      <a-form
        ref="formRef"
        :model="formState"
        name="basic"
        :label-col="{ span: 6}"
        :wrapper-col="{ span: 16 }"
        :hideRequiredMark="true"
        autocomplete="off"
      >
        <a-form-model-item
          label="对比名称"
          name="name"
          :rules="[{ required: true, message: '请输入模型对比名称' }]"
          required
        >
          <a-input class="inputStyle" :value="formState.name" :maxlength="40" placeholder="请选择" @change="onNameChange" />
          <br/>
          <!-- <span v-if="!formState.name" style='position:absolute;color:red;'>请输入模型对比名称</span> -->
        </a-form-model-item>

        <a-form-model-item
          label="基准模型"
          name="modelA"
          class="checkboxItem"
          required
        >
          <a-tree-select
            :value="formState.modelA"
            dropdownClassName="treeSelectOpt"
            :dropdown-style="{ maxHeight: '360px', overflow: 'auto' }"
            placeholder="请选择"
            tree-default-expand-all
            :treeData="treeData"
            :replaceFields="{label: 'name', value: 'semantic_model_id'}"
            tree-node-filter-prop="name"
            @select="onSelectA"
          >
          </a-tree-select>
          <br/>
          <!-- <span v-show="selectItem" style='position:absolute;top:20px;color:red;'>请选择基准模型</span> -->
        </a-form-model-item>

        <a-form-model-item
          label="对比模型"
          name="modelB"
          class="lastItem"
          :rules="[{ required: true, message: '请选择' }]"
        >
          <div class="tolerance">
            <a-tree-select
              :value="formState.modelB"
              dropdownClassName="treeSelectOpt"
              :dropdown-style="{ maxHeight: '360px', overflow: 'auto' }"
              placeholder="请选择"
              tree-default-expand-all
              :treeData="treeData"
              :replaceFields="{label: 'name', value: 'semantic_model_id'}"
              tree-node-filter-prop="name"
              @select="onSelectB"
            >
            </a-tree-select>
            <br/>

            <!-- <span v-show="show"  style='position:absolute;top:30px;color:red;'>请选择对比模型</span> -->
          </div>
        </a-form-model-item>

      </a-form>
      <div class="colAddBtns">
        <a-space :size="12">
          <a-button @click="cancelCreate">取消</a-button>
          <a-button type="primary" :disabled="!formState.name || !formState.modelA || !formState.modelB" @click="handleSubmit">开始对比</a-button>
        </a-space>
      </div>
    </a-modal>
  </div>
</template>

<script type="text/babel">
import { trans_semantic_model_list } from '@/apis/model'
import { comparison_create } from '@/apis/comparison'
import { message } from 'ant-design-vue';
import { ResponseStatus } from '@/framework/network/util.js'


export default {
  props: {
    updateList: Function,
    handleAdd: Function
  },
  data() {
    return {
      visible: false,
      current: 0,
      models:[],
      selectItem: true,
      show: true,
      searchForm: {
        page_num: 1,
        page_size: 10,
        has_asm: true,
      },
      modelList:[],
      formState: {},
      value: undefined,
      treeData: [],
      modelList: []
    }
  },
  methods: {
    cancelCreate() {
      this.handleAdd(false)
    },
    onNameChange(e) {
      this.formState = {
        ...this.formState,
        name: e.target.value
      }
    },
    onSelectA(value, node, extra) {
      this.formState = {
        ...this.formState,
        modelA: value
      }
      this.selectItem = false
    },
    onSelectB(value, node, extra) {
      this.formState = {
        ...this.formState,
        modelB: value
      }
      this.show = false
    },
    handleSubmit() {
      let option = {
        name: this.formState.name,
        base_model_id:  this.formState.modelA,
        new_model_id:  this.formState.modelB,
      }
      comparison_create(option).then((res) => {
        if (res.code !== 0) {
          // if ( res.code === 10460006) {
          //   return message.warning({ content: '基准模型和对比模型相同', key: 'message' })
          // }
          return
        }
        this.$emit('updateList', res.data.model_diff_id)
      })
      this.visible = false
    },
    closeModal() {
      this.visible = false
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
.colAddSteps{
    padding: 30px 133px !important;
    margin-bottom: 36px;
    .dsd-steps-item-active{
      .dsd-steps-item-title{
        color: #0E80E7 !important;
      }
    }
    .dsd-steps .dsd-steps-item:not(.dsd-steps-item-active) > .dsd-steps-item-container[role='button']{
      cursor: auto;
    }
  }
  .colAddContent{
    display: flex;
    justify-content: center;
  }
.colAddModal{
  width: 600px !important;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #282828;
  .colAddSteps{
    padding: 30 133px;
    padding-bottom: 36px;
    .dsd-steps-item-active{
      .dsd-steps-item-title{
        color: #0E80E7 !important;
      }
    }
    .dsd-steps .dsd-steps-item:not(.dsd-steps-item-active) > .dsd-steps-item-container[role='button']{
      cursor: auto;
    }
  }
  .colAddContent{
    display: flex;
    justify-content: center;
    height: 425px;
    padding: 30px 100px;
  }
  .dsd-modal-body{
    padding: 0;
    padding-top: 36px;
  }
}
.colAddBtns{
  height: 77px;
  display: flex;
  justify-content: center;
  align-items: center;
  // border-top: 1px solid #E7E7E7;
  .subBtn{
    min-width: 100px;
  }
  button{
    min-width: 86px;
  }
}
</style>