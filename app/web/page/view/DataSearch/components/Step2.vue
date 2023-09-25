<template>
  <div class="searchContent step3">
    <div class="title">
      <a-icon type="exclamation-circle" />
      <span class="info">请输入构件属性及正确的搜索表达式</span>
      <br>
      搜索表达式：表达式通过数学运算符号和属性值组成，支持的数学运算符号包含：
      <br>
      <span> >（大于）、<（小于）、=（等于）、≠（不等于） 、≥（大于等于）、≤（小于等于）、(,)（开区间）、[,]（闭区间）、(,]（左开右闭区间）、[,)（左闭右开区间）、⊇（包含）、⊄（不包含），同一个输入框内支持输入多个表达式，多个表达式结果取并集。</span>
    </div>
    <a-form name="dynamic_form_nest_item" :model="formData" @finish="onFinish">
      <a-row type="flex" v-for="(searchCriteria, index) in formData.searchCriteria" :key="index"
        class="formLayout" :gutter="[16, 16]">
        <a-col :span="7">
            <!-- 构件属性 -->
            <a-form-item
                label="" 
                :class="index !== 0 && 'addMargin'"
                :name="['searchCriteria', index, 'name']"
                :rules="[{ required: true, trigger: 'blur'}]"
            >
                <a-auto-complete  
                    :data-source="attributeOptions"
                    placeholder="请输入构件属性"
                    style="width:180px"
                    @change="(value) => selectProperty(value, index)"
                >
              </a-auto-complete>
          </a-form-item>
        </a-col>
        <a-col :span="14">
          <!-- 条件表达式 -->
          <a-form-item 
            :name="['searchCriteria', index, 'exp_val_list']" 
            label="" 
            :rules="[{
                required: true,
                trigger: 'change',
                validator: ''
            }]"
          >
            <div class="selectDropdownRender" id="multipleSelect">
              <a-popover 
                placement="bottomLeft" 
                :arrowPointAtCenter="false"
                trigger="click"
                @click="visible => visible = !visible"
                :get-popup-container="el => el.parentNode"
                @visibleChange="visible => visibleChange(visible, index)"
              >
                <template #content>
                  <div class="dropdownContent">
                    <transition name="animation">
                      <a-row type="flex" align="middle" style="flex-wrap: nowrap;" v-if="checkBoxAcitiveIndex !== -1">
                        <a-col flex="16px">
                          <span class="symbol" :class="{ 'smallSymbol': (checkBoxAcitiveIndex > 3) }">
                            {{ nowSymbolInfo.inputType === 'single' ? nowSymbolInfo.label : '∈' }}
                          </span>
                        </a-col>
                        <a-col flex="auto" style="margin: 0 12px;">
                          <!-- 单输入框 -->
                          <a-form-item v-if="nowSymbolInfo.inputType === 'single'">
                            <!-- 限制特殊字符 -->
                            <a-input :value="singleInputValue" @change="singleInputChange"
                              v-if="nowSymbolInfo.inputLimit === 'limitSymbol'" :maxlength="40" />
                            <!-- 只能输入数字 -->
                            <a-input :value="singleInputValue"
                              @change="e => inputNumberChange(e, 'singleInputValue')" style="width: 100%;" v-else />
                          </a-form-item>
                          <!-- 双输入框 -->
                          <div class="doubleContent" v-else>
                            <span>{{ nowSymbolInfo.label.charAt(0) }}</span>
                            <a-form-item>
                              <a-input 
                                :value="doubleLeftValue" 
                                class="inputNumber"
                                @change="e => inputNumberChange(e, 'doubleLeftValue')" />
                            </a-form-item>
                            <span>,</span>
                            <a-form-item>
                              <a-input :value="doubleRightValue" class="inputNumber"
                                @change="e => inputNumberChange(e, 'doubleRightValue')" />
                            </a-form-item>
                            <span>{{ nowSymbolInfo.label.charAt(1) }}</span>
                          </div>
                        </a-col>
                        <a-col flex="72px">
                          <!-- 超过五条数据置灰 -->
                          <a-button 
                            type="primary" 
                            @click="handleAdd(index)"
                            :disabled="addBtnDisabled || searchCriteria.exp_val_list.length >= 5"
                          >添加</a-button>
                        </a-col>
                      </a-row>
                    </transition>
                    <!-- 表达式选择区域 -->
                    <a-row :gutter="6" class="expressioncheck">
                        <a-col :span="4" v-for="(item, checkBoxIndex) in operation" :key="checkBoxIndex" flex="36px">
                            <template>
                                <a-tooltip >
                                    <template #title>
                                        {{ item.text }}
                                    </template>
                                    <a-col flex="36px" 
                                        class="checkBox cannotSelect"
                                        :class="{ 'smallSymbol': (checkBoxIndex > 3), 'checkBoxAcitive': checkBoxAcitiveIndex === checkBoxIndex }"
                                        @click="handleCheckBox(checkBoxIndex, index)">
                                        {{ item.label }}
                                    </a-col>
                                </a-tooltip>
                            </template>
                        </a-col>
                    </a-row>
                  </div>
                </template>
                <a-select 
                    :fieldNames="{ label: 'value', value: 'key' }" 
                    :open="false"
                    :value="searchCriteria.exp_val_list_checked_id" 
                    mode="tags" 
                    placeholder="请输入正确的搜索表达式"
                    :options="options"
                    :showSearch="false"
                    @deselect="(value, option) => handleDeselect(value, option, index)" 
                    class="multipleSelect"
                >
                  <template #tagRender="{ value, label, closable, onClose, option }">
                    <a-tag :closable="closable" style="margin-right: 3px" @close="onClose">
                        <span class="tagSpan">
                            {{ optionProps (option).label }}{{ label }}
                        </span>
                        <span class="tagSpan">{{ optionProps (option).label.charAt(0) }}
                            {{ label }}{{optionProps (option).label.charAt(1)}}
                        </span>
                    </a-tag>
                  </template>
                </a-select>
              </a-popover>
            </div>
          </a-form-item>
        </a-col>
        <a-col :span="3" v-if="formData.searchCriteria.length > 1 && formData.searchCriteria.length !== index + 1">
          <!-- 连接符号 -->
          <a-form-item :name="['searchCriteria', index, 'operator']" label="" :rules="[{
            required: true,
            message: '请选择连接符号',
            trigger: 'blur'
          }]">
            <a-select class="selectOption"
              :value="searchCriteria.operator" 
              placeholder="连接符号" 
              style="width:80px" 
              @change="(value) => operatorChange(value, index)"
            >
              <a-select-option :value="1">并且</a-select-option>
              <a-select-option :value="2">或者</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="1">
          <div class="operationIcon">
            <a-icon type="minus-circle" :class="formData.searchCriteria.length <= 1 && 'iconDisabled'"
              @click="deleteIcon(index)" v-if="index === formData.searchCriteria.length - 1"/>
            <a-icon type="plus-square" :class="formData.searchCriteria.length >= 5 && 'iconDisabled'"
              v-if="index === formData.searchCriteria.length - 1" @click="addIcon"/>
          </div>
        </a-col>
      </a-row>
    </a-form>
    

    <div class="colAddBtns" style="margin-top:20px;">
      <a-space :size="12">
        <a-button @click="handlePreview">上一步</a-button>
        <a-button type="primary" :disabled="formData.searchCriteria[0].name && formData.searchCriteria[0].exp_val_list.value" @click="handleSubmit">搜索</a-button>
      </a-space>
    </div>
  </div>
</template>

<script>
import { message } from 'ant-design-vue';
import { ResponseStatus } from '@/framework/network/util.js'
import { search, save_search_record } from '@/apis/search'
import { component_category, component_property } from '@/apis/search'
import {ExclamationCircleFilled} from '@ant-design/icons-vue'
import Bus from '../bus.js'



export default {
  props: {
    handlePreview: Function,
    closeModal: Function,
    getParams: [],
    visible: true
  },
  data() {
    return {
        SearchCriteria: {
            name: '',
            operator: 1,
            exp_val_list: [],
            key: new Date(),
            selectOpen: false,
            exp_val_list_checked_id: []
        },
        operation: [
            { key: 1, label: '>', inputType: 'single', inputLimit: 'number', text: '大于' },
            { key: 2, label: '<', inputType: 'single', inputLimit: 'number', text: '小于' },
            { key: 3, label: '=', inputType: 'single', inputLimit: 'limitSymbol', text: '等于' },
            { key: 4, label: '≠', inputType: 'single', inputLimit: 'limitSymbol', text: '不等于' },
            { key: 5, label: '≥', inputType: 'single', inputLimit: 'number', text: '大于等于' },
            { key: 6, label: '≤', inputType: 'single', inputLimit: 'number', text: '小于等于' },
            { key: 7, label: '()', inputType: 'double', inputLimit: 'number', text: '开区间' },
            { key: 9, label: '(]', inputType: 'double', inputLimit: 'number', text: '左开右闭区间' },
            { key: 10, label: '[)', inputType: 'double', inputLimit: 'number', text: '左闭右开区间' },
            { key: 8, label: '[]', inputType: 'double', inputLimit: 'number', text: '闭区间' },
            { key: 11, label: '⊇', inputType: 'single', inputLimit: 'limitSymbol', text: '包含' },
            { key: 12, label: '⊄', inputType: 'single', inputLimit: 'limitSymbol', text: '不包含' }
        ],
        attributeOptions: [''],
        recordName: '',
        modelList: [],
        formData: {
            searchCriteria: [
                {
                    name: '', // 搜索属性名称 构件属性
                    exp_val_list: [], // 标准属性
                    operator: 1, // 上下属性连接操作符 1:并且 2:或者
                    key: new Date(),  // 唯一标识
                    selectOpen: false,  // 下拉框是否展开
                    exp_val_list_checked_id: [],// 选中的标准属性id,
                }
            ]
        },
        loading: true,
        indexNum: 0,
        expressionSelectIndex: 0,
        searchCriteriaData: [],
        options: [],
        checkBoxAcitiveIndex: -1,
        singleInputValue: '',
        doubleLeftValue: null,
        doubleRightValue: null,
        inputCHNStart: false,
        currentParams: {
            keyword: '',
            page_num: 1,
            page_size: 10,
            totalCount: 0
        },
        recordId: '',

        

        
      
    }
  },
  computed: {
    nowSymbolInfo() {
        return this.operation[this.checkBoxAcitiveIndex]
    },
    optionProps() {
        return this.operation.filter(item => item.key === value.symbol)[0]
    },
    visibleCheckBox(){
        return this.formData.searchCriteria.selectOpen
    },
    addBtnDisabled() {
        let disabled = true
        if (this.nowSymbolInfo.inputType === 'single') {
            disabled = this.singleInputValue === ''
        } else if (this.nowSymbolInfo.inputType === 'double') {
            disabled = this.doubleLeftValue === null || this.doubleRightValue === null
        }
        return disabled
    },
  },

  watch: {
  },
 
  mounted() {
    Bus.$on('pathList', (data) => {
      this.modelList = data[0]
      this.recordName = data[1]
      this.getProperty(this.modelList)
    })
    this.formData.searchCriteria.forEach((item, index) => {
        if (!item.operator) {
          item.operator = 1
        }
        item.key = new Date()
        item.selectOpen = false
        item.exp_val_list_checked_id = []
        item.exp_val_list.forEach(list => {
          list.key = ''
          item.exp_val_list_checked_id.push(list.key)
          this.options.push(list)
        })
    })
  },
  
  beforeDestroy() {
      Bus.$off('pathList');
      Bus.$off('modelList');
  },
  methods: {
    handleDeselect(value, option, index) {
        // 删除options中的数据
        this.options = this.options.filter(item => item.key !== option.key)
        // 删除formData中的数据
        this.formData.searchCriteria[index].exp_val_list = this.formData.searchCriteria[index].exp_val_list.filter(list => list.key !== option.key)
        this.formData.searchCriteria[index].exp_val_list_checked_id = this.formData.searchCriteria[index].exp_val_list_checked_id.filter(item => item !== option.key)
    },
    handleAdd (index) {
        this.formData.searchCriteria[index].selectOpen = false
        let params = {
            symbol: this.nowSymbolInfo.key,
            value: this.singleInputValue || this.doubleLeftValue + ',' + this.doubleRightValue,
            key: `${this.nowSymbolInfo.label}${this.singleInputValue || this.doubleLeftValue + ',' + this.doubleRightValue}`
        }
        
        JSON.parse(JSON.stringify(params))
        this.formData.searchCriteria[index].exp_val_list.push(params)
        // 塞入数据，tag展示
        this.options.push(params)
        this.formData.searchCriteria[index].exp_val_list_checked_id.push(params.key)

        this.reset()
        this.checkBoxAcitiveIndex = -1
    },
    singleInputChange(e) {
        // 限制\/:*?"<>|、：？“”《》＼／＊＂＜＞｜×字符输入
        // singleInputValue.value = e.target.value.replace(/\s+/g, '').replace(/[\\/*?"<>|、？“”《》＼／＊＂＜＞｜×]/g, "");
        this.singleInputValue = e.target.value.trim()

    },
    operatorChange(value, index) {
        this.formData.searchCriteria[index].operator = value
    },
    onFinish() {
        return new Promise((resolve) => {
            this.$refs.formRef
            .validate()
            .then(() => {
                const nameArr = formData.searchCriteria.map(item => {
                return item.name
                })
                // 判断表达式名称是否重复
                if (new Set(nameArr).size !== nameArr.length) {
                message.warning({ content: '存在重命名的构件属性', key: 'message' })
                return
                }
                let expressionList = JSON.parse(JSON.stringify(formData.searchCriteria))
                expressionList[expressionList.length - 1].operator = 0
                resolve(expressionList)
            })
            .catch(error => {
                console.log('error', error);
            });
        })
    },
    visibleChange (value, index) {
        if (value) return
        this.formData.searchCriteria[index].selectOpen = value
        // this.$refs.formRef.validateField([['searchCriteria', index, 'exp_val_list']])
    },
    deleteIcon(index) {
        if (this.formData.searchCriteria.length <= 1) return
        this.formData.searchCriteria.splice(index, 1)
    },
    handleCheckBox(icheckBoxIndexndex, index) {
        if (this.checkBoxAcitiveIndex === icheckBoxIndexndex) return
        this.reset()
        this.checkBoxAcitiveIndex = icheckBoxIndexndex
    },
    // 重置表达式输入状态
    reset() {
        this.singleInputValue = ''
        this.doubleLeftValue = null
        this.doubleRightValue = null
    },
    
    searchMerchantList(name) {
        if (!props.searchScopeRef.pathList.length) return
        currentParams.page_num = 1
        currentParams.page_size = 10
        getList(name, '')
    },
    popupScroll (e, name) {
        const { target } = e;
        // 滚动 触底 看接口是否还有剩余的值没传过来
        if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
            if (currentParams.page_num * currentParams.page_size < currentParams.totalCount) {
            // 每滚动一次，多加载10条数据
            currentParams.page_num++
            currentParams.page_size = currentParams.page_size
            this.loading.value = true
            getList(name, 'concat')
            }
        }
    },
    selectProperty(value, index) {
        //限制输入10字符，仅允许输入汉字、英文和数字
        this.formData.searchCriteria[index].name = value.replace(/\s+/g, '').replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, "");
        this.formData.searchCriteria[index].name = this.formData.searchCriteria[index].name.length > 10 ? this.formData.searchCriteria[index].name.slice(0, 10) : this.formData.searchCriteria[index].name
    },
    blurComplete () {
        this.indexNum = 0
        JSON.parse(JSON.stringify(this.formData.searchCriteria)).forEach((item, indexSon) => {
            if (item.name) {
                // this.$refs.formRef.validateField([['searchCriteria', indexSon, 'name']])
            }
        })
    },
    componentValidator(value) {
        if (value === '') {
            return Promise.reject('请输入构件属性');
        } else {
            const names = []
            JSON.parse(JSON.stringify(this.formData.searchCriteria)).map(item => {
            if (item.name) {
                names.push(item.name)
            }
            })
            if (names.lastIndexOf(value) !== names.indexOf(value)) {
            indexNum.value++
            return Promise.reject('存在重命名的构件属性')
            }
            // formRef.validateField('checkPass')
            return Promise.resolve();
        }
    },
    expressionValidator(value) {
        if (value == '') {
            return Promise.reject('请输入正确的搜索表达式')
        } else {
            // formRef.validateField('checkPass')
            return Promise.resolve();
        }
    },
    inputNumberChange (e, inputType) {
        switch (inputType) {
            case 'singleInputValue':
            this.singleInputValue = this.limitNumber(e.target.value)
            break;
            case 'doubleLeftValue':
            this.doubleLeftValue = this.limitNumber(e.target.value)
            break;
            case 'doubleRightValue':
            this.doubleRightValue = this.limitNumber(e.target.value)
            break;
            default:
            break;
        }
    },
    limitNumber(inputValue) {
        inputValue = inputValue.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
        inputValue = inputValue.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
        inputValue = inputValue.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        // 限制十个字符
        inputValue = inputValue.length > 10 ? inputValue.slice(0, 10) : inputValue
        return inputValue
    },
    addIcon() {
        if (this.formData.searchCriteria.length >= 5) {
            return
        }
        this.formData.searchCriteria.push({
            name: '',
            operator: 1,
            exp_val_list: [],
            key: new Date(),
            selectOpen: false,
            exp_val_list_checked_id: []
        })
    },
    getProperty(paths) {
        component_category({render_paths: paths}).then(res => {
        component_property({render_paths: paths, page_num: 1, page_size: 10, categories: [], keyword: '' }).then(res => {
            this.attributeOptions = res.data.properties
        })
      })
    },
    
    handleSubmit(){
      this.$emit('cancel', null, false)
      this.loading = true
      let params = {
        render_paths: this.modelList,
        expression_list: this.formData.searchCriteria,
        search_range: [1]
      }
     
      search(params).then(res => {
        if (res.code === 10350004) {
          return message.warning({ content: '存在重命名的检查名称', key: 'message' })
        }
        if (res.code !== ResponseStatus.success) return
        this.recordId = res.data.id
        
        save_search_record({name: this.recordName, record_id: res.data.id}).then(() => {
            this.$emit('cancel', null, false)
            //updateList
            Bus.$emit('updateList', this.recordId)
        })
      })
    }
  }
}


</script>
<style scoped lang="less" scoped>
.expressioncheck {
      .checkBox {
        width: 36px;
        height: 36px;
        background: #F5F5F5;
        color: #666666;
        font-weight: 600;
        border-radius: 2px;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        // margin-right: 12px;
        margin-top: 12px;
        cursor: pointer;

        &:hover {
          color: #0E80E7;
        }
      }

      .checkBoxAcitive {
        color: #0E80E7;
      }
    }
.step3{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  :deep(.dsd-form-item-control) {
    display: flex;
    justify-content: center;
  }
}
.searchContent {
  width: 100%;
  padding: 20px 133px;
}

.title {
  word-break: break-all;
  font-size: 14px;
  color: #666666;
  line-height: 22px;
  background: #F3F8FE;
  padding: 12px;
  margin-bottom: 18px;

  .info {
    display: inline-block;
    font-size: 14px;
    color: #282828;
    line-height: 20px;
    margin-bottom: 12px;
    vertical-align: top;
  }
}

.anticon {
  margin-right: 8px;
}

.operationIcon {
  width:36px;
  height: 36px;
  display: flex;
  align-items: center;
}

.iconDisabled {
  cursor: not-allowed;
  opacity: 0.5;

  &:hover {
    color: #666666;
  }
}

.selectDropdownRender {
  .dropdownContent {
    padding: 12px 12px 12px 12px;
    :deep(.dsd-col) {
      margin-right: 0;
      height: 36px;
      line-height: 36px;

      .dsd-btn {
        min-height: 36px;
      }
    }

    :deep(.dsd-input) {
      border-color: #d9d9d9 !important;
      height: 36px;

      &:focus {
        box-shadow: 0 0 0 2px rgb(14, 128, 231, 0.2) !important;
        border-color: #36a2f5 !important;
      }
    }

    :deep(.dsd-input-number-focused) {
      box-shadow: 0 0 0 2px rgb(14, 128, 231, 0.2) !important;
      border-color: #36a2f5 !important;
    }

    :deep(.dsd-input-number) {
      border-color: #d9d9d9 !important;
    }

    :deep(.inputNumber) {
      border-color: #d9d9d9 !important;
    }

    :deep(.dsd-btn) {
      min-width: 72px;
    }

    :deep(.dsd-form-item) {
      margin: 0;
    }
    .doubleContent {
      display: flex;
      align-items: center;

      .inputNumber {
        width: 93%;
        margin-left: 3%;
      }
    }

    

    .symbol {
      color: #666666;
      font-weight: 600;
      font-size: 16px;
    }

    .smallSymbol {
      font-size: 14px;
    }
  }

  // 选择框标签
  :deep(.dsd-tag) {
    background-color: #F5F5F5;
    display: flex;
    align-items: center;
    height: 24px;
    border: 0;
    max-width: 113px;

    .tagSpan {
      font-size: 14px;
      font-weight: 400;
      color: #282828;
    }

    .dsd-tag-close-icon {
      width: 16px;
      height: 16px;
      background-color: #CCCCCC;
      color: #F5F5F5;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 0;

      &:hover {
        background: #999;
      }
    }

    .dsd-title-popover {
      margin-right: 3px;
    }
  }
}

.formLayout {
  display: flex;
  align-items: flex-start;
  flex-wrap: nowrap;

  :deep(.dsd-select-selector) {
    min-height: 36px;

    .dsd-select-selection-search {
      min-height: 36px;

      input {
        height: 34px;
        line-height: 36px;
      }
    }

    .dsd-select-selection-placeholder {
      line-height: 35px;
      min-height: 36px;
    }
  }

  .dsd-col {
    &:last-child {
      margin-right: 0;
    }
  }
}

.multipleSelect {
  :deep(.dsd-select-selector) {
    height: auto;
    min-height: 36px;

    .dsd-select-selection-overflow {
      min-height: 28px;
      align-items: center;

      .dsd-select-selection-overflow-item-suffix {
        display: none;
      }
    }
  }
}

.selectOption {
  :deep(.dsd-select-selection-item) {
    display: flex;
    align-items: center;
    align-self: baseline;
  }
}

:deep(.dsd-form-item-with-help) {
  margin-bottom: 0;
}

:deep(.dsd-form-item-with-help .dsd-form-item-explain) {
  min-height: 24px;
}

:deep(.dsd-select-multiple .dsd-select-selector) {
  padding: 2px 4px;

  .dsd-select-selection-overflow-item {
    align-self: baseline;
    height: 28px;
    display: flex;
    align-items: center;

  }
}

:deep(.dsd-popover) {
  width: 100%;
  padding: 0;
  max-width: 450px;

  .dsd-popover-inner-content {
    padding: 0;
  }

  .dsd-popover-arrow {
    display: none;
  }
}

.animation {
  display: inline-block;
}

.animation-enter-from,
.animation-leave-to {
  opacity: 0;
}

.animation-enter-to,
.animation-leave-from {
  opacity: 1;
}

.animation-enter-active {
  transition: opacity 0.4s ease;
}

.animation-leave-active {
  transition: opacity 0s ease;
}
//或使用动画
.animation-enter-active {
  animation: bounce 0.4s ease;
}

.animation-leave-active {
  animation: 0.1s linear reverse;
}

@keyframes bounce {
  100% {
    height: 36px;
  }
}
</style>

<style lang="less">
.getMore-advanced {
  position: relative;

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, .8);
    opacity: .8;
    top: 0;
    // background: url(@/assets/attributePop/load.gif) no-repeat 50% 50%;
    background-size: 24px;
  }
}
</style>