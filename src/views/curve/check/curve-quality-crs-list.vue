<template>
  <div class="app-container">
    <div style="margin-bottom: 20px">
      <el-date-picker v-model="crsQcRptList.compDate" type="date" placeholder="选择日期" value-format="yyyyMMdd" format="yyyy-MM-dd" />
      <el-select placeholder="B0002">
        <el-option v-model="crsQcRptList.batchId" label="B0002" value="B0002" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
    </div>
    <el-table
      ref="multipleTable"
      :data="crsQcRptList.dataList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column prop="curveId" label="曲线编号" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.curveId }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="crsQcRptList.page.pageNumber"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="crsQcRptList.page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="crsQcRptList.page.totalRecord"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { qryCurveCrsQcRpt } from '@/api/curve/curve-quality.js'
// import { delCurveSample } from '@/api/curve/curve-sample.js'
import { showCodeLabel } from '@/api/curve/code-type.js'

export default {
  name: 'CurveCrsQcRpt', // 质检总览
  components: {
  },
  filters: {
    showCodeLabel: showCodeLabel
  },
  data() {
    return {
      crsQcRptList: {
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
      this.crsQcRptList.page.pageNumber = 1
      this.qryCurveCrsQcRpt()
    },
    handleSizeChange(pageSize) {
      this.crsQcRptList.page.pageSize = pageSize
      this.qryCurveCrsQcRpt()
    },
    handleCurrentChange(currentPage) {
      this.crsQcRptList.page.pageNumber = currentPage
      this.qryCurveCrsQcRpt()
    },
    handleSelectionChange(items) {
      console.info('handleSelectionChange' + JSON.stringify(items))
      this.multipleSelection = items
    },
    qryCurveCrsQcRpt() {
      qryCurveCrsQcRpt(this.crsQcRptList).then(response => {
        console.info('qryCurveCrsQcRpt.qryCurveCrsQcRpt...')
        const { dataList, page } = response
        this.crsQcRptList.dataList = dataList
        this.crsQcRptList.page = page
      })
    }
  }
}
</script>

<style scoped>
</style>
