<template>
  <div class="asset-box">
    <div class="head_opr">
      <a-button type="primary" @click="handleAddAsset">添加资产</a-button>

      <a-button :disabled="!hasSelected" type="primary" @click="transfer('patch')">转换</a-button>
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
          :rowKey="record => record.asset_id"
          class="table-ui"
        >
          <div slot="name" slot-scope="text" class="file-name">
            <img :src="require('@/asset/images/scene.png')" alt="" />
            <span key="preview" type="link" class="actionBtn">
              {{ text }}
            </span>
          </div>
          <span slot="asset_type" slot-scope="text">
            {{ assetObj[text] }}
          </span>
          <span slot="size" slot-scope="text">
            {{ text | renderSize }}
          </span>
          <div slot-scope="text" slot="status">
            <div>{{ statuObj[text.toString()] }}</div>
          </div>
          <div slot="Action" slot-scope="text, record" class="action-box">
            <a-button v-if="record.status * 1 !== 1 && record.status * 1 !== 2 && record.status * 1 !== 0" key="preview" type="link" class="actionBtn" @click="transfer('single', record)">
              <span>转换</span>
            </a-button>
            <a-button v-show="record.status * 1 === 1 || record.status * 1 === 2" key="stop" type="link" class="actionBtn" @click="cancelTranslation(record)">
              <span>中止转换</span>
            </a-button>
            <a-button v-show="record.status * 1 === 0" type="link" class="actionBtn" @click="handlePreview(record)">
              <span>预览</span>
            </a-button>
            <a-button type="link" class="actionBtn" @click="handleDetail(record, 'detail')">
              <span>详情</span>
            </a-button>
            <a-button type="link" :disabled="record.status === 1 || record.status === 2" class="actionBtn" @click="handleDeletePatch('single', record)">
              <span>删除</span>
            </a-button>
          </div>
        </a-table>
      </div>
      <a-row type="flex" justify="end">
        <a-pagination v-if="lists.length" style="margin: 12px 24px" class="page-ui" size="small" show-quick-jumper show-size-changer :current="page_num" :total="total" :pageSize="page_size" @change="handlePaging" @showSizeChange="changePageSize" />
      </a-row>
    </div>

    <a-modal title="添加资产" :visible="visibleAdd" :destroyOnClose="true" :footer="null" centered class="pop-ui" width="30rem" :maskClosable="false" @cancel="visibleAdd = false">
      <addAsset></addAsset>
    </a-modal>

    <a-modal title="资产详情" :visible="visibleDetail" :destroyOnClose="true" :footer="null" centered class="pop-ui" width="30rem" :maskClosable="false" @cancel="visibleDetail = false">
      <div class="details" v-if="visibleDetail">
        <div>
          <span>资产ID（asset_id） ：</span>
          <span>{{ details.asset_id }}</span>
        </div>
        <div>
          <span>资产名称（name） ：</span>
          <span>{{ details.name }}</span>
        </div>
        <div>
          <span>资产类型（asset_type） ：</span>
          <span>{{ assetObj[details.asset_type] }}</span>
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
          <span>资产状态（status） ：</span>
          <span>{{ statuObj[details.status] }}</span>
        </div>
      </div>
    </a-modal>

    <!-- 资产预览 -->
    <viewAsset v-if="preVisible" :visible="preVisible" :asset_type="asset_type" :renderPath="previewPath" :previewName="previewName" :wsTransInfo="wsTransInfo" @handlePreviewModel="handlePreviewModel"></viewAsset>
  </div>
</template>
<script type="text/babel">
import { asset_list, asset_del, asset_detail, asset_translation, asset_translation_cancel } from '@/apis/asset.js'
import { ResponseStatus } from '@/framework/network/util.js'
import addAsset from './components/add.vue'
import viewAsset from './components/assetView.vue'
export default {
  components: { addAsset, viewAsset },
  data() {
    const rowSelection = {
      getCheckboxProps: record => ({
        props: {
          disabled: record.review_status
        }
      })
    }
    return {
      preVisible: false,
      asset_type: 0,
      previewPath: '',
      previewName: '',
      wsTransInfo: {
        id: '',
        path: '',
        status: ''
      },
      visibleDetail: false,
      details: {},
      visibleAdd: false,
      //文件状态   0转换成功 1转换中 2转换等待中 -2转换失败 -3 上传成功 -4转换失败(转换中止)
      statuObj: {
        '-4': '转换失败(转换中止)',
        '-3': '上传成功',
        '-2': '转换失败',
        0: '转换成功',
        1: '转换中',
        2: '转换等待中'
      },
      //资产类型  1影像 2地形 3矢量 4倾斜摄影，
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
      lists: []
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
    handlePreviewModel() {
      this.preVisible = false
    },
    /**
     * @description: 终止转换
     * @param {string} 资产id:asset_id
     * @return {*}
     */
    cancelTranslation(item) {
      asset_translation_cancel({ asset_id: item.asset_id }).then(res => {
        if (res.code !== ResponseStatus.success) return this.$message.error('终止失败')
        this.$message.success('终止成功')
        this.getAssetList()
      })
    },
    upLoaded() {
      this.visibleAdd = false
      this.getAssetList()
    },
    // 新增资产
    handleAddAsset() {
      this.visibleAdd = true
    },
    handleAssembly() {
      this.selectAllTags = []
    },
    upload() {
      this.getAssetList()
    },
    /**
     * @description: 获取资产列表
     * @return {*}
     */
    getAssetList() {
      asset_list(this.searchForm).then(res => {
        if (res.code !== ResponseStatus.success) return
        this.lists = res.data.list
        this.total = res.data.total
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
      this.getAssetList()
    },
    // 改变每页数量
    changePageSize(current, pageSize) {
      this.page_num = 1
      this.page_size = pageSize
      this.searchForm.page_num = 1
      this.searchForm.page_size = pageSize
      this.getAssetList()
    },
    // $ 弹窗：预览 模块
    handlePreview(item) {
      console.log('预览', item)
      this.previewName = `${item.name}预览`
      this.previewPath = item.render_path
      this.asset_type = item.asset_type
      this.wsTransInfo = {
        id: item.asset_id,
        path: item.render_path,
        status: item.status
      }
      sessionStorage.setItem('asset_id', item.asset_id)
      this.preVisible = true
    },

    handleDetail(item) {
      asset_detail({ asset_id: item.asset_id }).then(res => {
        if (res.code !== ResponseStatus.success) return this.$message.error('资产详情查询失败')
        this.details = res.data
        this.visibleDetail = true
      })
      this.visibleDetail = true
    },

    transfer(type, item) {
      if (type === 'single') {
        this.selectedRowKeys = [item.asset_id]
      }
      asset_translation({ asset_ids: this.selectedRowKeys }).then(res => {
        if (res.code !== ResponseStatus.success) return this.$message.error('发起转换失败')
        this.$message.success('操作成功，请等待转换完成')
        this.selectedRowKeys = []
        this.getAssetList()
      })
    },
    // 删除资产，转换中无法删除
    handleDeletePatch(flag, item) {
      if (flag === 'single') {
        this.selectedRowKeys = [item.asset_id]
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
            asset_ids: that.selectedRowKeys
          }
          asset_del(params).then(res => {
            if (res.code === ResponseStatus.success) {
              this.$message.success('删除成功')
              this.selectedRowKeys = []
              this.getAssetList()
            } else {
              this.selectedRowKeys = []
            }
          })
        },
        onCancel() {
          that.selectedRowKeys = []
        }
      })
    },
    // 改变每页数量
    changePageSize(current, pageSize) {
      this.page_num = 1
      this.page_size = pageSize
      this.getAssetList()
    }
  },
  mounted() {
    this.getAssetList()
    this.$bus.off('upData/asset')
    this.$bus.on('upData/asset', () => {
      this.upLoaded()
    })
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0
    },
    columns() {
      return [
        {
          title: '资产名称',
          dataIndex: 'name',
          key: 'name',
          ellipsis: true,
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '资产类型',
          dataIndex: 'asset_type',
          scopedSlots: { customRender: 'asset_type' },
          key: 'asset_type',
          width: '140px'
        },
        {
          title: '资产大小',
          width: '140px',
          key: 'size',
          dataIndex: 'size',
          scopedSlots: { customRender: 'size' },
          ellipsis: true
        },

        {
          title: '资产状态',
          width: '140px',
          key: 'status',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
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
.asset-box {
  width: 100%;
  height: 100%;
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
    .pagination {
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
