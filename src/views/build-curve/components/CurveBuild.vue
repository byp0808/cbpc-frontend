<template>
  <div class="x-scroll">
    <div class="flex-container">
      <div class="flex-item">
        <CurveBuildTable :list="list" :name="productName" :show-division="true" :show-button="true" />
        <el-tabs :tab-position="'top'" class="curve-image">
          <el-tab-pane label="到期" style="width: 500px;">
            <Chart :options="makeData" />
          </el-tab-pane>
          <el-tab-pane label="即期" style="width: 500px;">
            <Chart :options="makeData" />
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="flex-item">
        <div v-for="(refer, index) in referList" :key="index" class="curve-build">
          <ReferTable
            :list="refer.list"
            :main-curve="list"
            :columns="referColumns"
            :name="refer.productName"
          />
        </div>
      </div>
      <div class="flex-item">
        <div v-for="(relation, index) in relationList" :key="index" class="curve-build">
          <RelationTable
            :curves="relation.curves"
            :main-curve="makeNow"
            :slips="relation.slips"
            :columns="relation.columns"
            :name="relation.name"
            :type="relation.type"
          />
        </div>
      </div>
    </div>
    <init-curve v-if="true" :mini-icon="'el-icon-info'">
      <div>
        <div class="curve-sub-content">
          <CurveBuildTable :list="initList" :name="productName" />
        </div>
        <div class="curve-sub-footer">
          <el-button type="primary">应用</el-button>
          <el-button>取消</el-button>
        </div>
      </div>
    </init-curve>
  </div>
</template>

<script>
import CurveBuildTable from './CurveBuildTable'
import ReferTable from './ReferTable'
import RelationTable from './RelationTable'
import HighBright from './HighBrightColumn'
import InitCurve from './InitCurve'
import { Chart } from 'highcharts-vue'
import { queryCurveYield, queryInitCurveYield, queryReferCurveYield, queryRelationsCurveYield, queryHistoryDivision } from '@/api/curve/curve-build'

export default {
  name: 'BuildCurve',
  components: { InitCurve, CurveBuildTable, Chart, ReferTable, RelationTable },
  props: {
    curveId: {
      type: String,
      default: ''
    },
    productName: {
      type: String,
      default: ''
    },
    orderId: {
      type: String,
      default: ''
    },
    curveOrderId: {
      type: String,
      default: ''
    },
    curveTaskId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      list: [],
      initList: [],
      chartOptions: {
        title: {
          text: ''
        },
        credits: {
          enabled: false
        },
        legend: {
          // layout: 'vertical',
          // backgroundColor: '#ff5f96',
          floating: true,
          align: 'right',
          verticalAlign: 'bottom',
          x: -10,
          y: 20
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
        }
      },
      referColumns: [
        { prop: 'standSlip', label: '期限' },
        { prop: 'yesterdayYield', label: '昨日收益率' },
        { prop: 'todayYield', label: '今日收益率' },
        { prop: 'rateChange', label: '两日变动', component: HighBright },
        { prop: 'yDiff', label: '昨日点差', component: HighBright },
        { prop: 'tDiff', label: '今日点差', component: HighBright },
        { prop: 'diffChange', label: '两日点差变动', component: HighBright },
        { prop: 'tax', label: '税收效应' }
      ],
      referList: [],
      relationList: [],
      result: [
        {
          name: '昨日',
          data: [1, 2, 3]
        }, {
          name: '今日',
          data: [2, 4, 5]
        }
      ]
    }
  },
  computed: {
    makeNow() {
      const _ = this.$lodash
      return this.list.map(v => {
        return { [v.standSlip]: v.adjResult }
      }).reduce((k, i) => _.merge(k, i), {})
    },
    makeData() {
      const options = this.chartOptions
      options['series'] = this.result
      return options
    }
  },
  created() {
  },
  mounted() {
    window.addEventListener('storage', () => {
      this.list[0].yield = JSON.parse(localStorage.getItem('watchStorage')).value
    })
    this.getCurve()
    this.getReferCurve()
    this.getRelationCurve()
  },
  methods: {
    getCurve() {
      queryCurveYield({ curveId: this.curveId, orderId: this.orderId, curveOrderId: this.curveOrderId, curveTaskId: this.curveTaskId }).then(response => {
        this.list = response
        queryInitCurveYield({ curveId: this.curveId, orderId: this.orderId, curveOrderId: this.curveOrderId }).then(response => {
          this.initList = response
        })
      })
    },
    getReferCurve() {
      queryReferCurveYield({ curveId: this.curveId, orderId: this.orderId, curveOrderId: this.curveOrderId }).then(response => {
        this.referList = response
      })
    },
    getRelationCurve() {
      queryRelationsCurveYield({ curveId: this.curveId, orderId: this.orderId, curveOrderId: this.curveOrderId }).then(response => {
        this.relationList = response.map(el => {
          const columns = []
          columns.push({ prop: 'standSlip', label: '期限' })
          el.curves.map(curve => columns.push({ prop: curve.curveId, label: curve.productName, component: HighBright }))
          el.columns = columns
          return el
        })
      })
    },
    historyDivision() {
      queryHistoryDivision(this.list).then(response => {
        this.data = response.dataList
      })
    }
  }
}
</script>

<style scoped>
.x-scroll {
  overflow-x: scroll;
}
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
.curve-build {
  margin-right: 20px;
}
.curve-image {
  min-width: 580px;
  margin-left: 20px;
}
.curve-sub-content {
  padding: 5px;
}
.curve-sub-footer {
  height: 50px;
  line-height: 50px;
  position: relative;
  width: 100%;
  text-align: right;
  padding-right: 20px;
  transition: 600ms ease position;
}
</style>
