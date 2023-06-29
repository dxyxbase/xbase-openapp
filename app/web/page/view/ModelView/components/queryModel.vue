<template>
  <div>
    <a-row>
      <a-col :span="24">
        <a-row :gutter="16">
          <a-col :span="6">
            <div class="item">
              <span>渲染路径</span>
              <a-input disabled v-model="path_" placeholder="渲染路径" />
            </div>
          </a-col>
          <a-col :span="6">
            <div class="item">
              <span>数据格式</span>
              <a-select v-model="format">
                <a-select-option :value="item.value" v-for="item in formatList" :key="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="item">
              <span>深度</span>
              <a-input v-model="level_count" placeholder="模型构件树的深度" />
            </div>
          </a-col>
          <a-col :span="6">
            <div class="item">
              <span>关键词</span>
              <a-input required v-model="keyword" placeholder="查找关键词" />
            </div>
          </a-col>
        </a-row>
      </a-col>

      <a-col :span="24" :gutter="20">
        <a-row>
          <a-col :span="12">
            <div class="item"><a-button type="primary" @click="onChange('get')">获取模型构件树</a-button></div>
          </a-col>
          <a-col :span="12">
            <div class="item"><a-button type="primary" @click="onChange('query')">查找模型构件树</a-button></div>
          </a-col>
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
  max-height: 600px;
  overflow: auto;
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
import { model_tree_get, model_tree_query } from '@/apis/model.js'
import { ResponseStatus } from '@/framework/network/util.js'
export default {
  data() {
    return {
      path: '',
      format: 'flat',
      keyword: 'x',
      level_count: 7,
      formatList: [
        {
          label: 'flat',
          value: 'flat'
        },
        {
          label: 'tree',
          value: 'tree'
        }
      ],

      data: ''
    }
  },
  methods: {
    onChange(type) {
      let params = {}
      if (type === 'get') {
        params = {
          path: this.path,
          format: this.format,
          level_count: this.level_count
        }
        model_tree_get(params).then(res => {
          if (res.code !== ResponseStatus.success) return
          this.data = res.data || '暂无数据'
        })
      } else {
        params = {
          path: this.path,
          format: this.format,
          keyword: this.keyword
        }
        model_tree_query(params).then(res => {
          if (res.code !== ResponseStatus.success) return
          this.data = res.data || '暂无数据'
        })
      }
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
