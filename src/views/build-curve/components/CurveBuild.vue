<template>
  <div class="x-scroll">
    <div class="flex-container">
      <div class="flex-item">
        <curve-build-table
          :list="makeData"
          :name="productName"
          :curve-id="curveId"
          :order-id="orderId"
          :curve-order-id="curveOrderId"
          :curve-task-id="curveTaskId"
          :edit="!status"
          :show-division="true"
          :show-button="true"
          :options="homology"
          @change-data="changeData"
          @click-history-division="historyDivision"
        />
        <el-tabs :tab-position="'top'" class="curve-image">
          <el-tab-pane label="到期" style="width: 500px;">
            <Chart :options="makeFutureData" />
          </el-tab-pane>
          <el-tab-pane label="即期" style="width: 500px;">
            <Chart :options="makeSpotData" />
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
  </div>
</template>

<script>
import CurveBuildTable from '@/views/build-curve/components/CurveBuildTable'
import ReferTable from '@/views/build-curve/components/ReferTable'
import RelationTable from '@/views/build-curve/components/RelationTable'
import HighBright from '@/views/build-curve/components/HighBrightColumn'
import { Chart } from 'highcharts-vue'
import { mapState } from 'vuex'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import { queryReferCurveYield, queryRelationsCurveYield, queryHomology, queryHistoryDivision } from '@/api/curve/curve-build'
import { subtract } from '@/utils/math'
import { getToken } from '@/utils/auth'

export default {
  name: 'BuildCurve',
  components: { CurveBuildTable, Chart, ReferTable, RelationTable },
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
      chartFutureOptions: {
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
        },
        series: [
          {
            name: '今日',
            data: []
          }, {
            name: '昨日',
            data: []
          }
        ]
      },
      chartSpotOptions: {
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
        },
        plotOptions: {
          series: {
            pointStart: 0,
            pointInterval: 0.01
          }
        },
        series: [
          {
            name: '今日',
            data: []
          }, {
            name: '昨日',
            data: []
          }
        ]
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
      homology: [],
      clickClose: false,
      websocket: null,
      timer: null
    }
  },
  computed: {
    ...mapState({
      list: function(state) {
        return state.curveBuild.curveBuildList[this.curveId] || []
      },
      yields: function(state) {
        return state.curveBuild.curveChartsList[this.curveId] || []
      },
      status: function(state) {
        return state.curveBuild.curveStatus[this.curveId] ? state.curveBuild.curveStatus[this.curveId].confirm : false
      }
    }),
    makeNow() {
      const _ = this.$lodash
      return this.list.map(v => {
        return { [v.standSlip]: v.adjResult }
      }).reduce((k, i) => _.merge(k, i), {})
    },
    makeData() {
      return this.list.map((v, index) => {
        if (index === 0) {
          v.variations = 0
        } else {
          v.variations = subtract(this.list[index].adjResult, this.list[index - 1].adjResult)
        }
        return v
      })
    },
    makeFutureData() {
      const chartFutureOptions = this.chartFutureOptions
      chartFutureOptions.series[0].data = this.yields[0]
      chartFutureOptions.series[1].data = this.yields[1]
      console.log('future', chartFutureOptions.series)
      return chartFutureOptions
    },
    makeSpotData() {
      const chartSpotOptions = this.chartSpotOptions
      chartSpotOptions.series[0].data = this.yields[2]
      chartSpotOptions.series[1].data = this.yields[3]
      console.log('spot', chartSpotOptions.series)
      return chartSpotOptions
    }
  },
  watch: {
    list: function(newlist, oldlist) {
    },
    yields: function(newlist, oldlist) {
    }
  },
  created() {
  },
  mounted() {
    window.addEventListener('storage', () => {
      console.log(JSON.parse(localStorage.getItem('watchStorage')))
      this.list[0].yield = JSON.parse(localStorage.getItem('watchStorage')).value
    })
    this.getCurve()
    this.getReferCurve()
    this.getRelationCurve()
    this.getOptions()
    this.initWebsocket()
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.disconnect()
  },
  methods: {
    getCurve() {
      this.$store.dispatch('curveBuild/initData', { curveId: this.curveId, orderId: this.orderId, curveOrderId: this.curveOrderId, curveTaskId: this.curveTaskId })
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
    getOptions() {
      queryHomology({ curveId: this.curveId, orderId: this.orderId, curveOrderId: this.curveOrderId }).then(response => {
        this.homology = response.map(v => {
          const name = v.curveId === this.curveId ? '' : v.curveShortName
          return { label: '[' + name + v.standSlip + 'Y]', value: '#' + '[' + name + v.standSlip + 'Y]', id: v.id }
        })
      })
    },
    getSaveCurveBuild() {
      this.$store.dispatch('curveBuild/updateData', this.list)
    },
    changeData(data) {
      const i = this.list.findIndex(v => v.standSlip === data.standSlip)
      this.$set(this.list, i, data)
      this.getSaveCurveBuild()
    },
    historyDivision() {
      queryHistoryDivision(this.list).then(response => {
        const map = {}
        response.forEach(el => {
          const value = el.historyDivision
          map[el.standSlip] = value + '%'
        })
        this.$store.dispatch('curveBuild/updateVariation', { curveId: this.curveId, map })
      })
    },
    // ws连接
    initWebsocket() {
      this.connection()
      // 断开重连，尝试发送消息
      this.timer = setInterval(() => {
        try {
          this.stompClient.send('msg')
        } catch (err) {
          console.log('websocket 请求断开了:', err)
          this.connection()
        }
      }, 5000)
    },
    connection() {
      // 建立连接
      const url = 'http://' + window.location.host + process.env.VUE_APP_BASE_API + '/pi-curve/mq?token=' + getToken()
      const socket = new SockJS(url)
      // 获取stomp子协议的客户端对象
      this.stompClient = Stomp.over(socket)
      const headers = { token: getToken() }
      // 发送websocket连接
      this.stompClient.connect(headers, (frame) => {
        console.log('frame is:', frame)
        // 订阅服务
        this.stompClient.subscribe('/matches', (msg) => {
          console.log('广播成功')
          console.log(msg) // msg.body存放的是服务端发送给我们的信息
        }, headers)
      }, (err) => {
        // 连接发生错误时的处理函数
        console.log('失败')
        console.log(err)
      })
    },
    disconnect() {
      if (this.stompClient) {
        this.stompClient.disconnect()
      }
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
</style>
