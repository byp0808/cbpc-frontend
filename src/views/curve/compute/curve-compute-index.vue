<template>
  <div class="app-container">
    <el-col :span="5" class="compute-tab">
      <el-tabs tab-position="left" style="height: 100%;" @tab-click="orderTabClick">
        <el-tab-pane v-for="(item) in orderList" :key="item.id" :label="item.orderName" :title="item.orderName" />
      </el-tabs>
    </el-col>
    <el-col :span="19" style="margin: 20px 0;">
      <CurveOrderCompute
        ref="refCurveOrderCompute"
        :order-id="selectOrder.id"
        :order-info="selectOrder"
      />
    </el-col>
  </div>
</template>
<script>
import CurveOrderCompute from '@/views/curve/compute/curve-order-compute.vue'
import { getCurveTaskOrderOptions } from '@/api/curve/curve-order-compute.js'
export default {
  components: {
    CurveOrderCompute
  },
  data() {
    return {
      selectOrder: {}, // 当前选择的批次
      selectOrderId: '', // 当前选择的批次ID
      orderList: [] // 批次列表
    }
  },
  computed: {

  },
  beforeMount() {
    console.info('===beforeMount===')
    this.init()
  },
  methods: {
    async init() {
      // 加载批次
      this.orderList = []
      await getCurveTaskOrderOptions(this.orderList)
      if (this.orderList && this.orderList.length > 0) {
        // 默认显示第一条
        this.selectOrder = this.orderList[0]
        this.$nextTick(() => {
          this.$refs.refCurveOrderCompute.query()
        })
      }
    },
    orderTabClick(tab, event) {
      console.info('orderTabClick.tab:' + tab + ',tab.index:' + tab.index)
      this.selectOrder = this.orderList[tab.index]
      this.selectOrderId = this.selectOrder.id

      this.$nextTick(() => {
        this.$refs.refCurveOrderCompute.query()
      })
    }
  }
}
</script>
<style scoped>
.compute-tab .el-tabs__content {
  display: none;
}
.compute-tab .el-tabs--left .el-tabs__header.is-left{
  width: 100%;
}
</style>
