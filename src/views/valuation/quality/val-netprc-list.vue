<template>
  <div class="app-container">
    <el-table
      ref="multipleTable"
      :data="valNetPrcList.dataList"
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
      <el-table-column prop="netPricChg" label="估值偏差率%" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.netPricChg }}%
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
      <el-table-column prop="yieldChg" label="收益率偏差值%" width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.yieldChg }}%
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
      :current-page="valNetPrcList.page.pageNumber"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="valNetPrcList.page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="valNetPrcList.page.totalRecord"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { qryValNetPrcQcRpt } from '@/api/valuation/val-quality.js'

export default {
  name: 'ValNetPrcList', // 质检总览
  props: ['taskDay', 'orderId'],
  data() {
    return {
      valNetPrcList: {
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
      this.valNetPrcList.page.pageNumber = 1
      this.qryValNetPrcQcRpt()
    },
    handleSizeChange(pageSize) {
      this.valNetPrcList.page.pageSize = pageSize
      this.qryValNetPrcQcRpt()
    },
    handleCurrentChange(currentPage) {
      this.valNetPrcList.page.pageNumber = currentPage
      this.qryValNetPrcQcRpt()
    },
    handleSelectionChange(items) {
      console.info('handleSelectionChange' + JSON.stringify(items))
      this.multipleSelection = items
    },
    qryValNetPrcQcRpt() {
      this.valNetPrcList.compDate = this.taskDay
      this.valNetPrcList.batchId = this.orderId
      qryValNetPrcQcRpt(this.valNetPrcList).then(response => {
        console.info('qryValNetPrcQcRpt.qryValNetPrcQcRpt...')
        const { dataList, page } = response
        this.valNetPrcList.dataList = dataList
        this.valNetPrcList.page = page
      })
    }
  }
}
</script>

<style scoped>
</style>
