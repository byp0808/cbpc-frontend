<template>
  <div class="box">
    <el-table
      :data="allList"
      style="width: 100%"
      max-height="280"
      :header-cell-style="{background:'#f6f6f6'}"
      tooltip-effect="dark"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" label="全选" type="selection" />
      <el-table-column label="优先" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.priority | priorityFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.taskStatus | taskStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column label="原因" align="center">
        <template slot-scope="scope">
          <span>{{ causeFilter(scope.row.cause) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="进入日期" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.filterId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.lastUpdBy }}</span>
        </template>
      </el-table-column>
      <el-table-column label="债券代码" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bondId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="债券简称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bondShort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="场所" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.maketId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="债券性质" align="center">
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
          <span>{{ scope.row.filterId }}</span>
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
      <el-table-column label="总点差（变动）" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.filterId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="估值收益率" align="center" width="110px">
        <template slot-scope="scope">
          <span>{{ scope.row.yield }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否即期" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.filterId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布批次" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.filterId }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <!-- <el-pagination
        style="margin-top:20px"
        align="center"
        :current-page="page.pageNumber"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.totalRecord"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      /> -->
    </div>
  </div>
</template>
<script>

export default {
  name: 'AssetList',
  components: {

  },
  props: {
    allList: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  //   props: ['allList'],
  data() {
    return {
      ruleSetFormVisible: false,
      taskRangeId: '',
      selectionList: [],
      list: [],
      tabHeight: '',
      page: {
        pageNumber: 1,
        pageSize: 10,
        totalRecord: 0
      }
    }
  },
  methods: {
    // load() {

    // },
    causeFilter(params) {
      switch (params) {
        case '01': return '新券'
        case '02': return '评级下降'
        case '03': return '盯市'
        case '04': return '信用事件'
        case '05': return '客户投诉'
        case '06': return '评级上升'
        case '07': return '巡检'
        case '08': return '其他'
      }
    },
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
    // handleSizeChange(pageSize) {
    //   this.page.pageSize = pageSize
    //   this.load()
    // },
    // handleCurrentChange(currentPage) {
    //   this.page.pageNumber = currentPage
    //   this.load()
    // }
  }
}
</script>

<style scoped>
 .box {
     margin-top: 10px;
 }
</style>
