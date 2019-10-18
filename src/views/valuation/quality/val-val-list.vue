<template>
  <div class="app-container">
    <el-table
      ref="multipleTable"
      :data="valValList.dataList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column prop="csin" label="债券代码" width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.csin }}
        </template>
      </el-table-column>
      <el-table-column prop="bondNm" label="债券简称" width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.bondNm }}
        </template>
      </el-table-column>
      <el-table-column prop="market" label="流通场所" width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.market }}
        </template>
      </el-table-column>
      <el-table-column prop="yield" label="今日收益率" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.yield }}
        </template>
      </el-table-column>
      <el-table-column prop="tgtYield" label="昨日收益率" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.tgtYield }}
        </template>
      </el-table-column>
      <el-table-column prop="yieldChg" label="估值偏差值%" width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.yieldChg }}%
        </template>
      </el-table-column>
      <el-table-column prop="netPrc" label="今日净价" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.netPrc }}
        </template>
      </el-table-column>
      <el-table-column prop="tgtNetPric" label="昨日净价" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.tgtNetPric }}
        </template>
      </el-table-column>
      <el-table-column prop="netPricChg" label="净价偏差率%" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.netPricChg }}%
        </template>
      </el-table-column>
      <el-table-column prop="alertRsn" label="报警原因" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.alertRsn }}
        </template>
      </el-table-column>
      <el-table-column prop="curveId" label="操作" width="100" show-overflow-tooltip>
        <template>
          <el-button type="text" size="big">退回单资产估值</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="valValList.page.pageNumber"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="valValList.page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="valValList.page.totalRecord"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { qryValValQcRpt } from '@/api/valuation/val-quality.js'

export default {
  name: 'ValValList', // 质检总览
  props: ['taskDay', 'orderId'],
  data() {
    return {
      valValList: {
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
      this.valValList.page.pageNumber = 1
      this.qryValValQcRpt()
    },
    handleSizeChange(pageSize) {
      this.valValList.page.pageSize = pageSize
      this.qryValValQcRpt()
    },
    handleCurrentChange(currentPage) {
      this.valValList.page.pageNumber = currentPage
      this.qryValValQcRpt()
    },
    handleSelectionChange(items) {
      console.info('handleSelectionChange' + JSON.stringify(items))
      this.multipleSelection = items
    },
    qryValValQcRpt() {
      this.valValList.compDate = this.taskDay
      this.valValList.batchId = this.orderId
      qryValValQcRpt(this.valValList).then(response => {
        console.info('qryValValQcRpt.qryValValQcRpt...')
        const { dataList, page } = response
        this.valValList.dataList = dataList
        this.valValList.page = page
      })
    }
  }
}
</script>

<style scoped>
</style>
