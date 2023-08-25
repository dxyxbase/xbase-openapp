<template>
  <div class="asset-box">
    <div class="head_opr">
      <a-button type="primary" @click="handleAddAsset">新建场景</a-button>

      <a-button :disabled="!hasSelected" class="del" @click="handleDeletePatch('patch')">删除</a-button>
    </div>
    <div class="sceneTableOutContent">
      <div>
        <div v-if="lists.length === 0" class="noData" style="text-align: center">
          <img :src="require('@/asset/images/nodata.png')" alt="暂无数据" />
          <p>暂无内容</p>
        </div>
        <a-table
          v-else
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
            getCheckboxProps: rowSelection.getCheckboxProps
          }"
          :columns="columns"
          :data-source="lists"
          :pagination="false"
          :rowKey="record => record.scene_id"
          class="table-ui"
        >
          <div slot="name" slot-scope="text" class="file-name">
            <img :src="require('@/asset/images/scene.png')" alt="" />
            <span key="preview" type="link" class="actionBtn">
              {{ text }}
            </span>
          </div>

          <span slot="size" slot-scope="text">
            {{ text | renderSize }}
          </span>

          <div slot="Action" slot-scope="text, record" class="action-box">
            <a-button key="preview" type="link" class="actionBtn" @click="viewPre(record)">
              <span>预览</span>
            </a-button>

            <a-button type="link" class="actionBtn" @click="handleEdit(record)">
              <span>编辑</span>
            </a-button>
            <a-button type="link" class="actionBtn" @click="handleDetail(record, 'detail')">
              <span>详情</span>
            </a-button>
            <a-button type="link" class="actionBtn" @click="reName(record)">
              <span>重命名</span>
            </a-button>
            <a-button type="link" class="actionBtn" @click="handleDeletePatch('single', record)">
              <span>删除</span>
            </a-button>
          </div>
        </a-table>
      </div>
      <a-row type="flex" justify="end">
        <a-pagination v-if="lists.length" style="margin: 12px 24px" class="page-ui" size="small" show-quick-jumper show-size-changer :current="page_num" :total="total" :pageSize="page_size" @change="handlePaging" @showSizeChange="changePageSize" />
      </a-row>
    </div>

    <a-modal title="重命名" :visible="visibleRename" :destroyOnClose="true" :footer="null" centered class="pop-ui" width="30rem" :maskClosable="false" @cancel="closeModel">
      <template v-if="visibleRename">
        <a-input key="inputa" v-model:value="oldName" placeholder="请输入场景名称" />
        <div style="margin-top: 20px">
          <a-button type="primary" @click="handleRename">确定</a-button>
        </div>
      </template>
    </a-modal>
    <a-modal title="添加场景" :visible="visibleAdd" :destroyOnClose="true" :footer="null" centered class="pop-ui" width="30rem" :maskClosable="false" @cancel="visibleAdd = false">
      <scenceAdd></scenceAdd>
    </a-modal>

    <!-- 场景详情 -->
    <a-modal title="场景详情" :visible="visibleDetail" :destroyOnClose="true" :footer="null" centered class="pop-ui" width="30rem" :maskClosable="false" @cancel="visibleDetail = false">
      <div class="details" v-if="visibleDetail">
        <div>
          <span>场景ID（scene_id） ：</span>
          <span>{{ details.scene_id }}</span>
        </div>
        <div>
          <span>场景名称（name） ：</span>
          <span>{{ details.name }}</span>
        </div>
        <div>
          <span>场景描述（description） ：</span>
          <span>{{ details.description }}</span>
        </div>
        <div>
          <span>渲染路径（render_path） ：</span>
          <span>{{ details.render_path }}</span>
        </div>
        <div>
          <span>文件大小（size） ：</span>
          <span>{{ details.size | renderSize }}</span>
        </div>
        <div>
          <span>配置数据（source） ：</span>
          <span>{{ details.source }}</span>
        </div>
        <div>
          <span>创建时间（created_time） ：</span>
          <span>{{ details.create_time }}</span>
        </div>
      </div>
    </a-modal>

    <viewScene v-if="preVisible" :visible="preVisible" :fileType="previewFileType" :renderPath="previewPath" :fileName="previewName" :wsTransInfo="wsTransInfo" @handlePreviewModel="handlePreviewModel"></viewScene>
  </div>
</template>
<script type="text/babel">
import { sence_list, sence_del, sence_rename, sence_check, sence_detail } from '@/apis/sence.js'
import { ResponseStatus } from '@/framework/network/util.js'
import scenceAdd from './components/add.vue'
import viewScene from './viewScene/index.vue'
export default {
  components: { scenceAdd, viewScene },
  data() {
    const rowSelection = {
      getCheckboxProps: record => ({
        props: {
          disabled: record.review_status
        }
      })
    }
    return {
      wsTransInfo: {
        id: '',
        path: '',
        status: ''
      },
      preVisible: false,
      previewFileType: null,
      previewPath: '',
      previewName: '',
      visibleDetail: false,
      details: {},
      visibleRename: false,
      visibleAdd: false,
      //  0转换成功 1转换中 2转换等待中 -2转换失败 -3 上传成功 -4转换失败(转换终止)
      statuObj: {
        '-4': '转换失败(转换终止)',
        '-3': '上传成功',
        '-2': '转换失败',
        0: '转换成功',
        1: '转换中',
        2: '转换等待中'
      },
      // 1影像 2地形 3矢量 4倾斜摄影
      assetObj: {
        1: '影像',
        2: '地形',
        3: '矢量',
        4: '倾斜摄影'
      },
      is_free: true,
      rowSelection,
      searchForm: {
        page_num: 1,
        page_size: 10,
        order: 4,
        sort: 0
      },
      total: 0,
      page_num: 1,
      page_size: 10,
      selectedRowKeys: [],
      lists: [],
      oldName: null,
      senceID: ''
    }
  },
  filters: {
    renderSize(value) {
      if (!value) {
        return '—'
      }
      if (value == null) {
        return '0 Bytes'
      }
      // eslint-disable-next-line no-array-constructor
      var unitArr = new Array('Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB')
      var index = 0
      var srcsize = parseFloat(value)
      index = Math.floor(Math.log(srcsize) / Math.log(1024))
      var size = srcsize / Math.pow(1024, index)
      size = size.toFixed(2) // 保留的小数位数
      return size + unitArr[index]
    }
  },
  methods: {
    handleEdit(item) {
      // this.senceInfo = { id: scene_id }
      this.$router.push({
        path: '/scene-edit',
        query: {
          scene_id: encodeURIComponent(item.scene_id)
        }
      })
    },
    handlePreviewModel() {
      this.preVisible = false
    },
    closeModel() {
      this.oldName = null
      this.visibleRename = false
    },
    reName(item) {
      this.$set(this, 'oldName', item.name)
      this.senceID = item.scene_id
      this.visibleRename = true
    },

    async handleRename() {
      const result = await sence_check({ name: this.oldName })
      if (result.code !== ResponseStatus.success) return
      const {
        data: { is_existed }
      } = result
      if (!is_existed) {
        let params = {
          scene_id: this.senceID,
          name: this.oldName
        }
        sence_rename(params).then(res => {
          if (res.code !== ResponseStatus.success) return this.$message.error('重命名失败')
          this.$message.success('重命名成功')
          this.getSenceList()
          this.oldName = null
          this.visibleRename = false
        })
      } else {
        this.$message.error('场景名称重复')
      }
    },
    handleAddAsset() {
      this.visibleAdd = true
    },
    handleAssembly() {
      this.selectAllTags = []
    },
    getSenceList() {
      sence_list(this.searchForm).then(res => {
        if (res.code !== ResponseStatus.success) return
        this.lists = res.data.list
        this.total = res.data.total
        if (this.searchForm.page_num !== 1 && res.data.list.length === 0) {
          this.searchForm.page_num = 1
          this.getSenceList()
        }
      })
    },
    // 表格选择发生变化
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    // 切换页码
    handlePaging(pageNum) {
      this.page_num = pageNum
      this.searchForm.page_num = pageNum
      this.getSenceList()
    },
    handleDetail(item) {
      sence_detail(item.scene_id).then(res => {
        if (res.code !== ResponseStatus.success) return this.$message.error('场景详情查询失败')
        this.details = res.data
        this.visibleDetail = true
      })
    },

    viewPre(item) {
      this.preVisible = true
      this.previewName = item.name
      this.previewPath = item.render_path
      this.previewFileType = item.file_type
      this.wsTransInfo = {
        id: item.scene_id,
        path: item.render_path,
        status: item.status
      }
      sessionStorage.setItem('scene_id', item.scene_id)
    },
    handleDeletePatch(flag, item) {
      if (flag === 'single') {
        this.selectedRowKeys = [item.scene_id]
      }

      var that = this
      this.$confirm({
        content: '此删除操作不可恢复，是否继续？',
        okText: '确认',
        okType: 'primary',
        cancelText: '取消',
        class: 'comfirm-pop',
        centered: true,
        // icon: () => <span></span>,
        onOk: () => {
          const params = {
            scene_ids: that.selectedRowKeys
          }
          sence_del(params).then(res => {
            if (res.code === ResponseStatus.success) {
              this.$message.success('删除成功')
              this.selectedRowKeys = []
              this.getSenceList()
            } else {
              this.selectedRowKeys = []
            }
          })
        },
        onCancel: () => {
          that.selectedRowKeys = []
        }
      })
    },
    // 改变每页数量
    changePageSize(current, pageSize) {
      this.page_num = 1
      this.searchForm.page_num = 1
      this.page_size = pageSize
      this.searchForm.page_size = pageSize
      this.getSenceList()
    }
  },
  mounted() {
    this.getSenceList()
    this.$bus.off('upData/sence')
    this.$bus.on('upData/sence', () => {
      this.getSenceList()
      this.visibleAdd = false
    })
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0
    },
    columns() {
      return [
        {
          title: '场景名称',
          dataIndex: 'name',
          key: 'name',
          ellipsis: true,
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '描述',
          dataIndex: 'description',
          key: 'description',
          width: '240px'
        },
        {
          title: '场景大小',
          width: '140px',
          key: 'size',
          dataIndex: 'size',
          scopedSlots: { customRender: 'size' },
          ellipsis: true
        },

        {
          title: '创建时间',
          dataIndex: 'create_time',
          key: 'create_time',
          width: '240px'
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
.asset-box {
  width: 100%;
  height: 100%;
  overflow: auto;
}
.asset-box {
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
    // min-height: 100% !important;
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
