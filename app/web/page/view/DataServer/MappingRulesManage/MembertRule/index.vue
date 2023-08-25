<template>
  <div class="model-class">
    <div class="head-btn">
      <a-button type="primary" @click="visible = true">恢复默认规则</a-button>
      <a-button type="primary" :disabled="lists.length === 5" @click="handleEdit('add', {})">新增规则</a-button>
      <a-alert message="该规则适用于构件自动标准化过程。自动标准化将按规则顺序执行，有匹配结果则执行终止，无匹配结果则执行下一条规则，请注意规则顺序！" banner />
    </div>
    <div class="table-box">
      <div v-if="lists.length === 0" class="noData" style="text-align: center">
        <img :src="require('@/asset/images/nodata.png')" alt="暂无数据" />
        <p>暂无内容</p>
      </div>

      <a-table v-else :columns="columns" :data-source="lists" :pagination="false" :rowKey="record => record.rule_id" class="table-ui">
        <div slot="Action" slot-scope="text, record" class="action-box">
          <a-button @click="move(1, record)" :disabled="record.num === 1" type="link" class="actionBtn">
            <span>上移</span>
          </a-button>
          <a-button @click="move(2, record)" :disabled="record.num === count" type="link" class="actionBtn">
            <span>下移</span>
          </a-button>
          <a-button @click="handleEdit('edit', record)" type="link" class="actionBtn">
            <span>编辑规则</span>
          </a-button>
          <a-button @click="del(record)" type="link" class="actionBtn">
            <span>删除规则</span>
          </a-button>
        </div>
      </a-table>
    </div>
    <a-modal centered v-model="visible" title="恢复默认规则" ok-text="确认" cancel-text="取消" @ok="resetRule">
      <p>* 入参包含group_id时，会将应用下该分组所有的标准规则删除</p>
      <p>* 入参不包含group_id时，会将应用下所有的标准规则删除</p>
      <h3>是否确定恢复默认规则？</h3>
    </a-modal>
    <!-- 新建/编辑规则 -->
    <a-modal destroyOnClose width="800px" centered v-model="visibleEdit" :title="type === 'add' ? '新建标准规则' : '编辑标准规则'" @cancel="closeModel" ok-text="确认" cancel-text="取消" @ok="sureEdit">
      <a-form :form="form">
        <div v-for="(item, index) in keysList" :key="item">
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-item :label="`构件属性${index + 1}`" :labelCol="{ span: 9 }" :wrapperCol="{ span: 15 }">
                <a-input
                  v-decorator="[
                    `model_property[${item}]`,
                    {
                      initialValue: arr[item] ? arr[item].model_property : '',
                      rules: [{ required: true, message: '构件属性', whitespace: true }]
                    }
                  ]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item label="" :labelCol="{ span: 0 }" :wrapperCol="{ span: 24 }">
                <a-select
                  placeholder="比较符号"
                  v-decorator="[
                    `operator[${item}]`,
                    {
                      initialValue: arr[item] ? arr[item].operator : 1,
                      rules: [{ required: true, message: '请选择' }]
                    }
                  ]"
                >
                  <a-select-option v-for="(val, key) in operator_obj" :key="key" :value="val.value">{{ val.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="" :labelCol="{ span: 0 }" :wrapperCol="{ span: 24 }">
                <a-select
                  placeholder="映射标准参数"
                  v-decorator="[
                    `standard_property[${item}]`,
                    {
                      initialValue: arr[item] ? arr[item].standard_property : 1,
                      rules: [{ required: true, message: '请选择' }]
                    }
                  ]"
                >
                  <a-select-option v-for="(val, key) in standard_property" :key="key" :value="val.value">{{ val.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="4" offset="1" style="padding-left: 0px">
              <a-form-item :labelCol="{ span: 0 }" :wrapperCol="{ span: 24 }">
                <a-row :gutter="14">
                  <a-col :span="6">
                    <template>
                      <a-button :disabled="keysList.length <= 1" shape="circle" @click="removeRow(item)" icon="minus" size="small" />
                    </template>
                  </a-col>
                  <a-col :span="6">
                    <template v-if="index + 1 === keysList.length">
                      <a-button :disabled="keysList.length === 3" shape="circle" @click="addRow" icon="plus" size="small" />
                    </template>
                  </a-col>
                </a-row>
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="连接符号" :labelCol="{ span: 9 }" :wrapperCol="{ span: 15 }">
              <a-radio-group
                :disabled="keysList.length <= 1"
                v-decorator="[
                  'joint',
                  {
                    initialValue: joint ? joint : 1,
                    rules: [{ required: true, message: '请选择' }]
                  }
                ]"
              >
                <a-radio v-for="(val, key) in joint_mark_obj" :key="key" :value="val.value">{{ val.name }}</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { rule_member_list, rule_member_add, rule_member_move, rule_member_reset, rule_member_del, rule_member_edit, rule_member_check } from '@/apis/rules.js'
import { ResponseStatus } from '@/framework/network/util.js'
let lodash = require('lodash')
export default {
  data() {
    return {
      lists: [],
      visibleDetail: false,
      name: null,
      visibleEdit: false,
      visible: false,
      rule_id: null,
      form: this.$form.createForm(this),
      type: 'add',
      keysList: [],
      id: 0,
      arr: [],
      joint: null,
      conditions: [],
      defaultValue: '1',
      // 比较符号。1等于，2包含
      operator_obj: [
        { name: '等于', value: 1 },
        { name: '包含', value: 2 }
      ],
      // 连接符号。1并且，2或者
      joint_mark_obj: [
        { name: '并且', value: 1 },
        { name: '或者', value: 2 }
      ],
      //分类标准参数。1分类编码，2 分类名称
      standard_property: [
        { name: '分类编码', value: 1 },
        { name: '分类名称', value: 2 }
      ]
    }
  },
  created() {
    this.form = this.$form.createForm(this)
    this.init()
  },
  mounted() {
    this.getList()
    this.$bus.off('updata/mapRule')
    this.$bus.on('updata/mapRule', () => {
      this.getList()
    })
    // this.check()
  },

  methods: {
    handleEdit(type, item) {
      this.type = type
      if (this.type !== 'add') {
        this.arr = item.conditions
        this.joint = item.joint_mark
        this.rule_id = item.rule_id
        this.init()
      } else {
        this.arr = []
        this.joint = 1
        this.rule_id = ''
        this.init()
      }
      this.visibleEdit = true
    },
    closeModel() {},
    async sureEdit() {
      const {
        form: { validateFields }
      } = this
      validateFields(async (errors, values) => {
        if (!errors) {
          for (const key in values) {
            if (key !== 'joint') {
              values[key] = lodash.compact(values[key])
            }
          }
          const numer = values.operator.length
          let arr = []
          for (let i = 0; i < numer; i++) {
            arr.push({
              model_property: values.model_property[i],
              operator: parseInt(values.operator[i]),
              standard_property: parseInt(values.standard_property[i])
            })
          }
          let params = {
            joint: parseInt(values.joint),
            conditions: arr
          }
          let res = null
          if (this.type === 'add') {
            res = await rule_member_add(params)
          } else {
            res = await rule_member_edit({ ...params, rule_id: this.rule_id })
          }
          this.arr = []
          this.joint = 1
          if (res.code !== ResponseStatus.success) return
          this.$message.success('操作成功')
          this.visibleEdit = false
          this.getList()
        }
      })
    },

    // 动态
    init() {
      const arr = [0]
      if (this.arr.length !== 0) {
        for (let i = 1; i < this.arr.length; i++) {
          arr.push(i)
          this.id = this.id + 1
        }
      }
      this.keysList = arr
    },
    // 移除某行
    removeRow(k) {
      if (this.keysList.length === 1) {
        // 如果存在可以移除所有行的情况，把条件改为this.keysList.length === 0
        return
      }
      this.keysList = this.keysList.filter(item => item !== k)
    },
    // 新增一行
    addRow() {
      this.id = this.id + 1
      this.keysList = this.keysList.concat(this.id)
    },
    // 进行自动匹配映射条目时，需要先校验是否存在标准规则，
    // 如不存在标准规则将无法进行自动匹配操作，需先添加标准规则。
    // 此处测试   true存在规则，false不存在
    async check() {
      const result = await rule_member_check()
      if (result.code !== ResponseStatus.success) return
      const {
        data: { is_exist }
      } = result
      return is_exist
    },
    async move(type, item) {
      let params = {
        rule_id: item.rule_id,
        type: type
      }
      const result = await rule_member_move(params)
      if (result.code !== ResponseStatus.success) return
      this.$message.success(type === 1 ? '上移成功' : '下移成功')
      this.getList()
    },
    async resetRule() {
      const result = await rule_member_reset()
      if (result.code !== ResponseStatus.success) return
      this.$message.success('恢复默认规则成功')
      this.visible = false
      this.getList()
    },
    del(item) {
      this.$confirm({
        content: '此删除操作不可恢复，是否继续？',
        okText: '确认',
        okType: 'primary',
        cancelText: '取消',
        class: 'comfirm-pop',
        centered: true,
        onOk: () => {
          const params = {
            rule_id: item.rule_id
          }
          rule_member_del(params).then(res => {
            if (res.code === ResponseStatus.success) {
              this.$message.success('删除成功')
              this.getList()
            }
          })
        },
        onCancel: () => {}
      })
    },

    async getList() {
      let params = {}
      const res = await rule_member_list(params)
      if (res.code !== ResponseStatus.success) return
      const {
        data: { list = [] }
      } = res
      this.lists = list
    }
  },
  computed: {
    count() {
      return this.lists.length
    },
    columns() {
      return [
        {
          title: '序号',
          width: '60px',
          key: 'num',
          dataIndex: 'num',
          scopedSlots: { customRender: 'num' }
        },
        {
          title: '映射条件判定',
          dataIndex: 'desc',
          key: 'desc',
          ellipsis: true,
          scopedSlots: { customRender: 'desc' },
          ellipsis: true
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
::v-deep .ant-select {
  width: 100%;
}
::v-deep .ant-alert-warning {
  font-size: 12px;
  padding: 4px 15px 4px 37px;
  .ant-alert-icon {
    top: 50%;
    transform: translateY(-50%);
  }
}
.details {
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 14px;
  > div {
    display: flex;
    gap: 10px;
    > span:nth-of-type(1) {
      width: 92px;
    }
    > span:nth-of-type(2) {
      width: 100%;
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
</style>
