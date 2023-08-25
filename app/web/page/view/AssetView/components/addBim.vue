<template>
  <div class="addAsset">
    <a-form :form="form">
      <a-form-item label="资产名称" class="input-box">
        <a-input
          v-decorator="[
            'name',
            {
              rules: [{ required: true, message: '请输入资产名称' }],
              initialValue: name,
              validateTrigger: 'blur',
              getValueFromEvent: getAssetsNameValue
            }
          ]"
          placeholder="请输入BIM资产名称"
          @blur="handleCheck"
          autocomplete="off"
        />
      </a-form-item>
      <a-form-item label="选择模型">
        <a-select placeholder="请选择" v-decorator="['upload_file_id', { rules: [{ required: true, message: '请选择模型' }], initialValue: upload_file_id }]" @change="handleUpload_file_id">
          <a-select-option v-for="(item, i) in model_list" :key="item.model_id" :value="item.model_id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
    <div class="btns">
      <a-button @click="cancel">取消</a-button>
      <a-button type="primary" @click="handleAddAsset">添加</a-button>
    </div>
  </div>
</template>
<script type="text/babel">
import { countStrLength } from '@/utils/inputLimit'
import { model_list } from '@/apis/model.js'
import { asset_upload_tus } from '@/apis/asset.js'
import { ResponseStatus } from '@/framework/network/util.js'
export default {
  data() {
    return {
      form: this.$form.createForm(this, { name: 'coordinated' }),
      params: {},
      specialCharacters: false,
      name: undefined,
      model_list: [],
      upload_file_id: undefined
    }
  },
  mounted() {
    this.getModelList()
  },
  methods: {
    cancel() {
      this.$emit('cancel')
    },
    handleAddAsset() {
      const {
        form: { validateFields }
      } = this
      validateFields((err, val) => {
        if (!err) {
          asset_upload_tus({ ...val, asset_type: 5 }).then(res => {
            if (res.code !== ResponseStatus.success) return
            this.$message.success('添加成功')
            this.$emit('success')
          })
        }
      })
    },
    getModelList() {
      let params = {
        page_num: 1,
        page_size: 1000
      }
      model_list(params).then(res => {
        if (res.code !== ResponseStatus.success) return
        if (res.data.list && res.data.list.length > 0) {
          this.model_list = res.data.list.filter(item => {
            return item.status === 0 && item.file_type !== 'dwg' && item.file_type !== 'asm'
          })
        } else {
          this.model_list = []
        }
      })
    },
    handleUpload_file_id(value) {
      this.upload_file_id = value
    },
    handleCheck() {
      const inputName = this.form.getFieldValue('name')
      if (!inputName) return (this.specialCharacters = false)
      this.name = inputName

      this.specialCharacters = true
    },
    // 资产名称
    getAssetsNameValue(e) {
      let newVal = ''
      if (countStrLength(e.target.value) > 40) {
        newVal = this.name
        return newVal
      }
      newVal = e.target.value
      this.name = newVal
      return newVal
    }
  }
}
</script>
<style lang="less" scoped>
.btns {
  text-align: center;
}
.up-box {
  text-align: center;
}
</style>
