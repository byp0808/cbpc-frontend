<template>
  <div class="box">
    <div>
      <el-table
        :data="peopleValuationList"
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
            <span>{{ scope.row.cptDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="估值批次" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.batchId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作人" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.lastUpdBy }}</span>
          </template>
        </el-table-column>
        <el-table-column label="债券简称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.bondId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="债券代码" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.CSIN }}</span>
          </template>
        </el-table-column>
        <el-table-column label="日间估价全价（元）" align="center" width="160px">
          <template slot-scope="scope">
            <span>{{ scope.row.indexResult.fullPriceInterDay }}</span>
          </template>
        </el-table-column>
        <el-table-column label="日间应计利息（元）" align="center" width="160px">
          <template slot-scope="scope">
            <span>{{ scope.row.indexResult.accruedInterestInterDay }}</span>
          </template>
        </el-table-column>
        <el-table-column label="估价净价（元）" align="center" width="160px">
          <template slot-scope="scope">
            <span>{{ scope.row.indexResult.netPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column label="估价收益率（%）" align="center" width="160px">
          <template slot-scope="scope">
            <span>{{ scope.row.indexResult.yield }}</span>
          </template>
        </el-table-column>
        <el-table-column label="日终估价全价（元）" align="center" width="160px">
          <template slot-scope="scope">
            <span>{{ scope.row.indexResult.fullPriceEndDay }}</span>
          </template>
        </el-table-column>
        <el-table-column label="日终应计利息（元）" align="center" width="160px">
          <template slot-scope="scope">
            <span>{{ scope.row.indexResult.accruedInterestEndDay }}</span>
          </template>
        </el-table-column>
        <el-table-column label="可信度" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.reliability }}</span>
          </template>
        </el-table-column>
        <el-table-column label="长/短" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.resultDirection }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>

export default {
  name: 'PeopleList',
  components: {

  },
  data() {
    return {
      ruleSetFormVisible: false,
      taskRangeId: '',
      selectionList: [],
      list: []
    }
  },
  computed: {
    // 人工估值列表
    peopleValuationList: {
      get() {
        return this.$store.state.queryValuationScheme.peopleValuationList
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
