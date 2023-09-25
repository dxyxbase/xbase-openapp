<template>
  <div class="model-box">
    <div class="head_opr">
      <a-button type="primary" class="btn1" @click="handleAdd">高级搜索</a-button>
        <NewAdd :updateList="getRecordList" :handleAdd="handleAdd" v-if="visibleAdd"></NewAdd>
      <!-- <a-button type="primary" class="btn1" :disabled="!lists.length" @click="handleAdd">删除</a-button> -->
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
          :rowKey="record => record.id"
          class="table-ui"
        >
          
          <div slot="name" slot-scope="text" class="file-name">
            <span key="preview" type="link" class="actionBtn">
              {{ text }}
            </span>
          </div>
          
          <div slot-scope="text" slot="status">
            <div>{{ statuObj[text.toString()] }}</div>
          </div>

          <template #update_time>
            <div slot-scope="record">
                <div>{{ record.create_time | formatDate }}</div>
            </div>
          </template>

          

          <div slot="Action" slot-scope="text, record" class="action-box">
            <a-button v-show="record.status === 2" type="link" class="actionBtn" @click="handleCheck(record)">
              <span>查看</span>
            </a-button>
            <!-- <a-button type="link" :disabled="record.status === 0 || record.status === 1" @click="handleExport(record)">
              <span>导出</span>
            </a-button> -->
            <a-button type="link" :disabled="record.status === 0 || record.status === 1" class="actionBtn" @click="handleDelete(record)">
              <span>删除</span>
            </a-button>
          </div>

        </a-table>
      </div>
      <a-row type="flex" justify="end">
        <a-pagination v-if="lists.length" style="margin: 12px 24px" class="page-ui" size="small" show-size-changer :current="page_num" :total="total" :pageSize="page_size" @change="handlePaging" @showSizeChange="changePageSize" />
      </a-row>
    </div>

    <Check v-if="checkVisible" :checkInfo="checkInfo" :closeCheck="closeCheck" />
    <OutputSet v-if="outputVisible" :outputInfo="checkInfo" :closeExport="closeExport" />


  </div>
  
</template>
<script type="text/babel">
import { search_record_list, search_record_delete, search_cancel, search_component_list} from '@/apis/search.js'
import { Modal } from 'ant-design-vue';
import { ResponseStatus } from '@/framework/network/util.js'
import NewAdd from './components/NewAdd'
import Check from './components/Check'
import OutputSet from './components/outputSet'

import Bus from './bus.js'

export default {
  components: { NewAdd, Check, OutputSet },
  data() {
    return {
      visibleAdd: false,
      visible: false,
      detailTemp: null,
      checkInfo: null,
      checkVisible: false,
      outputVisible: false,
      searchForm: {
        page_num: 1,
        page_size: 10
      },
      // 碰撞检查状态； 0等待中，1检查中，2已完成，-1已取消
      statuObj: {
        0: '搜索中',
        1: '搜索失败',
        2: '搜索完成'
      },
      total: 0,
      page_num: 1,
      page_size: 10,
      lists: [],
      contents: null,
    }
  },
  created() {
    Bus.$on('updateList',this.getRecordList)
  },
  methods: {
    // 点击新建
    handleAdd(visible){
      this.visibleAdd = visible
    },
    handleCheck(row){
      this.checkInfo = row
      this.checkVisible = true
    },
   
    closeCheck() {
      this.checkVisible = false
    },
    closeExport() {
      this.outputVisible = false
    },
    handleExport(row){
        this.checkInfo = row
        this.outputVisible = true
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
            record_ids: [row.id]
          }
          search_record_delete(params).then(res => {
            const { code } = res
            if(code !== ResponseStatus.success) return
            this.getRecordList()
          })
        },
        onCancel () { },
      });
      
    },
    upload() {
      this.getRecordList()
    },
    getRecordList() {
      this.handleAdd(false)
      search_record_list(this.searchForm).then(res => {
        if (res.code !== ResponseStatus.success) return
        this.lists = res.data.list
        this.total = res.data.total
        if (this.searchForm.page_num !== 1 && res.data.list.length === 0) {
          this.searchForm.page_num = 1
          this.getRecordList()
        }
      })
    },
    // 切换页码
    handlePaging(pageNum) {
      this.page_num = pageNum
      this.searchForm.page_num = pageNum
      this.getRecordList()
    },
    // 改变每页数量
    changePageSize(current, pageSize) {
      this.page_num = 1
      this.searchForm.page_num = 1
      this.page_size = pageSize
      this.searchForm.page_size = pageSize
      this.getRecordList()
    },
    // 查看碰撞检查详情
    handleDetail(row) {
      this.contents = JSON.stringify(row, null, 4)
      this.visible = true
      search_component_list({ clash_id: row.clash_id, type: row.type, page_num: this.page_num, page_size:this.page_size})
      .then(res => {
        if (res.code !== ResponseStatus.success) return
        this.detailTemp = res.data
        this.visible = true
      })
    }
  },
   
  mounted() {
    this.getRecordList()
    this.$bus.off('upData')
    this.$bus.on('upData', () => {
      this.getRecordList()
      this.handleAdd(false)
    })
  },
  computed: {
    columns() {
      return [
        {
          title: '搜索记录名称',
          dataIndex: 'name',
          width: '140px',
          key: 'name',
          ellipsis: true,
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '搜索状态',
          width: '140px',
          key: 'status',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
          ellipsis: true
        },
        {
          title: '创建时间',
          dataIndex: 'create_time',
          key: 'create_time',
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
