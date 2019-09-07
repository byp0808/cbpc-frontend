<template>
  <div class="app-container">
    <h4 class="text-center">{{ name }}</h4>
    <List :data="make" :columns="columns" />
  </div>
</template>

<script>
import List from './components/List.vue'
import HighBright from './components/HighBrightColumn.vue'
import { subtract } from '@/utils/math'

export default {
  name: 'BuildCurve',
  components: { List },
  data() {
    return {
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
    }
  },
  computed: {
    make() {
      return this.list.map((item) => {
        const _ = this.$lodash
        return _.assign(item, {
          rateChange: subtract(item.tRate, item.yRate)
        })
      })
    }
  }
}
</script>

<style scoped>
</style>
