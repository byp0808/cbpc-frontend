<template>
  <el-table-column :label="column.label" align="center" :class-name="column.className">
    <span slot-scope="{ row }" :class="(0 + row[column.prop]) > 0 ? '' : 'red'">
      {{ row[column.prop] }}
    </span>
  </el-table-column>
</template>

<script>
export default {
  props: {
    column: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style scoped>
.red {
  color: #ff0000;
}
</style>
