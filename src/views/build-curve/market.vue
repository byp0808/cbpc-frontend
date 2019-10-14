<template>
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane v-for="curve in curves" :key="curve.id" :label="curve.productName" :name="curve.productName">
      <curve-market
        :curve-id="curve.id"
        :order-id="curve.orderId"
        :curve-order-id="curve.curveOrderId"
      />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import CurveMarket from './components/CurveMarket'

export default {
  name: 'Market',
  components: { CurveMarket },
  data() {
    const temp = [
      { id: '1', orderId: '01', curveOrderId: '01', productName: '曲线A' },
      { id: '2', orderId: '01', curveOrderId: '02', productName: '曲线B' }
    ]
    const curves = localStorage.getItem('ids') || temp
    return {
      activeName: curves[0].productName,
      curves
    }
  },
  mounted() {
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style scoped>

</style>
