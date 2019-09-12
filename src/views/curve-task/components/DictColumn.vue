<template>
  <span>{{ makeValue }}</span>
</template>

<script>
export default {
  props: {
    dictName: {
      type: String,
      default: ''
    },
    columnData: {
      type: String,
      default: ''
    }
  },
  computed: {
    makeValue() {
      const _dict = this.$store.state.app.dict[this.name]
      return _dict[this.columnData]
    }
  }
}
</script>

<style scoped>

</style>
