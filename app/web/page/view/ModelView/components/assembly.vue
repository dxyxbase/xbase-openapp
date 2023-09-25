<template>
  <div class="a">
    <a-modal
      :visible="visible"
      :title="!isEdit ? '模型装配' : '编辑'"
      :maskClosable="false"
      destroyOnClose
      centered
      width="32.5rem"
      @cancel="handleCancel"
    >
      <div :style="{ borderBottom: '1px solid #E9E9E9', paddingBottom: '10px' }">
        <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange">全选</a-checkbox>
      </div>
      <div class="checkBox">
        <a-checkbox-group v-model="sub_model_ids" :options="plainOptions" @change="onChange" />
      </div>

      <template slot="footer">
        <div class="footer_input">
          <div class="examinationInput">
            <span class="l">装配名称</span>
            <div class="input_box">
              <a-input
                v-model.trim="name"
                class="input-box"
                placeholder="请输入装配模型名称"
                :disabled="isEdit"
              ></a-input>
            </div>
          </div>
          <div class="examinationInput">
            <span class="l">装配单位</span>
            <div class="input_box">
              <a-select :default-value="1" v-model="unit" @change="handleChange">
                <a-select-option v-for="item in unitList" :key="item.value">{{ item.label }}</a-select-option>
              </a-select>
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
import { model_list, model_assembly, model_assembly_edit, model_detail } from '@/apis/model.js'
import { ResponseStatus } from '@/framework/network/util.js'
let lodash = require('lodash')
export default {
  data() {
    return {
      sub_model_ids: [],
      indeterminate: false,
      checkAll: false,
      plainOptions: [],
      lists: [],
      selectKey: [],
      unit: 1,
      name: this.isEdit ? this.modelName : '',
      unitList: [
        {
          label: 'mm',
          value: 1
        },
        {
          label: 'cm',
          value: 2
        },
        {
          label: 'dm',
          value: 3
        },
        {
          label: 'm',
          value: 4
        },
        {
          label: 'km',
          value: 5
        },
        {
          label: 'inch',
          value: 6
        },
        {
          label: 'foot',
          value: 7
        }
      ],
      model_id: null,
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
      this.model_id = this.tempObj.model_id
      this.unit = this.tempObj.unit
      this.name = this.tempObj.name
      this.indeterminate = true
      await this.getModelDetail(this.model_id)
    }
  },
  methods: {
    getModelDetail(id) {
      model_detail({ model_id: id })
        .then(res => {
          if (res.code !== ResponseStatus.success) return
          if (res.data.sub_model_list && res.data.sub_model_list.length > 0) {
            this.sub_model_ids = res.data.sub_model_list.map(item => {
              return item.model_id
            })
          }
        })
        .catch(() => {
          this.$message.error('查询详情失败')
        })
    },
    handleChange(value) {
      this.unit = value
    },
    handleSure() {
      if (this.sub_model_ids.length < 2 || !this.name || this.unit === null || this.unit === '') {
        return this.$message.warning('请至少选择两个模型，且名称不能为空')
      }
      let params = {
        unit: this.unit,
        sub_model_ids: this.sub_model_ids
      }
      if (this.isEdit) {
        model_assembly_edit({ model_id: this.model_id, ...params }).then(res => {
          if (res.code !== ResponseStatus.success) return this.$message.error('模型装配编辑失败')
          this.$message.success('模型装配编辑成功')
          this.handleCancel()
        })
      } else {
        model_assembly({ name: this.name, ...params }).then(res => {
          if (res.code !== ResponseStatus.success) return this.$message.error('模型装配失败')
          this.$message.success('模型装配成功')
          this.handleCancel()
        })
      }
    },

    getModelList() {
      let params = {
        page_num: 1,
        page_size: 9999
      }
      this.plainOptions = []
      model_list(params).then(res => {
        if (res.code !== ResponseStatus.success) return

        this.plainOptions = res.data.list.filter(item => {
          return (
            item.status === 0 && item.file_type !== 'asm' && item.file_type !== 'dwg' && item.file_type !== '3dtiles'
          )
        })
        this.plainOptions = this.plainOptions.map(item => {
          return {
            label: item.name,
            value: item.model_id,
            disabled:
              item.status !== 0 || item.file_type === 'asm' || item.file_type === 'dwg' || item.file_type === '3dtiles'
          }
        })
        this.selectKey = this.plainOptions.map(item => {
          return item.value
        })
      })
    },
    onChange(sub_model_ids) {
      this.indeterminate = !!sub_model_ids.length && sub_model_ids.length < this.plainOptions.length
      this.checkAll = sub_model_ids.length === this.plainOptions.length
    },
    onCheckAllChange(e) {
      Object.assign(this, {
        sub_model_ids: e.target.checked ? this.selectKey : [],
        indeterminate: false,
        checkAll: e.target.checked
      })
    },
    handleCancel() {
      this.tempObj = {}
      this.model_id = ''
      this.unit = 1
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
