<template>
  <div>
    <a-row>
      <a-col :span="24">
        <a-row :gutter="16">
          <a-col :span="8">
            <div class="item">
              <span>渲染路径</span>
              <a-input disabled v-model="path_" placeholder="渲染路径" />
            </div>
          </a-col>
          <a-col :span="8">
            <div class="item">
              <span>属性名称</span>
              <a-select v-model="name">
                <a-select-option :value="item.value" v-for="item in nameList" :key="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </div>
          </a-col>
          <a-col :span="8">
            <div class="item">
              <span>属性值</span>
              <a-input v-model="value" placeholder="渲染路径" />
            </div>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="24">
        <a-row :gutter="16">
          <a-col :span="8">
            <div class="item">
              <span>操作符</span>
              <a-select v-model="op">
                <a-select-option :value="item.value" v-for="item in opList" :key="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </div>
          </a-col>
          <a-col :span="8">
            <div class="item">
              <span>页码</span>
              <a-input-number id="inputNumber" v-model="page_num" :min="1" :max="10" @change="onChange" />
            </div>
          </a-col>
          <a-col :span="8">
            <div class="item">
              <span>每页数量</span>
              <a-input-number id="inputNumber" v-model="page_size" :min="1" :max="10" @change="onChange" />
            </div>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="24">
        <a-row>
          <div class="item">
            <a-col :span="2"><a-button type="primary" @click="onChange">查询</a-button></a-col>
          </div>
        </a-row>
      </a-col>
    </a-row>
    <div class="textContent">{{ data }}</div>
  </div>
</template>
<style lang="less" scoped>
.textContent {
  margin-top: 30px;
  min-height: 50px;
}
.item {
  width: 100%;
  margin-top: 12px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  > span {
    width: 50px;
  }
  .ant-select,
  .ant-input,
  .ant-input-number {
    flex-grow: 1;
    width: 0;
    overflow: hidden;
  }
}
#textarea {
  width: 100% !important;
  border: none;
}
</style>
<script>
import { model_attr_query } from '@/apis/model.js'
import { ResponseStatus } from '@/framework/network/util.js'
export default {
  data() {
    return {
      path: '',
      name: 'floor',
      value: '1V47f5Ktf9mu5ClqYEHx6r',
      op: 'e',
      page_num: 1,
      page_size: 10,
      pageNumber: 1,
      pageSize: 10,
      count: 0,
      nameList: [
        {
          label: '标高',
          value: 'floor'
        },
        {
          label: '类别',
          value: 'category'
        },
        {
          label: '子模型渲染路径',
          value: 'modelPathList'
        },
        {
          label: '专业',
          value: 'domain'
        }
      ],
      opList: [
        {
          label: '等于',
          value: 'e'
        },
        {
          label: '大于等于',
          value: 'gte'
        },
        {
          label: '大于',
          value: 'gt'
        },
        {
          label: '小于',
          value: 'lt'
        },
        {
          label: '小于等于',
          value: 'let'
        },
        {
          label: '正则匹配',
          value: 're'
        }
      ],
      data: ''
    }
  },
  methods: {
    onChange() {
      let params = {
        path: this.path,
        name: this.name,
        value: this.value,
        op: this.op,
        page_num: this.page_num,
        page_size: this.page_size
      }
      model_attr_query(params).then(res => {
        if (res.code !== ResponseStatus.success) return
        this.data = res.data.pageItems || '暂无数据'
      })
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    path_() {
      this.path = this.item.render_path
      return this.item.render_path
    }
    // model() {
    //   return JSON.stringify(this.tempItem, null, 4)
    // }
  }
}
</script>
