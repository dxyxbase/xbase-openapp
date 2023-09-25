<template>
  <div class="colAddModal">
    <a-modal title="新建碰撞检查" :visible="true" :destroyOnClose="true" :footer="null" centered class="pop-ui" width="60rem" :maskClosable="false" @cancel="handleAdd(false)">
        <div class="colAddSteps">
        <a-steps :current="current">
          <a-step title="第一步" description="选择模型" />
          <a-step title="第二步" description="设置参数" />
        </a-steps>
      </div>
      <div class="colAddContent">
        <Step1 v-show="current === 0" :closeModal="closeModal" :handleNext="handleNext" @setSelectModel="getParams"/>
        <Step3 v-show="current === 1" :handlePreview="handlePreview" @cancel="cancelCreate" @updateList="updateList"/>
      </div>
    </a-modal>
  </div>
</template>

<script type="text/babel">
import Step1 from './Step1'
import Step3 from './Step3'
import { model_detail } from '@/apis/model'

export default {
  props: {
    updateList: Function,
    handleAdd: Function
  },
  components: { Step1, Step3 },
  data() {
    return {
      visible: false,
      current: 0,
      models:[],
      modelList:[],
      clashFormState: {}
    }
  },
  methods: {
    cancelCreate() {
      this.handleAdd(false)
    },
    getParams(id) {
      model_detail(id).then((res) => {
        this.modelList = [{
          model_list: res.data.model_id,
          name: res.data.name,
          render_path: res.data.render_path
        }]
      })
    },
    closeModal() {
      this.visible = false
      this.current = 0
    },
    handlePreview() {
      this.current--
    },
    handleNext() {
      this.current++
    },
  },
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
  width: 900px !important;
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
</style>