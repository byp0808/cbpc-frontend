<template>
  <div class="x-scroll">
    <div class="flex-container">
      <div class="flex-item">
        <el-card class="flex-children curve-build">
          <CurveBuildTable :list="list" :name="'曲线'" :show="true" />
        </el-card>
        <el-card class="flex-children curve-build curve-image">
          <el-tabs :tab-position="'right'">
            <el-tab-pane label="到期" style="width: 500px;">
              <Chart :options="chartOptions" />
            </el-tab-pane>
            <el-tab-pane label="即期" style="width: 500px;">
              <Chart :options="chartOptions" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </div>
      <div class="flex-item">
        <el-card v-for="(refer, index) in referList" :key="index" class="flex-children curve-build curve-list">
          <ReferTable
            :list="refer.list"
            :columns="refer.columns"
            :name="refer.name"
          />
        </el-card>
      </div>
      <div class="flex-item">
        <el-card v-for="(relation, index) in relationList" :key="index" class="flex-children curve-build curve-list">
          <RelationTable
            :curves="relation.curves"
            :main-curve="relation.mainCurve"
            :slips="relation.slips"
            :columns="relation.columns"
            :name="relation.name"
          />
        </el-card>
      </div>
    </div>
    <init-curve v-if="true" :mini-icon="'el-icon-info'">
      <div>
        <div class="curve-sub-content">
          <CurveBuildTable :list="list" :name="'曲线'" />
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
import CurveBuildTable from './components/CurveBuildTable'
import ReferTable from './components/ReferTable'
import RelationTable from './components/RelationTable'
import HighBright from './components/HighBrightColumn'
import InitCurve from './components/InitCurve'
import { Chart } from 'highcharts-vue'
export default {
  name: 'BuildCurve',
  components: { InitCurve, CurveBuildTable, Chart, ReferTable, RelationTable },
  data() {
    return {
      list: [{
        curveName: 0.08,
        bondName: 2,
        selectKt: 3,
        yield: ''
      }],
      chartOptions: {
        title: {
          text: '曲线'
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
          name: '昨日',
          data: [1, 2, 3]
        }, {
          name: '今日',
          data: [2, 4, 5]
        }]
      },
      referList: [{
        list: [
          {
            term: '0',
            yRate: '1.84',
            tRate: '1.88'
          }, {
            term: '0.08',
            yRate: '2.17',
            tRate: '2.14'
          }
        ],
        columns: [
          { prop: 'term', label: '期限' },
          { prop: 'yRate', label: '昨日收益率' },
          { prop: 'tRate', label: '今日收益率' },
          { prop: 'rateChange', label: '两日变动', component: HighBright },
          { prop: 'yDiff', label: '昨日点差' },
          { prop: 'tDiff', label: '今日点差' },
          { prop: 'diffChange', label: '两日点差变动' },
          { prop: 'tax', label: '税收效应' }
        ],
        name: '中债国开收益率曲线'
      }, {
        list: [
          {
            term: '0',
            yRate: '1.84',
            tRate: '1.88'
          }, {
            term: '0.08',
            yRate: '2.17',
            tRate: '2.14'
          }
        ],
        columns: [
          { prop: 'term', label: '期限' },
          { prop: 'yRate', label: '昨日收益率' },
          { prop: 'tRate', label: '今日收益率' },
          { prop: 'rateChange', label: '两日变动', component: HighBright },
          { prop: 'yDiff', label: '昨日点差' },
          { prop: 'tDiff', label: '今日点差' },
          { prop: 'diffChange', label: '两日点差变动' },
          { prop: 'tax', label: '税收效应' }
        ],
        name: '中债国开收益率曲线'
      }],
      relationList: [{
        curves: {
          '001': [{ term: '0', 'yield': '3.01' }, { term: '0.08', 'yield': '3.11' }, { term: '0.25', 'yield': '3.15' }],
          '002': [{ term: '0', 'yield': '4.01' }, { term: '0.08', 'yield': '4.11' }, { term: '0.25', 'yield': '4.13' }]
        },
        mainCurve: [{ term: '0', 'yield': '2.91' }, { term: '0.08', 'yield': '3.07' }, { term: '0.25', 'yield': '3.75' }],
        slips: ['0', '0.08', '0.25', '0.5', '0.75'],
        columns: [
          { prop: 'term', label: '期限' },
          { prop: '001', label: '曲线AAA', component: HighBright },
          { prop: '002', label: '曲线AA+', component: HighBright },
          { prop: '003', label: '曲线AA' },
          { prop: '004', label: '曲线AA-' },
          { prop: '005', label: '曲线A+' },
          { prop: '006', label: '曲线A' },
          { prop: '007', label: '曲线A-' }
        ],
        name: '昨日点差矩阵'
      }]
    }
  },
  mounted() {
    window.addEventListener('storage', () => {
      console.log(JSON.parse(localStorage.getItem('watchStorage')).value)
      console.log(this.list[0])
      this.list[0].yield = JSON.parse(localStorage.getItem('watchStorage')).value
    })
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
.flex-children {
  flex: 1;
  display: inline-block;
  margin: 20px auto;
}
.curve-build {
  min-width: 980px;
  margin-right: 20px;
}
.curve-image {
  min-width: 580px;
}
.curve-list {
  min-width: 760px;
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
