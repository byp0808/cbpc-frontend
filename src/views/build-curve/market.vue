<template>
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane v-for="curve in curves" :key="curve.id" :label="curve.curveName" :name="curve.curveName">
      <curve-market
        :curve-id="curve.curveId"
        :order-id="curve.orderId"
        :quote-table-header="quoteTableHeader"
        :sale-table-header="saleTableHeader"
        :curve-order-id="curve.id"
      />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import CurveMarket from '@/views/build-curve/components/CurveMarket'
import { queryDefaultCols } from '@/api/market/market'

export default {
  name: 'Market',
  components: { CurveMarket },
  data() {
    const curves = JSON.parse(localStorage.getItem('ids'))
    return {
      activeName: curves[0].curveName,
      quoteTableHeader: [],
      saleTableHeader: [],
      curves
    }
  },
  created() {
    this.getTableCols()
  },
  beforeDestroy() {
    localStorage.removeItem('ids')
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    getTableCols() {
      queryDefaultCols({ dataMarket: '02', showArea: '01' }).then(response => {
        this.quoteTableHeader = response.showCols
      })
      queryDefaultCols({ dataMarket: '02', showArea: '02' }).then(response => {
        this.saleTableHeader = response.showCols
      })
    }
  }
}
</script>

<style scoped>

</style>
