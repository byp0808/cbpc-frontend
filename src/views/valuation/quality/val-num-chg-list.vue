<template>
  <div class="app-container">
    <el-table
      ref="multipleTable"
      :data="valNumChgList.dataList"
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
          {{ $dft("EXCHNG", scope.row.market) }}
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
      <el-table-column prop="intrstPayMthod" label="付息方式" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.intrstPayMthod }}
        </template>
      </el-table-column>
      <el-table-column prop="optionEmbedIncd" label="是否含权" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.optionEmbedIncd }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.status }}
        </template>
      </el-table-column>
      <el-table-column prop="excptRsn" label="原因" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.excptRsn }}
        </template>
      </el-table-column>
      <el-table-column prop="curveId" label="操作" width="100" show-overflow-tooltip>
        <template>
          <el-button type="text" size="big">退回单资产估值</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="valNumChgList.page.pageNumber"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="valNumChgList.page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="valNumChgList.page.totalRecord"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { qryValNumChgQcRpt } from '@/api/valuation/val-quality.js'

export default {
  name: 'ValNumChgList', // 质检总览
  props: ['taskDay', 'orderId', 'bondId'],
  data() {
    return {
      valNumChgList: {
        compDate: '',
        batchId: '',
        bondId: '',
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
  beforeMount() {
    this.qryValNumChgQcRpt()
  },
  methods: {
    handleFilter() {
      this.valNumChgList.page.pageNumber = 1
      this.qryValNumChgQcRpt()
    },
    handleSizeChange(pageSize) {
      this.valNumChgList.page.pageSize = pageSize
      this.qryValNumChgQcRpt()
    },
    handleCurrentChange(currentPage) {
      this.valNumChgList.page.pageNumber = currentPage
      this.qryValNumChgQcRpt()
    },
    handleSelectionChange(items) {
      console.info('handleSelectionChange' + JSON.stringify(items))
      this.multipleSelection = items
    },
    qryValNumChgQcRpt() {
      this.valNumChgList.compDate = this.taskDay
      this.valNumChgList.batchId = this.orderId
      this.valNumChgList.bondId = this.bondId
      qryValNumChgQcRpt(this.valNumChgList).then(response => {
        console.info('qryValNumChgQcRpt.qryValNumChgQcRpt...')
        const { dataList, page } = response
        this.valNumChgList.dataList = dataList
        this.valNumChgList.page = page
      })
    }
  }
}
</script>

<style scoped>
</style>
