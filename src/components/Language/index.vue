<template>
  <div>
    <svg-icon icon-class="language" @click="click" />
  </div>
</template>

<script>
export default {
  name: 'Language',
  data() {
    return {}
  },
  methods: {
    click() {
      this.$message({
        message: '敬请期待！',
        type: 'success',
        showClose: true
      })
    }
  }
}
</script>

<style scoped>

</style>
