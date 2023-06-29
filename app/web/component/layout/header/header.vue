<template>
  <div>
    <header class="header">
      <div class="top-left-bar">
        <a href="https://xbase.daxiangyun.com" target="_blank" rel="noopener noreferrer">
          <img src="@/asset/images/dxy_logo.png" alt="" srcset="" />
        </a>
      </div>
      <div class="right">
        <span>{{ name }}</span>

        <span title="退出登录" class="login-out" @click="loginOut"><a-icon type="logout" /></span>
      </div>
    </header>
  </div>
</template>
<script type="babel">
export default {
computed:{
  name(){
    const name = localStorage.getItem('username') || ''
    return name ? name.split('"').join('') : '-'
  }
},
methods:{
  loginOut(){
    this.$message.success('退出登录成功');
    window.localStorage.clear()
    this.$router.push({ path: '/login' })
  }
}
};
</script>
<style lang="less" scoped>
.login-out {
  margin-left: 20px;
  cursor: pointer;
  &:hover {
    color: #ff7875;
  }
}
.header {
  height: 64px;
  background: linear-gradient(135deg, #0e80e7 0%, #27b5a2 100%);
}
.top-left-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  img {
    width: 110px;
    height: auto;
  }
}
.header {
  width: 100%;
  display: flex;
  align-items: center;
}
.header .top-left-bar {
  width: 230px;
  text-align: center;
  color: #fff;
  -webkit-transition: width 0.35s;
  transition: width 0.35s;
  font-size: 14px;
}

.header .right {
  position: absolute;
  right: 50px;
  color: #fff;
  font-weight: bold;
  font-size: 18px;
}

.header .header-btn {
  overflow: hidden;
  display: inline-block;
  text-align: center;
  cursor: pointer;
  padding: 0 14px;
  color: #fff;
}

.menu {
  border-right: none;
}
</style>
