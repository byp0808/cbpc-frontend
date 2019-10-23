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
    <float-curve v-if="true" ref="initCurveList" :mini-icon="'el-icon-info'">
      <div v-for="curve in curves" :key="curve.id">
        <init-curve
          :curve-id="curve.id"
          :product-name="curve.productName"
          :order-id="curve.orderId"
          :curve-order-id="curve.curveOrderId"
          :curve-task-id="curve.curveTaskId"
          @close-sidebar="closeSidebar"
        />
      </div>
    </float-curve>
  </div>
</template>

<script>
import CurveBuild from '@/views/build-curve/components/CurveBuild'
import FloatCurve from '@/views/build-curve/components/FloatCurve'
import InitCurve from '@/views/build-curve/components/InitCurve'

export default {
  name: 'BuildCurve',
  components: { CurveBuild, FloatCurve, InitCurve },
  data() {
    const temp = [
      { id: 'CURVE_ID_01', orderId: 'ORDER_ID_1', curveOrderId: 'CURVE_ID_01-ORDER_ID_1', productName: '曲线产品1', curveTaskId: '2019101200001' }
    ]
    const curves = localStorage.getItem('ids') || temp
    return {
      curves
    }
  },
  methods: {
    closeSidebar() {
      this.$refs.initCurveList.closeBy()
    }
  }
}
</script>

<style scoped>
.x-scroll {
  overflow-x: scroll;
}
</style>
