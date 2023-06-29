<template>
  <div class="firstToolbar">
    <ul class="toolbarLeft">
      <li
        v-for="{ id, defaultIcon, activeIcon, name, disabled } in leftList"
        :key="id"
        :class="[
          defaultBtn,
          { btnActive: activeId === id },
          { disabledBtn: disabled },
          { haveSecond: haveSecondToolbar && activeId === id }
        ]"
        @click="() => onToolbarClick(id, disabled)"
      >
        <iconFontCIM :type="activeId === id ? activeIcon : defaultIcon" class="btnIcon" />
        <div class="toolbarName">{{ name }}</div>
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
    leftList: {
      type: Array,
      required: true,
      default: () => []
    },
    onClick: {
      type: Function,
      required: true,
      default: () => {}
    },
    haveSecondToolbar: {
      type: Boolean,
      required: true,
      default: false
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
.firstToolbar {
  width: 100%;
  height: 100%;
  padding: 0.9375rem 0;
  background: #373c4a;
  .toolbarLeft {
    margin: 0;
    padding: 0;
    .btn {
      cursor: pointer;
      white-space: nowrap;
      text-align: center;
      width: 100%;
      height: 3.625rem;
      margin: 0.375rem 0;
      padding: 0.375rem;
      transition: all 0.3s ease;
      .btnIcon {
        font-size: 1.5rem;
        color: #fff;
      }
      .toolbarName {
        font-size: 0.875rem;
        color: #fff;
        line-height: 1.25rem;
        // 文字不可选中
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
    }

    .btn:hover {
      background: #4c5263;
    }

    .btnActive {
      background: #252933;
      // .toolbarName {
      //   color: #2d9cff;
      // }
    }
    .haveSecond {
      position: relative;
      z-index: 501;
      &::after {
        content: '';
        position: absolute;
        width: 0.4375rem;
        height: 0.4375rem;
        top: 50%;
        right: -0.3125rem;
        border-top: 0.125rem solid #7e8398;
        border-left: 0.125rem solid #7e8398;
        background: #252933;
        transform: translateY(-50%) rotate(135deg);
        transition: 0.3s all ease;
      }
      &:hover {
        &::after {
          content: '';
          background: #4b5162;
          transition: 0.3s all ease;
        }
      }
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
}
</style>
