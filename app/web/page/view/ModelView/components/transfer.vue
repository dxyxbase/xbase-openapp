<template>
  <a-modal title="转换格式" :visible="visible" :destroyOnClose="true" :footer="null" centered class="pop-ui" width="30rem" :maskClosable="false" @cancel="handleClick('cancel')">
    <div class="item" v-if="isrvt">
      <span class="l">导出房间：</span>
      <a-radio-group v-model="export_room" class="radioGroup">
        <a-radio :value="1" style="margin-right: 20px">是</a-radio>
        <a-radio :value="2">否</a-radio>
      </a-radio-group>
    </div>
    <div class="item" v-if="isrvt">
      <span class="l">导出材质：</span>
      <a-radio-group v-model="export_material" class="radioGroup">
        <a-radio :value="1" style="margin-right: 20px">是</a-radio>
        <a-radio :value="2">否</a-radio>
      </a-radio-group>
    </div>
    <div class="item" v-if="isifcrvt">
      <span class="l">转换语义数据：</span>
      <a-radio-group v-model="export_bim_data" class="radioGroup">
        <a-radio :value="1" style="margin-right: 20px">是</a-radio>
        <a-radio :value="2">否</a-radio>
      </a-radio-group>
    </div>
    <div class="item">
      <span class="l">导出瓦片数据：</span>
      <a-radio-group v-model="export_cim_data" class="radioGroup">
        <a-radio :value="1" style="margin-right: 20px">是</a-radio>
        <a-radio :value="2">否</a-radio>
      </a-radio-group>
    </div>
    <div class="item" v-if="export_cim_data === 1 && isrvt">
      <span class="l">精细等级：</span>
      <a-checkbox-group v-model="hierarchy" :default-value="['space']">
        <span v-for="item in optionsWithDisabled" :key="item.value" class="group-check-box">
          <a-checkbox :value="item.value" :disabled="tileGradeDisabled(item.value)">
            <span class="tile-label">{{ item.label }}</span>
          </a-checkbox>
        </span>
      </a-checkbox-group>
    </div>
    <div class="item slider-box" v-if="isrvt">
      <span class="l">精细度</span>
      <a-slider v-model="detail_level" :default-value="7" :marks="marks" :min="1" :max="14" class="radioGroup1" />
    </div>
    <div class="item" v-if="isrvt">
      <span class="l">导出二维视图：</span>
      <a-radio-group v-model="export_2d_views" class="radioGroup">
        <a-radio :value="1" style="margin-right: 20px">是</a-radio>
        <a-radio :value="2">否</a-radio>
      </a-radio-group>
    </div>
    <div class="btn-box" style="margin-top: 24px">
      <a-button class="cancel-btn" @click="handleClick('cancel')">取消</a-button>
      <a-button class="comfirm-btn" style="min-width: 92px !important; width: auto !important" type="primary" :disabled="disabled" @click="handleClick('sure')">发起转换</a-button>
    </div>
  </a-modal>
</template>
<style lang="less" scoped>
.item {
  margin-bottom: 12px;
}
.btn-box {
  text-align: center;
  .cancel-btn {
    margin-right: 24px;
  }
}
</style>
<script>
export default {
  data() {
    const optionsWithDisabled = [
      { label: '空间级', value: 'space' },
      { label: '建筑级', value: 'build' },
      { label: '构件级', value: 'component' }
    ]
    return {
      export_room: 2, // 导出房间  目前仅支持rvt文件, 默认false
      export_material: 2, // 导出材质  目前仅支持rvt文件, 默认false
      export_bim_data: 2, // 是否转换语义 目前仅支持ifc、rvt文件, 默认false
      export_cim_data: 2, //是否导出瓦片数据
      detail_level: 7, // 精细度  仅支持rvt文件, 默认7
      export_2d_views: 2, //是否导出二维视图  仅支持rvt文件, 默认false
      optionsWithDisabled,
      supCim: ['rvt', 'skp', 'fbx', 'ifc', 'obj', 'stl', 'glb'],
      hierarchy: ['component'],
      marks: {
        1: '1',
        7: '7',
        14: '14'
      }
    }
  },
  methods: {
    tileGradeDisabled(value) {
      // 如果选了2个，则另外一个禁用
      const checkedNum = this.hierarchy.length
      return checkedNum === 2 && this.hierarchy.indexOf(value) === -1
    },
    handleClick(flag) {
      if (this.hierarchy.length === 0 && this.export_cim_data === 1 && this.isrvt) return this.$message.warning('rvt格式导出瓦片数据的精细等级最少选择一个')
      if (flag === 'sure') {
        const params = {
          model_id: this.tempItem.model_id,
          export_room: this.export_room === 1,
          export_material: this.export_room === 1,
          export_bim_data: this.export_bim_data === 1,
          export_cim_data: this.export_cim_data === 1,
          detail_level: this.detail_level,
          export_2d_views: this.export_2d_views === 1,
          hierarchy: this.isrvt ? this.hierarchy : []
        }
        this.$emit('fetchTransfer', params, 'close')
      } else {
        this.$emit('closeTransfer', flag)
      }
    }
  },
  computed: {
    isrvt() {
      return this.tempItem.file_type === 'rvt'
    },
    isifcrvt() {
      const str = 'ifcrvt'
      return str.indexOf(this.tempItem.file_type) >= 0
    }
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    },
    tempItem: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
