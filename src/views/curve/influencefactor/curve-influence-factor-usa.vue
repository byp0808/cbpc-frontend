<template>
  <div class="flex-container">
    <div class="flex-item">
      <el-card class="flex-children curve-build curve-image">
        <Chart :options="chartOptions" />
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
              <el-button type="text" @click="initstandSlipSet(scope.$index)">{{ scope.row.data.bondName }}</el-button>
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
          x: 10,
          y: -18,
          style: 'display:flex'
        },
        xAxis: {
          title: {
            text: ''
          },
          categories: ['1M', '3M', '6M', '1Y', '2Y', '3Y', '5Y', '7Y', '10Y', '30Y'],
          gridLineWidth: 0
        },
        yAxis: {
          title: {
            text: ''
          },
          gridLineWidth: 1
        },
        series: [{
          name: '现在',
          data: []
        }, {
          name: '一个月前',
          data: []
        }, {
          name: '一年前',
          data: []
        }]
      },
      multipleSelection: '' // 选择记录
    }
  },
  mounted() {
    this.usaDataList.dataList = this.getQueryUstreasuries()
    this.clickQueryUstreasuries()
  },
  methods: {
    handleSelectionChange(items) {
      console.info('handleSelectionChange' + JSON.stringify(items))
      this.multipleSelection = items
    },
    // 点击名称
    initstandSlipSet() {
      console.info('点击名称')
    },
    // 获取美国国债收益率曲线数据
    getQueryUstreasuries() {
      const options = []
      queryUstreasuries({}).then(response => {
        response.map(data => options.push({ data }))
      })
      return options
    },
    // 关联曲线
    clickQueryUstreasuries() {
      queryUstreasuries().then(response => {
        var dataList = response
        var innow = []
        var lastmonth = []
        var lastyear = []
        for (var i = 0; i < dataList.length; i++) {
          innow.push([Number(dataList[i].rate)])
          lastmonth.push([Number(dataList[i].beforeVlaue)])
          lastyear.push([Number(dataList[i].highValue)])
        }
        // 现在
        this.chartOptions.series[0].data = innow
        // 一个月前
        this.chartOptions.series[1].data = lastmonth
        // 一年前
        this.chartOptions.series[2].data = lastyear
      })
    }
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
