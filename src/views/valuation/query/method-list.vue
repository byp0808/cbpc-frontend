<template>
  <div class="box">
    <div>
      <el-table
        :data="valuationSchemeList"
        max-height="300"
        style="width: 100%"
        :header-cell-style="{background:'#f6f6f6'}"
        tooltip-effect="dark"
        border
        fit
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" label="全选" type="selection" />
        <el-table-column label="估值日期" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.batchDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="估值批次" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.batchId }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="updateBy"
          label="操作人"
          align="center"
        />
        <el-table-column label="债券简称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.bondId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="债券代码" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.csin }}</span>
          </template>
        </el-table-column>
        <el-table-column label="流通场所" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.market }}</span>
          </template>
        </el-table-column>
        <el-table-column label="债券性质" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.filterId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="估值方法" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.filterId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="隐含评级" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.marketGrade }}</span>
          </template>
        </el-table-column>
        <el-table-column label="目标曲线" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.curveId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="信用点差" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.spreadValue }}</span>
          </template>
        </el-table-column>
        <el-table-column label="相对点差" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.relaSpread }}</span>
          </template>
        </el-table-column>
        <el-table-column label="流动性点差" align="center" width="110px">
          <template slot-scope="scope">
            <span>{{ scope.row.flAdjValue }}</span>
          </template>
        </el-table-column>
        <el-table-column label="其他点差" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.otAdjValue }}</span>
          </template>
        </el-table-column>
        <el-table-column label="总点差" align="center" width="120px">
          <template slot-scope="scope">
            <span>{{ scope.row.sumSpread }}</span>
          </template>
        </el-table-column>
        <el-table-column label="估值收益率" align="center" width="110px">
          <template slot-scope="scope">
            <span>{{ scope.row.yield }}</span>
          </template>
        </el-table-column>
        <el-table-column label="回收率" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.recovery }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>

export default {
  name: 'MethodList',
  components: {

  },
  data() {
    return {
      selectionList: [],
      list: []
    }
  },
  computed: {
    valuationSchemeList: {
      get() {
        return this.$store.state.queryValuationScheme.valuationSchemeList
      }
    }
  },
  methods: {
    handleSelectionChange(val) {
      if (val.length > 0) {
        val.map(v => {
          this.selectionList.push(v.id)
        })
        this.selectionList = Array.from(new Set(this.selectionList))
        this.$emit('selectionList', this.selectionList)
      } else {
        this.selectionList = []
      }
    }
  }
}
</script>

<style scoped>
 .box {
     margin-top: 10px;
 }
</style>
