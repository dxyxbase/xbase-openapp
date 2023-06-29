<template>
  <div class="menus">
    <el-menu :default-active="activeMenu" :collapse="isCollapse" :background-color="variables.menuBg" :text-color="variables.menuText" :unique-opened="false" :active-text-color="variables.menuActiveText" :collapse-transition="false" mode="vertical">
      <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
    </el-menu>
  </div>
</template>
<style lang="less" scoped>
.menus {
  position: relative;
  height: 100%;
}
</style>
<script>
import variables from '@/style/variables.less'
import SidebarItem from './SidebarItem'
export default {
  components: { SidebarItem },
  props: {
    collapse: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    variables() {
      return variables
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    routes() {
      // console.log(this.$router.options.routes)
      return this.$router.options.routes
    },
    // variables() {
    //   return variables
    // },
    isCollapse() {
      return this.collapse
      // return !this.sidebar.opened
    }
  }
}
</script>
