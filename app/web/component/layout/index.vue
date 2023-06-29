<template>
  <div class="main admin" v-if="$route.path !== '/login'">
    <LayoutHeader @sidebarToggle="sidebarToggle"></LayoutHeader>
    <div class="section">
      <div class="LeftMenu"><LeftMenu :collapse="collapse"></LeftMenu></div>
      <div class="LayoutContent">
        <LayoutContent>
          <div slot="content"><slot name="main"></slot></div>
        </LayoutContent>
      </div>
    </div>
  </div>
  <div class="main admin" v-else>
    <LayoutContent>
      <div slot="content"><slot name="main"></slot></div>
    </LayoutContent>
  </div>
</template>
<style>
@import '../../asset/css/global.less';
</style>
<script type="babel">
import LeftMenu from "./Sidebar/index.vue";
import LayoutHeader from './header/header';
import LayoutContent from './content/content';

export default {
  components: {
    LayoutHeader,
    LayoutContent,
     LeftMenu
  },
  data(){
return {
  collapse:false
}
  },
  methods:{
    sidebarToggle(e){
      this.collapse = e
    }
  }
};
</script>
<style lang="less" scoped>
.main.admin {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  .section {
    height: 0;
    overflow: hidden;
    flex-grow: 1;
    display: flex;
    gap: 12px;
    .LeftMenu {
      width: 200px;
    }
    .LayoutContent {
      width: 0;
      overflow: hidden;
      flex-grow: 1;
    }
  }
}
.main {
  display: flex;
  box-sizing: border-box;
}
.main .el-menu:not(.el-menu--collapse) {
  width: 200px;
}

.admin .search {
  margin-top: 8px;
  margin-bottom: 16px;
}
.admin label {
  padding-left: 8px;
  padding-right: 8px;
  color: #878d99;
}

.admin .search-input {
  max-width: 200px;
}
.admin .search-button {
  margin-left: 16px;
}
.admin .add-button {
  float: right;
  margin-right: 16px;
}

.admin .long-input {
  max-width: 75%;
}

.admin .top16 {
  margin-top: 16px;
}
</style>
