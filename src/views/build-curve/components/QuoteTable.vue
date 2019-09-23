<template>
  <List :columns="makeColumns" :data="makeData" :selectable="makeHighLight" :interval="makeInterval" @open="computePrice" />
</template>

<script>
import List from './List'
import { getMean, getMedian, getMode } from '@/utils/math'

export default {
  components: { List },
  data() {
    return {
      list: [{
        '估值日': '2019-9-18', '曲线名称': '曲线AAA', '报价时间': '2019-9-17', '债券名称': '国开债券', '估值日买入收益率': 2.16
      }, {
        '估值日': '2019-9-18', '曲线名称': '曲线AAA', '报价时间': '2019-9-17', '债券名称': '国开债券', '估值日买入收益率': 2.12
      }, {
        '估值日': '2019-9-18', '曲线名称': '曲线AAA', '报价时间': '2019-9-17', '债券名称': '国开债券', '估值日买入收益率': 2.13
      }, {
        '估值日': '2019-9-18', '曲线名称': '曲线AAA', '报价时间': '2019-9-17', '债券名称': '国开债券', '估值日买入收益率': 2.09
      }, {
        '估值日': '2019-9-18', '曲线名称': '曲线AAA', '报价时间': '2019-9-17', '债券名称': '国开债券', '估值日买入收益率': 2.01
      }],
      interval: [{ down: '1.11', up: '2.07', term: '0.08' }, { down: '2.11', up: '3.07', term: '0.25' }],
      selectable: { '收益率': ['估值日买入收益率'], '偏差值': ['曲线名称'] },
      intervalBy: '估值日买入收益率',
      selectBy: '曲线名称'
    }
  },
  computed: {
    makeColumns() {
      const arr = []
      const _ = this.$lodash
      this.list.map(value => Object.keys(value).map((v, i) => {
        if (!_.find(arr, o => o.prop === v)) {
          const array = Object.keys(this.selectable).filter(k => this.selectable[k].findIndex(m => m === v) > -1)
          arr.push(array.length > 0 ? { prop: v, label: v, index: i, type: array[0] } : { prop: v, label: v })
        }
      }))
      return arr
    },
    makeHighLight() {
      return Object.keys(this.selectable).reduce((arr, k) => arr.concat(this.selectable[k]), [])
    },
    makeInterval() {
      return this.list.map(v => v[this.intervalBy]).map(value => this.interval.findIndex(i => value >= i.down && value < i.up))
    },
    makeData() {
      return this.list.map((v, i) => {
        const value = v[this.intervalBy]
        const e = this.interval.find(i => value >= i.down && value < i.up)
        return this.$lodash.assign(v, e, { index: i })
      })
    }
  },
  methods: {
    computePrice({ arr, term, type, result }) {
      const flag = arr.map(value => value.row[this.selectBy]).filter((v, i, a) => a.indexOf(v, 0) === i).length > 0
      const values = arr.map(v => v.row[v.label])
      Object.assign(result, {
        term: flag ? term : 0 + arr[0].row[this.intervalBy],
        type: type,
        num: arr.length,
        avg: getMean(values),
        mid: getMedian(values),
        plu: getMode(values).length < 1 ? 0 : getMode(values)[0],
        max: Math.max.apply(Math, values),
        min: Math.min.apply(Math, values)
      })
    }
  }
}
</script>

<style scoped>

</style>
