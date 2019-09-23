<template>
  <div>
    <h4 class="text-center">{{ name }}</h4>
    <List :data="make" :columns="columns" />
  </div>
</template>

<script>
import List from './List'
import { subtract } from '@/utils/math'
export default {
  components: { List },
  props: {
    curves: {
      type: Object,
      default: () => {}
    },
    mainCurve: {
      type: Array,
      default: () => []
    },
    slips: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    name: {
      type: String,
      default: ''
    }
  },
  computed: {
    make() {
      const _ = this.$lodash
      const main = this.mainCurve.reduce((a, v) => _.merge(a, { [v['term']]: { 'main': v['yield'] }}), {})
      const map = Object.keys(this.curves).reduce((k, i) => {
        return _.merge(k, this.curves[i].reduce((a, v) => {
          let r = 0
          const _key = v['term']
          if (_.has(main, _key)) {
            r = subtract(0 + main[_key].main, 0 + v['yield'])
          }
          return _.merge(a, { [_key]: { [i]: r }})
        }, {}))
      }, {})
      return this.slips.map(v => _.assign({ 'term': v }, map[v]))
    }
  }
}
</script>

<style scoped>

</style>
