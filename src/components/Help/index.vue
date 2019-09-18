<template>
  <div>
    <svg-icon icon-class="help" @click="click" />
    <a ref="readmeDownload" style="display: none" href="/readme/readme.zip" download="帮助文档" />
  </div>
</template>

<script>
export default {
  name: 'Help',
  data() {
    return {}
  },
  methods: {
    click() {
      this.$refs.readmeDownload.click()
    }
  }
}
</script>

<style scoped>

</style>
