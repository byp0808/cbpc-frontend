<template>
  <div class="app-container">
    <el-table
      ref="multipleTable"
      :data="overallList.dataList"
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
          {{ scope.row.curvePubType }}
        </template>
      </el-table-column>
      <el-table-column prop="compDate" label="发布日期" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.compDate }}
        </template>
      </el-table-column>
      <el-table-column prop="batchId" label="发布批次" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.batchId }}
        </template>
      </el-table-column>
      <el-table-column prop="rateType" label="利率类型" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ $dft("RATE_TYPE", scope.row.rateType) }}
        </template>
      </el-table-column>
      <el-table-column prop="interestDueFreq" label="付息频率" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ $dft("INTEREST_DUE_FREQ", scope.row.interestDueFreq) }}
        </template>
      </el-table-column>
      <el-table-column prop="curveBuildStatus" label="曲线编制状态" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ $dft("CURVE_BUILD_STATUS", scope.row.curveBuildStatus) }}
        </template>
      </el-table-column>
      <el-table-column prop="assignName" label="责任人" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.assignName }}
        </template>
      </el-table-column>
      <el-table-column prop="reason" label="原因" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.reason }}
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
import { qryCurveComprehensiveQcRpt } from '@/api/curve/curve-quality.js'

export default {
  name: 'CurveComprehensiveQcRpt', // 质检全面性
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
      overallNum: {},
      lockScroll: true,
      multipleSelection: '' // 选择记录
    }
  },
  methods: {
    handleFilter() {
      this.overallList.page.pageNumber = 1
      this.qryCurveComprehensiveQcRpt()
    },
    handleSizeChange(pageSize) {
      this.overallList.page.pageSize = pageSize
      this.qryCurveComprehensiveQcRpt()
    },
    handleCurrentChange(currentPage) {
      this.overallList.page.pageNumber = currentPage
      this.qryCurveComprehensiveQcRpt()
    },
    handleSelectionChange(items) {
      console.info('handleSelectionChange' + JSON.stringify(items))
      this.multipleSelection = items
    },
    qryCurveComprehensiveQcRpt() {
      this.overallList.compDate = this.taskDay
      this.overallList.batchId = this.orderId
      qryCurveComprehensiveQcRpt(this.overallList).then(response => {
        console.info('qryCurveComprehensiveQcRpt.qryCurveComprehensiveQcRpt...')
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
