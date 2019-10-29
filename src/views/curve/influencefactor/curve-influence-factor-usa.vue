<template>
  <div class="flex-container">
    <div class="flex-item">
      <el-card class="flex-children curve-build curve-image">
        <el-row>
          <el-col :span="20">
            <Chart :options="chartOptions" />

          </el-col>
        </el-row>
      </el-card>
      <el-card class="flex-children curve-build">
        <el-table
          ref="multipleTable"
          :data="usaDataList.dataList"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column label="名称">
            <template slot-scope="scope">
              {{ scope.row.data.bondName }}
            </template>
          </el-table-column>
          <el-table-column label="债券收益率">
            <template slot-scope="scope">
              {{ scope.row.data.rate }}
            </template>
          </el-table-column>
          <el-table-column label="前值">
            <template slot-scope="scope">
              {{ scope.row.data.beforeVlaue }}
            </template>
          </el-table-column>
          <el-table-column label="高">
            <template slot-scope="scope">
              {{ scope.row.data.highValue }}
            </template>
          </el-table-column>
          <el-table-column label="低">
            <template slot-scope="scope">
              {{ scope.row.data.lowValue }}
            </template>
          </el-table-column>
          <el-table-column label="涨跌">
            <template slot-scope="scope">
              {{ scope.row.data.changeValue }}
            </template>
          </el-table-column>
          <el-table-column label="涨跌幅">
            <template slot-scope="scope">
              {{ scope.row.data.changeRate }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>
<script>
// import { formatTimeToStr } from '@/utils/date.js'
import { queryUstreasuries } from '@/api/curve/curve-query.js'
import { Chart } from 'highcharts-vue'

export default {
  name: 'CurveInfluenceFactorUsa',
  components: { Chart },
  //   props: ['taskDay', 'orderId'],
  data() {
    return {
      usaDataList: {
        dataList: []
      },
      chartOptions: {
        title: {
          text: '1'
        },
        credits: {
          enabled: false
        },
        legend: {
          layout: 'vertical',
          backgroundColor: '#fff',
          floating: true,
          align: 'left',
          verticalAlign: 'top',
          x: 0,
          y: -10
        },
        xAxis: {
          title: {
            text: ''
          },
          gridLineWidth: 1
        },
        // plotOptions: {
        //   series: {
        //     color: '#FF0000'
        //   }
        // },
        yAxis: {
          title: {
            text: ''
          },
          gridLineWidth: 1
        },
        series: [{
          name: '现在',
          data: [1, 2, 3],
          color: '#f00'
        }, {
          name: '一个月前',
          data: [3, 2, 1]
        }, {
          name: '一年前',
          data: [2, 3, 1]
        }]
      },
      multipleSelection: '' // 选择记录
    }
  },
  mounted() {
    this.usaDataList.dataList = this.getQueryUstreasuries()
  },
  methods: {
    handleSelectionChange(items) {
      console.info('handleSelectionChange' + JSON.stringify(items))
      this.multipleSelection = items
    },
    // 获取美国国债收益率曲线数据
    getQueryUstreasuries() {
      const options = []
      queryUstreasuries({}).then(response => {
        response.map(data => options.push({ data }))
      })
      return options
    }
    // qryCurveRvsQcRpt() {
    //   this.rvsQcRptList.compDate = this.taskDay
    //   this.rvsQcRptList.batchId = this.orderId
    //   qryCurveRvsQcRpt(this.rvsQcRptList).then(response => {
    //     console.info('qryCurveRvsQcRpt.qryCurveRvsQcRpt...')
    //     const { dataList, page } = response
    //     this.rvsQcRptList.dataList = dataList
    //     this.rvsQcRptList.page = page
    //     var income = []
    //     var lastinCome = []
    //     for (var i = 0; i < dataList.length; i++) {
    //       // eslint-disable-next-line no-new-wrappers
    //       var x = Number(dataList[i].keyTerm)
    //       // eslint-disable-next-line no-new-wrappers
    //       var y = Number(dataList[i].keyTermYield)
    //       income.push([x, y])
    //       // eslint-disable-next-line no-new-wrappers
    //       lastinCome.push([Number(dataList[i].keyTerm), Number(dataList[i].tgtKeyTermYield)])
    //     }
    //     // // 本次收益率
    //     // this.chartOptions.series[0].data = income
    //     // // 上一批次收益率
    //     // this.chartOptions.series[1].data = lastinCome
    //   })
    // },
    // qryCurveRvsQcList() {
    //   this.rvsQcRptList.compDate = this.taskDay
    //   this.rvsQcRptList.batchId = this.orderId
    //   qryCurveRvsQcList(this.rvsQcRptList).then(response => {
    //     console.info('qryCurveRvsQcList.qryCurveRvsQcList...')
    //     const { datalist } = response
    //     this.curveList.dataList = datalist
    //   })
    // }

  }
}
</script>
<style scoped>
  /* .flex-container {
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
    width: 100%;
  }
  .flex-children {
    flex: 1;
    display: inline-block;
    margin: 20px auto;
  }
  .curve-build {
    width: 100%;
    margin-right: 20px;
  } */
</style>
