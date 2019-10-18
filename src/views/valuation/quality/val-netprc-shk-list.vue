<template>
  <div class="app-container">
    <el-table
      ref="multipleTable"
      :data="valNetPrcShkList.dataList"
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
      <el-table-column prop="netPric" label="当日估值净价" width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.netPric }}
        </template>
      </el-table-column>
      <el-table-column prop="tgtNetPric" label="上一日估值净价" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.tgtNetPric }}
        </template>
      </el-table-column>
      <el-table-column prop="netPricChg" label="变动比率" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.netPricChg }}%
        </template>
      </el-table-column>
      <el-table-column prop="exptIncd" label="是否异常" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.exptIncd }}
        </template>
      </el-table-column>
      <el-table-column prop="valShkRsn" label="估值波动原因" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.valShkRsn }}
        </template>
      </el-table-column>
      <el-table-column prop="basicInfoChg" label="基本资料表变动" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.basicInfoChg }}
        </template>
      </el-table-column>
      <el-table-column prop="intrstPeriodChg" label="计息期次变动" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.intrstPeriodChg }}
        </template>
      </el-table-column>
      <el-table-column prop="optionChg" label="选择权变动" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.optionChg }}
        </template>
      </el-table-column>
      <el-table-column prop="currDayPayPricpl" label="当日兑付本金值" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.currDayPayPricpl }}
        </template>
      </el-table-column>
      <el-table-column prop="vestDayIncd" label="行权日标识" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.vestDayIncd }}
        </template>
      </el-table-column>
      <el-table-column prop="rateResetInfo" label="利率重置信息" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.rateResetInfo }}
        </template>
      </el-table-column>
      <el-table-column prop="yieldChg" label="收益率变动" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.yieldChg }}
        </template>
      </el-table-column>
      <el-table-column prop="bondStock" label="债券存量_财汇" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.bondStock }}
        </template>
      </el-table-column>
      <el-table-column prop="advPayIncd" label="提前兑付标识" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.advPayIncd }}
        </template>
      </el-table-column>
      <el-table-column prop="advPayDate" label="提前兑付日期" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.advPayDate }}
        </template>
      </el-table-column>
      <el-table-column prop="intrstPayRuleChg" label="付息规则变动情况" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.intrstPayRuleChg }}
        </template>
      </el-table-column>
      <el-table-column prop="judge" label="判断人" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.judge }}
        </template>
      </el-table-column>
      <el-table-column prop="excptRsn" label="异常原因" width="100" show-overflow-tooltip>
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
      :current-page="valNetPrcShkList.page.pageNumber"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="valNetPrcShkList.page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="valNetPrcShkList.page.totalRecord"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { qryValNetPrcShkQcRpt } from '@/api/valuation/val-quality.js'

export default {
  name: 'ValNetPrcShkList', // 质检总览
  props: ['taskDay', 'orderId'],
  data() {
    return {
      valNetPrcShkList: {
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
      this.valNetPrcShkList.page.pageNumber = 1
      this.qryValNetPrcShkQcRpt()
    },
    handleSizeChange(pageSize) {
      this.valNetPrcShkList.page.pageSize = pageSize
      this.qryValNetPrcShkQcRpt()
    },
    handleCurrentChange(currentPage) {
      this.valNetPrcShkList.page.pageNumber = currentPage
      this.qryValNetPrcShkQcRpt()
    },
    handleSelectionChange(items) {
      console.info('handleSelectionChange' + JSON.stringify(items))
      this.multipleSelection = items
    },
    qryValNetPrcShkQcRpt() {
      this.valNetPrcShkList.compDate = this.taskDay
      this.valNetPrcShkList.batchId = this.orderId
      qryValNetPrcShkQcRpt(this.valNetPrcShkList).then(response => {
        console.info('qryValNetPrcShkQcRpt.qryValNetPrcShkQcRpt...')
        const { dataList, page } = response
        this.valNetPrcShkList.dataList = dataList
        this.valNetPrcShkList.page = page
      })
    }
  }
}
</script>

<style scoped>
</style>
