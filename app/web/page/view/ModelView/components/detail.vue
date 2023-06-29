<template>

  <textarea id="textarea" readonly="readonly" v-model="model" rows="20"></textarea>
</template>
<style lang="less" scoped>
#textarea {
  width: 100% !important;
  border: none;
}
</style>
<script>
export default {
  data() {
    return {}
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    tempItem: {
      type: Object,
      default: () => ({})
    },
    title: {
      type: String,
      default: '转换'
    }
  },
  computed: {
    model() {
      return JSON.stringify(this.tempItem, null, 4)
    }
  }
}
</script>
