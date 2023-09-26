<template>
  <div class="model-class">
    <div class="header-back">
      <div>
        <span class="back" @click="$router.back(-1)">
          <a-icon type="left" />
          {{ query.name }}
        </span>
      </div>
      <div class="handleBtn">
        <!-- <a-switch @change="getList" checked-children="全部" un-checked-children="未标准化" v-model="filter_type" /> -->
        <!-- <a-button type="primary" class="addAttr">可视化开关</a-button> -->
      </div>
    </div>
    <div class="table-box">
      <div ref="tableBox">
        <div v-if="!lists.length" class="noData" style="text-align: center">
          <img :src="require('@/asset/images/nodata.png')" alt="暂无数据" />
          <p>暂无内容</p>
        </div>
        <a-table
          v-else
          :scroll="{ y: height }"
          :columns="columns"
          :data-source="lists"
          :pagination="false"
          :rowKey="record => record.id"
          class="table-ui"
        >
          <div slot="name" slot-scope="text, record" class="file-name">
            <a-button key="name" class="tdName" type="link" @click="goDetail(record)">
              <span>{{ text }}</span>
            </a-button>
          </div>
          <div slot="type" slot-scope="text, record" key="type">
            <span>{{ record.children_count + '/' + record.completed_count }}</span>
          </div>
          <div slot="Action" slot-scope="text, record" class="action-box">
            <a-button key="edit" @click="bind(record, 'type')" type="link" class="actionBtn">
              <span>绑定</span>
            </a-button>
            <a-button
              @click="unbind(record, 'type')"
              :disabled="record.completed_count === 0"
              key="del"
              type="link"
              class="actionBtn"
            >
              <span>解绑</span>
            </a-button>
          </div>
        </a-table>
      </div>
    </div>
    <!-- 绑定model -->
    <bind-model
      v-if="isHandle"
      :isHandle="isHandle"
      :handleType="handleType"
      :handleData="handleData"
      @close="close"
    ></bind-model>
    <unbind-model
      v-if="isunHandle"
      :isHandle="isunHandle"
      :handleType="handleType"
      :handleData="handleData"
      @close="close"
    ></unbind-model>
  </div>
</template>
<script>
import unbindModel from './handleunbindModel.vue'
import bindModel from './bindModel.vue'
import { standard_model_components } from '@/apis/standard.js'
import { ResponseStatus } from '@/framework/network/util.js'
const lodash = require('lodash')
export default {
  components: { bindModel, unbindModel },
  data() {
    return {
      lists: [],
      height: window.innerHeight - 200,
      standard_id: null,
      filter_type: false,
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
      // model_path: item.render_path,
      //   model_id: item.semantic_model_id,
      this.isunHandle = true
      this.handleType = type
      this.handleData = [{ ...item, model_path: this.query.model_path, model_id: this.query.model_id }]
    },
    bind(item, type) {
      this.isHandle = true
      this.handleType = type
      this.handleData = [{ ...item, model_path: this.query.model_path, model_id: this.query.model_id }]
    },
    close() {
      this.isHandle = false
      this.isunHandle = false
      this.handleType = null
      this.handleData = []
    },
    goDetail(item) {
      let params = {
        model_path: item.model_path,
        model_id: item.model_id,
        name: item.name,
        node_id: item.id
      }
      this.$router.push({ path: '/data-standard/standard-model/member-item', query: params })
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
      this.lists = components || []
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
          title: '构件类别',
          dataIndex: 'name',
          key: 'name',
          ellipsis: true,
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '分类编码绑定',
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' },
          key: 'type',
          width: '240px'
        },
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
