<template>
  <div>
    <div class="curve-sub-content">
      <curve-build-table :list="initList" :name="productName" />
    </div>
    <div class="curve-sub-footer">
      <el-button type="primary" @click="changeInitData">应用</el-button>
      <el-button @click="closeSidebar">取消</el-button>
    </div>
  </div>
</template>

<script>
import CurveBuildTable from '@/views/build-curve/components/CurveBuildTable'
import { queryInitCurveYield } from '@/api/curve/curve-build'

export default {
  components: { CurveBuildTable },
  props: {
    curveId: {
      type: String,
      default: ''
    },
    productName: {
      type: String,
      default: ''
    },
    orderId: {
      type: String,
      default: ''
    },
    curveOrderId: {
      type: String,
      default: ''
    },
    curveTaskId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      initList: []
    }
  },
  mounted() {
    this.getInitialCurve()
  },
  methods: {
    getInitialCurve() {
      queryInitCurveYield({ curveId: this.curveId, orderId: this.orderId, curveOrderId: this.curveOrderId }).then(response => {
        this.initList = response
      })
    },
    changeInitData() {
      const _ = this.$lodash
      const list = this.initList.map(value => _.omit(value, ['lastYield', 'adjRange', 'adjResult', 'variations']))
      this.$store.dispatch('curveBuild/updateInitData', { list: list, curveId: this.curveId })
    },
    closeSidebar() {
      this.$emit('close-sidebar')
    }
  }
}
</script>

<style scoped>
.curve-sub-content {
  padding: 5px;
}
.curve-sub-footer {
  height: 50px;
  line-height: 50px;
  position: relative;
  width: 100%;
  text-align: right;
  padding-right: 20px;
  transition: 600ms ease position;
}
</style>
