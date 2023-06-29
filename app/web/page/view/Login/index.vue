<template>
  <div class="page-login">
    <div class="form-container">
      <h1 class="title">X-Base 微服务示例</h1>
      <div class="form">
        <login-input label="用户名" placeholder="输入任意名称" class="username" v-model="username" />
        <login-input label="密码" placeholder="输入任意密码" type="password" class="password" v-model="password" />
        <a-button :disabled="!username || !password" @click="login" :loading="loading" type="primary" class="login-btn">登录</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import LoginInput from './LoginInput'
import store from '@/page/store'
import { SET_TOKEN } from '@/page/store/mutation-type'
export default {
  name: 'Login',
  components: { LoginInput },
  data() {
    return {
      username: 'xbase-demo',
      password: 'xbase-demo',
      loading: false
    }
  },
  mounted() {},
  watch: {},
  methods: {
    async login() {
      this.loading = true
      try {
        await store().dispatch(SET_TOKEN, {
          username: this.username,
          password: this.password
        })
      } catch (err) {
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.page-login {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background: url(~@/asset/images/loginbgi.png) center/cover no-repeat;

  .form-container {
    position: relative;
    width: 600px;
    height: 400px;
    margin-right: 300px;
    background-color: rgba(0, 0, 0, 0.2);
  }

  .title {
    font-size: 34px;
    color: #000;
    font-weight: 600;
    text-align: center;
    margin-top: 21px;
    margin-bottom: 0;
  }

  .form {
    width: 458px;
    margin: 40px auto 0;

    .username {
      margin-bottom: 20px;
    }

    .password {
      margin-bottom: 50px;
    }

    .login-btn {
      height: 66px;
      font-size: 22px;
      font-weight: 600;
      border: none;
      display: block;
      width: 100%;
      color: #000;
    }
  }
}
</style>
