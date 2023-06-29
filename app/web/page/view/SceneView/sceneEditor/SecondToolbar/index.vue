<template>
  <div class="secondToolbar">
    <ul>
      <li
        v-for="({ id, name, disabled, defaultIcon }, index) in list"
        :key="id"
        :class="[defaultBtn, { btnActive: activeId === id }, { disabledBtn: disabled }]"
        @click="() => onToolbarClick(id, disabled)"
      >
        <a-tooltip overlayClassName="secondToolbarName">
          <template slot="title">
            {{ name }}
          </template>
          <div class="toolbarIcon">
            <iconFontCIM :type="defaultIcon" class="toolbarIcon" :class="{ iconActive: activeId === id }" />
          </div>
        </a-tooltip>
        <div v-if="index !== list.length - 1" class="line"></div>
      </li>
    </ul>
  </div>
</template>

<script>
import { iconFontCIM } from '@/components/IconFont'
export default {
  components: {
    iconFontCIM
  },
  props: {
    activeId: {
      type: String,
      required: true,
      default: ''
    },
    list: {
      type: Array,
      required: true,
      default: () => []
    },
    onClick: {
      type: Function,
      required: true,
      default: () => {}
    }
  },
  data() {
    return {
      defaultBtn: 'btn'
    }
  },
  created() {},
  computed: {},
  methods: {
    onToolbarClick(id, disabled) {
      if (disabled) return
      this.onClick(id)
    }
  }
}
</script>

<style lang="less" scoped>
ul {
  padding: 0;
  margin: 0;
  padding: 1.5625rem 0.375rem;
  width: 3rem;
}
.secondToolbar {
  position: absolute;
  top: 0;
  left: 5.75rem;
  width: 3rem;
  height: 100%;
  z-index: 500;
  background: rgba(44, 48, 58, 0.9);
  border-left: 0.125rem solid #7e8398;

  .btn {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-around;
    cursor: pointer;
    color: #fff;
    width: 100%;
    .toolbarIcon {
      font-size: 1.375rem;
      width: 2.25rem;
      height: 2.25rem;
      display: flex;
      border-radius: 0.25rem;
      align-items: center;
      justify-content: center;
      transition: 0.3s all ease;
      &:hover {
        background: #4b5162;
      }
      img {
        width: 1.375rem;
      }
    }
    .iconActive {
      transition: 0s all ease;
      color: #2d9cff;
    }
    .line {
      width: 1.5rem;
      height: 0.0625rem;
      background: rgba(133, 136, 151, 0.4);
      margin: 1.25rem 0;
    }
  }

  // .btn:hover{
  //     background: rgba(29, 30, 35, 0.5);
  // }

  .btnActive {
  }

  .disabledBtn {
    color: rgba(126, 126, 129, 1);
    cursor: not-allowed;
  }

  .disabledBtn:hover {
    background: transparent;
    box-shadow: none;
  }
}
</style>
<style lang="less">
.secondToolbarName {
  font-size: 0.875rem;
  max-width: 15.625rem;
  .ant-tooltip-inner {
    min-height: 1.4375rem;
    min-width: 1.875rem;
    padding: 0.1875rem 0.5rem;
    background: rgba(0, 0, 0, 0.6);
  }
  .ant-tooltip-arrow {
    bottom: 0;
    width: 0.8169rem;
    height: 0.8169rem;
  }
  .ant-tooltip-arrow::before {
    width: 0.8169rem;
    height: 0.8169rem;
  }
}
</style>
