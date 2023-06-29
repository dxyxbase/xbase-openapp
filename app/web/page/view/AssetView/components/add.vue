<template>
  <div class="addAsset">
    <a-form :form="form">
      <a-form-item label="资产名称" class="input-box">
        <a-input
          v-decorator="[
            'assetsName',
            {
              rules: [{ required: true, message: '资产名称不能为空' }],
              validateTrigger: 'blur',
              getValueFromEvent: getAssetsNameValue
            }
          ]"
          placeholder="分片上传默认源文件名称"
          @blur="handleCheck"
          autocomplete="off"
        />
      </a-form-item>
      <a-form-item label="资产类型">
        <a-select v-decorator="['asset_type', { rules: [{ required: true }], initialValue: 4 }]" @change="handleAssetsType">
          <a-select-option v-for="(item, i) in typeList" :key="i" :disabled="item.id === 3" :value="item.value">
            {{ item.text }}
          </a-select-option>
        </a-select>
        <span v-if="asset_type === 1 || asset_type === 2" class="tooltip">
          <a-icon type="exclamation-circle" />
          数据文件必须已经定义坐标系
        </span>
        <br />
        <span class="tooltip" style="color: #ff7875">
          <a-icon type="exclamation-circle" />
          所选择资产类型必须上传文件类型相匹配
        </span>
      </a-form-item>
    </a-form>

    <div class="up-box">
      <upload-tus up_type="asset" :is_slice="false" v-if="specialCharacters" :name="name" :asset_type="asset_type" type="primary" style="display: inline-block" />
      <!-- <upload-tus up_type="asset" :is_slice="true" v-if="specialCharacters" :name="name" :asset_type="asset_type" type="primary" style="display: inline-block" /> -->
    </div>
  </div>
</template>
<script type="text/babel">
import { countStrLength } from '@/utils/inputLimit'
import uploadTus from '@/component/Public/upload_tus.vue'
export default {
  components: { uploadTus },
  data() {
    return {
      form: this.$form.createForm(this, { name: 'coordinated' }),
      asset_type: 4,
      typeList: [
        { id: 1, text: '影像', value: 1 },
        { id: 2, text: '地形', value: 2 },
        // { id: 3, text: '矢量', value: 3 },
        { id: 4, text: '倾斜摄影模型', value: 4 }
      ],
      params: {},
      specialCharacters: false,
      name: null
    }
  },
  methods: {
    handleAssetsType(value) {
      this.asset_type = value
    },
    handleCheck() {
      const inputName = this.form.getFieldValue('assetsName')
      if (!inputName) return (this.specialCharacters = false)
      this.name = inputName

      this.specialCharacters = true
    },
    // 资产名称
    getAssetsNameValue(e) {
      let newVal = ''
      if (countStrLength(e.target.value) > 40) {
        newVal = this.assetName
        return newVal
      }
      newVal = e.target.value
      this.assetName = newVal
      return newVal
    }
  }
}
</script>
<style lang="less" scoped>
.up-box {
  text-align: center;
}
</style>
