<template>
  <div class="app-container">
    <div style="margin-bottom: 20px">
      <el-date-picker v-model="curveFTQcRpt.compDate" type="date" placeholder="选择日期" value-format="yyyyMMdd" format="yyyy-MM-dd" />
      <el-select placeholder="B0002">
        <el-option label="B0002" value="B0002" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
    </div>
    <el-table
      ref="multipleTable"
      :data="curveFTQcRpt.dataList"
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
      <el-table-column prop="curveBuildStatus" label="曲线编制状态" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.curveBuildStatus }}
        </template>
      </el-table-column>
      <el-table-column prop="errorMng" label="容错信息" width="100" show-overflow-tooltip>
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
// import { delCurveSample } from '@/api/curve/curve-sample.js'
import { showCodeLabel } from '@/api/curve/code-type.js'

export default {
  name: 'CurveFTQcRpt', // 质检总览
  components: {
  },
  filters: {
    showCodeLabel: showCodeLabel
  },
  data() {
    return {
      curveFTQcRpt: {
        compDate: '',
        batchId: 'B0002',
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
  computed: {
    // qryCurveOverallQcRpt() {
    //   const dataList = qryCurveOverallQcRpt(this.requestData)
    //   if (dataList && dataList.data) {
    //     return dataList.data
    //   }
    //   return dataList
    // }
  },
  beforeMount() {
    // this.qryCurveOverallQcRpt()
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
