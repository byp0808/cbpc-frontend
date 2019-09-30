<template>
  <div class="flex-container">
    <div class="flex-item">
      <el-card class="flex-children curve-build">
        <el-table :data="list" size="mini" :fit="false" class="no-hover-row">
          <el-table-column label="期限" width="100px" align="center">
            <template slot-scope="{ row }">
              <span>{{ row.curveName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="本次收益率(%)" align="center" width="200px">
            <template slot-scope="{ row }">
              <span>{{ row.bondName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="上一批次收益率(%)" align="center" width="200px">
            <template slot-scope="{ row }">
              <span>{{ row.selectKt }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-card class="flex-children curve-build curve-image">
        <Chart :options="chartOptions" />
      </el-card>
    </div>
  </div>
</template>

<script>
import { Chart } from 'highcharts-vue'
export default {
  name: 'BuildCurve',
  // eslint-disable-next-line vue/no-unused-components
  components: { Chart },
  data() {
    return {
      list: [{
        curveName: 0.08,
        bondName: 0.1,
        selectKt: 3
      }, {
        curveName: 0.1,
        bondName: 0.1,
        selectKt: 3
      }, {
        curveName: 0.2,
        bondName: 0.1,
        selectKt: 3
      }, {
        curveName: 0.3,
        bondName: 0.1,
        selectKt: 3
      }],
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
  beforeMount() {
    // 本次收益率
    this.chartOptions.series[0].data = [1, 4, 3]
    // 上一批次收益率
    this.chartOptions.series[1].data = [3, 2, 5]
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
