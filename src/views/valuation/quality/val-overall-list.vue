<template>
  <div class="app-container">
    <el-table
      ref="multipleTable"
      :data="overallList.dataList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column prop="bondNm" label="债券简称" width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.bondNm }}
        </template>
      </el-table-column>
      <el-table-column prop="csin" label="债券代码" width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.csin }}
        </template>
      </el-table-column>
      <el-table-column prop="market" label="流通场所" width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.market }}
        </template>
      </el-table-column>
      <el-table-column prop="bondNature" label="债券性质" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.bondNature }}
        </template>
      </el-table-column>
      <el-table-column prop="residualMaturity" label="待偿期" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.residualMaturity }}
        </template>
      </el-table-column>
      <el-table-column prop="qcKind" label="质检类别" width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.qcKind }}
        </template>
      </el-table-column>
      <el-table-column prop="excptRsn" label="异常原因" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.excptRsn }}
        </template>
      </el-table-column>
      <el-table-column prop="bondId" label="操作" width="100" show-overflow-tooltip>
        <template>
          <el-button type="text" size="big">退回单资产估值</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="overallList.page.pageNumber"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="overallList.page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="overallList.page.totalRecord"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { qryOverallQcRpt } from '@/api/valuation/val-quality.js'

export default {
  name: 'ValOverallList', // 质检总览
  props: ['taskDay', 'orderId'],
  data() {
    return {
      overallList: {
        compDate: '',
        batchId: '',
        dataList: [],
        page: {
          pageNumber: 1,
          pageSize: 10
        }
      },
      lockScroll: true,
      multipleSelection: '' // 选择记录
    }
  },
  methods: {
    handleFilter() {
      this.overallList.page.pageNumber = 1
      this.qryOverallQcRpt()
    },
    handleSizeChange(pageSize) {
      this.overallList.page.pageSize = pageSize
      this.qryOverallQcRpt()
    },
    handleCurrentChange(currentPage) {
      this.overallList.page.pageNumber = currentPage
      this.qryOverallQcRpt()
    },
    handleSelectionChange(items) {
      console.info('handleSelectionChange' + JSON.stringify(items))
      this.multipleSelection = items
    },
    qryOverallQcRpt() {
      this.overallList.compDate = this.taskDay
      this.overallList.batchId = this.orderId
      qryOverallQcRpt(this.overallList).then(response => {
        console.info('qryOverallQcRpt.qryOverallQcRpt...')
        const { dataList, page } = response
        this.overallList.dataList = dataList
        this.overallList.page = page
      })
    }
  }
}
</script>

<style scoped>
</style>
