<template>
  <div class="flex-container">
    <el-form :inline="true" :model="queryForm" class="demo-form-inline">
      <el-form-item label="开始日期">
        <el-date-picker
          v-model="queryForm.taskDay"
          align="right"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          :disabled="disabled"
        />
      </el-form-item>
      <el-form-item label="结束日期">
        <el-date-picker
          v-model="queryForm.taskDay"
          align="right"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          :disabled="disabled"
        />
      </el-form-item>
      <el-form-item label="利率种类">
        <el-select v-model="queryForm.orderId" placeholder="请选择" :disabled="disabled">
          <el-option v-for="item in orderList" :key="item.id" :label="item.orderName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="indexQuery">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="flex-item">
      <el-card class="flex-children curve-build">
        <el-table
          ref="multipleTable"
          :data="rvsQcRptList.dataList"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column label="日期">
            <template slot-scope="scope">
              {{ scope.row.keyTerm }}
            </template>
          </el-table-column>
          <el-table-column label="期限">
            <template slot-scope="scope">
              {{ scope.row.keyTerm }}
            </template>
          </el-table-column>
          <el-table-column label="利率 （%）">
            <template slot-scope="scope">
              {{ scope.row.yieldChg }}
            </template>
          </el-table-column>
          <el-table-column label="涨跌 （BP）">
            <template slot-scope="scope">
              {{ scope.row.tgtYieldChg }}
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
      <el-card class="flex-children curve-image">
        <Chart :options="chartOptions" style="width:100%" />
      </el-card>
    </div>
  </div>
</template>
<script>
import { Chart } from 'highcharts-vue'
import { qryCurveRvsQcList, qryCurveRvsQcRpt } from '@/api/curve/curve-quality.js'
import { getCurveTaskOrderOptions } from '@/api/curve/curve-order-compute.js'
import { formatTimeToStr } from '@/utils/date.js'

export default {
  name: 'CurveInfluenceFactorShibor',
  // eslint-disable-next-line vue/no-unused-components
  components: { Chart },
  //   props: ['taskDay', 'orderId'],
  data() {
    return {
      rvsQcRptList: {
        compDate: '',
        curveId: '',
        batchId: '',
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
      queryForm: {
        taskDay: null,
        orderId: ''
      },
      disabled: false,
      orderList: [], // 批次列表
      multipleSelection: '', // 选择记录
      chartOptions: {
        title: {
          text: 'Shibor'
        },
        credits: {
          enabled: false
        },
        legend: {
          layout: 'vertical',
          backgroundColor: '#fff',
          floating: true,
          align: 'right',
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
        yAxis: {
          title: {
            text: ''
          },
          gridLineWidth: 1
        },
        series: [{
          name: '本次收益率',
          data: [1, 2, 3]
        }, {
          name: '上一批次收益率',
          data: [3, 2, 1]
        }]
      }
    }
  },
  computed: {
    taskDayStr() {
      var date = this.queryForm.taskDay
      if (date) {
        return this.$moment(date).format('YYYY-MM-DD')
      }
      return ''
    }
  },
  watch: {
    'queryForm.taskDay'(newValue, oldValue) {
      console.info('queryForm.taskDay.newValue:' + newValue)
      this.init()
    }
  },
  beforeMount() {
    console.info('curve-order-check-index.vue beforeMount:' + this.orderId + ',taskDay:' + this.taskDay)
    var taskDay = this.taskDay
    if (!taskDay) {
      taskDay = new Date()
    }
    this.queryForm.taskDay = taskDay
    this.queryForm.orderId = this.$store.state.curveOrderCompute.orderId
    // 加载批次
    this.init(true)
  },
  methods: {
    async init() {
      // 加载批次
      this.orderList = []
      const data = {
        taskDay: formatTimeToStr(this.queryForm.taskDay, 'yyyy-MM-dd')
      }
      await getCurveTaskOrderOptions(this.orderList, data)
      if (this.orderList && this.orderList.length > 0) {
        // 默认显示第一条
        if (this.queryForm.orderId) {
          var isIn = false
          for (let i = 0; i < this.orderList.length; i++) {
            const orderInfo = this.orderList[i]
            if (this.queryForm.orderId === orderInfo.id) {
              isIn = true
            }
          }
          if (!isIn) {
            this.queryForm.orderId = this.orderList[0].id
          }
        } else {
          this.queryForm.orderId = this.orderList[0].id
        }
      }
    },
    // 主页面查询方法
    // 根据 activeName 调用各个页面查询方法
    indexQuery() {
      console.info('indexQuery.activeName:' + this.activeName)
      if (!this.queryForm.orderId) {
        this.$message({
          type: 'error',
          message: '请选择批次'
        })
        return false
      }
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
    qryCurveRvsQcRpt() {
      this.rvsQcRptList.compDate = this.taskDay
      this.rvsQcRptList.batchId = this.orderId
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
        // // 本次收益率
        // this.chartOptions.series[0].data = income
        // // 上一批次收益率
        // this.chartOptions.series[1].data = lastinCome
      })
    },
    qryCurveRvsQcList() {
      this.rvsQcRptList.compDate = this.taskDay
      this.rvsQcRptList.batchId = this.orderId
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
    width: 100%;
  }
  .flex-children {
    /* flex: 1; */
    display: inline-block;
    margin: 20px auto;
  }
  .curve-build {
    width: 39%;
    /* margin-right: 20px; */
  }
  .curve-image {
    width: 58%;
  }
</style>
