<template>
  <div class="step3">
    <a-form
      ref="formRef"
      :model="clashFormState"
      name="basic"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
      :hideRequiredMark="true"
      autocomplete="off"
    >
      <a-form-model-item
        label="检查名称"
        name="name"
        :rules="[{ required: true, message: '请输入' }]"
        required
      >
        <a-input class="inputStyle" :value="clashFormState.name" :maxlength="40" placeholder="请输入" @change="onNameChange" />
        <br/>
        <span v-if="!clashFormState.name" style='position:absolute;color:red;'>请输入检查名称</span>
      </a-form-model-item>

      <a-form-model-item
        label="碰撞类型"
        name="type"
        class="checkboxItem"
        required
      >
        <a-checkbox-group :value="clashFormState.type" @change="checkBoxChange">
          <a-checkbox :value="1" name="type" >硬碰撞</a-checkbox>
          <a-checkbox :value="2" name="type">间隙碰撞</a-checkbox>
        </a-checkbox-group>
        <br/>
        <span v-show="selectItem" style='position:absolute;top:20px;color:red;'>请至少选择一个</span>
      </a-form-model-item>

      <a-form-model-item
        label="碰撞公差"
        name="tolerance"
        class="lastItem"
        :rules="[{ required: true, message: '请输入' }]"
      >
        <div class="tolerance">
          <a-input class="inputStyle" :value="clashFormState.tolerance" :maxlength="9" :disabled="selected" addon-after="mm" placeholder="请输入" @change="onTypeChange" />
          <span v-show="show" style='position:absolute;top:30px' class="tips">当物体间距小于等于碰撞公差报告间隙碰撞</span>
        </div>
      </a-form-model-item>

    </a-form>
    <div class="colAddBtns">
      <a-space :size="12">
        <a-button @click="handlePreview">上一步</a-button>
        <a-button type="primary" :disabled="loading || !clashFormState.name && !clashFormState.name" @click="handleSubmit">开始检查</a-button>
      </a-space>
    </div>
  </div>
</template>

<script>
import { message } from 'ant-design-vue';
import { ResponseStatus } from '@/framework/network/util.js'
import { clash_create } from '@/apis/clash'
import {ExclamationCircleFilled} from '@ant-design/icons-vue'
import Bus from '../bus.js'


export default {
  props: {
    handlePreview: Function,
    closeModal: Function,
    getParams: [],
    visible: true
  },
  data() {
    return {
      clashFormState: {},
      loading: false,
      clashId: '',
      selected: true,
      selectItem: true,
      show: false,
      modelList:[]
    }
  },
  created(){
    Bus.$on('handleList', (data) => {
      this.modelList = data
    })
  },
  beforeDestroy() {
      Bus.$off('handleList');
  },
  methods: {
    onTypeChange(e) {
      let val = e.target.value
      if(val) {
        // 只能输入数字，且不能是0开头
        val = val.replace(/[^\d]/g,'').replace(/^0{1,}/g,'')
        // 转千分位
        val = Number(val).toLocaleString()
      }
      if(val === '0') {
        val = ''
      }
      this.clashFormState = {
        ...this.clashFormState,
        tolerance: val
      }
    },
    onNameChange(e) {
      this.clashFormState = {
        ...this.clashFormState,
        name: e.target.value
      }
    },
    checkBoxChange(checkedValues){
      this.clashFormState = {
          ...this.clashFormState,
          type: checkedValues
      }
      if (!this.clashFormState.type[0]) {
          this.selectItem = true
          return
      }else {
          this.selectItem = false
          if (!this.clashFormState.type.includes(2)) {
            this.selected = true
            this.show = false
          } else {
            this.selected = false
            this.show = true 
          }
      }
      
      
    },
    getType() {
      if(this.clashFormState.type.length === 2) {
        return 3
      } else {
        return this.clashFormState.type[0]
      }
    },
    getTolerance(val) {
      if(!val) return val
      if(typeof val === 'string' && val.includes(',')) {
        const regExp = new RegExp(',', 'g')
        let newVal = val.replace(regExp, '')
        return Number(newVal)
      } else {
        return Number(val)
      }
    },
    handleSubmit(){
      // this.closeModal
      // this.visible = false
      this.$emit('cancel', null, false)
      this.loading = true
      let params = {
        model_list: this.modelList,
        type: this.getType(),
        name: this.clashFormState.name
      }
      if (this.getType() !== 1 ) {
        params.tolerance = this.getTolerance(this.clashFormState.tolerance)
      }  else {
        params.tolerance = 1
      }
      clash_create(params).then(res => {
        if (res.code === 10350004) {
          return message.warning({ content: '存在重命名的检查名称', key: 'message' })
        }
        if (res.code !== ResponseStatus.success) return
        this.clashId = res.clash_id
        this.$emit('cancel', null, false)
        //updateList
        Bus.$emit('updateList', this.clashId)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.step3{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  :deep(.dsd-form-item-control) {
    display: flex;
    justify-content: center;
  }
}
.formRule{
  :deep(.dsd-form-item-label > label){
    align-items: flex-start;
  }
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
.tolerance{
  display: flex;
  flex-direction: column;
  .tips{
    width: 360px;
    margin-top: 6px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 17px;
    .anticon{
      color: #F8A928;
      margin-right: 6px;
      vertical-align: text-top;
    }
  }
}
.inputStyle{
  width: 360px;
  height: 36px;
}
.checkRule{
  width: 360px;
}
.checkboxItem{
  // height: 23px;
  margin-bottom: 24px;
}
.lastItem {
  margin-bottom: 58px;
}
:deep(.dsd-input-group){
  line-height: 34px;
}
:deep(.dsd-input-group .dsd-input){
  height: 36px;
}
:deep(.dsd-form-item-label > label){
  height: 36px;
}
:deep(.dsd-input-group-addon) {
  width: 60px;
  background-color: #F5F5F5;
}
</style>