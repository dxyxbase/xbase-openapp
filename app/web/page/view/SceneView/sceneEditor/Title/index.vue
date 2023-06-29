<template>
  <div class="title">
    <span class="titleIcon" @click="go2Back">
      <iconFontCIM type="icon-cim-fanhui"></iconFontCIM>
    </span>
    <span class="sceneName">{{ $t('menu.console-sceneEditor') }}: {{ title }}</span>
    <div class="switchWrapper">
      <a-dropdown class="modeChange">
        <a @click="preventDefault">
          {{ engineType }}
          <a-icon type="down" />
        </a>
        <a-menu slot="overlay" class="modeChangeModal">
          <a-menu-item :class="{ modeChangeActive: engineType === 'CME' }" @click="() => this.onEngineChange('CME')">
            {{ 'cesium' }}
          </a-menu-item>
          <a-menu-item :class="{ modeChangeActive: engineType === 'RME' }" @click="() => this.onEngineChange('RME')">
            {{ 'cimStreaming' }}
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
    <div class="toolbarRight">
      <div v-for="{ id, name, disabled } in rightList" :key="id" :class="[defaultBtn, { disabledBtn: disabled }]" class="toolbarItem" @click="() => onToolbarClick(id, disabled)">
        <!-- <iconFontDX :type="defaultIcon" class="btnIcon" /> -->
        <div class="toolbarName">{{ name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import iconFontDX, { iconFontCIM } from '@/components/IconFont'

import { platformName, sceneEdit, groundMode, undergroundMode, gobackIcon } from '../constant'
export default {
  components: {
    iconFontDX,
    iconFontCIM
  },
  props: {
    title: {
      type: String,
      required: true,
      default: ''
    },
    modeType: {
      type: String,
      required: true,
      default: ''
    },
    onChange: {
      type: Function,
      required: true,
      default: () => {}
    },
    check: {
      type: Function,
      required: true,
      default: () => {}
    },
    engineType: {
      type: String,
      required: true,
      default: ''
    },
    onEngineChange: {
      type: Function,
      required: true,
      default: () => {}
    },
    rightList: {
      type: Array,
      required: true,
      default: () => []
    },
    activeId: {
      type: String,
      required: true,
      default: ''
    },
    onClick: {
      type: Function,
      required: true,
      default: () => {}
    }
  },
  data() {
    return {
      platformName,
      sceneEdit,
      groundMode,
      undergroundMode,
      gobackIcon,
      defaultBtn: 'btn'
    }
  },
  created() {},
  computed: {},
  methods: {
    go2Back() {
      const that = this
      // console.log('返回场景列表')
      const flag = this.check()
      if (flag) {
        this.$confirm({
          content: this.$t('scene.exitWithoutSave'),
          okText: this.$t('global.determine'),
          okType: 'primary',
          cancelText: this.$t('global.cancel'),
          class: 'comfirm-pop',
          centered: true,
          icon: () => <span></span>,
          onOk() {
            that.$router.push('/console/scene-manage')
          },
          onCancel() {
            console.log('Cancel')
          }
        })
      } else {
        that.$router.push('/console/scene-manage')
      }
    },
    preventDefault(e) {
      e.stopPropagation()
    },
    onToolbarClick(id, disabled) {
      if (disabled) return
      this.onClick(id)
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #373c4a;
  padding: 0.9375rem 2.125rem;
  height: 3.375rem;
  color: #fff;
  position: relative;
  .titleIcon {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    left: 2.125rem;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    background: #4c5263;
    cursor: pointer;
    .anticon {
      font-size: 0.875rem;
      color: #fff;
    }
    &:hover,
    &:active {
      background: #62697d;
    }
    &:active .anticon {
      color: #ccc;
    }
  }
  .sceneName {
    font-size: 0.875rem;
  }
  .toolbarRight {
    display: flex;
    gap: 1.5rem;
    position: absolute;
    right: 1.5rem;
    .toolbarItem {
      display: flex;
      align-items: center;
      justify-self: space-between;
      gap: 0.25rem;
      .anticon {
        vertical-align: middle;
      }
    }
    .btn {
      // padding: 16px 32px;
      cursor: pointer;
      white-space: nowrap;
      // width: 4.25rem;
      // height: 3.625rem;
      // border-radius: .25rem;
      // padding: .375rem;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      .btnIcon {
        font-size: 1rem;
        color: #fff;
      }
      .toolbarName {
        font-size: 0.875rem;
        line-height: 1rem;
        margin-top: 0.0625rem;
        color: #fff;
        // 文字不可选中
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
    }

    .btn:hover {
      // background: #4c5263;
      .btnIcon {
        color: #2d9bfd;
        transition: all 0.3s ease;
      }
      .toolbarName {
        color: #2d9bfd;
        transition: all 0.3s ease;
      }
    }

    .btnActive {
      // background: rgba(41, 42, 48, 1) !important;
      // box-shadow: 0rem .125rem .1875rem 0rem rgba(0, 0, 0, 1);
      .toolbarName {
        color: #2d9cff;
      }
    }

    .disabledBtn {
      color: rgba(126, 126, 129, 1) !important;
      cursor: not-allowed;
      .btnIcon {
        color: rgba(126, 126, 129, 1);
      }
      .toolbarName {
        color: rgba(126, 126, 129, 1);
      }
      &:hover {
        // background: #4c5263;
        .btnIcon {
          color: rgba(126, 126, 129, 1) !important;
        }
        .toolbarName {
          color: rgba(126, 126, 129, 1) !important;
        }
      }
    }

    .disabledBtn:hover {
      background: transparent;
      box-shadow: none;
    }
  }
  .modeChangeModal {
    padding: 0;
    background: rgba(41, 42, 48, 1);

    .modeChangeActive {
      background-color: rgba(14, 128, 231, 0.1);
    }

    li {
      color: #fff;
    }

    li:hover {
      background-color: rgba(14, 128, 231, 0.1);
    }
  }
  .modeChange {
    color: #fff;
    display: flex;
    align-items: center;
    i {
      font-size: 1.125rem;
      margin-left: 0.375rem;
    }
  }

  .switchWrapper {
    display: flex;
    position: absolute;
    right: 30.875rem;
  }

  .disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
