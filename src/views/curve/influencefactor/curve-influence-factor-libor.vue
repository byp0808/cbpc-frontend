<template>
  <div class="flex-container">
    <div class="flex-item">
      <el-card class="flex-children curve-build">
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
          <el-table-column label="利率期限">
            <template slot-scope="scope">
              {{ scope.row.keyTerm }}
            </template>
          </el-table-column>
          <el-table-column label="利率 %">
            <template slot-scope="scope">
              {{ scope.row.keyTerm }}
            </template>
          </el-table-column>
          <el-table-column label="利率期限">
            <template slot-scope="scope">
              {{ scope.row.yieldChg }}
            </template>
          </el-table-column>
          <el-table-column label="利率 %">
            <template slot-scope="scope">
              {{ scope.row.tgtYieldChg }}
            </template>
          </el-table-column>
          <el-table-column label="利率期限">
            <template slot-scope="scope">
              {{ scope.row.yieldChg }}
            </template>
          </el-table-column>
          <el-table-column label="利率 %">
            <template slot-scope="scope">
              {{ scope.row.tgtYieldChg }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>
<script>
import { qryCurveRvsQcList, qryCurveRvsQcRpt } from '@/api/curve/curve-quality.js'
// import { formatTimeToStr } from '@/utils/date.js'

export default {
  name: 'CurveInfluenceFactorLibor',
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
      curveList: {
        dataList: []
      },
      disabled: false,
      orderList: [], // 批次列表
      multipleSelection: '' // 选择记录
    }
  },
  methods: {
    handleSelectionChange(items) {
      console.info('handleSelectionChange' + JSON.stringify(items))
      this.multipleSelection = items
    },
    handleOptionChange(pageSize) {
      this.rvsQcRptList.page.pageNumber = 1
      this.qryCurveRvsQcRpt()
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
        // 本次收益率
        this.chartOptions.series[0].data = income
        // 上一批次收益率
        this.chartOptions.series[1].data = lastinCome
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
    /* display: inline-block; */
    margin: 20px auto;
  }
  .curve-build {
    width: 100%;
    margin-right: 20px;
  }
</style>
