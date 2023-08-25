<template>
  <div>
    <a-modal :visible="visible" class="outputSet" title="导出设置" :footer="null" @cancel="handleCancel" centered
      :maskClosable="false" :keyboard="false">
      <a-form :model="formState" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" autocomplete="off"
        class="noTitle">
        <a-form-item label="导出信息" name="regular"
          :rules="[{ required: true, message: '请输入自定义信息', validator: validateRegular, trigger: 'blur' }]">
          <a-checkbox-group @change="onChange" v-model="checkedList" :default-value="[1, 2, 3, 4]">
            <a-checkbox v-for="item of options" :key="item.id" :value="item.id" :disabled="item.disabled">
              {{ item.name }}
            </a-checkbox>
            <a-input style="margin-top:8px" :value="customRegular" v-show="checkedList.includes(6)"
              placeholder="请输入属性，多个属性之间用英文分隔" :maxLength="20" @input="handleInput" @blur="inputBlur"></a-input>
          </a-checkbox-group>
        </a-form-item>
        <a-form-item label="文件名称" name="file"
          :rules="[{ required: true, message: '请输入文件名称', validator: validateName, trigger: 'blur' }]">
          <a-input :value="formState.name" placeholder="请输入文件名称" @input="handleValite" :maxLength="20"></a-input>
        </a-form-item>
        <div class="center">
          <a-button class="mr12" @click="handleCancel">取消</a-button>
          <a-button type="primary" @click="onFinish">确定</a-button>
        </div>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { nextTick } from 'vue'
import { record_output, record_model_output } from '@/apis/search'



export default {
  props: {
    closeExport: Function,
    outputInfo: {},
  },
  data() {
    return {
    //   props: {
    //     visibleOutput: true,
    //     fromPage: Number,
    //     selectArrIds: {
    //         type: Array,
    //         default: () => []
    //     },
    //     recordId: Number,
    //     spinning1: {
    //         type: Boolean,
    //         default: false
    //     }
    //   },
      visible: true,
      options: [
        { id: 1, name: '构件名称', disabled: true },
        { id: 2, name: '构件类别', disabled: true },
        { id: 3, name: '构件ID', disabled: true },
        { id: 4, name: '搜索文件路径', disabled: true },
        { id: 5, name: '编码', disabled: false },
        { id: 6, name: '自定义信息', disabled: false },
      ],
      formState: {
        regular: '',
        name: '',
      },
      checkedList: [1, 2, 3, 4],
      customRegular: ''

    }
  },
  methods: {
    handleCancel() {
        this.closeExport()
        this.visible = false
    },
    onChange(checkedValues) {
        this.checkedList = checkedValues
    },
    validateRegular(value) {
        if (this.checkedList.includes(6) && !this.customRegular.value) {
            return Promise.reject('error');
        } else {
            return Promise.resolve();
        }
    },
    validateName(value) {
        if (!this.formState.name) {
            return Promise.reject('error');
        } else {
            return Promise.resolve();
        }
    },
    inputBlur() {
        // this.$refs.formRef.value.validateFields('regular')
    },
    downloadFile(data, file){
        let fileName = '';
        if (String(file) !== 'undefined') {
            fileName = String(file);
        } else {
            fileName = this.getCurrentDate();
        }
        let blob = new Blob([data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        let url = window.URL.createObjectURL(blob);
        const link = document.createElement('a'); // 创建a标签
        link.href = url;
        link.download = fileName; // 重命名文件
        link.click();
        URL.revokeObjectURL(url); // 释放内存
    },
    onFinish() {
        let params = {}
        let fileArr = []
        this.checkedList.forEach(item1 => {
            this.options.forEach(item2 => {
            if (item1 === item2.id && item1 !== 6) {
                fileArr.push(item2.name)
            }
            })
        })
        params = {
            record_id: this.outputInfo.id,
            fields: this.checkedList.includes(6) ? fileArr.concat(this.customRegular.split(';')) : fileArr,
            name: this.formState.name
        }
        record_output(params).then(res => {
            if (res.code !== 0) return
            this.closeExport()
            this.visible = false
            this.downloadFile(res, this.formState.name)
        })
    },
    handleInput(e) {
        this.customRegular = e.target.value.replace(/\s+/g, '')
        return this.customRegular
    },
    handleValite (e) {
        this.formState.name = e.target.value.replace(/[<>《》|\\\/?？*“”‘’：:\"＂＂‘’：：｜《》＜＞｜\＼\／＊]/g, '').replace(/\s+/g, '')
    }
  },
  mounted: function (){
    nextTick(() => {
        // removeDomTitle()
    })
  }
}

</script>

<style lang="less" scoped>
.dsd-checkbox-wrapper+.dsd-checkbox-wrapper {
  margin-left: 0;
}

.dsd-checkbox-wrapper:nth-child(6) {
  margin-top: 16px !important;
}

.dsd-checkbox-wrapper+.dsd-checkbox-wrapper {
  margin-top: 6px;
}

.flex {
  display: flex;
  width: 100%;
}

.dsd-spin-spinning {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1111;
  background: rgba(0, 0, 0, 0.25);
  :deep(.dsd-spin-dot-spin) {
    top: 50%;
  }
}

:deep(.dsd-checkbox-group) {
  min-height: 71px;
}

:deep(.dsd-input) {
  height: 36px;
}

:deep(.dsd-checkbox + span) {
  padding-right: 13px;
  padding-left: 5px;
}

:deep(.dsd-checkbox-disabled + span) {
  color: #000
}
</style>
<style lang="less" >
.outputSet{
  .dsd-modal-content{
    width: 572px;
  }
}
.enOutputSet{
  .dsd-modal-content{
    width: 620px;
  }
}
</style>
