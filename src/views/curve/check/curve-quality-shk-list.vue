<template>
  <div class="app-container">
    <div style="margin-bottom: 20px">
      <el-select v-model="shkQcRptList.refObjCd">
        <el-option label="上一批次" value="01" />
        <el-option label="昨日日终批次" value="02" />
      </el-select>
    </div>
    <el-table
      ref="multipleTable"
      :data="shkQcRptList.dataList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column prop="curveId" label="曲线编号" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.curveId }}
        </template>
      </el-table-column>
      <el-table-column prop="productName" label="曲线名称" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.productName }}
        </template>
      </el-table-column>
      <el-table-column prop="curvePubType" label="曲线类型" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ $dft("CURVE_BUILD_TYPE", scope.row.curvePubType) }}
        </template>
      </el-table-column>
      <el-table-column prop="keyTerm" label="关键期限" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.keyTerm }}
        </template>
      </el-table-column>
      <el-table-column prop="keyTermYield" label="本批次收益率" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.keyTermYield }}
        </template>
      </el-table-column>
      <el-table-column prop="tgtKeyTermYield" label="目标批次收益率" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.tgtKeyTermYield }}
        </template>
      </el-table-column>
      <el-table-column prop="yieldChgBp" label="收益率差值(bp)" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.yieldChgBp }}
        </template>
      </el-table-column>
      <el-table-column prop="yieldChgPercent" label="收益率差值(%)" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.yieldChgPercent }}
        </template>
      </el-table-column>
      <el-table-column prop="reason" label="调整理由" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.reason }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="shkQcRptList.page.pageNumber"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="shkQcRptList.page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="shkQcRptList.page.totalRecord"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { qryCurveShkQcRpt } from '@/api/curve/curve-quality.js'

export default {
  name: 'CurveShkQcRpt', // 质检总览
  props: ['taskDay', 'orderId', 'curveId'],
  data() {
    return {
      shkQcRptList: {
        compDate: '',
        refObjCd: '02',
        batchId: '',
        curveId: '',
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
    this.qryCurveShkQcRpt()
  },
  methods: {
    handleFilter() {
      this.shkQcRptList.page.pageNumber = 1
      this.qryCurveShkQcRpt()
    },
    handleSizeChange(pageSize) {
      this.shkQcRptList.page.pageSize = pageSize
      this.qryCurveShkQcRpt()
    },
    handleCurrentChange(currentPage) {
      this.shkQcRptList.page.pageNumber = currentPage
      this.qryCurveShkQcRpt()
    },
    handleSelectionChange(items) {
      console.info('handleSelectionChange' + JSON.stringify(items))
      this.multipleSelection = items
    },
    qryCurveShkQcRpt() {
      this.shkQcRptList.compDate = this.taskDay
      this.shkQcRptList.batchId = this.orderId
      this.shkQcRptList.curveId = this.curveId
      qryCurveShkQcRpt(this.shkQcRptList).then(response => {
        console.info('qryCurveShkQcRpt.qryCurveShkQcRpt...')
        const { dataList, page } = response
        this.shkQcRptList.dataList = dataList
        this.shkQcRptList.page = page
      })
    }
  }
}
</script>

<style scoped>
</style>
