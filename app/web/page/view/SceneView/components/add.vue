<template>
  <div class="addAsset">
    <!-- 默认展示form -->
    <a-form :form="form" v-if="is_form">
      <a-form-item label="场景名称" class="input-box">
        <a-input
          v-decorator="[
            'name ',
            {
              rules: [{ required: true, message: '场景名称不能为空' }],
              validateTrigger: 'blur',
              getValueFromEvent: getnameValue
            }
          ]"
          placeholder="请输入场景名称"
          autocomplete="off"
        />
      </a-form-item>
      <a-form-item label="描述">
        <a-input
          v-decorator="[
            'description',
            {
              rules: [{ required: false }]
            }
          ]"
          type="textarea"
        />
      </a-form-item>
    </a-form>
    <!-- 资产树数据 -->
    <div class="tree_box" v-else>
      <a-tree v-if="treeData.length" ref="tree" v-model="asset_ids" checkable :auto-expand-parent="autoExpandParent" :selected-keys="selectedKeys" :tree-data="treeData" :defaultExpandedKeys="defaultExpandedKeys" class="addSceneTree" @check="onCheck"></a-tree>
    </div>
    <div class="footer" style="margin-top: 24px; text-align: center">
      <a-button type="primary" @click="nextStep" v-if="is_form">下一步</a-button>
      <a-button type="primary" @click="handleNextStep" :disabled="isParams" v-else>确定</a-button>
    </div>
  </div>
</template>
<script type="text/babel">
import { countStrLength } from '@/utils/inputLimit'
import { sence_edit, sence_check, sence_assets } from '@/apis/sence.js'
import { ResponseStatus } from '@/framework/network/util.js'
let lodash = require('lodash')
export default {
  data() {
    return {
      form: this.$form.createForm(this, { name: 'coordinated' }),
      size: 1,
      desc: '',
      selectedKeys: [],
      defaultExpandedKeys: ['NODE_ROOT-1'],
      treeData: [],
      autoExpandParent: true,
      asset_ids: [],
      params: {},
      is_form: true,
      specialCharacters: false,
      allAssets: [],
      isParams: true,
      formParam: {
        name: '',
        description: ''
      }
    }
  },
  mounted() {},
  methods: {
    // name: item.name.slice(0, item.name.lastIndexOf('.')),
    getSceneAssets() {
      sence_assets().then(res => {
        if (res.code !== ResponseStatus.success) return
        this.treeData.push({
          title: '全部',
          key: 'NODE_ROOT-1',
          children: []
        })
        for (var i in res.data) {
          // this.treeData[0].children   就是【全部】下面的第一级，地形，影像
          this.treeData[0].children.push({
            title: this.getTypeName(res.data[i].AssetType), // res.data[i].TypeName,
            key: 'NODE_ROOT' + i,
            dataRef: res.data[i],
            children:
              res.data[i].Assets.length > 0
                ? res.data[i].Assets.map(a => {
                    return { ...a, id: a.AssetId, title: a.Name }
                  })
                : [],
            disabled: res.data[i].AssetType === 2
          })
          const getAllAssets = () => {
            this.allAssets.push(
              ...(res.data[i].Assets.map(a => {
                return {
                  ...a,
                  AssetType: res.data[i].AssetType
                }
              }) || [])
            )
          }
          getAllAssets()
          this.defaultExpandedKeys.push('NODE_ROOT' + i)
          this.treeData[0].children[i].children = this.replaceObjProp(this.treeData[0].children[i].children, [
            {
              key: 'name',
              value: 'title'
            },
            { key: 'id', value: 'key' }
          ])
        }
      })
    },
    async handleNextStep() {
      let arrs = this.asset_ids.filter(a => !/^NODE_ROOT/.test(a)) || []
      let arrs2 = arrs.map(a => {
        return this.allAssets.find(assetInfo => {
          return assetInfo.AssetId === a
        })
      })
      let size = lodash.sum(arrs2.map(item => item.size))
      const assetsGroup = lodash.groupBy(arrs2, 'AssetType')
      const image = assetsGroup[1] || []
      const model = assetsGroup[4] || []
      const terrains = assetsGroup[2] || []
      let params = {
        ...JSON.parse(JSON.stringify({ ...this.formParam, size: size })),
        source: JSON.stringify({
          layer: {
            drawings: {
              points: [],
              lines: [],
              flats: [],
              bodys: []
            },
            imageries: image.map(i => {
              return {
                id: i.AssetId,
                name: i.Name,
                url: i.ProcessPath,
                is_visible: true
              }
            }), // 影像
            models: model.map(m => {
              return {
                type: 1,
                id: m.AssetId,
                name: m.Name,
                url: m.ProcessPath,
                is_visible: true,
                height: 0,
                lat: 0,
                lon: 0,
                pitch: 0,
                roll: 0,
                scalex: 1,
                scaley: 1,
                scalez: 1,
                yaw: 0,
                elevation: 0
              }
            }),
            terrains: terrains.map(t => {
              return {
                id: t.AssetId,
                name: t.Name,
                url: t.ProcessPath,
                is_visible: true
              }
            }) // 地形
          },
          configs: { observation_mode: '0' },
          preset_positions: [],
          terrain_flattenings: [],
          path_roaming: [],
          terrain_excavations: []
        })
      }
      params.asset_ids = this.asset_ids.filter(a => !/^NODE_ROOT/.test(a))

      this.isParams = true
      sence_edit(params)
        .then(r => {
          if (r.code !== ResponseStatus.success) return this.$message.error('创建场景失败')
          this.$message.success('场景创建成功')
          this.$bus.emit('upData')
        })
        .finally(() => {
          this.isParams = false
        })
    },

    replaceObjProp(obj, typeArr) {
      let result
      const toString = Object.prototype.toString
      if (toString.call(obj) === '[object Array]') {
        result = []
        for (let i = 0; i < obj.length; i++) {
          result[i] = this.replaceObjProp(obj[i], arguments[1])
        }
      } else if (toString.call(obj) === '[object Object]') {
        result = {}
        for (const _key in obj) {
          if (obj.hasOwnProperty(_key)) {
            let flag = 0
            let _value = null
            for (let j = 0; j < arguments[1].length; j++) {
              if (arguments[1][j].key === _key) {
                flag = 1
                _value = arguments[1][j].value
              }
            }
            if (flag) {
              result[_value] = this.replaceObjProp(obj[_key], arguments[1])
            } else {
              result[_key] = this.replaceObjProp(obj[_key], arguments[1])
            }
          }
        }
      } else {
        return obj
      }
      return result
    },
    getTypeName(type) {
      const typeMap = { 1: '影像', 2: '地形', 3: '矢量', 4: '倾斜摄影(模型)' }
      return typeMap[type]
    },
    onCheck(checkedKeys, e) {
      // 获取所有地形的ID
      const terrainData = this.treeData[0].children[0].children || []
      const allTerrainArr = []
      terrainData.forEach(item => {
        if (item.children && item.children.length > 0) {
          allTerrainArr.push(item)
        }
      })
      // 获取所有地形的ID
      const terrainIdArr = allTerrainArr.map(item => {
        return item.key
      })

      // 判断选中了几个地形
      const terrainIdArrCheck = checkedKeys.filter(item => {
        return terrainIdArr.includes(item)
      })

      // 当点击 全部 按钮时
      if (e.node.eventKey === 'NODE_ROOT-1') {
        // 选中
        if (!e.node.checked) {
          // 默认选中第一个公共地形
          const terrainIndex = checkedKeys.indexOf(terrainIdArrCheck[0])
          terrainIndex !== -1 && checkedKeys.splice(checkedKeys.indexOf(terrainIdArrCheck[0]), 1)
          checkedKeys.push(terrainData[0].key)
        } else {
          // 取消选中
          checkedKeys = checkedKeys.filter(item => {
            return !terrainIdArr.includes(item)
          })
        }
      }

      // 判断是否选中(e.node.checked false 代表选中),且是地形节点
      if (!e.node.checked && terrainIdArr.includes(e.node.eventKey)) {
        // 保持只选中一个地形
        for (let i = 0; i < checkedKeys.length; i++) {
          if (terrainIdArr.includes(checkedKeys[i]) && terrainIdArrCheck.length > 1) {
            checkedKeys.splice(i, 1)
            i--
            break
          }
        }
      }

      // 处理后选中了哪个地形
      const terrainCheck = checkedKeys.filter(item => {
        return terrainIdArr.includes(item)
      })
      //  去除地形父节点
      for (let i = 0; i < checkedKeys.length; i++) {
        // 不去除地形父节点的选中
        if (checkedKeys[i].indexOf('NODE_ROOT1-') !== -1 || checkedKeys[i] === 'NODE_ROOT1') {
          checkedKeys.splice(i, 1)
          i--
        }
      }
      // 保持选中地形，父节点被选中
      terrainData.forEach(item => {
        if (terrainCheck.includes(item.key)) {
          checkedKeys.push(this.treeData[0].children[1].key)
          checkedKeys = Array.from(new Set(checkedKeys))
          if (checkedKeys.includes(item.key)) return
          checkedKeys.push(item.key)
          checkedKeys.push(this.treeData[0].children[1].key)
        }
      })

      // 获取除了地形的所有子节点key
      const exceptTerrainKeyArr = this.allAssets.filter(item => {
        return !terrainIdArr.includes(item.AssetId)
      })
      const checkedKeysCopy = JSON.parse(JSON.stringify(checkedKeys))
      //  去除父节点
      for (var i = 0; i < checkedKeysCopy.length; i++) {
        // 不去除地形父节点的选中
        if (checkedKeysCopy[i].indexOf('NODE_ROOT') !== -1) {
          checkedKeysCopy.splice(i, 1)
          i--
        }
      }
      // 当 checkedKeysCopy 长度 等于 除了地形的所有子节点key长度加一时，全部按钮选中
      // 当选中了一个地形时，半选全部按钮节点
      const rootCheckBox = document.querySelector('.addSceneTree .ant-tree-treenode-switcher-open .ant-tree-checkbox')
      // 当选择了一个地形时
      if (checkedKeys.length > 0) {
        setTimeout(() => {
          rootCheckBox.classList.remove('ant-tree-checkbox-indeterminate')
          rootCheckBox.classList.remove('ant-tree-checkbox-checked')
          console.log(exceptTerrainKeyArr.length, checkedKeysCopy.length)
          if (exceptTerrainKeyArr.length + 1 > checkedKeysCopy.length) {
            rootCheckBox.classList.add('ant-tree-checkbox-indeterminate') // 全部按钮半选
          } else {
            rootCheckBox.classList.add('ant-tree-checkbox-checked') // 全部按钮全选
          }
        }, 0)
      } else {
        // 当没有选中节点时，全部节点取消半选
        setTimeout(() => {
          rootCheckBox.classList.remove('ant-tree-checkbox-indeterminate')
          rootCheckBox.classList.remove('ant-tree-checkbox-checked')
        }, 0)
      }

      this.asset_ids = checkedKeys
    },
    nextStep() {
      let name = this.form.getFieldValue('name ')
      let description = this.form.getFieldValue('description')
      this.formParam = {
        name: name,
        description: description
      }
      this.form.validateFields(async err => {
        if (!err) {
          // 判断名称是否重复
          const result = await sence_check({ name: name })
          if (result.code !== ResponseStatus.success) return
          const {
            data: { is_existed }
          } = result
          if (!is_existed) {
            this.is_form = false
            this.getSceneAssets()
          } else {
            this.$message.error('场景名称重复')
          }
        } else {
          this.is_form = true
        }
      })
    },
    handleCreate() {
      let name = this.form.getFieldValue('name ')
      let description = this.form.getFieldValue('description')
      this.form.validateFields(async err => {
        if (!err) {
          console.log(name, size, description, source)
          let params = {
            // name: name,
            size: size,
            description: description,
            source: source,
            name: name
          }
          sence_edit(params).then(r => {
            if (r.code !== ResponseStatus.success) return this.$message.error('创建场景失败')
            this.$message.success('场景创建成功')
            this.$bus.emit('upData')
          })
        }
      })
    },
    getnameValue(e) {
      let newVal = ''
      if (countStrLength(e.target.value) > 40) {
        newVal = this.assetName
        return newVal
      }
      newVal = e.target.value
      this.assetName = newVal
      return newVal
    }
  },
  watch: {
    asset_ids: {
      handler(newValue, oldValue) {
        if (newValue && newValue.length > 0) {
          this.isParams = false
        } else {
          this.isParams = true
        }
      },
      deep: true
    }
  }
}
</script>
<style lang="less" scoped>
.tree_box {
  width: 100%;
  height: 423px;
  border-radius: 4px;
  border: 1px solid #e5e5e5;
  overflow-y: auto;
  margin: 0 auto;
  position: relative;
  padding: 15px 12px;

  /deep/ .ant-tree {
    .ant-tree-switcher {
      width: 20px;
      height: 20px;
      margin-right: 8px;
      line-height: 20px;

      i {
        font-size: 20px !important;
        line-height: 20px;
        margin-top: -2px;
      }
    }

    // 图标翻转
    .ant-tree-switcher_close {
      transform: rotate(0deg);
    }

    .ant-tree-switcher_open {
      //transform: rotate(180deg);
    }

    .ant-tree-checkbox {
      padding: 0;
      margin: 0;
      margin-right: 8px;

      &::after {
        border: none;
      }
    }

    .ant-tree-node-content-wrapper {
      height: 16px;
      line-height: 16px;
      display: inline-block;
      width: 510px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      &:hover {
        background: none;
      }

      .ant-tree-title {
        color: #666666;
      }
    }

    li[role='treeitem'] {
      //padding: 0;
      //padding-bottom: 8px;
    }

    span[title='全部'] {
      .ant-tree-title {
        color: #282828 !important;
      }
    }

    .ant-tree-node-content-wrapper {
      width: auto;
    }
  }
}
::v-deep .ant-form-item {
  margin-bottom: 0;
}
.up-box {
  text-align: center;
}
</style>
