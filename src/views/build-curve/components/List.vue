<template>
  <el-table :data="data" size="mini" border>
    <template v-for="col in columns">
      <slot :name="col.slot">
        <component
          :is="col.component"
          v-if="col.component"
          :column="col"
        />
        <el-table-column v-else v-bind="col" />
      </slot>
    </template>
  </el-table>
</template>

<script>
export default {
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style scoped>

</style>
