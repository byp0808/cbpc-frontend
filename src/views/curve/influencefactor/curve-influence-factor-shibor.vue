<template>
  <div class="flex-container">
    <el-form ref="queryForm" :inline="true" :model="queryForm" class="demo-form-inline">
      <el-form-item label="开始日期" prop="search_dateBegin_GTE">
        <el-date-picker
          v-model="queryForm.search_dateBegin_GTE"
          align="right"
          type="date"
          format="yyyy-MM-dd"
          value-format="timestamp"
          placeholder="选择日期"
          :disabled="disabled"
          :picker-options="pickerOptionsStart"
          @change="changeEnd"
        />
      </el-form-item>
      <el-form-item label="结束日期" prop="search_dateEnd_LTE">
        <el-date-picker
          v-model="queryForm.search_dateEnd_LTE"
          align="right"
          type="date"
          format="yyyy-MM-dd"
          value-format="timestamp"
          placeholder="选择日期"
          :disabled="disabled"
          :picker-options="pickerOptionsEnd"
          @change="changeStart"
        />
      </el-form-item>
      <el-form-item label="利率种类">
        <el-select v-model="queryForm.orderId" placeholder="请选择" :disabled="disabled">
          <el-option v-for="item in orderList" :key="item.id" :label="item.orderName" :value="item.orderName" />
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
          :data="shiborDataList.dataList"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column label="日期">
            <template slot-scope="scope">
              {{ scope.row.data.date }}
            </template>
          </el-table-column>
          <el-table-column label="期限">
            <template slot-scope="scope">
              <el-button type="text" @click="initstandSlipSet(scope.$index)">{{ scope.row.data.timeLimit }}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="利率 （%）">
            <template slot-scope="scope">
              {{ scope.row.data.rate }}
            </template>
          </el-table-column>
          <el-table-column label="涨跌 （BP）">
            <template slot-scope="scope">
              {{ scope.row.data.change }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-card class="flex-children curve-image">
        <Chart :options="chartOptions" style="width:100%" />
      </el-card>
    </div>
  </div>
</template>
<script>
import { Chart } from 'highcharts-vue'
// import { qryCurveRvsQcList, qryCurveRvsQcRpt } from '@/api/curve/curve-quality.js'
import { queryShidor } from '@/api/curve/curve-query.js'
// import { getCurveTaskOrderOptions } from '@/api/curve/curve-order-compute.js'
// import { formatTimeToStr } from '@/utils/date.js'

export default {
  name: 'CurveInfluenceFactorShibor',
  // eslint-disable-next-line vue/no-unused-components
  components: { Chart },
  //   props: ['taskDay', 'orderId'],
  data() {
    return {
      shiborDataList: {
        dataList: []
      },
      queryForm: {
        search_dateBegin_GTE: '',
        search_dateEnd_LTE: '',
        orderId: ''
      },
      pickerOptionsStart: {},
      pickerOptionsEnd: {},
      disabled: false,
      orderList: [
        { id: '选项一', orderName: '全部' },
        { id: '选项二', orderName: 'O/N' },
        { id: '选项三', orderName: '1W' },
        { id: '选项四', orderName: '2W' },
        { id: '选项五', orderName: '1M' },
        { id: '选项六', orderName: '3M' },
        { id: '选项七', orderName: '6M' },
        { id: '选项八', orderName: '9M' }
      ], // 批次列表
      multipleSelection: '', // 选择记录
      chartOptions: {
        title: {
          text: 'Shibor'
        },
        credits: {// 显示版权信息
          enabled: false
        },
        legend: {// 图例
          layout: 'vertical',
          backgroundColor: '#fff',
          align: 'center',
          verticalAlign: 'bottom',
          x: 0,
          y: -10
        },
        xAxis: {
          title: {
            text: ''
          },
          categories: [],
          gridLineWidth: 0
        },

        yAxis: {
          title: {
            text: ''
          },
          categories: [1.9, 2.1, 2.3, 2.5, 2.7, 2.9, 3.1, 3.3],
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
  mounted() {
    // 加载数据
    this.shiborDataList.dataList = this.getQueryShidor()
    this.clickQueryShidor()
  },
  methods: {
    // 主页面查询方法
    // 根据 activeName 调用各个页面查询方法
    indexQuery() {
      console.info(this)
      console.info('查询')
      if (!this.queryForm.orderId) {
        this.$message({
          type: 'error',
          message: '请选择'
        })
        return false
      }
      this.getQueryShidor()
    },
    handleSelectionChange(items) {
      console.info('handleSelectionChange' + JSON.stringify(items))
      this.multipleSelection = items
    },
    // 点击期限
    initstandSlipSet() {
      console.info('点击期限')
    },
    // 获取shibor数据
    getQueryShidor() {
      const options = []
      queryShidor(this.queryForm).then(response => {
        response.map(data => options.push({ data }))
      })
      return options
    },
    // 关联曲线
    clickQueryShidor() {
      queryShidor(this.queryForm).then(response => {
        var dataList = response
        var income = []
        var lastinCome = []
        var xral = []
        for (var i = 0; i < dataList.length; i++) {
          var x = dataList[i].timeLimit
          var y = Number(dataList[i].rate)
          income.push([x, y])
          lastinCome.push([dataList[i].timeLimit, Number(dataList[i].change)])
          xral.push([x])
        }
        console.info('income')
        console.info(income)
        console.info(lastinCome)
        // 本次收益率
        this.chartOptions.series[0].data = income
        // 上一批次收益率
        this.chartOptions.series[1].data = lastinCome
        // 横坐标
        this.chartOptions.xAxis.categories = xral
      })
    },
    // 结束时间限制开始时间
    changeStart() {
      if (!this.queryForm.search_dateEnd_LTE) {
        this.pickerOptionsStart = {
          disabledDate: {}
        }
        return
      }
      this.pickerOptionsStart = Object.assign({}, this.pickerOptionsStart, {
        // 可通过箭头函数的方式访问到this
        disabledDate: (time) => {
          return time.getTime() > this.queryForm.search_dateEnd_LTE
        }
      })
    },
    // 开始时间 控制结束时间
    changeEnd() {
      if (!this.queryForm.search_dateBegin_GTE) {
        this.pickerOptionsEnd = {
          disabledDate: {}
        }
        return
      }
      this.pickerOptionsEnd = Object.assign({}, this.pickerOptionsEnd, {
        disabledDate: (time) => {
          return time.getTime() < this.queryForm.search_dateBegin_GTE
        }
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
