<template>
  <div class="app-container" style="margin: 0;padding-left:0;padding-right:0">
    <el-row
      v-for="(item) in productOrderListLocal"
      :key="item.curveOrderId"
    >
      <el-row class="prd-order-top">
        <el-col :span="4" class="prd-order-name">
          {{ getOrderName(item.orderId) }}
        </el-col>
        <el-col v-if="item.curveSampleNumberVisible" :span="6" class="prd-order-name-sample">
          <span>曲线样本券数量: {{ item.curveSampleNumber }}</span>
<!--          <span>编制曲线编码: {{ item.curvePrdCode }}</span>-->
        </el-col>
      </el-row>
      <el-button type="primary" size="mini" round :disabled="disabled" @click="showCurveInfo(item)">查看曲线性质</el-button>
    </el-row>
  </div>
</template>

<script>

import { getOrderList, getProductOrderList } from '@/api/curve/curve-product-order.js'

export default {
  name: 'CurveProductDefConfirm',
  components: {
  },
  props: ['productId', 'disabled'],
  data() {
    return {
      productIdLocal: '',
      lockScroll: true,
      productOrderList: [], // 当前产品设置批次列表
      productOrderListLocal: [], // 当前产品设置批次列表
      orderList: [], // 批次模板列表
      temp: ''
    }
  },
  computed: {
  },
  beforeMount() {
    this.productIdLocal = this.productId
    // this.productIdLocal = '4028b8816d18e4c2016d1915bdc70004'
    console.info('curve-product-def-confirm.productId:' + this.productIdLocal)
    // 初始化
    this.init()
  },
  methods: {
    getOrderName(id) {
      var list = this.orderList
      var label = id
      for (const index in list) {
        const item = list[index]
        if (id === item.id) {
          return item.orderName
        }
      }
      return label
    },
    async init() {
      // 加载批次
      // 加载批次
      this.orderList = []
      var dataList = []
      await getOrderList({ 'basePrd': '02' }).then(response => {
        dataList = response
      })
      if (dataList && dataList.length > 0) {
        for (var i = 0; i < dataList.length; i++) {
          var item = dataList[i]
          this.orderList.push({ id: item.orderNo, orderName: item.orderName, compTime: item.compTime, pubTime: item.pubTime })
        }
      }

      // 查询产品已经关联批次
      await getProductOrderList({ curveId: this.productIdLocal }).then(response => {
        this.productOrderList = response

        if (this.productOrderList && this.productOrderList.length > 0) {
          for (let i = 0; i < this.productOrderList.length; i++) {
            var item = this.productOrderList[i]
            this.productOrderListLocal.push({
              index: i,
              orderId: item.orderId,
              curveId: item.curveId,
              curveOrderId: item.curveOrderId,
              curveSampleNumberVisible: false,
              curveSampleNumber: ''
            })
          }
        }
      })
    },
    // 显示曲线性质
    showCurveInfo(item) {
      const curveId = item.curveId
      const curveOrderId = item.curveOrderId
      console.info(curveId, curveOrderId)

      debugger
      item.curveSampleNumberVisible = true
      item.curveSampleNumber = 123
    }
  }
}
</script>

<style scoped>
.prd-order-item{

}
.prd-order-name, .prd-order-name-sample{
  float: left;
  line-height: 40px;
}
</style>
