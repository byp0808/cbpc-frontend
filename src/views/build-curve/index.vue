<template>
  <div class="x-scroll">
    <div v-for="curve in curves" :key="curve.id">
      <curve-build
        :curve-id="curve.curveId"
        :product-name="curve.curveName"
        :order-id="curve.orderId"
        :curve-order-id="curve.curveOrderId"
        :curve-task-id="curve.id"
      />
    </div>
    <float-curve v-if="true" ref="initCurveList" :mini-icon="'el-icon-info'">
      <div v-for="curve in curves" :key="curve.id">
        <init-curve
          :curve-id="curve.curveId"
          :product-name="curve.curveName"
          :order-id="curve.orderId"
          :curve-order-id="curve.curveOrderId"
          :curve-task-id="curve.id"
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
    const curves = JSON.parse(localStorage.getItem('ids'))
    console.log(curves)
    return {
      curves
    }
  },
  beforeDestroy() {
    localStorage.removeItem('ids')
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
