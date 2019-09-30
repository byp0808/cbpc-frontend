<template>
  <div class="app-container">
    <el-col :span="2" style="width: 80px;">
      <el-tabs tab-position="left" style="height: 200px;" @tab-click="orderTabClick">
        <el-tab-pane v-for="(item) in orderList" :key="item.id" :label="item.orderName" />
      </el-tabs>
    </el-col>
    <el-col :span="20" style="margin: 20px 0;">
      <curveTimeCompute
        ref="refcurveTimeCompute"
        :order-id="selectOrder.id"
        :order-nfo="selectOrder"
      />
    </el-col>
  </div>
</template>
<script>
import { getOrderList } from '@/api/curve/curve-time-order.js'
import curveTimeCompute from '@/views/curve/compute/curve-time-compute.vue'

export default {
  components: {
    curveTimeCompute
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
    // 加载批次
    this.orderList = getOrderList()

    if (this.orderList && this.orderList.length > 0) {
      // 默认显示第一条
      this.selectOrder = this.orderList[0]
    }
  },
  methods: {
    orderTabClick(tab, event) {
      console.info('orderTabClick.tab:' + tab + ',tab.index:' + tab.index)
      this.selectOrder = this.orderList[tab.index]
      this.selectOrderId = this.selectOrder.id

      this.$refs.refcurveTimeCompute.query()
    }
  }
}
</script>
<style>
.el-tabs__content {
  display: none;
}
</style>
