<template>
  <div class="main-content">
    <div class="main-container">
      <router-view></router-view>
    </div>
  </div>
</template>
<style lang="less" scoped>
.main .main-content {
  width: 100%;
  height: 100%;
  -webkit-transition: margin-left 0.35s;
  transition: margin-left 0.35s;
}
.main .main-container {
  width: 100%;
  height: 100%;
}
</style>
<script type="babel">
export default {
  name:'v-content',
  data(){
    return {

    }
  },
  components: {},
  mounted() {

  }
};
</script>
