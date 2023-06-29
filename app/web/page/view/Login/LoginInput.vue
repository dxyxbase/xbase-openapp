<template>
  <div class="login-input">
    <span class="label">{{ label }}：</span>
    <input class="input" :placeholder="placeholder" v-bind="$attrs" v-bind:value="value" v-on="inputListeners" />
  </div>
</template>

<script>
export default {
  name: 'LoginInput',
  inheritAttrs: false,
  props: ['label', 'value', 'placeholder'],
  computed: {
    inputListeners: function () {
      const vm = this
      return Object.assign({}, this.$listeners, {
        input: function (event) {
          vm.$emit('input', event.target.value)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
input::placeholder {
  color: rgba(0, 0, 0, 0.6);
}
.login-input {
  height: 56px;
  font-size: 18px;
  padding: 10px 24px;
  background: rgba(50, 61, 137, 0.3);
  border: 1px solid #3c5bd0;
  display: flex;
  align-items: center;

  .label {
    font-weight: 400;
    color: #000;
    min-width: 84px;
  }

  .input {
    background: transparent;
    outline: none;
    border: none;
    color: #000;
    padding: 20px;
  }
}
</style>
