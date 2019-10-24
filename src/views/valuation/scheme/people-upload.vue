<template>
  <div class="box">
    <div>
      <el-table
        :data="allList"
        style="width: 100%"
        max-height="300"
        tooltip-effect="dark"
        border
        :header-cell-style="{background:'#f6f6f6'}"
        fit
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" type="selection" />
        <el-table-column prop="filterId" label="日期" align="center" />
        <el-table-column prop="lastUpdBy" label="操作人" align="center" />
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
        <el-table-column label="日间估价全价（元）" align="center" width="160px">
          <template slot-scope="scope">
            <span>{{ scope.row.fullPriceInterDay }}</span>
          </template>
        </el-table-column>
        <el-table-column label="日间应计利息（元）" align="center" width="160px">
          <template slot-scope="scope">
            <span>{{ scope.row.accruedInterestInterDay }}</span>
          </template>
        </el-table-column>
        <el-table-column label="估价净价（元）" align="center" width="160px">
          <template slot-scope="scope">
            <span>{{ scope.row.netPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column label="估价收益率（%）" align="center" width="160px">
          <template slot-scope="scope">
            <span>{{ scope.row.yield }}</span>
          </template>
        </el-table-column>
        <el-table-column label="日终估价全价（元）" align="center" width="160px">
          <template slot-scope="scope">
            <span>{{ scope.row.fullPriceEndDay }}</span>
          </template>
        </el-table-column>
        <el-table-column label="日终应计利息（元）" align="center" width="160px">
          <template slot-scope="scope">
            <span>{{ scope.row.accruedInterestEndDay }}</span>
          </template>
        </el-table-column>
        <el-table-column label="可信度" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.reliability }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <div>
      <el-pagination
        align="center"
        :current-page="page.pageNumber"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.totalRecord"
        style="margin-top:20px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div> -->
  </div>
</template>
<script>

export default {
  name: 'PeopleUpload',
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
  data() {
    return {
      selectionList: [],
      taskList: []
    }
  },
  methods: {
    handleSelectionChange(val) {
      if (val.length > 0) {
        val.map(v => {
          this.selectionList.push(v.id)
          // this.taskList.push({ bondId: v.bondId })
        })
        this.selectionList = Array.from(new Set(this.selectionList))
        this.$emit('selectionList', this.selectionList)
        this.$emit('taskList', val)
      } else {
        this.selectionList = []
        this.taskList = []
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
