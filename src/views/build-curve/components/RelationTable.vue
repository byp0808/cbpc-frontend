<template>
  <div class="line-table">
    <h3 class="orange">{{ name }}</h3>
    <List :data="make" :columns="makeColumns" />
  </div>
</template>

<script>
import List from '@/views/build-curve/components/List'
import { add, subtract } from '@/utils/math'
export default {
  components: { List },
  props: {
    curves: {
      type: Array,
      default: () => []
    },
    mainCurve: {
      type: Object,
      default: () => {}
    },
    curveId: {
      type: String,
      default: ''
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
    },
    type: {
      type: Number,
      default: 0
    }
  },
  computed: {
    make() {
      const _ = this.$lodash
      // 类型为其他曲线
      if (this.type === 1) {
        const _up = _.findIndex(this.curves, 'referFlag')
        const _down = _.findLastIndex(this.curves, 'referFlag')
        const arr = [...Array.from({ length: this.curves.length }).keys()]
        const temp = this.curves.map(v => {
          return v.list.map(el => {
            const _yield = v.curveId === this.curveId && v.nowOrderFlag ? this.mainCurve[el.standSlip] : el.yesterdayYield
            return { [el.standSlip]: { [v.curveId]: _yield }}
          }).reduce((k, i) => _.merge(k, i), {})
        }).reduce((k, i) => { return _.merge(k, i) }, {})
        arr.forEach(value => {
          Object.keys(temp).forEach(val => {
            const obj = temp[val]
            const list = Object.keys(obj)
            if (value < _up) {
              obj[list[value]] = subtract(obj[list[_up]], obj[list[value]])
            } else if (value > _down) {
              obj[list[value]] = subtract(obj[list[value]], obj[list[_down]])
            } else {
              if (value !== 0) {
                obj[list[value]] = obj[list[value - 1]]
              }
            }
          })
        })
        return this.slips.map(v => _.assign({ standSlip: v }, temp[v]))
      }
      // 类型为其他曲线利差
      if (this.type === 2) {
        const _up = _.findIndex(this.curves, 'referFlag')
        const _down = _.findLastIndex(this.curves, 'referFlag')
        const v2 = this.curves.length
        const arr = [...Array.from({ length: v2 }).keys()]
        const temp = this.curves.map(v => {
          return v.list.map(el => {
            const _yield = v.curveId === this.curveId && v.nowOrderFlag ? this.mainCurve[el.standSlip] : el.yesterdayYield
            const _rate = v.curveId === this.curveId && v.nowOrderFlagBySpread ? this.mainCurve[el.standSlip] : el.todayYield
            return { [el.standSlip]: { [v.curveId]: _yield, [v.curveId + '_1']: _rate }}
          }).reduce((k, i) => _.merge(k, i), {})
        }).reduce((k, i) => { return _.merge(k, i) }, {})
        arr.forEach(value => {
          Object.keys(temp).forEach(val => {
            const obj = temp[val]
            const list = Object.keys(obj)
            if (value < _up) {
              obj[list[value]] = subtract(obj[list[value]], obj[list[_up]])
              obj[list[v2 + value]] = subtract(add(obj[list[_up]], obj[v2 + value]), add(obj[list[v2 + _up]], obj[list[value]]))
            } else if (value > _down) {
              obj[list[value]] = subtract(obj[list[_down]], obj[list[value]])
              obj[list[v2 + value]] = subtract(add(obj[list[value]], obj[list[v2 + _down]]), add(obj[list[_down]], obj[list[v2 + value]]))
            } else {
              if (value !== 0) {
                obj[list[value]] = obj[list[value - 1]]
                obj[list[v2 + value]] = add(obj[list[v2 + value]], obj[list[value - 1]])
              }
            }
          })
        })
        return this.slips.map(v => _.assign({ standSlip: v }, temp[v]))
      }
      // 类型为自身曲线
      if (this.type === 3) {
        const temp = this.curves.map(v => {
          return v.list.map(el => {
            const _yield = v.curveId === this.curveId && v.nowOrderFlag ? this.mainCurve[el.standSlip] : el.yesterdayYield
            return { [el.standSlip]: { [v.curveId]: subtract(this.mainCurve[el.standSlip], _yield) }}
          }).reduce((k, i) => _.merge(k, i), {})
        }).reduce((k, i) => { return _.merge(k, i) }, {})
        return this.slips.map(v => _.assign({ standSlip: v }, temp[v]))
      }
      // 类型为自身曲线倒挂
      if (this.type === 4) {
        const temp = this.curves.map(v => {
          return v.list.map(el => {
            const _yield = v.curveId === this.curveId && v.nowOrderFlag ? this.mainCurve[el.standSlip] : el.yesterdayYield
            return { [el.standSlip]: { [v.curveId]: subtract(this.mainCurve[el.standSlip], _yield) }}
          }).reduce((k, i) => _.merge(k, i), {})
        }).reduce((k, i) => { return _.merge(k, i) }, {})
        const _list = Object.keys(temp).sort((m1, m2) => m1 - 0 < m2 - 0 ? -1 : (m1 - 0 > m2 - 0 ? 1 : 0))
        _list.forEach((value, i) => {
          if (i === 0) {
            Object.keys(temp[value]).forEach(key => {
              temp[value][key] = 0
            })
          } else {
            Object.keys(temp[value]).forEach(key => {
              temp[value][key] = subtract(temp[value][key], temp[_list[i - 1]][key])
            })
          }
        })
        return this.slips.map(v => _.assign({ standSlip: v }, temp[v]))
      }
      return {}
    },
    makeColumns() {
      if (this.type === 2) {
        const _columns = this.columns.filter(v => v.label !== '期限').map(v => {
          v.prop = v.prop + '_1'
          return v
        })
        return [...this.columns, ..._columns]
      }
      return this.columns
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
