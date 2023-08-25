/**
 * @Date: 2023-07-17 14:02:05
 * @LastEditTime: 2023-07-24 11:48:58
 * @FilePath: /openapi-demoapp/app/web/utils/directive.js
 * @Description:
 */
import Vue from 'vue'

const directives = () => {
  Vue.directive('focus', {
    inserted(el, binding) {
      el.focus()
    }
  }),
    Vue.directive('resize', {
      bind(el, binding) {
        // el为绑定的元素，binding为绑定给指令的对象
        let width = '',
          height = ''
        function isReize() {
          const style = document.defaultView.getComputedStyle(el)
          if (width !== style.width || height !== style.height) {
            binding.value({ width: style.width, height: style.height }) // 关键(这传入的是函数,所以执行此函数)
          }
          width = style.width
          height = style.height
        }
        el.__vueSetInterval__ = setInterval(isReize, 300)
      },
      unbind(el) {
        clearInterval(el.__vueSetInterval__)
      }
    }),
    Vue.directive('drag', {
      //这里的el就是获取的元素
      bind(el) {
        let odiv = el //获取当前元素
        // 判断是否依据父级节点来定位
        const dragLimitClass = el.getAttribute('dragLimitClass')

        const handleDragClass = el.getAttribute('handleDragClass')
        el.onmousedown = e => {
          const elWidth = el.offsetWidth + 1 // 解决边距被遮挡不显示的问题
          const elHeight = el.offsetHeight
          if (e.target.className !== handleDragClass) return
          // 让页面元素不会被选中
          document.onselectstart = () => {
            return false
          }
          //算出鼠标相对元素的位置
          let disX = e.clientX - odiv.offsetLeft
          let disY = e.clientY - odiv.offsetTop
          let left = 0
          let top = 0
          document.onmousemove = e => {
            const parentDom = document.querySelector(`.${dragLimitClass}`)
            //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
            left = e.clientX - disX
            top = e.clientY - disY
            var docWidth = dragLimitClass ? parentDom.clientWidth : document.body.clientWidth //网页可见宽
            var docHeight = dragLimitClass ? parentDom.clientHeight : document.body.clientHeight //网页可见高
            if (docHeight && top > docHeight - elHeight) {
              //超下边界
              top = docHeight - elHeight
            }
            if (top < 0) {
              //超上边界
              top = 0
            }
            if (docWidth && left > docWidth - elWidth) {
              //超右边界
              left = docWidth - elWidth
            }
            if (left < 0) {
              //超左边界
              left = 0
            }
            //绑定元素位置到positionX和positionY上面
            //移动当前元素
            odiv.style.left = left + 'px'
            odiv.style.top = top + 'px'
          }
          document.onmouseup = e => {
            document.onmousemove = null
            document.onmouseup = null
            document.onselectstart = () => {
              return true
            }
          }
        }
      }
    }),
    Vue.directive('resizeable', {
      bind(el, binding) {
        let startX, startY, startWidth, startHeight
        const handle = document.createElement('div')
        handle.style.width = '1rem'
        handle.style.height = '1rem'
        handle.style.position = 'absolute'
        handle.style.right = '0'
        handle.style.bottom = '0'
        handle.style.background = 'transparent'
        handle.style.cursor = 'se-resize'
        el.appendChild(handle)

        handle.addEventListener('mousedown', e => {
          startX = e.clientX
          startY = e.clientY
          startWidth = parseInt(document.defaultView.getComputedStyle(el).width, 10)
          startHeight = parseInt(document.defaultView.getComputedStyle(el).height, 10)
          document.addEventListener('mousemove', resize)
          document.addEventListener('mouseup', stopResize)
          // 让页面元素不会被选中
          document.onselectstart = () => {
            return false
          }
        })
        const limitClass = el.getAttribute('resizeLimitClass')
        const isRem = el.getAttribute('isRem')
        function resize(e) {
          const newWidth = startWidth + e.clientX - startX
          const newHeight = startHeight + e.clientY - startY
          const fontSize = isRem ? document.documentElement.style.fontSize.replace('px', '') : 1
          if (limitClass) {
            const limitEl = el.closest(`.${limitClass}`)
            if (limitEl) {
              const limitWidth = limitEl.getBoundingClientRect().width
              const limitHeight = limitEl.getBoundingClientRect().height
              if (newHeight + el.offsetTop > limitHeight) {
                el.style.height = (limitHeight - el.offsetTop) / fontSize + (isRem ? 'rem' : 'px')
                return
              }
              if (newWidth + el.offsetLeft > limitWidth) {
                el.style.width = (limitWidth - el.offsetLeft) / fontSize + (isRem ? 'rem' : 'px')
                return
              }
            }
          }
          el.style.width = newWidth / fontSize + (isRem ? 'rem' : 'px')
          el.style.height = newHeight / fontSize + (isRem ? 'rem' : 'px')
        }

        function stopResize() {
          document.removeEventListener('mousemove', resize)
          document.removeEventListener('mouseup', stopResize)
          document.onselectstart = () => {
            return true
          }
        }
      }
    })
}
export default directives
