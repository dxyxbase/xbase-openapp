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
  height: 101%;
  overflow-y: scroll;
  overflow-x: hidden;
}
.menus::-webkit-scrollbar {
    width:6px;
    height:60px;
}
.menus::-webkit-scrollbar-thumb {
    width:6px;
    height:60px;
    background-color: #DBDBDB;
    border-radius: 3px;
}
.menus::-webkit-scrollbar-thumb:hover {
    background-color: #AAAAAA;
    cursor: pointer;
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
<style lang="less" scoped>
@import '~@/style/variables.less';
::v-deep .el-submenu.is-active {
  > .el-submenu__title {
    color: @menuActiveText !important;
  }
}
::v-deep .el-menu-item,
::v-deep .el-submenu__title {
  height: 48px;
  line-height: 48px;
}
</style>
