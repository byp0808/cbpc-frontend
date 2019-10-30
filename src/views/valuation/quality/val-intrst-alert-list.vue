<template>
  <div class="app-container">
    <el-table
      ref="multipleTable"
      :data="valAccIntrstAlertList.dataList"
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
      <el-table-column prop="intrstPayMthod" label="付息方式" width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ $dft("INT_CAL_MTHD_CODE", scope.row.intrstPayMthod) }}
        </template>
      </el-table-column>
      <el-table-column prop="couponRate" label="票面利率" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.couponRate }}
        </template>
      </el-table-column>
      <el-table-column prop="baseRateKind" label="基准利率种类" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ $dft("BNCHMRK_INT_RATE_CLASS_CODE", scope.row.baseRateKind) }}
        </template>
      </el-table-column>
      <el-table-column prop="tenderRateSpread" label="招标利差" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.tenderRateSpread }}
        </template>
      </el-table-column>
      <el-table-column prop="recentIntrstPayDay" label="最近付息日" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.recentIntrstPayDay }}
        </template>
      </el-table-column>
      <el-table-column prop="t2AccIntrst" label="T-2日应计利息" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.t2AccIntrst }}
        </template>
      </el-table-column>
      <el-table-column prop="t1AccIntrst" label="T-1日应计利息" width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.t1AccIntrst }}
        </template>
      </el-table-column>
      <el-table-column prop="accIntrst" label="T日应计利息" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.accIntrst }}
        </template>
      </el-table-column>
      <el-table-column prop="t1SgldayIntrst" label="T-1日单日利息" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.t1SgldayIntrst }}
        </template>
      </el-table-column>
      <el-table-column prop="tSgldayIntrst" label="T日单日利息" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.tSgldayIntrst }}
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
      :current-page="valAccIntrstAlertList.page.pageNumber"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="valAccIntrstAlertList.page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="valAccIntrstAlertList.page.totalRecord"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { qryValAccIntrstAlertQcRpt } from '@/api/valuation/val-quality.js'

export default {
  name: 'ValAccIntrstAlertList', // 质检总览
  props: ['taskDay', 'orderId'],
  data() {
    return {
      valAccIntrstAlertList: {
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
      this.valAccIntrstAlertList.page.pageNumber = 1
      this.qryValAccIntrstAlertQcRpt()
    },
    handleSizeChange(pageSize) {
      this.valAccIntrstAlertList.page.pageSize = pageSize
      this.qryValAccIntrstAlertQcRpt()
    },
    handleCurrentChange(currentPage) {
      this.valAccIntrstAlertList.page.pageNumber = currentPage
      this.qryValAccIntrstAlertQcRpt()
    },
    handleSelectionChange(items) {
      console.info('handleSelectionChange' + JSON.stringify(items))
      this.multipleSelection = items
    },
    qryValAccIntrstAlertQcRpt() {
      this.valAccIntrstAlertList.compDate = this.taskDay
      this.valAccIntrstAlertList.batchId = this.orderId
      qryValAccIntrstAlertQcRpt(this.valAccIntrstAlertList).then(response => {
        console.info('qryValAccIntrstAlertQcRpt.qryValAccIntrstAlertQcRpt...')
        const { dataList, page } = response
        this.valAccIntrstAlertList.dataList = dataList
        this.valAccIntrstAlertList.page = page
      })
    }
  }
}
</script>

<style scoped>
</style>
