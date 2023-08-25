<template>
  <div class="standard-map-class">
    <div class="head-btn">
      <a-button @click="handle('add')" type="primary">新建</a-button>
      <a-button :disabled="!hasSelected" type="primary" class="del" @click="handleDeletePatch('patch')">删除</a-button>
    </div>
    <div class="table-box">
      <div v-if="lists.length === 0" class="noData" style="text-align: center">
        <img :src="require('@/asset/images/nodata.png')" alt="暂无数据" />
        <p>暂无内容</p>
      </div>
      <a-table
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          getCheckboxProps: rowSelection.getCheckboxProps
        }"
        v-else
        :columns="columns"
        :data-source="lists"
        :pagination="false"
        :rowKey="record => record.mapping_id"
        class="table-ui"
      >
        <div slot="name" slot-scope="text" class="file-name">
          <a-button key="name" type="link">
            <span>{{ text }}</span>
          </a-button>
        </div>
        <div slot="match_ratio" key="match_ratio" slot-scope="text">
          <span :class="!text ? 'red' : 'green'">{{ text ? text * 100 : 0 }}%</span>
        </div>

        <div slot="Action" slot-scope="text, record" class="action-box">
          <a-button @click="openAuto(record)" type="link" class="actionBtn">
            <span>自动映射</span>
          </a-button>
          <a-button @click="goDetail(record)" type="link" class="actionBtn">
            <span>手动映射</span>
          </a-button>
          <a-button @click="handleDeletePatch('single', record)" type="link" class="actionBtn">
            <span>删除</span>
          </a-button>
          <!-- <a-button @click="handle('edit', record)" type="link" class="actionBtn">
            <span>编辑</span>
          </a-button> -->
        </div>
      </a-table>
      <a-row type="flex" justify="end">
        <a-pagination v-if="lists.length" style="margin: 12px 24px" class="page-ui" size="small" show-quick-jumper show-size-changer :current="page_num" :total="total" :pageSize="page_size" @change="handlePaging" @showSizeChange="changePageSize" />
      </a-row>
    </div>
    <a-modal width="650px" centered ok-text="确认" cancel-text="取消" @ok="sureEdit" :title="type === 'add' ? '新增' : type === 'edit' ? '编辑' : '复制'" :visible="visibleEdit" :destroyOnClose="true" class="pop-ui" :maskClosable="false" @cancel="visibleEdit = false">
      <template v-if="visibleEdit">
        <a-form :form="form">
          <a-row :gutter="24">
            <a-col :span="24">
              <a-form-item label="标准映射名称" :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
                <a-input
                  v-decorator="[
                    'mapping_name',
                    {
                      initialValue: item.mapping_name ? item.mapping_name : '',
                      rules: [{ required: true, message: '标准映射名称', whitespace: true }]
                    }
                  ]"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="24">
              <a-form-item label="模型分类标准" :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
                <a-select
                  :disabled="type === 'edit'"
                  placeholder="请选择"
                  v-decorator="[
                    'source_standard_id',
                    {
                      initialValue: item.source_standard_id ? item.source_standard_id : '',
                      rules: [{ required: true, message: '请选择' }]
                    }
                  ]"
                >
                  <a-select-option v-for="(val, key) in publishList" :key="key" :value="val.version_id">{{ val.name }}/{{ val.version }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="15">
              <a-form-item label="映射标准" :labelCol="{ span: 10 }" :wrapperCol="{ span: 14 }">
                <a-select
                  :disabled="type === 'edit'"
                  placeholder="请选择"
                  v-decorator="[
                    'type',
                    {
                      initialValue: item.type ? item.type : 2,
                      rules: [{ required: true, message: '请选择' }]
                    }
                  ]"
                >
                  <a-select-option v-for="(val, key) in standardType" :disabled="val.disabled" :key="key" :value="val.value">{{ val.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="9">
              <a-form-item label="" :labelCol="{ span: 0 }" :wrapperCol="{ span: 24 }">
                <a-select
                  show-search
                  :filter-option="filterOption"
                  :disabled="type === 'edit'"
                  placeholder="请选择"
                  v-decorator="[
                    'target_standard_id',
                    {
                      initialValue: item.target_standard_id ? item.target_standard_id : '',
                      rules: [{ required: true, message: '请选择' }]
                    }
                  ]"
                >
                  <a-select-option v-for="(val, key) in attrList" :disabled="val.type !== 2" :key="key" :value="val.standard_id">{{ val.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </template>
    </a-modal>
    <!-- 自动匹配映射 -->
    <a-modal width="650px" centered ok-text="确认" cancel-text="取消" @ok="autoMatch" title="自动映射" :visible="visibleAutoMatch" :destroyOnClose="true" class="pop-ui" :maskClosable="false" @cancel="visibleAutoMatch = false">
      <template>
        <div>
          <a-form-item label="映射范围" :labelCol="{ span: 5 }" :wrapperCol="{ span: 19 }">
            <a-select style="width: 100%" placeholder="请选择" v-model="scope">
              <a-select-option v-for="(val, key) in scopeObj" :key="key" :value="val.value">{{ val.name }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="映射方式" :labelCol="{ span: 5 }" :wrapperCol="{ span: 19 }">
            <a-select style="width: 100%" placeholder="请选择" v-model="mapType">
              <a-select-option v-for="(val, key) in typeObj" :key="key" :value="val.value">{{ val.name }}</a-select-option>
            </a-select>
          </a-form-item>
        </div>
      </template>
    </a-modal>
  </div>
</template>
<script>
import { standard_attr_list } from '@/apis/data.js'
import { standard_publish_list, standard_map_auto_match, standard_map_add, standard_map_check, standard_map_list, standard_map_del, standard_map_edit } from '@/apis/standard.js'
import { ResponseStatus } from '@/framework/network/util.js'
export default {
  data() {
    const rowSelection = {
      getCheckboxProps: record => ({
        props: {
          disabled: record.disabled
        }
      })
    }
    return {
      rowSelection,
      lists: [],
      page_size: 10,
      page_num: 1,
      visibleAutoMatch: false,
      selectedRowKeys: [],
      total: 0,
      form: null,
      mapType: 1,
      scope: 1,
      visibleEdit: false,
      name: null,
      description: null,
      mapping_id: null,
      type: 'add',
      item: {},
      activeMapId: null,
      publishList: [],
      // 标准类型。1模型分类标准，2属性信息标准，3交付信息标准
      standardType: [
        { name: '模型分类标准', value: 1, disabled: true },
        { name: '属性信息标准', value: 2, disabled: false },
        { name: '交付信息标准', value: 3, disabled: true }
      ],
      attrList: [],
      // 映射范围。1所有标准条目，2仅未映射的标准条目
      scopeObj: [
        { name: '所有标准条目', value: 1 },
        { name: '仅未映射的标准条目', value: 2 }
      ],
      // 映射方式。1覆盖，2累加
      typeObj: [
        { name: '覆盖', value: 1 },
        { name: '累加', value: 2 }
      ]
    }
  },
  mounted() {
    this.getList()
    this.getPublishList()
    this.getAttrList()
    this.$bus.off('updata/standardMapList')
    this.$bus.on('updata/standardMapList', () => {
      this.getList()
    })
  },
  created() {
    this.form = this.$form.createForm(this)
  },
  methods: {
    goDetail(item) {
      let params = {
        mapping_name: item.mapping_name,
        mapping_id: item.mapping_id,
        source_standard_name: item.source_standard_name,
        target_standard_name: item.target_standard_name,
        target_standard_id: item.target_standard_id
      }
      this.$router.push({ path: '/data-standard/map-manage/handle', query: params })
    },
    // 自动映射
    async autoMatch() {
      let params = {
        scope: this.scope,
        type: this.mapType,
        mapping_id: this.activeMapId
      }
      const result = await standard_map_auto_match(params)
      if (result.code !== ResponseStatus.success) return
      this.$message.success('操作成功')
      this.getList()
      this.visibleAutoMatch = false
      this.scope = 1
      this.mapType = 1
    },
    openAuto(item) {
      this.visibleAutoMatch = true
      this.activeMapId = item.mapping_id
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    async getAttrList() {
      let params = {
        page_size: 9999,
        page_num: 1
      }
      const res = await standard_attr_list(params)
      if (res.code !== ResponseStatus.success) return
      const {
        data: { list = [] }
      } = res
      this.attrList = list
    },
    async getPublishList() {
      const result = await standard_publish_list()
      if (result.code !== ResponseStatus.success) return
      const {
        data: { list = [] }
      } = result
      this.publishList = list
    },
    handle(type, item) {
      this.type = type
      this.visibleEdit = true
      if (type === 'edit') {
        this.mapping_id = item.mapping_id
        this.item = {
          ...item
        }
        // this.$nextTick(() => {
        //   this.form.setFieldsValue(item)
        // })
      } else {
        this.name = null
        this.description = null
      }
    },
    async sureEdit() {
      const {
        form: { validateFields }
      } = this
      validateFields(async (errors, values) => {
        if (!errors) {
        }
        if (await this.check(values.mapping_name)) return this.$message.warning('名称不可重复')
        let res = null
        if (this.type === 'add') {
          res = await standard_map_add({ ...values, name: values.mapping_name })
        } else if (this.type === 'edit') {
          res = await standard_map_edit({ name: values.mapping_name, mapping_id: this.mapping_id })
        }
        if (res.code !== ResponseStatus.success) return
        this.$message.success('操作成功')
        this.visibleEdit = false
        this.getList()
      })
    },
    async check(name) {
      const result = await standard_map_check({ name: name })
      if (result.code !== ResponseStatus.success) return true
      const {
        data: { is_exist }
      } = result
      return is_exist
    },
    handleDeletePatch(flag, item) {
      if (flag === 'single') {
        this.selectedRowKeys = [item.mapping_id]
      }
      this.$confirm({
        content: '此删除操作不可恢复，是否继续？',
        okText: '确认',
        okType: 'primary',
        cancelText: '取消',
        class: 'comfirm-pop',
        centered: true,
        onOk: () => {
          const params = {
            mapping_id_list: this.selectedRowKeys
          }
          standard_map_del(params).then(res => {
            if (res.code === ResponseStatus.success) {
              this.$message.success('删除成功')
              this.selectedRowKeys = []
              this.getList()
            } else {
              this.selectedRowKeys = []
            }
          })
        },
        onCancel: () => {
          this.selectedRowKeys = []
        }
      })
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
        page_num: this.page_num
      }
      const res = await standard_map_list(params)
      if (res.code !== ResponseStatus.success) return
      const {
        data: { list = [], total = 0 }
      } = res
      this.lists = list
      this.total = total
      if (this.page_num !== 1 && list.length === 0) {
        this.page_num = 1
        this.getList()
      }
    }
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0
    },
    columns() {
      return [
        {
          title: '标准映射名称',
          dataIndex: 'mapping_name',
          key: 'mapping_name',
          ellipsis: true,
          scopedSlots: { customRender: 'mapping_name' }
        },
        {
          title: '模型分类标准',
          dataIndex: 'source_standard_name',
          scopedSlots: { customRender: 'source_standard_name' },
          key: 'source_standard_name',
          width: '20%'
        },
        {
          title: '映射标准',
          width: '20%',
          key: 'target_standard_name',
          dataIndex: 'target_standard_name',
          scopedSlots: { customRender: 'target_standard_name' },
          ellipsis: true
        },
        {
          title: '映射状态',
          width: '100px',
          key: 'match_ratio',
          dataIndex: 'match_ratio',
          scopedSlots: { customRender: 'match_ratio' }
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
