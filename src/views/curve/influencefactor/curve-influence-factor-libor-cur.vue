<template>
  <div class="app-container">
    <el-card class="flex-children curve-build curve-image">
      <Chart :options="chartOptions" />
    </el-card>
  </div>
</template>

<script>
// import { querylidor } from '@/api/curve/curve-query.js'
import { Chart } from 'highcharts-vue'
export default {
  name: 'CurveInfluenceFactorLiborCur',
  components: { Chart },
  // eslint-disable-next-line vue/require-prop-types
  //   props: ['timeLimit'],
  data() {
    return {
      chartOptions: {
        title: {
          text: 'month'
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
          data: [2, 3, 4, 5, 6, 6, 7, 7, 8, 2]
        }]
      }
    }
  },
  methods: {

  }
}
</script>

<style scoped>
  .initPanel {
    min-height: 400px;
    border: 1px solid black;
    border-left: 0px;
    padding: 10px;
    position: relative;
  }
  .initPanel_1{
    border-left: 1px solid black;
  }
  .grayText{
    color: #97a8be;
  }
</style>
