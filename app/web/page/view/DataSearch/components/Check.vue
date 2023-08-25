<template>
  <div class="colCheck">
    <a-modal :visible="visible" centered width="1200px" :keyboard="false" :maskClosable="false" :destroyOnClose="true" :footer="null" :title="checkInfo.name" class="colCheckModal" @cancel="handleCancel">
      <div v-if="lists.length === 0" class="noData" style="text-align: center">
          <img :src="require('@/asset/images/nodata.png')" alt="暂无数据" />
          <p>无搜索结果</p>
      </div>
      <div v-else class="checkContent" width="50%">
        <div class="sceneTableOutContent" width="100%" style="border-right: 1px solid #f0f0f0">
          <div  width="600px">
            <a-table
              :columns="items"
              :data-source="lists"
              :pagination="true"
              :rowKey="record => record.id"
              class="table-ui"
            >
              <template #empty>
                <table-no-data/>
              </template>
              <div slot="name" slot-scope="text" class="file-name">
                <span key="preview" type="link" class="actionBtn">
                  {{ text }}
                </span>
              </div>

              <span slot="number" slot-scope="text">
                {{ text }}
              </span>

              <span slot="" slot-scope="text">
                {{ text }}
              </span>

              <div slot="Action" slot-scope="text, record" class="action-box">
                <a-button type="link" class="actionBtn" @click="handleCheck(record)">
                  <span>查看</span>
                </a-button>
              </div>

            </a-table>
          </div>
          
        </div>
        <div class="checkTable" :style="{width: '50%'}">
          <a-table
            border="inner"
            show-overflow
            show-header-overflow
            :columns="columns"
            :pagination="false"
            :dataSource="components"
            :auto-resize="true"
            class="vxeTable"
            :rowKey="record => record.number"
          >
            <template #empty>
              <table-no-data/>
            </template>

            <div slot="number" slot-scope="text" class="file-name">
              <span key="preview" type="link" class="actionBtn">
                {{ text }}
              </span>
            </div>

            <span slot="name" slot-scope="text">
              {{ text }}
            </span>

            <span slot="label" slot-scope="text">
              {{ text }}
            </span>

            <div slot-scope="text" slot="guid">
              <div>{{ text }}</div>
            </div>
          </a-table>
          <a-row type="flex" justify="end">
            <a-pagination 
              v-if="components.length" 
              style="margin: 12px 24px" 
              class="page-ui" size="small" 
              show-size-changer 
              :current="page_num" 
              :total="total" 
              :pageSize="page_size" 
              @change="handlePaging" 
              @showSizeChange="changePageSize" 
            />
          </a-row>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { nextTick } from 'vue'
import { search_model_list, search_component_list } from '@/apis/search'


export default {
  props: {
    closeCheck: Function,
    checkInfo: {},
  },
  computed: {
    columns() {
      return [
        {
          title: '序号',
          dataIndex: 'number',
          width: '60px',
          key: 'number',
          ellipsis: true,
          scopedSlots: { customRender: 'number' }
        },
        {
          title: '构件名称',
          dataIndex: 'name',
          key: 'name',
          width: '140px'
        },
        {
          title: '构件类别',
          width: '120px',
          key: 'label',
          dataIndex: 'label',
          ellipsis: true
        },
        {
          title: '构件ID',
          dataIndex: 'guid',
          key: 'guid',
          width: '200px'
        }
      ]
    },
    items() {
      return [
        {
          title: '文件名称',
          dataIndex: 'name',
          width: '140px',
          key: 'name',
          ellipsis: true,
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '搜索构件个数',
          dataIndex: 'matched_component_count',
          key: 'matched_component_count',
          width: '120px'
        },
        {
          title: '总构件个数',
          width: '120px',
          key: 'component_count',
          dataIndex: 'component_count',
          ellipsis: true
        },
        {
          title: '操作',
          key: 'action',
          dataIndex: 'action',
          width: '100px',
          scopedSlots: { customRender: 'Action' }
        }
      ]
    }
  },
  data() {
    return {
      components: [],
      pageSize: 10,
      visible: true,
      adaptiveWidth: '880px',
      previewName: '',
      checked: false,
      lists: [],
      searchForm: {
        page_num: 1,
        page_size: 10
      },
      page_num: 1,
      page_size: 10,
      total: 0,
      modelCount: 0,
      modelId: {},
    }
  },
  methods: {
    handleCheck(record) {
      this.getComponentsList(record)
      this.modelId = record
    },
    getComponentsList(record) {
      search_component_list({id: record.id, page_num: this.searchForm.page_num, page_size: this.searchForm.page_size}).then(res =>{
        this.components = res.data.component_list
        this.total = res.data.total
        if (this.searchForm.page_num !== 1 && res.data.component_list.length === 0) {
          this.searchForm.page_num = 1
          this.getComponentsList(record)
        }
      })
    },
    // 切换页码
    handlePaging(pageNum) {
      this.page_num = pageNum
      this.searchForm.page_num = pageNum
      this.getComponentsList(this.modelId)
    },
    // 改变每页数量
    changePageSize(current, pageSize) {
      this.page_size = pageSize
      this.searchForm.page_size = pageSize
      this.getComponentsList(this.modelId)
    },
    handleCancel() {
      this.closeCheck()
      this.visible = false
    },
    getSearchModelList() {
      search_model_list({id: this.checkInfo.id, page_num: 1, page_size: 100}).then(res => {
        this.lists = res.data.file_list
        this.modelCount = res.data.model_count
        if (this.searchForm.page_num !== 1 && res.data.file_list.length === 0) {
          this.searchForm.page_num = 1
          this.getSearchModelList()
        }
      })
    }
  },
  
  mounted(){
      if(!this.checkInfo) return
      this.getSearchModelList()
  },
}
</script>

<style lang="less">
.colCheckModal{
  .dxy-toolbar-group{
    display: none;
  }
  .checkContent{
    display: flex;
    height: 100%;
    // 左侧表格部分
    .checkTable{
      width: 100%;
      margin-left: 12px;
      .switch{
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #282828;
        margin-right: 8px;
        button{
          margin-left: 6px;
        }
      }
      .vxeTable{
        height: 726px;
        overflow-y: scroll;
        width: 100%;
        .vxe-header--column{
          background: #F5F8FD;
          height: 56px;
          line-height: unset;
          font-size: 14px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #282828;
        }
        .vxe-header--gutter{
          background: #fff !important;
        }
        .vxe-cell{
          height: 56px;
          max-height: 56px !important;
          line-height: 56px;
          padding-left: 24px;
        }
        .active-cell-current{
          background-color: rgba(14,128,231,0.08);
        }
      }
    }
    // 右侧模型部分
    .checkModel{
      width: 58%;
    }
  }
  .dsd-modal-body{
    height: 843px;
    padding: 0;
  }
  .dsd-tabs-tab{
    padding-top: 0;
    padding-bottom: 14px;
  }
  .dsd-tabs-top > .dsd-tabs-nav{
    margin: 0;
    align-items: flex-start;
  }
  .dsd-tabs-top > .dsd-tabs-nav::before{
    display: none;
  }
  .dsd-tabs-ink-bar{
    display: none;
  }
  .dsd-tabs-tab-active::after{
    content: '';
    position: absolute;
    bottom: 0;
    left: calc(50% - 12px);
    width: 24px;
    height: 2px;
    background-color: #0E80E7;
  }
}
</style>