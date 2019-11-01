<template>
  <div class="line-table">
    <h4 class="orange">{{ name }}</h4>
    <List :data="make" :columns="columns" />
  </div>
</template>

<script>
import List from '@/views/build-curve/components/List'
import { subtract, divide } from '@/utils/math'
export default {
  components: { List },
  props: {
    list: {
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
    },
    mainCurve: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    make() {
      return this.list.map((item) => {
        const l = this.mainCurve.filter(m => item.standSlip === m.standSlip - 0)
        if (l.length === 0) {
          return item
        }
        const _ = this.$lodash
        return _.assign(item, {
          rateChange: subtract(item.todayYield, item.yesterdayYield),
          yDiff: subtract(item.yesterdayYield, l[0].lastYield),
          tDiff: subtract(item.todayYield, l[0].adjResult),
          diffChange: subtract(subtract(item.todayYield, l[0].adjResult), subtract(item.yesterdayYield, l[0].lastYield)),
          tax: l[0].adjResult === 0 ? 0 : subtract(divide(item.todayYield, l[0].adjResult), 1)
        })
      })
    }
  }
}
</script>

<style scoped>
.line-table {
  padding: 5px;
}
.orange {
  color: #ff8901;
}
</style>
