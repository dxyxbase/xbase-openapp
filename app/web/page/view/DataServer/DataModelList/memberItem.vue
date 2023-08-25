<template>
  <div class="model-class">
    <div class="header-back">
      <div>
        <span class="back" @click="$router.back(-1)">
          <a-icon type="left" />
          {{ query.name }}
        </span>
      </div>
      <!-- <div class="handleBtn">
        <a-switch @change="getList" checked-children="全部" un-checked-children="未标准化" v-model="filter_type" />
      </div> -->
    </div>
    <div class="table-box">
      <div ref="tableBox">
        <div v-if="lists.length === 0" class="noData" style="text-align: center">
          <img :src="require('@/asset/images/nodata.png')" alt="暂无数据" />
          <p>暂无内容</p>
        </div>
        <a-table v-else :scroll="{ y: height }" :columns="columns" :data-source="lists" :pagination="false" :rowKey="record => record.id" class="table-ui">
          <div slot="name" slot-scope="text" class="file-name">
            <span>{{ text }}</span>
          </div>
          <div slot="matched_codes" slot-scope="text" key="matched_codes">
            <span>{{ JSON.stringify(text) }}</span>
          </div>
          <div slot="Action" slot-scope="text, record" class="action-box">
            <a-button @click="bind(record, 'item')" type="link" class="actionBtn">
              <span>绑定</span>
            </a-button>
            <a-button :disabled="record.matched_codes.length === 0" @click="unbind(record)" type="link" class="actionBtn">
              <span>解绑</span>
            </a-button>
            <a-button @click="getAttr(record)" type="link" class="actionBtn">
              <span>绑定结果</span>
            </a-button>
          </div>
        </a-table>
      </div>
    </div>
    <a-modal title="绑定结果" :visible="visibleDetail" :destroyOnClose="true" :footer="null" centered class="pop-ui" width="500px" :maskClosable="false" @cancel="visibleDetail = false">
      <div v-if="visibleDetail" class="details">
        <pre>{{ propertys }}</pre>
      </div>
    </a-modal>
    <!-- 绑定model -->
    <bind-model v-if="isHandle" :isHandle="isHandle" :handleType="handleType" :handleData="handleData" @close="close"></bind-model>
    <unbind-model v-if="isunHandle" :isHandle="isunHandle" :handleType="handleType" :handleData="handleData" @close="close"></unbind-model>
  </div>
</template>
<script>
import { standard_model_components, standard_model_bind_data } from '@/apis/standard.js'
import { ResponseStatus } from '@/framework/network/util.js'
import bindModel from './bindModel.vue'
import unbindModel from './handleunbindModel.vue'
const lodash = require('lodash')
export default {
  components: { bindModel, unbindModel },
  data() {
    return {
      lists: [],
      height: window.innerHeight - 200,
      filter_type: true,
      visibleDetail: false,
      propertys: {},
      // 绑定传入
      handleData: {},
      handleType: null,
      isHandle: false,
      isunHandle: false
    }
  },
  mounted() {
    this.getList()
    this.$bus.off('updata/member')
    this.$bus.on('updata/member', () => {
      this.getList()
    })
    window.onresize = () => {
      this.resizeWind()
    }
  },
  methods: {
    unbind(item, type) {
      this.isunHandle = true
      this.handleType = type
      this.handleData = [item]
    },
    bind(item, type) {
      this.isHandle = true
      this.handleType = type
      this.handleData = [item]
    },
    close() {
      this.isHandle = false
      this.isunHandle = false
      this.handleType = null
      this.handleData = {}
    },
    async getAttr(item) {
      this.visibleDetail = true
      let params = {
        model_path: item.model_path,
        guids: [item.id]
      }
      const result = await standard_model_bind_data(params)
      if (result.code !== ResponseStatus.success) return
      const { data } = result
      this.propertys = data
    },
    resizeWind: lodash.throttle(function () {
      this.height = this.$refs.tableBox.offsetHeight - 54
    }, 200),
    async getList() {
      let obj = JSON.parse(JSON.stringify(this.query))
      delete obj.name
      let params = {
        ...obj,
        filter_type: this.filter_type ? 1 : 2
      }
      const res = await standard_model_components(params)
      if (res.code !== ResponseStatus.success) return
      const {
        data: { components = [] }
      } = res
      this.lists = components
    }
  },
  destroyed() {
    window.onresize = null
  },
  computed: {
    query() {
      return this.$route.query
    },
    columns() {
      return [
        {
          title: '构件名称',
          dataIndex: 'name',
          key: 'name',
          ellipsis: true,
          scopedSlots: { customRender: 'name' }
        },
        // {
        //   title: '分类编码绑定',
        //   dataIndex: 'matched_codes',
        //   scopedSlots: { customRender: 'matched_codes' },
        //   key: 'matched_codes',
        //   width: '240px'
        // },
        {
          title: '操作',
          key: 'action',
          dataIndex: 'action',
          width: '300px',
          scopedSlots: { customRender: 'Action' }
        }
      ]
    }
  }
}
</script>
<style lang="less" scoped>
// ::v-deep .ant-modal {
//   height: 80% !important;
//   overflow: auto;
// }
.details {
  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}
.model-class {
  display: flex;
  height: 100%;
  flex-direction: column;
  .table-box {
    height: 0;
    flex-grow: 1;
    overflow: hidden;
    > div {
      height: 100%;
    }
  }
}
.head-btn {
  border-bottom: 1px solid #f2f2f7;
  display: flex;
  justify-content: flex-start;
  gap: 18px;
  align-items: center;
  padding: 18px 0;
}
.header-back {
  border-bottom: 1px solid #f2f2f7;
  display: flex;
  justify-content: space-between;
  gap: 6px;
  align-items: center;
  padding: 18px 0;
  .back {
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    &:hover {
      text-decoration: underline;
      color: rgb(64, 158, 255);
    }
  }
  .handleBtn {
    padding-right: 20px;
    display: flex;
    align-items: center;
    gap: 24px;
  }
}
</style>
