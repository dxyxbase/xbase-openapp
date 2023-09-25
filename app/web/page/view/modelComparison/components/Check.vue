<template>
  <div class="colCheck">
    <a-modal :visible="visible" centered width="1200px" :keyboard="false" :maskClosable="false" :destroyOnClose="true" :footer="null" :title="checkInfo.name" class="colCheckModal" @cancel="handleCancel">
      <!-- <div v-if="createData.length === 0" class="noData" style="text-align: center">
          <img :src="require('@/asset/images/nodata.png')" alt="暂无数据" />
          <p>暂无搜索结果</p>
      </div> -->
      <div class="checkContent" width="50%">
        <div class="checkTable" :style="{width: checked ? '42%' : '50%'}">
          <a-tabs :activeKey="activeKey" @change="changeActiveKey">
            <a-tab-pane key="1" :tab="`新增（${createData[0] ? createData[0].total : 0}）`">
              <div>
                <a-table
                  border="inner"
                  show-overflow
                  show-header-overflow
                  :columns="columns"
                  :dataSource="createData"
                  :height="adaptiveWidth"
                  :pagination="false"
                  :auto-resize="true"
                  class="vxeTable"
                  :rowKey="record => record.model_diff_content_id"
                  :loading="loadingMap[1]"
                >
                  <template #empty>
                    <table-no-data />
                  </template>
                  <div slot="name" slot-scope="text">
                      {{ text }}
                  </div>

                  <div slot-scope="text" slot="category">
                    <div>{{ text }}</div>
                  </div>

                  <span slot="guid" slot-scope="text">
                    {{ text }}
                  </span>

                   <div slot="Action" slot-scope="text, record" class="action-box">
                    <a-button type="link" class="actionBtn" @click="getContentProperty(record)">
                      <span>查看属性</span>
                    </a-button>
                  </div>
                </a-table>
                <a-row type="flex" justify="end">
                  <a-pagination 
                    v-if="createData.length" 
                    style="margin: 12px 24px" 
                    class="page-ui" size="small" 
                    :current="page_num" 
                    :total="createData[0].total"
                    :pageSize="page_size"
                    @change="handlePaging" 
                    @showSizeChange="changePageSize" 
                  />
                </a-row>
              </div>
            </a-tab-pane>
            <a-tab-pane key="2" :disabled="checkInfo.type === 2" :tab="`删除（${checkInfo.type === 2 ? '-' : delData[0] ? delData[0].total : 0}）`" :forceRender="true">
              <div>
                <a-table
                  border="inner"
                  show-overflow
                  show-header-overflow
                  :columns="columns"
                  :dataSource="delData"
                  :height="adaptiveWidth"
                  :pagination="false"
                  :auto-resize="true"
                  class="vxeTable"
                  :rowKey="record => record.model_diff_content_id"
                  :loading="loadingMap[2]"
                >
                  <template #empty>
                    <table-no-data />
                  </template>
                  <div slot="name" slot-scope="text">
                      {{ text }}
                  </div>

                  <div slot-scope="text" slot="category">
                    <div>{{ text }}</div>
                  </div>

                  <span slot="guid" slot-scope="text">
                    {{ text }}
                  </span>

                  <div slot="Action" slot-scope="text, record" class="action-box">
                    <a-button type="link" class="actionBtn" @click="getContentProperty(record)">
                      <span>查看属性</span>
                    </a-button>
                  </div>
                </a-table>
                <a-row type="flex" justify="end">
                  <a-pagination 
                    v-if="delData.length" 
                    style="margin: 12px 24px" 
                    class="page-ui" size="small" 
                    :current="page_num" 
                    :total="delData[0].total" 
                    :pageSize="page_size"
                    @change="handlePaging" 
                    @showSizeChange="changePageSize" 
                  />
                </a-row>
              </div>
            </a-tab-pane>
            <a-tab-pane key="3" :disabled="checkInfo.type === 3" :tab="`修改（${checkInfo.type === 1 ? '-' : updateData[0]? updateData[0].total : 0}）`" :forceRender="true">
              <div>
                <a-table
                  border="inner"
                  show-overflow
                  show-header-overflow
                  :columns="columns"
                  :dataSource="updateData"
                  :height="adaptiveWidth"
                  :pagination="false"
                  :auto-resize="true"
                  class="vxeTable"
                  :rowKey="record => record.model_diff_content_id"
                  :loading="loadingMap[3]"
                >
                  <template #empty>
                    <table-no-data />
                  </template>
                 <div slot="name" slot-scope="text">
                      {{ text }}
                  </div>

                  <div slot-scope="text" slot="category">
                    <div>{{ text }}</div>
                  </div>

                  <span slot="guid" slot-scope="text">
                    {{ text }}
                  </span>

                   <div slot="Action" slot-scope="text, record" class="action-box">
                    <a-button type="link" class="actionBtn" @click="getContentProperty(record)">
                      <span>查看属性</span>
                    </a-button>
                  </div>
                </a-table>
                <a-row type="flex" justify="end">
                  <a-pagination 
                    v-if="updateData.length" 
                    style="margin: 12px 24px" 
                    class="page-ui" size="small" 
                    :current="page_num" 
                    :total="updateData[0].total" 
                    :pageSize="page_size"
                    @change="handlePaging" 
                    @showSizeChange="changePageSize" 
                  />
                </a-row>
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
        <div class="checkTable" :style="{width: '50%'}">
          <div v-if="propertyData.length === 0" class="noData" style="text-align: center">
              <img :src="require('@/asset/images/nodata.png')" alt="暂无数据" />
              <p>请先选择对应构件查看属性</p>
          </div>
          <div v-else :style="{width: '100%'}">
            <a-collapse>
              <a-collapse-panel v-for="(group, index) in propertyData" :key="group.property_group_name" :header="group.property_group_name">
                <a-row style="color:#1890ff">
                  <a-col :span="6">属性名</a-col>
                  <a-col :span="9">属性值（基准版本）</a-col>
                  <a-col :span="9">属性值（对比版本）</a-col>
                </a-row>
                <a-row v-for="item in group.list" :key="item.property_name">
                  <a-col :span="6">{{ item.property_name }}</a-col>
                  <a-col :span="9" :style="`color:${item.base_property_value===item.new_property_value ? 'rgba(0, 0, 0, 0.65)' : 'red'}`">{{ item.base_property_value }}</a-col>
                  <a-col :span="9" :style="`color:${item.base_property_value===item.new_property_value ? 'rgba(0, 0, 0, 0.65)' : 'red'}`">{{ item.new_property_value }}</a-col>
                </a-row>
                
              </a-collapse-panel>
            </a-collapse>

          </div>
        </div>
      </div>
      
    </a-modal>
  </div>
</template>

<script>
import { nextTick } from 'vue'
import { comparison_content, comparison_content_property  } from '@/apis/comparison'

export default {
  props: {
    closeCheck: Function,
    checkInfo: {},
  },
  computed: {
    columns() {
      return [
        {
          title: '构件名称',
          dataIndex: 'name',
          width: '140px',
          key: 'name',
          ellipsis: true,
          // scopedSlots: { customRender: 'name' }
        },
        {
          title: '构件类别',
          dataIndex: 'category',
          key: 'category',
          width: '140px'
        },
        {
          title: '构件ID',
          width: '140px',
          key: 'guid',
          dataIndex: 'guid',
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
      loadingMap: {
        3: true,
        2: true,
        1: true
      },
      collapseKey: 0,
      pageSize: 10,
      page_num: 1,
      page_size: 10,
      visible: true,
      selectItem: '',
      updateData: [],
      createData: [],
      delData: [],
      propertyData: [],
      adaptiveWidth: '800px',
      dataMap: {
        3: [],
        2: [],
        1: []
      },
      previewName: '',
      activeKey: '1',
      checked: false,
      searchForm: {
        page_num: 1,
        page_size: 10,
      },
    }
  },
  methods: {
    getContentProperty(record) {
      const params = {
        model_diff_content_id: record.model_diff_content_id,
      }
      comparison_content_property(params).then(res => {
        this.propertyData = res.data.list
      })

    },
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
        model_diff_id: this.checkInfo.model_diff_id,
        change_type: type,
        page_num:  this.searchForm.page_num,
        page_size: this.searchForm.page_size
      }
      this.dataMap[type] = []
      comparison_content(params).then(res => {
        const { data: {list} } = res
        if(type == 3) {
          list.forEach((list) => {
            let item = {}
            item.model_diff_content_id = list.model_diff_content_id
            item.change_type = list.change_type
            item.total = res.data.total
            item.name = list.new_component.name === list.base_component.name ? list.new_component.name : `${list.base_component.name}/${list.new_component.name}`
            item.category = list.new_component.category === list.base_component.category ? list.new_component.category : `${list.base_component.category}/${list.new_component.category}`
            item.guid = list.new_component.guid === list.base_component.guid ? list.new_component.guid : `${list.base_component.guid}/${list.new_component.guid}`
            this.dataMap[type].push(item)
          })
          // 修改
          this.updateData = this.dataMap[3]
        } else if(type == 2) {
          // 删除
          list.forEach((list) => {
            let item = {}
            item.model_diff_content_id = list.model_diff_content_id
            item.change_type = list.change_type
            item.total = res.data.total
            item.name = list.base_component.name
            item.category = list.base_component.category
            item.guid = list.base_component.guid
            this.dataMap[type].push(item)
          })
          this.delData = this.dataMap[2]
        } else {
          // 新增
          list.forEach((list) => {
            let item = {}
            item.model_diff_content_id = list.model_diff_content_id
            item.change_type = list.change_type
            item.total = res.data.total
            item.name = list.new_component.name
            item.category = list.new_component.category
            item.guid = list.new_component.guid
            this.dataMap[type].push(item)
          })
          this.createData = this.dataMap[1]
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
        // 1新增 2删除 3修改
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
      border-right:1px solid rgba(14,128,231,0.08);
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