<template>
  <div class="a">
    <a-modal :visible="visible" :title="!isEdit ? '资产装配' : '装配编辑'" :maskClosable="false" destroyOnClose centered width="32.5rem" @cancel="handleCancel">
      <div :style="{ borderBottom: '1px solid #E9E9E9', paddingBottom: '10px' }">
        <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange">全选</a-checkbox>
      </div>
      <div class="checkBox">
        <a-checkbox-group v-model="asset_ids" :options="plainOptions" @change="onChange" />
      </div>

      <template slot="footer">
        <div class="footer_input">
          <div class="examinationInput">
            <span class="l">装配名称</span>
            <div class="input_box">
              <a-input v-model.trim="name" class="input-box" placeholder="请输入装配名称" :disabled="isEdit"></a-input>
            </div>
          </div>
        </div>
        <div class="examinationBtn">
          <a-button class="Btn closeBtn" @click="handleCancel">取消</a-button>
          <a-button type="primary" class="Btn modelManage" @click="handleSure">确定</a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>
<script type="text/babel">
import { asset_list, asset_assembly, getAsset_by_asm } from '@/apis/asset.js'
import { ResponseStatus } from '@/framework/network/util.js'
let lodash = require('lodash')
export default {
  data() {
    return {
      asset_ids: [],
      indeterminate: false,
      checkAll: false,
      plainOptions: [],
      lists: [],
      selectKey: [],
      unit: 1,
      name: this.isEdit ? this.modelName : '',
      asm_id: null,
      tempObj: {}
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },

    modelName: {
      type: String,
      default: ''
    },
    assItem: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  async mounted() {
    this.getModelList()
    if (this.isEdit) {
      this.tempObj = lodash.cloneDeep(this.assItem)
      this.asm_id = this.tempObj.asset_id
      this.name = this.tempObj.name
      this.asset_ids = await this.getAssetByAsm(this.asm_id)
      this.indeterminate = true
    }
  },
  methods: {
    // 查询装配文件关联的资产
    async getAssetByAsm(id) {
      const result = await getAsset_by_asm({ asm_ids: [id] })
      if (result.code !== ResponseStatus.success) return
      let arr = result.data.asset_list[0].assets
      console.log(arr)
      let select = []
      if (arr && arr.length) {
        select = arr.map(item => {
          return item.asset_id
        })
      }
      return select
    },
    handleSure() {
      if (this.asset_ids.length < 2 || !this.name) {
        return this.$message.warning('请至少选择两个资产，且名称不能为空')
      }
      if (this.isEdit) {
        asset_assembly({ asm_id: this.asm_id, asset_ids: this.asset_ids }).then(res => {
          if (res.code !== ResponseStatus.success) return this.$message.error('资产装配编辑失败')
          this.$message.success('资产装配编辑成功')
          this.handleCancel()
        })
      } else {
        asset_assembly({ name: this.name, asset_ids: this.asset_ids }).then(res => {
          if (res.code !== ResponseStatus.success) return this.$message.error('资产装配失败')
          this.$message.success('资产装配成功')
          this.handleCancel()
        })
      }
    },
    getModelList() {
      let params = {
        page_num: 1,
        page_size: 9999,
        type: 1
      }
      this.plainOptions = []
      asset_list(params).then(res => {
        if (res.code !== ResponseStatus.success) return
        this.plainOptions = res.data.list.filter(item => {
          return item.status === 0 && !item.is_asm
        })
        this.plainOptions = this.plainOptions.map(item => {
          return {
            label: item.name,
            value: item.asset_id,
            disabled: item.is_asm
          }
        })
        this.selectKey = this.plainOptions.map(item => {
          return item.value
        })
      })
    },
    onChange(asset_ids) {
      this.indeterminate = !!asset_ids.length && asset_ids.length < this.plainOptions.length
      this.checkAll = asset_ids.length === this.plainOptions.length
    },
    onCheckAllChange(e) {
      Object.assign(this, {
        asset_ids: e.target.checked ? this.selectKey : [],
        indeterminate: false,
        checkAll: e.target.checked
      })
    },
    handleCancel() {
      this.tempObj = {}
      this.asm_id = ''
      this.name = ''
      this.$emit('assemblyClose', false)
    }
  }
}
</script>
<style lang="less" scoped>
::v-deep .ant-checkbox-group {
  display: flex;
  justify-content: flex-start;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}
.examinationBtn {
  text-align: center;
}
::v-deep .ant-modal-footer {
  border: none;
}
.checkBox {
  padding: 20px 0 0;
}
.footer_input {
  display: flex;
  gap: 12px;
  flex-direction: column;
  padding-bottom: 20px;
  .examinationInput {
    display: flex;
    gap: 12px;
    .l {
      width: 80px;
      text-align: right;
    }
    .input_box {
      flex-grow: 1;
      width: 0;
      overflow: hidden;
      > div {
        width: 100%;
      }
    }
  }
}
:v-deep .ant-modal-body {
  padding: 12px 24px !important;
}
</style>
