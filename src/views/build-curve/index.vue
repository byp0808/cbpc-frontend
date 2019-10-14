<template>
  <div class="x-scroll">
    <div v-for="curve in curves" :key="curve.id">
      <curve-build
        :curve-id="curve.id"
        :product-name="curve.productName"
        :order-id="curve.orderId"
        :curve-order-id="curve.curveOrderId"
        :curve-task-id="curve.curveTaskId"
      />
    </div>
  </div>
</template>

<script>
import CurveBuild from './components/CurveBuild'
export default {
  name: 'BuildCurve',
  components: { CurveBuild },
  data() {
    const temp = [
      { id: 'CURVE_ID_01', orderId: 'ORDER_ID_1', curveOrderId: 'CURVE_ID_01-ORDER_ID_1', productName: '曲线产品1', curveTaskId: '2019101200001' }
    ]
    const curves = localStorage.getItem('ids') || temp
    return {
      curves
    }
  }
}
</script>

<style scoped>
.x-scroll {
  overflow-x: scroll;
}
</style>
