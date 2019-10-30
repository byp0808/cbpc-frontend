<template>
  <div class="app-container">
    <el-table
      ref="multipleTable"
      :data="curveFTQcRpt.dataList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column prop="curveId" label="曲线编号" width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.curveId }}
        </template>
      </el-table-column>
      <el-table-column prop="productName" label="曲线名称" width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.productName }}
        </template>
      </el-table-column>
      <el-table-column prop="curveBuildStatus" label="曲线编制状态" width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ $dft("CURVE_BUILD_STATUS", scope.row.curveBuildStatus) }}
        </template>
      </el-table-column>
      <el-table-column prop="errorMng" label="异常原因" width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.errorMng }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="curveFTQcRpt.page.pageNumber"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="curveFTQcRpt.page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="curveFTQcRpt.page.totalRecord"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { qryCurveFTQcRpt } from '@/api/curve/curve-quality.js'

export default {
  name: 'CurveFTQcRpt', // 质检总览
  props: ['taskDay', 'orderId', 'curveId'],
  data() {
    return {
      curveFTQcRpt: {
        compDate: '',
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
    this.qryCurveFTQcRpt()
  },
  methods: {
    handleFilter() {
      this.curveFTQcRpt.page.pageNumber = 1
      this.qryCurveFTQcRpt()
    },
    handleSizeChange(pageSize) {
      this.curveFTQcRpt.page.pageSize = pageSize
      this.qryCurveFTQcRpt()
    },
    handleCurrentChange(currentPage) {
      this.curveFTQcRpt.page.pageNumber = currentPage
      this.qryCurveFTQcRpt()
    },
    handleSelectionChange(items) {
      console.info('handleSelectionChange' + JSON.stringify(items))
      this.multipleSelection = items
    },
    qryCurveFTQcRpt() {
      this.curveFTQcRpt.compDate = this.taskDay
      this.curveFTQcRpt.batchId = this.orderId
      this.curveFTQcRpt.curveId = this.curveId
      qryCurveFTQcRpt(this.curveFTQcRpt).then(response => {
        console.info('qryCurveFTQcRpt.qryCurveFTQcRpt...')
        const { dataList, page } = response
        this.curveFTQcRpt.dataList = dataList
        this.curveFTQcRpt.page = page
      })
    }
  }
}
</script>

<style scoped>
</style>
