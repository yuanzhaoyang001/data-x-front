<template>
  <div
    class="docs-content-body"
    v-html="content"
  />
</template>

<script>
export default {
  name: "DescText",
  props: {
    content: {
      type: String,
      default: ""
    }
  },
  methods: {}
};
</script>

<style lang="scss">
.docs-content-body {
  img {
    max-width: 100%;
  }
}
</style>
