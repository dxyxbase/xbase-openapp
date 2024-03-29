<template>
  <div class="model-box">
    <div class="head_opr">
      <a-button type="primary" class="btn1" @click="handleAdd">新建模型对比</a-button>
      <NewAdd @updateList="getComparisonList" :handleAdd="handleAdd" v-if="visibleAdd"></NewAdd>
    </div>
    <div class="sceneTableOutContent">
      <div>
        <div v-if="lists.length === 0" class="noData" style="text-align: center">
          <img :src="require('@/asset/images/nodata.png')" alt="暂无数据" />
          <p>暂无内容</p>
        </div>
        <a-table
          v-else
          :columns="columns"
          :data-source="lists"
          :pagination="false"
          :rowKey="record => record.model_diff_id"
          class="table-ui"
        >
          <div slot="name" slot-scope="text" class="file-name">
            <span key="preview" type="link" class="actionBtn">
              {{ text }}
            </span>
          </div>

          <span slot="base_model" slot-scope="text">
            {{ text.name }}
          </span>

          <span slot="new_model" slot-scope="text">
            {{ text.name }}
          </span>

          <div slot-scope="text" slot="status">
            <div>{{ statuObj[text.toString()] }}</div>
          </div>

          <template #update_time>
            <div slot-scope="record">
              <div>{{ record.created_time | formatDate }}</div>
            </div>
          </template>

          <div slot="Action" slot-scope="text, record" class="action-box">
            <a-button v-show="record.status === 2" type="link" class="actionBtn" @click="handleCheck(record)">
              <span>查看</span>
            </a-button>
            <a-button type="link" class="actionBtn" @click="handleDetail(record)">
              <span>详情</span>
            </a-button>
            <a-button
              type="link"
              :disabled="record.status === 2 || record.status === -1 || record.status === -2"
              @click="handleCancel(record)"
            >
              <span>取消</span>
            </a-button>
            <a-button
              type="link"
              :disabled="record.status === 0 || record.status === 1"
              class="actionBtn"
              @click="handleDelete(record)"
            >
              <span>删除</span>
            </a-button>
          </div>
        </a-table>
      </div>
      <a-row type="flex" justify="end">
        <a-pagination
          v-if="lists.length"
          style="margin: 12px 24px"
          class="page-ui"
          size="small"
          show-size-changer
          :current="page_num"
          :total="total"
          :pageSize="page_size"
          @change="handlePaging"
          @showSizeChange="changePageSize"
        />
      </a-row>
    </div>

    <Check v-if="checkVisible" :checkInfo="checkInfo" :closeCheck="closeCheck" />

    <a-modal
      title="详情"
      :visible="visible"
      :destroyOnClose="true"
      :footer="null"
      centered
      class="pop-ui"
      width="40rem"
      :maskClosable="false"
      @cancel="visible = false"
    >
      <div class="details" v-if="!!contents">
        <textarea id="textarea" readonly="readonly" v-model="contents" rows="20" width="30rem"></textarea>
      </div>
    </a-modal>
  </div>
</template>
<script type="text/babel">
import {
  comparison_lists,
  comparison_del,
  comparison_cancel,
  comparison_content,
  comparison_content_property
} from '@/apis/comparison.js'
import { Modal } from 'ant-design-vue'
import { ResponseStatus } from '@/framework/network/util.js'
import NewAdd from './components/NewAdd'
import Check from './components/Check'

export default {
  components: { NewAdd, Check },
  data() {
    return {
      visibleAdd: false,
      visible: false,
      detailTemp: null,
      checkInfo: null,
      checkVisible: false,
      searchForm: {
        page_num: 1,
        page_size: 10
      },
      // 碰撞检查状态； 0排队中，1检查中，2已完成，-1已取消，-2对比失败
      statuObj: {
        '-2': '对比失败',
        '-1': '已取消',
        0: '排队中',
        1: '对比中',
        2: '已完成'
      },
      total: 0,
      page_num: 1,
      page_size: 10,
      lists: [],
      contents: null
    }
  },
  methods: {
    // 点击新建
    handleAdd(visible) {
      this.visibleAdd = visible
    },
    handleCheck(row) {
      this.checkInfo = row
      this.checkVisible = true
    },

    closeCheck() {
      this.checkVisible = false
    },
    handleCancel(row) {
      const params = {
        model_diff_id: row.model_diff_id
      }
      comparison_cancel(params).then(res => {
        const { code } = res
        if (code !== ResponseStatus.success) return
        setTimeout(this.getComparisonList(), 3000)
      })
    },
    // 删除碰撞检查
    handleDelete(row) {
      Modal.confirm({
        title: '',
        keyboard: false,
        icon: '',
        centered: true,
        content: '此删除操作不可恢复，是否继续？',
        class: 'deleteModal',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const params = {
            model_diff_id_list: [row.model_diff_id]
          }
          comparison_del(params).then(res => {
            const { code } = res
            if (code !== ResponseStatus.success) return
            this.getComparisonList()
          })
        },
        onCancel() {}
      })
    },
    upload() {
      this.getComparisonList()
    },
    getComparisonList() {
      this.handleAdd(false)
      comparison_lists(this.searchForm).then(res => {
        if (res.code !== ResponseStatus.success) return
        this.lists = res.data.list
        this.total = res.data.total
        if (this.searchForm.page_num !== 1 && res.data.list.length === 0) {
          this.searchForm.page_num = 1
          this.getComparisonList()
        }
      })
    },
    // 切换页码
    handlePaging(pageNum) {
      this.page_num = pageNum
      this.searchForm.page_num = pageNum
      this.getComparisonList()
    },
    // 改变每页数量
    changePageSize(current, pageSize) {
      this.page_num = 1
      this.searchForm.page_num = 1
      this.page_size = pageSize
      this.searchForm.page_size = pageSize
      this.getComparisonList()
    },
    // 查看碰撞检查详情
    handleDetail(row) {
      this.contents = JSON.stringify(row, null, 4)
      this.visible = true
      comparison_content({ model_diff_id: row.model_diff_id }).then(res => {
        if (res.code !== ResponseStatus.success) return
        this.detailTemp = res.data
        this.visible = true
      })
    }
  },

  mounted() {
    this.getComparisonList()
    this.$bus.off('upData')
    this.$bus.on('upData', () => {
      this.getComparisonList()
      this.handleAdd(false)
    })
  },
  computed: {
    columns() {
      return [
        {
          title: '对比名称',
          dataIndex: 'name',
          width: '140px',
          key: 'name',
          ellipsis: true,
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '检查状态',
          width: '140px',
          key: 'status',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
          ellipsis: true
        },
        {
          title: '基准模型',
          dataIndex: 'base_model',
          key: 'base_model',
          scopedSlots: { customRender: 'base_model' },
          width: '140px'
        },
        {
          title: '对比模型',
          width: '140px',
          key: 'new_model',
          dataIndex: 'new_model',
          scopedSlots: { customRender: 'new_model' },
          ellipsis: true
        },
        {
          title: '创建时间',
          dataIndex: 'created_time',
          key: 'created_time',
          width: '140px'
        },
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
#textarea {
  width: 100% !important;
  border: none;
}
.model-box {
  width: 100%;
  height: 100%;
  .head_opr {
    border-bottom: 1px solid #f2f2f7;
    display: flex;
    justify-content: flex-start;
    gap: 18px;
    align-items: center;
    padding: 18px 0;
  }
  .sceneTableOutContent {
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    min-height: 100% !important;
    .noData {
      width: 240px;
      margin: 0 auto;
      margin-top: 10%;
      img {
        width: 240px;
        height: 200px;
      }
      p {
        margin-top: 18px !important;
        margin-bottom: 0;
        font-size: 16px;
        font-family: SourceHanSansSC-Normal, SourceHanSansSC;
        font-weight: 400;
        color: #666666;
      }
    }
    .sceneTable {
      height: 100%;
      color: #000;
      /deep/ .ant-table-thead {
        tr > th {
          background: #f5f8fd;
        }
      }
    }
  }
  .sceneIcon {
    display: inline-block;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #f5f8fd;
    margin-right: 14px;
    i {
      color: #0e80e7;
      font-size: 24px;
      margin: 3px;
    }
  }
  .nameTitle {
    cursor: pointer;
    display: flex;
    align-items: center;
    // 名称图标
    .name-icon {
      margin-right: 6px;
      width: 24px;
      height: 24px;
    }
  }
}
</style>
