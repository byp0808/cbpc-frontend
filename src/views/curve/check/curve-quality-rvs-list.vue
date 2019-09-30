<template>
  <div class="flex-container">
    <div class="flex-item">
      <el-card class="flex-children curve-build">
        <div style="margin-bottom: 20px">
          <el-date-picker v-model="rvsQcRptList.compDate" type="date" placeholder="选择日期" value-format="yyyyMMdd" format="yyyy-MM-dd" />
          <el-select v-model="rvsQcRptList.curveId" placeholder="请选择">
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
          <el-table-column label="期限" width="200" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.keyTerm }}
            </template>
          </el-table-column>
          <el-table-column label="本批次收益率" width="200" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.keyTermYield }}
            </template>
          </el-table-column>
          <el-table-column label="上一批次收益率" width="200" show-overflow-tooltip>
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
      </el-card>
      <el-card class="flex-children curve-build curve-image">
        <Chart :options="chartOptions" />
      </el-card>
    </div>
  </div>
</template>

<script>
import { Chart } from 'highcharts-vue'
import { qryCurveRvsQcList, qryCurveRvsQcRpt } from '@/api/curve/curve-quality.js'
import { showCodeLabel } from '@/api/curve/code-type.js'

export default {
  name: 'CurveRvsQcRpt',
  // eslint-disable-next-line vue/no-unused-components
  components: { Chart },
  filters: {
    showCodeLabel: showCodeLabel
  },
  data() {
    return {
      rvsQcRptList: {
        compDate: '',
        curveId: '',
        batchId: 'B0002',
        dataList: [{
          keyTerm: 0.08,
          keyTermYield: 0.1,
          tgtKeyTermYield: 3
        }, {
          keyTerm: 0.1,
          keyTermYield: 0.1,
          tgtKeyTermYield: 3
        }, {
          keyTerm: 0.2,
          keyTermYield: 0.1,
          tgtKeyTermYield: 3
        }, {
          keyTerm: 0.3,
          keyTermYield: 0.1,
          tgtKeyTermYield: 3
        }],
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
      multipleSelection: '', // 选择记录
      chartOptions: {
        title: {
          text: ''
        },
        credits: {
          enabled: false
        },
        legend: {
          layout: 'vertical',
          backgroundColor: '#ff5f96',
          floating: true,
          align: 'right',
          verticalAlign: 'bottom',
          x: -10,
          y: -30
        },
        xAxis: {
          title: {
            text: ''
          },
          gridLineWidth: 1
        },
        yAxis: {
          title: {
            text: ''
          },
          gridLineWidth: 1
        },
        series: [{
          name: '本次收益率',
          data: []
        }, {
          name: '上一批次收益率',
          data: []
        }]
      }
    }
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
        var income = []
        var lastinCome = []
        for (var i = 0; i < dataList.length; i++) {
          // eslint-disable-next-line no-new-wrappers
          var x = Number(dataList[i].keyTerm)
          // eslint-disable-next-line no-new-wrappers
          var y = Number(dataList[i].keyTermYield)
          income.push([x, y])
          // eslint-disable-next-line no-new-wrappers
          lastinCome.push([Number(dataList[i].keyTerm), Number(dataList[i].tgtKeyTermYield)])
        }
        // 本次收益率
        this.chartOptions.series[0].data = income
        // 上一批次收益率
        this.chartOptions.series[1].data = lastinCome
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
  .flex-container {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    width: auto;
    min-width: 100%;
  }
  .flex-item {
    display: flex;
    flex-direction: row;
    width: auto;
  }
  .flex-children {
    flex: 1;
    display: inline-block;
    margin: 20px auto;
  }
  .curve-build {
    min-width: 500px;
    margin-right: 20px;
  }
  .curve-image {
    min-width: 580px;
  }
</style>
