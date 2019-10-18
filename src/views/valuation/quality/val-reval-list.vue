<template>
  <div class="app-container">
    <el-table
      ref="multipleTable"
      :data="reValList.dataList"
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
      <el-table-column prop="market" label="场所编号" width="80" show-overflow-tooltip>
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
      :current-page="reValList.page.pageNumber"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="reValList.page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="reValList.page.totalRecord"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { qryReValQcRpt } from '@/api/valuation/val-quality.js'

export default {
  name: 'ReValList', // 质检总览
  props: ['taskDay', 'orderId'],
  data() {
    return {
      reValList: {
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
      this.reValList.page.pageNumber = 1
      this.qryReValQcRpt()
    },
    handleSizeChange(pageSize) {
      this.reValList.page.pageSize = pageSize
      this.qryReValQcRpt()
    },
    handleCurrentChange(currentPage) {
      this.reValList.page.pageNumber = currentPage
      this.qryReValQcRpt()
    },
    handleSelectionChange(items) {
      console.info('handleSelectionChange' + JSON.stringify(items))
      this.multipleSelection = items
    },
    qryReValQcRpt() {
      this.reValList.compDate = this.taskDay
      this.reValList.batchId = this.orderId
      qryReValQcRpt(this.reValList).then(response => {
        console.info('qryReValQcRpt.qryReValQcRpt...')
        const { dataList, page } = response
        this.reValList.dataList = dataList
        this.reValList.page = page
      })
    }
  }
}
</script>

<style scoped>
</style>
