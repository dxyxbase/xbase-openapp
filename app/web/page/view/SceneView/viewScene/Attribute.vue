<template>
  <div :isRem="true" v-resizeable :resizeLimitClass="resizeLimitClass" class="attributePop" v-drag :style="attributePosition" :dragLimitClass="dragLimitClass" handleDragClass="attribute-top">
    <div class="attribute-top">
      <span>属性</span>
      <span class="close" @click="handleClose">×</span>
    </div>
    <div class="attribute-content">
      <div>
        <!-- 无数据 -->
        <div v-if="empty" class="attribute-content-empty">
          <img src="@/asset/attributePop/empty.png" alt="error" />
          <span>暂无内容</span>
        </div>
        <!-- 有数据 -->
        <div v-else class="attribute-content-box">
          <div class="field-item field-item-header">
            <span>属性名</span>
            <span>属性值</span>
            <span>单位</span>
          </div>
          <div v-for="(item, index) in attributeData.categories" :key="index" :class="'attribute-content-box-item'">
            <div class="header" @click="imgFold(item)">
              <img src="@/asset/attributePop/left.png" :class="{ itemFold: item.fold }" alt="error" />
              <span class="item-title">{{ item.category }}</span>
            </div>
            <mytransition time="0.2s">
              <div style="width: 100%; margin-bottom: 0.75rem" v-if="!item.fold">
                <div v-for="(ii, idx) in item.properties" :key="idx" class="field-item">
                  <span>{{ ii.name }}</span>
                  <span class="types-1">{{ ii.value }}</span>
                  <span>{{ ii.unit }}</span>
                </div>
              </div>
            </mytransition>
          </div>
        </div>
      </div>
    </div>
    <div class="dragIcon"></div>
  </div>
</template>

<script>
import mytransition from './MyTransition/index.vue'
export default {
  name: 'attribute',
  components: {
    mytransition
  },
  props: {
    closePop: {
      type: Function,
      default: () => {}
    },
    attributeData: {
      type: Object,
      default: () => {}
    },
    resizeLimitClass: {
      type: String,
      default: ''
    },
    dragLimitClass: {
      type: String,
      default: ''
    },
    position: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    empty() {
      if (!this.attributeData) {
        return !this.attributeData
      } else {
        return !Object.keys(this.attributeData).length
      }
    },
    attributePosition() {
      return {
        top: this.position.top,
        left: this.position.left
      }
    }
  },
  methods: {
    imgFold(item) {
      this.$set(item, 'fold', !item.fold)
    },
    getpopupcontainer() {
      return document.querySelector('.types-1')
    },
    handleClose() {
      this.$emit('closePop', 'CUSTOM_BTN')
    }
  }
}
</script>

<style lang="less" scoped>
.cursor:hover {
  color: #0e80e7;
}

.attributePop {
  background: hsla(0, 0%, 100%, 0.94);
  -webkit-box-shadow: 0px 0.125rem 0.5rem 0px rgba(0, 0, 0, 0.16);
  box-shadow: 0px 0.125rem 0.5rem 0px rgba(0, 0, 0, 0.16);
  width: 500px;
  height: 600px;
  position: absolute;
  z-index: 99;
  border: 0.0625rem solid #e6e6e6;
  border-radius: 0.25rem;
  font-family: 'PingFangSC-Regular, PingFang, SC PingfangSC';
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  .attribute-top {
    height: 3rem;
    border-bottom: 0.0625rem solid #e6e6e6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // margin: 0 .3125rem;
    padding: 0 1.5rem;
    cursor: all-scroll;
    .close {
      cursor: pointer;
    }

    span:nth-child(1) {
      color: #333;
      font-size: 1rem;
      font-weight: bold;
      margin: 0 auto;
    }

    span:nth-child(2) {
      font-size: 1.5rem;
    }
  }

  .itemFold {
    transform: rotate(-180deg) !important;
    transition-duration: 0.3s;
  }

  .attribute-content {
    height: 0;
    flex-grow: 1;
    overflow: hidden;
    > div {
      height: 100%;
      overflow: auto;
    }
    // overflow-y: auto;
    // overflow-x: hidden;
    // padding: 1.125rem .375rem 0;
    padding: 1.125rem 0;
    &-box {
      height: 100%;
      // padding: 0 1.125rem;
      overflow: auto;

      &-item {
        width: 100%;
        // padding: .625rem;
        // border-bottom: .0625rem solid #ebebeb;
        margin-bottom: 0.125rem;
        // display: flex;
        color: #333;
        .header {
          width: 100%;
          height: 2rem;
          background: rgba(14, 128, 231, 0.03);
          display: flex;
          align-items: center;
          cursor: pointer;
          img {
            width: 1.125rem;
            height: 1.125rem;
            transform: rotate(-90deg);
            transition-duration: 0.3s;
            margin: 0 0.25rem 0 1.5rem;
            // top: .125rem;
            position: relative;
            cursor: pointer;
          }

          .item-title {
            min-height: 1.375rem;
            line-height: 1.375rem;
            width: 100%;
            font-size: 0.875rem;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #282828;
          }
        }
      }
      .field-item {
        padding-left: 2.875rem;
        span {
          display: inline-block;
          vertical-align: text-top;
          word-break: break-all;
          width: 40%;
          padding: 0.375rem;
          font-size: 0.75rem;
        }

        span:first-child {
          padding-left: 0;
          width: 36%;
        }

        span:last-child {
          width: 15%;
        }
      }
      .field-item-header {
        color: #0e80e7;
        span {
          padding-top: 0;
        }
      }
      &-item:last-child {
        border-bottom: none;
      }
    }

    &-empty {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-top: -1.125rem;
      img {
        width: 7.75rem;
        height: 6.625rem;
        margin-bottom: 0.75rem;
        max-height: 65%;
        -o-object-fit: contain;
        object-fit: contain;
      }

      span {
        color: #969696;
        font-size: 0.875rem;
      }
    }
  }
  .dragIcon {
    position: absolute;
    bottom: 0;
    right: 0;
    font-size: 0.875rem;
  }
}

.attributePop :deep(.dsd-popover-inner-content) {
  padding: 0.75rem 1rem !important;
}

.attributePop :deep(.dsd-popover-arrow) {
  bottom: -0.5rem !important;
}

.attributePop :deep(.dsd-popover) {
  max-width: 12.5rem;
}
</style>
