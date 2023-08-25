<template>
  <div class="flexBetween">
    <div>
      <a-upload ref="uploadWrapper" name="file" :multiple="false" action="" :beforeUpload="beforeUpload" :file-list="fileList" :remove="handleRemove" accept=".csv" :customRequest="customRequest" :showUploadList="false" @preview="preview" @change="handleChange">
        <a-button :disabled="uploadDisabled" class="btn" type="primary">导入标准</a-button>
      </a-upload>
    </div>
  </div>
</template>

<script>
import { standard_model_import, check } from '@/apis/data.js'
import { ResponseStatus } from '@/framework/network/util.js'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    is_slice: {
      type: Boolean,
      default: false
    },
    up_type: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: undefined
    },
    asset_type: {
      type: Number,
      default: undefined
    }
  },
  data() {
    return {
      fileList: [],
      uploadDisabled: false,
      timer: null,
      tooltipTimer: null,
      visible: false
    }
  },
  mounted() {},
  beforeDestroy() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
    if (this.tooltipTimer) {
      clearTimeout(this.tooltipTimer)
      this.tooltipTimer = null
    }
  },
  methods: {
    async customRequest(data) {
      // 需要校验名称是否重复
      const name = data.file.name.substring(0, data.file.name.lastIndexOf('.'))
      const result = await check({ name: name })
      if (result.code !== ResponseStatus.success) return
      const {
        data: { is_exist }
      } = result
      if (is_exist) return this.$message.warning('模板名称不可重复')
      let formData = new FormData()
      formData.append('file', data.file)
      formData.append('version', '0') //用户填写的标准版本，standard_id不为空时必填
      // formData.append('standard_id','') //标准ID，为空则上传一份新的标准；不为空则更新当前标准，只更新当前标准最新版本
      // formData.append('group_id','') //分组ID
      standard_model_import(formData).then(res => {
        if (res.code !== ResponseStatus.success) return
        this.$message.success('导入成功')
        this.$bus.emit('updata/datalist')
      })
    },
    handleChange(file) {},
    handleRemove(file) {},
    preview(file) {},
    checkFileType(file) {
      const typeFile = file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length)
      return typeFile.toLowerCase() === 'csv'
    },

    beforeUpload(file) {
      return new Promise((resolve, reject) => {
        const isFile = this.checkFileType(file)
        if (!isFile) {
          this.$message.error('仅支持导入csv格式文件')
          reject(new Error('仅支持导入csv格式文件'))
        }
        resolve(isFile)
      })
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-modal {
  width: 75% !important;
}

.upload {
  /deep/ .ant-upload-list {
    display: none;
  }

  /deep/ .ant-progress-text {
    color: #2963ff !important;
  }

  .ant-btn {
    height: 36px;
    font-size: 16px;
    border-radius: 2px;
  }
}

.btn {
  min-width: 72px !important;
}
</style>
