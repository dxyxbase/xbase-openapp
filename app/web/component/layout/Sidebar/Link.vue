<template>
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>
// import { isExternal } from '@/utils/validate'

export default {
  props: {
    to: {
      type: String,
      required: true,
    },
  },
  computed: {
    type() {
      if (this.isExternal) {
        return 'a'
      }
      return 'router-link'
    },
  },
  methods: {
    isExternal(path) {
      return /^(https?:|mailto:|tel:)/.test(path)
    },
    linkProps(to) {
      if (this.isExternal(this.to)) {
        return {
          href: to,
          target: '_blank',
          rel: 'noopener',
        }
      }
      return {
        to: to,
      }
    },
  },
}
</script>
