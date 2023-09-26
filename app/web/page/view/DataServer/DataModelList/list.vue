<template>
  <div class="standard-map-class">
    <div class="table-box">
      <div v-if="lists.length === 0" class="noData" style="text-align: center">
        <img :src="require('@/asset/images/nodata.png')" alt="暂无数据" />
        <p>暂无内容</p>
      </div>
      <a-table
        v-else
        :columns="columns"
        :data-source="lists"
        :pagination="false"
        :rowKey="record => record.semantic_model_id"
        class="table-ui"
      >
        <div slot="name" slot-scope="text" class="file-name">
          <!-- <a-button key="name" type="link">
            <span>{{ text }}</span>
          </a-button> -->
          <span>{{ text }}</span>
        </div>
        <!-- <div slot="progress" key="progress">
          <span>-</span>
        </div> -->

        <div slot="Action" slot-scope="text, record" class="action-box">
          <a-button @click="openAuto(record)" type="link" class="actionBtn">
            <span>自动标准化</span>
          </a-button>
          <a-button @click="handleMatch(record)" type="link" class="actionBtn">
            <span>手动标准化</span>
          </a-button>
          <!-- <a-button @click="getProgress(record)" type="link" class="actionBtn">
            <span>test</span>
          </a-button> -->
        </div>
      </a-table>
      <a-row type="flex" justify="end">
        <a-pagination
          v-if="lists.length"
          style="margin: 12px 24px"
          class="page-ui"
          size="small"
          show-quick-jumper
          show-size-changer
          :current="page_num"
          :total="total"
          :pageSize="page_size"
          @change="handlePaging"
          @showSizeChange="changePageSize"
        />
      </a-row>
    </div>
    <a-modal
      width="650px"
      centered
      ok-text="确认"
      cancel-text="取消"
      @ok="autoMatch"
      title="自动标准化"
      :visible="visibleAutoMatch"
      :destroyOnClose="true"
      class="pop-ui"
      :maskClosable="false"
      @cancel="closeDia"
    >
      <template>
        <div>
          <a-form-item required label="模型分类标准" :labelCol="{ span: 8 }" :wrapperCol="{ span: 16 }">
            <a-select style="width: 100%" placeholder="请选择" v-model="standard_id">
              <a-select-option v-for="(val, key) in publishList" :key="key" :value="val.standard_id">
                {{ val.name + '/' + val.version }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item required label="应用范围" :labelCol="{ span: 8 }" :wrapperCol="{ span: 16 }">
            <a-select style="width: 100%" placeholder="请选择" v-model="scope">
              <a-select-option v-for="(val, key) in scopeObj" :key="key" :value="val.value">
                {{ val.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </div>
      </template>
    </a-modal>
  </div>
</template>
<script>
import { standard_model_processing_info, standard_publish_list, standard_model_autoMatch } from '@/apis/standard.js'
import { trans_semantic_model_list } from '@/apis/model.js'
import { ResponseStatus } from '@/framework/network/util.js'
export default {
  data() {
    return {
      lists: [],
      page_size: 10,
      page_num: 1,
      visibleAutoMatch: false,
      total: 0,
      scope: 1,
      standard_id: null,
      mapping_id: null,
      model_id: null,
      model_path: null,
      type: 'add',
      item: {},
      publishList: [],
      // 1应用全部构件，2应用未标准化的构件
      scopeObj: [
        { name: '应用全部构件', value: 1 },
        { name: '应用未标准化的构件', value: 2 }
      ]
    }
  },
  mounted() {
    this.getList()
    this.getPublishList()
  },
  methods: {
    closeDia() {
      this.visibleAutoMatch = false
      this.standard_id = null
      this.scope = 1
      this.model_path = null
      this.model_id = null
    },
    async getProgress(item) {
      const result = await standard_model_processing_info({ model_id: item.semantic_model_id })
      console.log(result)
    },
    handleMatch(item) {
      let params = {
        model_path: item.render_path,
        model_id: item.semantic_model_id,
        name: item.name
      }
      this.$router.push({ path: '/data-standard/standard-model/member', query: params })
    },
    // 自动匹配映射
    async autoMatch() {
      if (!this.scope || !this.standard_id) return this.$message.error('自动标准化需要选择标准ID与应用范围')
      let params = {
        model_path: this.model_path,
        model_id: this.model_id,
        scope: this.scope,
        standard_id: this.standard_id
      }
      const result = await standard_model_autoMatch(params)
      if (result.code !== ResponseStatus.success) return
      this.$message.success('操作成功')
      this.getList()
      this.closeDia()
    },
    openAuto(item) {
      this.visibleAutoMatch = true
      this.model_path = item.render_path
      this.model_id = item.semantic_model_id
    },
    async getPublishList() {
      const result = await standard_publish_list()
      if (result.code !== ResponseStatus.success) return
      const {
        data: { list = [] }
      } = result
      this.publishList = list
    },
    handlePaging(pageNum) {
      this.page_num = pageNum
      this.getList()
    },
    changePageSize(current, pageSize) {
      this.page_num = 1
      this.page_size = pageSize
      this.getList()
    },
    async getList() {
      let params = {
        page_size: this.page_size,
        page_num: this.page_num,
        has_asm: true
      }
      const res = await trans_semantic_model_list(params)
      if (res.code !== ResponseStatus.success) return

      this.lists = res.data.list || []
      this.total = res.data.total
      if (this.page_num !== 1 && this.lists.length === 0) {
        this.page_num = 1
        this.getList()
      }
    }
  },
  computed: {
    columns() {
      return [
        {
          title: '文件名称',
          dataIndex: 'name',
          key: 'name',
          ellipsis: true,
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '文件格式',
          dataIndex: 'file_type',
          scopedSlots: { customRender: 'file_type' },
          key: 'file_type',
          width: '200px'
        },
        // {
        //   title: '标准化状态',
        //   width: '200px',
        //   key: 'progress',
        //   dataIndex: 'progress',
        //   scopedSlots: { customRender: 'progress' }
        // },
        {
          title: '操作',
          key: 'action',
          dataIndex: 'action',
          width: '400px',
          scopedSlots: { customRender: 'Action' }
        }
      ]
    }
  }
}
</script>
<style lang="less" scoped>
.standard-map-class {
  padding-top: 12px;
}
.red {
  color: red;
}
.green {
  color: #b7eb8f;
}
.head-btn {
  border-bottom: 1px solid #f2f2f7;
  display: flex;
  justify-content: flex-start;
  gap: 18px;
  align-items: center;
  padding: 18px 0;
}
</style>
