<template>
  <div>
    <h4 class="text-center">{{ name }}</h4>
    <el-table :data="list" size="mini" :fit="false" class="no-hover-row" @cell-click="selectHomology">
      <el-table-column label="期限" width="56" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.curveName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所选券" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.bondName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所选券期限" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.selectKt }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所选收益率" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.yield }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所选偏差值" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.curveName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="同调">
        <template slot-scope="{ row }">
          <span>{{ row.curveName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="调整理由">
        <template slot-scope="{ row }">
          <span>{{ row.curveName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="调整幅度" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.curveName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="昨天收益率" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.curveName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="调整结果" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.curveName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="期限间变动" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.curveName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所选字段">
        <template slot-scope="{ row }">
          <span>{{ row.curveName }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="show" label="历史分位点">
        <template slot-scope="{ row }">
          <span>{{ row.curveName }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    },
    name: {
      type: String,
      default: ''
    },
    edit: {
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    selectHomology(row, column, cell, event) {
      if (column.label === '同调') {
        console.log(row, column)
      }
    }
  }
}
</script>

<style scoped>

</style>
