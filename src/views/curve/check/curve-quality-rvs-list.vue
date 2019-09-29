<template>
  <div class="app-container">
    <div style="margin-bottom: 20px">
      <el-date-picker v-model="rvsQcRptList.compDate" type="date" placeholder="选择日期" value-format="yyyyMMdd" format="yyyy-MM-dd" />
      <el-select placeholder="B0002">
        <el-option label="B0002" value="B0002" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
    </div>
    <div style="margin-bottom: 20px">
      <el-select v-model="rvsQcRptList.curveId" @change="handleOptionChange">
        <el-option v-for="item in curveList.dataList" :key="item.curveId" :label="item.productName" :value="item.curveId" />
      </el-select>
    </div>
    <el-table
      ref="multipleTable"
      :data="rvsQcRptList.dataList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column prop="keyTerm" label="期限" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.keyTerm }}
        </template>
      </el-table-column>
      <el-table-column prop="productName" label="本批次收益率" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.keyTermYield }}
        </template>
      </el-table-column>
      <el-table-column prop="curvePubType" label="上一批次收益率" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.tgtKeyTermYield }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="rvsQcRptList.page.pageNumber"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="rvsQcRptList.page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="rvsQcRptList.page.totalRecord"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { qryCurveRvsQcList, qryCurveRvsQcRpt } from '@/api/curve/curve-quality.js'
// import { delCurveSample } from '@/api/curve/curve-sample.js'
import { showCodeLabel } from '@/api/curve/code-type.js'

export default {
  name: 'CurveRvsQcRpt', // 质检倒挂
  components: {
  },
  filters: {
    showCodeLabel: showCodeLabel
  },
  data() {
    return {
      rvsQcRptList: {
        compDate: '',
        curveId: '',
        batchId: 'B0002',
        dataList: [],
        page: {
          pageNumber: 1,
          pageSize: 10
        }
      },
      curveList: {
        dataList: []
      },
      overallNum: {},
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
      this.rvsQcRptList.page.pageNumber = 1
      this.qryCurveRvsQcList()
    },
    handleSizeChange(pageSize) {
      this.rvsQcRptList.page.pageSize = pageSize
      this.qryCurveRvsQcRpt()
    },
    handleCurrentChange(currentPage) {
      this.rvsQcRptList.page.pageNumber = currentPage
      this.qryCurveRvsQcRpt()
    },
    handleSelectionChange(items) {
      console.info('handleSelectionChange' + JSON.stringify(items))
      this.multipleSelection = items
    },
    handleOptionChange(pageSize) {
      this.rvsQcRptList.page.pageNumber = 1
      this.qryCurveRvsQcRpt()
    },
    qryCurveRvsQcRpt() {
      qryCurveRvsQcRpt(this.rvsQcRptList).then(response => {
        console.info('qryCurveRvsQcRpt.qryCurveRvsQcRpt...')
        const { dataList, page } = response
        this.rvsQcRptList.dataList = dataList
        this.rvsQcRptList.page = page
      })
    },
    qryCurveRvsQcList() {
      qryCurveRvsQcList(this.rvsQcRptList).then(response => {
        console.info('qryCurveRvsQcList.qryCurveRvsQcList...')
        const { datalist } = response
        this.curveList.dataList = datalist
      })
    }
  }
}
</script>

<style scoped>
</style>
