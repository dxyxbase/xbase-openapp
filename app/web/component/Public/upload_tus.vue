<template>
  <div class="flexBetween">
    <div>
      <a-upload
        ref="uploadWrapper"
        name="file"
        :multiple="false"
        action=""
        :beforeUpload="beforeUpload"
        :file-list="fileList"
        :remove="handleRemove"
        :accept="
          up_type === 'model' ? fileModel : up_type === 'member' ? '.rfa' : asset_type === 3 ? '.geojson' : fileAsset
        "
        :customRequest="customRequest"
        :showUploadList="false"
        @preview="preview"
        @change="handleChange"
      >
        <a-button :disabled="uploadDisabled" class="btn" type="primary">
          {{ is_slice ? '分片上传' : '普通上传' }}
        </a-button>
      </a-upload>
    </div>
  </div>
</template>

<script>
import { SET_TOKEN } from '@/page/store/mutation-type'
import storage from 'store'
import * as tus from 'tus-js-client'
import { model_upload_tus, model_upload } from '@/apis/model.js'
import { asset_upload, asset_upload_tus, tus_upload } from '@/apis/asset.js'
import { model_components_upload, model_components_save } from '@/apis/components.js'
import { ResponseStatus } from '@/framework/network/util.js'
import { fileModel, fileAsset } from '@/utils/setting.js'
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
    },
    is_Free: {
      type: Boolean,
      default: false
    },
    content: {
      type: Object,
      default: () => {}
    },
    // 上传类型，默认模型，其次还有构件
    upType: {
      type: String,
      default: 'model'
    },
    params: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      fileList: [],
      // 模型文件格式
      fileModel: fileModel, // model类型
      fileAsset: fileAsset, // asset
      // open5245 支持更多文件类型上传(nwd,nwc,gltf)
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
    tusUpload(item) {
      this.uploadDisabled = true
      var that = this
      const uploadBasicUrl = window.DXYP && window.DXYP.sdkServer.productionUploadURL
      var options = {
        endpoint: uploadBasicUrl,
        metadata: {
          // tus分片上传模型自定义名称，资产分片上传需要获取资源本身名称以及后缀
          filename: this.up_type === 'model' ? item.name : this.name,
          filetype: item.type
        },
        // chunkSize: Math.min(Math.max(100 * 1024, Math.ceil(item.size / 110)), 20 * 1024 * 1024),
        chunkSize: 10 * 1024 * 1024,
        headers: {
          Accept: 'application/json;',
          Authorization: `Bearer ${storage.get(SET_TOKEN)}`
        },
        uploadSize: item.size,
        onError(error) {
          throw error
        },
        onChunkComplete: function (chunkSize, bytesAccepted, bytesTotal) {
          let percentage = ((bytesAccepted / bytesTotal) * 100).toFixed(2)
        },
        onSuccess() {
          if (that.up_type === 'model') {
            that.uploadModel(upload, item)
          } else {
            that.uploadAsset(upload, item)
          }
        }
      }
      // let formData = new FormData()
      // formData.append('file', item.file)
      // formData.append('option', options)
      // tus_upload(formData).then(res => {
      //   console.log(res)
      // })
      // 传入文件对象，实例化上传对象
      var upload = new tus.Upload(item.file, options)
      item.upload = upload
      upload.start()
    },
    // 资产分片上传成功之后调用openapi接口进行保存
    uploadAsset(upload, item) {
      const id = upload.url.slice(upload.url.lastIndexOf('/') + 1)
      const params = {
        // name: this.name,
        // name: item.name.slice(0, item.name.lastIndexOf('.')),
        name: item.name,
        asset_type: this.asset_type,
        size: item.size,
        upload_file_id: id
      }
      asset_upload_tus(params)
        .then(res => {
          if (res.code === ResponseStatus.success) {
            this.$message.success('上传成功')
            this.$bus.emit('upData/asset')
            // this.$emit('refreshInit')
          }
        })
        .finally(() => {
          this.uploadDisabled = false
        })
    },
    // 保存模型
    uploadModel(upload, item) {
      const id = upload.url.slice(upload.url.lastIndexOf('/') + 1)
      const params = {
        name: item.name,
        size: item.size,
        upload_file_id: id
      }
      model_upload_tus(params)
        .then(res => {
          this.uploadDisabled = false
          if (res.code === ResponseStatus.success) {
            this.$message.success('上传成功')
            this.$emit('refreshInit')
          }
        })
        .finally(() => {
          this.uploadDisabled = false
        })
    },
    // 自定义上传
    customRequest(data) {
      let item = data.file
      let index = item.name.lastIndexOf('.')
      let fileType = item.name.substring(index + 1, item.name.length)
      const params = {
        progress: 0,
        name: item.name,
        type: fileType,
        size: item.size,
        lastModified: item.lastModified,
        file: item,
        uid: item.uid
      }
      if (this.is_slice) {
        this.tusUpload(params)
        return
      }
      // 普通上传（大文件建议分片上传，避免超时）
      if (this.up_type === 'model') {
        let formData = new FormData()
        formData.append('file', data.file)
        this.uploadDisabled = true
        model_upload(formData)
          .then(res => {
            this.uploadDisabled = false
            if (res.code !== ResponseStatus.success) return
            this.$message.success('上传成功')
            this.$emit('refreshInit')
          })
          .finally(() => {
            this.uploadDisabled = false
          })
      } else if (this.up_type === 'asset') {
        let formData = new FormData()
        formData.append('file', data.file)
        formData.append('name', this.name)
        formData.append('asset_type', this.asset_type * 1)
        this.uploadDisabled = true
        asset_upload(formData)
          .then(res => {
            this.uploadDisabled = false
            if (res.code !== ResponseStatus.success) return
            this.$bus.emit('upData/asset')
            this.$message.success('上传成功')
          })
          .finally(() => {
            this.uploadDisabled = false
          })
      } else if (this.up_type === 'member') {
        let formData = new FormData()
        formData.append('file', data.file)
        this.uploadDisabled = true
        model_components_upload(formData)
          .then(res => {
            this.uploadDisabled = false
            if (res.code !== ResponseStatus.success) return
            this.$message.success('上传成功')
            this.$emit('refreshInit')
          })
          .finally(() => {
            this.uploadDisabled = false
          })
      }
    },
    handleChange(file) {},
    handleRemove(file) {},
    preview(file) {},
    checkFileType(file) {
      const typeFile = file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length)
      let fileArr = []
      if (this.up_type === 'model') {
        fileArr = this.fileModel
      } else if (this.up_type === 'asset') {
        fileArr = this.fileAsset
        if (this.asset_type * 1 === 3) {
          fileArr = '.geojson'
        }
      } else if (this.up_type === 'member') {
        fileArr = '.rfa'
      }
      return fileArr.includes(typeFile.toLowerCase())
    },

    beforeUpload(file) {
      return new Promise((resolve, reject) => {
        const isFile = this.checkFileType(file)
        if (!isFile) {
          this.$message.error('不支持该格式，请重新选择')
          reject(new Error('不支持该格式，请重新选择'))
        }
        const type = file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length)
        if (type === 'geojson') {
          const isLt5M = file.size / 1024 / 1024 <= 5
          if (!isLt5M) {
            this.$message.error('矢量资产最大支持5MB文件')
            reject(new Error('矢量资产最大支持5MB文件'))
          }
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
