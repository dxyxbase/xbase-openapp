<template>
  <div class="colCheck">
    <a-modal :visible="visible" centered width="800px" :keyboard="false" :maskClosable="false" :destroyOnClose="true" :footer="null" :title="checkInfo.name" class="colCheckModal" @cancel="handleCancel">
      <div class="checkContent">
        <div class="checkTable" :style="{width: checked ? '42%' : '100%'}">
          <a-tabs :activeKey="activeKey" @change="changeActiveKey">
            <a-tab-pane key="3" :tab="`全部（${checkInfo.hard_clash + checkInfo.clearance_clash}）`">
              <div>
                <a-table
                  border="inner"
                  show-overflow
                  show-header-overflow
                  :columns="columns"
                  :dataSource="xTable"
                  :height="adaptiveWidth"
                  :pagination="false"
                  :auto-resize="true"
                  class="vxeTable"
                  :rowKey="record => record.id"
                  :loading="loadingMap[3]"
                >
                  <template #empty>
                    <table-no-data />
                  </template>
                  <div slot="id" slot-scope="text" class="file-name">
                    <span key="preview" type="link" class="actionBtn">
                      {{ text }}
                    </span>
                  </div>

                  <span slot="clash_a" slot-scope="text">
                    {{ text }}
                  </span>

                  <span slot="clash_b" slot-scope="text">
                    {{ text }}
                  </span>

                  <div slot-scope="text" slot="type">
                    <div>{{ collisionType[text] }}</div>
                  </div>
                </a-table>
                <a-row type="flex" justify="end">
                  <a-pagination 
                    v-if="xTable.length" 
                    style="margin: 12px 24px" 
                    class="page-ui" size="small" 
                    :current="page_num" 
                    :total="xTable[0].total" 
                    :pageSize="page_size"
                    @change="handlePaging" 
                    @showSizeChange="changePageSize" 
                  />
                </a-row>
              </div>
            </a-tab-pane>
            <a-tab-pane key="1" :disabled="checkInfo.type === 2" :tab="`硬碰撞（${checkInfo.type === 2 ? '-' : checkInfo.hard_clash}）`" :forceRender="true">
              <div>
                <a-table
                  border="inner"
                  show-overflow
                  show-header-overflow
                  :columns="columns"
                  :dataSource="hardTable"
                  :height="adaptiveWidth"
                  :pagination="false"
                  :auto-resize="true"
                  class="vxeTable"
                  :rowKey="record => record.id"
                  :loading="loadingMap[1]"
                >
                  <template #empty>
                    <table-no-data />
                  </template>
                  <div slot="id" slot-scope="text" class="file-name">
                    <span key="preview" type="link" class="actionBtn">
                      {{ text }}
                    </span>
                  </div>

                  <span slot="clash_a" slot-scope="text">
                    {{ text }}
                  </span>

                  <span slot="clash_b" slot-scope="text">
                    {{ text }}
                  </span>

                  <div slot-scope="text" slot="type">
                    <div>{{ collisionType[text] }}</div>
                  </div>
                </a-table>
                <a-row type="flex" justify="end">
                  <a-pagination 
                    v-if="hardTable.length" 
                    style="margin: 12px 24px" 
                    class="page-ui" size="small" 
                    :current="page_num" 
                    :total="hardTable[0].total_hard" 
                    :pageSize="page_size"
                    @change="handlePaging" 
                    @showSizeChange="changePageSize" 
                  />
                </a-row>
              </div>
            </a-tab-pane>
            <a-tab-pane key="2" :disabled="checkInfo.type === 1" :tab="`间隙碰撞（${checkInfo.type === 1 ? '-' : checkInfo.clearance_clash}）`" :forceRender="true">
              <div>
                <a-table
                  border="inner"
                  show-overflow
                  show-header-overflow
                  :columns="columns"
                  :dataSource="gapTable"
                  :height="adaptiveWidth"
                  :pagination="false"
                  :auto-resize="true"
                  class="vxeTable"
                  :rowKey="record => record.id"
                  :loading="loadingMap[2]"
                >
                  <template #empty>
                    <table-no-data />
                  </template>
                  <div slot="id" slot-scope="text" class="file-name">
                    <span key="preview" type="link" class="actionBtn">
                      {{ text }}
                    </span>
                  </div>

                  <span slot="clash_a" slot-scope="text">
                    {{ text.name }}
                  </span>

                  <span slot="clash_b" slot-scope="text">
                    {{ text.name }}
                  </span>

                  <div slot-scope="text" slot="type">
                    <div>{{ collisionType[text] }}</div>
                  </div>
                </a-table>
                <a-row type="flex" justify="end">
                  <a-pagination 
                    v-if="gapTable.length" 
                    style="margin: 12px 24px" 
                    class="page-ui" size="small" 
                    :current="page_num" 
                    :total="gapTable[0].total_clearance" 
                    :pageSize="page_size"
                    @change="handlePaging" 
                    @showSizeChange="changePageSize" 
                  />
                </a-row>
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { nextTick } from 'vue'
import { clash_content } from '@/apis/clash'
import { collisionType } from '../config'

export default {
  props: {
    closeCheck: Function,
    checkInfo: {},
  },
  computed: {
    columns() {
      return [
        {
          title: '碰撞ID',
          dataIndex: 'id',
          width: '140px',
          key: 'id',
          ellipsis: true,
          scopedSlots: { customRender: 'id' }
        },
        {
          title: '碰撞对象A',
          dataIndex: 'clash_a',
          key: 'clash_a',
          width: '240px'
        },
        {
          title: '碰撞对象B',
          width: '240px',
          key: 'clash_b',
          dataIndex: 'clash_b',
          ellipsis: true
        },
        {
          title: '碰撞类型',
          dataIndex: 'type',
          key: 'type',
          width: '100px'
        }
      ]
    }
  },
  data() {
    return {
      loadingMap: {
        3: true,
        2: true,
        1: true
      },
      pageSize: 10,
      page_num: 1,
      page_size: 10,
      visible: true,
      selectItem: '',
      xTable: [],
      hardTable: [],
      gapTable: [],
      collisionType: collisionType,
      adaptiveWidth: '800px',
      dataMap: {
        3: [],
        2: [],
        1: []
      },
      previewName: '',
      activeKey: '3',
      checked: false,
      searchForm: {
        page_num: 1,
        page_size: 10,
      }
    }
  },
  methods: {
    handlePaging(pageNum) {
      this.page_num = pageNum
      this.searchForm.page_num = pageNum
      this.loadList(this.activeKey)
    },
    // 改变每页数量
    changePageSize(current, pageSize) {
      this.page_num = 1
      this.searchForm.page_num = 1
      this.page_size = pageSize
      this.searchForm.page_size = pageSize
      this.loadList(this.activeKey)
    },
    changeActiveKey(key) {
      this.activeKey = key
      this.page_num = 1
    },
    loadList(type) {
      const params = {
        clash_id: this.checkInfo.clash_id,
        type: type,
        page_num:  this.searchForm.page_num,
        page_size: this.searchForm.page_size
      }
      this.dataMap[type] = []
      clash_content(params).then(res => {
        const { data: {list} } = res
        list.forEach((list) => {
          let item = {}
          item.id = list.id
          item.clash_a = list.clash_a.id
          item.clash_b = list.clash_b.id
          item.type = list.type
          item.total = res.data.total
          item.total_hard = res.data.total_hard
          item.total_clearance = res.data.total_clearance
          this.dataMap[type].push(item)
        })
        if(type == 3) {
          this.xTable = this.dataMap[3]
        } else if(type == 2) {
          this.gapTable = this.dataMap[2]
        } else {
          this.hardTable = this.dataMap[1]
        }
        this.loadingMap[type] = false
      }).catch(() => {
        this.loadingMap[type] = false
      })
    },
    handleCancel() {
      this.closeCheck()
      this.activeKey = 1
      this.visible = false
    },
  },
  
  mounted(){
      if(!this.checkInfo) return
      nextTick(() => {
        // 1硬碰撞 2间隙碰撞 3全部
        this.loadList(3)
        this.loadList(1)
        this.loadList(2)
      })
  },
}
</script>

<style lang="less" scoped>
.colCheckModal{
  .dxy-toolbar-group{
    display: none;
  }
  .checkContent{
    display: flex;
    height: 100%;
    // 左侧表格部分
    .checkTable{
      padding: 14px 12px 24px 24px;
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