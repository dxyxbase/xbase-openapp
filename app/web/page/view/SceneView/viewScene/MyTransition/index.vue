<template>
  <div :class="{ directionByLeft: direction === 'left' }">
    <transition
      @before-enter="beforeEnter"
      @enter="enter"
      @after-enter="afterEnter"
      @before-leave="beforeLeave"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <slot></slot>
    </transition>
  </div>
</template>
<script>
const transitionDirection = {
  // top: 'height',
  bottom: 'height',
  // left: 'width',
  right: 'width'
}
const transitionScroll = {
  // top: 'scrollHeight',
  bottom: 'scrollHeight',
  // left: 'scrollWidth',
  right: 'scrollWidth'
}
export default {
  props: {
    time: {
      type: String,
      default: '0.3s'
    },
    // 展开收起方向
    direction: {
      type: String,
      default: 'bottom'
    }
  },
  data() {
    return {
      transitionMode: transitionDirection[this.direction],
      styleScroll: transitionScroll[this.direction]
    }
  },
  methods: {
    // 过渡值初始化
    transitionStyle() {
      return `${this.time} ${this.transitionMode} ease-in-out`
    },
    // 进入前 设置el元素的transition
    beforeEnter(el) {
      el.style.transition = this.transitionStyle()
      el.style[this.transitionMode] = 0
    },
    // 进入中
    enter(el) {
      if (el[this.styleScroll] !== 0) {
        el.style[this.transitionMode] = `${el[this.styleScroll]}px`
      } else {
        el.style[this.transitionMode] = ''
      }
      el.style.overflow = 'hidden'
    },
    // 进入结束
    afterEnter(el) {
      // 清除过度样式
      el.style.transition = ''
      el.style[this.transitionMode] = ''
    },
    // 离开前
    beforeLeave(el) {
      el.style[this.transitionMode] = `${el[this.styleScroll]}px`
      el.style.overflow = 'hidden'
    },
    // 离开中
    leave(el) {
      if (el[this.styleScroll] !== 0) {
        el.style.transition = this.transitionStyle()
        el.style[this.transitionMode] = 0
      }
    },
    // 离开结束
    afterLeave(el) {
      el.style.transition = ''
      el.style[this.transitionMode] = ''
    }
  }
}
</script>
<style lang="less" scoped>
.directionByLeft {
}
</style>
